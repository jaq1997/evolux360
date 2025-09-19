import React from 'react';
// ✅ Importando os tipos corretos do seu DataContext
import { Order, OrderItem, Address } from '../context/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from './StatusBadge';
import { Package, CheckCircle, Truck, PackageCheck, ShoppingCart, User, MapPin } from 'lucide-react';

// Definição local dos status para o timeline
type OrderStatus = 'novo_pedido' | 'a_separar' | 'separado' | 'a_enviar' | 'enviado' | 'concluido' | 'cancelado' | 'pendente';

const statusTimeline: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'pendente', label: 'Pedido Realizado', icon: ShoppingCart },
  { status: 'a_separar', label: 'Pedido em Separação', icon: CheckCircle },
  { status: 'separado', label: 'Produto Embalado', icon: PackageCheck },
  { status: 'a_enviar', label: 'Pronto para Envio', icon: Package },
  { status: 'enviado', label: 'Pedido Enviado', icon: Truck },
  { status: 'concluido', label: 'Pedido Concluído', icon: CheckCircle },
  { status: 'cancelado', label: 'Pedido Cancelado', icon: CheckCircle },
];

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value || 'N/A'}</p>
  </div>
);

export function OrderDetailsModal({ isOpen, onClose, order }: { isOpen: boolean, onClose: () => void, order: Order | null }) {
  if (!order) return null;

  // ✅ Lendo os dados das colunas JSONB e fazendo o type casting
  const items = order.items as unknown as OrderItem[] | null;
  const address = order.address as unknown as Address | null;

  const generateDynamicHistory = (currentStatus: OrderStatus | null) => {
    if (!currentStatus) return [];
    const currentIndex = statusTimeline.findIndex(item => item.status === currentStatus);
    if (currentIndex === -1) {
      return [{
        label: currentStatus.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()),
        date: "Status atual",
        icon: CheckCircle,
        current: true,
      }];
    }
    return statusTimeline.map((item, index) => ({
      ...item,
      date: `Etapa ${index <= currentIndex ? 'concluída' : 'pendente'}`,
      current: index <= currentIndex,
    })).reverse();
  };

  const dynamicHistory = generateDynamicHistory(order.status as OrderStatus | null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Detalhes do Pedido #{order.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-1">
          {/* Seção de Itens do Pedido */}
          <div className="p-4 bg-white rounded-lg border">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Package className="w-5 h-5" /> Itens do Pedido</h3>
            <div className="space-y-3">
              {items && items.length > 0 ? items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold">{item.product_name} <span className="font-normal text-gray-600">(x{item.quantity})</span></p>
                    {(item.color_name || item.size_name) && (
                      <p className="text-xs text-gray-500">
                        {item.color_name && `Cor: ${item.color_name}`}
                        {item.color_name && item.size_name && ' | '}
                        {item.size_name && `Tamanho: ${item.size_name}`}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              )) : <p className="text-sm text-gray-500">Nenhum item encontrado neste pedido.</p>}
            </div>
          </div>

          {/* Seção de Detalhes Gerais */}
          <div className="p-4 bg-white rounded-lg border">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailItem label="Valor Total" value={`R$ ${order.total_price?.toFixed(2) || '0.00'}`} />
              <DetailItem label="Origem" value={order.origin} />
              <DetailItem label="Pagamento" value={order.payment_method} />
              <DetailItem label="Status" value={<StatusBadge status={order.status as OrderStatus | null} />} />
            </div>
          </div>

          {/* Seção de Cliente e Endereço */}
          <div className="p-4 bg-white rounded-lg border">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><User className="w-5 h-5" /> Cliente</h3>
            {/* ✅ Lendo da coluna 'customer_name' */}
            <DetailItem label="Nome" value={order.customer_name} />
            <DetailItem label="Email" value={order.customer_email} />
            
            {/* ✅ Renderizando o endereço a partir da coluna 'address' */}
            {address && (
              <>
                <h3 className="font-bold text-gray-900 mt-4 mb-2 flex items-center gap-2"><MapPin className="w-5 h-5" /> Endereço de Entrega</h3>
                <p className="text-sm text-gray-700">
                  {address.street}, {address.number}{address.complement ? `, ${address.complement}` : ''} - {address.neighborhood}, {address.city} - {address.state}, {address.zipCode}
                </p>
              </>
            )}
          </div>

          {/* Seção de Histórico */}
          <div className="p-4 bg-white rounded-lg border">
            <h3 className="font-bold text-gray-900 mb-4">Histórico do Pedido</h3>
            <ul className="space-y-4">
              {dynamicHistory.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${item.current ? 'bg-[#5932EA]' : 'bg-gray-300'}`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className={`font-semibold transition-colors duration-300 ${item.current ? 'text-gray-800' : 'text-gray-500'}`}>{item.label}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetailsModal;
