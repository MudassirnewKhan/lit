'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Added Label for better form UI
import { Pencil, Trash2, Plus } from 'lucide-react'; // Added Plus icon
import { updateAlumni, deleteAlumni, addAlumni } from '@/app/alumni/actions'; // Import addAlumni
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AlumniRecord = {
  id: string;
  fullName: string;      
  batchYear: string | null;
  userId?: string | null; 
  photoUrl?: string | null;
};

interface AlumniListProps {
  groupedAlumni: Record<string, AlumniRecord[]>; 
  isAdmin: boolean;
}

export default function AlumniList({ groupedAlumni, isAdmin }: AlumniListProps) {
  // State for Editing
  const [editingAlum, setEditingAlum] = useState<AlumniRecord | null>(null);
  
  // State for Adding
  const [isAdding, setIsAdding] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. HANDLE ADD (New) ---
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await addAlumni(formData);

    if (result.success) {
      toast.success('Scholar added successfully!');
      setIsAdding(false); // Close modal
    } else {
      toast.error('Failed to add scholar.');
    }
    setIsLoading(false);
  };

  // --- 2. HANDLE UPDATE ---
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAlum) return;
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateAlumni(editingAlum.id, {
      fullName: formData.get('fullName') as string,
      batchYear: formData.get('batchYear') as string,
    });

    if (result.success) {
      toast.success('Record updated!');
      setEditingAlum(null);
    } else {
      toast.error('Failed to update.');
    }
    setIsLoading(false);
  };

  // --- 3. HANDLE DELETE ---
  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure? This deletes the HISTORY record permanently.")) return;
    const result = await deleteAlumni(id);
    if(result.success) toast.success("Record removed");
    else toast.error("Failed to remove");
  };

  const sortedYears = Object.keys(groupedAlumni).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-8">
      
      {/* --- ADD BUTTON (Admin Only) --- */}
      {isAdmin && (
        <div className="flex justify-end">
           <Button onClick={() => setIsAdding(true)} className="gap-2 bg-green-600 hover:bg-green-700">
             <Plus className="h-4 w-4" /> Add Manual Record
           </Button>
        </div>
      )}

      {/* --- ADD MODAL --- */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Scholar (History)</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
             <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="fullName" placeholder="e.g. John Doe" required />
             </div>
             <div className="space-y-2">
                <Label>Batch Year</Label>
                <Input name="batchYear" type="number" placeholder="e.g. 2018" required />
             </div>
             <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Record'}
             </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- EDIT MODAL --- */}
      <Dialog open={!!editingAlum} onOpenChange={(open) => !open && setEditingAlum(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit History Record</DialogTitle>
            </DialogHeader>
            {editingAlum && (
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input name="fullName" defaultValue={editingAlum.fullName} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Batch Year</Label>
                        <Input name="batchYear" type="number" defaultValue={editingAlum.batchYear || ''} required />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setEditingAlum(null)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                </form>
            )}
        </DialogContent>
      </Dialog>

      {/* --- LIST VIEW --- */}
      {sortedYears.map((year) => (
        <section key={year} className="relative">
          <div className="flex items-center gap-4 mb-6">
             <h2 className="text-2xl font-bold text-gray-800">Class of {year}</h2>
             <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {groupedAlumni[year].map((alum) => (
              <Card key={alum.id} className="relative group hover:shadow-md transition-all border-l-4 border-l-blue-500">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={alum.photoUrl || ""} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                        {alum.fullName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    {/* LINK LOGIC: Only link if userId exists */}
                    {alum.userId ? (
                         <Link href={`/profile/${alum.userId}`} className="font-semibold text-gray-900 hover:underline hover:text-blue-600">
                            {alum.fullName}
                         </Link>
                    ) : (
                        <h3 className="font-semibold text-gray-900 cursor-default">{alum.fullName}</h3>
                    )}
                    <p className="text-xs text-muted-foreground">Scholar</p>
                  </div>

                  {/* ADMIN CONTROLS */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => setEditingAlum(alum)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleDelete(alum.id)}>
                          <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {sortedYears.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground">No history records found.</p>
        </div>
      )}
    </div>
  );
}