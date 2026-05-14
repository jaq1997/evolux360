// src/components/OrderDetailsModal.tsx
import React from 'react';
import { Order, OrderItem, Address } from '../context/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from './StatusBadge';
import { Package, Truck, ShoppingCart, User, MapPin, CreditCard, History } from 'lucide-react';

type OrderStatus = 'novo_pedido' | 'a_separar' | 'separado' | 'a_enviar' | 'enviado' | 'concluido' | 'cancelado' | 'pendente';

const statusTimeline: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'novo_pedido', label: 'Novo Pedido', icon: ShoppingCart },
  { status: 'a_separar', label: 'Em Separação', icon: Package },
  { status: 'enviado', label: 'Enviado', icon: Truck },
  { status: 'concluido', label: 'Concluído', icon: Truck },
];

const DetailItem = ({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon?: React.ElementType }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
    {Icon && <Icon className="w-4 h-4 text-[#5932EA] mt-0.5" />}
    <div>
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  </div>
);

export function OrderDetailsModal({ isOpen, onClose, order }: { isOpen: boolean, onClose: () => void, order: Order | null }) {
  if (!order) return null;

  const items = order.items as unknown as OrderItem[] | null;
  const address = order.address as unknown as Address | null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2 border-b bg-white sticky top-0 z-10">
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="text-2xl font-bold text-[#5932EA]">Pedido #{order.id}</DialogTitle>
            <StatusBadge status={order.status as OrderStatus | null} />
          </div>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Coluna da Esquerda: Itens e Cliente (2/3) */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Itens */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Itens do Pedido
                </h3>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-600">Produto</th>
                        <th className="text-center p-3 font-semibold text-gray-600">Qtd</th>
                        <th className="text-right p-3 font-semibold text-gray-600">Preço</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items && items.length > 0 ? items.map((item, index) => (
                        <tr key={index}>
                          <td className="p-3">
                            <p className="font-medium">{item.product_name}</p>
                            {(item.color_name || item.size_name) && (
                              <p className="text-[10px] text-gray-400">
                                {item.color_name && `Cor: ${item.color_name}`} {item.size_name && `| Tam: ${item.size_name}`}
                              </p>
                            )}
                          </td>
                          <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                          <td className="p-3 text-right font-bold">R$ {(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={3} className="p-8 text-center text-gray-400 italic">Nenhum item encontrado.</td></tr>
                      )}
                    </tbody>
                    <tfoot className="bg-purple-50">
                      <tr>
                        <td colSpan={2} className="p-3 text-right font-bold text-[#5932EA]">Total do Pedido</td>
                        <td className="p-3 text-right font-bold text-[#5932EA] text-lg">R$ {order.total_price?.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>

              {/* Informações Gerais */}
              <section className="grid grid-cols-2 gap-4">
                <DetailItem label="Origem" value={order.origin} icon={ShoppingCart} />
                <DetailItem label="Método de Pagamento" value={order.payment_method} icon={CreditCard} />
              </section>

              {/* Cliente e Endereço */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4" /> Dados de Entrega
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Cliente</p>
                    <p className="font-semibold text-gray-800">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">{order.customer_email || 'Sem e-mail'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Localização</p>
                    {address ? (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {address.street}, {address.number}<br />
                        {address.neighborhood}, {address.city} - {address.state}
                      </p>
                    ) : <p className="text-sm text-gray-400 italic">Endereço não informado.</p>}
                  </div>
                </div>
              </section>
            </div>

            {/* Coluna da Direita: Histórico (1/3) */}
            <div className="md:col-start-3 space-y-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4" /> Histórico
              </h3>
              <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {statusTimeline.map((step, index) => {
                  const isPastOrCurrent = true; // No modo demo ou sem histórico real, marcamos como visual apenas
                  return (
                    <div key={index} className="relative">
                      <div className={`absolute -left-[19px] top-1 w-[10px] h-[10px] rounded-full border-2 border-white ring-4 ring-white ${order.status === step.status ? 'bg-[#5932EA] ring-[#5932EA]/20' : 'bg-gray-200'}`} />
                      <div>
                        <p className={`text-sm font-bold ${order.status === step.status ? 'text-[#5932EA]' : 'text-gray-500'}`}>{step.label}</p>
                        <p className="text-[10px] text-gray-400">Clique para atualizar status</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetailsModal;
