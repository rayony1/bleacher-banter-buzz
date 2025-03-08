
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { DEMO_USER } from './types';

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<any>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<Error | null>>,
  setIsMagicLink: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

  return {
    signOut,
    sendMagicLink
  };
};
