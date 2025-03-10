
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const signOutUser = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    toast({
      title: "Signed out",
      description: "You have been signed out successfully."
    });
    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to sign out');
    toast({
      title: "Error signing out",
      description: "Could not sign you out. Please try again.",
      variant: "destructive"
    });
    return { error };
  }
};
