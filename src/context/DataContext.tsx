// src/context/DataContext.tsx
import React, { createContext, useState, useCallback, useContext, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import type { Database, Json } from "../types/supabase";

// Tipos gerados pelo Supabase
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type NewOrderPayload = Database["public"]["Tables"]["orders"]["Insert"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
export type Size = Database["public"]["Tables"]["sizes"]["Row"];
export type Color = Database["public"]["Tables"]["colors"]["Row"];

// Extensão do tipo de variante com detalhes
export type ProductVariantWithDetails = ProductVariant & {
  sizes?: Size;
  colors?: Color;
};

// Tipos para address e items (jsonb)
export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  variant_id?: string | null;
  size_name?: string;
  color_name?: string;
}

// Payload estendido para o app (frontend trabalha com objetos tipados)
export type NewOrderPayloadExtended = Omit<NewOrderPayload, "address" | "items"> & {
  address: Address;
  items: OrderItem[];
};

type DataContextType = {
  orders: Order[];
  products: Product[];
  productVariants: ProductVariant[];
  sizes: Size[];
  colors: Color[];
  fetchAllData: () => Promise<void>;
  createOrder: (newOrderData: NewOrderPayloadExtended) => Promise<void>;
  getProductVariantsWithDetails: (productId: number) => Promise<ProductVariantWithDetails[]>;
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar todos os dados do Supabase
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);

      const { data: ordersData } = await supabase.from("orders").select("*");
      if (ordersData) setOrders(ordersData);

      const { data: productsData } = await supabase.from("products").select("*");
      if (productsData) setProducts(productsData);

      const { data: variantsData } = await supabase.from("product_variants").select("*");
      if (variantsData) setProductVariants(variantsData);

      const { data: sizesData } = await supabase.from("sizes").select("*");
      if (sizesData) setSizes(sizesData);

      const { data: colorsData } = await supabase.from("colors").select("*");
      if (colorsData) setColors(colorsData);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar pedido (conversão automática de objetos -> Json)
  const createOrder = async (newOrderData: NewOrderPayloadExtended) => {
    const payload: NewOrderPayload = {
      ...newOrderData,
      address: newOrderData.address as unknown as Json,
      items: newOrderData.items as unknown as Json,
    };

    const { error } = await supabase.from("orders").insert([payload]);
    if (error) {
      console.error("Erro ao criar pedido:", error.message);
      throw error;
    }
    await fetchAllData();
  };

  const getProductVariantsWithDetails = async (
    productId: number
  ): Promise<ProductVariantWithDetails[]> => {
    const variants = productVariants.filter(v => v.product_id === productId);
    return variants.map(variant => ({
      ...variant,
      sizes: sizes.find(s => s.id === variant.size_id),
      colors: colors.find(c => c.id === variant.color_id),
    }));
  };

  // 🔹 Fetch automático quando o usuário estiver logado
  useEffect(() => {
    const fetchOnLogin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchAllData();
      }
    };

    fetchOnLogin();

    // Listener para alterações de sessão (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchAllData();
      } else {
        // Se logout, limpar os dados
        setOrders([]);
        setProducts([]);
        setProductVariants([]);
        setSizes([]);
        setColors([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchAllData]);

  return (
    <DataContext.Provider
      value={{
        orders,
        products,
        productVariants,
        sizes,
        colors,
        fetchAllData,
        createOrder,
        getProductVariantsWithDetails,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Hook para consumir o contexto
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
