// src/context/DataContext.tsx - VERSÃO DEFINITIVA E COMPLETA

import React, { createContext, useState, useCallback, useContext, useEffect, useMemo } from "react";
import { supabase } from "../integrations/supabase/client";
import type { Database, Json } from "../types/supabase";
import { toast } from 'sonner';

// TIPOS
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type NewOrderPayload = Database["public"]["Tables"]["orders"]["Insert"];
export type Product = Database["public"]["Tables"]["products"]["Row"] & { purchase_price?: number };
export type NewProductPayload = Database["public"]["Tables"]["products"]["Insert"] & { purchase_price?: number };
export type UpdateProductPayload = Database["public"]["Tables"]["products"]["Update"] & { purchase_price?: number };
export type Customer = Database["public"]["Tables"]["customers"]["Row"] & { cpf_cnpj?: string; birth_date?: string; notes?: string; tags?: string[] };
export type NewCustomerPayload = Database["public"]["Tables"]["customers"]["Insert"];
export type CustomerAddress = Database["public"]["Tables"]["customer_addresses"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type NewTransactionPayload = Database["public"]["Tables"]["transactions"]["Insert"];
export type OrderStatus = 'pendente' | 'novo_pedido' | 'a_separar' | 'separado' | 'a_enviar' | 'enviado' | 'concluido' | 'cancelado';

export interface Address { street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; zip_code: string; }
export interface OrderItem { product_id: number; quantity: number; price: number; product_name: string; variant_id?: string | null; color_name?: string; size_name?: string; }
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
  transactions: Transaction[];
  createTransaction: (data: Omit<NewTransactionPayload, 'user_id' | 'id' | 'created_at'>) => Promise<void>;
  setOrders: React.Dispatch<React.SetStateAction<OrderWithCustomer[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCustomers: React.Dispatch<React.SetStateAction<CustomerWithAddresses[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
};

const initialStats: DashboardStats = { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<CustomerWithAddresses[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';

    if (isDemoMode) {
      setProducts([
        { id: 1, name: "Tênis Esportivo Ultra", price: 299.90, purchase_price: 150.00, stock_quantity: 45, sku: 'TEN-001', supplier: 'Nike' } as any,
        { id: 2, name: "Camiseta Dry Fit", price: 89.90, purchase_price: 30.00, stock_quantity: 120, sku: 'CAM-002', supplier: 'Adidas' } as any,
        { id: 3, name: "Shorts de Treino", price: 119.00, purchase_price: 45.00, stock_quantity: 15, sku: 'SHO-003', supplier: 'Puma' } as any,
      ]);
      setCustomers([
        { id: '1', name: "João Silva", email: "joao@email.com", phone: "(11) 99999-8888", customer_addresses: [{ street: 'Rua das Flores', number: '123', city: 'São Paulo', state: 'SP' }] } as any,
        { id: '2', name: "Maria Souza", email: "maria@email.com", phone: "(21) 98888-7777", customer_addresses: [] } as any,
      ]);
      setOrders([
        { 
          id: 101, created_at: new Date().toISOString(), customer_name: "João Silva", total_price: 299.90, status: 'novo_pedido', origin: 'WhatsApp', user_id: 'demo',
          items: [{ product_id: 1, product_name: "Tênis Esportivo Ultra", quantity: 1, price: 299.90 }] as any,
          address: { street: 'Rua das Flores', number: '123', city: 'São Paulo', state: 'SP' } as any,
          customers: { name: "João Silva", email: "joao@email.com" } as any 
        } as any,
        { 
          id: 102, created_at: new Date().toISOString(), customer_name: "Maria Souza", total_price: 89.90, status: 'enviado', origin: 'E-commerce', user_id: 'demo',
          items: [{ product_id: 2, product_name: "Camiseta Dry Fit", quantity: 1, price: 89.90 }] as any,
          customers: { name: "Maria Souza", email: "maria@email.com" } as any 
        } as any,
      ]);
      setTransactions([
        { id: 1, date: new Date().toISOString(), type: 'Entrada', origin: 'Venda #101', value: 299.90, status: 'Completo', payment_method: 'Pix', responsible: 'Admin Demo' } as any,
        { id: 2, date: new Date().toISOString(), type: 'Saída', origin: 'Fornecedor Nike', value: 1500.00, status: 'Pendente', payment_method: 'Boleto', responsible: 'Admin Demo' } as any,
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data: ordersData } = await supabase.from("orders").select(`*, customers(*)`).order('created_at', { ascending: false });
      setOrders((ordersData as OrderWithCustomer[]) || []);
      const { data: productsData } = await supabase.from("products").select("*").order('name');
      setProducts(productsData || []);
      const { data: customersData } = await supabase.from("customers").select(`*, customer_addresses(*)`).order('name');
      setCustomers((customersData as CustomerWithAddresses[]) || []);
      
      const { data: transData } = await supabase.from("transactions").select("*").order('date', { ascending: false });
      setTransactions(transData || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados do sistema.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  const addProduct = async (productData: NewProductPayload): Promise<Product | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    const { data, error } = await supabase.from("products").insert({ ...productData, user_id: session.user.id }).select().single();
    if (error) { toast.error("Erro ao adicionar produto"); return null; }
    toast.success("Produto adicionado!");
    return data;
  };

  const updateProduct = async (productId: number, productData: UpdateProductPayload): Promise<Product | null> => {
    const { data, error } = await supabase.from("products").update(productData).eq('id', productId).select().single();
    if (error) { toast.error("Erro ao atualizar produto"); return null; }
    toast.success("Produto atualizado!");
    return data;
  };


  const createCustomer = async (customerData: Omit<NewCustomerPayload, 'user_id' | 'id' | 'created_at'>): Promise<Customer | null> => {
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    if (isDemoMode) {
      const newCustomer = { ...customerData, id: Math.random().toString(), created_at: new Date().toISOString(), user_id: 'demo' } as Customer;
      setCustomers(prev => [{ ...newCustomer, customer_addresses: [] }, ...prev]);
      toast.success("Cliente criado (Modo Demo)!");
      return newCustomer;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    const { data, error } = await supabase.from("customers").insert({ ...customerData, user_id: session.user.id }).select().single();
    if (error) { toast.error("Erro ao cadastrar cliente"); return null; }
    toast.success("Cliente cadastrado!");
    return data;
  };

  const createOrder = async (newOrderData: NewOrderFormData): Promise<Order | null> => {
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    const { address, items, ...rest } = newOrderData;

    if (isDemoMode) {
      const newOrder = { 
        ...rest, id: Math.floor(Math.random() * 1000), created_at: new Date().toISOString(), user_id: 'demo', 
        address: address as any, items: items as any,
        customers: { name: rest.customer_name, email: rest.customer_email } as any
      } as any;
      setOrders(prev => [newOrder, ...prev]);
      toast.success("Pedido finalizado com sucesso!");
      return newOrder;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data, error } = await supabase.from("orders").insert({
      ...rest,
      user_id: session.user.id,
      address: address as unknown as Json,
      items: items as unknown as Json
    }).select().single();
    
    if (error) { toast.error("Erro ao criar pedido"); return null; }
    toast.success("Pedido criado com sucesso!");
    return data;
  };

  const updateOrder = async (orderId: number, updates: Partial<Order>): Promise<void> => {
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    
    if (isDemoMode) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
      toast.success("Status atualizado (Modo Demo)!");
      return;
    }

    const { error } = await supabase.from("orders").update(updates).eq('id', orderId);
    if (error) {
      console.error("Erro ao atualizar pedido:", error);
      toast.error("Erro ao atualizar status do pedido.");
      return;
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
    toast.success("Status atualizado!");
  };

  const deleteProduct = async (productId: number): Promise<void> => {
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    
    if (isDemoMode) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success("Produto excluído (Modo Demo)!");
      return;
    }

    const { error } = await supabase.from("products").delete().eq('id', productId);
    if (error) { toast.error("Erro ao excluir produto"); return; }
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast.success("Produto excluído!");
  };

  const createTransaction = async (transData: Omit<NewTransactionPayload, 'user_id' | 'id' | 'created_at'>) => {
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    
    if (isDemoMode) {
      const newId = Math.floor(Math.random() * 1000);
      const newTrans = { ...transData, id: newId, created_at: new Date().toISOString(), user_id: 'demo' } as Transaction;
      setTransactions(prev => [newTrans, ...prev]);
      toast.success("Transação registrada (Modo Demo)!");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error } = await supabase.from("transactions").insert({ ...transData, user_id: session.user.id }).select().single();
    if (error) { toast.error("Erro ao registrar transação"); return; }
    if (data) setTransactions(prev => [data, ...prev]);
    toast.success("Transação registrada!");
  };

  const cancelOrder = async (orderId: number) => { 
    await updateOrder(orderId, { status: 'cancelado' }); 
  };

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
      setOrders, setProducts, setCustomers, setTransactions,
      createOrder, updateOrder, cancelOrder, createCustomer,
      addProduct, updateProduct, deleteProduct,
      transactions, createTransaction,
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