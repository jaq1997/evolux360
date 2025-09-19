import React, { useState, useMemo } from 'react';
import { useData, OrderWithCustomer } from '../context/DataContext';
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
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<OrderWithCustomer | null>(null);

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

  const openEditModal = (order: OrderWithCustomer) => {
    setOrderToEdit(order);
    setIsNewOrderModalOpen(true);
  };

  const openNewOrderModal = () => {
    setOrderToEdit(null);
    setIsNewOrderModalOpen(true);
  };

  // Função para extrair nome do cliente (com fallback para os campos antigos)
  const getCustomerName = (order: OrderWithCustomer): string => {
    // Primeiro, tenta pegar do relacionamento com customers
    if (order.customers?.name) {
      return order.customers.name;
    }
    
    // Fallback: se ainda tem customer_name no order
    if (order.customer_name) {
      return order.customer_name;
    }
    
    // Fallback: tenta extrair da description (dados antigos)
    if (order.description) {
      const patterns = [
        /Cliente:\s*([^,\n\r]+)/i,
        /Nome:\s*([^,\n\r]+)/i,
        /Customer:\s*([^,\n\r]+)/i,
        /Client:\s*([^,\n\r]+)/i
      ];

      for (const pattern of patterns) {
        const match = order.description.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }

      const lines = order.description.split(/[,\n\r]/).filter(line => line.trim());
      if (lines.length > 0) {
        const firstLine = lines[0].replace(/^(Cliente:|Nome:|Customer:|Client:)/i, '').trim();
        if (firstLine) {
          return firstLine;
        }
      }
    }

    return 'Cliente não informado';
  };

  // Função para extrair email do cliente
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
      const customerName = getCustomerName(order);
      const customerEmail = getCustomerEmail(order);
      
      const matchesSearch = searchTerm === '' ||
        order.id.toString().includes(lowerCaseSearchTerm) ||
        customerName.toLowerCase().includes(lowerCaseSearchTerm) ||
        customerEmail.toLowerCase().includes(lowerCaseSearchTerm) ||
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
    return orders.filter(order => {
      const customerName = getCustomerName(order);
      const customerEmail = getCustomerEmail(order);
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      return order.id.toString().includes(lowerSearchTerm) ||
        customerName.toLowerCase().includes(lowerSearchTerm) ||
        customerEmail.toLowerCase().includes(lowerSearchTerm) ||
        order.description?.toLowerCase().includes(lowerSearchTerm);
    }).slice(0, 5); // Limita a 5 resultados no dropdown
  }, [orders, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
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
        {/* Seção de Filtros */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">Filtros e Busca</h3>
          </div>

          {/* Campo de Busca com Dropdown */}
          <Popover open={searchTerm.length > 0 && searchResults.length > 0}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por ID, cliente, email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <div className="p-2 text-sm text-gray-500">Resultados da busca:</div>
              {searchResults.map(order => (
                <div 
                  key={order.id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm" 
                  onClick={() => {
                    handleOpenDetails(order);
                    setSearchTerm(''); // Limpa o termo de busca
                  }}
                >
                  <div className="font-semibold">#{order.id} - {getCustomerName(order)}</div>
                  <div className="text-gray-500 text-xs">{getCustomerEmail(order)}</div>
                </div>
              ))}
            </PopoverContent>
          </Popover>

          <hr className="border-gray-100" />
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="a_separar">A Separar</SelectItem>
                  <SelectItem value="separado">Separado</SelectItem>
                  <SelectItem value="a_enviar">A Enviar</SelectItem>
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
              <Button variant="outline">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
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
                      <TableCell className="text-gray-500">{getCustomerEmail(order)}</TableCell>
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
                            <DropdownMenuItem onClick={() => openEditModal(order)}>
                              <Pencil className="mr-2 h-4 w-4" /> 
                              Editar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between py-4">
                  <div className="text-sm text-gray-500">
                    Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredOrders.length)} a{' '}
                    {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length} resultados
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-500">
                      Página {currentPage} de {totalPages}
                    </div>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                        disabled={currentPage <= 1}
                      >
                        <ChevronLeft className="h-4 w-4" />Anterior
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                        disabled={currentPage >= totalPages}
                      >
                        Próxima<ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modais */}
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
        orderToEdit={orderToEdit} 
      />
    </>
  );
};

export default Vendas;
