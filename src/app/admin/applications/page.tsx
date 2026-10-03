import { prisma } from '@/lib/prisma';
import { requireStaff } from '@/lib/authz';
import { redirect } from 'next/navigation';
// IMPORTANT: This imports the client component we just made
import ApplicationsClientPage from './ApplicationsClientPage'; 

export const dynamic = 'force-dynamic';

export default async function Page() {
  // 1. Security Check (same rule as the approve/reject actions: admin + subadmin)
  try {
    await requireStaff(['admin', 'subadmin']);
  } catch {
    redirect('/');
  }

  // 2. Fetch Data
  const applications = await prisma.application.findMany({
    where: { status: 'pending' },
    orderBy: { submittedAt: 'desc' },
  });

  // 3. Render
  return (
    <div className="container mx-auto py-10">
      <ApplicationsClientPage initialApplications={applications} />
    </div>
  );
}