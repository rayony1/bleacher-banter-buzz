export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      badges: {
        Row: {
          badge_id: string
          badge_name: string
          school_id: string | null
          type: string
        }
        Insert: {
          badge_id?: string
          badge_name: string
          school_id?: string | null
          type: string
        }
        Update: {
          badge_id?: string
          badge_name?: string
          school_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "badges_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["school_id"]
          },
        ]
      }
      comments: {
        Row: {
          comment_id: string
          content: string
          post_id: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          comment_id?: string
          content: string
          post_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          comment_id?: string
          content?: string
          post_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      games: {
        Row: {
          attendance: number | null
          away_score: number | null
          away_team_id: string | null
          game_id: string
          home_score: number | null
          home_team_id: string | null
          location: string | null
          period: number | null
          sport_type: string
          start_time: string
          status: string
        }
        Insert: {
          attendance?: number | null
          away_score?: number | null
          away_team_id?: string | null
          game_id?: string
          home_score?: number | null
          home_team_id?: string | null
          location?: string | null
          period?: number | null
          sport_type: string
          start_time: string
          status: string
        }
        Update: {
          attendance?: number | null
          away_score?: number | null
          away_team_id?: string | null
          game_id?: string
          home_score?: number | null
          home_team_id?: string | null
          location?: string | null
          period?: number | null
          sport_type?: string
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "games_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["school_id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number
          content: string
          images: string[] | null
          is_anonymous: boolean
          likes_count: number
          post_id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          comments_count?: number
          content: string
          images?: string[] | null
          is_anonymous?: boolean
          likes_count?: number
          post_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          comments_count?: number
          content?: string
          images?: string[] | null
          is_anonymous?: boolean
          likes_count?: number
          post_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      predictions: {
        Row: {
          actual_winner: string | null
          created_at: string
          game_id: string | null
          points: number | null
          predicted_away_score: number | null
          predicted_home_score: number | null
          prediction_id: string
          selected_team: string
          user_id: string | null
        }
        Insert: {
          actual_winner?: string | null
          created_at?: string
          game_id?: string | null
          points?: number | null
          predicted_away_score?: number | null
          predicted_home_score?: number | null
          prediction_id?: string
          selected_team: string
          user_id?: string | null
        }
        Update: {
          actual_winner?: string | null
          created_at?: string
          game_id?: string | null
          points?: number | null
          predicted_away_score?: number | null
          predicted_home_score?: number | null
          prediction_id?: string
          selected_team?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "predictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          school_id: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          school_id: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          school_id?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["school_id"]
          },
        ]
      }
      schools: {
        Row: {
          colors: Json | null
          district: string
          mascot: string | null
          school_id: string
          school_name: string
          state: string
        }
        Insert: {
          colors?: Json | null
          district: string
          mascot?: string | null
          school_id?: string
          school_name: string
          state: string
        }
        Update: {
          colors?: Json | null
          district?: string
          mascot?: string | null
          school_id?: string
          school_name?: string
          state?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          user_id: string
        }
        Update: {
          badge_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["badge_id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_feed_posts: {
        Args: {
          feed_type: string
          user_uuid: string
        }
        Returns: {
          post_id: string
          user_id: string
          content: string
          is_anonymous: boolean
          post_timestamp: string
          likes_count: number
          comments_count: number
          images: string[]
          username: string
          school_id: string
          school_name: string
          district: string
          state: string
        }[]
      }
      get_user_school_id: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
