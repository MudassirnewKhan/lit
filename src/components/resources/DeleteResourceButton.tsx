'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { deleteResource } from '@/app/resources/actions'; // Ensure path is correct
import toast from 'react-hot-toast';

export default function DeleteResourceButton({ id }: { id: string }) {
  const handleDelete = async () => {
    // We use confirm here because it's inside a server component page, 
    // so we can't easily use our complex Toast UI without more prop drilling.
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    const result = await deleteResource(id);
    
    if (result.success) {
      // FIX: Add fallback string '|| "..."' to satisfy TypeScript
      toast.success(result.message || 'Resource deleted successfully');
    } else {
      // FIX: Add fallback string here too
      toast.error(result.error || 'Failed to delete resource');
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="ml-2 text-gray-400 hover:text-red-600 transition-colors p-1"
      title="Delete Resource"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}