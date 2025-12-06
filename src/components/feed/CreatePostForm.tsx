'use client';

import React, { useRef, useState } from 'react';
import { createPost } from '@/app/(dashboard)/feed/actions'; 
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Paperclip, X, Image as ImageIcon, File as FileIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

type Attachment = {
  url: string;
  type: string;
  name: string;
};

export default function CreatePostForm() {
  const [isPending, setIsPending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<Attachment[]> => {
    const uploadedAttachments: Attachment[] = [];

    for (const file of selectedFiles) {
      const fileName = `${Date.now()}-${file.name.replaceAll(' ', '_')}`;
      
      const { data, error } = await supabase.storage
        .from('feed-uploads')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Failed to upload ${file.name}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('feed-uploads')
        .getPublicUrl(data.path);

      uploadedAttachments.push({
        url: publicUrl,
        type: file.type,
        name: file.name
      });
    }
    return uploadedAttachments;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(event.currentTarget);

    try {
      let attachments: Attachment[] = [];
      if (selectedFiles.length > 0) {
        attachments = await uploadFiles();
      }

      const result = await createPost(formData, attachments);

      if (result?.error) {
        toast.error(result.error);
      } else {
        formRef.current?.reset();
        setSelectedFiles([]);
        toast.success("Post shared successfully!");
      }
    } catch {
      // FIXED: Removed unused 'err' variable
      toast.error("Failed to upload files.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        name="content"
        placeholder="What's on your mind?"
        className="resize-none"
        disabled={isPending}
      />

      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative bg-gray-100 px-3 py-2 rounded-md flex items-center gap-2 text-sm border">
              {file.type.startsWith('image') ? <ImageIcon className="w-4 h-4 text-blue-500"/> : <FileIcon className="w-4 h-4 text-gray-500"/>}
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button 
                type="button" 
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center border-t pt-3">
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          Attach Media
        </Button>

        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Post
        </Button>
      </div>
    </form>
  );
}