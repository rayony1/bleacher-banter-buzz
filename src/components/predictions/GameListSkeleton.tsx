
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const GameListSkeleton = () => {
  return (
    <div className="max-w-[600px] mx-auto">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upcoming">Upcoming Games</TabsTrigger>
          <TabsTrigger value="past">Past Games</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="animate-pulse space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center">
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex flex-col items-center">
                <div className="flex space-x-2 mb-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex flex-col items-center">
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameListSkeleton;
