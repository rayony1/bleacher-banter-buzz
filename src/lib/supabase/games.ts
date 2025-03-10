
import { supabase } from './client';

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
