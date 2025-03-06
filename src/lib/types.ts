
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
  content: string;
  author: User | null; // null if anonymous
  isAnonymous: boolean;
  schoolName: string;
  likes: number;
  comments: number;
  createdAt: Date;
  images?: string[];
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
