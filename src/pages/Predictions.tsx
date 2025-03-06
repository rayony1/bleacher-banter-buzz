
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PredictionCard from '@/components/predictions/PredictionCard';
import PastPredictionCard from '@/components/predictions/PastPredictionCard';
import LeaderboardCard from '@/components/predictions/LeaderboardCard';
import { mockUpcomingGames, mockPastPredictions, mockLeaderboard } from '@/lib/mock-data';
import { Game, Prediction, LeaderboardEntry } from '@/lib/types';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const Predictions = () => {
  const [upcomingGames] = useState<Game[]>(mockUpcomingGames);
  const [pastPredictions] = useState<Prediction[]>(mockPastPredictions);
  const [leaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [totalPoints] = useState<number>(150);
  const { isMobile } = useMobile();
  const { user, isEmailConfirmed } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'}`}>
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            {!isMobile && (
              <Link to="/feed" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Feed
              </Link>
            )}
            
            <h1 className="text-3xl font-bold mb-6">Predictions</h1>
            
            {/* Email Confirmation Warning */}
            {user && !isEmailConfirmed && (
              <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <Mail className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                <AlertTitle className="text-amber-800 dark:text-amber-400">Email not confirmed</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
                  <p>You can browse games and leaderboards, but to make predictions, please confirm your email address.</p>
                  <Button variant="link" asChild className="p-0 h-auto text-amber-600 dark:text-amber-400 font-normal underline hover:text-amber-800 dark:hover:text-amber-300">
                    <Link to="/auth">Go to verification page</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="upcoming" className="w-full mb-6">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="upcoming">
                  Upcoming Games
                </TabsTrigger>
                <TabsTrigger value="past">
                  Your Predictions
                </TabsTrigger>
                <TabsTrigger value="leaderboard">
                  Leaderboard
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="animate-fade-in">
                {upcomingGames.length > 0 ? (
                  <div className="space-y-6">
                    <div className="bg-muted/30 p-4 rounded-lg mb-4">
                      <h3 className="font-medium mb-2">How it works:</h3>
                      <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                        <li>Predict the winner of upcoming games</li>
                        <li>Earn 10 points for correct winner predictions</li>
                        <li>Earn 20 points for exact score predictions</li>
                        <li>All predictions lock at game start time</li>
                      </ul>
                    </div>
                  
                    {upcomingGames.map((game) => (
                      <PredictionCard 
                        key={game.id} 
                        game={game} 
                        disableInteractions={!isEmailConfirmed}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-muted-foreground">No upcoming games available for prediction at this time.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="animate-fade-in">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg mb-6 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                    <h3 className="text-lg font-semibold">Your Prediction Points</h3>
                  </div>
                  <p className="text-3xl font-bold">{totalPoints}</p>
                </div>
                
                {pastPredictions.length > 0 ? (
                  <div className="space-y-4">
                    {pastPredictions.map((prediction) => (
                      <PastPredictionCard key={`${prediction.gameId}-${prediction.userId}`} prediction={prediction} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-muted-foreground">You haven't made any predictions yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="leaderboard" className="animate-fade-in">
                <div className="bg-muted/30 p-4 rounded-lg mb-6">
                  <h3 className="font-medium">School Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">Top predictors from your school</p>
                </div>
                
                {leaderboard.length > 0 ? (
                  <div className="space-y-2">
                    {leaderboard.map((entry, index) => (
                      <LeaderboardCard 
                        key={entry.userId} 
                        entry={entry} 
                        rank={index + 1} 
                        isCurrentUser={entry.userId === '1'} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-muted-foreground">No leaderboard data available yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default Predictions;
