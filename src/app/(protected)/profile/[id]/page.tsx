import React from 'react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Calendar, ShieldCheck, GraduationCap, UserCheck } from 'lucide-react';

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  // 1. Fetch User with Roles
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { roles: true }
  });

  if (!user) return notFound();

  // 2. Identify Role
  const roles = user.roles.map(r => r.role);
  const isAdmin = roles.includes('admin') || roles.includes('subadmin');
  const isMentor = roles.includes('mentor');
  const isScholar = roles.includes('awardee');

  // 3. Privacy Logic
  // If it's an Admin, we ALWAYS show the profile (Name/Email)
  // If it's a Student/Mentor, we check their privacy settings (if you have them)
  const isOwner = session?.user?.id === user.id;
  const showPhone = user.phoneNumber;

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 pb-8 pt-8">
            <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 border-4 border-white shadow-sm mb-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-4xl bg-slate-800 text-white">
                        {user.firstName?.[0]}
                    </AvatarFallback>
                </Avatar>
                
                <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
                
                {/* DYNAMIC BADGES */}
                <div className="flex gap-2 mt-2">
                    {isAdmin && <Badge className="bg-slate-800"><ShieldCheck className="w-3 h-3 mr-1"/> Administrator</Badge>}
                    {isMentor && <Badge className="bg-purple-600"><UserCheck className="w-3 h-3 mr-1"/> Mentor</Badge>}
                    {isScholar && <Badge className="bg-blue-600"><GraduationCap className="w-3 h-3 mr-1"/> Scholar</Badge>}
                </div>
            </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
            {/* EMAIL SECTION (Visible to logged in users) */}
            <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-slate-100 rounded-full"><Mail className="w-5 h-5"/></div>
                <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                </div>
            </div>

            {/* PHONE SECTION (Respects Privacy) */}
            {showPhone && (
                <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-slate-100 rounded-full"><Phone className="w-5 h-5"/></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{user.phoneNumber}</p>
                    </div>
                </div>
            )}

            {/* SCHOLAR SPECIFIC INFO */}
            {isScholar && user.batchYear && (
                <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-slate-100 rounded-full"><Calendar className="w-5 h-5"/></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Class Of</p>
                        <p className="font-medium">{user.batchYear}</p>
                    </div>
                </div>
            )}

            {/* BIO SECTION */}
            {user.bio && (
                <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-gray-600 leading-relaxed">{user.bio}</p>
                </div>
            )}
            
            {!user.bio && !isScholar && isAdmin && (
                <p className="text-center text-muted-foreground italic pt-4">
                    Staff member of the LIT Portal.
                </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}