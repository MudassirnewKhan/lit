import nodemailer from 'nodemailer';

// Helper to configure and retrieve Gmail Transporter dynamically at request time
export function getGmailTransporter() {
  const user = process.env.GMAIL_USER?.replace(/^["']|["']$/g, '').trim();
  const pass = process.env.GMAIL_PASS?.replace(/^["']|["']$/g, '').trim();

  if (!user || !pass) {
    throw new Error(
      `Gmail credentials not configured: GMAIL_USER=${user ? 'set' : 'missing'}, GMAIL_PASS=${pass ? 'set' : 'missing'}`
    );
  }

  return {
    transporter: nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    }),
    senderEmail: user,
  };
}

