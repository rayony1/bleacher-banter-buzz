
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
import { useMobile } from '@/hooks/use-mobile';

const Scoreboard = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'school' | 'district' | 'live'>('all');
  const [sportFilter, setSportFilter] = useState<SportType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { isMobile } = useMobile();
  
  const { games, isLoading, userSchoolId } = useGames();
  
  const filteredGames = games
    .filter(game => {
      if (activeTab === 'school') {
        return game.homeTeam.id === userSchoolId || game.awayTeam.id === userSchoolId;
      }
      if (activeTab === 'live') {
        return game.status === 'live';
      }
      return true;
    })
    .filter(game => {
      if (sportFilter !== 'all') {
        return game.sportType === sportFilter;
      }
      return true;
    })
    .filter(game => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          game.homeTeam?.name?.toLowerCase().includes(search) ||
          game.awayTeam?.name?.toLowerCase().includes(search) ||
          game.location?.toLowerCase().includes(search)
        );
      }
      return true;
    });

  const sortedGames = [...filteredGames].sort((a, b) => {
    const statusPriority = { live: 0, upcoming: 1, final: 2 };
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }
    
    if (a.status === 'upcoming') {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    } else {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'}`}>
        <div className="container mx-auto px-4 py-6">
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
              sortedGames.map((game) => (
                <GameAdapter 
                  key={game.id} 
                  dbGame={game} 
                  currentUserSchoolId={userSchoolId}
                >
                  {(adaptedGame) => <GameCard game={adaptedGame} />}
                </GameAdapter>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No games found matching your filters.
              </div>
            )}
          </div>
        </div>
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default Scoreboard;
