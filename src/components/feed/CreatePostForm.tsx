'use client';

import React, { useRef, useState } from 'react';
import { createPost } from '@/app/(dashboard)/feed/actions'; 
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, X, Image as ImageIcon, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { getInitials, getRoleBadge } from '@/lib/utils';
import Image from 'next/image';

type Attachment = {
  url: string;
  type: string;
  name: string;
};

interface CreatePostFormProps {
  currentUser?: {
    name?: string | null;
    roles?: string[];
  };
}

export default function CreatePostForm({ currentUser }: CreatePostFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [content, setContent] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<Attachment[]> => {
    const uploadedAttachments: Attachment[] = [];

    for (const file of selectedFiles) {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${sanitizedName}`;
      
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
    if (!content.trim() && selectedFiles.length === 0) {
      toast.error("Please enter a message or attach a file.");
      return;
    }

    setIsPending(true);
    const formData = new FormData();
    formData.set('content', content);

    try {
      let attachments: Attachment[] = [];
      if (selectedFiles.length > 0) {
        attachments = await uploadFiles();
      }

      const result = await createPost(formData, attachments);

      if (result?.error) {
        toast.error(result.error);
      } else {
        setContent('');
        setSelectedFiles([]);
        toast.success("Post shared with community!");
      }
    } catch {
      toast.error("Failed to upload files. Ensure storage is accessible.");
    } finally {
      setIsPending(false);
    }
  };

  const role = getRoleBadge(currentUser?.roles ?? []);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      {/* Author Header */}
      {currentUser && (
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
            {getInitials(currentUser.name)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-900">{currentUser.name || 'You'}</span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium border ${role.colorClass}`}>
              {role.label}
            </span>
          </div>
        </div>
      )}

      <Textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share an update, announcement, or question with the LIT community..."
        className="resize-none min-h-[90px] border-gray-200 focus-visible:ring-purple-500 text-sm rounded-lg"
        disabled={isPending}
      />

      {/* Selected Attachments Preview */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedFiles.map((file, index) => {
            const isImage = file.type.startsWith('image/');
            const previewUrl = isImage ? URL.createObjectURL(file) : null;

            return (
              <div
                key={index}
                className="relative bg-gray-50 border border-gray-200 rounded-lg p-1.5 flex items-center gap-2 text-xs shadow-2xs group"
              >
                {isImage && previewUrl ? (
                  <div className="relative w-8 h-8 rounded overflow-hidden shrink-0 bg-gray-100">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <FileText className="w-5 h-5 text-purple-600 shrink-0 ml-1" />
                )}
                <span className="max-w-[130px] truncate text-gray-700 font-medium">{file.name}</span>
                <button 
                  type="button" 
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-600 p-0.5 rounded cursor-pointer transition-colors"
                  title="Remove attachment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
        {/* Hidden File Inputs */}
        <input
          type="file"
          accept="image/*"
          multiple
          ref={imageInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt,.csv"
          multiple
          ref={docInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-gray-600 hover:text-purple-700 hover:bg-purple-50 h-8 px-2.5 rounded-lg"
            onClick={() => imageInputRef.current?.click()}
            disabled={isPending}
          >
            <ImageIcon className="h-4 w-4 mr-1.5 text-purple-600" />
            Add Photo
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-gray-600 hover:text-purple-700 hover:bg-purple-50 h-8 px-2.5 rounded-lg"
            onClick={() => docInputRef.current?.click()}
            disabled={isPending}
          >
            <FileText className="h-4 w-4 mr-1.5 text-indigo-600" />
            Attach File
          </Button>
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={isPending || (!content.trim() && selectedFiles.length === 0)}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 h-8 px-4 rounded-lg text-xs font-medium"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          Post
        </Button>
      </div>
    </form>
  );
}