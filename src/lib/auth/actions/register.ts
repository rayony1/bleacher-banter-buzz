
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

// Add the missing registerWithSchool function
export const registerWithSchool = async (
  email: string, 
  password: string, 
  username: string, 
  schoolId: string
): Promise<{ error: Error | null }> => {
  try {
    console.log('Registering user with school data:', { 
      email, 
      username, 
      schoolId 
    });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          school_id: schoolId,
        },
      },
    });

    if (error) throw error;

    console.log('Registration with school successful:', data);
    
    return { error: null };
  } catch (err) {
    console.error('Registration with school error:', err);
    return { 
      error: err instanceof Error ? err : new Error('Failed to register user with school')
    };
  }
};
