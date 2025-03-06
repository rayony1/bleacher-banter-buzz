import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Trophy, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { isMobile } = useMobile();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0"></div>
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Where High School Sports Fans Connect
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Join the conversation, support your school, and engage in friendly rivalry with fans across your district and state.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth">
                  <Button size="lg" className="w-full sm:w-auto btn-hover">
                    Join The Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/feed">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore The Feed
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Features Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 overflow-hidden shadow-sm animate-slide-up delay-100 card-hover">
                <CardContent className="p-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">School Pride</h3>
                  <p className="text-muted-foreground">
                    Connect with fellow students and fans from your school, district, and state in one dedicated platform.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 overflow-hidden shadow-sm animate-slide-up delay-200 card-hover">
                <CardContent className="p-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Prediction Polls</h3>
                  <p className="text-muted-foreground">
                    Make predictions about upcoming games, earn points, and compete for the top spot on the leaderboards.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 overflow-hidden shadow-sm animate-slide-up delay-300 card-hover">
                <CardContent className="p-6">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <Flag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Team Badges</h3>
                  <p className="text-muted-foreground">
                    Show support for your teams with verified badges that highlight your connection to your school's sports.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Bleacher Banter makes it easy to connect with other sports fans from your school and beyond.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4 animate-slide-up delay-100">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                    <p className="text-muted-foreground">
                      Sign up, select your school, and get badges that represent your connection to your school and teams.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-2">Join The Conversation</h3>
                    <p className="text-muted-foreground">
                      Post as yourself or anonymously through moderated group accounts to keep discussions respectful.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 animate-slide-up delay-200">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-2">Make Predictions</h3>
                    <p className="text-muted-foreground">
                      Predict game outcomes, earn points for correct guesses, and climb the school and district leaderboards.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-2">Stay Connected</h3>
                    <p className="text-muted-foreground">
                      Follow your school's teams, check live scores, and engage with content from across your district and state.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">Ready to Join the Community?</h2>
              <p className="text-xl text-muted-foreground mb-8 animate-fade-in delay-100">
                Create your account today and start connecting with fans from your school and beyond.
              </p>
              <Link to="/auth" className="animate-slide-up delay-200">
                <Button size="lg" className="btn-hover">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {!isMobile && <Footer />}
      
      {/* Add test login button */}
      <div className="mt-8 text-center">
        <Link to="/auth">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Test Login Flow
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
