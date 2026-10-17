'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from 'next/cache';
import { getGmailTransporter } from '@/lib/email';
import { renderSessionInviteEmailHtml } from '@/components/emails/SessionInviteEmail';

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
// 1. Create Meeting with Year & Department Targeting + Email
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
    const dateString = formData.get('date') as string;
    const targetBatch = formData.get('targetBatch') as string;
    const targetDepartment = formData.get('targetDepartment') as string;
    const description = (formData.get('description') as string) || '';

    let finalLink = (formData.get('link') as string)?.trim();
    if (!finalLink) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { meetingLink: true },
      });
      if (dbUser?.meetingLink?.trim()) {
        finalLink = dbUser.meetingLink.trim();
      } else {
        const roomCode = Math.random().toString(36).substring(2, 8);
        finalLink = `https://meet.jit.si/LIT-Mentorship-${roomCode}`;
      }
    }

    // Validate
    if (!title || !dateString) {
      return { error: "Missing required fields (Title or Date)." };
    }

    // Convert string date to Date object
    const scheduledAt = new Date(dateString);

    const normalizedBatch = targetBatch && targetBatch !== "all" ? targetBatch.trim() : null;
    const normalizedDept = targetDepartment && targetDepartment !== "all" ? targetDepartment.trim() : null;

    const newMeeting = await prisma.meeting.create({
      data: {
        title,
        description: description || null,
        scheduledAt,
        link: finalLink,
        mentorId: user.id,
        targetBatch: normalizedBatch,
        targetDepartment: normalizedDept,
      },
    });

    // ---------------------------------------------------------
    // Automatic Email Notification to Targeted Scholars
    // ---------------------------------------------------------
    let notifiedCount = 0;
    try {
      // Find all matching scholars
      const targetScholars = await prisma.user.findMany({
        where: {
          roles: { some: { role: 'awardee' } },
          ...(normalizedBatch ? { batchYear: normalizedBatch } : {}),
          ...(normalizedDept
            ? { department: { equals: normalizedDept, mode: 'insensitive' } }
            : {}),
        },
        select: { email: true, firstName: true, lastName: true },
      });

      const scholarEmails = targetScholars
        .map((s) => s.email?.trim())
        .filter((e): e is string => Boolean(e && e.includes('@')));

      if (scholarEmails.length > 0) {
        const { transporter, senderEmail } = getGmailTransporter();
        const hostName = user.name || 'LIT Mentor';

        const emailHtml = renderSessionInviteEmailHtml({
          title,
          description: description || null,
          link: finalLink,
          scheduledAt,
          mentorName: hostName,
          targetBatch: normalizedBatch,
          targetDepartment: normalizedDept,
        });

        // Use BCC to deliver in a single request while protecting scholar privacy
        await transporter.sendMail({
          from: `"LIT Mentorship Hub" <${senderEmail}>`,
          to: senderEmail,
          bcc: scholarEmails,
          subject: `📅 New Mentorship Session: ${title}`,
          html: emailHtml,
        });

        notifiedCount = scholarEmails.length;
      }
    } catch (mailError) {
      console.error('Failed to send session notification emails:', mailError);
    }

    revalidatePath('/mentorship');

    const successMessage = notifiedCount > 0
      ? `Session scheduled! ${notifiedCount} matching scholar${notifiedCount > 1 ? 's' : ''} notified via email.`
      : 'Session scheduled successfully!';

    return { success: true, message: successMessage };
  } catch (error) {
    console.error("Create Meeting Error:", error);
    return { error: 'Failed to create meeting.' };
  }
}

// ---------------------------------------------------------
// 2. Get Meetings (Filtered by Batch & Department for Scholars)
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

  // Mentors, Admins, Staff see all sessions
  if (isPrivileged) {
    return await prisma.meeting.findMany({
      orderBy: { scheduledAt: 'asc' },
      include: mentorInclude
    });
  }

  // Scholar Logic: Look up fresh Batch & Department from DB
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { batchYear: true, department: true }
  });

  const userBatch = dbUser?.batchYear ?? user.batchYear;
  const userDept = dbUser?.department;

  return await prisma.meeting.findMany({
    where: {
      AND: [
        // Batch filter: open to all OR matching student's batch
        {
          OR: [
            { targetBatch: null },
            ...(userBatch ? [{ targetBatch: userBatch }] : []),
          ]
        },
        // Department filter: open to all departments OR matching student's department
        {
          OR: [
            { targetDepartment: null },
            ...(userDept ? [{ targetDepartment: { equals: userDept, mode: 'insensitive' as const } }] : []),
          ]
        }
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
  } catch {
    // FIXED: Removed unused 'error' variable
    return { error: 'Failed to delete meeting.' };
  }
}