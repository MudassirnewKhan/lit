'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Zod Schema
const ApplicationSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid university email." }),
  universityId: z.string().min(5, { message: "Please enter a valid university ID." }),
  // NEW VALIDATION
  batchYear: z.string().min(4, { message: "Please select your graduation batch." }),
  major: z.string().min(2, { message: "Please enter your major." }),
  gpa: z.string().regex(/^[0-4](\.\d{1,2})?$/, { message: "Please enter a valid GPA (e.g., 3.8)." }),
  essay: z.string().min(50, { message: "Your essay must be at least 50 words." }).max(5000),
});

// 2. Server Action
export async function submitApplication(formData: unknown) {
  const validatedFields = ApplicationSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const data = validatedFields.data;
    
    // Check if email already exists to prevent duplicates (Optional but recommended)
    const existing = await prisma.application.findUnique({
      where: { email: data.email }
    });
    if (existing) {
      return { success: false, message: 'An application with this email already exists.' };
    }

    await prisma.application.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        universityId: data.universityId,
        // SAVE BATCH YEAR
        batchYear: data.batchYear, 
        essay: data.essay,
        // Note: 'major' and 'gpa' are validated but not saved because 
        // they aren't in your Schema.prisma Application model.
        // If you want to save them, add them to schema.prisma first!
      },
    });

    revalidatePath('/admin/applications');

    return { success: true, message: 'Application submitted successfully!' };

  } catch (error) {
    console.error("Database submission failed:", error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}