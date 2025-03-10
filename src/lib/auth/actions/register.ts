
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import { RegisterFormValues } from '@/components/auth/RegisterFormTypes';

export const registerUser = async (
  data: RegisterFormValues
): Promise<{ error: Error | null; email?: string }> => {
  try {
    console.log('Starting registration process with data:', { 
      email: data.email, 
      username: data.username,
      schoolId: data.schoolId 
    });

    // Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          school_id: data.schoolId,
        },
      },
    });

    if (signUpError) throw signUpError;

    console.log('Registration successful:', authData);
    
    toast({
      title: "Registration successful!",
      description: "Please check your email to verify your account.",
    });

    return { error: null, email: data.email };
  } catch (err) {
    console.error('Registration error:', err);
    const errorMessage = err instanceof Error 
      ? err.message 
      : 'An unknown error occurred during registration';
    
    toast({
      title: "Registration failed",
      description: errorMessage,
      variant: "destructive"
    });
    
    return { 
      error: err instanceof Error ? err : new Error(errorMessage) 
    };
  }
};
