'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Types
type Attachment = {
  url: string;
  type: string;
  name: string;
};

// --- HELPER: PERMISSION CHECK ---
// Enforces hierarchy: Admin > Sub-admin > User
async function checkDeletionPermission(authorId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Not authenticated');

  const myRoles = session.user.roles || [];
  const isMeAdmin = myRoles.includes('admin');
  const isMeSubAdmin = myRoles.includes('subadmin');
  
  // 1. If I own the content, I can delete it.
  if (authorId === session.user.id) return true;

  // 2. If I am GOD ADMIN, I can delete anything.
  if (isMeAdmin) return true;

  // 3. If I am SUB-ADMIN, I need to check who wrote it.
  if (isMeSubAdmin) {
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      include: { roles: true }
    });
    
    const isAuthorStaff = author?.roles.some(r => ['admin', 'subadmin'].includes(r.role));
    
    // Sub-admin CANNOT delete content by Admin or other Sub-admins
    if (isAuthorStaff) {
       throw new Error("Access Denied: Cannot delete Staff posts.");
    }
    
    // Otherwise (Student/Mentor content), I can delete it.
    return true;
  }

  throw new Error('Unauthorized');
}

// 1. Create Post
export async function createPost(formData: FormData, attachments: Attachment[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: 'Not authenticated' };

  const content = formData.get('content') as string;
  if ((!content || content.trim().length === 0) && attachments.length === 0) {
    return { error: 'Post cannot be empty.' };
  }
  
  try {
    await prisma.post.create({
      data: {
        content: content || '',
        authorId: session.user.id,
        attachments: attachments as any, 
      },
    });
    revalidatePath('/feed');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to create post.' };
  }
}

// 2. Fetch Posts
export async function fetchPosts(page: number = 1, limit: number = 10) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  const posts = await prisma.post.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { firstName: true, lastName: true, roles: { select: { role: true } } },
      },
      comments: {
        include: {
          author: {
            select: { firstName: true, lastName: true, roles: { select: { role: true } } }
          }
        },
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
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      authorId: c.authorId,
      author: {
        name: `${c.author.firstName || ''} ${c.author.lastName || ''}`.trim() || 'Unknown User',
        roles: c.author.roles.map(r => r.role),
      }
    }))
  }));
}

// 3. Delete Post
export async function deletePost(postId: string) {
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { error: 'Not found' };

    await checkDeletionPermission(post.authorId); 

    await prisma.post.delete({ where: { id: postId } });
    revalidatePath('/feed');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete.' };
  }
}

// 4. Create Comment
export async function createComment(postId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: 'Not authenticated' };

  const content = formData.get('comment') as string;
  if (!content || !content.trim()) return { error: 'Comment cannot be empty' };

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id
      },
      include: {
        author: {
          select: { firstName: true, lastName: true, roles: { select: { role: true } } }
        }
      }
    });

    revalidatePath('/feed');

    // Return formatted comment for instant UI update
    const formattedComment = {
      id: newComment.id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      authorId: newComment.authorId,
      author: {
        name: `${newComment.author.firstName || ''} ${newComment.author.lastName || ''}`.trim() || 'Unknown User',
        roles: newComment.author.roles.map(r => r.role),
      }
    };

    return { success: true, comment: formattedComment };
  } catch (e) {
    return { error: 'Failed to add comment' };
  }
}

// 5. Delete Comment
export async function deleteComment(commentId: string) {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return { error: 'Not found' };

    await checkDeletionPermission(comment.authorId);

    await prisma.comment.delete({ where: { id: commentId } });
    revalidatePath('/feed');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete.' };
  }
}

// 6. Helper: Fetch single comment (For Realtime)
export async function fetchComment(commentId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: {
        select: { firstName: true, lastName: true, roles: { select: { role: true } } }
      }
    }
  });

  if (!comment) return null;

  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    authorId: comment.authorId,
    author: {
        name: `${comment.author.firstName || ''} ${comment.author.lastName || ''}`.trim() || 'Unknown User',
        roles: comment.author.roles.map(r => r.role),
    }
  };
}

// 7. Helper: Fetch single POST (For Realtime)
export async function fetchPost(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: { firstName: true, lastName: true, roles: { select: { role: true } } }
      },
      comments: {
        include: {
          author: { select: { firstName: true, lastName: true, roles: { select: { role: true } } } }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!post) return null;

  return {
    ...post,
    author: {
      name: `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || 'Unknown User',
      roles: post.author.roles.map(r => r.role),
    },
    comments: post.comments.map(c => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      authorId: c.authorId,
      author: {
        name: `${c.author.firstName || ''} ${c.author.lastName || ''}`.trim() || 'Unknown User',
        roles: c.author.roles.map(r => r.role),
      }
    }))
  };
}