import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';

const Privacy = () => {
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
          <h1 className="font-bold text-xl">Privacy Policy</h1>
        </div>
      </header>
      
      <main className={`flex-1 px-4 py-6 ${isMobile ? 'pb-20' : ''}`}>
        <div className="container mx-auto max-w-4xl">
          <section className="prose prose-sm md:prose-base max-w-none">
            <h2>Bleacher Banter Buzz Privacy Policy</h2>
            <p>Last Updated: March 2025</p>

            <h3>1. Information We Collect</h3>
            <p>
              When you use Bleacher Banter Buzz ("the App"), we collect the following types of information:
            </p>
            <ul>
              <li><strong>Account Information:</strong> Email, username, and password when you register</li>
              <li><strong>Profile Information:</strong> School affiliation, profile picture, and other details you provide</li>
              <li><strong>Usage Data:</strong> How you interact with the App, including content views and feature usage</li>
              <li><strong>Device Information:</strong> Device type, operating system, and app version</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and improve the App's functionality</li>
              <li>Personalize your experience based on your school affiliation</li>
              <li>Send you notifications about relevant content and updates</li>
              <li>Maintain the security and integrity of the platform</li>
              <li>Analyze usage patterns to enhance our services</li>
            </ul>

            <h3>3. Information Sharing</h3>
            <p>
              We do not sell your personal information to third parties. We may share information:
            </p>
            <ul>
              <li>With other users according to your privacy settings</li>
              <li>With service providers who help us operate the App</li>
              <li>When required by law or to protect our rights</li>
            </ul>

            <h3>4. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information. 
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h3>5. Your Rights</h3>
            <p>
              Depending on your location, you may have rights to:
            </p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate information</li>
              <li>Delete your personal information</li>
              <li>Object to or restrict certain processing</li>
              <li>Export your data</li>
            </ul>

            <h3>6. Children's Privacy</h3>
            <p>
              The App is intended for high school students and older. If you are under 13, you may not use the App. 
              If you are between 13 and 18, please review this policy with a parent or guardian.
            </p>

            <h3>7. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last Updated" date.
            </p>

            <h3>8. Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@bleacherbanterbuzz.com.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
