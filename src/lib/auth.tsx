
import React, { createContext, useContext, useState } from 'react';
import { User } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  isEmailConfirmed: boolean;
  sendMagicLink: (email: string, redirectTo?: string) => Promise<{ error: Error | null }>;
  isMagicLink?: boolean;
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
