'use client';

import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchPosts, fetchPost } from '@/app/(dashboard)/feed/actions';
import PostCard from './PostCard';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type PostWithAuthor = {
  id: string;
  createdAt: Date;
  content: string;
  imageUrl?: string | null;
  attachments: any;
  authorId: string;
  author: { name: string | null; roles: string[] };
  comments: any[];
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
    // Channel name must be unique per subscription
    const channel = supabase
      .channel('realtime-posts-feed') 
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT and DELETE
          schema: 'public',
          table: 'Post', // ⚠️ CRITICAL: If this doesn't work, try changing to 'post' (lowercase)
        },
        async (payload) => {
          console.log("⚡️ REALTIME EVENT:", payload); 

          // 1. Handle New Post
          if (payload.eventType === 'INSERT') {
            const newPost = await fetchPost(payload.new.id);
            if (newPost) {
              setPosts((prev) => {
                if (prev.some(p => p.id === newPost.id)) return prev;
                return [newPost, ...prev];
              });
              toast.success('New post received!'); // Visual Feedback
            }
          }
          
          // 2. Handle Delete
          if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        // --- DEBUGGING TOASTS ---
        console.log("🔌 STATUS:", status);
        if (status === 'SUBSCRIBED') {
            // Connection successful
            console.log("✅ Realtime Connected");
        } 
        else if (status === 'CHANNEL_ERROR') {
            toast.error("Realtime Error: Check Console");
            console.error("❌ CHANNEL_ERROR: Check your Supabase URL/Anon Key and RLS Policies.");
        }
        else if (status === 'TIMED_OUT') {
            toast.error("Realtime Connection Timed Out");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMore = async () => {
    const nextPosts = await fetchPosts(page);
    if (nextPosts.length === 0) {
      setHasMore(false);
    } else {
      // @ts-ignore
      setPosts((prev) => [...prev, ...nextPosts]);
      setPage((prev) => prev + 1);
    }
  };

  const removePostFromList = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  useEffect(() => {
    if (inView && hasMore) loadMore();
  }, [inView, hasMore]);

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
        <p className="text-center text-sm text-muted-foreground py-4">You've reached the end of the feed.</p>
      )}
    </>
  );
}