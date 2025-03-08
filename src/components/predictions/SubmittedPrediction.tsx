
import React from 'react';
import { Check, Lock, Trophy } from 'lucide-react';
import { Game } from '@/lib/types';

interface SubmittedPredictionProps {
  game: Game;
  selectedTeam: string;
  homeScore: string;
  awayScore: string;
  pointsEarned?: number;
  isCorrect?: boolean;
}

const SubmittedPrediction: React.FC<SubmittedPredictionProps> = ({
  game,
  selectedTeam,
  homeScore,
  awayScore,
  pointsEarned = 0,
  isCorrect = false
}) => {
  const isGameFinished = game.status === 'final';
  const selectedTeamName = selectedTeam === game.homeTeam.id ? game.homeTeam.name : game.awayTeam.name;

  return (
    <div className="space-y-3">
      <div className={`${
        isGameFinished 
          ? isCorrect 
            ? 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900' 
            : 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900'
          : 'bg-teal-50 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900'
        } rounded-lg p-3 text-center border`}>
        
        <div className="flex items-center justify-center mb-2">
          {isGameFinished ? (
            isCorrect ? (
              <Trophy className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <div className="h-4 w-4 text-rose-500 mr-2">✗</div>
            )
          ) : (
            <Check className="h-4 w-4 text-teal-500 mr-2" />
          )}
          
          <span className={`font-medium text-sm ${
            isGameFinished 
              ? isCorrect 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-rose-700 dark:text-rose-300'
              : 'text-teal-700 dark:text-teal-300'
            }`}>
            {isGameFinished 
              ? isCorrect 
                ? 'Correct Prediction!' 
                : 'Incorrect Prediction'
              : 'Prediction Locked'}
          </span>
        </div>
        
        <p className={`text-sm ${
          isGameFinished 
            ? isCorrect 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-rose-600 dark:text-rose-400'
            : 'text-teal-600 dark:text-teal-400'
          } mb-2`}>
          You predicted <span className="font-medium">{selectedTeamName}</span> to win
        </p>
        
        {homeScore && awayScore && (
          <p className={`text-sm ${
            isGameFinished 
              ? isCorrect 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-rose-600 dark:text-rose-400'
              : 'text-teal-600 dark:text-teal-400'
            }`}>
            Score prediction: <span className="font-medium">{homeScore}-{awayScore}</span>
          </p>
        )}
        
        {isGameFinished && (
          <div className={`mt-2 pt-2 border-t ${
            isCorrect 
              ? 'border-green-100 dark:border-green-800' 
              : 'border-rose-100 dark:border-rose-800'
            }`}>
            <p className={`text-sm font-medium ${
              isCorrect 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-rose-700 dark:text-rose-300'
              }`}>
              {pointsEarned > 0 
                ? <span className="flex items-center justify-center">
                    <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                    {pointsEarned} points earned!
                  </span> 
                : 'No points earned'}
            </p>
          </div>
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
