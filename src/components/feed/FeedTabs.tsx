
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeedType } from '@/lib/types';

interface FeedTabsProps {
  activeTab: FeedType;
  onTabChange: (tab: FeedType) => void;
  schoolName?: string;
  districtName?: string;
  stateName?: string;
}

const FeedTabs = ({
  activeTab,
  onTabChange,
  schoolName = 'My School',
  districtName = 'District',
  stateName = 'State',
}: FeedTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as FeedType)} className="w-full">
      <TabsList className="flex w-full h-12 bg-transparent p-0 space-x-2 border-b border-gray-200 dark:border-gray-800">
        <TabsTrigger 
          value="school" 
          className="flex-1 h-12 rounded-none bg-transparent font-semibold text-base data-[state=active]:text-[#2DD4BF] data-[state=active]:border-b-2 data-[state=active]:border-[#2DD4BF] data-[state=active]:shadow-none data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400 transition-all"
        >
          My School
        </TabsTrigger>
        <TabsTrigger 
          value="district" 
          className="flex-1 h-12 rounded-none bg-transparent font-semibold text-base data-[state=active]:text-[#2DD4BF] data-[state=active]:border-b-2 data-[state=active]:border-[#2DD4BF] data-[state=active]:shadow-none data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400 transition-all"
        >
          District
        </TabsTrigger>
        <TabsTrigger 
          value="state" 
          className="flex-1 h-12 rounded-none bg-transparent font-semibold text-base data-[state=active]:text-[#2DD4BF] data-[state=active]:border-b-2 data-[state=active]:border-[#2DD4BF] data-[state=active]:shadow-none data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400 transition-all"
        >
          State
        </TabsTrigger>
      </TabsList>
      
      {/* We'll hide these as Twitter doesn't show subtitles under tabs */}
      <TabsContent value="school" className="hidden"></TabsContent>
      <TabsContent value="district" className="hidden"></TabsContent>
      <TabsContent value="state" className="hidden"></TabsContent>
    </Tabs>
  );
};

export default FeedTabs;
