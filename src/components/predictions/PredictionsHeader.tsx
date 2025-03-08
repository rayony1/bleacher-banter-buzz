
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/lib/types';

interface PredictionsHeaderProps {
  user: User | null;
}

const PredictionsHeader = ({ user }: PredictionsHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[600px] mx-auto px-4 py-3 flex justify-between items-center">
        {user ? (
          <Avatar className="h-8 w-8 border-2 border-[#2DD4BF]">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-[#2DD4BF]/10 text-[#2DD4BF]">
              {user.username?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8"></div>
        )}
        
        <div className="text-xl font-bold">Predictions</div>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default PredictionsHeader;
