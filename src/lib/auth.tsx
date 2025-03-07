
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, getUserProfile } from '@/lib/supabase';
import { User } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  isEmailConfirmed: boolean;
  sendMagicLink: (email: string, redirectTo?: string) => Promise<{ error: Error | null }>;
}

// Demo user for demo mode
const DEMO_USER: User = {
  id: 'demo-user-id',
  username: 'BleacherFan',
  name: 'Demo User',
  school: 'Westview High',
  badges: [{ badge_name: 'Student', type: 'school' }], // Changed 'student' to 'school'
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
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In demo mode, we immediately set the user to the demo user
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean>(true);

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

  // No need for auth state changes in demo mode
  useEffect(() => {
    console.log('Auth provider loaded in demo mode');
    // Demo user is already set
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      signOut, 
      isEmailConfirmed,
      sendMagicLink
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
