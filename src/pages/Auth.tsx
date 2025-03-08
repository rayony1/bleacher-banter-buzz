
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail, Check } from 'lucide-react';

const Auth = () => {
  const { isMobile } = useMobile();
  const { user, isEmailConfirmed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [emailForConfirmation, setEmailForConfirmation] = useState<string>('');
  const [confirmationSent, setConfirmationSent] = useState(false);
  
  // Check if there's a stored email for confirmation
  useEffect(() => {
    const storedEmail = localStorage.getItem('pendingConfirmationEmail');
    if (storedEmail) {
      setEmailForConfirmation(storedEmail);
    }
    
    // Check if we're coming from a successful email confirmation
    const hasConfirmed = location.search.includes('confirmed=true');
    if (hasConfirmed) {
      setConfirmationSent(true);
    }
  }, [location]);
  
  // If user is logged in and email is confirmed, redirect to feed
  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'} px-4`}>
        <div className="container mx-auto">
          <div className="max-w-md mx-auto">
            {confirmationSent && (
              <Alert className="mb-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
                <AlertTitle className="text-green-800 dark:text-green-400">Email confirmed successfully</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Your email has been confirmed. You can now sign in.
                </AlertDescription>
              </Alert>
            )}
            
            <AuthForm 
              defaultTab="login" 
              setEmailForConfirmation={setEmailForConfirmation}
            />
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default Auth;
