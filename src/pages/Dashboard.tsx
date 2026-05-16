// src/pages/Dashboard.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useData, OrderWithCustomer } from '../context/DataContext';
import KanbanBoard from "../components/KanbanBoard";
import CRM from "./CRM";
import Estoque from "./Estoque";
import Financeiro from "./Financeiro";
import Vendas from "./Vendas";
import Configuracoes from "./Configuracoes";
import Relatorios from "./Relatorios";
import { DollarSign, ShoppingCart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from '@/components/StatusBadge';
import { AppLayout } from "@/components/AppLayout";
import { AIInsightBar } from "@/components/AIInsightBar";

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



const DashboardHome = () => {
  const { orders, products, dashboardStats, loading } = useData();

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
      {(() => {
        const pending = orders.filter(o => ['novo_pedido', 'a_separar'].includes(o.status)).length;
        const lowStock = products.filter(p => (p.stock_quantity || 0) < 10).length;
        let msg = "Tudo em dia! Seu negócio está operando sem pendências críticas.";
        if (pending > 0 && lowStock > 0)
          msg = `Você tem ${pending} pedido(s) aguardando processamento e ${lowStock} produto(s) com estoque crítico.`;
        else if (pending > 0)
          msg = `${pending} pedido(s) aguardam processamento. Verifique o Kanban abaixo.`;
        else if (lowStock > 0)
          msg = `${lowStock} produto(s) estão com estoque crítico. Considere repor o estoque.`;
        return <AIInsightBar message={msg} />;
      })()}
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
  return (
    <AppLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="vendas" element={<Vendas />} />
        <Route path="crm" element={<CRM />} />
        <Route path="estoque" element={<Estoque />} />
        <Route path="financeiro" element={<Financeiro />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Routes>
    </AppLayout>
  );
};

export default Dashboard;