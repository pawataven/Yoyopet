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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_role_changes: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: number
          new_is_active: boolean | null
          new_role: string | null
          old_is_active: boolean | null
          old_role: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: never
          new_is_active?: boolean | null
          new_role?: string | null
          old_is_active?: boolean | null
          old_role?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: never
          new_is_active?: boolean | null
          new_role?: string | null
          old_is_active?: boolean | null
          old_role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          display_name: string | null
          email: string
          is_active: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_name?: string | null
          email: string
          is_active?: boolean
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_name?: string | null
          email?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      import_column_aliases: {
        Row: {
          alias: string
          created_at: string
          field: string
          id: number
          platform: string
        }
        Insert: {
          alias: string
          created_at?: string
          field: string
          id?: never
          platform: string
        }
        Update: {
          alias?: string
          created_at?: string
          field?: string
          id?: never
          platform?: string
        }
        Relationships: []
      }
      import_status_aliases: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          platform: string
          raw_status: string
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: never
          platform: string
          raw_status: string
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: never
          platform?: string
          raw_status?: string
          status?: string
        }
        Relationships: []
      }
      member_orders: {
        Row: {
          approved_amount_baht: number | null
          claimed_amount_baht: number | null
          decided_by_system: boolean
          id: string
          member_id: string
          order_no: string
          platform: string
          points_available_at: string | null
          points_awarded: number | null
          points_multiplier: number | null
          proof_image_path: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          approved_amount_baht?: number | null
          claimed_amount_baht?: number | null
          decided_by_system?: boolean
          id?: string
          member_id?: string
          order_no: string
          platform: string
          points_available_at?: string | null
          points_awarded?: number | null
          points_multiplier?: number | null
          proof_image_path?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          approved_amount_baht?: number | null
          claimed_amount_baht?: number | null
          decided_by_system?: boolean
          id?: string
          member_id?: string
          order_no?: string
          platform?: string
          points_available_at?: string | null
          points_awarded?: number | null
          points_multiplier?: number | null
          proof_image_path?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_orders_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          birth_date_change_available_at: string | null
          created_at: string
          email: string | null
          first_name: string
          gender: string | null
          id: string
          is_line_official_account_friend: boolean
          last_name: string
          line_display_name: string | null
          line_linked_at: string | null
          line_picture_url: string | null
          member_code: string
          onboarding_completed_at: string | null
          pet_ownership: string | null
          phone: string | null
          phone_verified_at: string | null
          tier_code: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          birth_date_change_available_at?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          gender?: string | null
          id: string
          is_line_official_account_friend?: boolean
          last_name?: string
          line_display_name?: string | null
          line_linked_at?: string | null
          line_picture_url?: string | null
          member_code?: string
          onboarding_completed_at?: string | null
          pet_ownership?: string | null
          phone?: string | null
          phone_verified_at?: string | null
          tier_code?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          birth_date_change_available_at?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          is_line_official_account_friend?: boolean
          last_name?: string
          line_display_name?: string | null
          line_linked_at?: string | null
          line_picture_url?: string | null
          member_code?: string
          onboarding_completed_at?: string | null
          pet_ownership?: string | null
          phone?: string | null
          phone_verified_at?: string | null
          tier_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_tier_code_fkey"
            columns: ["tier_code"]
            isOneToOne: false
            referencedRelation: "tiers"
            referencedColumns: ["code"]
          },
        ]
      }
      order_imports: {
        Row: {
          completed_at: string | null
          file_hash: string
          file_name: string
          id: string
          imported_at: string
          imported_by: string
          platform: string
          status: string
          summary: Json
        }
        Insert: {
          completed_at?: string | null
          file_hash: string
          file_name: string
          id?: string
          imported_at?: string
          imported_by?: string
          platform: string
          status?: string
          summary?: Json
        }
        Update: {
          completed_at?: string | null
          file_hash?: string
          file_name?: string
          id?: string
          imported_at?: string
          imported_by?: string
          platform?: string
          status?: string
          summary?: Json
        }
        Relationships: []
      }
      order_point_events: {
        Row: {
          available_at: string | null
          created_at: string
          created_by: string | null
          id: number
          import_id: string | null
          kind: string
          member_order_id: string
          points_after: number | null
          points_before: number | null
        }
        Insert: {
          available_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: never
          import_id?: string | null
          kind: string
          member_order_id: string
          points_after?: number | null
          points_before?: number | null
        }
        Update: {
          available_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: never
          import_id?: string | null
          kind?: string
          member_order_id?: string
          points_after?: number | null
          points_before?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_point_events_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "order_imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_point_events_member_order_id_fkey"
            columns: ["member_order_id"]
            isOneToOne: false
            referencedRelation: "member_order_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_point_events_member_order_id_fkey"
            columns: ["member_order_id"]
            isOneToOne: false
            referencedRelation: "member_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_order_items: {
        Row: {
          id: number
          platform_order_id: string
          product_name: string
          quantity: number
          sku: string | null
          status: string | null
          total_baht: number
        }
        Insert: {
          id?: never
          platform_order_id: string
          product_name: string
          quantity: number
          sku?: string | null
          status?: string | null
          total_baht: number
        }
        Update: {
          id?: never
          platform_order_id?: string
          product_name?: string
          quantity?: number
          sku?: string | null
          status?: string | null
          total_baht?: number
        }
        Relationships: [
          {
            foreignKeyName: "platform_order_items_platform_order_id_fkey"
            columns: ["platform_order_id"]
            isOneToOne: false
            referencedRelation: "member_order_reviews"
            referencedColumns: ["platform_order_id"]
          },
          {
            foreignKeyName: "platform_order_items_platform_order_id_fkey"
            columns: ["platform_order_id"]
            isOneToOne: false
            referencedRelation: "platform_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_orders: {
        Row: {
          amount_baht: number | null
          delivered_at: string | null
          id: string
          last_import_id: string
          order_no: string
          ordered_at: string | null
          platform: string
          raw_status: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_baht?: number | null
          delivered_at?: string | null
          id?: string
          last_import_id: string
          order_no: string
          ordered_at?: string | null
          platform: string
          raw_status: string
          status: string
          updated_at?: string
        }
        Update: {
          amount_baht?: number | null
          delivered_at?: string | null
          id?: string
          last_import_id?: string
          order_no?: string
          ordered_at?: string | null
          platform?: string
          raw_status?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_orders_last_import_id_fkey"
            columns: ["last_import_id"]
            isOneToOne: false
            referencedRelation: "order_imports"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          platform: string
          return_window_days: number
          updated_at: string
        }
        Insert: {
          platform: string
          return_window_days: number
          updated_at?: string
        }
        Update: {
          platform?: string
          return_window_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      point_ledger: {
        Row: {
          available_at: string | null
          cancelled_at: string | null
          created_at: string
          created_by: string | null
          id: number
          kind: string
          member_id: string
          member_order_id: string | null
          points: number
        }
        Insert: {
          available_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: never
          kind: string
          member_id: string
          member_order_id?: string | null
          points: number
        }
        Update: {
          available_at?: string | null
          cancelled_at?: string | null
          created_at?: string
          created_by?: string | null
          id?: never
          kind?: string
          member_id?: string
          member_order_id?: string | null
          points?: number
        }
        Relationships: [
          {
            foreignKeyName: "point_ledger_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_ledger_member_order_id_fkey"
            columns: ["member_order_id"]
            isOneToOne: false
            referencedRelation: "member_order_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_ledger_member_order_id_fkey"
            columns: ["member_order_id"]
            isOneToOne: false
            referencedRelation: "member_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      tiers: {
        Row: {
          code: string
          min_points: number
          name: string
          points_multiplier: number
          sort_order: number
        }
        Insert: {
          code: string
          min_points: number
          name: string
          points_multiplier: number
          sort_order: number
        }
        Update: {
          code?: string
          min_points?: number
          name?: string
          points_multiplier?: number
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      member_order_reviews: {
        Row: {
          amount_baht: number | null
          approved_amount_baht: number | null
          claimed_amount_baht: number | null
          decided_by_system: boolean | null
          duplicate_of_member_code: string | null
          file_amount_baht: number | null
          file_delivered_at: string | null
          file_imported_at: string | null
          file_status: string | null
          id: string | null
          is_waiting_for_file: boolean | null
          match_result: string | null
          member_code: string | null
          member_id: string | null
          member_name: string | null
          member_phone: string | null
          order_no: string | null
          platform: string | null
          platform_order_id: string | null
          points: number | null
          points_available_at: string | null
          points_awarded: number | null
          proof_image_path: string | null
          rejection_reason: string | null
          return_window_ends_at: string | null
          review_status: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_name: string | null
          stored_status: string | null
          submitted_at: string | null
          tier_name: string | null
          tier_points_multiplier: number | null
        }
        Relationships: [
          {
            foreignKeyName: "member_orders_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      approve_member_orders: {
        Args: {
          amount_override_baht?: number
          credit_mode?: string
          order_ids: string[]
        }
        Returns: Json
      }
      calculate_order_points: {
        Args: { amount_baht: number; points_multiplier: number }
        Returns: number
      }
      finish_order_import: { Args: { finish_import_id: string }; Returns: Json }
      import_order_chunk: {
        Args: { chunk_import_id: string; chunk_orders: Json }
        Returns: Json
      }
      order_return_window: { Args: { for_platform: string }; Returns: string }
      reject_member_orders: {
        Args: { order_ids: string[]; reason: string }
        Returns: Json
      }
      revoke_member_order_approval: {
        Args: { reason: string; revoke_order_id: string }
        Returns: undefined
      }
      start_order_import: {
        Args: {
          import_file_hash: string
          import_file_name: string
          import_platform: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
