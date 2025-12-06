import { PrismaClient } from "@prisma/client";
import { AuthOptions, Session, User } from "next-auth"; // Import types
import { JWT } from "next-auth/jwt"; // Import JWT type
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

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
          // --- Pass batchYear from DB to the User Object ---
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
        // FIXED: Replaced 'as any' with specific type intersection
        const customUser = user as User & { roles: string[]; batchYear: string | null };
        
        token.roles = customUser.roles;
        token.batchYear = customUser.batchYear;
      }
      return token;
    },
    // FIXED: Typed the arguments explicitly
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        
        // FIXED: Cast session.user to custom type to allow assignment without 'any'
        const customSessionUser = session.user as User & { 
          roles: string[]; 
          batchYear: string | null 
        };

        customSessionUser.roles = token.roles as string[]; 
        customSessionUser.batchYear = token.batchYear as string | null;
      }
      return session;
    },
  },
};