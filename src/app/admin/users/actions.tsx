'use server';

import { prisma } from '@/lib/prisma';
import { requireStaff } from '@/lib/authz';
import { validateNewPassword } from '@/lib/security';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';
import { renderWelcomeEmailHtml } from '@/components/emails/WelcomeEmail'; 
import { getGmailTransporter } from '@/lib/email';

// Helper: who is calling? (checks the DATABASE, throws 'Unauthorized' if not staff)
async function getMyRole() {
  const { role } = await requireStaff();
  return role;
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
    const department = (formData.get('department') as string) || null;

    // Basic Validation
    if (!email || !password || !roleToAssign) return { error: 'Missing required fields.' };

    const passwordProblem = validateNewPassword(password);
    if (passwordProblem) return { error: passwordProblem };

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
          mustChangePassword: true, // admin-chosen password: user must replace it at first login
          // Save batchYear and department to the User model
          batchYear: roleToAssign === 'awardee' ? batchYear : null,
          department: department ? department.trim() : null,
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

    // Send Email (the user already exists at this point, so an email failure is a warning, not a failure)
    revalidatePath('/admin/users');
    let emailSent = true;
    let emailErrorDetail = '';
    try {
      const emailHtml = renderWelcomeEmailHtml({
        applicantName: `${firstName} ${lastName}`.trim(),
        applicantEmail: email,
        tempPassword: password,
        role: roleToAssign,
      });

      const { transporter, senderEmail } = getGmailTransporter();

      await transporter.sendMail({
        from: `"LIT Scholarship Admin" <${senderEmail}>`,
        to: email,
        subject: `Welcome to the LIT Portal - Your Account Details`,
        html: emailHtml,
      });
    } catch (emailError: unknown) {
      emailSent = false;
      emailErrorDetail = emailError instanceof Error ? emailError.message : String(emailError);
      console.error('Welcome email failed:', emailError);
    }

    if (!emailSent) {
      return { 
        success: true, 
        message: `User created, but the welcome email could not be sent (${emailErrorDetail}). Share the password with them directly.` 
      };
    }

    return { success: true, message: 'User created and welcome email sent successfully.' };

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
    const { userId: myUserId, role: myRole } = await requireStaff();

    if (targetUserId === myUserId) return { error: "Cannot delete yourself." };

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

    const passwordProblem = validateNewPassword(newPassword || '');
    if (passwordProblem) return { error: passwordProblem };

    const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { roles: true }
    });
    if (!targetUser) return { error: 'User not found.' };

    const isTargetStaff = targetUser.roles.some(r => ['admin', 'subadmin'].includes(r.role));

    // --- RULE 3: Sub-admins cannot change Staff passwords ---
    if (myRole === 'subadmin' && isTargetStaff) {
        return { error: "Access Denied: Cannot reset Admin/Sub-admin passwords." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
        mustChangePassword: true, // they must pick their own password after this reset
        failedLoginCount: 0,      // a reset also unlocks a locked account
        lockedUntil: null,
      }
    });

    revalidatePath('/admin/users');
    return { success: true, message: 'Password updated.' };
  } catch (error) {
    return { error: 'Failed to reset password.' };
  }
}