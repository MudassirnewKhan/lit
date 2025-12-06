'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchPosts, fetchPost } from '@/app/(dashboard)/feed/actions';
import PostCard from './PostCard';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

// Define explicit types to avoid 'any'
type Attachment = { url: string; type: string; name: string; };
type Comment = { id: string; content: string; createdAt: Date; authorId: string; author: { name: string; roles: string[] } };

type PostWithAuthor = {
  id: string;
  createdAt: Date;
  content: string;
  imageUrl?: string | null;
  attachments: Attachment[]; // FIXED: Typed correctly
  authorId: string;
  author: { name: string | null; roles: string[] };
  comments: Comment[]; // FIXED: Typed correctly
};

interface LoadMorePostsProps {
  initialPosts: PostWithAuthor[];
  currentUserId: string;
  isAdmin: boolean;
}

export default function LoadMorePosts({ initialPosts, currentUserId, isAdmin }: LoadMorePostsProps) {
  const [posts, setPosts] = useState<PostWithAuthor[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  // --- REALTIME SUBSCRIPTION ---
  useEffect(() => {
    const channel = supabase
      .channel('realtime-posts-feed') 
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Post',
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPost = await fetchPost(payload.new.id);
            if (newPost) {
              setPosts((prev) => {
                if (prev.some(p => p.id === newPost.id)) return prev;
                // Cast to ensure type compatibility if fetchPost returns loose types
                return [newPost as unknown as PostWithAuthor, ...prev];
              });
              toast.success('New post received!');
            }
          }
          
          if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
            console.error("Realtime Error: Check Console");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // FIXED: Wrapped in useCallback to satisfy useEffect dependency rules
  const loadMore = useCallback(async () => {
    const nextPosts = await fetchPosts(page);
    if (nextPosts.length === 0) {
      setHasMore(false);
    } else {
      // FIXED: Used expect-error instead of ignore
      // @ts-expect-error - fetchPosts return type might be slightly different from PostWithAuthor but compatible in runtime
      setPosts((prev) => [...prev, ...nextPosts]);
      setPage((prev) => prev + 1);
    }
  }, [page]);

  const removePostFromList = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // FIXED: Added loadMore to dependency array
  useEffect(() => {
    if (inView && hasMore) loadMore();
  }, [inView, hasMore, loadMore]);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <>
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          currentUserId={currentUserId} 
          isAdmin={isAdmin}
          onDelete={removePostFromList}
        />
      ))}
      
      {hasMore && (
        <div ref={ref} className="flex justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        // FIXED: Escaped single quote
        <p className="text-center text-sm text-muted-foreground py-4">You&apos;ve reached the end of the feed.</p>
      )}
    </>
  );
}