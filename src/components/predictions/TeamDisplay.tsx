
import React from 'react';
import { GameTeam } from '@/lib/types';
import { Trophy } from 'lucide-react';

interface TeamDisplayProps {
  team: GameTeam;
  position: 'home' | 'away';
  isWinner?: boolean;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ team, position, isWinner }) => {
  return (
    <div className="flex flex-col items-center text-center w-2/5">
      <div className={`w-12 h-12 mb-2 ${isWinner ? 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400' : 'bg-gray-100 dark:bg-gray-800'} rounded-full flex items-center justify-center shadow-sm relative`}>
        {team.logo ? (
          <img 
            src={team.logo} 
            alt={`${team.name} logo`} 
            className="w-9 h-9 object-contain"
          />
        ) : (
          <div className="text-sm font-bold">{team.name.substring(0, 2).toUpperCase()}</div>
        )}
        
        {isWinner && (
          <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full w-5 h-5 flex items-center justify-center">
            <Trophy className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      <h3 className={`font-medium text-sm truncate max-w-full ${isWinner ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}`}>
        {team.name}
      </h3>
    </div>
  );
};

export default TeamDisplay;
