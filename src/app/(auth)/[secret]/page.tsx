// File Path: src/app/(auth)/[secret]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import AdminLoginForm from './LoginForm'; // Import the client component

// This dynamic route matches ANY single-segment URL that has no page of its own
// (e.g. /anything). So we must check here that the URL really is the secret one;
// otherwise every random URL would show the admin login form.
// In Next.js 15, `params` is a Promise.
export default async function AdminSecretPage({
  params,
}: {
  params: Promise<{ secret: string }>;
}) {
  const { secret } = await params;
  const expected = process.env.ADMIN_LOGIN_PATH;

  if (!expected || secret !== expected) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <AdminLoginForm />
    </div>
  );
}
