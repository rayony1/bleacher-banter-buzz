
import { useQuery } from '@tanstack/react-query';
import { getGames } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Game, Prediction } from '@/lib/types';

// Sample games data for demo
const SAMPLE_GAMES: Game[] = [
  {
    id: "game1",
    homeTeam: { id: "team1", name: "Westview High", mascot: "Wolverines" },
    awayTeam: { id: "team2", name: "Del Norte High", mascot: "Nighthawks" },
    homeScore: 28,
    awayScore: 14,
    status: "final",
    sportType: "football",
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Westview Stadium",
    period: 4,
    attendance: 1200,
    isHomeSchool: true,
    isAwaySchool: false,
    isDistrict: true,
    stats: {
      homeShots: 15,
      awayShots: 8,
      homePossession: 65,
      awayPossession: 35,
      homeFouls: 3,
      awayFouls: 5,
    },
    weather: "Clear, 68°F",
  },
  {
    id: "game2",
    homeTeam: { id: "team3", name: "Rancho Bernardo High", mascot: "Broncos" },
    awayTeam: { id: "team1", name: "Westview High", mascot: "Wolverines" },
    homeScore: 2,
    awayScore: 1,
    status: "live",
    sportType: "soccer",
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    location: "Rancho Bernardo Field",
    period: 2,
    attendance: 450,
    isHomeSchool: false,
    isAwaySchool: true,
    isDistrict: true,
    stats: {
      homeShots: 5,
      awayShots: 8,
      homePossession: 42,
      awayPossession: 58,
      homeFouls: 3,
      awayFouls: 1,
    },
    weather: "Partly Cloudy, 72°F",
  },
  {
    id: "game3",
    homeTeam: { id: "team1", name: "Westview High", mascot: "Wolverines" },
    awayTeam: { id: "team4", name: "Mt. Carmel High", mascot: "Sundevils" },
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    sportType: "basketball",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Westview Arena",
    period: null,
    attendance: null,
    isHomeSchool: true,
    isAwaySchool: false,
    isDistrict: true,
    stats: null,
    weather: "Indoor",
  },
  {
    id: "game4",
    homeTeam: { id: "team5", name: "Poway High", mascot: "Titans" },
    awayTeam: { id: "team1", name: "Westview High", mascot: "Wolverines" },
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    sportType: "volleyball",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Poway Gymnasium",
    period: null,
    attendance: null,
    isHomeSchool: false,
    isAwaySchool: true,
    isDistrict: true,
    stats: null,
    weather: "Indoor",
  }
];

// Sample predictions for demo
const SAMPLE_PREDICTIONS: Prediction[] = [
  {
    id: "prediction1",
    gameId: "game1",
    userId: "demo-user-id",
    homeTeam: { id: "team1", name: "Westview High" },
    awayTeam: { id: "team2", name: "Del Norte High" },
    selectedTeam: "home",
    predictedHomeScore: 21,
    predictedAwayScore: 14,
    actualHomeScore: 28,
    actualAwayScore: 14,
    actualWinner: "home",
    points: 15,
    gameDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "prediction2",
    gameId: "game2",
    userId: "demo-user-id",
    homeTeam: { id: "team3", name: "Rancho Bernardo High" },
    awayTeam: { id: "team1", name: "Westview High" },
    selectedTeam: "away",
    predictedHomeScore: 1,
    predictedAwayScore: 3,
    actualHomeScore: 2,
    actualAwayScore: 1,
    actualWinner: "home",
    points: 0,
    gameDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const useGames = () => {
  const { user } = useAuth();

  // In demo mode, we're just returning the sample data directly
  return {
    games: SAMPLE_GAMES,
    predictions: SAMPLE_PREDICTIONS,
    isLoading: false,
    error: null,
    userSchoolId: "team1"
  };
};
