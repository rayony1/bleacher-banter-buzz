
import React, { createContext } from 'react';
import { AuthContextType } from './types';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  signOut: async () => {},
  userEmail: undefined,
  sendMagicLink: async () => ({ error: null }),
  isMagicLink: false,
});

export default AuthContext;

