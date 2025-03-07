import React from 'react';
import { Game } from '@/lib/types';

interface GameAdapterProps {
  dbGame?: any; // The game data returned from Supabase
  currentUserSchoolId?: string | null;
  children: (game: Game) => React.ReactNode;
  game?: Game; // Add this to support direct Game object
}

// This component adapts the database game format to our frontend Game type
const GameAdapter: React.FC<GameAdapterProps> = ({ dbGame, game, currentUserSchoolId, children }) => {
  // If a direct game object is provided, use it
  if (game) {
    return <>{children(game)}</>;
  }
  
  // Otherwise transform the database game
  if (!dbGame) return null;

  // Transform the database game to our Game type
  const adaptedGame: Game = {
    id: dbGame.game_id,
    homeTeam: {
      id: dbGame.home_team_id,
      name: dbGame.home_team?.school_name || 'Home Team',
      mascot: dbGame.home_team?.mascot || undefined,
    },
    awayTeam: {
      id: dbGame.away_team_id,
      name: dbGame.away_team?.school_name || 'Away Team',
      mascot: dbGame.away_team?.mascot || undefined,
    },
    homeScore: dbGame.home_score,
    awayScore: dbGame.away_score,
    status: dbGame.status,
    sportType: dbGame.sport_type,
    startTime: dbGame.start_time,
    location: dbGame.location || '',
    period: dbGame.period,
    attendance: dbGame.attendance,
    isHomeSchool: currentUserSchoolId === dbGame.home_team_id,
    isAwaySchool: currentUserSchoolId === dbGame.away_team_id,
    isDistrict: false, // We would need to check if both teams are in the same district
    stats: dbGame.stats || {
      homeShots: Math.floor(Math.random() * 15),
      awayShots: Math.floor(Math.random() * 15),
      homePossession: Math.floor(Math.random() * 40) + 30,
      awayPossession: 100 - (Math.floor(Math.random() * 40) + 30),
      homeFouls: Math.floor(Math.random() * 5),
      awayFouls: Math.floor(Math.random() * 5),
    },
    weather: dbGame.weather || (dbGame.location?.includes('Field') ? 'Sunny, 72°F' : 'Indoor'),
  };

  return <>{children(adaptedGame)}</>;
};

export default GameAdapter;
