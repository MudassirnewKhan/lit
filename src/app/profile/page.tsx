import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProfileForm from '@/components/profile/profileForm';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  // Security: Only logged-in users can see this page
  if (!session?.user?.id) {
    redirect('/login/awardee');
  }

  // Fetch the latest user data from DB
  // We select only what we need for security reasons
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      bio: true,
      phoneNumber: true,
    },
  });

  if (!user) {
    return <div className="p-10">User not found.</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      
      <ProfileForm user={user} />
    </div>
  );
}