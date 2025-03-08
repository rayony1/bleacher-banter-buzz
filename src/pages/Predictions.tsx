
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Trophy, Clock } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
        
          {/* Email confirmation warning - REDESIGNED FOR COMPACT SIZE */}
          {user && !isEmailConfirmed && (
            <Alert className="mb-4 py-2 bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
              <div className="flex justify-between items-center w-full">
                <div className="flex-1">
                  <AlertTitle className="text-sm font-medium text-amber-800 dark:text-amber-400">Email not confirmed</AlertTitle>
                  <AlertDescription className="text-xs text-amber-700 dark:text-amber-300">
                    Confirm your email to make predictions
                  </AlertDescription>
                </div>
                <Button 
                  variant="link" 
                  className="text-xs text-amber-600 dark:text-amber-400 p-0 h-auto font-medium"
                  onClick={() => navigate('/auth')}
                >
                  Resend email
                </Button>
              </div>
            </Alert>
          )}
          
          {/* Page Header with Points - REDESIGNED FOR BETTER LAYOUT */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h1 className="text-xl font-bold">Predictions</h1>
            
            {user && (
              <Card className="bg-gradient-to-r from-teal-500/90 to-cyan-500/90 text-white py-1.5 px-3 flex items-center gap-2 shadow-md">
                <Trophy className="h-4 w-4 text-amber-200" />
                <div className="flex flex-col">
                  <span className="text-xs text-teal-100">Your Points</span>
                  <span className="font-bold text-sm">{user.points || 0} pts</span>
                </div>
              </Card>
            )}
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load predictions. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Badge variant="outline" className="bg-teal-500/10 text-teal-700 dark:text-teal-300 border-0 mr-2 text-xs">
                Make Your Picks
              </Badge>
              Upcoming Games
            </h2>
            
            {upcomingGames && upcomingGames.length > 0 ? (
              <ScrollArea className="w-full whitespace-nowrap pb-3">
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
              <Card className="bg-muted/30 p-5 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No upcoming games available for predictions</p>
                </div>
              </Card>
            )}
          </section>
          
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-0 mr-2 text-xs">
                Results
              </Badge>
              Past Predictions
            </h2>
            
            {pastPredictions && pastPredictions.length > 0 ? (
              <div className="space-y-3">
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
              <Card className="bg-muted/30 p-5 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No past predictions yet</p>
                </div>
              </Card>
            )}
          </section>
          
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-0 mr-2 text-xs">
                Rankings
              </Badge>
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
