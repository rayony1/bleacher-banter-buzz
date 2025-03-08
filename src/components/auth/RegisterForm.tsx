
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getSchools } from '@/lib/supabase';

const registerSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  schoolId: z.string({ required_error: 'Please select your school' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: (email: string) => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [schools, setSchools] = useState<Array<{ school_id: string; school_name: string }>>([]);
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

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        console.log('Fetching schools...');
        const { data, error } = await getSchools();
        if (error) {
          console.error('Error fetching schools:', error);
          toast({
            title: 'Error fetching schools',
            description: error.message,
            variant: 'destructive',
          });
        } else if (data) {
          console.log('Schools fetched successfully:', data.length);
          setSchools(data);
        }
      } catch (err) {
        console.error('Exception fetching schools:', err);
      }
    };

    fetchSchools();
  }, [toast]);

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
      toast({
        title: 'Demo Mode',
        description: 'Registration is simulated in demo mode.',
      });
      
      if (onSuccess) onSuccess(data.email);
    } catch (err) {
      console.error('Exception during registration:', err);
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
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Choose a username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@school.edu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="schoolId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {schools.length > 0 ? (
                      schools.map((school) => (
                        <SelectItem 
                          key={school.school_id} 
                          value={school.school_id}
                        >
                          {school.school_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        Loading schools...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
