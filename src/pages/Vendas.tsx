// src/pages/Vendas.tsx - VERSÃO FINAL E PERFEITA

import React, { useState, useMemo } from 'react';
import { useData, Order } from '../context/DataContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from '@/components/StatusBadge';
import { Filter, Download, PlusCircle, MoreHorizontal, Pencil, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OrderDetailsModal } from '@/components/OrderDetailsModal';
import { AddNewOrderModal } from '@/components/AddNewOrderModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Vendas = () => {
  const { orders, loading } = useData();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [originFilter, setOriginFilter] = useState('todos');
  const [paymentFilter, setPaymentFilter] = useState('todos');
  const [activeFilters, setActiveFilters] = useState({ status: 'todos', origin: 'todos', payment: 'todos' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // ✅ AJUSTADO PARA 5

  const handleApplyFilters = () => {
    setActiveFilters({ status: statusFilter, origin: originFilter, payment: paymentFilter });
    setCurrentPage(1);
  };
  
  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };
  
  const openEditModal = (order: Order) => {
    setOrderToEdit(order);
    setIsNewOrderModalOpen(true);
  };

  const openNewOrderModal = () => {
    setOrderToEdit(null);
    setIsNewOrderModalOpen(true);
  };

  const filteredOrders = useMemo(() => {
    const searched = orders.filter(order => {
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return order.id.toString().includes(lowerCaseSearchTerm) || order.description?.toLowerCase().includes(lowerCaseSearchTerm);
      }
      return true;
    });
    return searched.filter(order => {
      if (activeFilters.status !== 'todos' && order.status !== activeFilters.status) return false;
      if (activeFilters.origin !== 'todos' && order.origin !== activeFilters.origin) return false;
      if (activeFilters.payment !== 'todos' && order.payment_method !== activeFilters.payment) return false;
      return true;
    });
  }, [orders, searchTerm, activeFilters]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  if (loading) {
    return <div className="p-4">Carregando histórico de vendas...</div>;
  }

  return (
    <>
      <div className="space-y-6 p-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">Filtros e Busca</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar por ID, cliente ou produto..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <hr className="border-gray-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Status</label><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="novo_pedido">Novo Pedido</SelectItem><SelectItem value="a_separar">A Separar</SelectItem><SelectItem value="enviado">Enviado</SelectItem><SelectItem value="concluido">Concluído</SelectItem><SelectItem value="cancelado">Cancelado</SelectItem></SelectContent></Select></div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Canal</label><Select value={originFilter} onValueChange={setOriginFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="ecommerce">E-commerce</SelectItem><SelectItem value="whatsapp">WhatsApp</SelectItem><SelectItem value="loja_fisica">Loja Física</SelectItem></SelectContent></Select></div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Pagamento</label><Select value={paymentFilter} onValueChange={setPaymentFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="credit_card">Crédito</SelectItem><SelectItem value="pix">PIX</SelectItem><SelectItem value="boleto">Boleto</SelectItem></SelectContent></Select></div>
            <Button onClick={handleApplyFilters} variant="outline" className="w-full">Aplicar Filtros</Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Histórico de Vendas ({filteredOrders.length})</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exportar</Button>
              <Button onClick={openNewOrderModal} className="bg-[#5932EA] hover:bg-[#4C2CA9] text-white"><PlusCircle className="mr-2 h-4 w-4" />Novo Pedido</Button>
            </div>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Cliente</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Valor</TableHead><TableHead className="text-center">Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.description?.split(',')[0]?.replace('Cliente:', '').trim() || 'N/A'}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">R$ {order.total_price?.toFixed(2).replace('.', ',') || '0,00'}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDetails(order)}>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(order)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isDetailsModalOpen && <OrderDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} order={selectedOrder} />}
      <AddNewOrderModal isOpen={isNewOrderModalOpen} onClose={() => setIsNewOrderModalOpen(false)} orderToEdit={orderToEdit} />
    </>
  );
};

export default Vendas;