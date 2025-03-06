
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, getUserProfile } from '@/lib/supabase';
import { User } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Sign out function
  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
      console.log('Sign out successful');
    } catch (err) {
      console.error('Error signing out:', err);
      toast({
        title: "Error signing out",
        description: "An error occurred during sign out.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    // Get the initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          console.log('Current user found:', currentUser.id);
          const { data, error: profileError } = await getUserProfile(currentUser.id);
          
          if (profileError) {
            console.error('Profile error:', profileError);
            throw profileError;
          }
          
          if (data) {
            console.log('User profile loaded:', data);
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
          } else {
            console.log('No profile data found for user:', currentUser.id);
          }
        } else {
          console.log('No current user found');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err : new Error('An error occurred during authentication'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setIsLoading(true);
          
          try {
            console.log('User signed in, fetching profile...');
            const { data, error: profileError } = await getUserProfile(session.user.id);
            
            if (profileError) {
              console.error('Error fetching user profile:', profileError);
              setError(profileError);
              return;
            }
            
            if (data) {
              console.log('User profile loaded on sign in:', data);
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
            } else {
              console.error('No profile data found for user after sign in:', session.user.id);
            }
          } catch (err) {
            console.error('Error in auth state change handler:', err);
          } finally {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
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
    <AuthContext.Provider value={{ user, isLoading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
