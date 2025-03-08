
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePredictions } from '@/hooks/usePredictions';
import { useGames } from '@/hooks/useGames';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import PredictionsHeader from '@/components/predictions/PredictionsHeader';
import GameListSkeleton from '@/components/predictions/GameListSkeleton';
import ErrorDisplay from '@/components/predictions/ErrorDisplay';
import GameList from '@/components/predictions/GameList';
import AddGameButton from '@/components/predictions/AddGameButton';

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
  
  const { predictions, isLoading: isPredictionsLoading, submitPrediction } = usePredictions();
  const { games, isLoading: isGamesLoading, error } = useGames();
  
  const isLoading = isUserLoading || isPredictionsLoading || isGamesLoading;
  
  const handleCreateGameClick = () => {
    console.log('Create game button clicked');
    // This would typically open a modal or navigate to a create game page
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
      <PredictionsHeader user={user} />
      
      <main className="flex-1">
        {isLoading && !games ? (
          <GameListSkeleton />
        ) : error ? (
          <ErrorDisplay />
        ) : (
          <>
            <GameList 
              games={games} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              onCreateGameClick={handleCreateGameClick}
              userIsAthlete={user?.isAthlete}
            />
            
            {user?.isAthlete && (
              <AddGameButton onClick={handleCreateGameClick} />
            )}
          </>
        )}
      </main>
      
      {isMobile && <BottomNav />}
      {!isMobile && <Footer />}
    </div>
  );
};

export default Predictions;
