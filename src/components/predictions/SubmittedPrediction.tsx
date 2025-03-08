
import React from 'react';
import { Check, Lock } from 'lucide-react';
import { Game } from '@/lib/types';

interface SubmittedPredictionProps {
  game: Game;
  selectedTeam: string;
  homeScore: string;
  awayScore: string;
}

const SubmittedPrediction: React.FC<SubmittedPredictionProps> = ({
  game,
  selectedTeam,
  homeScore,
  awayScore
}) => {
  return (
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
  );
};

export default SubmittedPrediction;
