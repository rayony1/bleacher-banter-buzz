
import { supabase } from './client';

// Game and prediction-related functions
export const getGames = async (limit = 20) => {
  return await supabase
    .from('games')
    .select(`
      *,
      home_team:home_team_id (school_name, mascot),
      away_team:away_team_id (school_name, mascot)
    `)
    .order('start_time', { ascending: true })
    .limit(limit);
};

export const getUserPredictions = async (userId: string) => {
  return await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
};

export const createPrediction = async (gameId: string, userId: string, selectedTeam: string, predictedHomeScore?: number, predictedAwayScore?: number) => {
  return await supabase
    .from('predictions')
    .insert({
      game_id: gameId,
      user_id: userId,
      selected_team: selectedTeam,
      predicted_home_score: predictedHomeScore,
      predicted_away_score: predictedAwayScore,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
};
