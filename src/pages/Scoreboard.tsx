
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GameCard from '@/components/scoreboard/GameCard';
import GameAdapter from '@/components/scoreboard/GameAdapter';
import { useGames } from '@/hooks/useGames';
import { Loader2, Search } from 'lucide-react';
import { SportType } from '@/lib/types';

const Scoreboard = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'school' | 'district' | 'live'>('all');
  const [sportFilter, setSportFilter] = useState<SportType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { games, isLoading, userSchoolId } = useGames();
  
  // Filter games based on active tab, sport filter, and search term
  const filteredGames = games
    .filter(game => {
      // Tab filtering
      if (activeTab === 'school') {
        return game.home_team_id === userSchoolId || game.away_team_id === userSchoolId;
      }
      if (activeTab === 'live') {
        return game.status === 'live';
      }
      // For 'all' and 'district' (district is simulated)
      return true;
    })
    .filter(game => {
      // Sport filtering
      if (sportFilter !== 'all') {
        return game.sport_type === sportFilter;
      }
      return true;
    })
    .filter(game => {
      // Search term filtering
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          game.home_team?.school_name?.toLowerCase().includes(search) ||
          game.away_team?.school_name?.toLowerCase().includes(search) ||
          game.location?.toLowerCase().includes(search)
        );
      }
      return true;
    });
  
  // Sort games: live first, then upcoming, then final
  const sortedGames = [...filteredGames].sort((a, b) => {
    // First by status priority (live > upcoming > final)
    const statusPriority = { live: 0, upcoming: 1, final: 2 };
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    
    // Then by time
    if (a.status === 'upcoming') {
      // Upcoming games: soonest first
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    } else {
      // Live and final games: most recent first
      return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Scoreboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search teams or locations"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select onValueChange={(value) => setSportFilter(value as SportType | 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="soccer">Soccer</SelectItem>
              <SelectItem value="volleyball">Volleyball</SelectItem>
              <SelectItem value="baseball">Baseball</SelectItem>
              <SelectItem value="softball">Softball</SelectItem>
              <SelectItem value="hockey">Hockey</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="school">My School</TabsTrigger>
              <TabsTrigger value="district">District</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sortedGames.length > 0 ? (
            sortedGames.map((dbGame) => (
              <GameAdapter 
                key={dbGame.game_id} 
                dbGame={dbGame} 
                currentUserSchoolId={userSchoolId}
              >
                {(game) => <GameCard game={game} />}
              </GameAdapter>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No games found matching your filters.
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Scoreboard;
