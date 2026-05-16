// src/pages/Vendas.tsx - VERSÃO COM PAGINAÇÃO ALINHADA

import React, { useState, useMemo } from 'react';
import { useData, OrderWithCustomer } from '../context/DataContext';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from '@/components/StatusBadge';
import { Filter, Download, Plus, MoreHorizontal, Pencil, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OrderDetailsModal } from '@/components/OrderDetailsModal';
import { AddNewOrderModal } from '@/components/AddNewOrderModal';
import { AIInsightBar } from "@/components/AIInsightBar";

const Vendas = () => {
  const { orders, loading } = useData();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [originFilter, setOriginFilter] = useState('todos');
  const [paymentFilter, setPaymentFilter] = useState('todos');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleOpenDetails = (order: OrderWithCustomer) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const openNewOrderModal = () => {
    setIsNewOrderModalOpen(true);
  };

  const getCustomerName = (order: OrderWithCustomer): string => {
    if (order.customers?.name) {
      return order.customers.name;
    }
    if (order.customer_name) {
      return order.customer_name;
    }
    return 'Cliente não informado';
  };

  const getCustomerEmail = (order: OrderWithCustomer): string => {
    if (order.customers?.email) {
      return order.customers.email;
    }
    if (order.customer_email) {
      return order.customer_email;
    }
    return 'N/A';
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const customerName = getCustomerName(order).toLowerCase();
      const customerEmail = getCustomerEmail(order).toLowerCase();
      const origin = (order.origin || '').toLowerCase();
      const status = (order.status || '').toLowerCase();
      
      // Mapeamento de status para busca amigável
      const statusLabels: Record<string, string> = {
        novo_pedido: 'novo pedido',
        a_separar: 'a separar',
        enviado: 'enviado',
        concluido: 'concluído',
        cancelado: 'cancelado'
      };
      const statusLabel = statusLabels[status] || '';

      const searchWords = lowerCaseSearchTerm.split(' ').filter(Boolean);
      
      const isEcommerceTerm = ['site', 'web', 'online'].some(k => lowerCaseSearchTerm.includes(k));
      const isLojaTerm = ['fisica', 'balcao', 'presencial', 'física'].some(k => lowerCaseSearchTerm.includes(k));
      const isWhatsappTerm = ['zap', 'whats'].some(k => lowerCaseSearchTerm.includes(k));

      const matchesSearch = searchTerm === '' ||
        order.id.toString().includes(lowerCaseSearchTerm) ||
        customerName.includes(lowerCaseSearchTerm) ||
        customerEmail.includes(lowerCaseSearchTerm) ||
        origin.includes(lowerCaseSearchTerm) ||
        (isEcommerceTerm && origin.includes('e-commerce')) ||
        (isLojaTerm && origin.includes('loja')) ||
        (isWhatsappTerm && origin.includes('whatsapp')) ||
        (order.payment_method || '').toLowerCase().includes(lowerCaseSearchTerm) ||
        statusLabel.includes(lowerCaseSearchTerm);

      const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
      const matchesOrigin = originFilter === 'todos' || origin === originFilter.toLowerCase();
      const matchesPayment = paymentFilter === 'todos' || (order.payment_method || '').toLowerCase() === paymentFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesOrigin && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, originFilter, paymentFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    return orders.filter(order => {
      const customerName = getCustomerName(order);
      const customerEmail = getCustomerEmail(order);
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      return order.id.toString().includes(lowerSearchTerm) ||
        customerName.toLowerCase().includes(lowerSearchTerm) ||
        customerEmail.toLowerCase().includes(lowerSearchTerm);
    }).slice(0, 5);
  }, [orders, searchTerm]);

  const handleExport = () => {
    if (filteredOrders.length === 0) {
      toast.error("Não há dados para exportar");
      return;
    }

    const csvData = filteredOrders.map(order => ({
      ID: order.id,
      Data: new Date(order.created_at!).toLocaleDateString('pt-BR'),
      Cliente: getCustomerName(order),
      Email: getCustomerEmail(order),
      Status: order.status,
      Origem: order.origin || 'N/A',
      Valor: order.total_price,
      Pagamento: order.payment_method || 'N/A'
    }));

    const csvRows = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vendas_evolux_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exportação concluída!");
  };

  if (loading) {
    return (
    <div className="space-y-6 main-content-min-height">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5932EA] mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando histórico de vendas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Evolux AI Insight */}
        {(() => {
          const pending = orders.filter(o => ['novo_pedido', 'a_separar'].includes(o.status)).length;
          const today = orders.filter(o => new Date(o.created_at!).toDateString() === new Date().toDateString()).length;
          let msg = `Você tem ${orders.length} pedido(s) no total.`;
          if (pending > 0) msg = `${pending} pedido(s) ainda precisam ser processados. Confira os status abaixo.`;
          if (today > 0) msg += ` ${today} novo(s) pedido(s) chegaram hoje.`;
          return <AIInsightBar message={msg} />;
        })()}
        {/* Seção de Filtros */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">Filtros e Busca</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-3 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por ID, cliente, email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="novo_pedido">Novo Pedido</SelectItem>
                  <SelectItem value="a_separar">A Separar</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Canal</label>
              <Select value={originFilter} onValueChange={setOriginFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Loja Física">Loja Física</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Pagamento</label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="bank_transfer">Transferência</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabela de Vendas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Histórico de Vendas ({filteredOrders.length})
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />Exportar
              </Button>
              <Button 
                onClick={openNewOrderModal} 
                className="bg-[#5932EA] hover:bg-[#4C2CA9] text-white"
              >
                <Plus className="mr-2 h-4 w-4" />Novo Pedido
              </Button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum pedido encontrado.</p>
              <Button 
                onClick={openNewOrderModal}
                className="mt-4 bg-[#5932EA] hover:bg-[#4C2CA9] text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Pedido
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{getCustomerName(order)}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                        <TableCell className="text-gray-600">{order.origin || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          R$ {order.total_price?.toFixed(2).replace('.', ',') || '0,00'}
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenDetails(order)}>
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" /> 
                                Editar (em breve)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between py-4">
                  <div className="text-sm text-gray-500">
                    Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredOrders.length)} a{' '}
                    {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length} resultados
                  </div>
                  
                  {/* PÁGINAÇÃO CORRIGIDA */}
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Anterior
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                      disabled={currentPage >= totalPages}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isDetailsModalOpen && selectedOrder && (
        <OrderDetailsModal 
          isOpen={isDetailsModalOpen} 
          onClose={() => setIsDetailsModalOpen(false)} 
          order={selectedOrder} 
        />
      )}
      
      <AddNewOrderModal 
        isOpen={isNewOrderModalOpen} 
        onClose={() => setIsNewOrderModalOpen(false)} 
      />
    </>
  );
};

export default Vendas;