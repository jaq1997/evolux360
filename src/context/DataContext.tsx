// src/context/DataContext.tsx - VERSÃO FINAL E CORRIGIDA

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Database } from '../types/supabase';

// ✅ USA DIRETAMENTE OS TIPOS GERADOS PELO SUPABASE
export type Order = Database['public']['Tables']['orders']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type OrderStatus = Database['public']['Enums']['order_status'];

// ✅ SIMPLIFICA OS TIPOS PARA AS FUNÇÕES
type DataContextType = {
  orders: Order[];
  products: Product[];
  loading: boolean;
  createOrder: (newOrderData: Database['public']['Tables']['orders']['Insert']) => Promise<void>;
  updateOrder: (orderId: number, updatedData: Database['public']['Tables']['orders']['Update']) => Promise<void>;
  cancelOrder: (orderId: number) => Promise<void>;
  createProduct: (newProductData: Database['public']['Tables']['products']['Insert']) => Promise<void>;
  updateProduct: (productId: number, updatedData: Database['public']['Tables']['products']['Update']) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*').order('id', { ascending: false });
    if (ordersError) console.error('Erro ao buscar pedidos:', ordersError);
    else {
      // ✅ CORREÇÃO APLICADA AQUI
      setOrders(ordersData as Order[] || []);
    }

    const { data: productsData, error: productsError } = await supabase.from('products').select('*').order('name', { ascending: true });
    if (productsError) console.error('Erro ao buscar produtos:', productsError);
    else {
      // ✅ CORREÇÃO APLICADA AQUI
      setProducts(productsData as Product[] || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchAllData();

    const channel = supabase.channel('realtime-all-tables')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Funções CRUD (sem alterações)
  const createOrder = async (newOrderData: Database['public']['Tables']['orders']['Insert']) => {
    const { error } = await supabase.from('orders').insert([newOrderData]); // insert expects an array
    if (error) throw error;
  };

  const updateOrder = async (orderId: number, updatedData: Database['public']['Tables']['orders']['Update']) => {
    const { error } = await supabase.from('orders').update(updatedData).eq('id', orderId);
    if (error) throw error;
  };

  const cancelOrder = async (orderId: number) => {
    const { error } = await supabase.from('orders').update({ status: 'cancelado' }).eq('id', orderId);
    if (error) throw error;
  };

  const createProduct = async (newProductData: Database['public']['Tables']['products']['Insert']) => {
    const { error } = await supabase.from('products').insert([newProductData]); // insert expects an array
    if (error) throw error;
  };

  const updateProduct = async (productId: number, updatedData: Database['public']['Tables']['products']['Update']) => {
    const { error } = await supabase.from('products').update(updatedData).eq('id', productId);
    if (error) throw error;
  };

  const deleteProduct = async (productId: number) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
  };

  return (
    <DataContext.Provider value={{ orders, products, loading, createOrder, updateOrder, cancelOrder, createProduct, updateProduct, deleteProduct }}>
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData deve ser usado dentro de um DataProvider');
  return context;
};

export default DataProvider;