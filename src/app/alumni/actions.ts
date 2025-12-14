'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// --- SECURITY CHECK ---
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  const roles = session?.user?.roles || [];
  if (!roles.includes('admin') && !roles.includes('subadmin')) {
    throw new Error('Unauthorized');
  }
}

// ==========================================================
//  PART A: ALUMNI HISTORY (The Main List)
// ==========================================================

export async function addAlumni(formData: FormData) {
  await checkAdmin();
  await prisma.alumni.create({
    data: {
      fullName: formData.get('fullName') as string,
      batchYear: formData.get('batchYear') as string,
      category: 'AWARDEE', // Always default to AWARDEE for this list
    }
  });
  revalidatePath('/alumni');
  return { success: true };
}

export async function updateAlumni(id: string, data: { fullName: string; batchYear: string }) {
  await checkAdmin();
  await prisma.alumni.update({
    where: { id },
    data: { fullName: data.fullName, batchYear: data.batchYear }
  });
  revalidatePath('/alumni');
  return { success: true };
}

export async function deleteAlumni(id: string) {
  await checkAdmin();
  await prisma.alumni.delete({ where: { id } });
  revalidatePath('/alumni');
  return { success: true };
}

// ==========================================================
//  PART B: SUCCESS STORIES (The Detailed Profile)
// ==========================================================

export async function addSuccessStory(formData: FormData) {
  await checkAdmin();
  await prisma.successStory.create({
    data: {
      fullName: formData.get('fullName') as string,
      achievement: formData.get('achievement') as string,
      batchYear: formData.get('batchYear') as string,
      email: (formData.get('email') as string) || null,
      phoneNumber: (formData.get('phoneNumber') as string) || null,
      linkedIn: (formData.get('linkedIn') as string) || null,
      image: (formData.get('image') as string) || null,
    }
  });
  revalidatePath('/alumni');
  return { success: true };
}

export async function updateSuccessStory(id: string, formData: FormData) {
  await checkAdmin();
  await prisma.successStory.update({
    where: { id },
    data: {
      fullName: formData.get('fullName') as string,
      achievement: formData.get('achievement') as string,
      batchYear: formData.get('batchYear') as string,
      email: (formData.get('email') as string) || null,
      phoneNumber: (formData.get('phoneNumber') as string) || null,
      linkedIn: (formData.get('linkedIn') as string) || null,
      image: (formData.get('image') as string) || null,
    }
  });
  revalidatePath('/alumni');
  return { success: true };
}

export async function deleteSuccessStory(id: string) {
  await checkAdmin();
  await prisma.successStory.delete({ where: { id } });
  revalidatePath('/alumni');
  return { success: true };
}