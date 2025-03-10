
import React from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const FeedHeader = ({ isRefreshing, onRefresh }: FeedHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[600px] mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">Bleacher Banter</div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedHeader;
