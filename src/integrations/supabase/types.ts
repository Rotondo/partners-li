export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      field_configs: {
        Row: {
          config: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          completed_date: string | null
          created_at: string
          id: string
          next_steps: string | null
          notes: string | null
          opportunities: string | null
          participants: Json | null
          partner_id: string
          scheduled_date: string | null
          status: Database["public"]["Enums"]["activity_status"]
          title: string
          updated_at: string
          user_id: string
          what_discussed: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          completed_date?: string | null
          created_at?: string
          id?: string
          next_steps?: string | null
          notes?: string | null
          opportunities?: string | null
          participants?: Json | null
          partner_id: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["activity_status"]
          title: string
          updated_at?: string
          user_id: string
          what_discussed?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          completed_date?: string | null
          created_at?: string
          id?: string
          next_steps?: string | null
          notes?: string | null
          opportunities?: string | null
          participants?: Json | null
          partner_id?: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["activity_status"]
          title?: string
          updated_at?: string
          user_id?: string
          what_discussed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_activities_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_read: boolean
          is_resolved: boolean
          message: string
          metadata: Json | null
          partner_id: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          message: string
          metadata?: Json | null
          partner_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_read?: boolean
          is_resolved?: boolean
          message?: string
          metadata?: Json | null
          partner_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_alerts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          notes: string | null
          partner_id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          notes?: string | null
          partner_id: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          notes?: string | null
          partner_id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_contacts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_documents: {
        Row: {
          created_at: string
          description: string | null
          document_type: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          partner_id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          partner_id: string
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          partner_id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_documents_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_health_metrics: {
        Row: {
          calculated_at: string
          commercial_score: number | null
          created_at: string
          days_since_last_contact: number | null
          engagement_score: number | null
          health_status: Database["public"]["Enums"]["health_status"]
          id: string
          last_activity_date: string | null
          meetings_this_month: number | null
          open_issues_count: number | null
          overall_score: number | null
          partner_id: string
          performance_score: number | null
          user_id: string
        }
        Insert: {
          calculated_at?: string
          commercial_score?: number | null
          created_at?: string
          days_since_last_contact?: number | null
          engagement_score?: number | null
          health_status: Database["public"]["Enums"]["health_status"]
          id?: string
          last_activity_date?: string | null
          meetings_this_month?: number | null
          open_issues_count?: number | null
          overall_score?: number | null
          partner_id: string
          performance_score?: number | null
          user_id: string
        }
        Update: {
          calculated_at?: string
          commercial_score?: number | null
          created_at?: string
          days_since_last_contact?: number | null
          engagement_score?: number | null
          health_status?: Database["public"]["Enums"]["health_status"]
          id?: string
          last_activity_date?: string | null
          meetings_this_month?: number | null
          open_issues_count?: number | null
          overall_score?: number | null
          partner_id?: string
          performance_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_health_metrics_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: true
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_tasks: {
        Row: {
          activity_id: string | null
          assigned_to: string | null
          completed_date: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          partner_id: string
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          partner_id: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string | null
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          partner_id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_tasks_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "partner_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_tasks_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string
          data: Json
          fit_by_tier: Json | null
          id: string
          name: string
          rebate_config: Json | null
          strategic_priority: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          fit_by_tier?: Json | null
          id?: string
          name: string
          rebate_config?: Json | null
          strategic_priority?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          fit_by_tier?: Json | null
          id?: string
          name?: string
          rebate_config?: Json | null
          strategic_priority?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string
          data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      store_partner_metrics: {
        Row: {
          created_at: string | null
          fit_score: number | null
          id: string
          monthly_gmv: number | null
          partner_id: string
          partner_revenue: number | null
          period_end: string
          period_start: string
          rebate_generated: number | null
          rebate_percentage: number | null
          roi: number | null
          store_id: string
          store_tier: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fit_score?: number | null
          id?: string
          monthly_gmv?: number | null
          partner_id: string
          partner_revenue?: number | null
          period_end: string
          period_start: string
          rebate_generated?: number | null
          rebate_percentage?: number | null
          roi?: number | null
          store_id: string
          store_tier: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fit_score?: number | null
          id?: string
          monthly_gmv?: number | null
          partner_id?: string
          partner_revenue?: number | null
          period_end?: string
          period_start?: string
          rebate_generated?: number | null
          rebate_percentage?: number | null
          roi?: number | null
          store_id?: string
          store_tier?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_partner_metrics_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      activity_status: "scheduled" | "completed" | "cancelled" | "pending"
      activity_type: "meeting" | "call" | "email" | "task" | "note"
      app_role: "admin" | "editor" | "viewer"
      health_status: "excellent" | "good" | "warning" | "critical"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "done" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_status: ["scheduled", "completed", "cancelled", "pending"],
      activity_type: ["meeting", "call", "email", "task", "note"],
      app_role: ["admin", "editor", "viewer"],
      health_status: ["excellent", "good", "warning", "critical"],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["todo", "in_progress", "done", "cancelled"],
    },
  },
} as const
