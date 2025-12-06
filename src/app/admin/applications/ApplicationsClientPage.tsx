'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { approveApplication, rejectApplication } from './actions';
import { Loader2 } from 'lucide-react';
// --- FIX 1: Import toast ---
import toast from 'react-hot-toast';

type Application = {
  id: string;
  fullName: string;
  email: string;
  submittedAt: string | Date;
  status: string;
};

export default function ApplicationsClientPage({ initialApplications }: { initialApplications: Application[] }) {
  const [applications, setApplications] = useState(initialApplications);
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: 'approve' | 'reject', applicationId: string) => {
    // We start a promise toast! 
    // This shows "Loading...", then "Success!" or "Error" automatically.
    const promise = new Promise(async (resolve, reject) => {
      startTransition(async () => {
        const result = action === 'approve'
          ? await approveApplication(applicationId)
          : await rejectApplication(applicationId);
        
        if (result.success) {
          setApplications(apps => apps.filter(app => app.id !== applicationId));
          resolve(result.message);
        } else {
          reject(new Error(result.error));
        }
      });
    });

    // --- FIX 2: Use toast.promise ---
    toast.promise(promise, {
      loading: action === 'approve' ? 'Approving application...' : 'Rejecting application...',
      success: (msg: any) => `${msg}`,
      error: (err: any) => `Error: ${err.message}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scholarship Applications</CardTitle>
        <CardDescription>Review and process all pending applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.fullName}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>
                    {new Date(app.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction('approve', app.id)}
                      disabled={isPending}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleAction('reject', app.id)}
                      disabled={isPending}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No pending applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}