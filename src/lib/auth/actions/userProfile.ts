
import { supabase, getUserProfile } from '@/lib/supabase';
import { User } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { DEMO_USER } from '../types';

export const fetchUserProfile = async (userId: string): Promise<{ user: User | null; error: Error | null }> => {
  try {
    const { data, error } = await getUserProfile(userId);
    
    if (error) throw error;
    
    if (data) {
      const userProfile: User = {
        id: userId,
        username: data.username,
        name: data.username,
        school: data.school?.school_name || 'Demo School',
        badges: [],
        points: 0,
        isAthlete: false,
        createdAt: new Date(data.created_at),
        email: data.email
      };
      
      return { user: userProfile, error: null };
    } else {
      return { user: DEMO_USER, error: null };
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to fetch user profile');
    toast({
      title: "Error loading profile",
      description: "Could not load your profile. Please try again later.",
      variant: "destructive"
    });
    return { user: DEMO_USER, error };
  }
};
