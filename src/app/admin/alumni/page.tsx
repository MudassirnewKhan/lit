'use client';

import { useState } from 'react';
import { createAlumniEntry } from './actions'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function ManageAlumniPage() {
  const [category, setCategory] = useState("AWARDEE");

  async function handleSubmit(formData: FormData) {
    formData.append('category', category);
    
    const res = await createAlumniEntry(formData);
    
    if (res.success) {
      toast.success(res.message ?? "Entry added successfully!");
      // Optional: Reset form via ref or simple reload
    } else {
      toast.error(res.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Alumni Content</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select onValueChange={setCategory} defaultValue="AWARDEE">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AWARDEE">Awardee List</SelectItem>
                  <SelectItem value="SUCCESS_STORY">Successful Scholar</SelectItem>
                  <SelectItem value="TESTIMONIAL">Testimonial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="fullName" placeholder="e.g. Priya Sharma" required />
              </div>
              <div className="space-y-2">
                <Label>Year / Batch</Label>
                <Input name="batchYear" placeholder="e.g. 2024-25" required />
              </div>
            </div>

            {category === 'AWARDEE' && (
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input name="institution" placeholder="e.g. IIT Bombay" required />
              </div>
            )}

            {category === 'SUCCESS_STORY' && (
              <div className="space-y-2">
                <Label>Achievement / Role</Label>
                <Input name="achievement" placeholder="e.g. PhD, Boston University" required />
              </div>
            )}

            {category === 'TESTIMONIAL' && (
              <>
                <div className="space-y-2">
                  <Label>Quote</Label>
                  <Textarea name="quote" placeholder="The LIT program was transformative..." required />
                </div>
                <div className="space-y-2">
                  <Label>Photo URL</Label>
                  <Input name="photoUrl" placeholder="https://..." />
                </div>
              </>
            )}

            <Button type="submit" className="w-full bg-blue-600">Add to Website</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}