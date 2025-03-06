
import { Game, Prediction, LeaderboardEntry, SportType } from '@/lib/types';

// Mock game data
export const mockGames: Game[] = [
  {
    id: '1',
    homeTeam: {
      id: 'team1',
      name: 'Central Tigers',
      mascot: 'Tigers',
    },
    awayTeam: {
      id: 'team2',
      name: 'Eastside Eagles',
      mascot: 'Eagles',
    },
    homeScore: 24,
    awayScore: 17,
    status: 'live',
    sportType: 'football',
    startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    location: 'Central High Stadium',
    isHomeSchool: true,
    isAwaySchool: false,
    isDistrict: true,
    period: 3,
    stats: {
      homeShots: 15,
      awayShots: 12,
      homePossession: 58,
      awayPossession: 42,
      homeFouls: 3,
      awayFouls: 5
    },
    attendance: 850,
    weather: 'Clear, 72°F',
  },
  {
    id: '2',
    homeTeam: {
      id: 'team3',
      name: 'Northern Knights',
      mascot: 'Knights',
    },
    awayTeam: {
      id: 'team4',
      name: 'Western Wolves',
      mascot: 'Wolves',
    },
    homeScore: 65,
    awayScore: 72,
    status: 'final',
    sportType: 'basketball',
    startTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    location: 'Northern Arena',
    isHomeSchool: false,
    isAwaySchool: false,
    isDistrict: true,
    stats: {
      homeShots: 55,
      awayShots: 60,
      homePossession: 46,
      awayPossession: 54,
      homeFouls: 12,
      awayFouls: 9
    },
    attendance: 420,
    weather: 'Indoor',
  },
  {
    id: '3',
    homeTeam: {
      id: 'team5',
      name: 'Southern Stars',
      mascot: 'Stars',
    },
    awayTeam: {
      id: 'team1',
      name: 'Central Tigers',
      mascot: 'Tigers',
    },
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    sportType: 'soccer',
    startTime: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    location: 'Southern High Field',
    isHomeSchool: false,
    isAwaySchool: true,
    isDistrict: true,
  },
  {
    id: '4',
    homeTeam: {
      id: 'team6',
      name: 'Riverside Raiders',
      mascot: 'Raiders',
    },
    awayTeam: {
      id: 'team7',
      name: 'Lakeside Lakers',
      mascot: 'Lakers',
    },
    homeScore: 3,
    awayScore: 1,
    status: 'final',
    sportType: 'baseball',
    startTime: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    location: 'Riverside Diamond',
    isHomeSchool: false,
    isAwaySchool: false,
    isDistrict: false,
    stats: {
      homeShots: 8,
      awayShots: 6,
      homeFouls: 1,
      awayFouls: 2
    },
    attendance: 310,
    weather: 'Sunny, 75°F',
  },
  {
    id: '5',
    homeTeam: {
      id: 'team1',
      name: 'Central Tigers',
      mascot: 'Tigers',
    },
    awayTeam: {
      id: 'team8',
      name: 'Mountain Lions',
      mascot: 'Lions',
    },
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    sportType: 'volleyball',
    startTime: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
    location: 'Central High Gymnasium',
    isHomeSchool: true,
    isAwaySchool: false,
    isDistrict: true,
  }
];

// Mock upcoming games for predictions
export const mockUpcomingGames: Game[] = [
  // Soccer game tomorrow
  {
    id: '3',
    homeTeam: {
      id: 'team5',
      name: 'Southern Stars',
      mascot: 'Stars',
    },
    awayTeam: {
      id: 'team1',
      name: 'Central Tigers',
      mascot: 'Tigers',
    },
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    sportType: 'soccer',
    startTime: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    location: 'Southern High Field',
    isHomeSchool: false,
    isAwaySchool: true,
    isDistrict: true,
  },
  // Volleyball game today
  {
    id: '5',
    homeTeam: {
      id: 'team1',
      name: 'Central Tigers',
      mascot: 'Tigers',
    },
    awayTeam: {
      id: 'team8',
      name: 'Mountain Lions',
      mascot: 'Lions',
    },
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    sportType: 'volleyball',
    startTime: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
    location: 'Central High Gymnasium',
    isHomeSchool: true,
    isAwaySchool: false,
    isDistrict: true,
  },
  // Basketball game this weekend
  {
    id: '6',
    homeTeam: {
      id: 'team2',
      name: 'Eastside Eagles',
      mascot: 'Eagles',
    },
    awayTeam: {
      id: 'team1',
      name: 'Central Tigers',
      mascot: 'Tigers',
    },
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    sportType: 'basketball',
    startTime: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    location: 'Eastside Arena',
    isHomeSchool: false,
    isAwaySchool: true,
    isDistrict: true,
  }
];

// Mock past predictions
export const mockPastPredictions: Prediction[] = [
  {
    gameId: '10',
    userId: '1',
    homeTeam: {
      id: 'team1',
      name: 'Central Tigers',
      mascot: 'Tigers',
    },
    awayTeam: {
      id: 'team2',
      name: 'Eastside Eagles',
      mascot: 'Eagles',
    },
    selectedTeam: 'team1', // Picked Central Tigers
    predictedHomeScore: 28,
    predictedAwayScore: 21,
    actualHomeScore: 28,
    actualAwayScore: 14,
    actualWinner: 'team1',
    points: 30, // 10 for winner + 20 for exact home score
    gameDate: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
  },
  {
    gameId: '11',
    userId: '1',
    homeTeam: {
      id: 'team3',
      name: 'Northern Knights',
      mascot: 'Knights',
    },
    awayTeam: {
      id: 'team4',
      name: 'Western Wolves',
      mascot: 'Wolves',
    },
    selectedTeam: 'team3', // Picked Northern Knights
    predictedHomeScore: 70,
    predictedAwayScore: 65,
    actualHomeScore: 65,
    actualAwayScore: 72,
    actualWinner: 'team4',
    points: 0, // Wrong prediction
    gameDate: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
  },
  {
    gameId: '12',
    userId: '1',
    homeTeam: {
      id: 'team6',
      name: 'Riverside Raiders',
      mascot: 'Raiders',
    },
    awayTeam: {
      id: 'team7',
      name: 'Lakeside Lakers',
      mascot: 'Lakers',
    },
    selectedTeam: 'team6', // Picked Riverside Raiders
    predictedHomeScore: 3,
    predictedAwayScore: 2,
    actualHomeScore: 3,
    actualAwayScore: 1,
    actualWinner: 'team6',
    points: 30, // 10 for winner + 20 for exact home score
    gameDate: new Date(Date.now() - 1814400000).toISOString(), // 3 weeks ago
  }
];

// Mock leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: '2',
    username: 'basketball_fan22',
    avatar: 'https://source.unsplash.com/random/300x300?portrait=3',
    school: 'Central High',
    points: 280,
    correctPredictions: 18,
    totalPredictions: 22
  },
  {
    userId: '3',
    username: 'sports_guru',
    avatar: 'https://source.unsplash.com/random/300x300?portrait=4',
    school: 'Central High',
    points: 240,
    correctPredictions: 16,
    totalPredictions: 20
  },
  {
    userId: '1',
    username: 'sarah_j',
    avatar: 'https://source.unsplash.com/random/300x300?portrait=1',
    school: 'Eastside High',
    points: 150,
    correctPredictions: 10,
    totalPredictions: 15
  },
  {
    userId: '4',
    username: 'tigerfan2024',
    school: 'Central High',
    points: 130,
    correctPredictions: 9,
    totalPredictions: 14
  },
  {
    userId: '5',
    username: 'gameday_expert',
    avatar: 'https://source.unsplash.com/random/300x300?portrait=5',
    school: 'Central High',
    points: 120,
    correctPredictions: 8,
    totalPredictions: 12
  }
];
