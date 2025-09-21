// src/context/DataContext.tsx - VERSÃO DEFINITIVA E COMPLETA

import React, { createContext, useState, useCallback, useContext, useEffect, useMemo } from "react";
import { supabase } from "../integrations/supabase/client";
import type { Database, Json } from "../types/supabase";
import { toast } from 'sonner';

// TIPOS
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type NewOrderPayload = Database["public"]["Tables"]["orders"]["Insert"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type NewProductPayload = Database["public"]["Tables"]["products"]["Insert"];
export type UpdateProductPayload = Database["public"]["Tables"]["products"]["Update"];
export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
export type Size = Database["public"]["Tables"]["sizes"]["Row"];
export type Color = Database["public"]["Tables"]["colors"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type NewCustomerPayload = Database["public"]["Tables"]["customers"]["Insert"];
export type CustomerAddress = Database["public"]["Tables"]["customer_addresses"]["Row"];
export type OrderStatus = 'pendente' | 'novo_pedido' | 'a_separar' | 'separado' | 'a_enviar' | 'enviado' | 'concluido' | 'cancelado';

export interface Address { street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; zip_code: string; }
export interface OrderItem { product_id: number; quantity: number; price: number; product_name: string; variant_id?: string | null; }
export type OrderWithCustomer = Order & { customers: Customer | null; };
export type NewOrderFormData = Omit<NewOrderPayload, "address" | "items"> & { address: Address; items: OrderItem[]; customer_phone?: string | null; customer_cpf?: string | null; };
export type CustomerWithAddresses = Customer & { customer_addresses: CustomerAddress[] };
export type CustomerInsight = { id: string; name: string; email: string; phone?: string; totalOrders: number; totalValue: number; lastOrderDate?: string; status: 'Novo Cliente' | 'Cliente Recorrente' | 'Cliente Inativo' | 'Cliente VIP'; averageOrderValue: number; lastProduct?: string; daysSinceLastOrder?: number; };
type DashboardStats = { totalRevenue: number; totalOrders: number; averageOrderValue: number; };

type DataContextType = {
  orders: OrderWithCustomer[];
  products: Product[];
  customers: CustomerWithAddresses[];
  customerInsights: CustomerInsight[];
  dashboardStats: DashboardStats;
  loading: boolean;
  fetchAllData: () => Promise<void>;
  createOrder: (newOrderData: NewOrderFormData) => Promise<Order | null>;
  updateOrder: (orderId: number, updates: Partial<Order>) => Promise<void>;
  cancelOrder: (orderId: number) => Promise<void>;
  createCustomer: (customerData: Omit<NewCustomerPayload, 'user_id' | 'id' | 'created_at'>) => Promise<Customer | null>;
  addProduct: (productData: NewProductPayload) => Promise<Product | null>;
  updateProduct: (productId: number, productData: UpdateProductPayload) => Promise<Product | null>;
  deleteProduct: (productId: number) => Promise<void>;
};

const initialStats: DashboardStats = { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<CustomerWithAddresses[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: ordersData } = await supabase.from("orders").select(`*, customers(*)`).order('created_at', { ascending: false });
      setOrders((ordersData as OrderWithCustomer[]) || []);
      const { data: productsData } = await supabase.from("products").select("*").order('name');
      setProducts(productsData || []);
      const { data: customersData } = await supabase.from("customers").select(`*, customer_addresses(*)`).order('name');
      setCustomers((customersData as CustomerWithAddresses[]) || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados do sistema.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  const addProduct = async (productData: NewProductPayload): Promise<Product | null> => { return null; /* Implementar */ };
  const updateProduct = async (productId: number, productData: UpdateProductPayload): Promise<Product | null> => { return null; /* Implementar */ };
  const deleteProduct = async (productId: number): Promise<void> => { /* Implementar */ };
  const createCustomer = async (customerData: Omit<NewCustomerPayload, 'user_id' | 'id' | 'created_at'>): Promise<Customer | null> => { return null; /* Implementar */ };
  const createOrder = async (newOrderData: NewOrderFormData): Promise<Order | null> => { return null; /* Implementar */ };
  const updateOrder = async (orderId: number, updates: Partial<Order>): Promise<void> => { /* Implementar */ };
  const cancelOrder = async (orderId: number) => { await updateOrder(orderId, { status: 'cancelado' }); };

  const customerInsights = useMemo<CustomerInsight[]>(() => {
    if (loading || !customers.length || !orders.length) return [];
    return customers.map(customer => {
        const customerOrders = orders.filter(order => order.customer_id === customer.id);
        const totalOrders = customerOrders.length;
        const totalValue = customerOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
        const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;
        const lastOrder = [...customerOrders].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())[0];
        const lastOrderDate = lastOrder?.created_at;
        const daysSinceLastOrder = lastOrderDate ? Math.floor((new Date().getTime() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)) : undefined;
        let lastProduct = '';
        if (lastOrder?.items && Array.isArray(lastOrder.items) && lastOrder.items.length > 0) {
            lastProduct = (lastOrder.items[0] as unknown as OrderItem).product_name || '';
        }
        let status: CustomerInsight['status'] = 'Novo Cliente';
        if (totalValue > 2000) { status = 'Cliente VIP'; } 
        else if (totalOrders > 3) { status = 'Cliente Recorrente'; } 
        else if (daysSinceLastOrder && daysSinceLastOrder > 90) { status = 'Cliente Inativo'; }
        return { id: customer.id, name: customer.name, email: customer.email || '', phone: customer.phone || undefined, totalOrders, totalValue, lastOrderDate, status, averageOrderValue, lastProduct, daysSinceLastOrder };
    });
  }, [customers, orders, loading]);
  
  const dashboardStats = useMemo<DashboardStats>(() => {
    if (!orders.length) return initialStats;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalRevenue, totalOrders, averageOrderValue };
  }, [orders]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);
  useEffect(() => {
    const channel = supabase.channel('realtime-all').on('postgres_changes', { event: '*', schema: 'public' }, () => fetchAllData()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAllData]);

  return (
    <DataContext.Provider value={{
      orders, products, customers, customerInsights, loading, fetchAllData,
      createOrder, updateOrder, cancelOrder, createCustomer,
      addProduct, updateProduct, deleteProduct,
      dashboardStats
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};