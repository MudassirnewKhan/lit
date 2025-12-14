'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import React from 'react';
import WelcomeEmail from '@/components/emails/WelcomeEmail'; 

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper: Get Role ('admin', 'subadmin', or null)
async function getMyRole() {
  const session = await getServerSession(authOptions);
  const roles = session?.user?.roles || [];
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('subadmin')) return 'subadmin';
  throw new Error('Unauthorized');
}

// ----------------------------------------------------------------------
// 1. Create User
// ----------------------------------------------------------------------
export async function createUser(formData: FormData) {
  try {
    const myRole = await getMyRole();

    // Extract Data
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const roleToAssign = formData.get('role') as string; 
    const batchYear = formData.get('batchYear') as string; 

    // Basic Validation
    if (!email || !password || !roleToAssign) return { error: 'Missing required fields.' };

    // --- RULE 1: Sub-admins cannot create Staff ---
    if (myRole === 'subadmin') {
      if (roleToAssign === 'admin' || roleToAssign === 'subadmin') {
        return { error: "Access Denied: You cannot create Admin or Sub-admin accounts." };
      }
    }

    // --- RULE 2: Students must have a Batch Year ---
    if (roleToAssign === 'awardee' && !batchYear) {
      return { error: "Batch Year is required when creating a Student account." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction
    await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) throw new Error('User already exists.');

      // 1. Create User
      const newUser = await tx.user.create({
        data: { 
          email, 
          firstName, 
          lastName, 
          passwordHash: hashedPassword,
          // Save batchYear to the User model
          batchYear: roleToAssign === 'awardee' ? batchYear : null 
        },
      });

      // 2. Assign Role
      await tx.userRoleAssignment.create({
        data: { userId: newUser.id, role: roleToAssign as any },
      });

      // -------------------------------------------------------
      // ❌ REMOVED: Auto-Sync to Alumni History Table
      // We deleted the 'tx.alumni.create' block here.
      // -------------------------------------------------------
    });

    // Send Email
    await resend.emails.send({
      from: 'LIT Portal Admin <onboarding@resend.dev>',
      to: email,
      subject: `Your LIT Account Created`,
      react: <WelcomeEmail applicantName={firstName} applicantEmail={email} tempPassword={password} />,
    });

    revalidatePath('/admin/users');
    return { success: true, message: 'User created successfully.' };

  } catch (error: any) {
    console.error("Create User Error:", error);
    return { error: error.message || 'Failed.' };
  }
}

// ----------------------------------------------------------------------
// 2. Delete User
// ----------------------------------------------------------------------
export async function deleteUser(targetUserId: string) {
  try {
    const myRole = await getMyRole();
    const session = await getServerSession(authOptions);

    if (targetUserId === session?.user.id) return { error: "Cannot delete yourself." };

    // Fetch Target to check THEIR role
    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        include: { roles: true }
    });
    if (!targetUser) return { error: 'User not found' };

    const isTargetStaff = targetUser.roles.some(r => ['admin', 'subadmin'].includes(r.role));

    // --- RULE 2: Sub-admins cannot delete other Staff ---
    if (myRole === 'subadmin' && isTargetStaff) {
       return { error: "Access Denied: You cannot delete Admins or Sub-admins." };
    }

    await prisma.user.delete({ where: { id: targetUserId } });
    
    revalidatePath('/admin/users');
    return { success: true, message: 'User account deleted.' };
  } catch (error) {
    return { error: 'Failed to delete user.' };
  }
}

// ----------------------------------------------------------------------
// 3. Reset Password
// ----------------------------------------------------------------------
export async function resetUserPassword(formData: FormData) {
  try {
    const myRole = await getMyRole();
    const userId = formData.get('userId') as string;
    const newPassword = formData.get('newPassword') as string;

    const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { roles: true }
    });

    const isTargetStaff = targetUser?.roles.some(r => ['admin', 'subadmin'].includes(r.role));

    // --- RULE 3: Sub-admins cannot change Staff passwords ---
    if (myRole === 'subadmin' && isTargetStaff) {
        return { error: "Access Denied: Cannot reset Admin/Sub-admin passwords." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword }
    });

    revalidatePath('/admin/users');
    return { success: true, message: 'Password updated.' };
  } catch (error) {
    return { error: 'Failed to reset password.' };
  }
}