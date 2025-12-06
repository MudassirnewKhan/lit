'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function SponsorLoginPage() {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('idle');
  };

  return (
    <div className="bg-background text-foreground">
        
        <main className="min-h-screen flex items-center justify-center bg-muted p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Sponsor Login</CardTitle>
              <CardDescription>Log in to view your impact and manage your contributions.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" required />
                </div>
                <Button type="submit" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Signing In...' : 'Sign In'}
                </Button>
                 <div className="text-center text-sm">
                  <a href="#" className="text-primary hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
    
    </div>
  );
}
