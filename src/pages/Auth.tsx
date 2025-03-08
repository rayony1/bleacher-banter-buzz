
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';

const Auth = () => {
  const { isMobile } = useMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is logged in, redirect to feed
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
            <AuthForm defaultTab="login" />
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default Auth;
