// src/components/OrderDetailsModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from './StatusBadge';
import { Package, Truck, ShoppingCart, User, MapPin, CreditCard, History, Calendar } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  // Processamento seguro de itens
  let items: any[] = [];
  try {
    if (order.items) {
      items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (!Array.isArray(items)) items = [];
    }
  } catch (e) { items = []; }

  // Processamento seguro de endereço
  let address: any = null;
  try {
    if (order.address) {
      address = typeof order.address === 'string' ? JSON.parse(order.address) : order.address;
    }
  } catch (e) { address = null; }

  const totalPrice = Number(order.total_price || 0);
  const customerName = order.customers?.name || order.customer_name || 'Cliente não identificado';
  const customerEmail = order.customers?.email || order.customer_email || 'E-mail não informado';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0 border-none outline-none [&>button]:text-white [&>button]:top-4 [&>button]:right-4 z-[9999]">
        <DialogHeader className="bg-[#5932EA] p-6 space-y-2 text-left shrink-0">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-xl font-bold text-white">Pedido #{order.id}</DialogTitle>
            <div className="bg-white rounded-full px-1"><StatusBadge status={order.status} /></div>
          </div>
          <DialogDescription className="text-purple-100/80">Detalhes completos da transação e entrega.</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Seção de Itens */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Package className="w-4 h-4" /> Itens</h3>
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left p-4 font-bold text-gray-600">Produto</th>
                        <th className="text-center p-4 font-bold text-gray-600">Qtd</th>
                        <th className="text-right p-4 font-bold text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.length > 0 ? items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-4"><p className="font-bold text-gray-800">{item.product_name || 'Produto'}</p></td>
                          <td className="p-4 text-center text-gray-600">{item.quantity}</td>
                          <td className="p-4 text-right font-bold text-gray-900">R$ {(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2).replace('.', ',')}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={3} className="p-8 text-center text-gray-400 italic">Nenhum item.</td></tr>
                      )}
                    </tbody>
                    <tfoot className="bg-purple-50/50 border-t">
                      <tr>
                        <td colSpan={2} className="p-4 text-right font-bold text-[#5932EA]">Total</td>
                        <td className="p-4 text-right font-black text-[#5932EA] text-lg">R$ {totalPrice.toFixed(2).replace('.', ',')}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Seção de Dados */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Origem</p>
                  <p className="text-sm font-bold text-gray-800">{order.origin || 'N/A'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Pagamento</p>
                  <p className="text-sm font-bold text-gray-800">{String(order.payment_method || 'N/A').replace(/_/g, ' ').toUpperCase()}</p>
                </div>
              </div>

              {/* Seção de Entrega */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><User className="w-4 h-4" /> Entrega</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Cliente</p>
                    <p className="font-bold text-gray-900">{customerName}</p>
                    <p className="text-xs text-gray-500">{customerEmail}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Endereço</p>
                    {address ? (
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">
                        {address.street || 'Rua não inf.'}, {address.number || 'S/N'}<br />
                        {address.neighborhood || ''}, {address.city || ''} - {address.state || ''}
                      </p>
                    ) : <p className="text-xs text-gray-400 italic">Não informado.</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><History className="w-4 h-4" /> Histórico</h3>
              <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {['novo_pedido', 'a_separar', 'enviado', 'concluido'].map((st, i) => (
                  <div key={st} className="relative">
                    <div className={`absolute -left-[19px] top-1 w-[10px] h-[10px] rounded-full border-2 border-white ring-4 ring-white ${order.status === st ? 'bg-[#5932EA] ring-[#5932EA]/20' : 'bg-gray-200'}`} />
                    <p className={`text-xs font-bold ${order.status === st ? 'text-[#5932EA]' : 'text-gray-500'} capitalize`}>{st.replace('_', ' ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 border-t flex justify-end shrink-0">
          <Button variant="outline" onClick={onClose} className="h-11 px-8 font-bold text-gray-600">Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
