
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { Game } from '@/lib/types';

interface GameHeaderProps {
  game: Game;
}

const GameHeader: React.FC<GameHeaderProps> = ({ game }) => {
  const isGameSoon = new Date(game.startTime).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  return (
    <>
      {/* Header with Date and Sport Type */}
      <div className="bg-gradient-to-r from-teal-500/90 to-cyan-500/90 p-2 text-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">
            {new Date(game.startTime).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </span>
          <Badge variant="outline" className="bg-white/20 text-white border-0 text-xs">
            {game.sportType}
          </Badge>
        </div>
      </div>
      
      <div className="p-3">
        {/* Location and Special Indicators */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted-foreground flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {game.location}
          </div>
          
          {isGameSoon && (
            <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200">
              Starting Soon
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};

export default GameHeader;
