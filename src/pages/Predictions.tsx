import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import GameCard from '@/components/predictions/GameCard';
import { usePredictions } from '@/hooks/usePredictions';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { Game } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Predictions = () => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate('/auth');
    }
  }, [user, isUserLoading, navigate]);
  
  const {
    games,
    isLoading,
    error,
    makePrediction,
  } = usePredictions(activeTab);
  
  const handleCreateGameClick = () => {
    console.log('Create game button clicked');
    // This would typically open a modal or navigate to a create game page
  };
  
  if (isUserLoading || (isLoading && !games)) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-[600px] mx-auto px-4 py-3 flex justify-between items-center">
            {user ? (
              <Avatar className="h-8 w-8 border-2 border-[#2DD4BF]">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-[#2DD4BF]/10 text-[#2DD4BF]">
                  {user.username?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-8 w-8"></div>
            )}
            
            <div className="text-xl font-bold">Predictions</div>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <main className="flex-1">
          <div className="max-w-[600px] mx-auto">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upcoming">Upcoming Games</TabsTrigger>
                <TabsTrigger value="past">Past Games</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="animate-pulse space-y-4 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-12 w-12 rounded-full mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex space-x-2 mb-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-12 w-12 rounded-full mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        {isMobile && <BottomNav />}
        {!isMobile && <Footer />}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-[600px] mx-auto px-4 py-3 flex justify-between items-center">
            {user ? (
              <Avatar className="h-8 w-8 border-2 border-[#2DD4BF]">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-[#2DD4BF]/10 text-[#2DD4BF]">
                  {user.username?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-8 w-8"></div>
            )}
            
            <div className="text-xl font-bold">Predictions</div>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <main className="flex-1">
          <div className="max-w-[600px] mx-auto px-4 py-6">
            <Alert variant="destructive" className="mb-4 rounded-xl">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load games. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </main>
        
        {isMobile && <BottomNav />}
        {!isMobile && <Footer />}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[600px] mx-auto px-4 py-3 flex justify-between items-center">
          {user ? (
            <Avatar className="h-8 w-8 border-2 border-[#2DD4BF]">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-[#2DD4BF]/10 text-[#2DD4BF]">
                {user.username?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8"></div>
          )}
          
          <div className="text-xl font-bold">Predictions</div>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <main className="flex-1">
        <div className="max-w-[600px] mx-auto">
          <Tabs 
            defaultValue="upcoming" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'upcoming' | 'past')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upcoming">Upcoming Games</TabsTrigger>
              <TabsTrigger value="past">Past Games</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4 p-4">
              {games && games.length > 0 ? (
                games.map((game: Game) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onPrediction={makePrediction}
                    disableInteractions={false}
                  />
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                  <p className="mb-4">No upcoming games scheduled</p>
                  {user?.isAthlete && (
                    <Button 
                      onClick={handleCreateGameClick}
                      className="rounded-full px-4 py-2 bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add game
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4 p-4">
              {games && games.length > 0 ? (
                games.map((game: Game) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onPrediction={makePrediction}
                    disableInteractions={true}
                  />
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
                  <p>No past games found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {user?.isAthlete && (
        <Button
          onClick={handleCreateGameClick}
          className="fixed bottom-20 right-4 md:right-6 rounded-full shadow-lg w-14 h-14 p-0 z-10 bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
          aria-label="Add new game"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
      
      {isMobile && <BottomNav />}
      {!isMobile && <Footer />}
    </div>
  );
};

export default Predictions;
