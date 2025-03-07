
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
  sendMagicLink: async () => ({ error: null }),
  isMagicLink: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In demo mode, we immediately set the user to the demo user
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(true);
  const [isMagicLink, setIsMagicLink] = useState<boolean>(false);

  useEffect(() => {
    // Check for auth state on load
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // Handle sign in event
        if (session?.user) {
          fetchUserProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(DEMO_USER); // For demo mode, reset to demo user
      }
    });

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
        setIsEmailConfirmed(true); // In real app, check confirmed_at from auth
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      toast({
        title: "Error loading profile",
        description: "Could not load your profile. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // These functions are kept but simplified for demo mode
  const signOut = async () => {
    toast({
      title: "Demo Mode",
      description: "Sign out is disabled in demo mode."
    });
    return Promise.resolve();
  };

  const sendMagicLink = async (email: string) => {
    toast({
      title: "Demo Mode",
      description: "Magic links are disabled in demo mode."
    });
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      signOut, 
      isEmailConfirmed,
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
