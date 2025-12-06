'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { updateProfile } from '@/app/profile/actions';

type UserData = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  bio: string | null;
  phoneNumber: string | null;
};

export default function ProfileForm({ user }: { user: UserData }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(formData);
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Saved!' });
        
        // Clear password fields manually
        const form = event.target as HTMLFormElement;
        const passInput = form.querySelector('input[name="newPassword"]') as HTMLInputElement;
        const confirmInput = form.querySelector('input[name="confirmPassword"]') as HTMLInputElement;
        
        if(passInput) passInput.value = '';
        if(confirmInput) confirmInput.value = '';
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-3xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information and login credentials.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Message */}
          {message && (
            <div className={`p-3 rounded-md flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {message.text}
            </div>
          )}

          {/* Personal Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" defaultValue={user.firstName || ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" defaultValue={user.lastName || ''} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user.email || ''} disabled className="bg-gray-100 cursor-not-allowed" />
              <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support for assistance.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" defaultValue={user.phoneNumber || ''} placeholder="+1 (555) 000-0000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                defaultValue={user.bio || ''} 
                placeholder="Tell us a little about yourself..." 
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                {/* CHANGED NAME TO newPassword */}
                <Input id="newPassword" name="newPassword" type="password" placeholder="Leave blank to keep current" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end bg-gray-50 p-4 rounded-b-lg">
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Save Changes</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}