
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase, getUserProfile } from '@/lib/supabase';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [isMagicLink, setIsMagicLink] = useState<boolean>(false);

  useEffect(() => {
    // Check for auth state on load
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // Handle sign in event
        if (session?.user) {
          // Store the user's email
          setUserEmail(session.user.email);
          fetchUserProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserEmail(undefined);
      }
    });

    // Check initial session
    const checkSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Store the user's email
        setUserEmail(session.user.email);
        fetchUserProfile(session.user.id);
      } else {
        // No active session
        setUser(null);
        setIsLoading(false);
      }
    };

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await getUserProfile(userId);
      
      if (error) throw error;
      
      if (data) {
        // Transform the profile data to match our User type
        const userProfile: User = {
          id: userId,
          username: data.username,
          name: data.username || data.full_name || 'User',
          school: data.school_id || '', // Will be populated from school table
          schoolName: '', // Will be populated from school name lookup
          badges: [], // Will fetch badges later
          points: data.points || 0,
          isAthlete: data.is_athlete || false,
          createdAt: new Date(data.created_at),
          email: userEmail
        };
        
        setUser(userProfile);
      } else {
        // No profile exists yet
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      toast({
        title: "Error loading profile",
        description: "Could not load your profile. Please try again later.",
        variant: "destructive"
      });
      // Authentication error
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    userEmail,
    setUserEmail,
    isMagicLink,
    setIsMagicLink,
    fetchUserProfile
  };
};
