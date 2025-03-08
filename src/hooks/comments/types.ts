
import { User } from '@/lib/types';

export type Comment = {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  createdAt: Date;
  author: {
    username: string;
    avatar_url?: string;
    avatar?: string;
  };
};

export type UseCommentsReturn = {
  comments: Comment[];
  isLoading: boolean;
  error: Error | null;
  createComment: (content: string) => Promise<{ data?: Comment; error: Error | null }>;
  isCreatingComment: boolean;
  addComment: (content: string) => Promise<{ data?: Comment; error: Error | null }>;
};
