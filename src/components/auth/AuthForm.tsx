
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AuthFormType } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import MagicLinkForm from './MagicLinkForm';
import DemoAlert from './DemoAlert';
import ErrorDisplay from './ErrorDisplay';

interface AuthFormProps {
  defaultTab?: AuthFormType;
}

const AuthForm = ({ defaultTab = 'login' }: AuthFormProps) => {
  const [tab, setTab] = useState<AuthFormType>(defaultTab);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMagicLink } = useAuth();
  
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
  }, [tab, toast, isMagicLink]);

  const handleRegisterSuccess = (email: string) => {
    setTab('login');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <DemoAlert />
      
      <Tabs value={tab} onValueChange={(value) => setTab(value as AuthFormType)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="magic">Magic Link</TabsTrigger>
        </TabsList>
        
        <ErrorDisplay message={errorMessage} />
        
        <TabsContent value="login" className="animate-fade-in">
          <LoginForm />
        </TabsContent>
        
        <TabsContent value="register" className="animate-fade-in">
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </TabsContent>
        
        <TabsContent value="magic" className="animate-fade-in">
          <MagicLinkForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
