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
      audit_logs: {
        Row: {
          compressed: boolean | null
          id: string
          new_values: Json | null
          old_values: Json | null
          operation: Database["public"]["Enums"]["audit_operation"]
          record_id: string | null
          severity: Database["public"]["Enums"]["severity_level"] | null
          table_name: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          compressed?: boolean | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation: Database["public"]["Enums"]["audit_operation"]
          record_id?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          table_name: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          compressed?: boolean | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          operation?: Database["public"]["Enums"]["audit_operation"]
          record_id?: string | null
          severity?: Database["public"]["Enums"]["severity_level"] | null
          table_name?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backup_history: {
        Row: {
          backup_file_name: string | null
          collectors_count: number | null
          error_message: string | null
          id: string
          members_count: number | null
          operation_type: Database["public"]["Enums"]["backup_operation_type"]
          performed_at: string | null
          performed_by: string | null
          policies_count: number | null
          roles_count: number | null
          status: string | null
        }
        Insert: {
          backup_file_name?: string | null
          collectors_count?: number | null
          error_message?: string | null
          id?: string
          members_count?: number | null
          operation_type: Database["public"]["Enums"]["backup_operation_type"]
          performed_at?: string | null
          performed_by?: string | null
          policies_count?: number | null
          roles_count?: number | null
          status?: string | null
        }
        Update: {
          backup_file_name?: string | null
          collectors_count?: number | null
          error_message?: string | null
          id?: string
          members_count?: number | null
          operation_type?: Database["public"]["Enums"]["backup_operation_type"]
          performed_at?: string | null
          performed_by?: string | null
          policies_count?: number | null
          roles_count?: number | null
          status?: string | null
        }
        Relationships: []
      }
      documentation: {
        Row: {
          created_at: string
          created_by: string | null
          file_path: string
          id: string
          is_current: boolean | null
          metadata: Json | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_path: string
          id?: string
          is_current?: boolean | null
          metadata?: Json | null
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_path?: string
          id?: string
          is_current?: boolean | null
          metadata?: Json | null
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      enhanced_roles: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_updated_at: string | null
          role_name: string
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_updated_at?: string | null
          role_name: string
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_updated_at?: string | null
          role_name?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          created_at: string
          date_of_birth: string | null
          family_member_number: string
          full_name: string
          gender: string | null
          id: string
          member_id: string
          relationship: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          family_member_number: string
          full_name: string
          gender?: string | null
          id?: string
          member_id: string
          relationship: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          family_member_number?: string
          full_name?: string
          gender?: string | null
          id?: string
          member_id?: string
          relationship?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      git_repositories: {
        Row: {
          branch: string
          created_at: string | null
          created_by: string | null
          custom_url: string | null
          id: string
          is_master: boolean
          last_sync_at: string | null
          name: string
          source_url: string
          status: string | null
          target_url: string | null
        }
        Insert: {
          branch?: string
          created_at?: string | null
          created_by?: string | null
          custom_url?: string | null
          id?: string
          is_master?: boolean
          last_sync_at?: string | null
          name: string
          source_url: string
          status?: string | null
          target_url?: string | null
        }
        Update: {
          branch?: string
          created_at?: string | null
          created_by?: string | null
          custom_url?: string | null
          id?: string
          is_master?: boolean
          last_sync_at?: string | null
          name?: string
          source_url?: string
          status?: string | null
          target_url?: string | null
        }
        Relationships: []
      }
      git_sync_logs: {
        Row: {
          created_at: string | null
          created_by: string | null
          error_details: string | null
          id: string
          message: string | null
          operation_type: string
          repository_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          error_details?: string | null
          id?: string
          message?: string | null
          operation_type: string
          repository_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          error_details?: string | null
          id?: string
          message?: string | null
          operation_type?: string
          repository_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "git_sync_logs_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "git_repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address: string | null
          admin_note: string | null
          auth_user_id: string | null
          collector: string | null
          collector_id: string | null
          cors_enabled: boolean | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          email: string | null
          emergency_collection_amount: number | null
          emergency_collection_created_at: string | null
          emergency_collection_due_date: string | null
          emergency_collection_status: string | null
          family_member_dob: string | null
          family_member_gender: string | null
          family_member_name: string | null
          family_member_relationship: string | null
          full_name: string
          gender: string | null
          id: string
          marital_status: string | null
          member_number: string
          membership_type: string | null
          payment_amount: number | null
          payment_date: string | null
          payment_notes: string | null
          payment_type: string | null
          phone: string | null
          postcode: string | null
          status: string | null
          ticket_description: string | null
          ticket_priority: string | null
          ticket_status: string | null
          ticket_subject: string | null
          town: string | null
          updated_at: string
          verified: boolean | null
          yearly_payment_amount: number | null
          yearly_payment_due_date: string | null
          yearly_payment_status: string | null
        }
        Insert: {
          address?: string | null
          admin_note?: string | null
          auth_user_id?: string | null
          collector?: string | null
          collector_id?: string | null
          cors_enabled?: boolean | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_collection_amount?: number | null
          emergency_collection_created_at?: string | null
          emergency_collection_due_date?: string | null
          emergency_collection_status?: string | null
          family_member_dob?: string | null
          family_member_gender?: string | null
          family_member_name?: string | null
          family_member_relationship?: string | null
          full_name: string
          gender?: string | null
          id?: string
          marital_status?: string | null
          member_number: string
          membership_type?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_notes?: string | null
          payment_type?: string | null
          phone?: string | null
          postcode?: string | null
          status?: string | null
          ticket_description?: string | null
          ticket_priority?: string | null
          ticket_status?: string | null
          ticket_subject?: string | null
          town?: string | null
          updated_at?: string
          verified?: boolean | null
          yearly_payment_amount?: number | null
          yearly_payment_due_date?: string | null
          yearly_payment_status?: string | null
        }
        Update: {
          address?: string | null
          admin_note?: string | null
          auth_user_id?: string | null
          collector?: string | null
          collector_id?: string | null
          cors_enabled?: boolean | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_collection_amount?: number | null
          emergency_collection_created_at?: string | null
          emergency_collection_due_date?: string | null
          emergency_collection_status?: string | null
          family_member_dob?: string | null
          family_member_gender?: string | null
          family_member_name?: string | null
          family_member_relationship?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          marital_status?: string | null
          member_number?: string
          membership_type?: string | null
          payment_amount?: number | null
          payment_date?: string | null
          payment_notes?: string | null
          payment_type?: string | null
          phone?: string | null
          postcode?: string | null
          status?: string | null
          ticket_description?: string | null
          ticket_priority?: string | null
          ticket_status?: string | null
          ticket_subject?: string | null
          town?: string | null
          updated_at?: string
          verified?: boolean | null
          yearly_payment_amount?: number | null
          yearly_payment_due_date?: string | null
          yearly_payment_status?: string | null
        }
        Relationships: []
      }
      members_collectors: {
        Row: {
          active: boolean | null
          created_at: string
          email: string | null
          id: string
          member_number: string | null
          name: string | null
          number: string | null
          phone: string | null
          prefix: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          member_number?: string | null
          name?: string | null
          number?: string | null
          phone?: string | null
          prefix?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          member_number?: string | null
          name?: string | null
          number?: string | null
          phone?: string | null
          prefix?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      monitoring_logs: {
        Row: {
          details: Json | null
          event_type: Database["public"]["Enums"]["monitoring_event_type"]
          id: string
          metric_name: string
          metric_value: number
          severity: Database["public"]["Enums"]["severity_level"] | null
          timestamp: string | null
        }
        Insert: {
          details?: Json | null
          event_type: Database["public"]["Enums"]["monitoring_event_type"]
          id?: string
          metric_name: string
          metric_value: number
          severity?: Database["public"]["Enums"]["severity_level"] | null
          timestamp?: string | null
        }
        Update: {
          details?: Json | null
          event_type?: Database["public"]["Enums"]["monitoring_event_type"]
          id?: string
          metric_name?: string
          metric_value?: number
          severity?: Database["public"]["Enums"]["severity_level"] | null
          timestamp?: string | null
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          collector_id: string
          created_at: string | null
          id: string
          member_id: string
          member_number: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_number: string | null
          payment_type: string
          status: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          collector_id: string
          created_at?: string | null
          id?: string
          member_id: string
          member_number: string
          notes?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_number?: string | null
          payment_type: string
          status?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          collector_id?: string
          created_at?: string | null
          id?: string
          member_id?: string
          member_number?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_number?: string | null
          payment_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_collector_id_fkey"
            columns: ["collector_id"]
            isOneToOne: false
            referencedRelation: "members_collectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_member_number_fkey"
            columns: ["member_number"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["member_number"]
          },
        ]
      }
      permission_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          permissions: Json
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json
        }
        Relationships: []
      }
      role_history: {
        Row: {
          change_type: string | null
          changed_by_user_id: string | null
          created_at: string
          id: string
          new_value: Json | null
          old_value: Json | null
          role: Database["public"]["Enums"]["app_role"] | null
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          change_type?: string | null
          changed_by_user_id?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          role?: Database["public"]["Enums"]["app_role"] | null
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          change_type?: string | null
          changed_by_user_id?: string | null
          created_at?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          role?: Database["public"]["Enums"]["app_role"] | null
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sync_status: {
        Row: {
          error_message: string | null
          id: string
          last_attempted_sync_at: string | null
          status: string | null
          store_error: string | null
          store_status: string | null
          sync_started_at: string | null
          user_id: string | null
        }
        Insert: {
          error_message?: string | null
          id?: string
          last_attempted_sync_at?: string | null
          status?: string | null
          store_error?: string | null
          store_status?: string | null
          sync_started_at?: string | null
          user_id?: string | null
        }
        Update: {
          error_message?: string | null
          id?: string
          last_attempted_sync_at?: string | null
          status?: string | null
          store_error?: string | null
          store_status?: string | null
          sync_started_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_announcements: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          message: string
          priority: number | null
          severity: string | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          priority?: number | null
          severity?: string | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          priority?: number | null
          severity?: string | null
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_collector_role: {
        Args: {
          member_id: string
          collector_name: string
          collector_prefix: string
          collector_number: string
        }
        Returns: string
      }
      audit_security_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
      check_api_health: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
        }[]
      }
      check_auth_flow: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
      check_critical_logic: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
      check_data_integrity: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
      check_error_rates: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
        }[]
      }
      check_member_numbers: {
        Args: Record<PropertyKey, never>
        Returns: {
          issue_type: string
          description: string
          affected_table: string
          member_number: string
          details: Json
        }[]
      }
      check_rbac: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
      check_resource_usage: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
        }[]
      }
      check_system_performance: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
        }[]
      }
      check_user_activity: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
        }[]
      }
      generate_family_member_number: {
        Args: {
          p_parent_member_number: string
          p_relationship: string
        }
        Returns: string
      }
      generate_full_backup: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      generate_payment_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_audit_activity_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          hour_bucket: string
          operation: string
          count: number
        }[]
      }
      get_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          name: string
          command: string
        }[]
      }
      get_system_metrics_history: {
        Args: Record<PropertyKey, never>
        Returns: {
          recorded_at: string
          metric_name: string
          metric_value: number
          category: string
        }[]
      }
      get_tables_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          columns: Json
          rls_enabled: boolean
        }[]
      }
      is_admin: {
        Args: {
          user_uid: string
        }
        Returns: boolean
      }
      is_admin_user: {
        Args: {
          user_uid: string
        }
        Returns: boolean
      }
      is_payment_overdue: {
        Args: {
          due_date: string
        }
        Returns: boolean
      }
      perform_user_roles_sync: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      restore_from_backup: {
        Args: {
          backup_data: Json
        }
        Returns: string
      }
      run_combined_system_checks: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          metric_name: string
          current_value: number
          threshold: number
          status: string
          details: Json
          test_category: string
        }[]
      }
      update_collector_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_user_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          check_type: string
          status: string
          details: Json
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "collector" | "member"
      audit_operation:
        | "create"
        | "update"
        | "delete"
        | "INSERT"
        | "UPDATE"
        | "DELETE"
      backup_operation_type: "backup" | "restore"
      monitoring_event_type:
        | "system_performance"
        | "api_latency"
        | "error_rate"
        | "user_activity"
        | "resource_usage"
      payment_method: "bank_transfer" | "cash"
      performance_metric:
        | "response_time"
        | "query_performance"
        | "connection_count"
        | "cache_hit_ratio"
      severity_level: "info" | "warning" | "error" | "critical"
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
