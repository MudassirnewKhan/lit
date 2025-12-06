'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createResource } from '@/app/resources/actions';
import { Loader2, Upload, FileUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResourceUploadForm() {
  const [isPending, setIsPending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    setIsPending(true);
    const formData = new FormData(e.currentTarget);

    try {
      // 1. Upload to Supabase
      const fileName = `${Date.now()}-${selectedFile.name.replaceAll(' ', '_')}`;
      const { data, error: uploadError } = await supabase.storage
        .from('resource-files') // Ensure this bucket exists!
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Get URL
      const { data: { publicUrl } } = supabase.storage
        .from('resource-files')
        .getPublicUrl(data.path);

      // 3. Save to Database
      const result = await createResource(formData, publicUrl, selectedFile.type);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        formRef.current?.reset();
        setSelectedFile(null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="mb-8 border-l-4 border-l-orange-500 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileUp className="w-5 h-5 text-orange-600" />
          Share a Resource
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="e.g. Java Programming Notes" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic Notes</SelectItem>
                  <SelectItem value="Career">Career & Jobs</SelectItem>
                  <SelectItem value="Policy">Policy & Guidelines</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Briefly describe this resource..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File (PDF, Doc, Image)</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange} 
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                required 
                className="cursor-pointer"
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-full bg-orange-600 hover:bg-orange-700">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4 mr-2" /> Upload Resource</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}