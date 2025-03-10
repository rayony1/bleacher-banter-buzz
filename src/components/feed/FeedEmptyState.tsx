
import React from 'react';
import { Plus, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedEmptyStateProps {
  onCreatePost: () => void;
  isOffline?: boolean;
}

const FeedEmptyState = ({ onCreatePost, isOffline = false }: FeedEmptyStateProps) => {
  return (
    <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl shadow-sm m-4">
      {isOffline ? (
        <>
          <div className="flex justify-center mb-3">
            <WifiOff className="h-10 w-10 text-amber-500" />
          </div>
          <p className="mb-4">No cached posts available while offline</p>
          <p className="text-sm">Connect to the internet to view and load posts</p>
        </>
      ) : (
        <>
          <p className="mb-4">No posts in this feed yet</p>
          <Button 
            onClick={onCreatePost}
            className="rounded-full px-4 py-2 bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create post
          </Button>
        </>
      )}
    </div>
  );
};

export default FeedEmptyState;
