
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase, getUserProfile } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  isEmailConfirmed: boolean;
  userEmail: string | undefined;
  sendMagicLink: (email: string) => Promise<{ error: Error | null }>;
  isMagicLink: boolean;
}

// Demo user for demo mode
const DEMO_USER: User = {
  id: 'demo-user-id',
  username: 'BleacherFan',
  name: 'Demo User',
  school: 'Westview High',
  badges: [{ id: 'badge-1', name: 'Student', type: 'student' }],
  points: 250,
  isAthlete: false,
  createdAt: new Date(),
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
  isEmailConfirmed: false,
  userEmail: undefined,
  sendMagicLink: async () => ({ error: null }),
  isMagicLink: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [isMagicLink, setIsMagicLink] = useState<boolean>(false);

  useEffect(() => {
    // Check for auth state on load
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // Handle sign in event
        if (session?.user) {
          // Store the user's email even if not confirmed
          setUserEmail(session.user.email);
          
          // Check if email is confirmed
          if (session.user.email_confirmed_at) {
            setIsEmailConfirmed(true);
            // Clear any pending confirmation email from localStorage
            localStorage.removeItem('pendingConfirmationEmail');
          } else {
            setIsEmailConfirmed(false);
            // Store email for confirmation in localStorage if not already there
            if (session.user.email) {
              localStorage.setItem('pendingConfirmationEmail', session.user.email);
            }
          }
          fetchUserProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsEmailConfirmed(false);
        setUserEmail(undefined);
      }
    });

    // Check initial session
    const checkSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Store the user's email even if not confirmed
        setUserEmail(session.user.email);
        
        // Check if email is confirmed
        if (session.user.email_confirmed_at) {
          setIsEmailConfirmed(true);
          // Clear any pending confirmation email from localStorage
          localStorage.removeItem('pendingConfirmationEmail');
        } else {
          setIsEmailConfirmed(false);
          // Store email for confirmation in localStorage if not already there
          if (session.user.email) {
            localStorage.setItem('pendingConfirmationEmail', session.user.email);
          }
        }
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
        // Transform the profile data to match our User type
        const userProfile: User = {
          id: userId,
          username: data.username,
          name: data.username, // In real app, get this from profile
          school: 'Demo School', // In real app, get this from school table
          badges: [], // In real app, fetch badges
          points: 0, // In real app, calculate from predictions
          isAthlete: false, // In real app, determine from role
          createdAt: new Date(data.created_at),
        };
        
        setUser(userProfile);
      } else {
        // For demo mode, use the demo user
        setUser(DEMO_USER);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      toast({
        title: "Error loading profile",
        description: "Could not load your profile. Please try again later.",
        variant: "destructive"
      });
      // For demo mode, use the demo user
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
      // For demo mode, immediately set back to demo user
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      signOut, 
      isEmailConfirmed,
      userEmail,
      sendMagicLink,
      isMagicLink
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
