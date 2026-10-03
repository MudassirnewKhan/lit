// File Path: src/lib/authz.ts
// One place that decides "is this caller allowed to do staff things?"
// Every admin server action and admin page should call requireStaff().
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export type StaffRole = 'admin' | 'subadmin';

/**
 * Throws 'Unauthorized' unless the caller is logged in AND currently holds one of
 * the allowed roles in the DATABASE (not just in their JWT). That means a deleted
 * or demoted user loses access immediately instead of after the JWT expires.
 */
export async function requireStaff(
  allowed: StaffRole[] = ['admin', 'subadmin']
): Promise<{ userId: string; role: StaffRole }> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { roles: { select: { role: true } } },
  });
  if (!user) throw new Error('Unauthorized');

  const roles = user.roles.map((r) => r.role as string);
  // admin takes priority if the user somehow holds both
  const role: StaffRole | null = roles.includes('admin')
    ? 'admin'
    : roles.includes('subadmin')
      ? 'subadmin'
      : null;

  if (!role || !allowed.includes(role)) throw new Error('Unauthorized');
  return { userId, role };
}
