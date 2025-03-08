
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, BarChart2, Share, MoreHorizontal, Send, Bookmark } from 'lucide-react';
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
  
  // Process content to highlight hashtags
  const renderContent = (content: string) => {
    const parts = content.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-[#2DD4BF] hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div className="px-4 py-3">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            {post.isAnonymous ? (
              <Avatar className="h-12 w-12 border-2 border-[#2DD4BF]">
                <AvatarFallback className="text-[#2DD4BF] font-semibold">BB</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-12 w-12 border-2 border-[#2DD4BF]">
                <AvatarImage src={post.author?.avatar} />
                <AvatarFallback className="bg-[#2DD4BF]/10 text-[#2DD4BF]">
                  {post.author?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-1 text-sm">
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {post.isAnonymous ? "Bleacher Banter" : post.author?.name}
                </span>
                {!post.isAnonymous && post.author?.badges && (
                  <Badge variant="outline" className="text-xs py-0 px-1 bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-full border-[#2DD4BF]/20">
                    ✓
                  </Badge>
                )}
                <span className="text-gray-500 dark:text-gray-400">
                  {post.isAnonymous ? "@anonymous" : `@${post.author?.name.toLowerCase().replace(/\s/g, '')}`}
                </span>
                <span className="text-gray-500 dark:text-gray-400">·</span>
                <span className="text-gray-500 dark:text-gray-400">{timeAgo}</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -mt-1">
                    <MoreHorizontal className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem>Report</DropdownMenuItem>
                  <DropdownMenuItem>Copy link</DropdownMenuItem>
                  <DropdownMenuItem>Block user</DropdownMenuItem>
                  <DropdownMenuItem>Mute conversation</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="mt-1 mb-2 text-[15px] leading-normal text-gray-900 dark:text-gray-100">
              <p>{renderContent(post.content)}</p>
            </div>
            
            {post.images && post.images.length > 0 && (
              <div className={`mb-3 ${
                post.images.length === 1 ? '' : 
                post.images.length === 2 ? 'grid grid-cols-2 gap-1' : 
                post.images.length >= 3 ? 'grid grid-cols-2 gap-1' : ''
              }`}>
                {post.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`rounded-xl overflow-hidden border border-[#E0E0E0] dark:border-gray-800 ${
                      post.images!.length === 1 ? 'w-full h-auto max-h-96' : 
                      index === 0 && post.images!.length >= 3 ? 'col-span-2' : ''
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
            
            <div className="flex items-center justify-between mt-3 text-gray-500 dark:text-gray-400">
              <button 
                className="flex items-center space-x-1 group"
                onClick={() => setShowComments(!showComments)}
                disabled={disableInteractions}
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#2DD4BF] transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span className="text-sm group-hover:text-[#2DD4BF]">{post.comments}</span>
              </button>
              
              <button 
                className="flex items-center space-x-1 group"
                disabled={disableInteractions}
              >
                <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-[#2DD4BF] transition-colors">
                  <Share className="h-5 w-5" />
                </div>
                <span className="text-sm group-hover:text-[#2DD4BF]">0</span>
              </button>
              
              <button 
                className={`flex items-center space-x-1 group ${liked ? 'text-[#2DD4BF]' : ''}`}
                onClick={handleLike}
                disabled={disableInteractions}
              >
                <div className={`p-2 rounded-full ${
                  liked 
                    ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' 
                    : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-[#2DD4BF]'
                } transition-colors`}>
                  <Heart className={`h-5 w-5 ${liked ? 'fill-[#2DD4BF]' : ''}`} />
                </div>
                <span className={`text-sm ${liked ? 'text-[#2DD4BF]' : 'group-hover:text-[#2DD4BF]'}`}>
                  {liked ? post.likes + 1 : post.likes}
                </span>
              </button>
              
              <button 
                className="flex items-center space-x-1 group"
                disabled={disableInteractions}
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#2DD4BF] transition-colors">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <span className="text-sm group-hover:text-[#2DD4BF]">{Math.floor(Math.random() * 1000)}</span>
              </button>
              
              <button 
                className="flex items-center space-x-1 group"
                disabled={disableInteractions}
              >
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#2DD4BF] transition-colors">
                  <Bookmark className="h-5 w-5" />
                </div>
              </button>
            </div>
            
            {showComments && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                {user && (
                  <form onSubmit={handleSubmitComment} className="flex gap-2 mb-4">
                    <Avatar className="h-8 w-8 flex-shrink-0 border border-[#2DD4BF]">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-[#2DD4BF]/10 text-[#2DD4BF]">
                        {user.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex items-end gap-2">
                      <Textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Post your reply"
                        className="min-h-[60px] flex-1 text-sm resize-none border-gray-200 dark:border-gray-800 focus:border-[#2DD4BF] rounded-xl"
                        disabled={disableInteractions}
                      />
                      <Button 
                        type="submit" 
                        size="sm" 
                        variant="ghost" 
                        className="rounded-full mb-1 h-9 w-9 p-0 bg-[#2DD4BF] text-white hover:bg-[#26B8A5]"
                        disabled={isCreatingComment || commentText.trim() === '' || disableInteractions}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                )}
                
                <div className="space-y-3">
                  {isLoadingComments ? (
                    <p className="text-center text-sm text-gray-500 py-2">Loading replies...</p>
                  ) : comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))
                  ) : (
                    <p className="text-center text-sm text-gray-500 py-2">No replies yet. Be the first to reply!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const timeAgo = formatDistanceToNow(comment.createdAt, { addSuffix: true });
  
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1 border border-[#2DD4BF]">
        <AvatarImage src={comment.author?.avatar} />
        <AvatarFallback className="bg-[#2DD4BF]/10 text-[#2DD4BF]">
          {comment.author?.username.substring(0, 2).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-1 text-sm">
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {comment.author?.username}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            @{comment.author?.username.toLowerCase().replace(/\s/g, '')}
          </span>
          <span className="text-gray-500 dark:text-gray-400">·</span>
          <span className="text-gray-500 dark:text-gray-400">{timeAgo}</span>
        </div>
        <p className="text-[15px] text-gray-900 dark:text-gray-100 mt-1">{comment.content}</p>
        
        <div className="flex items-center mt-2 space-x-6 text-gray-500 dark:text-gray-400 text-sm">
          <button className="flex items-center space-x-1 hover:text-[#2DD4BF]">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Reply</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-[#2DD4BF]">
            <Heart className="h-3.5 w-3.5" />
            <span>{Math.floor(Math.random() * 5)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
