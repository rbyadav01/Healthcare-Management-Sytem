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
      appointments: {
        Row: {
          appointment_date: string
          appointment_id: string
          created_at: string | null
          doctor_id: string
          location: string | null
          notes: string | null
          patient_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          appointment_id?: string
          created_at?: string | null
          doctor_id: string
          location?: string | null
          notes?: string | null
          patient_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_id?: string
          created_at?: string | null
          doctor_id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["doctor_id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          is_archived: boolean | null
          last_message_at: string | null
          metadata: Json | null
          session_id: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          is_archived?: boolean | null
          last_message_at?: string | null
          metadata?: Json | null
          session_id: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          is_archived?: boolean | null
          last_message_at?: string | null
          metadata?: Json | null
          session_id?: string
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_patient_messages: {
        Row: {
          created_at: string | null
          doctor_id: string
          message: string
          message_id: string
          patient_id: string
          read: boolean | null
          sender_type: string
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          doctor_id: string
          message: string
          message_id?: string
          patient_id: string
          read?: boolean | null
          sender_type: string
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          doctor_id?: string
          message?: string
          message_id?: string
          patient_id?: string
          read?: boolean | null
          sender_type?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_patient_messages_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["doctor_id"]
          },
          {
            foreignKeyName: "doctor_patient_messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["patient_id"]
          },
        ]
      }
      doctors: {
        Row: {
          address: string | null
          created_at: string | null
          doctor_id: string
          license_number: string | null
          phone: string | null
          specialization: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          doctor_id?: string
          license_number?: string | null
          phone?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          doctor_id?: string
          license_number?: string | null
          phone?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_metadata: {
        Row: {
          created_at: string | null
          id: string
          schema: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          schema?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          schema?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
      document_rows: {
        Row: {
          dataset_id: string | null
          id: number
          row_data: Json | null
        }
        Insert: {
          dataset_id?: string | null
          id?: number
          row_data?: Json | null
        }
        Update: {
          dataset_id?: string | null
          id?: number
          row_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_rows_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "document_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      health_records: {
        Row: {
          allergies: string[] | null
          blood_type: string | null
          chronic_conditions: string[] | null
          created_at: string | null
          notes: string | null
          patient_id: string
          primary_doctor_id: string | null
          record_id: string
          updated_at: string | null
        }
        Insert: {
          allergies?: string[] | null
          blood_type?: string | null
          chronic_conditions?: string[] | null
          created_at?: string | null
          notes?: string | null
          patient_id: string
          primary_doctor_id?: string | null
          record_id?: string
          updated_at?: string | null
        }
        Update: {
          allergies?: string[] | null
          blood_type?: string | null
          chronic_conditions?: string[] | null
          created_at?: string | null
          notes?: string | null
          patient_id?: string
          primary_doctor_id?: string | null
          record_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["patient_id"]
          },
          {
            foreignKeyName: "health_records_primary_doctor_id_fkey"
            columns: ["primary_doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["doctor_id"]
          },
        ]
      }
      medical_conditions: {
        Row: {
          condition_id: string
          created_at: string | null
          diagnosed_by: string | null
          diagnosed_date: string | null
          health_record_id: string
          name: string
          notes: string | null
          severity: string | null
          status: string | null
        }
        Insert: {
          condition_id?: string
          created_at?: string | null
          diagnosed_by?: string | null
          diagnosed_date?: string | null
          health_record_id: string
          name: string
          notes?: string | null
          severity?: string | null
          status?: string | null
        }
        Update: {
          condition_id?: string
          created_at?: string | null
          diagnosed_by?: string | null
          diagnosed_date?: string | null
          health_record_id?: string
          name?: string
          notes?: string | null
          severity?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_conditions_diagnosed_by_fkey"
            columns: ["diagnosed_by"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["doctor_id"]
          },
          {
            foreignKeyName: "medical_conditions_health_record_id_fkey"
            columns: ["health_record_id"]
            isOneToOne: false
            referencedRelation: "health_records"
            referencedColumns: ["record_id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string | null
          dosage: string | null
          end_date: string | null
          frequency: string | null
          health_record_id: string
          medication_id: string
          name: string
          notes: string | null
          prescribed_by: string | null
          start_date: string | null
        }
        Insert: {
          created_at?: string | null
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          health_record_id: string
          medication_id?: string
          name: string
          notes?: string | null
          prescribed_by?: string | null
          start_date?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          health_record_id?: string
          medication_id?: string
          name?: string
          notes?: string | null
          prescribed_by?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_health_record_id_fkey"
            columns: ["health_record_id"]
            isOneToOne: false
            referencedRelation: "health_records"
            referencedColumns: ["record_id"]
          },
          {
            foreignKeyName: "medications_prescribed_by_fkey"
            columns: ["prescribed_by"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["doctor_id"]
          },
        ]
      }
      messages: {
        Row: {
          computed_session_user_id: string | null
          created_at: string | null
          id: number
          message: Json
          message_data: string | null
          session_id: string
        }
        Insert: {
          computed_session_user_id?: string | null
          created_at?: string | null
          id?: never
          message: Json
          message_data?: string | null
          session_id: string
        }
        Update: {
          computed_session_user_id?: string | null
          created_at?: string | null
          id?: never
          message?: Json
          message_data?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["session_id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          gender: string | null
          patient_id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          gender?: string | null
          patient_id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          gender?: string | null
          patient_id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rag_pipeline_state: {
        Row: {
          created_at: string | null
          known_files: Json | null
          last_check_time: string | null
          last_run: string | null
          pipeline_id: string
          pipeline_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          known_files?: Json | null
          last_check_time?: string | null
          last_run?: string | null
          pipeline_id: string
          pipeline_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          known_files?: Json | null
          last_check_time?: string | null
          last_run?: string | null
          pipeline_id?: string
          pipeline_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          id: string
          timestamp: string | null
          user_id: string
          user_query: string
        }
        Insert: {
          id: string
          timestamp?: string | null
          user_id: string
          user_query: string
        }
        Update: {
          id?: string
          timestamp?: string | null
          user_id?: string
          user_query?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      test_results: {
        Row: {
          comments: string | null
          created_at: string | null
          health_record_id: string
          ordered_by: string | null
          results: string | null
          test_date: string
          test_id: string
          test_name: string
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          health_record_id: string
          ordered_by?: string | null
          results?: string | null
          test_date: string
          test_id?: string
          test_name: string
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          health_record_id?: string
          ordered_by?: string | null
          results?: string | null
          test_date?: string
          test_id?: string
          test_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_health_record_id_fkey"
            columns: ["health_record_id"]
            isOneToOne: false
            referencedRelation: "health_records"
            referencedColumns: ["record_id"]
          },
          {
            foreignKeyName: "test_results_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["doctor_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      execute_custom_sql: { Args: { sql_query: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "doctor" | "patient"
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
      app_role: ["admin", "doctor", "patient"],
    },
  },
} as const
