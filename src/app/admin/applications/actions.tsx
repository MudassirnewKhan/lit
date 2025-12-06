'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt'; 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import React from 'react'; 
import { Resend } from 'resend';
import { render } from '@react-email/render'; // <--- 1. Add this import
import WelcomeEmail from '@/components/emails/WelcomeEmail';

// Initialize Resend
const apiKey = process.env.RESEND_API_KEY || 're_missing_key';
const resend = new Resend(apiKey);

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

    // 1. Generate a temp password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    let isNewUser = false;

    // 2. Transaction: Update App + Handle User
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
        
        const hasRole = await tx.userRoleAssignment.findFirst({
            where: { userId: userId, role: 'awardee' }
        });

        if (!hasRole) {
            await tx.userRoleAssignment.create({ 
                data: { userId, role: 'awardee' } 
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
          },
        });
        userId = newUser.id;

        await tx.userRoleAssignment.create({ 
          data: { userId, role: 'awardee' } 
        });
      }
    });

    // 3. Send the welcome email
    const passwordEmailText = isNewUser 
        ? tempPassword 
        : "(Use your existing password)";

    // --- FIX: Manually render the email to HTML ---
    // This bypasses the 'render2 is not a function' error in the SDK
    const emailHtml = await render(
      <WelcomeEmail
        applicantName={application.fullName}
        applicantEmail={application.email}
        tempPassword={passwordEmailText}
      />
    );

    await resend.emails.send({
      from: 'LIT Portal Admin <onboarding@resend.dev>', // Update to your domain
      to: application.email,
      subject: 'Your LIT Scholarship Application has been Approved!',
      html: emailHtml, // <--- Use 'html' property instead of 'react'
    });

    revalidatePath('/admin/applications');
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