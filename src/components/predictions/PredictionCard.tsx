
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Game } from '@/lib/types';
import GameHeader from './GameHeader';
import PredictionForm from './PredictionForm';
import SubmittedPrediction from './SubmittedPrediction';

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
  
  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
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

  return (
    <Card className="w-72 min-w-72 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all bg-card">
      <CardContent className="p-0">
        <GameHeader game={game} />
        
        <div className="p-3">
          {!submitted ? (
            <PredictionForm 
              game={game}
              selectedTeam={selectedTeam}
              homeScore={homeScore}
              awayScore={awayScore}
              onTeamSelect={handleTeamSelect}
              onHomeScoreChange={handleHomeScoreChange}
              onAwayScoreChange={handleAwayScoreChange}
              onSubmit={handleSubmit}
              disableInteractions={disableInteractions}
            />
          ) : (
            <SubmittedPrediction 
              game={game}
              selectedTeam={selectedTeam!}
              homeScore={homeScore}
              awayScore={awayScore}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
