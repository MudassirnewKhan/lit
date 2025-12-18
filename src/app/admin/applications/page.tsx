import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
// IMPORTANT: This imports the client component we just made
import ApplicationsClientPage from './ApplicationsClientPage'; 

export const dynamic = 'force-dynamic';

export default async function Page() {
  // 1. Security Check
  const session = await getServerSession(authOptions);
  if (!session?.user?.roles?.includes('admin')) {
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