
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, School } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthFormType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp, getSchools } from '@/lib/supabase';

// Form schemas for login and register
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  schoolId: z.string({ required_error: 'Please select your school' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  defaultTab?: AuthFormType;
}

const AuthForm = ({ defaultTab = 'login' }: AuthFormProps) => {
  const [tab, setTab] = useState<AuthFormType>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [schools, setSchools] = useState<Array<{ school_id: string; school_name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch schools for the registration form
    const fetchSchools = async () => {
      const { data, error } = await getSchools();
      if (error) {
        toast({
          title: 'Error fetching schools',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data) {
        setSchools(data);
      }
    };

    fetchSchools();
  }, [toast]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      schoolId: '',
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    
    toast({
      title: 'Signing in...',
      description: 'Please wait while we authenticate your account.',
    });
    
    const { data: authData, error } = await signIn(data.email, data.password);
    
    setLoading(false);
    
    if (error) {
      toast({
        title: 'Authentication failed',
        description: error.message,
        variant: 'destructive',
      });
    } else if (authData?.user) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      navigate('/feed');
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    
    toast({
      title: 'Creating your account...',
      description: 'Please wait while we set up your profile.',
    });
    
    const { data: authData, error } = await signUp(
      data.email, 
      data.password, 
      data.username, 
      data.schoolId
    );
    
    setLoading(false);
    
    if (error) {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account created!',
        description: 'Please check your email to confirm your account.',
      });
      navigate('/feed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs value={tab} onValueChange={(value) => setTab(value as AuthFormType)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="animate-fade-in">
          <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back</h2>
            <p className="text-muted-foreground text-center mb-6">
              Sign in to continue to Bleacher Banter
            </p>
            
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
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
                  control={loginForm.control}
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
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
        
        <TabsContent value="register" className="animate-fade-in">
          <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-center">Create Account</h2>
            <p className="text-muted-foreground text-center mb-6">
              Join the community and start cheering for your school
            </p>
            
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
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
                  control={registerForm.control}
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
                  control={registerForm.control}
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
                  control={registerForm.control}
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
                          {schools.map((school) => (
                            <SelectItem 
                              key={school.school_id} 
                              value={school.school_id}
                            >
                              {school.school_name}
                            </SelectItem>
                          ))}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
