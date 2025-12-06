'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from "next-auth/react";
import { Loader2, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function MentorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error('Invalid email or password.');
        setStatus('idle');
      } else if (result?.ok) {
        toast.success('Welcome back!');
        // Force redirect to Dashboard
        window.location.href = '/dashboard'; 
      }
    } catch (err) {
      setStatus('idle');
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-purple-600">
        <CardHeader className="text-center">
          <div className="mx-auto bg-purple-100 p-3 rounded-full w-fit mb-2">
            <UserCheck className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Partner & Staff Login</CardTitle>
          <CardDescription>
            For Mentors, Sponsors, and Portal Staff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={status === 'loading'}>
              {status === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}