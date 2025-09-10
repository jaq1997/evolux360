// src/context/DataContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Tables } from '../types/supabase';

export type Order = Tables<'orders'>;
export type Product = Tables<'products'>;
export type Size = Tables<'sizes'>;
export type Color = Tables<'colors'>;
export type ProductVariant = Tables<'product_variants'>;
export type NewOrderPayload = Tables<'orders', 'Insert'>;

// Adicionando as novas funções à tipagem do contexto
type DataContextType = {
  orders: Order[];
  products: Product[];
  sizes: Size[];
  colors: Color[];
  productVariants: ProductVariant[];
  loading: boolean;
  fetchAllData: () => Promise<void>;
  createOrder: (newOrderData: NewOrderPayload) => Promise<void>;
  searchProducts: (term: string) => Promise<Product[]>;
  getProductVariantsWithDetails: (productId: number) => Promise<any[]>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);

  // Bloco completo, sem abreviações
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        { data: ordersData, error: ordersError },
        { data: productsData, error: productsError },
        { data: sizesData, error: sizesError },
        { data: colorsData, error: colorsError },
        { data: variantsData, error: variantsError },
      ] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('products').select('*'),
        supabase.from('sizes').select('*'),
        supabase.from('colors').select('*'),
        supabase.from('product_variants').select('*'),
      ]);

      if (ordersError) throw ordersError;
      if (productsError) throw productsError;
      if (sizesError) throw sizesError;
      if (colorsError) throw colorsError;
      if (variantsError) throw variantsError;

      setOrders(ordersData || []);
      setProducts(productsData || []);
      setSizes(sizesData || []);
      setColors(colorsData || []);
      setProductVariants(variantsData || []);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Bloco completo, sem abreviações
  useEffect(() => {
    fetchAllData();
    const channel = supabase.channel('realtime-all-tables')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllData]);

  const createOrder = async (newOrderData: NewOrderPayload) => {
    const { error } = await supabase.from('orders').insert([newOrderData as any]);
    if (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  };

  const searchProducts = async (term: string): Promise<Product[]> => {
    const searchTerm = term.toLowerCase();
    return products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm) ||
      product.sku?.toLowerCase().includes(searchTerm)
    );
  };
  
  const getProductVariantsWithDetails = async (productId: number): Promise<any[]> => {
    const variants = productVariants.filter(v => v.product_id === productId);
    return variants.map(variant => ({
      ...variant,
      sizes: sizes.find(s => s.id === variant.size_id),
      colors: colors.find(c => c.id === variant.color_id)
    }));
  };

  return (
    <DataContext.Provider value={{
      orders, products, sizes, colors, productVariants, loading, fetchAllData, createOrder,
      searchProducts, getProductVariantsWithDetails
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};
