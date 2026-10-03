// File Path: src/app/api/admin/mfa-setup/route.ts
// Step 1 of MFA setup: create a secret + QR code for the CURRENTLY LOGGED-IN staff member.
// The secret is saved but MFA stays OFF until they prove it works via /api/admin/mfa-verify.

import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { prisma } from '@/lib/prisma'; // shared client (was: new PrismaClient())
import { requireStaff } from '@/lib/authz';

// POST, not GET: this changes data, and GET requests can be triggered by links/images.
export async function POST() {
  let userId: string;
  try {
    ({ userId } = await requireStaff());
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Don't let a stolen session silently swap the authenticator on an account that already has MFA.
  if (user.mfaEnabled) {
    return NextResponse.json({ error: 'MFA is already enabled for this account.' }, { status: 409 });
  }

  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(user.email, 'LIT Scholarship Portal', secret);

  await prisma.user.update({
    where: { id: userId },
    data: { mfaSecret: secret }, // pending: mfaEnabled stays false
  });

  const qrCodeDataUrl = await qrcode.toDataURL(otpauth);
  return NextResponse.json({ qrCodeDataUrl, manualKey: secret });
}
