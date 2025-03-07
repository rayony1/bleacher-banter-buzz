
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share, MoreHorizontal, Send, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Post, PostCardProps } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { useComments, Comment } from '@/hooks/useComments';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';

const PostCard = ({ post, onLike, onUnlike, disableInteractions = false }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();
  
  const { 
    comments, 
    isLoading: isLoadingComments, 
    createComment, 
    isCreatingComment 
  } = useComments(post.id);
  
  const handleLike = () => {
    if (disableInteractions) return;
    
    if (liked) {
      onUnlike(post.id);
    } else {
      onLike(post.id);
    }
    setLiked(!liked);
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (disableInteractions) return;
    
    if (commentText.trim() !== '') {
      createComment(commentText);
      setCommentText('');
    }
  };
  
  const timeAgo = formatDistanceToNow(post.createdAt, { addSuffix: true });
  
  return (
    <Card className="border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-3">
            {post.isAnonymous ? (
              <>
                <Avatar className="h-10 w-10 bg-primary/10">
                  <AvatarFallback className="text-primary font-semibold">BB</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Bleacher Banter</div>
                  <div className="text-xs text-muted-foreground">
                    Anonymous • {post.schoolName}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.author?.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{post.author?.name}</div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {post.author?.badges && post.author.badges.map((badge) => (
                      <Badge key={badge.id} variant="secondary" className="text-xs py-0">
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mt-2 mb-3">
          <p className="text-[15px] leading-normal text-foreground">{post.content}</p>
        </div>
        
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-3 ${
            post.images.length === 1 ? 'grid-cols-1' : 
            post.images.length === 2 ? 'grid-cols-2' : 
            post.images.length >= 3 ? 'grid-cols-3' : ''
          }`}>
            {post.images.map((image, index) => (
              <div 
                key={index} 
                className={`rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ${
                  post.images!.length === 1 ? 'col-span-full h-60' : 
                  post.images!.length === 2 ? 'h-40' : 
                  'h-28'
                }`}
              >
                <img 
                  src={image} 
                  alt={`Post image ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center space-x-1 rounded-full ${liked ? 'text-red-500' : ''}`}
            onClick={handleLike}
            disabled={disableInteractions}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
            <span>{liked ? post.likes + 1 : post.likes}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1 rounded-full"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-1 rounded-full"
            disabled={disableInteractions}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
        
        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            {user && (
              <form onSubmit={handleSubmitComment} className="flex gap-2 mb-4">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.username?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-end gap-2">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="min-h-[60px] flex-1 text-sm resize-none"
                    disabled={disableInteractions}
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    variant="ghost" 
                    className="rounded-full mb-1 h-9 w-9 p-0"
                    disabled={isCreatingComment || commentText.trim() === '' || disableInteractions}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
            
            <div className="space-y-3">
              {isLoadingComments ? (
                <p className="text-center text-sm text-muted-foreground py-2">Loading comments...</p>
              ) : comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-2">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const timeAgo = formatDistanceToNow(comment.createdAt, { addSuffix: true });
  
  return (
    <div className="flex gap-2">
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
        <AvatarImage src={comment.author?.avatar} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {comment.author?.username.substring(0, 2).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted/50 rounded-xl p-3">
          <div className="font-medium text-sm">{comment.author?.username}</div>
          <p className="text-sm">{comment.content}</p>
        </div>
        <div className="text-xs text-muted-foreground mt-1">{timeAgo}</div>
      </div>
    </div>
  );
};

export default PostCard;
