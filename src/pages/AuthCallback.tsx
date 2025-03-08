
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsLoading(true);
        
        // Extract hash parameter or any query parameters
        const hashParams = location.hash ? new URLSearchParams(location.hash.substring(1)) : null;
        const queryParams = new URLSearchParams(location.search);
        
        // Check if this is a magic link redirect
        if (queryParams.has('type') && queryParams.has('token')) {
          const token = queryParams.get('token') || '';
          const type = queryParams.get('type') || '';
          
          console.log(`Processing ${type} verification with token`);
          
          // Handle verification
          let verifyResult;
          
          if (type === 'recovery' || type === 'invite' || type === 'email_change') {
            // Handle other types
            verifyResult = await supabase.auth.verifyOtp({
              token_hash: token,
              type: type as any,
            });
          } else {
            // Handle magic link
            verifyResult = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'email' as any,
            });
          }
          
          const { error } = verifyResult;
          
          if (error) {
            console.error('Error verifying:', error);
            setError(error.message);
            toast({
              title: "Verification failed",
              description: error.message,
              variant: "destructive"
            });
          } else {
            toast({
              title: "Login successful",
              description: "You have been logged in successfully.",
            });
            
            // Redirect to feed page after successful verification
            navigate('/feed');
          }
        } else if (location.hash) {
          // Handle auth callback from OAuth
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            console.error('Error getting user session:', error);
            setError(error.message);
          } else if (data?.user) {
            navigate('/feed');
          }
        } else {
          // If not a verification link, redirect to feed
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
