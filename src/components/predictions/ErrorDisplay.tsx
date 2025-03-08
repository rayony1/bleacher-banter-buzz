
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const ErrorDisplay = () => {
  return (
    <div className="max-w-[600px] mx-auto px-4 py-6">
      <Alert variant="destructive" className="mb-4 rounded-xl">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load games. Please try again later.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorDisplay;
