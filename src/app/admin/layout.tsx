import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  MessageSquare, 
  Shield,
  LogOut
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // 1. Security Check
  if (!session?.user) {
    redirect('/login/subadmin');
  }

  const roles = session.user.roles || [];
  const isMainAdmin = roles.includes('admin');
  const isSubAdmin = roles.includes('subadmin');

  // Block non-admins
  if (!isMainAdmin && !isSubAdmin) {
    redirect('/');
  }

  // 2. Define Navigation Links
  const adminLinks = [
    { 
      href: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      href: '/admin/applications', 
      label: 'Applications', 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      href: '/admin/users', 
      label: 'Manage Users', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      href: '/feed', 
      label: 'Community Feed', 
      icon: <MessageSquare className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 flex-col border-r bg-white p-6 md:flex shadow-sm">
        <div className="mb-8 flex items-center gap-2 text-primary">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="font-bold text-xl leading-none">LIT Portal</h1>
            <p className="text-xs text-muted-foreground font-medium">
              {isMainAdmin ? 'Owner Console' : 'Staff Console'}
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-slate-600 hover:text-primary hover:bg-slate-100"
              >
                {link.icon}
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t">
           <div className="mb-4 px-2">
             <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
             <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
           </div>
           <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header (Optional, if needed later) */}
        <header className="md:hidden flex items-center h-16 px-6 border-b bg-white">
           <span className="font-bold">LIT Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}