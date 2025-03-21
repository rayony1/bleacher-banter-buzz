
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { registerSchema, RegisterFormValues, RegisterFormProps } from './RegisterFormTypes';
import RegisterFormFields from './RegisterFormFields';
import { registerUser } from '@/lib/auth/actions';
import { supabase } from '@/lib/supabase/client';

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      schoolId: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    
    console.log('Registration attempt with:', { 
      email: data.email, 
      username: data.username, 
      schoolId: data.schoolId 
    });
    
    toast({
      title: "Creating your account...",
      description: "Please wait while we set up your profile.",
    });
    
    try {
      // Use real Supabase registration
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            school_id: data.schoolId
          }
        }
      });
      
      if (error) {
        console.error('Error during registration:', error.message);
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }
      
      if (authData.user) {
        // Create profile if registration succeeded
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: authData.user.id,
              username: data.username,
              school_id: data.schoolId,
              is_athlete: false,
              points: 0
            }
          ]);
        
        if (profileError) {
          console.error('Error creating profile:', profileError.message);
          toast({
            title: 'Profile creation error',
            description: 'Your account was created but we had trouble setting up your profile. Please contact support.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Account created!',
            description: 'Your account has been successfully created. You can now sign in.',
          });
          
          if (onSuccess) onSuccess(data.email);
        }
      }
    } catch (err) {
      console.error('Exception during registration:', err);
      toast({
        title: "Registration error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
      <p className="text-muted-foreground text-center mb-6">
        Join the community and start cheering for your school
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <RegisterFormFields form={form} />
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
