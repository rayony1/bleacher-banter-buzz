
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import FeedHeader from './FeedHeader';
import FeedTabs from './FeedTabs';
import { FeedType } from '@/lib/types';

interface FeedLoadingStateProps {
  filter: FeedType;
  onTabChange: (tab: FeedType) => void;
}

const FeedLoadingState = ({ filter, onTabChange }: FeedLoadingStateProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
      <FeedHeader isRefreshing={false} onRefresh={() => {}} />
      
      <main className="flex-1">
        <div className="max-w-[600px] mx-auto">
          <FeedTabs activeTab={filter} onTabChange={onTabChange} />
          
          <div className="animate-pulse space-y-4 px-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedLoadingState;
