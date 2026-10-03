'use server';

import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateNewPassword } from '@/lib/security';

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: 'Please sign in again.' };

  const current = String(formData.get('currentPassword') || '');
  const next = String(formData.get('newPassword') || '');
  const confirm = String(formData.get('confirmPassword') || '');

  if (next !== confirm) return { error: 'The new passwords do not match.' };
  const problem = validateNewPassword(next);
  if (problem) return { error: problem };
  if (next === current) return { error: 'Choose a password different from the current one.' };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: 'Account not found.' };

  const ok = await bcrypt.compare(current, user.passwordHash);
  if (!ok) return { error: 'Your current password is incorrect.' };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(next, 10),
      mustChangePassword: false,
    },
  });

  // The client signs the user out afterwards so they get a fresh login token.
  return { success: true };
}
