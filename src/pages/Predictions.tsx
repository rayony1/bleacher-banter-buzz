
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import PredictionCard from '@/components/predictions/PredictionCard';
import PastPredictionCard from '@/components/predictions/PastPredictionCard';
import LeaderboardCard from '@/components/predictions/LeaderboardCard';
import { useGames } from '@/hooks/useGames';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { Game } from '@/lib/types';

const Predictions = () => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading, isEmailConfirmed } = useAuth();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate('/auth');
    }
  }, [user, isUserLoading, navigate]);
  
  const {
    games: upcomingGames,
    predictions: pastPredictions,
    isLoading,
    error,
  } = useGames();
  
  // Loading state
  if (isUserLoading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'} px-4`}>
          <div className="container mx-auto max-w-4xl">
            <p className="text-center text-muted-foreground">Loading predictions...</p>
          </div>
        </main>
        {isMobile && <BottomNav />}
        {!isMobile && <Footer />}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'} px-4`}>
        <div className="container mx-auto max-w-4xl">
        
          {/* Email confirmation warning */}
          {user && !isEmailConfirmed && (
            <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              <AlertTitle className="text-amber-800 dark:text-amber-400">Email not confirmed</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                Your email address is not confirmed. You can browse predictions, but you won't be able to make your own predictions until you confirm your email.
                <Button 
                  variant="link" 
                  className="text-amber-600 dark:text-amber-400 p-0 h-auto font-semibold"
                  onClick={() => navigate('/auth')}
                >
                  Resend confirmation email
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <h1 className="text-2xl font-bold mb-6">Predictions</h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load predictions. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Upcoming Games</h2>
            {upcomingGames && upcomingGames.length > 0 ? (
              <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex space-x-4">
                  {upcomingGames.map((game: Game) => (
                    <PredictionCard 
                      key={game.id} 
                      game={game} 
                      disableInteractions={!isEmailConfirmed}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground text-center py-8">No upcoming games</p>
            )}
          </section>
          
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Past Predictions</h2>
            {pastPredictions && pastPredictions.length > 0 ? (
              <div className="space-y-4">
                {pastPredictions.slice(0, 5).map((prediction) => (
                  <PastPredictionCard key={prediction.id} prediction={prediction} />
                ))}
                {pastPredictions.length > 5 && (
                  <Button variant="link" className="w-full">View all predictions</Button>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No past predictions</p>
            )}
          </section>
          
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">School Leaderboard</h2>
            <LeaderboardCard isCurrentUser={false} rank={0} entry={{
              userId: "",
              username: "",
              school: "",
              points: 0,
              correctPredictions: 0,
              totalPredictions: 0
            }} />
          </section>
        </div>
      </main>
      
      {isMobile && <BottomNav />}
      {!isMobile && <Footer />}
    </div>
  );
};

export default Predictions;
