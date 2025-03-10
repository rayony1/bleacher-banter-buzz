
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export const registerWithSchool = async (
  email: string, 
  password: string, 
  username: string, 
  schoolId: string
): Promise<{ error: Error | null }> => {
  try {
    // Sign up the user with email and password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          school_id: schoolId
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (authError) throw authError;
    
    if (authData.user) {
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account."
      });
    }
    
    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to register');
    toast({
      title: "Registration failed",
      description: error.message,
      variant: "destructive"
    });
    return { error };
  }
};
