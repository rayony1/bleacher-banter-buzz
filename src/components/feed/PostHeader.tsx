
import React from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth';

interface PostAuthor {
  id?: string;
  name?: string;
  badges?: Array<{ name: string; type: string; }>;
}

interface PostHeaderProps {
  author?: PostAuthor;
  isAnonymous: boolean;
  createdAt: Date;
  postId: string;
  onDelete?: (postId: string) => void;
}

const PostHeader = ({ author, isAnonymous, createdAt, postId, onDelete }: PostHeaderProps) => {
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  const { user } = useAuth();
  
  const canDelete = !isAnonymous && author?.id === user?.id;
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(postId);
    }
  };
  
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex flex-col">
        <div className="flex items-center space-x-1">
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {isAnonymous ? "Bleacher Banter" : author?.name}
          </span>
          {!isAnonymous && author?.badges && (
            <Badge variant="outline" className="text-xs py-0 px-1 bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-full border-[#2DD4BF]/20">
              ✓
            </Badge>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isAnonymous ? "@anonymous" : `@${author?.name?.toLowerCase().replace(/\s/g, '')}`}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            {canDelete && (
              <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete post
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Block user</DropdownMenuItem>
            <DropdownMenuItem>Mute conversation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PostHeader;
