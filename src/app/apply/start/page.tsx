// File Path: app/apply/start/page.tsx
'use client';

import React, { useState } from 'react';
import Navbar from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function StartApplicationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    universityId: '',
    major: '',
    gpa: '',
    essay: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // In a real Next.js app, you would send this data to a backend API endpoint.
    // Example: 
    // try {
    //   const response = await fetch('/api/applications', { 
    //     method: 'POST', 
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData) 
    //   });
    //   if (!response.ok) throw new Error('Submission failed');
    //   setStatus('success');
    //   setMessage('Thank you! Your application has been submitted successfully.');
    // } catch (error) {
    //   setStatus('error');
    //   setMessage('Something went wrong. Please try again later.');
    // }

    // --- Simulate API call for demonstration ---
    console.log("Submitting application:", formData);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate a successful submission
    setStatus('success');
    setMessage('Thank you! Your application has been submitted successfully. You will be notified of the outcome via email.');
    setFormData({ fullName: '', email: '', universityId: '', major: '', gpa: '', essay: '' }); // Clear form on success
    // --- End simulation ---
  };

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-muted p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-3xl my-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold">Scholarship Application</CardTitle>
            <CardDescription className="text-lg">Fill out the form below to apply for the LIT Program.</CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'success' ? (
              <div className="text-center p-8 flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-semibold text-green-600">Submission Successful!</h3>
                <p className="mt-2 text-muted-foreground max-w-md">{message}</p>
                <a href="/">
                    <Button variant="outline" className="mt-6">Return to Homepage</Button>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Jane Doe" required value={formData.fullName} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">University Email Address</Label>
                    <Input id="email" type="email" placeholder="jane.doe@university.edu" required value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="universityId">University ID</Label>
                        <Input id="universityId" placeholder="A12345678" required value={formData.universityId} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="major">Major / Field of Study</Label>
                        <Input id="major" placeholder="Computer Science" required value={formData.major} onChange={handleChange} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="gpa">Current GPA (on a 4.0 scale)</Label>
                    <Input id="gpa" type="text" placeholder="e.g., 3.8" required value={formData.gpa} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="essay">Statement of Purpose</Label>
                  <Textarea
                    id="essay"
                    placeholder="Why are you a good fit for this program? What do you hope to achieve? (Max 500 words)"
                    className="min-h-[180px]"
                    required
                    value={formData.essay}
                    onChange={handleChange}
                  />
                </div>
                {message && status === 'error' && (
                  <p className="text-sm text-destructive">{message}</p>
                )}
                <Button type="submit" className="w-full text-lg py-6" disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}