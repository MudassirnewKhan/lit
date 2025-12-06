// File Path: app/(auth)/[secret]/LoginForm.tsx

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      // Step 1: Attempt to sign in. `redirect: false` is crucial.
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
        setStatus('idle');
      } else if (result?.ok) {
        // --- THIS IS THE FINAL FIX ---
        // Step 2: Login was successful. Now, force a "soft refresh" of Server Components.
        // This will update the Navbar to show the admin buttons.
        // After this refresh, our middleware will automatically redirect to the dashboard
        // because it will see a logged-in admin on the login page.
        router.refresh(); 
      } else {
        setStatus('idle');
        setError('An unknown login error occurred.');
      }
      
    } catch (error) {
      setStatus('idle');
      setError('An unexpected error occurred.');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Admin Portal Access</CardTitle>
        <CardDescription>Enter your administrative credentials.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={status === 'loading'}>
            {status === 'loading' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}