
import { supabase } from './client';

/**
 * Send a notification to a specific user
 * 
 * Note: This function only queues the notification in the database.
 * A separate backend process would need to handle actual sending.
 */
export const sendNotification = async (
  userId: string, 
  title: string, 
  body: string, 
  data?: Record<string, any>
): Promise<boolean> => {
  try {
    // Insert the notification into a notifications table
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      body,
      data,
      sent: false // Will be processed by backend
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error queueing notification:', error);
    return false;
  }
};

/**
 * Send a notification when a post is liked
 */
export const sendLikeNotification = async (
  postId: string,
  postAuthorId: string,
  likedByUsername?: string
): Promise<boolean> => {
  // Don't send notification if it's the same user liking their own post
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id === postAuthorId) return false;
  
  const username = likedByUsername || 'Someone';
  
  return sendNotification(
    postAuthorId,
    'New like on your post',
    `${username} liked your post`,
    { postId, type: 'like' }
  );
};

/**
 * Send a notification when a post is commented on
 */
export const sendCommentNotification = async (
  postId: string,
  postAuthorId: string,
  commentAuthorUsername?: string
): Promise<boolean> => {
  // Don't send notification if it's the same user commenting on their own post
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id === postAuthorId) return false;
  
  const username = commentAuthorUsername || 'Someone';
  
  return sendNotification(
    postAuthorId,
    'New comment on your post',
    `${username} commented on your post`,
    { postId, type: 'comment' }
  );
};
