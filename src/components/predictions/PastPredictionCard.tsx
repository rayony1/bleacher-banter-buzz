
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { Prediction } from '@/lib/types';

interface PastPredictionCardProps {
  prediction: Prediction;
}

const PastPredictionCard = ({ prediction }: PastPredictionCardProps) => {
  const isCorrectWinner = prediction.selectedTeam === prediction.actualWinner;
  const isExactScore = 
    prediction.predictedHomeScore === prediction.actualHomeScore && 
    prediction.predictedAwayScore === prediction.actualAwayScore;
  
  return (
    <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">{prediction.homeTeam.name} vs {prediction.awayTeam.name}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(prediction.gameDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          
          <div className="flex items-center">
            <Badge 
              className={`${
                prediction.points > 0 
                  ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                  : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
              }`}
            >
              {prediction.points > 0 ? `+${prediction.points} points` : 'No points'}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Your Prediction</p>
            <p className="font-medium">
              {prediction.selectedTeam === prediction.homeTeam.id 
                ? prediction.homeTeam.name 
                : prediction.awayTeam.name}
            </p>
            {prediction.predictedHomeScore !== null && prediction.predictedAwayScore !== null && (
              <p className="text-sm mt-1">
                Score: {prediction.predictedHomeScore}-{prediction.predictedAwayScore}
              </p>
            )}
          </div>
          
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Actual Result</p>
            <p className="font-medium">
              {prediction.actualWinner === prediction.homeTeam.id 
                ? prediction.homeTeam.name 
                : prediction.awayTeam.name}
            </p>
            <p className="text-sm mt-1">
              Score: {prediction.actualHomeScore}-{prediction.actualAwayScore}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
          <div className="flex items-center">
            {isCorrectWinner ? (
              <Check className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <X className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span>
              {isCorrectWinner 
                ? 'Correct winner prediction' 
                : 'Incorrect winner prediction'}
            </span>
          </div>
          
          {prediction.predictedHomeScore !== null && prediction.predictedAwayScore !== null && (
            <div className="flex items-center">
              {isExactScore ? (
                <Check className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <X className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span>
                {isExactScore 
                  ? 'Exact score prediction' 
                  : 'Incorrect score prediction'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PastPredictionCard;
