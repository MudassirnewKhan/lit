import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, FileText, Video } from 'lucide-react';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login/awardee');

  const roles = session.user.roles || [];
  
  // --- TRAFFIC CONTROL ---
  // If user is Admin or Sub-admin, redirect them to the Admin Dashboard immediately
  if (roles.includes('admin') || roles.includes('subadmin')) {
    redirect('/admin/dashboard');
  }
  // ----------------------

  const isMentor = roles.includes('mentor');
  const isSponsor = roles.includes('sponsor');
  const isStudent = roles.includes('awardee');

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          Welcome, {session.user.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          {isMentor ? 'Thank you for guiding the next generation.' : 
           isSponsor ? 'Thank you for your support.' : 
           'Here is your LIT Scholar portal.'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* 1. Mentorship Hub */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-500" />
              Mentorship Hub
            </CardTitle>
            <CardDescription>
              {isMentor || isSponsor ? 'Schedule and manage sessions.' : 'Join upcoming mentorship sessions.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/mentorship">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                {isMentor || isSponsor ? 'Manage Sessions' : 'View Sessions'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 2. Community Feed */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Community Feed
            </CardTitle>
            <CardDescription>Connect with the community.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/feed">
              <Button variant="outline" className="w-full">Go to Feed</Button>
            </Link>
          </CardContent>
        </Card>

        {/* 3. Profile */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              My Profile
            </CardTitle>
            <CardDescription>Manage your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/profile">
              <Button variant="outline" className="w-full">View Profile</Button>
            </Link>
          </CardContent>
        </Card>

        {/* 4. Resources (Everyone needs this) */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              Resources
            </CardTitle>
            <CardDescription>Access library & guides.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/resources">
              <Button variant="outline" className="w-full">View Resources</Button>
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}