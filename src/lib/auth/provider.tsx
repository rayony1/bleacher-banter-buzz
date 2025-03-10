
import React, { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import AuthContext from './context';
import { DEMO_USER } from './types';
import { 
  fetchUserProfile,
  signOutUser,
  sendMagicLink,
  registerWithSchool as register
} from './actions';

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
          handleUserSession(session.user.id);
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
        handleUserSession(session.user.id);
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

  const handleUserSession = async (userId: string) => {
    setIsLoading(true);
    const { user: userProfile, error: fetchError } = await fetchUserProfile(userId);
    
    if (fetchError) {
      setError(fetchError);
    }
    
    setUser(userProfile);
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error: signOutError } = await signOutUser();
    
    if (signOutError) {
      setError(signOutError);
    } else {
      setUser(DEMO_USER);
    }
    
    setIsLoading(false);
  };

  const handleMagicLink = async (email: string) => {
    setIsLoading(true);
    const { error: magicLinkError } = await sendMagicLink(email);
    
    if (magicLinkError) {
      setError(magicLinkError);
    } else {
      setIsMagicLink(true);
    }
    
    setIsLoading(false);
    return { error: magicLinkError };
  };

  const registerWithSchool = async (email: string, password: string, username: string, schoolId: string) => {
    setIsLoading(true);
    const { error: registerError } = await register(email, password, username, schoolId);
    
    if (registerError) {
      setError(registerError);
    } else {
      setUserEmail(email);
    }
    
    setIsLoading(false);
    return { error: registerError };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      signOut, 
      userEmail,
      sendMagicLink: handleMagicLink,
      isMagicLink,
      registerWithSchool
    }}>
      {children}
    </AuthContext.Provider>
  );
};
