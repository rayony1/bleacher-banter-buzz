export type User = {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  school: string;
  badges: Badge[];
  points: number;
  isAthlete: boolean;
  createdAt: Date;
};

export type Badge = {
  id: string;
  name: string;
  type: 'school' | 'team' | 'achievement';
  icon?: string;
};

export type Post = {
  id: string;
  author: {
    id: string;
    username: string;
    schoolId?: string;
    isAthlete?: boolean;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  isAnonymous?: boolean;
  likeCount: number;
  commentCount: number;
  images?: string[];
  liked?: boolean;
  school?: string;
  hashtags?: string[];
};

export type PostCardProps = {
  post: Post;
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  disableInteractions?: boolean;
};

export type PredictionCardProps = {
  game: Game;
  disableInteractions?: boolean;
};

export type School = {
  id: string;
  name: string;
  mascot: string;
  district: string;
  state: string;
  colors: {
    primary: string;
    secondary: string;
  };
};

export type Team = {
  id: string;
  name: string;
  sport: string;
  schoolId: string;
  season: 'fall' | 'winter' | 'spring';
};

export type FeedType = 'school' | 'district' | 'state';

export type AuthFormType = 'login' | 'register';

export type GameTeam = {
  id: string;
  name: string;
  logo?: string;
  mascot?: string;
  abbreviation?: string;
};

export type GameStatus = 'upcoming' | 'live' | 'final';

export type SportType = 'football' | 'basketball' | 'soccer' | 'volleyball' | 'baseball' | 'softball' | 'hockey' | 'other';

export type GameStats = {
  homeShots?: number;
  awayShots?: number;
  homePossession?: number;
  awayPossession?: number;
  homeFouls?: number;
  awayFouls?: number;
};

export type Game = {
  id: string;
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  homeScore: number;
  awayScore: number;
  status: GameStatus;
  sportType: SportType;
  startTime: string; // ISO Date string
  location: string;
  isHomeSchool: boolean;
  isAwaySchool: boolean;
  isDistrict: boolean;
  period?: number;
  stats?: GameStats;
  attendance?: number;
  weather?: string;
};

export type TeamPrediction = 'home' | 'away';

export type Prediction = {
  gameId: string;
  userId: string;
  homeTeam: GameTeam;
  awayTeam: GameTeam;
  selectedTeam: string;
  predictedHomeScore: number | null;
  predictedAwayScore: number | null;
  actualHomeScore: number;
  actualAwayScore: number;
  actualWinner: string;
  points: number;
  gameDate: string; // ISO Date string
};

export type LeaderboardEntry = {
  userId: string;
  username: string;
  avatar?: string;
  school: string;
  points: number;
  correctPredictions: number;
  totalPredictions: number;
};
