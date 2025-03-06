
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/auth/AuthForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { resendConfirmationEmail } from '@/lib/supabase';

const Auth = () => {
  const { isMobile } = useMobile();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState<string>('');
  
  // Check if this is an email confirmation redirect or magic link login
  const isConfirmation = new URLSearchParams(location.search).get('confirmation') === 'true';
  const isMagicLink = new URLSearchParams(location.search).get('magic_link') === 'true';
  
  // Redirect if user is already logged in
  useEffect(() => {
    console.log('Auth page loaded. User state:', { user: user?.id, isLoading, isConfirmation, isMagicLink });
    
    if (user && !isLoading) {
      console.log('User is logged in, redirecting to feed');
      
      // If this was a magic link login, show success message
      if (isMagicLink) {
        toast({
          title: "Magic link login successful",
          description: "You have been logged in successfully.",
        });
      }
      
      navigate('/feed');
    }
    
    // Check for email in local storage (stored during registration)
    const storedEmail = localStorage.getItem('pendingConfirmationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    
    // If this is a confirmation redirect, show success message
    if (isConfirmation) {
      toast({
        title: "Email confirmed",
        description: "Your email has been successfully confirmed. You can now log in.",
      });
      // Clear the stored email
      localStorage.removeItem('pendingConfirmationEmail');
    }
  }, [user, isLoading, navigate, isConfirmation, isMagicLink, toast]);
  
  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please provide the email address you registered with.",
        variant: "destructive"
      });
      return;
    }
    
    const { error } = await resendConfirmationEmail(email);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to resend confirmation email. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Email sent",
        description: "A new confirmation email has been sent. Please check your inbox.",
      });
    }
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'} px-4`}>
        <div className="container mx-auto">
          <div className="max-w-md mx-auto">
            {!isMobile && (
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            )}
            
            {/* Confirmation Alert */}
            {email && !user && !isLoading && (
              <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <Mail className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                <AlertTitle className="text-amber-800 dark:text-amber-400">Email Confirmation Required</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2">
                  <p className="mb-2">We've sent a confirmation email to <strong>{email}</strong>. Please check your inbox and click the link to complete your registration.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50" onClick={handleResendEmail}>
                      Resend Email
                    </Button>
                    <input 
                      type="email" 
                      className="px-3 py-1 text-sm border border-amber-300 dark:border-amber-700 rounded-md bg-transparent" 
                      placeholder="Change email address"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {/* If magic link in URL but no user yet, show loading state */}
            {isMagicLink && !user && !isLoading && (
              <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                <AlertTitle className="text-blue-800 dark:text-blue-400">Processing Login</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-300 mt-2">
                  <p className="mb-2">We're processing your magic link login. Please wait a moment...</p>
                </AlertDescription>
              </Alert>
            )}
            
            <AuthForm setEmailForConfirmation={setEmail} />
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default Auth;
