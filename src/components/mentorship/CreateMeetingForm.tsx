'use client';

import { useState, useRef } from 'react';
import { createMeeting } from '@/app/mentorship/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateMeetingForm() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await createMeeting(formData);

    if (result.error) {
      toast.error(result.error ?? "An error occurred");
    } else {
      toast.success(result.message ?? "Meeting created successfully");
      setOpen(false); 
      formRef.current?.reset();
    }

    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Schedule Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Mentorship Session</DialogTitle>
        </DialogHeader>
        
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Topic / Title</Label>
              <Input id="title" name="title" placeholder="Weekly Check-in" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Meeting Link</Label>
              <Input id="link" name="link" placeholder="Zoom / Google Meet URL" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time</Label>
              <Input id="date" name="date" type="datetime-local" required />
            </div>
             {/* --- THIS IS THE MISSING FIELD --- */}
            <div className="space-y-2">
              <Label htmlFor="targetBatch" className="text-purple-600 font-semibold">Target Audience</Label>
              <select
                id="targetBatch"
                name="targetBatch"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="all">Everyone (Public)</option>
                <option value="2024">Class of 2024</option>
                <option value="2025">Class of 2025</option>
                <option value="2026">Class of 2026</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" name="description" placeholder="Agenda for the session..." />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Schedule Session'}
          </Button>
          
        </form>
      </DialogContent>
    </Dialog>
  );
}