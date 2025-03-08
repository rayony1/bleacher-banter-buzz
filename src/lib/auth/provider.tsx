
import React from 'react';
import AuthContext from './context';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    userEmail,
    isMagicLink,
    setIsMagicLink
  } = useAuthState();

  const { signOut, sendMagicLink } = useAuthActions(
    setUser,
    setIsLoading,
    setError,
    setIsMagicLink
  );

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      signOut, 
      userEmail,
      sendMagicLink,
      isMagicLink
    }}>
      {children}
    </AuthContext.Provider>
  );
};
