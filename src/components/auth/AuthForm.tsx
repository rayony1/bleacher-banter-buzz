import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthFormType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp, getSchools, sendMagicLink as supabaseSendMagicLink } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth';

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

const magicLinkSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;

interface AuthFormProps {
  defaultTab?: AuthFormType;
  setEmailForConfirmation?: React.Dispatch<React.SetStateAction<string>>;
}

const AuthForm = ({ defaultTab = 'login', setEmailForConfirmation }: AuthFormProps) => {
  const [tab, setTab] = useState<AuthFormType>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [schools, setSchools] = useState<Array<{ school_id: string; school_name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const { isMagicLink, sendMagicLink } = useAuth();
  
  useEffect(() => {
    const autoDemoLogin = async () => {
      toast({
        title: "Demo Mode Active",
        description: "You're using Bleacher Banter in demo mode with sample data.",
      });
      navigate('/feed');
    };
    
    autoDemoLogin();
  }, [navigate, toast]);
  
  useEffect(() => {
    if (isMagicLink) {
      toast({
        title: "Magic link login",
        description: "Processing your login...",
      });
    }
    
    setErrorMessage(null);
    
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
  }, [tab, toast, isMagicLink]);

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

  const magicLinkForm = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: '',
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMessage(null);
    
    console.log('Login attempt with email:', data.email);
    
    toast({
      title: 'Signing in...',
      description: 'Please wait while we authenticate your account.',
    });
    
    try {
      toast({
        title: 'Demo Mode',
        description: 'Authentication is simulated in demo mode.',
      });
      
      navigate('/feed');
    } catch (err) {
      console.error('Exception during login:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setErrorMessage(null);
    
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
      
      if (setEmailForConfirmation) {
        setEmailForConfirmation(data.email);
        localStorage.setItem('pendingConfirmationEmail', data.email);
      }
      
      setTab('login');
      loginForm.setValue('email', data.email);
    } catch (err) {
      console.error('Exception during registration:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onMagicLinkSubmit = async (data: MagicLinkFormValues) => {
    setLoading(true);
    setErrorMessage(null);
    
    console.log('Magic link request for email:', data.email);
    
    toast({
      title: "Sending magic link...",
      description: "Please wait while we prepare your login link.",
    });
    
    try {
      const { error } = await sendMagicLink(data.email);
      
      if (error) {
        console.error('Magic link error:', error);
        setErrorMessage(error.message);
        toast({
          title: "Failed to send magic link",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Magic link sent successfully');
        setMagicLinkSent(true);
        toast({
          title: "Magic link sent!",
          description: "Please check your email for a login link.",
        });
        
        if (setEmailForConfirmation) {
          setEmailForConfirmation(data.email);
        }
      }
    } catch (err) {
      console.error('Exception during magic link request:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <Mail className="h-4 w-4 text-blue-600 dark:text-blue-500" />
        <AlertTitle className="text-blue-800 dark:text-blue-400">Demo Mode Active</AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-300 mt-2">
          <p className="mb-2">You're being automatically redirected to the demo with sample data.</p>
          <Button 
            variant="outline" 
            className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            onClick={() => navigate('/feed')}
          >
            Go to Demo
          </Button>
        </AlertDescription>
      </Alert>
      
      <Tabs value={tab} onValueChange={(value) => setTab(value as AuthFormType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="magic">Magic Link</TabsTrigger>
        </TabsList>
        
        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
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
        </TabsContent>
        
        <TabsContent value="magic" className="animate-fade-in">
          <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-center">Passwordless Login</h2>
            <p className="text-muted-foreground text-center mb-6">
              Get a secure login link sent to your email
            </p>
            
            {magicLinkSent ? (
              <Alert className="mb-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-500" />
                <AlertTitle className="text-green-800 dark:text-green-400">Magic Link Sent</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300 mt-2">
                  <p className="mb-2">We've sent a login link to your email. Please check your inbox and click the link to sign in.</p>
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...magicLinkForm}>
                <form onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)} className="space-y-4">
                  <FormField
                    control={magicLinkForm.control}
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
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Magic Link'}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
