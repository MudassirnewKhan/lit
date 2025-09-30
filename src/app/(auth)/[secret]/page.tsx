// File Path: src/app/(auth)/[secret]/page.tsx

import React from 'react';
import AdminLoginForm from './LoginForm'; // Import the client component

// This page is now very simple. The middleware has already verified the secret path.
// If the code reaches this point, we know the user is allowed to see the login form.


export default function AdminSecretPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <AdminLoginForm />
    </div>
  );
}