
import React from 'react';
import { GameTeam } from '@/lib/types';
import { Trophy } from 'lucide-react';

interface TeamDisplayProps {
  team: GameTeam;
  position: 'home' | 'away';
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ team, position }) => {
  return (
    <div className="flex flex-col items-center text-center w-2/5">
      <div className="w-12 h-12 mb-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
        {team.logo ? (
          <img 
            src={team.logo} 
            alt={`${team.name} logo`} 
            className="w-9 h-9 object-contain"
          />
        ) : (
          <div className="text-sm font-bold">{team.name.substring(0, 2).toUpperCase()}</div>
        )}
      </div>
      <h3 className="font-medium text-sm truncate max-w-full">
        {team.name}
      </h3>
    </div>
  );
};

export default TeamDisplay;
