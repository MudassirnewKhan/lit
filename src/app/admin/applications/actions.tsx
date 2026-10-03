'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt'; 
import { requireStaff } from '@/lib/authz';
import { generateTempPassword } from '@/lib/security';
import React from 'react'; 
import { render } from '@react-email/render'; 
import WelcomeEmail from '@/components/emails/WelcomeEmail';
import nodemailer from 'nodemailer';

// 1. Configure Gmail Transporter
// (needs GMAIL_USER and GMAIL_PASS to be set in Vercel -> Environment Variables)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your email
    pass: process.env.GMAIL_PASS, // Your App Password
  },
});

// WHO CAN REVIEW APPLICATIONS?
// Decision: admin AND subadmin (the sidebar already shows "Applications" to both).
// To make it owner-only, change this to requireStaff(['admin']).
const REVIEWERS = ['admin', 'subadmin'] as const;

export async function approveApplication(applicationId: string) {
  try {
    await requireStaff([...REVIEWERS]);

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application || application.status !== 'pending') {
      throw new Error('Application not found or already processed.');
    }

    // Cryptographically secure temporary password (was Math.random)
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    let isNewUser = false;

    // Transaction: Update App + Handle User
    await prisma.$transaction(async (tx) => {
      // a. Claim the application ATOMICALLY. The WHERE status='pending' means that if two
      //    admins click at the same moment, only one update matches (count === 1).
      const claimed = await tx.application.updateMany({ 
        where: { id: applicationId, status: 'pending' }, 
        data: { status: 'approved' } 
      });
      if (claimed.count === 0) {
        throw new Error('Application not found or already processed.');
      }

      // b. Check if user already exists
      const existingUser = await tx.user.findUnique({
        where: { email: application.email }
      });

      if (existingUser) {
        // --- EXISTING USER LOGIC ---
        const hasRole = await tx.userRoleAssignment.findFirst({
            where: { userId: existingUser.id, role: 'awardee' }
        });

        if (!hasRole) {
            await tx.userRoleAssignment.create({ 
                data: { userId: existingUser.id, role: 'awardee' } 
            });
        }
      } else {
        // --- NEW USER LOGIC ---
        isNewUser = true;
        
        const newUser = await tx.user.create({
          data: {
            email: application.email,
            firstName: application.fullName.split(' ')[0],
            lastName: application.fullName.split(' ').slice(1).join(' '),
            passwordHash: hashedPassword,
            mustChangePassword: true, // they must choose their own password at first login
            batchYear: application.batchYear, // was hardcoded to "2025"
          },
        });

        await tx.userRoleAssignment.create({ 
          data: { userId: newUser.id, role: 'awardee' } 
        });
      }
    });

    // The database part is DONE and committed. Email is a separate step: if it fails we
    // must NOT report the whole approval as failed.
    let emailSent = true;
    try {
      const passwordEmailText = isNewUser 
          ? tempPassword 
          : "(Use your existing password)";

      const emailHtml = await render(
        <WelcomeEmail
          applicantName={application.fullName}
          applicantEmail={application.email}
          tempPassword={passwordEmailText}
        />
      );

      await transporter.sendMail({
        from: `"LIT Scholarship Admin" <${process.env.GMAIL_USER}>`,
        to: application.email,
        subject: '🎉 Your LIT Scholarship Application has been Approved!',
        html: emailHtml,
      });
    } catch (emailError) {
      emailSent = false;
      console.error("Approval email failed:", emailError);
    }

    revalidatePath('/admin/applications');

    if (!emailSent) {
      return {
        success: true,
        emailSent: false,
        message: isNewUser
          ? `${application.fullName} was approved, but the email could not be sent. Go to Manage Users and use "Reset Password" to give them new login details.`
          : `${application.fullName} was approved, but the notification email could not be sent.`,
      };
    }

    return { success: true, emailSent: true, message: `Application for ${application.fullName} approved.` };

  } catch (error: unknown) {
    console.error("Failed to approve application:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to approve application.' };
  }
}

export async function rejectApplication(applicationId: string) {
  try {
    await requireStaff([...REVIEWERS]);

    const application = await prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) throw new Error('Application not found.');

    // Same atomic guard as approve: only reject if it is still pending.
    const result = await prisma.application.updateMany({
      where: { id: applicationId, status: 'pending' },
      data: { status: 'rejected' },
    });
    if (result.count === 0) throw new Error('Application already processed.');
    
    // Optional: Send Rejection Email here if you want
    
    revalidatePath('/admin/applications');
    return { success: true, message: `Application for ${application.fullName} rejected.` };
  } catch (error: unknown) {
    console.error("Failed to reject application:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reject application.' };
  }
}
