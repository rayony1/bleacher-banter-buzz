
import { useQuery } from '@tanstack/react-query';
import { getGames } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Game, Prediction } from '@/lib/types';

export const useGames = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const { data, error } = await getGames();
      if (error) throw error;
      return data;
    },
  });

  // Mock predictions for now - this would be replaced with real data
  const mockPredictions: Prediction[] = [
    {
      id: "prediction1", // Add id property to fix the error
      gameId: "game1",
      userId: "user1",
      homeTeam: { id: "team1", name: "Tigers" },
      awayTeam: { id: "team2", name: "Lions" },
      selectedTeam: "home",
      predictedHomeScore: 21,
      predictedAwayScore: 14,
      actualHomeScore: 28,
      actualAwayScore: 14,
      actualWinner: "home",
      points: 10,
      gameDate: new Date().toISOString()
    }
  ];

  return {
    games: data || [],
    predictions: mockPredictions,
    isLoading,
    error,
    userSchoolId: user?.school ? data?.find(game => 
      game.home_team?.school_name === user.school || 
      game.away_team?.school_name === user.school
    )?.home_team?.school_name === user.school ? 
      data?.find(game => 
        game.home_team?.school_name === user.school || 
        game.away_team?.school_name === user.school
      )?.home_team_id : 
      data?.find(game => 
        game.home_team?.school_name === user.school || 
        game.away_team?.school_name === user.school
      )?.away_team_id : null
  };
};
