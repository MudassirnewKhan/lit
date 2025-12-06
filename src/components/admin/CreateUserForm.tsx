'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUser } from '@/app/admin/users/actions'; // Check if path needs (admin) group
import { Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateUserForm({ isMainAdmin }: { isMainAdmin: boolean }) {
  const [isPending, setIsPending] = useState(false);
  // 1. Add state to track the selected role so we can conditionally show the batch dropdown
  const [selectedRole, setSelectedRole] = useState("mentor");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await createUser(formData);

    if (result.error) {
      toast.error(result.error ?? "Something went wrong");
    } else {
      toast.success(result.message ?? "User created successfully");
      formRef.current?.reset();
      // Reset role to default after success
      setSelectedRole("mentor");
    }

    setIsPending(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input name="firstName" placeholder="Jane" required />
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input name="lastName" placeholder="Doe" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Email Address</Label>
        <Input name="email" type="email" placeholder="jane@example.com" required />
      </div>

      <div className="space-y-2">
        <Label>Assign Password</Label>
        <Input name="password" type="password" placeholder="••••••" required />
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        {/* 2. Update state when value changes */}
        <Select 
          name="role" 
          value={selectedRole} 
          onValueChange={setSelectedRole} 
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mentor">Mentor</SelectItem>
            <SelectItem value="sponsor">Sponsor</SelectItem>
            <SelectItem value="awardee">Student</SelectItem>

            {/* Show Sub-admin only for main admin */}
            {isMainAdmin && (
              <SelectItem value="subadmin">Staff (Sub-admin)</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* 3. CONDITIONAL BATCH DROPDOWN */}
      {selectedRole === 'awardee' && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
          <Label className="text-blue-600 font-semibold">Graduation Batch (Required)</Label>
          {/* Using native select for simpler 'required' validation with FormData */}
          <select
            name="batchYear"
            required
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
             <option value="">Select Batch...</option>
             <option value="2024">Class of 2024</option>
             <option value="2025">Class of 2025</option>
             <option value="2026">Class of 2026</option>
             <option value="2027">Class of 2027</option>
          </select>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Create Account
          </>
        )}
      </Button>
    </form>
  );
}