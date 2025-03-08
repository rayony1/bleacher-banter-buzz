
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trophy } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
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
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2DD4BF] border-r-transparent align-[-0.125em]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <p className="text-muted-foreground">Loading predictions...</p>
              </div>
            </div>
          </div>
        </main>
        {isMobile && <BottomNav />}
        {!isMobile && <Footer />}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
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
          
          {/* Page Header with Points */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Predictions</h1>
            
            {user && (
              <Card className="bg-gradient-to-r from-teal-500/90 to-cyan-500/90 text-white p-2 px-4 flex items-center gap-2 shadow-md">
                <Trophy className="h-5 w-5 text-amber-200" />
                <div className="flex flex-col">
                  <span className="text-xs text-teal-100">Your Points</span>
                  <span className="font-bold">{user.points || 0} pts</span>
                </div>
              </Card>
            )}
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load predictions. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-teal-500/10 text-teal-700 dark:text-teal-300 px-2 py-1 rounded-md mr-2 text-sm font-normal">
                Make Your Picks
              </span>
              Upcoming Games
            </h2>
            
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
              <Card className="bg-muted/30 p-6 text-center">
                <p className="text-muted-foreground">No upcoming games available for predictions</p>
              </Card>
            )}
          </section>
          
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md mr-2 text-sm font-normal">
                Results
              </span>
              Past Predictions
            </h2>
            
            {pastPredictions && pastPredictions.length > 0 ? (
              <div className="space-y-4">
                {pastPredictions.slice(0, 5).map((prediction) => (
                  <PastPredictionCard key={prediction.id} prediction={prediction} />
                ))}
                
                {pastPredictions.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" className="w-full sm:w-auto" size="sm">
                      View all predictions
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card className="bg-muted/30 p-6 text-center">
                <p className="text-muted-foreground">No past predictions yet</p>
              </Card>
            )}
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-md mr-2 text-sm font-normal">
                Rankings
              </span>
              School Leaderboard
            </h2>
            
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
