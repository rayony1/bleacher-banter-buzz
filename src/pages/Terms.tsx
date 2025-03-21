import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';

const Terms = () => {
  const { isMobile } = useMobile();
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 py-4 border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl flex items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="font-bold text-xl">Terms of Service</h1>
        </div>
      </header>
      
      <main className={`flex-1 px-4 py-6 ${isMobile ? 'pb-20' : ''}`}>
        <div className="container mx-auto max-w-4xl">
          <section className="prose prose-sm md:prose-base max-w-none">
            <h2>Bleacher Banter Buzz Terms of Service</h2>
            <p>Last Updated: March 2025</p>

            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing or using Bleacher Banter Buzz ("the App"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the App.
            </p>

            <h3>2. User Accounts</h3>
            <p>
              Users must provide accurate information when registering for an account. You are responsible for maintaining 
              the confidentiality of your account credentials and for all activities that occur under your account.
            </p>

            <h3>3. User Conduct</h3>
            <p>
              Users agree not to:
            </p>
            <ul>
              <li>Post content that is offensive, abusive, or harmful to others</li>
              <li>Impersonate other users or entities</li>
              <li>Use the App for any illegal activities</li>
              <li>Interfere with the proper functioning of the App</li>
              <li>Share confidential information about others without permission</li>
            </ul>

            <h3>4. Content Guidelines</h3>
            <p>
              All content posted on the App must adhere to our community guidelines. We reserve the right to remove 
              content that violates these guidelines without notice.
            </p>

            <h3>5. Intellectual Property</h3>
            <p>
              The App and its original content, features, and functionality are owned by Bleacher Banter Buzz and are 
              protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h3>6. Termination</h3>
            <p>
              We reserve the right to terminate or suspend your account without prior notice or liability for any 
              reason, including breach of these Terms.
            </p>

            <h3>7. Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, Bleacher Banter Buzz shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages.
            </p>

            <h3>8. Changes to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of significant changes 
              by updating the date at the top of these terms.
            </p>

            <h3>9. Contact Information</h3>
            <p>
              If you have any questions about these Terms, please contact us at support@bleacherbanterbuzz.com.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;
