// File Path: app/api/admin/mfa-setup/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
// You'll need to get the user's ID from their session
import { getServerSession } from 'next-auth';
// (Assuming you have your NextAuth options in a separate file)

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // In a real app, you MUST protect this route and get the user's ID from their session
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }
  // const userId = session.user.id;

  // For demonstration, we'll use a placeholder ID
  const userId = 'your_logged_in_admin_id'; // Replace with real session logic

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Generate a new MFA secret
  const secret = authenticator.generateSecret();
  const appName = 'LIT Scholarship Portal';
  const otpauth = authenticator.keyuri(user.email, appName, secret);

  // Save the temporary secret to the user's record
  await prisma.user.update({
    where: { id: userId },
    data: { mfaSecret: secret }, // Temporarily store the secret
  });

  // Generate a QR code image from the secret
  const qrCodeDataUrl = await qrcode.toDataURL(otpauth);

  return NextResponse.json({ qrCodeDataUrl });
}
