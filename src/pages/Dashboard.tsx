// src/pages/Dashboard.tsx - VERSÃO COMPLETA E CORRIGIDA

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, Link, Routes, Route } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { useData, OrderWithCustomer } from '../context/DataContext';
import { supabase } from "../integrations/supabase/client";
import { Button } from "@/components/ui/button";
import KanbanBoard from "../components/KanbanBoard";
import CRM from "./CRM";
import Estoque from "./Estoque";
import Financeiro from "./Financeiro";
import Vendas from "./Vendas";
import { LogOut, BarChart3, ShoppingCart, Users, Package, DollarSign } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from '@/components/StatusBadge';

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const DashboardCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
    <div className="flex-grow">{children}</div>
  </div>
);

const menuItems = [
  { title: "Dashboard", icon: BarChart3, url: "/dashboard" },
  { title: "Vendas", icon: ShoppingCart, url: "/dashboard/vendas" },
  { title: "CRM", icon: Users, url: "/dashboard/crm" },
  { title: "Estoque", icon: Package, url: "/dashboard/estoque" },
  { title: "Financeiro", icon: DollarSign, url: "/dashboard/financeiro" }
];

const DashboardHome = () => {
  const { orders, dashboardStats, loading } = useData();

  const getCustomerName = (order: OrderWithCustomer): string => {
    if (order.customers?.name) return order.customers.name;
    if (order.customer_name) return order.customer_name;
    return 'Cliente não informado';
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5932EA]"></div>
            <p className="ml-4 text-gray-600">Carregando dados...</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Receita Total" value={`R$ ${dashboardStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={DollarSign} />
        <StatCard title="Total de Pedidos" value={dashboardStats.totalOrders.toString()} icon={ShoppingCart} />
        <StatCard title="Ticket Médio" value={`R$ ${dashboardStats.averageOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={DollarSign} />
      </div>
      
      <DashboardCard title="Controle de Pedidos">
        <p className="text-sm text-gray-500 mb-4 -mt-4">Arraste os pedidos para atualizar o status.</p>
        <KanbanBoard />
      </DashboardCard>
      
      <DashboardCard title="Pedidos Recentes">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{getCustomerName(order)}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">
                    R$ {order.total_price?.toFixed(2).replace('.', ',') || '0,00'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>
    </div>
  );
};

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { 
        navigate("/auth"); 
      } else { 
        setSession(session); 
      }
      setSessionLoading(false);
    };
    
    fetchSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { 
      if (!session) { 
        navigate('/auth'); 
      } else { 
        setSession(session); 
      } 
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = () => supabase.auth.signOut().then(() => navigate("/"));

  if (sessionLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5932EA] mx-auto"></div>
        <p className="mt-2 text-gray-600">Verificando sessão...</p>
      </div>
    </div>
  );

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const activeItem = menuItems.slice().reverse().find(item => currentPath.startsWith(item.url));
    return activeItem?.title || 'Dashboard';
  };
  
  const isLinkActive = (itemUrl: string) => {
    const currentPath = location.pathname;
    if (itemUrl === "/dashboard") {
      return currentPath === "/dashboard";
    }
    return currentPath.startsWith(itemUrl);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarContent>
            <div className="p-4">
              <Link to="/dashboard" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-lg flex items-center justify-center">
                  <img src="/logo.svg" alt="Logo Evolux360" className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-gray-900">Evolux360</span>
              </Link>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <Link 
                        to={item.url} 
                        className={`flex items-center space-x-2 p-2 rounded-md ${
                          isLinkActive(item.url)
                            ? 'bg-gray-100 text-[#5932EA] font-semibold' 
                            : 'hover:bg-gray-100/50'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-w-0">
          <ScrollArea className="flex-grow">
            <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-40">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                </div>
                {session && (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Olá, {session.user.email?.split('@')[0]}
                    </span>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      <LogOut className="mr-2 h-4 w-4" />Sair
                    </Button>
                  </div>
                )}
              </div>
            </header>
            
            <main className="p-4 md:p-8">
              <Routes>
                <Route index element={<DashboardHome />} />
                <Route path="vendas" element={<Vendas />} />
                <Route path="crm" element={<CRM />} />
                <Route path="estoque" element={<Estoque />} />
                <Route path="financeiro" element={<Financeiro />} />
              </Routes>
            </main>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;