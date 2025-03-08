
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Game, TeamPrediction } from '@/lib/types';
import { Check, Lock, Clock, Trophy, MapPin } from 'lucide-react';

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
    <Card className="w-72 min-w-72 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all bg-card">
      <CardContent className="p-0">
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
          
          {/* Teams Section - IMPROVED SPACING */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center text-center w-2/5">
              <div className="w-12 h-12 mb-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                {game.homeTeam.logo ? (
                  <img 
                    src={game.homeTeam.logo} 
                    alt={`${game.homeTeam.name} logo`} 
                    className="w-9 h-9 object-contain"
                  />
                ) : (
                  <div className="text-sm font-bold">{game.homeTeam.name.substring(0, 2).toUpperCase()}</div>
                )}
              </div>
              <h3 className="font-medium text-sm truncate max-w-full">
                {game.homeTeam.name}
              </h3>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center mb-1">
                <span className="text-xs font-medium text-muted-foreground">VS</span>
              </div>
              <Trophy className="h-3 w-3 text-amber-500" />
            </div>
            
            <div className="flex flex-col items-center text-center w-2/5">
              <div className="w-12 h-12 mb-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                {game.awayTeam.logo ? (
                  <img 
                    src={game.awayTeam.logo} 
                    alt={`${game.awayTeam.name} logo`} 
                    className="w-9 h-9 object-contain"
                  />
                ) : (
                  <div className="text-sm font-bold">{game.awayTeam.name.substring(0, 2).toUpperCase()}</div>
                )}
              </div>
              <h3 className="font-medium text-sm truncate max-w-full">
                {game.awayTeam.name}
              </h3>
            </div>
          </div>
          
          {!submitted ? (
            /* Prediction Form - IMPROVED SPACING AND READABILITY */
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={selectedTeam === game.homeTeam.id ? "default" : "outline"}
                  className={`w-full py-1.5 text-sm ${selectedTeam === game.homeTeam.id ? 'bg-teal-500 hover:bg-teal-600' : ''} transition-colors`}
                  onClick={() => !disableInteractions && setSelectedTeam(game.homeTeam.id)}
                  disabled={disableInteractions}
                >
                  {game.homeTeam.name}
                </Button>
                <Button
                  type="button"
                  variant={selectedTeam === game.awayTeam.id ? "default" : "outline"}
                  className={`w-full py-1.5 text-sm ${selectedTeam === game.awayTeam.id ? 'bg-teal-500 hover:bg-teal-600' : ''} transition-colors`}
                  onClick={() => !disableInteractions && setSelectedTeam(game.awayTeam.id)}
                  disabled={disableInteractions}
                >
                  {game.awayTeam.name}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`home-score-${game.id}`} className="text-xs text-muted-foreground">
                    {game.homeTeam.name} Score
                  </Label>
                  <Input
                    id={`home-score-${game.id}`}
                    type="text"
                    inputMode="numeric"
                    value={homeScore}
                    onChange={handleHomeScoreChange}
                    placeholder="0"
                    className="mt-1 py-1 h-8 text-sm"
                    disabled={disableInteractions}
                  />
                </div>
                <div>
                  <Label htmlFor={`away-score-${game.id}`} className="text-xs text-muted-foreground">
                    {game.awayTeam.name} Score
                  </Label>
                  <Input
                    id={`away-score-${game.id}`}
                    type="text"
                    inputMode="numeric"
                    value={awayScore}
                    onChange={handleAwayScoreChange}
                    placeholder="0"
                    className="mt-1 py-1 h-8 text-sm"
                    disabled={disableInteractions}
                  />
                </div>
              </div>
              
              <Button
                className="w-full bg-teal-500 hover:bg-teal-600 transition-colors"
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
            <div className="space-y-3">
              <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Check className="h-4 w-4 text-teal-500 mr-2" />
                  <span className="font-medium text-sm text-teal-700 dark:text-teal-300">Prediction Locked</span>
                </div>
                
                <p className="text-sm text-teal-600 dark:text-teal-400 mb-2">
                  You predicted <span className="font-medium">{selectedTeam === game.homeTeam.id ? game.homeTeam.name : game.awayTeam.name}</span> to win
                </p>
                
                {homeScore && awayScore && (
                  <p className="text-sm text-teal-600 dark:text-teal-400">
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
