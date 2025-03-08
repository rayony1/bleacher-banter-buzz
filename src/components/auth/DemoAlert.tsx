
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DemoAlert = () => {
  const navigate = useNavigate();
  
  return (
    <Alert className="mb-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-500" />
      <AlertTitle className="text-blue-800 dark:text-blue-400">Demo Mode Active</AlertTitle>
      <AlertDescription className="text-blue-700 dark:text-blue-300 mt-2">
        <p className="mb-2">You're being automatically redirected to the demo with sample data.</p>
        <Button 
          variant="outline" 
          className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
          onClick={() => navigate('/feed')}
        >
          Go to Demo
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default DemoAlert;
