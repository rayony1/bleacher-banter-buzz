
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import FeedHeader from './FeedHeader';

const FeedErrorState = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
      <FeedHeader isRefreshing={false} onRefresh={() => {}} />
      
      <main className="flex-1">
        <div className="max-w-[600px] mx-auto px-4 py-6">
          <Alert variant="destructive" className="mb-4 rounded-xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load feed. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
};

export default FeedErrorState;
