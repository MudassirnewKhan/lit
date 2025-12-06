// File Path: components/providers.tsx

'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// This is the corrected props type. It tells our component
// that it will receive a 'children' prop of type React.ReactNode.
type Props = {
  children: React.ReactNode;
};

// We now accept the 'children' prop and pass it down.
export default function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}