// File Path: components/ui/LogoutButton.tsx

'use client'; // This remains a Client Component because it uses an onClick handler.

import React from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

// 1. Define the type for the props our component will accept.
// The '?' makes the 'isMobile' prop optional.
type LogoutButtonProps = {
  isMobile?: boolean;
};

// 2. Update the function to accept the props.
export default function LogoutButton({ isMobile }: LogoutButtonProps) {
  
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  // 3. Conditionally render a different button style if 'isMobile' is true.
  if (isMobile) {
    return (
        <Button onClick={handleLogout} variant="outline" className="w-full justify-start text-lg">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
        </Button>
    );
  }

  // This is the default button for desktop.
  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  );
}