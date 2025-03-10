
import { Post } from '@/lib/types';

// Helper function to convert DB post to Post type
export const mapDbPostToPost = (dbPost: any): Post => {
  return {
    id: dbPost.post_id,
    author: dbPost.is_anonymous ? null : {
      id: dbPost.user_id,
      username: dbPost.username,
      avatar: dbPost.avatar_url,
      badges: [],
    },
    content: dbPost.content,
    timestamp: new Date(dbPost.post_timestamp),
    createdAt: new Date(dbPost.post_timestamp),
    isAnonymous: dbPost.is_anonymous,
    likeCount: dbPost.likes_count,
    commentCount: dbPost.comments_count,
    images: dbPost.images || [],
    schoolName: dbPost.school_name,
    likes: dbPost.likes_count,
    comments: dbPost.comments_count,
  };
};
