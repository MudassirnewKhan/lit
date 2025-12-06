'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the shape of the User we expect from session
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles: string[];
  batchYear?: string | null;
}

// ---------------------------------------------------------
// 1. Create Meeting (Fixed for FormData)
// ---------------------------------------------------------
export async function createMeeting(formData: FormData) {
  try {
    const user = (await getCurrentUser()) as unknown as SessionUser;

    if (!user) return { error: 'Unauthorized: No session found' };

    // Check Permissions
    const allowedRoles = ['admin', 'subadmin', 'mentor', 'sponsor'];
    const hasPermission = user.roles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      return { error: 'Unauthorized: Insufficient permissions' };
    }

    // Extract Data from FormData
    const title = formData.get('title') as string;
    const link = formData.get('link') as string;
    const dateString = formData.get('date') as string;
    const targetBatch = formData.get('targetBatch') as string;

    // Validate
    if (!title || !link || !dateString) {
      return { error: "Missing required fields (Title, Link, or Date)." };
    }

    // Convert string date to Date object
    const scheduledAt = new Date(dateString);

    await prisma.meeting.create({
      data: {
        title,
        scheduledAt,
        link,
        mentorId: user.id,
        // Only save targetBatch if it's not empty/null
        targetBatch: targetBatch && targetBatch !== "all" ? targetBatch : null,
      },
    });

    revalidatePath('/mentorship');
    return { success: true, message: 'Meeting scheduled successfully!' };
  } catch (error) {
    console.error("Create Meeting Error:", error);
    return { error: 'Failed to create meeting.' };
  }
}

// ---------------------------------------------------------
// 2. Get Meetings (Unchanged)
// ---------------------------------------------------------
export async function getMeetings() {
  const user = (await getCurrentUser()) as unknown as SessionUser;
  
  if (!user) return [];

  const isPrivileged = user.roles.some((role) => 
    ["admin", "subadmin", "mentor", "sponsor"].includes(role)
  );

  const mentorInclude = {
    mentor: { 
      select: { 
        firstName: true, 
        lastName: true, 
        email: true 
      } 
    }
  };

  if (isPrivileged) {
    return await prisma.meeting.findMany({
      orderBy: { scheduledAt: 'asc' },
      include: mentorInclude
    });
  }

  // Student Logic: Filter by Batch
  return await prisma.meeting.findMany({
    where: {
      OR: [
        { targetBatch: null },             
        { targetBatch: user.batchYear }    
      ]
    },
    orderBy: { scheduledAt: 'asc' },
    include: mentorInclude
  });
}

// ---------------------------------------------------------
// 3. Delete Meeting (Unchanged)
// ---------------------------------------------------------
export async function deleteMeeting(id: string) {
  try {
    const user = (await getCurrentUser()) as unknown as SessionUser;
    if (!user) return { error: 'Unauthorized' };

    const meeting = await prisma.meeting.findUnique({ 
      where: { id } 
    });

    if (!meeting) return { error: 'Meeting not found' };

    const isAdmin = user.roles.includes('admin') || user.roles.includes('subadmin');
    const isCreator = meeting.mentorId === user.id;

    if (!isCreator && !isAdmin) {
      return { error: 'Unauthorized: You can only delete meetings you created.' };
    }

    await prisma.meeting.delete({ where: { id } });
    
    revalidatePath('/mentorship');
    return { success: true, message: 'Meeting cancelled.' };
  } catch (error) {
    return { error: 'Failed to delete meeting.' };
  }
}