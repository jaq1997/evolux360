import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Search, Eye, Edit, Trash2, Phone, Mail, Calendar, ShoppingCart } from "lucide-react";
import { DndContext, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const mockClients = [
  { id: 1, name: "João Silva", company: "Tech Solutions", email: "joao@tech.com", phone: "(11) 99999-9999", status: "Carrinho Abandonado", lastContact: "2025-07-06", value: "R$ 799,99", interestedIn: "Vans Old Skool", history: [{date: '2025-07-06', event: 'Abandonou o carrinho com 1 item.'}], notes: 'Entrar em contato para oferecer cupom de 10%.'},
  { id: 2, name: "Maria Santos", company: "Digital Corp", email: "maria@digital.com", phone: "(21) 88888-8888", status: "Contato Iniciado", lastContact: "2025-07-05", value: "R$ 549,99", interestedIn: "Nike Air Force", history: [{date: '2025-07-05', event: 'Contato via WhatsApp respondido.'}, {date: '2025-07-04', event: 'E-mail de recuperação enviado.'}], notes: ''},
  { id: 3, name: "Pedro Costa", company: "Innovation Hub", email: "pedro@innova.com", phone: "(31) 77777-7777", status: "Em Negociação", lastContact: "2025-07-04", value: "R$ 449,99", interestedIn: "Tênis Nike", history: [{date: '2025-07-04', event: 'Proposta enviada.'}], notes: 'Aguardando aprovação do cliente.'},
  { id: 4, name: "Ana Pereira", company: "Market Co", email: "ana@market.com", phone: "(41) 66666-6666", status: "Venda Realizada", lastContact: "2025-07-02", value: "R$ 1.200,00", interestedIn: "Adidas Forum", history: [{date: '2025-07-02', event: 'Pagamento confirmado.'}, {date: '2025-07-01', event: 'Negociação concluída.'}], notes: 'Cliente pediu para ser notificado sobre novos lançamentos da Adidas.'},
];

const getStatusColor = (status: string) => {
    switch (status) {
      case "Carrinho Abandonado": return "bg-red-100 text-red-800 border-red-200";
      case "Contato Iniciado": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Em Negociação": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Venda Realizada": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800";
    }
};

const KanbanClientCard = ({ client }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: client.id, data: client });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 999 } : {};
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4 cursor-grab active:cursor-grabbing">
        <h4 className="font-bold text-sm text-gray-900 mb-1">{client.name}</h4>
        <p className="text-xs text-gray-500 mb-2 truncate">{client.email}</p>
        <div className="flex items-center space-x-2 text-xs text-gray-600 border-t pt-2 mt-2">
          <ShoppingCart className="h-3 w-3" />
          <span>{client.interestedIn}</span>
        </div>
        <p className="text-sm font-semibold text-purple-600 mt-2">{client.value}</p>
      </div>
    );
};

const KanbanColumn = ({ id, title, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="bg-gray-100/80 p-4 rounded-xl w-full">
      <h3 className="font-bold text-gray-700 mb-4 px-1">{title}</h3>
      <div className="min-h-[400px] space-y-4">{children}</div>
    </div>
  );
};

const CRM = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("kanban");
  
  const [clientsByStatus, setClientsByStatus] = useState({
    "Carrinho Abandonado": mockClients.filter(c => c.status === "Carrinho Abandonado"),
    "Contato Iniciado": mockClients.filter(c => c.status === "Contato Iniciado"),
    "Em Negociação": mockClients.filter(c => c.status === "Em Negociação"),
    "Venda Realizada": mockClients.filter(c => c.status === "Venda Realizada"),
  });
  
  const [selectedClient, setSelectedClient] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const newStatus = over.id as string;
    const clientId = active.id;

    setClientsByStatus(prev => {
      const newColumns = JSON.parse(JSON.stringify(prev));
      let draggedClient = null;

      Object.keys(newColumns).forEach(status => {
        const clientIndex = newColumns[status].findIndex(c => c.id === clientId);
        if (clientIndex > -1) {
          [draggedClient] = newColumns[status].splice(clientIndex, 1);
        }
      });

      if (draggedClient) {
        draggedClient.status = newStatus;
        newColumns[newStatus].push(draggedClient);
      }
      
      return newColumns;
    });
  };
  
  const handleViewClient = (client) => {
    setSelectedClient(client);
    setIsHistoryModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* AJUSTE AQUI: Título e subtítulo removidos, botão alinhado à direita */}
      <div className="flex justify-end items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#5932EA] hover:bg-[#4A28C7]">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>Preencha os campos abaixo para criar um novo cliente.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2"><Label htmlFor="name">Nome do Cliente</Label><Input id="name" /></div>
              <div className="space-y-2"><Label htmlFor="lastname">Sobrenome do Cliente</Label><Input id="lastname" /></div>
              <div className="col-span-2 space-y-2"><Label htmlFor="email">E-mail do responsável</Label><Input id="email" type="email" /></div>
              <div className="space-y-2"><Label htmlFor="phone">Telefone do Responsável</Label><Input id="phone" /></div>
              <div className="space-y-2"><Label htmlFor="lead-origin">Origem do Lead</Label><Input id="lead-origin" /></div>
              <div className="col-span-2 space-y-2"><Label htmlFor="seller">Vendedor Responsável</Label><Input id="seller" /></div>
              <div className="col-span-2 space-y-2"><Label htmlFor="notes">Informações adicionais (opcional)</Label><Textarea id="notes" /></div>
            </div>
            <DialogFooter>
              <Button variant="ghost">Salvar como rascunho</Button>
              <DialogClose asChild>
                <Button type="submit" className="bg-[#5932EA] hover:bg-[#4A28C7]">Adicionar Novo Cliente</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total de Clientes</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mockClients.length}</div><p className="text-xs text-muted-foreground">+12%</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Carrinhos Abandonados</CardTitle><Users className="h-4 w-4 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{clientsByStatus["Carrinho Abandonado"].length}</div><p className="text-xs text-muted-foreground">+5%</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Em Negociação</CardTitle><Users className="h-4 w-4 text-yellow-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{clientsByStatus["Em Negociação"].length}</div><p className="text-xs text-muted-foreground">Valor: R$ 449,99</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Vendas Realizadas</CardTitle><Users className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{clientsByStatus["Venda Realizada"].length}</div><p className="text-xs text-muted-foreground">+2%</p></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="kanban">Pipeline de Vendas (Kanban)</TabsTrigger>
          <TabsTrigger value="lista">Lista de Clientes</TabsTrigger>
        </TabsList>
        <TabsContent value="lista" className="space-y-4">
          <div className="relative max-w-sm"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar clientes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8"/></div>
          <Card>
            <Table>
              <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Contato</TableHead><TableHead>Status</TableHead><TableHead>Último Contato</TableHead><TableHead className="text-right">Valor</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell><div className="font-medium">{client.name}</div><div className="text-xs text-muted-foreground">{client.company}</div></TableCell>
                    <TableCell><div className="flex items-center space-x-2 text-xs"><Mail className="h-3 w-3" /><span>{client.email}</span></div><div className="flex items-center space-x-2 text-xs mt-1"><Phone className="h-3 w-3" /><span>{client.phone}</span></div></TableCell>
                    <TableCell><Badge variant="outline" className={getStatusColor(client.status)}>{client.status}</Badge></TableCell>
                    <TableCell><div className="flex items-center space-x-2 text-xs"><Calendar className="h-3 w-3" /><span>{new Date(client.lastContact).toLocaleDateString()}</span></div></TableCell>
                    <TableCell className="text-right font-medium">{client.value}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewClient(client)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="kanban">
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(clientsByStatus).map(([status, clients]) => (
                <KanbanColumn key={status} id={status} title={`${status} (${clients.length})`}>
                  {clients.map((client) => (<KanbanClientCard key={client.id} client={client} />))}
                </KanbanColumn>
              ))}
            </div>
          </DndContext>
        </TabsContent>
      </Tabs>

      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedClient.name}</DialogTitle>
                <DialogDescription>{selectedClient.company} - {selectedClient.email}</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Último Pedido</h4>
                  <Card className="p-4"><div className="flex justify-between"><div><p className="text-sm text-gray-500">{new Date(selectedClient.lastContact).toLocaleDateString()}</p><p className="font-medium">{selectedClient.interestedIn}</p></div><p className="font-bold text-lg">{selectedClient.value}</p></div></Card>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Histórico do Cliente</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {selectedClient.history.map((event, index) => (<li key={index} className="flex items-center space-x-2"><span className="font-mono text-xs bg-gray-100 p-1 rounded">{event.date}</span><span>{event.event}</span></li>))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Observações Gerais</h4>
                  <Textarea defaultValue={selectedClient.notes} placeholder="Adicione notas sobre este cliente..." />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Fechar</Button></DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default CRM;