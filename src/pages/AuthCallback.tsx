
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isEmailConfirmed } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsLoading(true);
        
        // Extract hash parameter or any query parameters
        const hashParams = location.hash ? new URLSearchParams(location.hash.substring(1)) : null;
        const queryParams = new URLSearchParams(location.search);
        
        // Check if this is a confirmation link redirect
        if (queryParams.has('type') && queryParams.has('token')) {
          // Handle email confirmation
          const { error } = await supabase.auth.verifyOtp({
            token_hash: queryParams.get('token') || '',
            type: 'email' as any, // This cast is needed because of a type mismatch
          });
          
          if (error) {
            console.error('Error verifying email:', error);
            setError(error.message);
            toast({
              title: "Error confirming email",
              description: error.message,
              variant: "destructive"
            });
          } else {
            setSuccess(true);
            localStorage.removeItem('pendingConfirmationEmail');
            toast({
              title: "Email confirmed",
              description: "Your email has been confirmed successfully.",
            });
            
            // Give a moment for the success message to be seen
            setTimeout(() => {
              navigate('/feed');
            }, 2000);
          }
        } else {
          // If not a confirmation link, redirect to feed
          navigate('/feed');
        }
      } catch (err) {
        console.error('Error processing auth callback:', err);
        setError('An unexpected error occurred while processing your request');
      } finally {
        setIsLoading(false);
      }
    };
    
    handleCallback();
  }, [location, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="mb-4 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Processing</h1>
          <p className="text-muted-foreground">Please wait while we verify your request...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="mt-6 flex justify-center">
            <Button onClick={() => navigate('/auth')}>Return to Login</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold">Email Confirmed!</h1>
          <p className="mb-6 text-muted-foreground">Your email has been confirmed successfully.</p>
          
          <Button onClick={() => navigate('/feed')}>Continue to Feed</Button>
        </Card>
      </div>
    );
  }

  // Fallback, should not reach here
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6 text-center">
        <h1 className="text-xl font-bold">Redirecting...</h1>
      </Card>
    </div>
  );
};

export default AuthCallback;
