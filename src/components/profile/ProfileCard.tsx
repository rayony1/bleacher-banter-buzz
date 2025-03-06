
import React from 'react';
import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { School, Trophy, Flag } from 'lucide-react';

interface ProfileCardProps {
  user: User;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden card-hover transition-all">
      <div className="h-28 bg-gradient-to-r from-primary/80 to-accent/80 relative">
        <div className="absolute -bottom-12 left-4">
          <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-950">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-primary/20 text-primary text-xl">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm rounded-md py-1 px-2 text-sm font-medium flex items-center">
          <Trophy className="h-4 w-4 mr-1 text-amber-500" />
          <span>{user.points} points</span>
        </div>
      </div>
      
      <CardHeader className="pt-14 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          
          <Button variant="outline" className="mt-2 sm:mt-0">
            Edit Profile
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="flex items-center text-muted-foreground mb-4">
          <School className="h-4 w-4 mr-2" />
          <span>{user.school}</span>
        </div>
        
        <h3 className="font-medium mb-2">Badges</h3>
        <div className="flex flex-wrap gap-2">
          {user.badges.map((badge) => (
            <Badge key={badge.id} variant="secondary" className="flex items-center py-1.5">
              {badge.type === 'school' && <School className="h-3 w-3 mr-1" />}
              {badge.type === 'team' && <Flag className="h-3 w-3 mr-1" />}
              {badge.type === 'achievement' && <Trophy className="h-3 w-3 mr-1" />}
              {badge.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
