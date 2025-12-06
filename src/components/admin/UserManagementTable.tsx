'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Key, Save, X } from 'lucide-react';
import { deleteUser, resetUserPassword } from '@/app/admin/users/actions';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  createdAt: Date;
  roles: { role: string }[];
};

interface Props {
  users: User[];
  roleLabel: string;
  currentUserId?: string;
  isMainAdmin: boolean;
}

export default function UserManagementTable({ users, roleLabel, currentUserId, isMainAdmin }: Props) {
  const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
  
  const performDelete = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
      toast.success(result.message || 'User deleted');
    } else {
      toast.error(result.error || 'Failed to delete');
    }
  };

  const handleDeleteClick = (userId: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2 p-1">
        <p className="font-medium text-sm text-gray-800">Permanently delete?</p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" className="h-7 px-3 text-xs" onClick={() => toast.dismiss(t.id)}>Cancel</Button>
          <Button variant="destructive" size="sm" className="h-7 px-3 text-xs" onClick={() => { toast.dismiss(t.id); performDelete(userId); }}>Delete</Button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await resetUserPassword(formData);
    
    if (result.success) { 
      toast.success(result.message || 'Password reset'); 
      setEditingPasswordId(null); 
    } else { 
      toast.error(result.error || 'Failed'); 
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-4">{roleLabel} Directory</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isTargetStaff = user.roles.some(r => ['admin', 'subadmin'].includes(r.role));
            const isSelf = user.id === currentUserId;

            // PERMISSION LOGIC:
            // 1. Can never edit self.
            // 2. If I am Sub-admin (Not Main Admin), I CANNOT edit other Staff (Admin or Sub-admin).
            let canEdit = true;
            
            if (!isMainAdmin && isTargetStaff) {
                canEdit = false;
            }
            if (isSelf) canEdit = false;

            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.roles.map(r => (
                    <Badge key={r.role} variant="outline" className="mr-1 uppercase text-[10px]">{r.role}</Badge>
                  ))}
                </TableCell>
                <TableCell className="text-right">
                  {canEdit ? (
                    editingPasswordId === user.id ? (
                      <form onSubmit={handlePasswordReset} className="flex items-center justify-end gap-2">
                        <input type="hidden" name="userId" value={user.id} />
                        <Input name="newPassword" placeholder="New Pass" className="w-24 h-8 text-xs" required />
                        <Button type="submit" size="icon" className="h-8 w-8 bg-green-600 hover:bg-green-700"><Save className="h-4 w-4" /></Button>
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingPasswordId(null)}><X className="h-4 w-4" /></Button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingPasswordId(user.id)}><Key className="h-4 w-4 text-orange-500" /></Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(user.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                        {isSelf ? 'You' : 'Protected'}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {users.length === 0 && (
             <TableRow>
               <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                 No users found in this category.
               </TableCell>
             </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}