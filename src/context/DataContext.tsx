// src/context/DataContext.tsx - VERSÃO FINAL, CORRIGIDA E DEFINITIVA

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Database } from '../types/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// ✅ CORREÇÃO CRÍTICA: Define o tipo 'Order' com todas as propriedades necessárias.
// Isso garante que 'created_at' e outros campos sejam reconhecidos corretamente.
export type Order = {
  id: number;
  created_at: string;
  user_id: string | null;
  customer_id: string | null;
  description: string | null;
  total_price: number | null;
  status: OrderStatus | null;
  origin: string | null;
  payment_method: string | null;
  notes: string | null;
  product_id: number | null;
};

export type OrderStatus = Database['public']['Enums']['order_status'];
export type Product = Database['public']['Tables']['products']['Row'];

type NewOrderPayload = Omit<Order, 'id' | 'created_at'>;

type UpdateOrderPayload = Partial<Omit<Order, 'id' | 'created_at'>>;

type DataContextType = {
  orders: Order[];
  loading: boolean;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  createOrder: (newOrderData: NewOrderPayload) => Promise<void>;
  updateOrderStatus: (orderId: number, newStatus: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: number) => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
  updateOrder: (orderId: number, updatedData: UpdateOrderPayload) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('orders').select('*').order('id', { ascending: false });
      if (error) { console.error('Erro ao buscar pedidos:', error); }
      else { setOrders(data as Order[] || []); }
      setLoading(false);
    };
    fetchOrders();

    const handleChanges = (payload: RealtimePostgresChangesPayload<Order>) => {
      if (payload.eventType === 'INSERT') {
        setOrders(currentOrders => [payload.new as Order, ...currentOrders]);
      }
      if (payload.eventType === 'UPDATE') {
        setOrders(currentOrders =>
          currentOrders.map(order =>
            order.id === (payload.new as Order).id ? { ...order, ...(payload.new as Order) } : order
          )
        );
      }
    };

    const channel = supabase.channel('realtime-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, handleChanges)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createOrder = async (newOrderData: NewOrderPayload) => {
    const { data, error } = await supabase.from('orders').insert([newOrderData]).select('*');
    if (error) throw error;
    
    if (data) {
        setOrders(currentOrders => [data[0] as Order, ...currentOrders]);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) throw error;
  };

  const cancelOrder = async (orderId: number) => {
    const { error } = await supabase.from('orders').update({ status: 'cancelado' }).eq('id', orderId);
    if (error) throw error;
  };

  const searchProducts = async (query: string): Promise<Product[]> => {
    let queryBuilder = supabase.from('products').select('*');
    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }
    const { data, error } = await queryBuilder.order('name', { ascending: true }).limit(20);
    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
    return data || [];
  };

  const updateOrder = async (orderId: number, updatedData: UpdateOrderPayload) => {
    const { data, error } = await supabase
      .from('orders')
      .update(updatedData)
      .eq('id', orderId)
      .select('*');
    if (error) {
      console.error("Falha ao atualizar o pedido:", error);
      throw error;
    }

    if (data) {
        setOrders(currentOrders =>
            currentOrders.map(order => order.id === data[0].id ? data[0] as Order : order)
        );
    }
  };

  return (
    <DataContext.Provider value={{ orders, loading, setOrders, createOrder, updateOrderStatus, cancelOrder, searchProducts, updateOrder }}>
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) { throw new Error('useData deve ser usado dentro de um DataProvider'); }
  return context;
};

export default DataProvider;