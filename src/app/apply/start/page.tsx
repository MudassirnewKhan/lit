'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Loader2 } from 'lucide-react';
import { submitApplication } from '../actions'; // Ensure this path is correct based on your folder structure

export default function StartApplicationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    universityId: '',
    batchYear: '', // <--- NEW FIELD
    major: '',
    gpa: '',
    essay: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<any>({});

  // UPDATED: Added HTMLSelectElement to the type definition
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    setErrors({});

    const result = await submitApplication(formData);

    if (result.errors) {
      setErrors(result.errors);
      setStatus('error');
      setMessage('Please correct the errors in the form.');
    } else if (!result.success) {
      setStatus('error');
      setMessage(result.message);
    } else {
      setStatus('success');
      setMessage('Thank you! Your application has been submitted successfully. You will be notified of the outcome via email.');
    }
  };

  return (
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
              <a href="/"><Button variant="outline" className="mt-6">Return to Homepage</Button></a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                  {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName[0]}</p>}
                </div>
                <div>
                  <Label htmlFor="email">University Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@university.edu" />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email[0]}</p>}
                </div>
              </div>

              {/* --- NEW BATCH YEAR FIELD --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="universityId">University ID</Label>
                  <Input id="universityId" value={formData.universityId} onChange={handleChange} placeholder="12345678" />
                  {errors.universityId && <p className="text-sm text-destructive mt-1">{errors.universityId[0]}</p>}
                </div>
                
                <div>
                  <Label htmlFor="batchYear">Graduation Batch</Label>
                  <select 
                    id="batchYear" 
                    value={formData.batchYear} 
                    onChange={handleChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select your batch...</option>
                    <option value="2024">Class of 2024</option>
                    <option value="2025">Class of 2025</option>
                    <option value="2026">Class of 2026</option>
                    <option value="2027">Class of 2027</option>
                  </select>
                  {errors.batchYear && <p className="text-sm text-destructive mt-1">{errors.batchYear[0]}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="major">Major / Field of Study</Label>
                  <Input id="major" value={formData.major} onChange={handleChange} placeholder="Computer Science" />
                  {errors.major && <p className="text-sm text-destructive mt-1">{errors.major[0]}</p>}
                </div>
                <div>
                  <Label htmlFor="gpa">Current GPA (on a 4.0 scale)</Label>
                  <Input id="gpa" value={formData.gpa} onChange={handleChange} placeholder="3.8" />
                  {errors.gpa && <p className="text-sm text-destructive mt-1">{errors.gpa[0]}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="essay">Statement of Purpose</Label>
                <Textarea id="essay" value={formData.essay} onChange={handleChange} className="min-h-[180px]" placeholder="Tell us why you deserve this scholarship (min 50 words)..."/>
                {errors.essay && <p className="text-sm text-destructive mt-1">{errors.essay[0]}</p>}
              </div>

              {message && status === 'error' && <p className="text-sm text-destructive text-center">{message}</p>}
              
              <Button type="submit" className="w-full text-lg py-6" disabled={status === 'loading'}>
                {status === 'loading' ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>) : ('Submit Application')}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}