'use client';

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { changePassword } from './actions';

export default function ChangePasswordForm({ forced }: { forced: boolean }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await changePassword(new FormData(e.currentTarget));
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setDone(true);
    // Sign out so the old "you must change your password" flag leaves the login token.
    setTimeout(() => signOut({ callbackUrl: '/login/awardee' }), 1500);
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Set a new password</CardTitle>
          <CardDescription>
            {forced
              ? 'For your security, replace the temporary password you were given before continuing.'
              : 'Choose a new password for your account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <p className="text-center text-green-700">
              Password updated. Signing you out so you can log in with the new one…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current (temporary) password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" minLength={10} required />
                <p className="text-xs text-muted-foreground">At least 10 characters.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={10} required />
              </div>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
