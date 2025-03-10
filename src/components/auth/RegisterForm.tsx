
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { registerSchema, RegisterFormValues, RegisterFormProps } from './RegisterFormTypes';
import RegisterFormFields from './RegisterFormFields';
import { registerUser } from '@/lib/auth/actions';

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
      // In dev mode, use simulated registration
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: 'Demo Mode',
          description: 'Registration is simulated in demo mode.',
        });
        
        if (onSuccess) onSuccess(data.email);
      } else {
        // Real registration
        const { error, email } = await registerUser(data);
        
        if (!error && email && onSuccess) {
          onSuccess(email);
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
