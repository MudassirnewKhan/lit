'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next'; 
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcrypt';

export async function updateProfile(formData: FormData) {
  console.log("--- Profile Update Started ---");
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const bio = formData.get('bio') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  
  // We use 'newPassword' to avoid browser autofill conflicts
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  console.log("Updating User:", session.user.email);

  if (!firstName || !lastName) {
    return { error: 'First and last name are required.' };
  }

  // Prepare the update object
  const updateData: any = {
    firstName,
    lastName,
    bio,
    phoneNumber,
  };

  // Password Update Logic
  // Check if the user actually typed something into the new password box
  if (newPassword && newPassword.trim() !== '') {
    console.log(">> Password change requested. Processing...");
    
    if (newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }
    if (newPassword !== confirmPassword) {
      return { error: 'Passwords do not match.' };
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    updateData.passwordHash = hashedPassword;
    
    console.log(">> Password hashed successfully.");
  } else {
    console.log(">> No password change requested (field was empty).");
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    console.log(">> Database update complete.");

    revalidatePath('/profile');
    return { success: true, message: 'Profile updated successfully.' };

  } catch (error) {
    console.error('Profile Update Error:', error);
    return { error: 'Failed to update profile.' };
  }
}