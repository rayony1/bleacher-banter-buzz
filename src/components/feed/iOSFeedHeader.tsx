
import React from 'react';
import { ArrowUpFromLine } from 'lucide-react';
import { cn } from "@/lib/utils";

interface iOSFeedHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

const iOSFeedHeader = ({ isRefreshing, onRefresh }: iOSFeedHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b">
      <div className="container flex items-center justify-between h-14 max-w-screen-xl mx-auto px-4">
        <h1 className="text-lg font-semibold">Feed</h1>
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
    </header>
  );
};

export default iOSFeedHeader;
