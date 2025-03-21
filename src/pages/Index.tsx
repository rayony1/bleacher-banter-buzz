import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/layout/Footer';
import { useMobile } from '@/hooks/use-mobile';
import { useAuthState } from '@/lib/auth/useAuthState';

const Index = () => {
  const { isMobile } = useMobile();
  const { user } = useAuthState();
  const navigate = useNavigate();
  
  // Redirect logged-in users to feed
  useEffect(() => {
    if (user) {
      navigate('/feed', { replace: true });
    }
  }, [user, navigate]);
  
  // If user is logged in, return null while redirecting
  if (user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Mobile-optimized hero section with gradient background */}
        <section className="bg-gradient-to-b from-[#2DD4BF] to-[#1DA99A] min-h-screen px-4 py-8 flex flex-col items-center justify-center text-white">
          <div className="w-full max-w-md mx-auto text-center space-y-8">
            {/* App logo/icon placeholder - replace with actual logo */}
            <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-2">
              <span className="text-[#2DD4BF] text-2xl font-bold">BBB</span>
            </div>
            
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome to Bleacher Banter Buzz
              </h1>
              <p className="text-lg opacity-90">
                Connect with fellow high school sports fans, make predictions, and stay updated on game scores.
              </p>
            </div>
            
            <div className="space-y-4 w-full animate-slide-up">
              <Link to="/auth?tab=register" className="block w-full">
                <Button size="lg" className="w-full bg-white text-[#2DD4BF] hover:bg-gray-100" aria-label="Sign up for Bleacher Banter Buzz">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth?tab=login" className="block w-full">
                <Button variant="outline" size="lg" className="w-full text-white border-white hover:bg-[#2DD4BF]/20" aria-label="Log in to Bleacher Banter Buzz">
                  Log In
                </Button>
              </Link>
            </div>
            
            <footer className="mt-8 text-sm opacity-80">
              <Link to="/terms" className="underline mr-2" aria-label="Terms of Service">Terms of Service</Link> | 
              <Link to="/privacy" className="underline ml-2" aria-label="Privacy Policy">Privacy Policy</Link>
            </footer>
          </div>
        </section>
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default Index;
