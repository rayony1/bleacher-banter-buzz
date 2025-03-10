
import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import FeedHeader from './FeedHeader';

interface FeedErrorStateProps {
  error?: Error;
  onRetry: () => void;
}

const FeedErrorState = ({ error, onRetry }: FeedErrorStateProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
      <FeedHeader isRefreshing={false} onRefresh={() => {}} />
      
      <main className="flex-1">
        <div className="max-w-[600px] mx-auto px-4 py-6">
          <Alert variant="destructive" className="mb-4 rounded-xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unable to load feed</AlertTitle>
            <AlertDescription className="mt-2">
              {error?.message || 'There was an error loading your feed. Please try again.'}
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-4">
            <Button 
              onClick={onRetry}
              variant="outline" 
              className="flex items-center gap-2 hover:bg-[#2DD4BF]/10"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedErrorState;
