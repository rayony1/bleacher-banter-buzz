import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/scoreboard/GameCard';
import GameAdapter from '@/components/scoreboard/GameAdapter';
import { useGames } from '@/hooks/useGames';
import { useMobile } from '@/hooks/use-mobile';
import { Game } from '@/lib/types';

type GameFilter = 'all' | 'upcoming' | 'live' | 'final';

const Scoreboard = () => {
  const { games, isLoading, error } = useGames();
  const [filter, setFilter] = useState<GameFilter>('all');
  const { isMobile } = useMobile();

  const filteredGames = !games ? [] : games.filter(game => {
    if (filter === 'all') return true;
    return game.status === filter;
  });

  // Group games by date
  const groupedGames = filteredGames.reduce<Record<string, Game[]>>((acc, game) => {
    // Use startTime, not start_time
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

  // Sort dates with today and upcoming dates first, then past dates
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'} px-4`}>
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Scoreboard</h1>
          
          <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as GameFilter)}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="final">Final</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="animate-fade-in">
              {isLoading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading games...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-500">Error loading games</p>
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No games to display</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedDates.map(date => (
                    <div key={date}>
                      <h2 className="font-semibold text-lg mb-3">{date}</h2>
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
              )}
            </TabsContent>
            
            {/* The other tab contents (upcoming, live, final) are identical to "all" 
                but with the filtered games specific to that status */}
            <TabsContent value="upcoming" className="animate-fade-in">
              {isLoading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading games...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-500">Error loading games</p>
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No games to display</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedDates.map(date => (
                    <div key={date}>
                      <h2 className="font-semibold text-lg mb-3">{date}</h2>
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
              )}
            </TabsContent>
            
            <TabsContent value="live" className="animate-fade-in">
              {isLoading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading games...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-500">Error loading games</p>
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No games to display</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedDates.map(date => (
                    <div key={date}>
                      <h2 className="font-semibold text-lg mb-3">{date}</h2>
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
              )}
            </TabsContent>
            
            <TabsContent value="final" className="animate-fade-in">
              {isLoading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Loading games...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-500">Error loading games</p>
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No games to display</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedDates.map(date => (
                    <div key={date}>
                      <h2 className="font-semibold text-lg mb-3">{date}</h2>
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
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default Scoreboard;
