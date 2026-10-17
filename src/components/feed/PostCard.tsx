'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Trash2, Loader2, FileText, MessageCircle, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deletePost, createComment, deleteComment, fetchComment } from '@/app/(dashboard)/feed/actions';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { formatRelativeTime, getRoleBadge, getInitials } from '@/lib/utils';

// ✅ IMPORT SHARED TYPES
import type { PostWithAuthor, Comment } from '@/types/feed';

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

  const role = getRoleBadge(post.author.roles ?? []);
  const canDeletePost = currentUserId === post.authorId || isAdmin;

  // Realtime comments listener
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${post.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Comment', filter: `postId=eq.${post.id}` },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newComment = await fetchComment(payload.new.id);
            if (newComment) {
              setComments((prev) =>
                prev.some((c) => c.id === newComment.id) ? prev : [...prev, newComment]
              );
            }
          }

          if (payload.eventType === 'DELETE') {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [post.id]);

  const performDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    const result = await deletePost(post.id);

    if (result.success) {
      onDelete(post.id);
      toast.success('Post deleted');
    } else {
      toast.error(result.error || 'Failed to delete');
      setIsDeleting(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input[name="comment"]') as HTMLInputElement;
    const content = input?.value?.trim();

    if (!content) return;
    setIsCommenting(true);

    const formData = new FormData(form);
    const result = await createComment(post.id, formData);

    if (result.success && result.comment) {
      commentFormRef.current?.reset();
      setComments((prev) => [...prev, result.comment]);
      if (!showComments) setShowComments(true);
      toast.success('Comment added');
    } else {
      toast.error(result.error || 'Failed to add comment');
    }

    setIsCommenting(false);
  };

  const performCommentDelete = async (commentId: string) => {
    const result = await deleteComment(commentId);

    if (result.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment deleted');
    } else {
      toast.error(result.error || 'Failed to delete comment');
    }
  };

  const attachments = post.attachments ?? [];

  return (
    <Card className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 mb-5 overflow-hidden">
      <CardHeader className="pb-3 pt-4 px-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.authorId}`} className="group/avatar flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm group-hover/avatar:ring-2 ring-purple-300 transition-all">
                {getInitials(post.author.name)}
              </div>
            </Link>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/profile/${post.authorId}`}
                  className="font-semibold text-sm text-gray-900 hover:text-purple-600 hover:underline transition-colors"
                >
                  {post.author.name || 'Community Member'}
                </Link>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${role.colorClass}`}
                >
                  {role.label}
                </span>
              </div>
              <p
                className="text-xs text-muted-foreground mt-0.5"
                title={new Date(post.createdAt).toLocaleString()}
              >
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>

          {canDeletePost && (
            <Button
              variant="ghost"
              size="icon"
              onClick={performDelete}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 transition-colors"
              title="Delete post"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-1">
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-gray-800">
          {post.content}
        </p>

        {attachments.length > 0 && (
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 mt-3 pt-2">
            {attachments.map((file, idx) =>
              file.type.startsWith('image/') ? (
                <div
                  key={idx}
                  className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shadow-inner group/img"
                >
                  <Image
                    src={file.url}
                    alt="Post media"
                    fill
                    className="object-cover group-hover/img:scale-102 transition-transform duration-200"
                  />
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-md text-xs opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" /> View Full
                  </a>
                </div>
              ) : (
                <a
                  key={idx}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded-lg bg-gray-50/80 hover:bg-purple-50 hover:border-purple-200 text-sm text-gray-700 hover:text-purple-700 transition-colors"
                >
                  <FileText className="h-4 w-4 text-purple-600 shrink-0" />
                  <span className="truncate flex-1 text-xs font-medium">{file.name}</span>
                </a>
              )
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-stretch border-t border-gray-100 px-5 pt-3 pb-3 bg-gray-50/60">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-purple-700 gap-1.5 h-8 px-2 text-xs font-medium"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </Button>
        </div>

        {showComments && (
          <div className="space-y-2.5 mt-3 mb-3 w-full border-t border-gray-200/60 pt-3">
            {comments.map((comment) => {
              const commentRole = getRoleBadge(comment.author.roles ?? []);
              const canDeleteComment = currentUserId === comment.authorId || isAdmin;

              return (
                <div key={comment.id} className="flex gap-2.5 text-sm group/comment items-start">
                  <Link href={`/profile/${comment.author.id}`} className="mt-0.5 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center">
                      {getInitials(comment.author.name)}
                    </div>
                  </Link>

                  <div className="flex-1 bg-white p-2.5 rounded-lg border border-gray-200 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link
                          href={`/profile/${comment.author.id}`}
                          className="font-semibold text-xs text-gray-900 hover:underline hover:text-purple-600"
                        >
                          {comment.author.name}
                        </Link>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium border ${commentRole.colorClass}`}>
                          {commentRole.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          • {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>

                      {canDeleteComment && (
                        <button
                          onClick={() => performCommentDelete(comment.id)}
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-opacity p-0.5 rounded cursor-pointer"
                          title="Delete comment"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-800 break-words leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })}

            {comments.length === 0 && (
              <p className="text-xs text-gray-400 italic py-1">No comments yet. Start the conversation!</p>
            )}
          </div>
        )}

        <form ref={commentFormRef} onSubmit={handleCommentSubmit} className="flex gap-2 w-full mt-1">
          <Input
            name="comment"
            placeholder="Write a comment..."
            className="h-9 text-xs bg-white rounded-lg border-gray-200 focus-visible:ring-purple-500"
            autoComplete="off"
            disabled={isCommenting}
          />
          <Button
            type="submit"
            size="sm"
            disabled={isCommenting}
            className="h-9 px-3 bg-purple-600 hover:bg-purple-700 text-white shrink-0 rounded-lg"
          >
            {isCommenting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
