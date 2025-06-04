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
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          mood: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          mood?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          mood?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_records: {
        Row: {
          id: string
          mood: string
          notes: string | null
          recorded_at: string
          stress_level: number | null
          user_id: string
          voice_analysis_data: Json | null
        }
        Insert: {
          id?: string
          mood: string
          notes?: string | null
          recorded_at?: string
          stress_level?: number | null
          user_id: string
          voice_analysis_data?: Json | null
        }
        Update: {
          id?: string
          mood?: string
          notes?: string | null
          recorded_at?: string
          stress_level?: number | null
          user_id?: string
          voice_analysis_data?: Json | null
        }
        Relationships: []
      }
      sleep_casts: {
        Row: {
          audio_url: string
          category: string | null
          created_at: string
          description: string | null
          duration: number
          id: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          audio_url: string
          category?: string | null
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          audio_url?: string
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      sleep_nudges: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          priority: number | null
          target_age_max: number | null
          target_age_min: number | null
          target_occupation: string[] | null
          target_sleep_issues: string[] | null
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          priority?: number | null
          target_age_max?: number | null
          target_age_min?: number | null
          target_occupation?: string[] | null
          target_sleep_issues?: string[] | null
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          priority?: number | null
          target_age_max?: number | null
          target_age_min?: number | null
          target_occupation?: string[] | null
          target_sleep_issues?: string[] | null
          title?: string
        }
        Relationships: []
      }
      sleep_records: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          sleep_date: string
          sleep_duration: number
          sleep_quality: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          sleep_date?: string
          sleep_duration: number
          sleep_quality: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          sleep_date?: string
          sleep_duration?: number
          sleep_quality?: string
          user_id?: string
        }
        Relationships: []
      }
      sleep_tracking: {
        Row: {
          id: string
          user_id: string
          sleep_date: string
          sleep_hours: number | null
          sleep_quality: number | null
          bedtime: string | null
          wake_time: string | null
          notes: string | null
          mood_before_sleep: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          sleep_date?: string
          sleep_hours?: number | null
          sleep_quality?: number | null
          bedtime?: string | null
          wake_time?: string | null
          notes?: string | null
          mood_before_sleep?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          sleep_date?: string
          sleep_hours?: number | null
          sleep_quality?: number | null
          bedtime?: string | null
          wake_time?: string | null
          notes?: string | null
          mood_before_sleep?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bedtime_target: string | null
          created_at: string
          daily_points: number | null
          first_name: string | null
          id: string
          last_activity_date: string | null
          last_name: string | null
          occupation: string | null
          onboarding_completed: boolean | null
          relaxation_points: number | null
          settings: Json | null
          sleep_goals: string[] | null
          sleep_issues: string[] | null
          streak_days: number | null
          updated_at: string
          username: string | null
          waketime_target: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bedtime_target?: string | null
          created_at?: string
          daily_points?: number | null
          first_name?: string | null
          id: string
          last_activity_date?: string | null
          last_name?: string | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          relaxation_points?: number | null
          settings?: Json | null
          sleep_goals?: string[] | null
          sleep_issues?: string[] | null
          streak_days?: number | null
          updated_at?: string
          username?: string | null
          waketime_target?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bedtime_target?: string | null
          created_at?: string
          daily_points?: number | null
          first_name?: string | null
          id?: string
          last_activity_date?: string | null
          last_name?: string | null
          occupation?: string | null
          onboarding_completed?: boolean | null
          relaxation_points?: number | null
          settings?: Json | null
          sleep_goals?: string[] | null
          sleep_issues?: string[] | null
          streak_days?: number | null
          updated_at?: string
          username?: string | null
          waketime_target?: string | null
        }
        Relationships: []
      }
      user_sleepcast_history: {
        Row: {
          completed: boolean | null
          id: string
          played_at: string
          progress_seconds: number | null
          sleepcast_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          id?: string
          played_at?: string
          progress_seconds?: number | null
          sleepcast_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          id?: string
          played_at?: string
          progress_seconds?: number | null
          sleepcast_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sleepcast_history_sleepcast_id_fkey"
            columns: ["sleepcast_id"]
            isOneToOne: false
            referencedRelation: "sleep_casts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
