'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { UserCircle, Trash2, Loader2, FileText, Download, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deletePost, createComment, deleteComment, fetchComment } from '@/app/(dashboard)/feed/actions';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Image from 'next/image';

type Attachment = { url: string; type: string; name: string; };

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  author: { name: string; roles: string[] };
};

type PostWithAuthor = {
  id: string;
  createdAt: Date;
  content: string;
  attachments: any;
  authorId: string;
  author: { name: string | null; roles: string[] };
  comments: Comment[];
};

interface PostCardProps {
  post: PostWithAuthor;
  currentUserId: string;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export default function PostCard({ post, currentUserId, isAdmin, onDelete }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const commentFormRef = useRef<HTMLFormElement>(null);

  const isMentor = post.author.roles.includes('mentor');
  const badgeColor = isMentor ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  const roleLabel = isMentor ? 'Mentor' : 'Scholar';

  const canDeletePost = currentUserId === post.authorId || isAdmin;

  // --- REALTIME COMMENTS SUBSCRIPTION ---
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${post.id}`) // Unique channel per post
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'Comment', // Ensure this matches your DB table name exactly (Case Sensitive!)
          filter: `postId=eq.${post.id}`, // Only listen for this specific post
        },
        async (payload) => {
          // 1. Handle New Comment
          if (payload.eventType === 'INSERT') {
            // Fetch author details since Supabase only sends raw data
            const newComment = await fetchComment(payload.new.id);
            if (newComment) {
               setComments((prev) => {
                 // Avoid duplicates if I just created it
                 if (prev.some(c => c.id === newComment.id)) return prev;
                 return [...prev, newComment];
               });
               // Optional: Show toast if it's not my own comment
               if (newComment.authorId !== currentUserId) {
                 toast.success('New comment');
               }
            }
          } 
          // 2. Handle Delete
          if (payload.eventType === 'DELETE') {
             setComments((prev) => prev.filter(c => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [post.id, currentUserId]);

  // --- DELETE POST LOGIC ---
  const performDelete = async () => {
    setIsDeleting(true);
    const result = await deletePost(post.id);
    if (result.success) { 
      onDelete(post.id); 
      toast.success('Post deleted'); 
    } else { 
      toast.error(result.error || 'Failed'); 
      setIsDeleting(false); 
    }
  };

  const handleDeleteClick = () => {
    toast((t) => (
      <div className="flex flex-col gap-2 p-1">
        <p className="font-medium text-sm text-gray-800">Delete this post?</p>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" className="h-7 px-3 text-xs" onClick={() => { toast.dismiss(t.id); performDelete(); }}>Delete</Button>
          <Button variant="outline" size="sm" className="h-7 px-3 text-xs" onClick={() => toast.dismiss(t.id)}>Cancel</Button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  // --- COMMENT LOGIC ---
  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCommenting(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await createComment(post.id, formData);
    if (result.success && result.comment) {
      commentFormRef.current?.reset();
      // We add it locally immediately for speed (Realtime will skip duplicate)
      setComments(prev => [...prev, result.comment!]);
      if (!showComments) setShowComments(true);
      toast.success('Comment added'); 
    } else {
      toast.error(result.error || 'Failed');
    }
    setIsCommenting(false);
  };

  const performCommentDelete = async (commentId: string) => {
    const result = await deleteComment(commentId);
    if (result.success) {
      // Remove locally immediately
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } else {
      toast.error('Failed to delete comment');
    }
  };

  const handleCommentDeleteClick = (commentId: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2 p-1">
        <p className="font-medium text-sm text-gray-800">Delete this comment?</p>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            size="sm" 
            className="h-7 px-3 text-xs" 
            onClick={() => { 
              toast.dismiss(t.id); 
              performCommentDelete(commentId); 
            }}
          >
            Delete
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-3 text-xs" 
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </Button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const attachments = (post.attachments as Attachment[]) || [];

  return (
    <Card className="hover:bg-slate-50 transition-colors relative group mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 p-2 rounded-full">
               <UserCircle className="h-6 w-6 text-gray-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{post.author.name || 'Unknown User'}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>{roleLabel}</span>
              </div>
              <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {canDeletePost && (
             <Button variant="ghost" size="icon" onClick={handleDeleteClick} disabled={isDeleting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
             </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800 mb-4">{post.content}</p>
        
        {attachments.length > 0 && (
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 mt-2">
            {attachments.map((file, idx) => (
              file.type.startsWith('image/') ? 
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border bg-black/5">
                  <Image src={file.url} alt="Attachment" fill className="object-contain" />
                </div>
              : 
                <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 border rounded bg-white text-sm text-blue-600">
                  <FileText className="h-4 w-4" /> {file.name}
                </a>
            ))}
          </div>
        )}
      </CardContent>

      {/* Comments Section */}
      <CardFooter className="flex flex-col items-stretch border-t pt-3 bg-gray-50/50">
        <div className="flex items-center justify-between w-full mb-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-2" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-4 w-4" />
            {comments.length} Comments
          </Button>
        </div>

        {showComments && (
          <div className="space-y-3 mb-4 w-full">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2 text-sm group/comment">
                <div className="font-semibold text-xs min-w-max">{comment.author.name}:</div>
                <div className="flex-1 text-gray-700 break-all bg-white p-2 rounded-md border flex justify-between items-start">
                  <span>{comment.content}</span>
                  {(currentUserId === comment.authorId || isAdmin) && (
                    <button 
                      onClick={() => handleCommentDeleteClick(comment.id)} 
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-opacity ml-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className="text-xs text-gray-400 italic pl-2">No comments yet.</p>}
          </div>
        )}

        <form ref={commentFormRef} onSubmit={handleCommentSubmit} className="flex gap-2 w-full">
          <Input name="comment" placeholder="Write a comment..." className="h-9 text-sm bg-white" autoComplete="off" />
          <Button type="submit" size="sm" disabled={isCommenting} className="h-9 w-9 p-0">
            {isCommenting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}