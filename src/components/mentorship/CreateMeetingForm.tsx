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
import { Loader2, Plus, Sparkles, Video } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateMeetingForm({ defaultMeetingLink = '' }: { defaultMeetingLink?: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [deptOption, setDeptOption] = useState('all');
  const [customDept, setCustomDept] = useState('');
  const [meetingLink, setMeetingLink] = useState(defaultMeetingLink || '');
  const formRef = useRef<HTMLFormElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !meetingLink && defaultMeetingLink) {
      setMeetingLink(defaultMeetingLink);
    }
  };

  const handleAutoGenerate = () => {
    const code = Math.random().toString(36).substring(2, 8);
    const autoUrl = `https://meet.jit.si/LIT-Mentorship-${code}`;
    setMeetingLink(autoUrl);
    toast.success("Auto-generated instant meeting room!");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    
    // Resolve targetDepartment: custom text if selected, else the dropdown value
    const finalDept = deptOption === 'custom' ? customDept.trim() : deptOption;
    formData.set('targetDepartment', finalDept);
    
    // Ensure meeting link is set (even if user cleared it, fall back to default or auto-generate)
    if (!meetingLink.trim()) {
      const code = Math.random().toString(36).substring(2, 8);
      formData.set('link', defaultMeetingLink || `https://meet.jit.si/LIT-Mentorship-${code}`);
    } else {
      formData.set('link', meetingLink.trim());
    }

    const result = await createMeeting(formData);

    if (result.error) {
      toast.error(result.error ?? "An error occurred");
    } else {
      toast.success(result.message ?? "Meeting created successfully");
      setOpen(false); 
      formRef.current?.reset();
      setDeptOption('all');
      setCustomDept('');
      setMeetingLink(defaultMeetingLink || '');
    }

    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Schedule Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Schedule New Mentorship Session</DialogTitle>
        </DialogHeader>
        
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Topic / Title</Label>
              <Input id="title" name="title" placeholder="e.g. GRE Prep & SOP Review" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="link">Meeting Link</Label>
                <button
                  type="button"
                  onClick={handleAutoGenerate}
                  className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                  title="Generate a 1-click video conference room"
                >
                  <Sparkles className="h-3 w-3" /> Auto-generate
                </button>
              </div>
              <Input 
                id="link" 
                name="link" 
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="Google Meet, Zoom, or Auto-generated" 
              />
              {defaultMeetingLink && meetingLink === defaultMeetingLink && (
                <p className="text-[11px] text-green-700 font-medium flex items-center gap-1">
                  ✓ Pre-filled with your saved meeting link
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input id="date" name="date" type="datetime-local" required />
          </div>

          {/* --- AUDIENCE TARGETING: YEAR & DEPARTMENT --- */}
          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-lg space-y-3">
            <p className="text-xs font-semibold text-purple-900 uppercase tracking-wider">
              Audience Targeting & Notifications
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Year / Batch Target */}
              <div className="space-y-1.5">
                <Label htmlFor="targetBatch" className="text-xs font-medium text-purple-950">
                  Target Batch (Year-wise)
                </Label>
                <select
                  id="targetBatch"
                  name="targetBatch"
                  className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Batches (Open to All)</option>
                  <option value="2024">Class of 2024</option>
                  <option value="2025">Class of 2025</option>
                  <option value="2026">Class of 2026</option>
                  <option value="2027">Class of 2027</option>
                  <option value="2028">Class of 2028</option>
                </select>
              </div>

              {/* Department Target */}
              <div className="space-y-1.5">
                <Label htmlFor="targetDeptSelect" className="text-xs font-medium text-purple-950">
                  Target Department (Field-wise)
                </Label>
                <select
                  id="targetDeptSelect"
                  value={deptOption}
                  onChange={(e) => setDeptOption(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Departments (General)</option>
                  <option value="Computer Science">Computer Science & IT</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Business">Business & Management</option>
                  <option value="Medicine">Medicine & Health Sciences</option>
                  <option value="Data Science">Data Science & AI</option>
                  <option value="custom">Other / Custom Department...</option>
                </select>
              </div>
            </div>

            {/* Custom Department Input */}
            {deptOption === 'custom' && (
              <div className="space-y-1.5 pt-1">
                <Label htmlFor="customDept" className="text-xs text-purple-900">
                  Specify Department Name
                </Label>
                <Input
                  id="customDept"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  placeholder="e.g. Chemical Engineering, Biotechnology"
                  className="bg-white h-9 text-sm"
                  required
                />
              </div>
            )}

            <p className="text-[11px] text-purple-700/80 leading-normal">
              📧 Matching scholars will automatically receive an invitation email with the Google Meet link, and the session will be visible on their Mentorship Hub.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Agenda / Description (Optional)</Label>
            <Input id="description" name="description" placeholder="Brief agenda or instructions for attendees..." />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Schedule & Notify Scholars'}
          </Button>
          
        </form>
      </DialogContent>
    </Dialog>
  );
}