'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Helper to verify if user can upload
async function verifyUploader() {
  const session = await getServerSession(authOptions);
  const roles = session?.user?.roles || [];
  
  // FIX: Added 'subadmin' to the allowed list
  if (!roles.includes('mentor') && !roles.includes('sponsor') && !roles.includes('admin') && !roles.includes('subadmin')) {
    throw new Error('Unauthorized: Only Staff and Mentors can upload resources.');
  }
  return session;
}

export async function createResource(formData: FormData, fileUrl: string, fileType: string) {
  try {
    const session = await verifyUploader();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!title || !fileUrl || !category) {
      return { error: 'Title, File, and Category are required.' };
    }

    await prisma.resource.create({
      data: {
        title,
        description,
        fileUrl,
        fileType,
        category,
        authorId: session!.user.id,
      },
    });

    revalidatePath('/resources');
    return { success: true, message: 'Resource shared successfully.' };
  } catch (error) {
    console.error('Create Resource Error:', error);
    return { error: 'Failed to share resource.' };
  }
}

export async function deleteResource(resourceId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { error: 'Not authenticated' };

    const resource = await prisma.resource.findUnique({ 
      where: { id: resourceId },
      select: { authorId: true } 
    });

    if (!resource) return { error: 'Resource not found' };

    const myRoles = session.user.roles || [];

    // 1. Owner? OK.
    if (resource.authorId === session.user.id) {
        await prisma.resource.delete({ where: { id: resourceId } });
        revalidatePath('/resources');
        return { success: true, message: 'Deleted.' };
    }

    // 2. God Admin? OK.
    if (myRoles.includes('admin')) {
        await prisma.resource.delete({ where: { id: resourceId } });
        revalidatePath('/resources');
        return { success: true, message: 'Deleted.' };
    }

    // 3. Sub-admin? Check Author.
    if (myRoles.includes('subadmin')) {
        const author = await prisma.user.findUnique({
            where: { id: resource.authorId },
            include: { roles: true }
        });
        
        // FIX: Properly check if author is staff (Admin or Subadmin)
        // We use the type definition { role: string } to satisfy TypeScript
        const isAuthorStaff = author?.roles.some((r: { role: string }) => ['admin', 'subadmin'].includes(r.role));

        if (isAuthorStaff) {
            return { error: "Access Denied: Cannot delete Staff resources." };
        }
        
        // If author is Mentor/Student, OK.
        await prisma.resource.delete({ where: { id: resourceId } });
        revalidatePath('/resources');
        return { success: true, message: 'Deleted.' };
    }

    return { error: 'Unauthorized' };
  } catch (error) {
    return { error: 'Failed to delete resource.' };
  }
}