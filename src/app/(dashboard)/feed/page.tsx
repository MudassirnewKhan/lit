import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CreatePostForm from '@/components/feed/CreatePostForm';
import LoadMorePosts from '@/components/feed/LoadMorePosts';

async function getInitialPosts() {
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { firstName: true, lastName: true, roles: { select: { role: true } } },
      },
      comments: {
        include: { author: { select: { firstName: true, lastName: true, roles: { select: { role: true } } } } },
        orderBy: { createdAt: 'asc' }
      }
    },
  });

  return posts.map(post => ({
    ...post,
    author: {
      name: `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || 'Unknown User',
      roles: post.author.roles.map(r => r.role),
    },
    comments: post.comments.map(c => ({
      ...c,
      author: {
        name: `${c.author.firstName || ''} ${c.author.lastName || ''}`.trim() || 'Unknown User',
        roles: c.author.roles.map(r => r.role),
      }
    }))
  }));
}

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login/awardee');
  }

  const initialPosts = await getInitialPosts();
  const roles = session.user.roles || [];

  // FIX: 'isAdmin' prop now includes Sub-admins, giving them delete buttons
  const canModerate = roles.includes('admin') || roles.includes('subadmin');

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Community Feed</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md border">
        <h2 className="text-lg font-semibold mb-4">Share an update</h2>
        <CreatePostForm />
      </div>

      <div className="space-y-6">
        <LoadMorePosts 
          initialPosts={initialPosts} 
          currentUserId={session.user.id}
          isAdmin={canModerate} // Pass the corrected permission
        />
      </div>
    </div>
  );
}