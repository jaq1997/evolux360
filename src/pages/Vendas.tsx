import React, { useState, useMemo } from 'react';
import { useData, Order } from '../context/DataContext';
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    return orders.filter(order => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        order.id.toString().includes(lowerCaseSearchTerm) ||
        order.description?.toLowerCase().includes(lowerCaseSearchTerm);

      const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;
      const matchesOrigin = originFilter === 'todos' || order.origin === originFilter;
      const matchesPayment = paymentFilter === 'todos' || order.payment_method === paymentFilter;

      return matchesSearch && matchesStatus && matchesOrigin && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, originFilter, paymentFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const searchResults = useMemo(() => {
      if (!searchTerm) return [];
      return orders.filter(order =>
          order.id.toString().includes(searchTerm.toLowerCase()) ||
          order.description?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5); // Limita a 5 resultados no dropdown
  }, [orders, searchTerm]);

  if (loading) {
    return <div className="p-6">A carregar histórico de vendas...</div>;
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">Filtros e Busca</h3>
          </div>

          <Popover open={searchTerm.length > 0 && searchResults.length > 0}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por ID, cliente ou produto..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
               <div className="p-2 text-sm text-gray-500">Resultados da busca:</div>
               {searchResults.map(order => (
                   <div key={order.id} className="p-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => handleOpenDetails(order)}>
                       <span className="font-semibold">#{order.id}</span> - {order.description?.split(',')[0]?.replace('Cliente:', '').trim()}
                   </div>
               ))}
            </PopoverContent>
          </Popover>

          <hr className="border-gray-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Status</label><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="novo_pedido">Novo Pedido</SelectItem><SelectItem value="a_separar">A Separar</SelectItem><SelectItem value="enviado">Enviado</SelectItem><SelectItem value="concluido">Concluído</SelectItem><SelectItem value="cancelado">Cancelado</SelectItem></SelectContent></Select></div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Canal</label><Select value={originFilter} onValueChange={setOriginFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="E-commerce">E-commerce</SelectItem><SelectItem value="WhatsApp">WhatsApp</SelectItem><SelectItem value="Loja Física">Loja Física</SelectItem></SelectContent></Select></div>
            <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Pagamento</label><Select value={paymentFilter} onValueChange={setPaymentFilter}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="todos">Todos</SelectItem><SelectItem value="Cartão de Crédito">Crédito</SelectItem><SelectItem value="Pix">PIX</SelectItem><SelectItem value="Boleto">Boleto</SelectItem></SelectContent></Select></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Histórico de Vendas ({filteredOrders.length})</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline"><Download className="mr-2 h-4 w-4" />Exportar</Button>
              <Button onClick={openNewOrderModal} className="bg-[#5932EA] hover:bg-[#4C2CA9] text-white"><Plus className="mr-2 h-4 w-4" />Novo Pedido</Button>
            </div>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Cliente</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Valor</TableHead><TableHead className="text-center">Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.description?.split(',')[0]?.replace('Cliente:', '').trim() || 'N/D'}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">R$ {order.total_price?.toFixed(2).replace('.', ',') || '0,00'}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-5 w-5" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDetails(order)}>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(order)}><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-muted-foreground">Página {currentPage} de {totalPages}</div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage <= 1}><ChevronLeft className="h-4 w-4" />Anterior</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage >= totalPages}>Próxima<ChevronRight className="h-4 w-4" /></Button>
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
