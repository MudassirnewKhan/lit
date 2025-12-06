'use client';

import { useState } from 'react';
import { deleteMeeting } from '@/app/mentorship/actions';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeleteMeetingButton({ meetingId }: { meetingId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to cancel this session?")) return;

    setIsDeleting(true);
    const result = await deleteMeeting(meetingId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message ?? "Meeting cancelled");
    }
    setIsDeleting(false);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-destructive hover:bg-destructive/10 h-8 w-8"
      title="Cancel Session"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}