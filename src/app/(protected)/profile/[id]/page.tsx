import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Calendar, GraduationCap, User, ShieldAlert } from 'lucide-react';

interface PageProps {
  params: { id: string };
}

export default async function UserProfilePage({ params }: PageProps) {
  // 1. Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { roles: true } // Check roles to hide admins if needed
  });

  if (!user) return notFound();

  // 2. Optional: Hide Admins from public view
  const isStaff = user.roles.some(r => ['admin', 'subadmin'].includes(r.role));
  if (isStaff) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
            <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold">Private Profile</h1>
            <p className="text-muted-foreground">This user profile cannot be viewed publicly.</p>
        </div>
    );
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 bg-card p-6 rounded-xl shadow-sm border">
        <Avatar className="h-24 w-24 border-2 border-primary/10">
          <AvatarImage src={''} /> {/* Add user.image if available */}
          <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
            {user.firstName ? user.firstName[0] : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
             <GraduationCap className="h-4 w-4" />
             <span className="capitalize">{user.batchYear ? `Batch of ${user.batchYear}` : 'Community Member'}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" /> Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="text-sm">{user.email}</span>
            </div>
            {user.phoneNumber && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-green-500" />
                <span className="text-sm">{user.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Joined {joinedDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
           <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent>
            {user.bio ? (
              <p className="text-gray-600 leading-relaxed">{user.bio}</p>
            ) : (
              <p className="text-muted-foreground italic">No bio provided.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}