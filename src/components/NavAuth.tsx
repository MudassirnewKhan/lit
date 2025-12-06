// File Path: components/ui/NavAuth.tsx

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import LogoutButton from './LogoutButton'; // We will use the client component for logout

// This is a Server Component. It runs on the server.
export default async function NavAuth() {
  // This securely fetches the current user's session.
  const session = await getServerSession(authOptions);

  const loginLinks = {
    label: 'Login',
    subLinks: [
      { href: '/login/awardee', label: 'as Awardee' },
      { href: '/login/mentor', label: 'as Mentor/Coach' },
      { href: '/login/sponsor', label: 'as Sponsor' },
    ]
  };

  // --- THE CONDITIONAL LOGIC ---
  // If the user IS logged in, show Dashboard and Logout buttons.
  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/admin/dashboard" passHref>
          <Button variant="outline">Dashboard</Button>
        </Link>
        <LogoutButton /> 
      </div>
    );
  }

  // If the user is NOT logged in, show the public Login and Donate buttons.
  return (
    <div className="flex items-center gap-2">
      <Link href="/donate" passHref>
        <Button>Donate</Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant="outline">{loginLinks.label}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {loginLinks.subLinks.map((subLink) => (
            <Link key={subLink.href} href={subLink.href} passHref>
              <DropdownMenuItem>Login {subLink.label}</DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}