
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

const magicLinkSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;

const MagicLinkForm = () => {
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { toast } = useToast();
  const { sendMagicLink } = useAuth();

  const form = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: MagicLinkFormValues) => {
    setLoading(true);
    
    console.log('Magic link request for email:', data.email);
    
    toast({
      title: "Sending magic link...",
      description: "Please wait while we prepare your login link.",
    });
    
    try {
      const { error } = await sendMagicLink(data.email);
      
      if (error) {
        console.error('Magic link error:', error);
        toast({
          title: "Failed to send magic link",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Magic link sent successfully');
        setMagicLinkSent(true);
        toast({
          title: "Magic link sent!",
          description: "Please check your email for a login link.",
        });
      }
    } catch (err) {
      console.error('Exception during magic link request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center">Passwordless Login</h2>
      <p className="text-muted-foreground text-center mb-6">
        Get a secure login link sent to your email
      </p>
      
      {magicLinkSent ? (
        <Alert className="mb-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
          <Mail className="h-4 w-4 text-green-600 dark:text-green-500" />
          <AlertTitle className="text-green-800 dark:text-green-400">Magic Link Sent</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300 mt-2">
            <p className="mb-2">We've sent a login link to your email. Please check your inbox and click the link to sign in.</p>
          </AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@school.edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default MagicLinkForm;
