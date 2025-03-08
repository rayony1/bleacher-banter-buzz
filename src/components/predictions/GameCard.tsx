
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Game } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-gray-200 dark:border-gray-800 hover:scale-[1.01]">
      <CardContent className="p-4">
        {/* Game Status Section */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {game.status === 'live' && (
              <Badge variant="secondary" className="mr-2 bg-red-500/10 text-red-500 border-red-500/20">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-1.5"></span>
                Live
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              {game.status === 'final' && 'Final'}
              {game.status === 'live' && game.period ? `${game.sportType === 'basketball' ? 'Q' : 'Period'} ${game.period}` : ''}
              {game.status === 'upcoming' && new Date(game.startTime).toLocaleString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">{game.sportType}</span>
        </div>

        {/* Teams and Score Section */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center text-center w-2/5">
            <h3 className="font-semibold text-sm md:text-base truncate max-w-full">
              {game.homeTeam.name}
            </h3>
            {game.isHomeSchool && (
              <Badge variant="outline" className="mt-1 text-xs py-0">Your School</Badge>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            {(game.status === 'live' || game.status === 'final') ? (
              <div className="text-2xl md:text-3xl font-bold">
                {game.homeScore} - {game.awayScore}
              </div>
            ) : (
              <div className="text-sm font-medium px-3 py-1 rounded text-[#2DD4BF] border border-[#2DD4BF]/20">
                Upcoming
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center text-center w-2/5">
            <h3 className="font-semibold text-sm md:text-base truncate max-w-full">
              {game.awayTeam.name}
            </h3>
            {game.isAwaySchool && (
              <Badge variant="outline" className="mt-1 text-xs py-0">Your School</Badge>
            )}
          </div>
        </div>
        
        {/* Make Prediction Button (for upcoming games) */}
        {game.status === 'upcoming' && (
          <div className="mt-4 flex justify-center">
            <Link to={`/predictions?gameId=${game.id}`} className="text-sm text-blue-500 hover:text-blue-700">
              Make Prediction
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameCard;
