
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Game, TeamPrediction } from '@/lib/types';
import { Check, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PredictionCardProps {
  game: Game;
  disableInteractions?: boolean;
}

const PredictionCard = ({ game, disableInteractions = false }: PredictionCardProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  const handleHomeScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setHomeScore(value);
    }
  };
  
  const handleAwayScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setAwayScore(value);
    }
  };
  
  const handleSubmit = () => {
    if (!selectedTeam || disableInteractions) return;
    
    // In a real app, this would send the prediction to an API
    console.log('Submitting prediction:', {
      gameId: game.id,
      winner: selectedTeam,
      predictedHomeScore: homeScore ? parseInt(homeScore) : null,
      predictedAwayScore: awayScore ? parseInt(awayScore) : null
    });
    
    setSubmitted(true);
  };
  
  const isGameSoon = new Date(game.startTime).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-sm hover:shadow transition-all">
      <CardContent className="p-0">
        <div className="p-4">
          {/* Game Info Section */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              {new Date(game.startTime).toLocaleString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
            <span className="text-sm text-muted-foreground">{game.sportType}</span>
          </div>
          
          {/* Teams Section */}
          <div className="flex items-center justify-between mb-6">
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
            </div>
            
            <div className="text-center">
              <span className="text-sm font-medium text-muted-foreground">VS</span>
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
            </div>
          </div>
          
          {/* Location and Time */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">{game.location}</p>
            {isGameSoon && (
              <Badge variant="secondary" className="mt-1">
                Starting Soon
              </Badge>
            )}
          </div>
          
          {!submitted ? (
            /* Prediction Form */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={selectedTeam === game.homeTeam.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => !disableInteractions && setSelectedTeam(game.homeTeam.id)}
                  disabled={disableInteractions}
                >
                  {game.homeTeam.name}
                </Button>
                <Button
                  type="button"
                  variant={selectedTeam === game.awayTeam.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => !disableInteractions && setSelectedTeam(game.awayTeam.id)}
                  disabled={disableInteractions}
                >
                  {game.awayTeam.name}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`home-score-${game.id}`}>{game.homeTeam.name} Score</Label>
                  <Input
                    id={`home-score-${game.id}`}
                    type="text"
                    inputMode="numeric"
                    value={homeScore}
                    onChange={handleHomeScoreChange}
                    placeholder="0"
                    className="mt-1"
                    disabled={disableInteractions}
                  />
                </div>
                <div>
                  <Label htmlFor={`away-score-${game.id}`}>{game.awayTeam.name} Score</Label>
                  <Input
                    id={`away-score-${game.id}`}
                    type="text"
                    inputMode="numeric"
                    value={awayScore}
                    onChange={handleAwayScoreChange}
                    placeholder="0"
                    className="mt-1"
                    disabled={disableInteractions}
                  />
                </div>
              </div>
              
              <Button
                className="w-full"
                disabled={!selectedTeam || disableInteractions}
                onClick={handleSubmit}
              >
                Submit Prediction
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                {disableInteractions 
                  ? "Email confirmation required to make predictions" 
                  : "Predictions lock at game start time"}
              </p>
            </div>
          ) : (
            /* Submitted Prediction */
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">Prediction Locked</span>
                </div>
                
                <p className="text-muted-foreground mb-2">
                  You predicted <span className="font-medium">{selectedTeam === game.homeTeam.id ? game.homeTeam.name : game.awayTeam.name}</span> to win
                </p>
                
                {homeScore && awayScore && (
                  <p className="text-muted-foreground">
                    Score prediction: <span className="font-medium">{homeScore}-{awayScore}</span>
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-center text-xs text-muted-foreground">
                <Lock className="h-3 w-3 mr-1" />
                Prediction cannot be changed
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
