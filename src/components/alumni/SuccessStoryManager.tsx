'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Pencil, Trash2, PlusCircle, Linkedin, Mail, Phone } from 'lucide-react';
import { addSuccessStory, updateSuccessStory, deleteSuccessStory } from '@/app/alumni/actions';
import toast from 'react-hot-toast';

// Matches your Schema
type Story = {
  id: string;
  fullName: string;
  achievement: string;
  batchYear: string;
  email?: string | null;
  phoneNumber?: string | null;
  linkedIn?: string | null;
  image?: string | null;
};

interface ManagerProps {
  stories: Story[];
  isAdmin: boolean;
}

export default function SuccessStoryManager({ stories, isAdmin }: ManagerProps) {
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Group by Year for Tabs
  const grouped = stories.reduce((acc, story) => {
    const year = story.batchYear;
    if (!acc[year]) acc[year] = [];
    acc[year].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));
  const defaultTab = years.length > 0 ? years[0] : undefined;

  // HANDLERS
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await addSuccessStory(new FormData(e.currentTarget));
    if (res.success) { toast.success('Added!'); setIsAdding(false); }
    else toast.error('Failed');
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStory) return;
    const res = await updateSuccessStory(editingStory.id, new FormData(e.currentTarget));
    if (res.success) { toast.success('Updated!'); setEditingStory(null); }
    else toast.error('Failed');
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this story?")) return;
    const res = await deleteSuccessStory(id);
    if(res.success) toast.success('Deleted');
  };

  return (
    <div className="w-full">
      {/* ADD BUTTON (Admin Only) */}
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <PlusCircle className="h-4 w-4" /> Add Success Story
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add New Success Story</DialogTitle></DialogHeader>
              <StoryForm onSubmit={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* TABS VIEW */}
      {years.length === 0 ? (
        <p className="text-center text-muted-foreground">No success stories yet.</p>
      ) : (
        <Tabs defaultValue={defaultTab} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <TabsList>
              {years.map((year) => (
                <TabsTrigger key={year} value={year}>{year}</TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {years.map((year) => (
            <TabsContent key={year} value={year} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[year].map((story) => (
                  <Card key={story.id} className="relative group hover:shadow-lg transition-all border-l-4 border-l-yellow-500">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                             <Star className="h-4 w-4 text-yellow-500" /> {story.fullName}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium mt-1">{story.achievement}</p>
                          
                          {/* Contact Icons */}
                          <div className="flex gap-3 mt-3">
                             {story.linkedIn && <a href={story.linkedIn} target="_blank" className="text-blue-600 hover:scale-110 transition"><Linkedin className="h-4 w-4"/></a>}
                             {story.email && isAdmin && <a href={`mailto:${story.email}`} className="text-gray-600 hover:scale-110 transition"><Mail className="h-4 w-4"/></a>}
                          </div>
                        </div>

                        {/* ADMIN ACTIONS */}
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => setEditingStory(story)}>
                              <Pencil className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(story.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* EDIT MODAL */}
      <Dialog open={!!editingStory} onOpenChange={(open) => !open && setEditingStory(null)}>
        <DialogContent className="max-w-lg">
           <DialogHeader><DialogTitle>Edit Success Story</DialogTitle></DialogHeader>
           {editingStory && <StoryForm onSubmit={handleUpdate} defaultValues={editingStory} isEdit />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reusable Form Component
function StoryForm({ onSubmit, defaultValues, isEdit }: { onSubmit: any, defaultValues?: any, isEdit?: boolean }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
           <Label>Full Name</Label>
           <Input name="fullName" defaultValue={defaultValues?.fullName} required />
        </div>
        <div className="space-y-2">
           <Label>Batch Year</Label>
           <Input name="batchYear" type="number" defaultValue={defaultValues?.batchYear} required />
        </div>
      </div>
      
      <div className="space-y-2">
         <Label>Achievement / Designation</Label>
         <Input name="achievement" placeholder="e.g. PhD, Oxford University" defaultValue={defaultValues?.achievement} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
           <Label>LinkedIn URL (Optional)</Label>
           <Input name="linkedIn" placeholder="https://linkedin.com/in/..." defaultValue={defaultValues?.linkedIn} />
        </div>
        <div className="space-y-2">
           <Label>Phone (Optional - Admin Only)</Label>
           <Input name="phoneNumber" defaultValue={defaultValues?.phoneNumber} />
        </div>
      </div>

      <div className="space-y-2">
         <Label>Email (Optional)</Label>
         <Input name="email" type="email" defaultValue={defaultValues?.email} />
      </div>

      <Button type="submit" className="w-full">
         {isEdit ? 'Save Changes' : 'Add Story'}
      </Button>
    </form>
  );
}