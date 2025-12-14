'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt'; 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import React from 'react'; 
import { render } from '@react-email/render'; 
import WelcomeEmail from '@/components/emails/WelcomeEmail';
import nodemailer from 'nodemailer'; 

// 1. Configure Gmail Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS, 
  },
});

// Helper to verify admin status
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes('admin')) {
    throw new Error('Unauthorized');
  }
}

export async function approveApplication(applicationId: string) {
  try {
    await verifyAdmin();

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application || application.status !== 'pending') {
      throw new Error('Application not found or already processed.');
    }

    // Generate a temp password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    let isNewUser = false;

    // Transaction: Update App + Handle User + SYNC HISTORY
    await prisma.$transaction(async (tx) => {
      // a. Update application status
      await tx.application.update({ 
        where: { id: applicationId }, 
        data: { status: 'approved' } 
      });

      // b. Check if user already exists
      const existingUser = await tx.user.findUnique({
        where: { email: application.email }
      });

      let userId = '';

      if (existingUser) {
        // --- EXISTING USER LOGIC ---
        userId = existingUser.id;
        
        // Ensure they have the awardee role
        const hasRole = await tx.userRoleAssignment.findFirst({
            where: { userId: userId, role: 'awardee' }
        });

        if (!hasRole) {
            await tx.userRoleAssignment.create({ 
                data: { userId, role: 'awardee' } 
            });
        }

        // If batchYear was missing on user, update it from application
        if (!existingUser.batchYear && application.batchYear) {
             await tx.user.update({
                 where: { id: userId },
                 data: { batchYear: application.batchYear }
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
            batchYear: application.batchYear, // Use the year from the application
          },
        });
        userId = newUser.id;

        await tx.userRoleAssignment.create({ 
          data: { userId, role: 'awardee' } 
        });
      }

      // ---------------------------------------------------------
      // c. NEW STEP: Auto-create (or ensure) the History Entry
      // ---------------------------------------------------------
      // Check if history already exists to prevent duplicates (e.g. if re-approving or data glitch)
      const existingAlumni = await tx.alumni.findFirst({
          where: { userId: userId }
      });

      if (!existingAlumni) {
          await tx.alumni.create({
              data: {
                  userId: userId,
                  fullName: application.fullName,
                  batchYear: application.batchYear,
                  category: 'AWARDEE',
                  institution: application.universityId, // Save university info if available
              }
          });
      }
      // ---------------------------------------------------------

    });

    // 2. Prepare the Email Content
    const passwordEmailText = isNewUser 
        ? tempPassword 
        : "(Use your existing password)";

    // Render the React component
    const emailHtml = await render(
      <WelcomeEmail
        applicantName={application.fullName}
        applicantEmail={application.email}
        tempPassword={passwordEmailText}
      />
    );

    // 3. Send Email
    await transporter.sendMail({
      from: `"LIT Scholarship Admin" <${process.env.GMAIL_USER}>`, 
      to: application.email,
      subject: '🎉 Your LIT Scholarship Application has been Approved!',
      html: emailHtml, 
    });

    revalidatePath('/admin/applications');
    revalidatePath('/alumni'); // <--- Update public list immediately
    return { success: true, message: `Application for ${application.fullName} approved.` };

  } catch (error: any) {
    console.error("Failed to approve application:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function rejectApplication(applicationId: string) {
  try {
    await verifyAdmin();
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'rejected' },
    });
    
    revalidatePath('/admin/applications');
    return { success: true, message: `Application for ${application.fullName} rejected.` };
  } catch (error: any) {
    console.error("Failed to reject application:", error);
    return { success: false, error: (error as Error).message };
  }
}