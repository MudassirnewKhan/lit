// File Path: src/app/api/admin/mfa-verify/route.ts
// Step 2 of MFA setup: the user types the 6-digit code from their app.
// Only if it's correct do we switch mfaEnabled on.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff } from '@/lib/authz';
import { verifyTotp } from '@/lib/security';

export async function POST(request: Request) {
  let userId: string;
  try {
    ({ userId } = await requireStaff());
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === 'string' ? body.code.trim() : '';

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.mfaSecret) {
    return NextResponse.json({ error: 'Start MFA setup first.' }, { status: 400 });
  }
  if (user.mfaEnabled) {
    return NextResponse.json({ error: 'MFA is already enabled.' }, { status: 409 });
  }

  if (!verifyTotp(code, user.mfaSecret)) {
    return NextResponse.json({ error: 'That code is not correct. Try the newest code.' }, { status: 400 });
  }

  await prisma.user.update({ where: { id: userId }, data: { mfaEnabled: true } });
  return NextResponse.json({ success: true });
}
