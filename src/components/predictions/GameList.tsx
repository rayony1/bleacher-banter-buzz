
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GameCard from '@/components/predictions/GameCard';
import { Game } from '@/lib/types';

interface GameListProps {
  games: Game[];
  activeTab: 'upcoming' | 'past';
  onTabChange: (tab: 'upcoming' | 'past') => void;
  onCreateGameClick: () => void;
  userIsAthlete?: boolean;
}

const GameList = ({ 
  games, 
  activeTab, 
  onTabChange, 
  onCreateGameClick, 
  userIsAthlete 
}: GameListProps) => {
  return (
    <div className="max-w-[600px] mx-auto">
      <Tabs 
        defaultValue="upcoming" 
        value={activeTab}
        onValueChange={(value) => onTabChange(value as 'upcoming' | 'past')}
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
              />
            ))
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
              <p className="mb-4">No upcoming games scheduled</p>
              {userIsAthlete && (
                <Button 
                  onClick={onCreateGameClick}
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
  );
};

export default GameList;
