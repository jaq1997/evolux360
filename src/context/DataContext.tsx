import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Database } from '../types/supabase';

// Definição central e única para os status de pedido
export type OrderStatus = 'novo_pedido' | 'a_separar' | 'separado' | 'a_enviar' | 'enviado' | 'concluido' | 'cancelado' | 'recuperar_carrinho';

export type Order = Database['public']['Tables']['orders']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];

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
  searchProducts: (query: string) => Promise<Product[]>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*').order('id', { ascending: false });
      if (ordersError) throw ordersError;
      setOrders(ordersData as Order[] || []);

      const { data: productsData, error: productsError } = await supabase.from('products').select('*').order('name', { ascending: true });
      if (productsError) throw productsError;
      setProducts(productsData as Product[] || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const channel = supabase.channel('realtime-all-tables')
      .on('postgres_changes', { event: '*', schema: 'public' }, fetchAllData)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- Funções CRUD com Lógica de Atualização Otimista ---

  const createOrder = async (newOrderData: Database['public']['Tables']['orders']['Insert']) => {
    // Para criar, buscamos os dados depois para obter o ID gerado pelo banco
    const { error } = await supabase.from('orders').insert([newOrderData]);
    if (error) throw error;
    await fetchAllData();
  };

  const updateOrder = async (orderId: number, updatedData: Database['public']['Tables']['orders']['Update']) => {
    const originalOrders = [...orders];

    // 1. Atualiza a IU instantaneamente para uma animação suave
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, ...updatedData } : order
      )
    );

    // 2. Envia a alteração para o banco de dados em segundo plano
    const { error } = await supabase.from('orders').update(updatedData).eq('id', orderId);

    // 3. Se der erro, desfaz a alteração na IU
    if (error) {
      console.error("Falha ao atualizar o pedido, revertendo:", error);
      setOrders(originalOrders);
      throw error;
    }
  };

  const cancelOrder = async (orderId: number) => {
    await updateOrder(orderId, { status: 'cancelado' });
  };

  const createProduct = async (newProductData: Database['public']['Tables']['products']['Insert']) => {
    const { error } = await supabase.from('products').insert([newProductData]);
    if (error) throw error;
    await fetchAllData();
  };

  const updateProduct = async (productId: number, updatedData: Database['public']['Tables']['products']['Update']) => {
    const { error } = await supabase.from('products').update(updatedData).eq('id', productId);
    if (error) throw error;
    await fetchAllData(); // Para produtos, a atualização otimista não é tão crítica
  };

  const deleteProduct = async (productId: number) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
    await fetchAllData();
  };
  
  const searchProducts = async (query: string): Promise<Product[]> => {
    if (!query) return [];
    const { data, error } = await supabase
      .from('products')
      .select()
      .ilike('name', `%${query}%`);
    if (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
    return data as Product[];
  };

  return (
    <DataContext.Provider value={{ orders, products, loading, createOrder, updateOrder, cancelOrder, createProduct, updateProduct, deleteProduct, searchProducts }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData deve ser usado dentro de um DataProvider');
  return context;
};

export default DataProvider;

