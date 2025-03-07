
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
      <TabsList className="grid w-full grid-cols-3 h-12 rounded-xl bg-muted/60">
        <TabsTrigger value="school" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <School className="h-4 w-4 mr-2" />
          <span className={isMobile ? '' : ''}>School</span>
        </TabsTrigger>
        <TabsTrigger value="district" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <MapPin className="h-4 w-4 mr-2" />
          <span className={isMobile ? '' : ''}>District</span>
        </TabsTrigger>
        <TabsTrigger value="state" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
          <Globe className="h-4 w-4 mr-2" />
          <span className={isMobile ? '' : ''}>State</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="school" className="animate-fade-in mt-2">
        <div className="text-sm font-medium text-primary/90 flex items-center">
          <School className="h-4 w-4 mr-2" />
          {schoolName} Feed
        </div>
      </TabsContent>
      
      <TabsContent value="district" className="animate-fade-in mt-2">
        <div className="text-sm font-medium text-primary/90 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          {districtName} Feed
        </div>
      </TabsContent>
      
      <TabsContent value="state" className="animate-fade-in mt-2">
        <div className="text-sm font-medium text-primary/90 flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          {stateName} Feed
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default FeedTabs;
