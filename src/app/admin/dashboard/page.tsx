import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// 1. Import GraduationCap icon
import { FileText, Users, Shield, UserCheck, GraduationCap } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getAdminStats() {
  // Fetch all counts in parallel for speed
  const [
    pendingApps, 
    approvedApps, 
    totalMentors, 
    totalStudents,
    totalSubAdmins,
    // 2. Fetch Alumni Count
    totalAlumni
  ] = await Promise.all([
    prisma.application.count({ where: { status: 'pending' } }),
    prisma.application.count({ where: { status: 'approved' } }),
    prisma.userRoleAssignment.count({ where: { role: 'mentor' } }),
    prisma.userRoleAssignment.count({ where: { role: 'awardee' } }),
    prisma.userRoleAssignment.count({ where: { role: 'subadmin' } }),
    prisma.alumni.count(), // <--- Count the new table
  ]);

  return { pendingApps, approvedApps, totalMentors, totalStudents, totalSubAdmins, totalAlumni };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const stats = await getAdminStats();
  
  const isMainAdmin = session?.user?.roles?.includes('admin');

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session?.user?.name}. You are logged in as <span className="font-semibold text-primary">{isMainAdmin ? 'Administrator' : 'Staff'}</span>.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        
        {/* Card 1: Action Items */}
        <Card className="border-l-4 border-l-yellow-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Reviews</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingApps}</div>
            <p className="text-xs text-muted-foreground">Applications to process</p>
          </CardContent>
        </Card>

        {/* Card 2: Students */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Scholars</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">{stats.approvedApps} approved</p>
          </CardContent>
        </Card>

        {/* Card 3: Mentors */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Mentors</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalMentors}</div>
            <p className="text-xs text-muted-foreground">Guiding students</p>
          </CardContent>
        </Card>

        {/* Card 4: Alumni Stories (NEW) */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alumni Stories</CardTitle>
            <GraduationCap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalAlumni}</div>
            <p className="text-xs text-muted-foreground">Published on website</p>
          </CardContent>
        </Card>

        {/* Card 5: Staff */}
        <Card className="shadow-sm bg-slate-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Staff Team</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSubAdmins}</div>
            <p className="text-xs text-muted-foreground">Sub-admins active</p>
          </CardContent>
        </Card>

      </div>

      {/* Quick Tips Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Start Here</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Go to <strong>Applications</strong> to review new student submissions.</li>
            <li>Use <strong>Manage Alumni</strong> to add success stories to the public page.</li>
            <li>Check <strong>Manage Users</strong> to reset passwords or add new Mentors.</li>
            <li>Visit the <strong>Community Feed</strong> to moderate discussions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}