
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type GameFilter = 'all' | 'upcoming' | 'live' | 'final';

interface ScoreboardTabsProps {
  activeTab: GameFilter;
  onTabChange: (tab: GameFilter) => void;
}

const ScoreboardTabs = ({
  activeTab,
  onTabChange,
}: ScoreboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as GameFilter)} className="w-full">
      <TabsList className="flex w-full h-12 bg-transparent p-0 space-x-1 mb-6 border-b border-gray-200 dark:border-gray-800">
        <TabsTrigger 
          value="all" 
          className="flex-1 h-12 rounded-none bg-transparent font-bold text-base data-[state=active]:text-[#2DD4BF] data-[state=active]:border-b-2 data-[state=active]:border-[#2DD4BF] data-[state=active]:shadow-none data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400"
        >
          All Games
        </TabsTrigger>
        <TabsTrigger 
          value="upcoming" 
          className="flex-1 h-12 rounded-none bg-transparent font-bold text-base data-[state=active]:text-[#2DD4BF] data-[state=active]:border-b-2 data-[state=active]:border-[#2DD4BF] data-[state=active]:shadow-none data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400"
        >
          Upcoming
        </TabsTrigger>
        <TabsTrigger 
          value="live" 
          className="flex-1 h-12 rounded-none bg-transparent font-bold text-base data-[state=active]:text-[#2DD4BF] data-[state=active]:border-b-2 data-[state=active]:border-[#2DD4BF] data-[state=active]:shadow-none data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400"
        >
          Live
        </TabsTrigger>
        <TabsTrigger 
          value="final" 
          className="flex-1 h-12 rounded-none bg-transparent font-bold text-base data-[state=active]:text-[#2DD4BF] data-[state=active]:border-b-2 data-[state=active]:border-[#2DD4BF] data-[state=active]:shadow-none data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400"
        >
          Final
        </TabsTrigger>
      </TabsList>
      
      {/* TabsContent are handled by the parent component */}
    </Tabs>
  );
};

export default ScoreboardTabs;
