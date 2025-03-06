
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          school_id: string;
          school_name: string;
          district: string;
          state: string;
          mascot: string | null;
          colors: Json | null;
        };
        Insert: {
          school_id?: string;
          school_name: string;
          district: string;
          state: string;
          mascot?: string | null;
          colors?: Json | null;
        };
        Update: {
          school_id?: string;
          school_name?: string;
          district?: string;
          state?: string;
          mascot?: string | null;
          colors?: Json | null;
        };
      };
      badges: {
        Row: {
          badge_id: string;
          badge_name: string;
          school_id: string | null;
          type: 'student' | 'athlete' | 'admin';
        };
        Insert: {
          badge_id?: string;
          badge_name: string;
          school_id?: string | null;
          type: 'student' | 'athlete' | 'admin';
        };
        Update: {
          badge_id?: string;
          badge_name?: string;
          school_id?: string | null;
          type?: 'student' | 'athlete' | 'admin';
        };
      };
      profiles: {
        Row: {
          user_id: string;
          username: string;
          school_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          username: string;
          school_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          username?: string;
          school_id?: string;
          created_at?: string;
        };
      };
      user_badges: {
        Row: {
          user_id: string;
          badge_id: string;
        };
        Insert: {
          user_id: string;
          badge_id: string;
        };
        Update: {
          user_id?: string;
          badge_id?: string;
        };
      };
      posts: {
        Row: {
          post_id: string;
          user_id: string;
          content: string;
          is_anonymous: boolean;
          timestamp: string;
          likes_count: number;
          comments_count: number;
          images: string[] | null;
        };
        Insert: {
          post_id?: string;
          user_id: string;
          content: string;
          is_anonymous?: boolean;
          timestamp?: string;
          likes_count?: number;
          comments_count?: number;
          images?: string[] | null;
        };
        Update: {
          post_id?: string;
          user_id?: string;
          content?: string;
          is_anonymous?: boolean;
          timestamp?: string;
          likes_count?: number;
          comments_count?: number;
          images?: string[] | null;
        };
      };
      comments: {
        Row: {
          comment_id: string;
          post_id: string;
          user_id: string;
          content: string;
          timestamp: string;
        };
        Insert: {
          comment_id?: string;
          post_id: string;
          user_id: string;
          content: string;
          timestamp?: string;
        };
        Update: {
          comment_id?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
          timestamp?: string;
        };
      };
      games: {
        Row: {
          game_id: string;
          home_team_id: string | null;
          away_team_id: string | null;
          home_score: number;
          away_score: number;
          status: 'upcoming' | 'live' | 'final';
          sport_type: 'football' | 'basketball' | 'soccer' | 'volleyball' | 'baseball' | 'softball' | 'hockey' | 'other';
          start_time: string;
          location: string | null;
          period: number | null;
          attendance: number | null;
        };
        Insert: {
          game_id?: string;
          home_team_id?: string | null;
          away_team_id?: string | null;
          home_score?: number;
          away_score?: number;
          status: 'upcoming' | 'live' | 'final';
          sport_type: 'football' | 'basketball' | 'soccer' | 'volleyball' | 'baseball' | 'softball' | 'hockey' | 'other';
          start_time: string;
          location?: string | null;
          period?: number | null;
          attendance?: number | null;
        };
        Update: {
          game_id?: string;
          home_team_id?: string | null;
          away_team_id?: string | null;
          home_score?: number;
          away_score?: number;
          status?: 'upcoming' | 'live' | 'final';
          sport_type?: 'football' | 'basketball' | 'soccer' | 'volleyball' | 'baseball' | 'softball' | 'hockey' | 'other';
          start_time?: string;
          location?: string | null;
          period?: number | null;
          attendance?: number | null;
        };
      };
      predictions: {
        Row: {
          prediction_id: string;
          game_id: string;
          user_id: string;
          selected_team: 'home' | 'away';
          predicted_home_score: number | null;
          predicted_away_score: number | null;
          actual_winner: string | null;
          points: number;
          created_at: string;
        };
        Insert: {
          prediction_id?: string;
          game_id: string;
          user_id: string;
          selected_team: 'home' | 'away';
          predicted_home_score?: number | null;
          predicted_away_score?: number | null;
          actual_winner?: string | null;
          points?: number;
          created_at?: string;
        };
        Update: {
          prediction_id?: string;
          game_id?: string;
          user_id?: string;
          selected_team?: 'home' | 'away';
          predicted_home_score?: number | null;
          predicted_away_score?: number | null;
          actual_winner?: string | null;
          points?: number;
          created_at?: string;
        };
      };
    };
  };
}
