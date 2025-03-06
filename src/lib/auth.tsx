
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, getUserProfile } from '@/lib/supabase';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get the initial session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          const { data, error: profileError } = await getUserProfile(currentUser.id);
          
          if (profileError) {
            throw profileError;
          }
          
          if (data) {
            // Map the profile data to our User type
            setUser({
              id: data.user_id,
              username: data.username,
              name: data.username, // Using username as name for now
              school: data.schools?.school_name || '',
              badges: data.user_badges?.map(ub => ub.badges) || [],
              points: 0, // Will need to calculate from predictions later
              isAthlete: data.user_badges?.some(ub => ub.badges?.type === 'athlete') || false,
              createdAt: new Date(data.created_at),
              avatar: currentUser.user_metadata?.avatar_url || undefined,
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred during authentication'));
        console.error('Auth error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data, error: profileError } = await getUserProfile(session.user.id);
          
          if (profileError) {
            setError(profileError);
            return;
          }
          
          if (data) {
            setUser({
              id: data.user_id,
              username: data.username,
              name: data.username,
              school: data.schools?.school_name || '',
              badges: data.user_badges?.map(ub => ub.badges) || [],
              points: 0,
              isAthlete: data.user_badges?.some(ub => ub.badges?.type === 'athlete') || false,
              createdAt: new Date(data.created_at),
              avatar: session.user.user_metadata?.avatar_url || undefined,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
