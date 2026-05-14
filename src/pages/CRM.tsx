// src/pages/CRM.tsx
import React, { useState, useMemo } from "react";
import { useData, CustomerInsight, CustomerAddress, Customer } from '../context/DataContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Eye, Edit, Phone, Mail, MapPin, DollarSign, PieChart as PieChartIcon, TrendingUp, Clock, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { supabase } from "../integrations/supabase/client";
import { StatusBadge } from "@/components/StatusBadge";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const MetricCard = ({ title, value, subtext, icon: Icon, iconClass }: { title: string, value: string | number, subtext: string, icon: React.ElementType, iconClass?: string }) => (
    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle><Icon className={`h-4 w-4 text-muted-foreground ${iconClass}`} /></CardHeader><CardContent><div className="text-2xl font-bold">{value}</div><p className="text-xs text-muted-foreground">{subtext}</p></CardContent></Card>
);

const getStatusColor = (status: string) => {
    const colors: { [key: string]: { badge: string, chart: string } } = {
      "Novo Cliente":       { badge: "bg-blue-100 text-blue-800 border-blue-200",       chart: "#3B82F6" },
      "Cliente Recorrente": { badge: "bg-green-100 text-green-800 border-green-200",     chart: "#22C55E" },
      "Cliente Inativo":    { badge: "bg-yellow-100 text-yellow-800 border-yellow-200",  chart: "#F59E0B" },
      "Cliente VIP":        { badge: "bg-purple-100 text-purple-800 border-purple-200",  chart: "#8B5CF6" },
      "default":            { badge: "bg-gray-100 text-gray-800",                       chart: "#6B7280" },
    };
    return colors[status] || colors.default;
};

const CRM = () => {
  const { customerInsights, customers, orders, loading, fetchAllData, createCustomer, setCustomers } = useData() as any;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [selectedClient, setSelectedClient] = useState<CustomerInsight | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newClientForm, setNewClientForm] = useState({ name: '', email: '', phone: '' });
  const [editingClient, setEditingClient] = useState<Customer | null>(null);

  const filteredClients = useMemo(() => customerInsights.filter((client: any) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ), [customerInsights, searchTerm]);
  
  const dashboardStats = useMemo(() => {
      if (!customerInsights) return { totalClients: 0, totalRevenue: 0, newClientsThisMonth: 0, inactiveClients: 0, statusDistribution: [] };
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const statusCounts = customerInsights.reduce((acc: any, client: any) => {
          acc[client.status] = (acc[client.status] || 0) + 1;
          return acc;
      }, {} as { [key: string]: number });

      return {
          totalClients: customerInsights.length,
          totalRevenue: customerInsights.reduce((sum: number, client: any) => sum + client.totalValue, 0),
          newClientsThisMonth: customerInsights.filter((c: any) => c.lastOrderDate && new Date(c.lastOrderDate) > thirtyDaysAgo).length,
          inactiveClients: customerInsights.filter((c: any) => c.status === 'Cliente Inativo').length,
          statusDistribution: Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
      };
  }, [customerInsights]);

  const selectedClientDetails = useMemo(() => {
    if (!selectedClient) return null;
    const fullCustomerData = customers.find((c: any) => c.id === selectedClient.id);
    const clientOrders = orders.filter((o: any) => o.customer_id === selectedClient.id).sort((a: any, b: any) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
    return { ...selectedClient, address: fullCustomerData?.customer_addresses?.[0], orders: clientOrders };
  }, [selectedClient, customers, orders]);

  const handleViewClient = (client: CustomerInsight) => { setSelectedClient(client); setIsDetailsModalOpen(true); };
  
  const handleOpenEditModal = (client: CustomerInsight) => {
    const clientData = customers.find((c: any) => c.id === client.id);
    if (clientData) {
      setEditingClient(clientData);
      setIsEditModalOpen(true);
    }
  };

  const handleCreateClient = async () => {
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    if (isDemoMode) {
      await createCustomer({ ...newClientForm });
      setIsNewClientModalOpen(false);
      setNewClientForm({ name: '', email: '', phone: '' });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Você precisa estar logado."); return; }
    
    try {
      const { error } = await supabase.from('customers').insert({ ...newClientForm, user_id: user.id });
      if (error) throw error;
      await fetchAllData();
      setIsNewClientModalOpen(false);
      setNewClientForm({ name: '', email: '', phone: '' });
      toast.success('Cliente criado com sucesso!');
    } catch (error) { toast.error('Erro ao criar cliente.'); }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;
    const isDemoMode = localStorage.getItem('demo_mode') === 'true';
    
    if (isDemoMode) {
      setCustomers((prev: any) => prev.map((c: any) => c.id === editingClient.id ? { ...c, ...editingClient } : c));
      setIsEditModalOpen(false);
      setEditingClient(null);
      toast.success('Cliente atualizado (Modo Demo)!');
      return;
    }

    try {
      const { error } = await supabase.from('customers').update({ name: editingClient.name, email: editingClient.email, phone: editingClient.phone }).eq('id', editingClient.id);
      if (error) throw error;
      await fetchAllData();
      setIsEditModalOpen(false);
      setEditingClient(null);
      toast.success('Cliente atualizado com sucesso!');
    } catch (error) { toast.error('Erro ao atualizar cliente.'); }
  };

  if (loading && customerInsights.length === 0) {
    return <div className="flex h-full items-center justify-center"><p>Analisando dados do CRM...</p></div>;
  }

  return (
    <div className="main-content-min-height">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="flex flex-col gap-4">
          <div className="relative w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar Cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9"/></div>
          <div className="flex justify-between items-center">
            <TabsList><TabsTrigger value="dashboard">Visão Geral</TabsTrigger><TabsTrigger value="list">Lista de Clientes</TabsTrigger></TabsList>
            <Dialog open={isNewClientModalOpen} onOpenChange={setIsNewClientModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#5932EA] hover:bg-[#4A28C7]">
                  <Plus className="w-4 h-4 mr-2" />Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#5932EA]">Adicionar Novo Cliente</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2 col-span-2"><Label>Nome Completo</Label><Input value={newClientForm.name} onChange={(e) => setNewClientForm(p => ({...p, name: e.target.value}))} /></div>
                  <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={newClientForm.email} onChange={(e) => setNewClientForm(p => ({...p, email: e.target.value}))} /></div>
                  <div className="space-y-2"><Label>Telefone</Label><Input value={newClientForm.phone} onChange={(e) => setNewClientForm(p => ({...p, phone: e.target.value}))} /></div>
                  <div className="space-y-2 col-span-2"><Label>Notas</Label><Textarea placeholder="Interesses do cliente..." onChange={(e) => (newClientForm as any).notes = e.target.value}/></div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewClientModalOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreateClient} className="bg-[#5932EA] hover:bg-[#4A28C7]">Criar Cliente</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Total de Clientes" value={dashboardStats.totalClients} subtext="Clientes na base" icon={Users} />
              <MetricCard title="Receita total" value={`R$ ${dashboardStats.totalRevenue.toLocaleString('pt-BR')}`} subtext="Total em vendas" icon={DollarSign} iconClass="text-green-500" />
              <MetricCard title="Novos Clientes" value={dashboardStats.newClientsThisMonth} subtext="Últimos 30 dias" icon={TrendingUp} iconClass="text-blue-500" />
              <MetricCard title="Inativos" value={dashboardStats.inactiveClients} subtext="> 90 dias" icon={Clock} iconClass="text-yellow-500" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                  <CardHeader><CardTitle>Clientes Inativos</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      {customerInsights.filter((c:any) => c.status === 'Cliente Inativo').slice(0, 5).map((client:any) => (
                          <div key={client.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                              <div><p className="font-medium text-sm">{client.name}</p><p className="text-xs text-gray-500">{client.daysSinceLastOrder} dias sem comprar</p></div>
                              <Button variant="ghost" size="sm" onClick={() => handleViewClient(client)}>Ver</Button>
                          </div>
                      ))}
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle>Status dos Clientes</CardTitle></CardHeader>
                  <CardContent className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie data={dashboardStats.statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                  {dashboardStats.statusDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={getStatusColor(entry.name).chart} />))}
                              </Pie>
                              <Tooltip /><Legend />
                          </PieChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list">
            <Card>
              <Table>
                <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Status</TableHead><TableHead>Pedidos</TableHead><TableHead>Total</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredClients.map((client: any) => (
                    <TableRow key={client.id}>
                      <TableCell><div className="font-medium">{client.name}</div><div className="text-xs text-gray-400">{client.email}</div></TableCell>
                      <TableCell><Badge variant="outline" className={getStatusColor(client.status).badge}>{client.status}</Badge></TableCell>
                      <TableCell className="text-center">{client.totalOrders}</TableCell>
                      <TableCell className="font-bold text-[#5932EA]">R$ {client.totalValue.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleViewClient(client)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(client)}><Edit className="h-4 w-4 text-[#5932EA]" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
        </TabsContent>

        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-3xl">
            {selectedClientDetails && (
              <>
                <DialogHeader><DialogTitle className="text-2xl text-[#5932EA]">{selectedClientDetails.name}</DialogTitle></DialogHeader>
                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3"><Mail className="text-gray-400 w-4 h-4"/> <span>{selectedClientDetails.email}</span></div>
                        <div className="flex items-center gap-3"><Phone className="text-gray-400 w-4 h-4"/> <span>{selectedClientDetails.phone || 'N/A'}</span></div>
                        {selectedClientDetails.address && <div className="flex items-start gap-3"><MapPin className="text-gray-400 w-4 h-4 mt-1"/> <span className="text-sm">{selectedClientDetails.address.street}, {selectedClientDetails.address.number} - {selectedClientDetails.address.city}</span></div>}
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold flex items-center gap-2 mb-2"><ShoppingCart className="w-4 h-4"/> Últimos Pedidos</h4>
                        <div className="border rounded-lg max-h-48 overflow-y-auto">
                            {selectedClientDetails.orders.map((o: any) => (
                                <div key={o.id} className="p-2 border-b last:border-0 flex justify-between text-sm">
                                    <span>#{o.id} - {new Date(o.created_at).toLocaleDateString()}</span>
                                    <span className="font-bold">R$ {o.total_price?.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter><Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Fechar</Button></DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar Cliente</DialogTitle></DialogHeader>
            {editingClient && (
              <div className="space-y-4 py-4">
                <div className="space-y-1"><Label>Nome</Label><Input value={editingClient.name} onChange={(e) => setEditingClient({...editingClient, name: e.target.value})} /></div>
                <div className="space-y-1"><Label>E-mail</Label><Input value={editingClient.email || ''} onChange={(e) => setEditingClient({...editingClient, email: e.target.value})} /></div>
                <div className="space-y-1"><Label>Telefone</Label><Input value={editingClient.phone || ''} onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})} /></div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleUpdateClient} className="bg-[#5932EA] hover:bg-[#4A28C7]">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Tabs>
    </div>
  );
};

export default CRM;
