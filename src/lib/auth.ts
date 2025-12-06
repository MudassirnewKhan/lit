import { PrismaClient } from "@prisma/client";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'; // Ensure using bcryptjs consistently

const prisma = new PrismaClient();

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

        if (!user) { return null; }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) { return null; }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          roles: user.roles.map(roleAssignment => roleAssignment.role),
          // --- NEW: Pass batchYear from DB to the User Object ---
          batchYear: user.batchYear, 
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
        token.roles = (user as any).roles;
        // --- NEW: Save batchYear to the Token ---
        token.batchYear = (user as any).batchYear;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as string[]; 
        // --- NEW: Save batchYear to the Session (accessible in Frontend) ---
        session.user.batchYear = token.batchYear as string | null;
      }
      return session;
    },
  },
};