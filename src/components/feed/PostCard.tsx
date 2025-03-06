
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Post } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };
  
  const timeAgo = formatDistanceToNow(post.createdAt, { addSuffix: true });
  
  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden card-hover transition-all mb-4">
      <div className="p-4">
        {/* Author info or anonymous badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            {post.isAnonymous ? (
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3 bg-primary/10">
                  <AvatarFallback className="text-primary font-semibold">BB</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Bleacher Banter</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    Anonymous • {post.schoolName}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.author?.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{post.author?.name}</div>
                  <div className="flex items-center space-x-2">
                    {post.author?.badges.map((badge) => (
                      <Badge key={badge.id} variant="secondary" className="text-xs py-0">
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-muted-foreground">
            <span className="text-xs">{timeAgo}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
        
        {/* Post content */}
        <div className="mb-4">
          <p className="text-foreground">{post.content}</p>
        </div>
        
        {/* Post images if any */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-4 ${
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
        
        {/* Post actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center space-x-1 ${liked ? 'text-red-500' : ''}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
            <span>{likeCount}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
