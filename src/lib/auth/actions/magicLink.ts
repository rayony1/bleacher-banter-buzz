
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const sendMagicLink = async (email: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) throw error;
    
    toast({
      title: "Magic link sent",
      description: "Check your email for a login link."
    });
    
    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to send magic link');
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
    return { error };
  }
};
