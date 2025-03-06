
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/auth/AuthForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Auth = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-md mx-auto">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <AuthForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
