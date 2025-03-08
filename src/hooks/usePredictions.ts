
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export interface Prediction {
  prediction_id: string;
  game_id: string;
  user_id: string;
  selected_team: 'home' | 'away';
  predicted_home_score: number | null;
  predicted_away_score: number | null;
  actual_winner: string | null;
  points: number;
  created_at: string;
}

export const usePredictions = (gameId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user's predictions for a specific game or all user predictions
  const { data: predictions, isLoading, error, refetch } = useQuery({
    queryKey: ['predictions', user?.id, gameId],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id);

      if (gameId) {
        query = query.eq('game_id', gameId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as Prediction[];
    },
    enabled: !!user?.id,
  });

  // Submit a new prediction
  const submitPrediction = async (
    gameId: string,
    selectedTeam: 'home' | 'away',
    homeScore?: number,
    awayScore?: number
  ) => {
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to make predictions.',
        variant: 'destructive',
      });
      return { success: false };
    }

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase
        .from('predictions')
        .insert({
          game_id: gameId,
          user_id: user.id,
          selected_team: selectedTeam,
          predicted_home_score: homeScore || null,
          predicted_away_score: awayScore || null,
          points: 0, // Points will be calculated when the game is over
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: 'Prediction submitted!',
        description: 'Your prediction has been recorded.',
      });

      // Refetch predictions to update the list
      refetch();
      
      return { success: true, data };
    } catch (error: any) {
      toast({
        title: 'Error submitting prediction',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user has already predicted for a specific game
  const hasPredicted = (gameId: string): boolean => {
    if (!predictions) return false;
    return predictions.some(prediction => prediction.game_id === gameId);
  };

  // Get user's prediction for a specific game
  const getPrediction = (gameId: string): Prediction | undefined => {
    if (!predictions) return undefined;
    return predictions.find(prediction => prediction.game_id === gameId);
  };

  return {
    predictions,
    isLoading,
    error,
    isSubmitting,
    submitPrediction,
    hasPredicted,
    getPrediction,
    refetch,
  };
};

export default usePredictions;
