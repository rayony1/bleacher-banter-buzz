
import React from 'react';
import { ArrowUpFromLine, WifiOff } from 'lucide-react';
import { cn } from "@/lib/utils";

interface IOSFeedHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  isOffline?: boolean;
}

const IOSFeedHeader = ({ isRefreshing, onRefresh, isOffline = false }: IOSFeedHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b">
      <div className="container flex items-center justify-between h-14 max-w-screen-xl mx-auto px-4">
        <h1 className="text-lg font-semibold">Feed</h1>
        <div className="flex items-center space-x-2">
          {isOffline && (
            <div className="flex items-center text-amber-500 text-sm mr-2">
              <WifiOff className="h-4 w-4 mr-1" />
              <span>Offline</span>
            </div>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={cn(
              "p-2 rounded-full transition-all",
              isRefreshing ? "animate-spin" : "hover:bg-accent"
            )}
            aria-label="Refresh feed"
          >
            <ArrowUpFromLine className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default IOSFeedHeader;
