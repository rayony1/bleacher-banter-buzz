
import AuthContext from './context';
import { AuthProvider } from './provider';
import { useContext } from 'react';

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider };
