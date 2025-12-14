// File Path: components/ui/LogoutButton.tsx

'use client'; 

import React from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

type LogoutButtonProps = {
  isMobile?: boolean;
};

export default function LogoutButton({ isMobile }: LogoutButtonProps) {
  
  const handleLogout = async () => {
    // 1. SIGNAL OTHER TABS
    // We set a value in localStorage. Other tabs listening for this key will know to logout.
    localStorage.setItem("logout-event", Date.now().toString());

    // 2. ACTUAL LOGOUT
    await signOut({ callbackUrl: '/' });
  };

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