// src/pages/Dashboard.tsx
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
import { LogOut, BarChart3, ShoppingCart, Users, Package, DollarSign, User, ChevronUp } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from '@/components/StatusBadge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <div className="space-y-6 main-content-min-height">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      
      if (!session && !isDemoMode) { 
        navigate("/auth"); 
      } else { 
        setSession(session); 
      }
      setSessionLoading(false);
    };
    
    fetchSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { 
      const isDemoMode = localStorage.getItem('demo_mode') === 'true';
      if (!session && !isDemoMode) { 
        navigate('/auth'); 
      } else { 
        setSession(session); 
      } 
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('demo_mode');
    supabase.auth.signOut().then(() => navigate("/"));
  };

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

  const userEmail = session?.user?.email || "Admin Demo";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-100">
          <SidebarContent>
            <div className="p-6">
              <Link to="/dashboard" className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                  <img src="/logo.svg" alt="Logo Evolux360" className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-[#5932EA] tracking-tight">Evolux360</span>
              </Link>
            </div>
            <SidebarGroup>
              <SidebarGroupContent className="px-2">
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <Link 
                        to={item.url} 
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isLinkActive(item.url)
                            ? 'bg-[#5932EA] text-white shadow-md shadow-purple-100 font-semibold' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${isLinkActive(item.url) ? 'text-white' : ''}`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t border-gray-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 w-full p-2 rounded-xl hover:bg-gray-100 transition-colors text-left">
                  <Avatar className="h-9 w-9 border-2 border-purple-100">
                    <AvatarFallback className="bg-purple-50 text-[#5932EA] font-bold">{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{userEmail.split('@')[0]}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mb-2">
                <DropdownMenuItem className="text-gray-600"><User className="mr-2 h-4 w-4" /> Perfil (em breve)</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Sair do Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-w-0">
          <ScrollArea className="flex-grow">
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-40">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="bg-purple-50 text-[#5932EA] border-purple-100 px-3 py-1">
                      {localStorage.getItem('demo_mode') === 'true' ? 'Modo Demo Ativo' : 'Versão Pro'}
                    </Badge>
                </div>
              </div>
            </header>
            
            <main className="p-6">
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