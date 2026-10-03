import { AuthOptions, Session, User } from "next-auth"; // Import types
import { JWT } from "next-auth/jwt"; // Import JWT type
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma'; // ONE shared Prisma client (was: new PrismaClient() here)
import { verifyTotp } from '@/lib/security';

// --- Brute-force protection settings ---
const MAX_FAILED_ATTEMPTS = 5;          // wrong password / wrong MFA code attempts
const LOCK_MINUTES = 15;                // how long the account stays locked

// Compared against when the email doesn't exist, so "unknown email" and
// "wrong password" take the same time and can't be told apart by timing.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

async function registerFailedAttempt(userId: string) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { failedLoginCount: { increment: 1 } },
    select: { failedLoginCount: true },
  });
  if (updated.failedLoginCount >= MAX_FAILED_ATTEMPTS) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60 * 1000),
        failedLoginCount: 0,
      },
    });
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {}, mfaCode: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { roles: true },
        });

        if (!user) {
          await bcrypt.compare(credentials.password, DUMMY_HASH); // equalise timing
          return null;
        }

        // 1. Locked? Same generic failure as a wrong password (don't reveal the lock).
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          return null;
        }

        // 2. Password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
          await registerFailedAttempt(user.id);
          return null;
        }

        // 3. MFA (only for accounts that have finished MFA setup)
        if (user.mfaEnabled && user.mfaSecret) {
          if (!credentials.mfaCode) {
            // Password was correct, so it's safe to tell the form to ask for the code.
            throw new Error('MFA_REQUIRED');
          }
          if (!verifyTotp(credentials.mfaCode, user.mfaSecret)) {
            // Wrong codes count as failed attempts, otherwise 6 digits could be brute-forced.
            await registerFailedAttempt(user.id);
            return null;
          }
        }

        // 4. Success: clear the counters
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginCount: 0, lockedUntil: null, lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          roles: user.roles.map(roleAssignment => roleAssignment.role),
          // --- Pass batchYear from DB to the User Object ---
          batchYear: user.batchYear,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],

  session: { 
    strategy: "jwt",
    maxAge: 60 * 60 // 1 hour
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/login' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const customUser = user as User & {
          roles: string[];
          batchYear: string | null;
          mustChangePassword?: boolean;
        };

        token.roles = customUser.roles;
        token.batchYear = customUser.batchYear;
        token.mustChangePassword = customUser.mustChangePassword ?? false;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;

        const customSessionUser = session.user as User & { 
          roles: string[]; 
          batchYear: string | null;
          mustChangePassword?: boolean;
        };

        customSessionUser.roles = token.roles as string[]; 
        customSessionUser.batchYear = token.batchYear as string | null;
        customSessionUser.mustChangePassword = token.mustChangePassword ?? false;
      }
      return session;
    },
  },
};
