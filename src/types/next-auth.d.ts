// File Path: src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from 'next-auth';
// FIXED: Removed 'JWT' from imports to solve "defined but never used" warning
import { DefaultJWT } from 'next-auth/jwt';

// 1. Extend the JWT type
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    roles: string[];
    id: string;
    // Add batchYear to token
    batchYear?: string | null;
  }
}

// 2. Extend the Session type
declare module 'next-auth' {
  interface Session {
    user: {
      roles: string[];
      id: string;
      // Add batchYear to session.user
      batchYear?: string | null;
    } & DefaultSession['user'];
  }

  // 3. Extend the User type (returned from authorize)
  interface User extends DefaultUser {
    roles: string[];
    batchYear?: string | null;
  }
}