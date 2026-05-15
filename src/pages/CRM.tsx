// src/pages/CRM.tsx
import React, { useState, useMemo } from "react";
import { useData, CustomerInsight, CustomerAddress, Customer } from '../context/DataContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Eye, Edit, Phone, Mail, MapPin, DollarSign, PieChart as PieChartIcon, TrendingUp, Clock, ShoppingCart, LayoutGrid, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { supabase } from "../integrations/supabase/client";
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
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  
  const [selectedClient, setSelectedClient] = useState<CustomerInsight | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newClientForm, setNewClientForm] = useState({ name: '', email: '', phone: '' });
  const [editingClient, setEditingClient] = useState<Customer | null>(null);

  const filteredClients = useMemo(() => customerInsights.filter((client: any) => {
      const lowerSearch = searchTerm.toLowerCase();
      return client.name?.toLowerCase().includes(lowerSearch) ||
             client.email?.toLowerCase().includes(lowerSearch) ||
             client.phone?.toLowerCase().includes(lowerSearch) ||
             client.status?.toLowerCase().includes(lowerSearch);
  }), [customerInsights, searchTerm]);
  
  const dashboardStats = useMemo(() => {
      if (!customerInsights) return { totalClients: 0, totalRevenue: 0, newClientsThisMonth: 0, inactiveClients: 0, statusDistribution: [] };
      const totalRevenue = customerInsights.reduce((sum: number, c: any) => sum + (c.totalValue || 0), 0);
      const newClients = customerInsights.filter((c: any) => c.status === 'Novo Cliente').length;
      const inactive = customerInsights.filter((c: any) => c.status === 'Cliente Inativo').length;
      
      const counts: any = {};
      customerInsights.forEach((c: any) => { counts[c.status] = (counts[c.status] || 0) + 1; });
      const statusDistribution = Object.keys(counts).map(name => ({ name, value: counts[name] }));

      return { totalClients: customerInsights.length, totalRevenue, newClientsThisMonth: newClients, inactiveClients: inactive, statusDistribution };
  }, [customerInsights]);

  const handleCreateClient = async () => {
    if (!newClientForm.name) { toast.error("Nome é obrigatório"); return; }
    try {
        const result = await createCustomer({ name: newClientForm.name, email: newClientForm.email, phone: newClientForm.phone });
        if (result) {
            setIsNewClientModalOpen(false);
            setNewClientForm({ name: '', email: '', phone: '' });
            fetchAllData();
        }
    } catch (e: any) { toast.error(e.message); }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;
    try {
        const { error } = await supabase.from('customers').update({ name: editingClient.name, email: editingClient.email, phone: editingClient.phone }).eq('id', editingClient.id);
        if (error) throw error;
        toast.success("Cliente atualizado!");
        setIsEditModalOpen(false);
        fetchAllData();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleViewClient = (client: any) => {
      setSelectedClient(client);
      setIsDetailsModalOpen(true);
  };

  const handleOpenEditModal = (client: any) => {
      setEditingClient(client);
      setIsEditModalOpen(true);
  };

  const selectedClientDetails = useMemo(() => {
      if (!selectedClient) return null;
      const clientOrders = orders.filter((o: any) => o.customer_email === selectedClient.email || o.customer_name === selectedClient.name);
      return { ...selectedClient, orders: clientOrders };
  }, [selectedClient, orders]);

  return (
    <div className="main-content-min-height space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
        <div className="flex-1 w-full md:max-w-md">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="Buscar por nome, email, telefone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full"/></div>
        </div>
        <div className="flex items-center gap-3">
            <Dialog open={isNewClientModalOpen} onOpenChange={setIsNewClientModalOpen}>
              <DialogTrigger asChild><Button className="bg-[#5932EA] hover:bg-[#4A28C7]"><Plus className="w-4 h-4 mr-2" />Novo Cliente</Button></DialogTrigger>
              <DialogContent className="sm:max-w-2xl !border-none shadow-2xl outline-none p-0 overflow-hidden flex flex-col [&>button]:text-white [&>button]:top-4 [&>button]:right-4">
                <div className="bg-[#5932EA] p-4"><DialogTitle className="text-white">Adicionar Cliente</DialogTitle></div>
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">Nome Completo</Label><Input value={newClientForm.name} onChange={e => setNewClientForm({...newClientForm, name: e.target.value})} className="bg-gray-50/50" /></div>
                    <div className="space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">E-mail</Label><Input value={newClientForm.email} onChange={e => setNewClientForm({...newClientForm, email: e.target.value})} className="bg-gray-50/50" /></div>
                    <div className="space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">Telefone</Label><Input value={newClientForm.phone} onChange={e => setNewClientForm({...newClientForm, phone: e.target.value})} className="bg-gray-50/50" /></div>
                    <div className="space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">CPF/CNPJ</Label><Input placeholder="Opcional" className="bg-gray-50/50" /></div>
                    <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold text-gray-400 uppercase">Endereço Completo</Label><Input placeholder="Ex: Rua das Flores, 123 - Centro" className="bg-gray-50/50" /></div>
                    <div className="space-y-1 md:col-span-2"><Label className="text-xs font-bold text-gray-400 uppercase">Observações e Tags</Label><Textarea placeholder="Informações relevantes sobre este cliente..." className="bg-gray-50/50 resize-none" rows={3} /></div>
                  </div>
                  <Button onClick={handleCreateClient} className="w-full bg-[#5932EA] hover:bg-[#4A28C7] text-white h-11 font-bold">Salvar Cliente</Button>
                </div>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 space-x-8">
          <TabsTrigger value="dashboard" className="data-[state=active]:border-b-2 data-[state=active]:border-[#5932EA] data-[state=active]:text-[#5932EA] data-[state=active]:shadow-none rounded-none px-0 pb-4 pt-2 font-semibold">Resumo</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:border-b-2 data-[state=active]:border-[#5932EA] data-[state=active]:text-[#5932EA] data-[state=active]:shadow-none rounded-none px-0 pb-4 pt-2 font-semibold">Gestão de Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Total de Clientes" value={dashboardStats.totalClients} subtext="Clientes na base" icon={Users} />
              <MetricCard title="Receita total" value={`R$ ${dashboardStats.totalRevenue.toLocaleString('pt-BR')}`} subtext="Total em vendas" icon={DollarSign} iconClass="text-green-500" />
              <MetricCard title="Novos Clientes" value={dashboardStats.newClientsThisMonth} subtext="Últimos 30 dias" icon={TrendingUp} iconClass="text-blue-500" />
              <MetricCard title="Inativos" value={dashboardStats.inactiveClients} subtext="> 90 dias" icon={Clock} iconClass="text-yellow-500" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle>Status dos Clientes</CardTitle></CardHeader><CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dashboardStats.statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>{dashboardStats.statusDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={getStatusColor(entry.name).chart} />))}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></CardContent></Card>
              <Card><CardHeader><CardTitle>Últimos Clientes Ativos</CardTitle></CardHeader><CardContent className="space-y-4">{customerInsights.slice(0, 5).map((c:any) => (<div key={c.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"><div><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-gray-500">{c.email}</p></div><Badge className={getStatusColor(c.status).badge}>{c.status}</Badge></div>))}</CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
            <div className="flex justify-end gap-2 mb-2">
                <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-[#5932EA]' : ''}><List className="w-4 h-4 mr-2" /> Lista</Button>
                <Button variant={viewMode === 'kanban' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('kanban')} className={viewMode === 'kanban' ? 'bg-[#5932EA]' : ''}><LayoutGrid className="w-4 h-4 mr-2" /> Kanban</Button>
            </div>

            {viewMode === 'list' ? (
                <Card className="border-none shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader><TableRow className="bg-gray-50"><TableHead>Cliente</TableHead><TableHead>Status</TableHead><TableHead className="text-center">Pedidos</TableHead><TableHead>Total Gasto</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredClients.map((client: any) => (
                                <TableRow key={client.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => handleViewClient(client)}>
                                    <TableCell><div className="font-bold text-gray-900">{client.name}</div><div className="text-xs text-gray-400">{client.email}</div></TableCell>
                                    <TableCell><Badge variant="outline" className={getStatusColor(client.status).badge}>{client.status}</Badge></TableCell>
                                    <TableCell className="text-center">{client.totalOrders}</TableCell>
                                    <TableCell className="font-bold text-[#5932EA]">R$ {client.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" onClick={() => handleViewClient(client)}><Eye className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(client)}><Edit className="h-4 w-4 text-[#5932EA]" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { title: "Novos / Cadastrados", filter: (c: any) => c.status === "Novo Cliente" },
                      { title: "Ativos / Recorrentes", filter: (c: any) => c.status === "Cliente Recorrente" },
                      { title: "Em Risco / Inativos", filter: (c: any) => c.status === "Cliente Inativo" },
                      { title: "VIP / Fidelizados", filter: (c: any) => c.status === "Cliente VIP" }
                    ].map(stage => (
                        <div key={stage.title} className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-4 border border-gray-100">
                            <h3 className="font-bold text-gray-700 flex items-center justify-between px-2">{stage.title} <Badge variant="secondary">{filteredClients.filter(stage.filter).length}</Badge></h3>
                            <div className="space-y-3">
                                {filteredClients.filter(stage.filter).map((client: any) => (
                                    <div key={client.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewClient(client)}>
                                        <div className="font-bold text-gray-900 mb-1">{client.name}</div>
                                        <div className="text-xs text-gray-500 mb-2">R$ {client.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                        <div className="text-[10px] text-[#5932EA] font-bold">{client.totalOrders} pedidos</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </TabsContent>
      </Tabs>

      {/* Modais de Detalhes e Edição */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-2xl !border-none shadow-2xl outline-none p-0 overflow-hidden flex flex-col [&>button]:text-white [&>button]:top-4 [&>button]:right-4">
          <div className="bg-[#5932EA] p-4"><DialogTitle className="text-white">Detalhes do Cliente</DialogTitle></div>
          {selectedClientDetails && (
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="flex items-center gap-4 border-b pb-4">
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-[#5932EA]">{selectedClientDetails.name.charAt(0)}</div>
                    <div><h3 className="text-xl font-bold">{selectedClientDetails.name}</h3><Badge className={getStatusColor(selectedClientDetails.status).badge}>{selectedClientDetails.status}</Badge></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-gray-400 text-xs">E-MAIL</Label><p className="font-medium">{selectedClientDetails.email}</p></div>
                    <div className="space-y-1"><Label className="text-gray-400 text-xs">TELEFONE</Label><p className="font-medium">{selectedClientDetails.phone || 'N/A'}</p></div>
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">HISTÓRICO DE PEDIDOS</Label>
                    <div className="border rounded-xl overflow-hidden">
                        {selectedClientDetails.orders.length > 0 ? selectedClientDetails.orders.map((o:any) => (
                            <div key={o.id} className="p-3 border-b last:border-0 flex justify-between items-center hover:bg-gray-50">
                                <div><p className="font-bold text-sm">Pedido #{o.id}</p><p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</p></div>
                                <p className="font-bold text-[#5932EA]">R$ {o.total_price.toFixed(2)}</p>
                            </div>
                        )) : <p className="p-4 text-center text-gray-400 italic">Nenhum pedido realizado.</p>}
                    </div>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-xl !border-none shadow-2xl outline-none p-0 overflow-hidden flex flex-col [&>button]:text-white [&>button]:top-4 [&>button]:right-4">
            <div className="bg-[#5932EA] p-4"><DialogTitle className="text-white">Editar Cliente</DialogTitle></div>
            {editingClient && (
                <div className="p-6 space-y-4">
                    <div className="space-y-1"><Label>Nome</Label><Input value={editingClient.name} onChange={e => setEditingClient({...editingClient, name: e.target.value})} /></div>
                    <div className="space-y-1"><Label>E-mail</Label><Input value={editingClient.email || ''} onChange={e => setEditingClient({...editingClient, email: e.target.value})} /></div>
                    <div className="space-y-1"><Label>Telefone</Label><Input value={editingClient.phone || ''} onChange={e => setEditingClient({...editingClient, phone: e.target.value})} /></div>
                    <Button onClick={handleUpdateClient} className="w-full bg-[#5932EA] hover:bg-[#4A28C7] text-white">Salvar Alterações</Button>
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRM;
