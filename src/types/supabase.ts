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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      colors: {
        Row: {
          hex_code: string | null
          id: number
          name: string
          user_id: string | null
        }
        Insert: {
          hex_code?: string | null
          id?: number
          name: string
          user_id?: string | null
        }
        Update: {
          hex_code?: string | null
          id?: number
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          city: string | null
          complement: string | null
          created_at: string
          customer_id: string
          id: string
          is_default: boolean | null
          is_pickup_location: boolean | null
          is_primary: boolean | null
          neighborhood: string | null
          number: string | null
          state: string | null
          street: string | null
          type: string
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          complement?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_default?: boolean | null
          is_pickup_location?: boolean | null
          is_primary?: boolean | null
          neighborhood?: string | null
          number?: string | null
          state?: string | null
          street?: string | null
          type: string
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          complement?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_default?: boolean | null
          is_pickup_location?: boolean | null
          is_primary?: boolean | null
          neighborhood?: string | null
          number?: string | null
          state?: string | null
          street?: string | null
          type?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          birth_date: string | null
          cpf: string | null
          created_at: string
          email: string | null
          gender: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          gender?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: Json | null
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          delivery_type: string | null
          id: number
          items: Json | null
          notes: string | null
          origin: string | null
          payment_method: string | null
          product_id: number | null
          status: string | null
          total_price: number | null
          user_id: string
        }
        Insert: {
          address?: Json | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          delivery_type?: string | null
          id?: number
          items?: Json | null
          notes?: string | null
          origin?: string | null
          payment_method?: string | null
          product_id?: number | null
          status?: string | null
          total_price?: number | null
          user_id?: string
        }
        Update: {
          address?: Json | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          delivery_type?: string | null
          id?: number
          items?: Json | null
          notes?: string | null
          origin?: string | null
          payment_method?: string | null
          product_id?: number | null
          status?: string | null
          total_price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_product_id"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color_id: number | null
          created_at: string | null
          id: string
          name: string | null
          price: number | null
          product_id: number | null
          size_id: number | null
          sku: string | null
          stock_quantity: number | null
          user_id: string
        }
        Insert: {
          color_id?: number | null
          created_at?: string | null
          id?: string
          name?: string | null
          price?: number | null
          product_id?: number | null
          size_id?: number | null
          sku?: string | null
          stock_quantity?: number | null
          user_id: string
        }
        Update: {
          color_id?: number | null
          created_at?: string | null
          id?: string
          name?: string | null
          price?: number | null
          product_id?: number | null
          size_id?: number | null
          sku?: string | null
          stock_quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          cost: number | null
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          name: string | null
          price: number | null
          sku: string | null
          stock_quantity: number | null
          supplier: string | null
          user_id: string | null
          variations: Json | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          price?: number | null
          sku?: string | null
          stock_quantity?: number | null
          supplier?: string | null
          user_id?: string | null
          variations?: Json | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          price?: number | null
          sku?: string | null
          stock_quantity?: number | null
          supplier?: string | null
          user_id?: string | null
          variations?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      sizes: {
        Row: {
          category: string
          id: number
          user_id: string | null
          value: string
        }
        Insert: {
          category: string
          id?: number
          user_id?: string | null
          value: string
        }
        Update: {
          category?: string
          id?: number
          user_id?: string | null
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      orders_with_customers: {
        Row: {
          city: string | null
          complement: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          neighborhood: string | null
          number: string | null
          order_id: number | null
          state: string | null
          status: string | null
          street: string | null
          total_price: number | null
          zip_code: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      decrement_stock: {
        Args: { p_product_id: number; p_quantity: number; p_variant_id: string }
        Returns: undefined
      }
      update_stock: {
        Args: { p_quantity_sold: number; p_variant_id: string }
        Returns: undefined
      }
    }
    Enums: {
      order_status:
        | "novo_pedido"
        | "a_separar"
        | "separado"
        | "a_enviar"
        | "enviado"
        | "recuperar_carrinho"
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
      order_status: [
        "novo_pedido",
        "a_separar",
        "separado",
        "a_enviar",
        "enviado",
        "recuperar_carrinho",
      ],
    },
  },
} as const
