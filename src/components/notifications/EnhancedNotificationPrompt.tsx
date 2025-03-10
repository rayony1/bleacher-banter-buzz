
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface EnhancedNotificationPromptProps {
  onAccept: () => void;
  onDecline: () => void;
}

const EnhancedNotificationPrompt = ({ onAccept, onDecline }: EnhancedNotificationPromptProps) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#2DD4BF]" />
          Stay updated with notifications
        </CardTitle>
        <CardDescription>
          Get notified about likes, comments, and game updates from your school.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <span className="bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-full p-1 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            Know when someone likes or comments on your posts
          </li>
          <li className="flex items-center">
            <span className="bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-full p-1 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            Get important updates about upcoming games
          </li>
          <li className="flex items-center">
            <span className="bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-full p-1 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            Stay connected with your school's sports community
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onDecline}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Not now
        </Button>
        <Button
          onClick={onAccept}
          className="bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
        >
          Enable notifications
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnhancedNotificationPrompt;
