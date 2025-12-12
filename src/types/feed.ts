// /types/feed.ts

export type Attachment = {
  url: string;
  type: string;
  name: string;
};

export type Author = {
  id: string;
  name: string | null;
  roles: string[];
};

export type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  author: Author;
};

export type PostWithAuthor = {
  id: string;
  createdAt: Date;
  content: string;
  imageUrl?: string | null;
  attachments: Attachment[];
  authorId: string;
  author: Author;
  comments: Comment[];
};
