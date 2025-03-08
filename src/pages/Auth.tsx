
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';

const Auth = () => {
  const { isMobile } = useMobile();
  const { user, isEmailConfirmed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [emailForConfirmation, setEmailForConfirmation] = useState<string>('');
  
  // Check if there's a stored email for confirmation
  useEffect(() => {
    const storedEmail = localStorage.getItem('pendingConfirmationEmail');
    if (storedEmail) {
      setEmailForConfirmation(storedEmail);
    }
  }, []);
  
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
