
import React, { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase, getUserProfile } from '@/lib/supabase';
import AuthContext from './context';
import { DEMO_USER } from './types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [isMagicLink, setIsMagicLink] = useState<boolean>(false);

  useEffect(() => {
    // Check for auth state on load
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user) {
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
        setUserEmail(session.user.email);
        fetchUserProfile(session.user.id);
      } else {
        // For demo mode, use the demo user
        setUser(DEMO_USER);
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
        
        setUser(userProfile);
      } else {
        setUser(DEMO_USER);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      toast({
        title: "Error loading profile",
        description: "Could not load your profile. Please try again later.",
        variant: "destructive"
      });
      setUser(DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
      toast({
        title: "Error signing out",
        description: "Could not sign you out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setUser(DEMO_USER);
    }
  };

  const sendMagicLink = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;
      
      setIsMagicLink(true);
      toast({
        title: "Magic link sent",
        description: "Check your email for a login link."
      });
      
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send magic link');
      setError(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithSchool = async (email: string, password: string, username: string, schoolId: string) => {
    try {
      setIsLoading(true);
      
      // Sign up the user with email and password
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            school_id: schoolId
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        setUserEmail(email);
        
        toast({
          title: "Registration successful",
          description: "Please check your email to confirm your account."
        });
      }
      
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to register');
      setError(error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      signOut, 
      userEmail,
      sendMagicLink,
      isMagicLink,
      registerWithSchool
    }}>
      {children}
    </AuthContext.Provider>
  );
};
