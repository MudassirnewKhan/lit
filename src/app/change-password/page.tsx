import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import ChangePasswordForm from './ChangePasswordForm';

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login/awardee');

  return <ChangePasswordForm forced={Boolean(session.user.mustChangePassword)} />;
}
