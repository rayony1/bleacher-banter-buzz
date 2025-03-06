
import { useQuery } from '@tanstack/react-query';
import { getGames } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

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

  return {
    games: data || [],
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
