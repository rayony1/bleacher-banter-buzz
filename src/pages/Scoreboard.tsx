import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameAdapter from '@/components/scoreboard/GameAdapter';
import ScoreboardTabs, { GameFilter } from '@/components/scoreboard/ScoreboardTabs';
import LocationFilter, { LocationFilter as LocationFilterType } from '@/components/scoreboard/LocationFilter';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useGames } from '@/hooks/useGames';
import { useMobile } from '@/hooks/use-mobile';
import { Game } from '@/lib/types';

const Scoreboard = () => {
  const { games, isLoading, error, userSchoolId } = useGames();
  const [statusFilter, setStatusFilter] = useState<GameFilter>('all');
  const [locationFilter, setLocationFilter] = useState<LocationFilterType>('school');
  const { isMobile } = useMobile();

  const filteredGames = !games ? [] : games.filter(game => {
    if (statusFilter !== 'all' && game.status !== statusFilter) {
      return false;
    }
    
    if (locationFilter === 'school') {
      return game.isHomeSchool || game.isAwaySchool;
    } else if (locationFilter === 'district') {
      return game.isDistrict;
    }
    
    return true;
  });

  const groupedGames = filteredGames.reduce<Record<string, Game[]>>((acc, game) => {
    const date = new Date(game.startTime).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(game);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedGames).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    const now = new Date();
    const isPastA = dateA < now;
    const isPastB = dateB < now;

    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;
    return dateA.getTime() - dateB.getTime();
  });

  const renderGames = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2DD4BF] border-r-transparent align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-muted-foreground">Loading games...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">Error loading games</p>
        </div>
      );
    }
    
    if (filteredGames.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No games to display</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        {sortedDates.map(date => (
          <div key={date}>
            <h2 className="font-semibold text-lg mb-3 text-foreground">{date}</h2>
            <div className="space-y-4">
              {groupedGames[date].map(game => (
                <GameAdapter 
                  key={game.id}
                  game={game}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'} px-4`}>
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-foreground">Scoreboard</h1>
          
          <LocationFilter activeFilter={locationFilter} onFilterChange={setLocationFilter} />
          
          <Tabs defaultValue="all" value={statusFilter} onValueChange={(value) => setStatusFilter(value as GameFilter)}>
            <ScoreboardTabs activeTab={statusFilter} onTabChange={setStatusFilter} />
            
            <TabsContent value="all" className="animate-fade-in pt-2">
              {renderGames()}
            </TabsContent>
            
            <TabsContent value="upcoming" className="animate-fade-in pt-2">
              {renderGames()}
            </TabsContent>
            
            <TabsContent value="live" className="animate-fade-in pt-2">
              {renderGames()}
            </TabsContent>
            
            <TabsContent value="final" className="animate-fade-in pt-2">
              {renderGames()}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default Scoreboard;
