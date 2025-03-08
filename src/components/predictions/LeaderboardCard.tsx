
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '@/lib/types';
import { Link } from 'react-router-dom';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
}

const LeaderboardCard = ({ entry, rank, isCurrentUser }: LeaderboardCardProps) => {
  return (
    <Card className={`overflow-hidden shadow-sm transition-all ${
      isCurrentUser 
        ? 'border-primary/30 bg-primary/5' 
        : 'border-gray-200 dark:border-gray-800'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
              rank <= 3 
                ? 'bg-amber-500/10 text-amber-500' 
                : 'bg-muted/50 text-muted-foreground'
            }`}>
              {rank <= 3 ? (
                <Trophy className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{rank}</span>
              )}
            </div>
            
            <Link to={`/profile/${entry.userId}`} className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback className="text-xs">
                  {entry.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="font-medium text-sm">
                  {entry.username}
                  {isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {entry.school}
                </div>
              </div>
            </Link>
          </div>
          
          <div className="text-right">
            <div className="font-bold flex items-center justify-end">
              <Trophy className="h-3 w-3 mr-1 text-amber-500" /> 
              {entry.points}
            </div>
            <div className="text-xs text-muted-foreground">points</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
