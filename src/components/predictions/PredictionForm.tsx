
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Game } from '@/lib/types';
import TeamDisplay from './TeamDisplay';
import { Trophy } from 'lucide-react';

interface PredictionFormProps {
  game: Game;
  selectedTeam: string | null;
  homeScore: string;
  awayScore: string;
  onTeamSelect: (teamId: string) => void;
  onHomeScoreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAwayScoreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  disableInteractions: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({
  game,
  selectedTeam,
  homeScore,
  awayScore,
  onTeamSelect,
  onHomeScoreChange,
  onAwayScoreChange,
  onSubmit,
  disableInteractions,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <TeamDisplay team={game.homeTeam} position="home" />
        
        <div className="text-center flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center mb-1">
            <span className="text-xs font-medium text-muted-foreground">VS</span>
          </div>
          <Trophy className="h-3 w-3 text-amber-500" />
        </div>
        
        <TeamDisplay team={game.awayTeam} position="away" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={selectedTeam === game.homeTeam.id ? "default" : "outline"}
          className={`w-full py-1.5 text-sm ${selectedTeam === game.homeTeam.id ? 'bg-teal-500 hover:bg-teal-600' : ''} transition-colors`}
          onClick={() => !disableInteractions && onTeamSelect(game.homeTeam.id)}
          disabled={disableInteractions}
        >
          {game.homeTeam.name}
        </Button>
        <Button
          type="button"
          variant={selectedTeam === game.awayTeam.id ? "default" : "outline"}
          className={`w-full py-1.5 text-sm ${selectedTeam === game.awayTeam.id ? 'bg-teal-500 hover:bg-teal-600' : ''} transition-colors`}
          onClick={() => !disableInteractions && onTeamSelect(game.awayTeam.id)}
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
            onChange={onHomeScoreChange}
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
            onChange={onAwayScoreChange}
            placeholder="0"
            className="mt-1 py-1 h-8 text-sm"
            disabled={disableInteractions}
          />
        </div>
      </div>
      
      <Button
        className="w-full bg-teal-500 hover:bg-teal-600 transition-colors"
        disabled={!selectedTeam || disableInteractions}
        onClick={onSubmit}
      >
        Submit Prediction
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        {disableInteractions 
          ? "Email confirmation required to make predictions" 
          : "Predictions lock at game start time"}
      </p>
    </div>
  );
};

export default PredictionForm;
