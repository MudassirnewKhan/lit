'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchPosts, fetchPost } from '@/app/(dashboard)/feed/actions';
import PostCard from './PostCard';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

import type { PostWithAuthor, Attachment } from '@/types/feed';

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

  // Realtime Post Listener
  useEffect(() => {
    const channel = supabase
      .channel('realtime-posts-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Post' }, async (payload) => {
        if (payload.eventType === 'INSERT') {
          const rawPost = await fetchPost(payload.new.id);
          if (rawPost) {
            const formattedPost: PostWithAuthor = {
              ...rawPost,
              attachments: (rawPost.attachments as unknown as Attachment[]) || [],
              author: {
                id: rawPost.author.id,
                name: rawPost.author.name,
                roles: rawPost.author.roles.map((r: any) => (typeof r === 'string' ? r : r.role)),
              },
              comments: rawPost.comments.map((c: any) => ({
                ...c,
                author: {
                  id: c.author.id,
                  name: c.author.name,
                  roles: c.author.roles.map((r: any) => (typeof r === 'string' ? r : r.role)),
                },
              })),
            };

            setPosts((prev) => (prev.some((p) => p.id === formattedPost.id) ? prev : [formattedPost, ...prev]));
            toast.success('New post received!');
          }
        }

        if (payload.eventType === 'DELETE') {
          setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // Pagination Loader
  const loadMore = useCallback(async () => {
    const nextPosts = await fetchPosts(page);
    if (!nextPosts.length) {
      setHasMore(false);
    } else {
      // @ts-expect-error backend returns correct structure
      setPosts((prev) => [...prev, ...nextPosts]);
      setPage((prev) => prev + 1);
    }
  }, [page]);

  const removePostFromList = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

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
        <p className="text-center text-sm text-muted-foreground py-4">
          You&apos;ve reached the end of the feed.
        </p>
      )}
    </>
  );
}
