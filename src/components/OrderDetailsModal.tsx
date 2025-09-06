import React from 'react';
import { Order, OrderStatus } from '../context/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { StatusBadge } from './StatusBadge';
import { Package, CheckCircle, Truck, PackageCheck, FileDown, ShoppingCart } from 'lucide-react';

const statusTimeline: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'novo_pedido', label: 'Pedido Realizado', icon: ShoppingCart },
  { status: 'a_separar', label: 'Pedido em Separação', icon: CheckCircle },
  { status: 'separado', label: 'Produto Embalado', icon: PackageCheck },
  { status: 'a_enviar', label: 'Pronto para Envio', icon: Package },
  { status: 'enviado', label: 'Pedido Enviado', icon: Truck },
];

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

export function OrderDetailsModal({ isOpen, onClose, order }: { isOpen: boolean, onClose: () => void, order: Order | null }) {
  if (!order) return null;

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
  const productName = order.description?.split(',')[1]?.trim() || 'Produto';
  const clientName = order.description?.split(',')[0]?.replace('Cliente:', '').trim() || 'Cliente não informado';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-xl font-bold text-gray-900">Detalhes do Pedido #{order.id}</DialogTitle></DialogHeader>
        <div className="space-y-6 p-1">
          <div className="p-4 bg-white rounded-lg border">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center"><Package className="w-8 h-8 text-gray-400" /></div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{productName}</h3>
                <p className="text-sm text-gray-500">Vendido para: {clientName}</p>
              </div>
              <div><StatusBadge status={order.status as OrderStatus | null} /></div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailItem label="Valor Total" value={`R$ ${order.total_price?.toFixed(2).replace('.', ',') || '0,00'}`} />
              <DetailItem label="Origem" value={order.origin || 'N/A'} />
              <DetailItem label="Pagamento" value={order.payment_method || 'N/A'} />
            </div>
          </div>
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
