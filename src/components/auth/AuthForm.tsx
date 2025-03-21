import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AuthFormType } from '@/lib/types';
import { useAuthState } from '@/lib/auth/useAuthState';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ErrorDisplay from './ErrorDisplay';

interface AuthFormProps {
  defaultTab?: AuthFormType;
}

const AuthForm = ({ defaultTab = 'login' }: AuthFormProps) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab') as AuthFormType | null;
  
  const [tab, setTab] = useState<AuthFormType>(tabParam || defaultTab);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMagicLink } = useAuthState();
  
  useEffect(() => {
    // Check if it's a deep link for magic link authentication
    if (isMagicLink) {
      toast({
        title: "Magic Link Detected",
        description: "Processing your login...",
      });
    }
  }, [toast, isMagicLink]);
  
  // Update tab when URL query parameter changes
  useEffect(() => {
    if (tabParam && ['login', 'register'].includes(tabParam)) {
      setTab(tabParam);
    }
  }, [tabParam]);
  
  useEffect(() => {
    setErrorMessage(null);
  }, [tab]);

  const handleRegisterSuccess = (email: string) => {
    setTab('login');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs value={tab} onValueChange={(value) => setTab(value as AuthFormType)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
          {/* <TabsTrigger value="magic">Magic Link</TabsTrigger> */}
        </TabsList>
        
        <ErrorDisplay message={errorMessage} />
        
        <TabsContent value="login" className="animate-fade-in">
          <LoginForm />
        </TabsContent>
        
        <TabsContent value="register" className="animate-fade-in">
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
