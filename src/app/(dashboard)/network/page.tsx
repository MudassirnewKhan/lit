import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, UserCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getServerSession } from 'next-auth'; // <--- 1. Import Auth
import { authOptions } from '@/lib/auth';

async function getNetworkData() {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id; // <--- 2. Get Current ID

  // 3. Add 'NOT: currentUserId' to every query
  
  // Fetch Sub-Admins (Excluding yourself)
  const admins = await prisma.user.findMany({
    where: {
      roles: { some: { role: 'subadmin' } },
      id: { not: currentUserId } // <--- Hide Self
    },
    select: { id: true, firstName: true, lastName: true, bio: true, email: true }
  });

  // Fetch Mentors (Excluding yourself)
  const mentors = await prisma.user.findMany({
    where: {
      roles: { some: { role: 'mentor' } },
      id: { not: currentUserId } // <--- Hide Self
    },
    select: { id: true, firstName: true, lastName: true, bio: true } 
  });

  // Fetch Scholars (Excluding yourself)
  const scholars = await prisma.user.findMany({
    where: {
      roles: { some: { role: 'awardee' } },
      id: { not: currentUserId } // <--- Hide Self
    },
    orderBy: { batchYear: 'desc' }, 
    select: { id: true, firstName: true, lastName: true, batchYear: true }
  });

  return { admins, mentors, scholars };
}

export default async function NetworkPage() {
  const { admins, mentors, scholars } = await getNetworkData();

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community Directory</h1>
        <p className="text-muted-foreground mt-2">
          Connect with the staff, mentors, and scholars of the LIT network.
        </p>
      </div>

      {/* --- ADMINISTRATORS SECTION --- */}
      {admins.length > 0 && (
        <>
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-slate-700" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Administrators</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map((admin) => (
                <Link key={admin.id} href={`/profile/${admin.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 h-full bg-slate-50/50">
                    <CardContent className="p-6 flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-slate-200">
                        <AvatarImage src="" /> 
                        <AvatarFallback className="bg-slate-200 text-slate-700 text-lg font-bold">
                          {admin.firstName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {admin.firstName} {admin.lastName}
                        </h3>
                        <Badge variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300 mt-1">
                          Administrator
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2 break-all">
                          {admin.email}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          <Separator className="my-8" />
        </>
      )}

      {/* --- MENTORS SECTION --- */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <UserCheck className="h-6 w-6 text-purple-700" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">Our Mentors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <Link key={mentor.id} href={`/profile/${mentor.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-100 h-full">
                <CardContent className="p-6 flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-purple-100">
                    <AvatarImage src="" /> 
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-lg font-bold">
                      {mentor.firstName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {mentor.firstName} {mentor.lastName}
                    </h3>
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 mt-1">
                      Mentor
                    </Badge>
                    {mentor.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {mentor.bio}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {mentors.length === 0 && <p className="text-muted-foreground italic">No mentors listed yet.</p>}
        </div>
      </section>

      <Separator className="my-8" />

      {/* --- SCHOLARS SECTION --- */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <GraduationCap className="h-6 w-6 text-blue-700" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900">Fellow Scholars</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scholars.map((scholar) => (
            <Link key={scholar.id} href={`/profile/${scholar.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-3 border-2 border-blue-50">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-50 text-blue-700 text-xl">
                      {scholar.firstName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-semibold text-gray-900 truncate w-full">
                    {scholar.firstName} {scholar.lastName}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    Class of {scholar.batchYear || '2025'}
                  </p>
                  
                  <Badge variant="outline" className="mt-2 text-xs font-normal text-blue-600 border-blue-100">
                    Scholar
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
          {scholars.length === 0 && <p className="text-muted-foreground italic">No scholars found.</p>}
        </div>
      </section>
    </div>
  );
}