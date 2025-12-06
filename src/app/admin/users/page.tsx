import React from 'react';
import { prisma } from '@/lib/prisma';
import UserManagementTable from '@/components/admin/UserManagementTable';
import CreateUserForm from '@/components/admin/CreateUserForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const currentUserRoles = session?.user?.roles || [];
  const isMainAdmin = currentUserRoles.includes('admin');

  const allUsers = await prisma.user.findMany({
    include: { roles: true },
    orderBy: { createdAt: 'desc' }
  });

  const admins = allUsers.filter(u => u.roles.some(r => ['admin', 'subadmin'].includes(r.role)));
  const mentors = allUsers.filter(u => u.roles.some(r => r.role === 'mentor'));
  const students = allUsers.filter(u => u.roles.some(r => r.role === 'awardee'));
  const sponsors = allUsers.filter(u => u.roles.some(r => r.role === 'sponsor'));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">User Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Create Form: Pass 'isMainAdmin' so we know which roles to show in dropdown */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Account</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateUserForm isMainAdmin={isMainAdmin} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Tabs defaultValue="mentors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="mentors">Mentors ({mentors.length})</TabsTrigger>
              <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
              <TabsTrigger value="admins">Staff ({admins.length})</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors ({sponsors.length})</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="mentors">
                {/* Pass current user info to table to control Delete buttons */}
                <UserManagementTable 
                  users={mentors} 
                  roleLabel="Mentors" 
                  currentUserId={session?.user?.id} 
                  isMainAdmin={isMainAdmin} 
                />
              </TabsContent>
              <TabsContent value="students">
                <UserManagementTable 
                  users={students} 
                  roleLabel="Students" 
                  currentUserId={session?.user?.id} 
                  isMainAdmin={isMainAdmin} 
                />
              </TabsContent>
              <TabsContent value="admins">
                <UserManagementTable 
                  users={admins} 
                  roleLabel="Admins & Staff" 
                  currentUserId={session?.user?.id} 
                  isMainAdmin={isMainAdmin} 
                />
              </TabsContent>
              <TabsContent value="sponsors">
                <UserManagementTable 
                  users={sponsors} 
                  roleLabel="Sponsors" 
                  currentUserId={session?.user?.id} 
                  isMainAdmin={isMainAdmin} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}