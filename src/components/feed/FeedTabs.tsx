
import React from 'react';
import { School, MapPin, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeedType } from '@/lib/types';
import { useMobile } from '@/hooks/use-mobile';

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
  schoolName = 'Your School',
  districtName = 'Your District',
  stateName = 'Your State',
}: FeedTabsProps) => {
  const { isMobile } = useMobile();
  
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as FeedType)} className="w-full">
      <TabsList className={`grid w-full grid-cols-3 ${isMobile ? 'mb-3' : 'mb-6'}`}>
        <TabsTrigger value="school" className="flex items-center gap-2">
          <School className="h-4 w-4" />
          <span className={isMobile ? 'text-xs' : 'hidden sm:inline'}>School</span>
        </TabsTrigger>
        <TabsTrigger value="district" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className={isMobile ? 'text-xs' : 'hidden sm:inline'}>District</span>
        </TabsTrigger>
        <TabsTrigger value="state" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className={isMobile ? 'text-xs' : 'hidden sm:inline'}>State</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="school" className="animate-fade-in">
        <div className={`bg-primary/5 rounded-md py-2 px-3 ${isMobile ? 'mb-3 text-sm' : 'mb-6'}`}>
          <h2 className="text-sm font-medium text-primary flex items-center">
            <School className="h-4 w-4 mr-2" />
            {schoolName} Feed
          </h2>
        </div>
      </TabsContent>
      
      <TabsContent value="district" className="animate-fade-in">
        <div className={`bg-primary/5 rounded-md py-2 px-3 ${isMobile ? 'mb-3 text-sm' : 'mb-6'}`}>
          <h2 className="text-sm font-medium text-primary flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {districtName} Feed
          </h2>
        </div>
      </TabsContent>
      
      <TabsContent value="state" className="animate-fade-in">
        <div className={`bg-primary/5 rounded-md py-2 px-3 ${isMobile ? 'mb-3 text-sm' : 'mb-6'}`}>
          <h2 className="text-sm font-medium text-primary flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            {stateName} Feed
          </h2>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default FeedTabs;
