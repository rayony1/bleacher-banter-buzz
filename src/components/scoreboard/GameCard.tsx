
import React, { useState } from 'react';
import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Game } from '@/lib/types';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-sm hover:shadow transition-all">
      <CardContent className="p-0">
        <div className="p-4">
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
              <div className="w-12 h-12 mb-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                {game.homeTeam.logo ? (
                  <img 
                    src={game.homeTeam.logo} 
                    alt={`${game.homeTeam.name} logo`} 
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div className="text-xs font-bold">{game.homeTeam.name.substring(0, 2).toUpperCase()}</div>
                )}
              </div>
              <h3 className="font-medium text-sm md:text-base truncate max-w-full">
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
                <div className="text-sm font-medium bg-muted px-3 py-1 rounded">
                  Upcoming
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center text-center w-2/5">
              <div className="w-12 h-12 mb-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                {game.awayTeam.logo ? (
                  <img 
                    src={game.awayTeam.logo} 
                    alt={`${game.awayTeam.name} logo`} 
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <div className="text-xs font-bold">{game.awayTeam.name.substring(0, 2).toUpperCase()}</div>
                )}
              </div>
              <h3 className="font-medium text-sm md:text-base truncate max-w-full">
                {game.awayTeam.name}
              </h3>
              {game.isAwaySchool && (
                <Badge variant="outline" className="mt-1 text-xs py-0">Your School</Badge>
              )}
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="flex items-center justify-between mt-4 border-t pt-3 border-gray-100 dark:border-gray-800">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-xs"
              onClick={toggleDetails}
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  View Details
                </>
              )}
            </Button>
            
            {game.status === 'upcoming' && (
              <Link to={`/predictions?gameId=${game.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Make Prediction
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Expanded Details Section */}
        {showDetails && (
          <div className="p-4 bg-muted/30 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Location</p>
                <p className="font-medium">{game.location}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Attendance</p>
                <p className="font-medium">{game.attendance || 'TBD'}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Weather</p>
                <p className="font-medium">{game.weather || 'Indoor'}</p>
              </div>
            </div>
            
            {game.status !== 'upcoming' && (
              <div className="mt-3">
                <p className="text-muted-foreground text-xs mb-1">Game Stats</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex justify-between">
                    <span>Shots (Home)</span>
                    <span className="font-medium">{game.stats?.homeShots || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shots (Away)</span>
                    <span className="font-medium">{game.stats?.awayShots || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time of Possession</span>
                    <span className="font-medium">{game.stats?.homePossession || '-'}% / {game.stats?.awayPossession || '-'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fouls</span>
                    <span className="font-medium">{game.stats?.homeFouls || '-'} / {game.stats?.awayFouls || '-'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameCard;
