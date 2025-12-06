import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Ensure this points to your NextAuth options

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}