export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      credits: {
        Row: {
          id: number
          created_at: string
          credits: number
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          credits?: number
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string
          credits?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      dodo_pricing_plans: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          price: number
          credits: number
          currency: string
          dodo_product_id: string | null
          is_active: boolean
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          price: number
          credits: number
          currency?: string
          dodo_product_id?: string | null
          is_active?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          price?: number
          credits?: number
          currency?: string
          dodo_product_id?: string | null
          is_active?: boolean
          metadata?: Json
        }
        Relationships: []
      }
      dodo_payments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          dodo_payment_id: string | null
          dodo_checkout_session_id: string | null
          pricing_plan_id: string
          amount: number
          currency: string
          status: string
          credits: number
          metadata: Json
          completed_at: string | null
          failed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          dodo_payment_id?: string | null
          dodo_checkout_session_id?: string | null
          pricing_plan_id: string
          amount: number
          currency?: string
          status?: string
          credits: number
          metadata?: Json
          completed_at?: string | null
          failed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          dodo_payment_id?: string | null
          dodo_checkout_session_id?: string | null
          pricing_plan_id?: string
          amount?: number
          currency?: string
          status?: string
          credits?: number
          metadata?: Json
          completed_at?: string | null
          failed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dodo_payments_pricing_plan_id_fkey"
            columns: ["pricing_plan_id"]
            isOneToOne: false
            referencedRelation: "dodo_pricing_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dodo_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      dodo_subscriptions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          dodo_subscription_id: string | null
          pricing_plan_id: string
          status: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          dodo_subscription_id?: string | null
          pricing_plan_id: string
          status?: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          dodo_subscription_id?: string | null
          pricing_plan_id?: string
          status?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "dodo_subscriptions_pricing_plan_id_fkey"
            columns: ["pricing_plan_id"]
            isOneToOne: false
            referencedRelation: "dodo_pricing_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dodo_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      dodo_webhook_events: {
        Row: {
          id: string
          created_at: string
          dodo_event_id: string
          event_type: string
          processed: boolean
          processed_at: string | null
          data: Json
          error_message: string | null
          retry_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          dodo_event_id: string
          event_type: string
          processed?: boolean
          processed_at?: string | null
          data: Json
          error_message?: string | null
          retry_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          dodo_event_id?: string
          event_type?: string
          processed?: boolean
          processed_at?: string | null
          data?: Json
          error_message?: string | null
          retry_count?: number
        }
        Relationships: []
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
      ? R
      : never)
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Row: infer R
    }
      ? R
      : never)
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
      ? I
      : never)
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never)
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
      ? U
      : never)
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never)
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"])
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName])
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"])
  ? (Database["public"]["Enums"][PublicEnumNameOrOptions])
  : never