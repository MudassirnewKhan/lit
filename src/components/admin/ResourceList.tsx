'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, ExternalLink } from 'lucide-react';
import { deleteResource } from '@/app/resources/actions'
import toast from 'react-hot-toast';

export default function ResourceList({ initialResources }: { initialResources: any[] }) {
  const handleDelete = async (id: string) => {
    if(confirm('Delete this resource?')) {
      const result = await deleteResource(id);
      if (result.success) {
        toast.success('Resource deleted');
      } else {
        toast.error('Failed to delete');
      }
    }
  };

  if (initialResources.length === 0) {
    return <p className="text-muted-foreground text-sm italic">No resources uploaded yet.</p>;
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      {initialResources.map((res) => (
        <div key={res.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-lg bg-white hover:bg-slate-50 transition-colors">
          
          <div className="flex items-start gap-3 mb-2 sm:mb-0">
            <div className="bg-blue-50 p-2 rounded">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900 line-clamp-1">{res.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded-full text-gray-700 font-medium">
                  {res.category}
                </span>
                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                >
                  View Link <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDelete(res.id)} 
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete Resource"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}