
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GameCard from '@/components/scoreboard/GameCard';
import { Button } from '@/components/ui/button';
import { mockGames } from '@/lib/mock-data';
import { Game } from '@/lib/types';

type FilterType = 'school' | 'district' | 'state';

const Scoreboard = () => {
  const [filter, setFilter] = useState<FilterType>('school');
  const [games, setGames] = useState<Game[]>(mockGames);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // In a real app, this would fetch updated games from the API
    }, 800);
  };

  const filteredGames = games.filter(game => {
    if (filter === 'school') return game.isHomeSchool || game.isAwaySchool;
    if (filter === 'district') return game.isDistrict;
    return true; // state shows all games
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link to="/feed" className="inline-flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Feed
              </Link>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={loading}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <h1 className="text-3xl font-bold mb-6">Scoreboard</h1>
            
            <Tabs defaultValue="school" className="w-full mb-6">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger 
                  value="school" 
                  onClick={() => setFilter('school')}
                >
                  My School
                </TabsTrigger>
                <TabsTrigger 
                  value="district" 
                  onClick={() => setFilter('district')}
                >
                  District
                </TabsTrigger>
                <TabsTrigger 
                  value="state" 
                  onClick={() => setFilter('state')}
                >
                  State
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="school" className="animate-fade-in">
                {filteredGames.length > 0 ? (
                  <div className="space-y-4">
                    {filteredGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-muted-foreground">No games found for your school today.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="district" className="animate-fade-in">
                {filteredGames.length > 0 ? (
                  <div className="space-y-4">
                    {filteredGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-muted-foreground">No district games available today.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="state" className="animate-fade-in">
                {filteredGames.length > 0 ? (
                  <div className="space-y-4">
                    {filteredGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-muted-foreground">No state games available today.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Scoreboard;
