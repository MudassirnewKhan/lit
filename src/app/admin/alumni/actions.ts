'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function createAlumniEntry(formData: FormData) {
  // 1. Security Check
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles.some(r => ['admin', 'subadmin'].includes(r))) {
    return { error: "Unauthorized" };
  }

  // 2. Extract Data
  const category = formData.get('category') as string; // 'AWARDEE' | 'SUCCESS_STORY' | 'TESTIMONIAL'
  const fullName = formData.get('fullName') as string;
  const batchYear = formData.get('batchYear') as string;
  
  // Optional fields
  const institution = formData.get('institution') as string || null;
  const achievement = formData.get('achievement') as string || null;
  const quote = formData.get('quote') as string || null;
  const photoUrl = formData.get('photoUrl') as string || null;

  try {
    // 3. Save to Database
    await prisma.alumni.create({
      data: {
        category,
        fullName,
        batchYear,
        institution,
        achievement,
        quote,
        photoUrl
      }
    });

    // 4. Update the cache so the public page changes instantly
    revalidatePath('/alumni'); 
    return { success: true, message: "Entry added successfully!" };
    
  } catch (error) {
    console.error(error);
    return { error: "Failed to create entry." };
  }
}

export async function deleteAlumniEntry(id: string) {
    // Add security check here too
    try {
        await prisma.alumni.delete({ where: { id } });
        revalidatePath('/alumni');
        return { success: true };
    } catch (e) {
        return { error: "Failed to delete" };
    }
}