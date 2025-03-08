
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { resendConfirmationEmail } from '@/lib/supabase';

interface EmailConfirmationBannerProps {
  userEmail: string | undefined;
  compact?: boolean;
}

const EmailConfirmationBanner = ({ userEmail, compact = false }: EmailConfirmationBannerProps) => {
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResendConfirmation = async () => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Could not determine your email address",
        variant: "destructive"
      });
      return;
    }

    setIsResending(true);
    
    try {
      const { error } = await resendConfirmationEmail(userEmail);
      
      if (error) {
        console.error('Error resending confirmation email:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Confirmation email sent",
          description: "Please check your inbox for the confirmation link"
        });
      }
    } catch (err) {
      console.error('Error sending confirmation email:', err);
      toast({
        title: "Error",
        description: "Could not send confirmation email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  if (compact) {
    return (
      <Alert className="py-2 bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
        <div className="flex justify-between items-center w-full">
          <div className="flex-1">
            <AlertTitle className="text-sm font-medium text-amber-800 dark:text-amber-400">Email not confirmed</AlertTitle>
            <AlertDescription className="text-xs text-amber-700 dark:text-amber-300">
              Confirm your email to unlock all features
            </AlertDescription>
          </div>
          <Button 
            variant="link" 
            className="text-xs text-amber-600 dark:text-amber-400 p-0 h-auto font-medium"
            onClick={handleResendConfirmation}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend email'
            )}
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      <AlertTitle className="text-amber-800 dark:text-amber-400">Email confirmation required</AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2">
        <p className="mb-2">Please confirm your email address to access all features.</p>
        <div className="flex gap-2 mt-1">
          <Button 
            variant="outline" 
            size="sm"
            className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            onClick={handleResendConfirmation}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Sending confirmation email...
              </>
            ) : (
              'Resend confirmation email'
            )}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EmailConfirmationBanner;
