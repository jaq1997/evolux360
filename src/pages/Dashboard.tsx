import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import KanbanBoard from "@/components/KanbanBoard";
import CRM from "./CRM";
import Estoque from "./Estoque";
import Financeiro from "./Financeiro";
import { LogOut, Settings, Briefcase, Bot, BarChart3, ShoppingCart, Users, Package, DollarSign, ArrowUpRight, MoreVertical, BarChartHorizontal, PieChart, Home, Phone, Truck, Mail, ExternalLink } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart as RechartsPieChart, LabelList } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";

const menuItems = [
  { title: "Vendas", icon: ShoppingCart, url: "/dashboard" },
  { title: "CRM", icon: Users, url: "/dashboard/crm" },
  { title: "Estoque", icon: Package, url: "/dashboard/estoque" },
  { title: "Financeiro", icon: DollarSign, url: "/dashboard/financeiro" },
];

const mockRecentOrders = [
    { id: 121, customerName: 'Maria Silva', productName: 'Vans Old Skool', value: 'R$ 799,99', status: 'Concluído', origin: 'E-commerce' },
    { id: 122, customerName: 'João Santos', productName: 'Nike Air Force', value: 'R$ 549,99', status: 'Em processamento', origin: 'Instagram' },
    { id: 124, customerName: 'Matheus Oliveira', productName: 'Tênis Nike', value: 'R$ 449,99', status: 'Cancelado', origin: 'WhatsApp' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
      case "Concluído": return <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">{status}</Badge>;
      case "Em processamento": return <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">{status}</Badge>;
      case "Cancelado": return <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">{status}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
};

const StatCard = ({ title, value, change, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
    <div className="flex-grow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
    </div>
    <div className="flex items-center text-xs text-green-600 mt-2">
      <ArrowUpRight className="w-4 h-4 mr-1" />
      <span>{change}</span>
    </div>
  </div>
);

const DashboardCard = ({ title, actions = null, children, className = '' }) => (
  <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col ${className}`}>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <div className="flex items-center space-x-2">
        {actions}
      </div>
    </div>
    <div className="flex-grow">{children}</div>
  </div>
);

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [barChartTimeRange, setBarChartTimeRange] = useState('30d');
  const [pieChartTimeRange, setPieChartTimeRange] = useState('30d');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); } else { setSession(session); }
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { navigate('/auth'); } else { setSession(session); }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleOrderCardClick = (orderData) => {
    setSelectedOrder(orderData);
    setIsOrderDetailModalOpen(true);
  };

  if (!session) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>;
  }
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard/crm': return 'CRM';
      case '/dashboard/estoque': return 'Estoque';
      case '/dashboard/financeiro': return 'Financeiro';
      default: return 'Dashboard de Vendas';
    }
  };

  const renderContent = () => {
    switch (location.pathname) {
      case '/dashboard/crm': return <CRM />;
      case '/dashboard/estoque': return <Estoque />;
      case '/dashboard/financeiro': return <Financeiro />;
      default: {
        const dataSets = {
          '30d': { bar: [{ name: 'Vans Old Skool', total: 1243 }, { name: 'Nike Air Force', total: 958 }, { name: 'Adidas Superstar', total: 792 }], pie: [{ name: 'Vans', value: 45, fill: '#5932EA' }, { name: 'Nike', value: 35, fill: '#3B82F6' }, { name: 'Adidas', value: 20, fill: '#22C55E' }] },
          '60d': { bar: [{ name: 'Vans Old Skool', total: 2400 }, { name: 'Nike Air Force', total: 1900 }, { name: 'Adidas Superstar', total: 1500 }], pie: [{ name: 'Vans', value: 48, fill: '#5932EA' }, { name: 'Nike', value: 32, fill: '#3B82F6' }, { name: 'Adidas', value: 20, fill: '#22C55E' }] },
          '90d': { bar: [{ name: 'Vans Old Skool', total: 3500 }, { name: 'Nike Air Force', total: 2800 }, { name: 'Adidas Superstar', total: 2200 }], pie: [{ name: 'Vans', value: 40, fill: '#5932EA' }, { name: 'Nike', value: 38, fill: '#3B82F6' }, { name: 'Adidas', value: 22, fill: '#22C55E' }] }
        };
        const activeBarData = dataSets[barChartTimeRange] || dataSets['30d'];
        const activePieData = dataSets[pieChartTimeRange] || dataSets['30d'];
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
          const RADIAN = Math.PI / 180;
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
          return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="bold">{`${(percent * 100).toFixed(0)}%`}</text>;
        };
        const TimeRangeFilter = ({ value, onValueChange }) => (
          <Select value={value} onValueChange={onValueChange}><SelectTrigger className="w-[150px] h-9 text-sm focus:ring-1 focus:ring-offset-0 focus:ring-[#5932EA]"><SelectValue placeholder="Selecione o período" /></SelectTrigger><SelectContent><SelectItem value="30d">Últimos 30 dias</SelectItem><SelectItem value="60d">Últimos 60 dias</SelectItem><SelectItem value="90d">Últimos 90 dias</SelectItem></SelectContent></Select>
        );

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><StatCard title="Vendas Hoje" value="R$ 12.450" change="+12%" icon={DollarSign} /><StatCard title="Pedidos" value="156" change="+8%" icon={ShoppingCart} /><StatCard title="Taxa de conversão" value="47,9%" change="+1.5%" icon={BarChart3} /><StatCard title="Receita Mensal" value="R$ 284.750" change="+20%" icon={DollarSign} /></div>
            <DashboardCard title="Controle de Pedidos" className="min-h-[500px]"><p className="text-sm text-gray-500 mb-4 -mt-4">Clique no ícone <ExternalLink className="inline h-3 w-3" /> para ver os detalhes do pedido.</p><KanbanBoard onCardClick={handleOrderCardClick} /></DashboardCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardCard title="Produtos Mais Vendidos" actions={<TimeRangeFilter value={barChartTimeRange} onValueChange={setBarChartTimeRange} />}><ResponsiveContainer width="100%" height={320}><BarChart data={activeBarData.bar} margin={{ top: 20, right: 20, left: -10, bottom: 55 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-35} textAnchor="end" interval={0} /><YAxis /><Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb' }} /><Bar dataKey="total" fill="#5932EA" radius={[4, 4, 0, 0]}><LabelList dataKey="total" position="top" fill="#6b7280" fontSize={12} /></Bar></BarChart></ResponsiveContainer></DashboardCard>
              <DashboardCard title="Vendas por Categoria" actions={<TimeRangeFilter value={pieChartTimeRange} onValueChange={setPieChartTimeRange} />}><ResponsiveContainer width="100%" height={320}><RechartsPieChart><Pie data={activePieData.pie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} labelLine={false} label={renderCustomizedLabel}>{activePieData.pie.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}</Pie><Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb' }} /><Legend /></RechartsPieChart></ResponsiveContainer></DashboardCard>
            </div>
            <DashboardCard title="Pedidos Recentes">
              <ul className="space-y-4">
                {mockRecentOrders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-gray-500" /></div>
                      <div>
                        <p className="font-semibold text-gray-800">{order.customerName}</p>
                        <div className="flex items-center space-x-2">
                           <p className="text-xs text-gray-500">{order.productName} - Pedido #{order.id}</p>
                           <Badge variant="secondary" className="h-5">{order.origin}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{order.value}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </li>
                ))}
              </ul>
            </DashboardCard>
            <section><h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Conheça nossos outros produtos</h2><div className="grid md:grid-cols-2 gap-6"><div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"><Bot className="w-10 h-10 text-[#5932EA] mb-4" /><h3 className="text-xl font-semibold mb-2">Agente SDR</h3><p className="text-gray-600 mb-4">Um agente de pré-vendas que qualifica leads e agenda reuniões automaticamente.</p><Button variant="outline">Em breve</Button></div><div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"><Briefcase className="w-10 h-10 text-[#5932EA] mb-4" /><h3 className="text-xl font-semibold mb-2">Agente Closer</h3><p className="text-gray-600 mb-4">Um agente de fechamento que negocia e finaliza vendas de forma autônoma.</p><Button variant="outline">Em breve</Button></div></div></section>
            
            <Dialog open={isOrderDetailModalOpen} onOpenChange={setIsOrderDetailModalOpen}>
              <DialogContent className="sm:max-w-2xl">{selectedOrder && (<><DialogHeader><DialogTitle className="text-2xl">Detalhes do Pedido #{selectedOrder.id}</DialogTitle><DialogDescription>Informações completas do pedido e do cliente.</DialogDescription></DialogHeader><div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-4"><h4 className="font-semibold text-gray-800 border-b pb-2">Informações do Cliente</h4><div className="text-sm space-y-2"><p><strong>Nome:</strong> {selectedOrder.customer.name}</p><p className="flex items-center"><Phone className="w-4 h-4 mr-2"/> {selectedOrder.customer.phone}</p><p className="flex items-center"><Mail className="w-4 h-4 mr-2"/> {selectedOrder.customer.email}</p></div><div><h5 className="font-medium text-gray-700">Endereço de Envio</h5><p className="text-sm text-gray-600">{selectedOrder.shipping.address}</p></div><div><h5 className="font-medium text-gray-700">Endereço de Faturamento</h5><p className="text-sm text-gray-600">{selectedOrder.billing.address}</p></div></div><div className="space-y-4"><h4 className="font-semibold text-gray-800 border-b pb-2">Detalhes da Entrega</h4><div className="text-sm space-y-2"><p><strong>Método:</strong> {selectedOrder.shipping.method}</p><p className="flex items-center"><Truck className="w-4 h-4 mr-2"/> {selectedOrder.shipping.carrier}</p></div><h4 className="font-semibold text-gray-800 border-b pb-2 pt-4">Produtos</h4><div className="text-sm space-y-2"><p><strong>Item:</strong> {selectedOrder.product.name}</p><p><strong>Cor:</strong> {selectedOrder.product.color}</p><p><strong>Tamanho:</strong> {selectedOrder.product.size}</p><p><strong>Quantidade:</strong> {selectedOrder.product.quantity}</p></div></div></div><DialogFooter className="sm:justify-between"><Button variant="ghost">Imprimir</Button><div className="flex gap-2"><DialogClose asChild><Button variant="outline">Fechar</Button></DialogClose><Button className="bg-[#5932EA] hover:bg-[#4A28C7]">Editar Pedido</Button></div></DialogFooter></>)}</DialogContent>
            </Dialog>
          </div>
        );
      }
    }
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarContent>
            <div className="p-4"><div className="flex items-center space-x-2 mb-6"><div className="w-8 h-8 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-lg flex items-center justify-center"><img src="/logo.svg" alt="Logo" className="w-5 h-5" /></div><span className="text-xl font-bold text-gray-900">Evolux360</span></div></div>
            <SidebarGroup><SidebarGroupLabel>Menu Principal</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{menuItems.map((item) => (<SidebarMenuItem key={item.title}><SidebarMenuButton asChild><Link to={item.url} className={`flex items-center space-x-2 p-2 rounded-md ${location.pathname === item.url ? 'bg-gray-100 text-[#5932EA] font-semibold' : 'hover:bg-gray-100/50'}`}><item.icon className="w-5 h-5" /><span>{item.title}</span></Link></SidebarMenuButton></SidebarMenuItem>))}</SidebarMenu></SidebarGroupContent></SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-40">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4"><SidebarTrigger /><h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1></div>
              <div className="flex items-center space-x-4"><span className="text-sm text-gray-600">Olá, {session.user.email?.split('@')[0]}</span><Button onClick={handleLogout} variant="outline" size="sm"><LogOut className="mr-2 h-4 w-4" />Sair</Button></div>
            </div>
          </header>
          <main className="p-4 md:p-8">{renderContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;