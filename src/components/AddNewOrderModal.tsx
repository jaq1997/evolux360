// src/components/AddNewOrderModal.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Minus, User, Package, CreditCard, ShoppingCart, Trash2, MapPin } from 'lucide-react';
import { useData, Product, NewOrderFormData, OrderItem as OrderItemType } from '../context/DataContext';
import { toast } from 'sonner';

interface AddNewOrderModalProps { isOpen: boolean; onClose: () => void; }

export const AddNewOrderModal: React.FC<AddNewOrderModalProps> = ({ isOpen, onClose }) => {
  const { products, createOrder } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [origin, setOrigin] = useState('WhatsApp');

  const [customerData, setCustomerData] = useState({
    name: '', email: '', phone: '', cpf: '',
    address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip_code: '' }
  });

  const [selectedProducts, setSelectedProducts] = useState<OrderItemType[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card' | 'pix' | 'cash' | 'bank_transfer'>('pix');

  const subtotal = useMemo(() => selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0), [selectedProducts]);

  const handleClose = useCallback(() => {
    setCurrentStep(1);
    setCustomerData({ name: '', email: '', phone: '', cpf: '', address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip_code: '' } });
    setSelectedProducts([]);
    onClose();
  }, [onClose]);

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Adicione pelo menos um produto ao pedido.");
      return;
    }
    setIsSubmitting(true);
    const newOrderData: NewOrderFormData = {
      customer_name: customerData.name,
      customer_email: customerData.email,
      customer_phone: customerData.phone,
      customer_cpf: customerData.cpf,
      address: customerData.address,
      items: selectedProducts,
      total_price: subtotal,
      status: 'novo_pedido',
      origin: origin,
      payment_method: paymentMethod,
    };
    
    try {
        const result = await createOrder(newOrderData);
        if (result) {
          handleClose();
        }
    } catch (e) {
        toast.error("Erro ao processar pedido.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const addProductToOrder = (product: Product) => {
    const existing = selectedProducts.find(p => p.product_id === product.id);
    if (existing) {
      setSelectedProducts(prev => prev.map(p => p.product_id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
    } else {
      setSelectedProducts(prev => [...prev, { product_id: product.id, product_name: product.name, price: product.price, quantity: 1 }]);
    }
    toast.success(`${product.name} adicionado!`);
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(prev => prev.filter(p => p.product_id !== productId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] !border-none shadow-2xl outline-none p-0 overflow-hidden flex flex-col [&>button]:text-white [&>button]:top-4 [&>button]:right-4">
        <div className="bg-[#5932EA] p-6 shrink-0">
          <DialogTitle className="text-white text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" /> Novo Pedido Manual
          </DialogTitle>
          <div className="flex gap-4 mt-4">
            {[1, 2, 3].map(step => (
                <div key={step} className={`flex items-center gap-2 text-sm font-bold ${currentStep === step ? 'text-white' : 'text-purple-300'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${currentStep === step ? 'bg-white text-[#5932EA] border-white' : 'border-purple-300'}`}>{step}</div>
                    {step === 1 ? 'Cliente' : step === 2 ? 'Produtos' : 'Pagamento'}
                </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-4 duration-300 max-w-4xl mx-auto w-full">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-lg font-bold text-[#5932EA] border-b border-gray-50 pb-3">
                    <User className="w-5 h-5" /> Identificação do Cliente
                </div>
                <div className="space-y-4">
                    <div className="space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">Nome Completo</Label><Input value={customerData.name} onChange={e => setCustomerData({...customerData, name: e.target.value})} placeholder="Nome do cliente" className="border-gray-200 bg-gray-50/50" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">E-mail</Label><Input type="email" value={customerData.email} onChange={e => setCustomerData({...customerData, email: e.target.value})} placeholder="email@exemplo.com" className="border-gray-200 bg-gray-50/50" /></div>
                        <div className="space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">Telefone</Label><Input value={customerData.phone} onChange={e => setCustomerData({...customerData, phone: e.target.value})} placeholder="(00) 00000-0000" className="border-gray-200 bg-gray-50/50" /></div>
                    </div>
                    <div className="space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">Origem da Venda</Label>
                        <Select value={origin} onValueChange={setOrigin}>
                            <SelectTrigger className="border-gray-200 bg-gray-50/50"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="WhatsApp">WhatsApp</SelectItem><SelectItem value="E-commerce">E-commerce</SelectItem><SelectItem value="Loja Física">Loja Física</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-lg font-bold text-[#5932EA] border-b border-gray-50 pb-3">
                    <MapPin className="w-5 h-5" /> Endereço de Entrega
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">Logradouro / Rua</Label><Input value={customerData.address.street} onChange={e => setCustomerData({...customerData, address: {...customerData.address, street: e.target.value}})} className="border-gray-200 bg-gray-50/50" /></div>
                    <div className="space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">Número</Label><Input value={customerData.address.number} onChange={e => setCustomerData({...customerData, address: {...customerData.address, number: e.target.value}})} className="border-gray-200 bg-gray-50/50" /></div>
                    <div className="space-y-1"><Label className="text-xs font-bold text-gray-400 uppercase">CEP</Label><Input value={customerData.address.zip_code} onChange={e => setCustomerData({...customerData, address: {...customerData.address, zip_code: e.target.value}})} className="border-gray-200 bg-gray-50/50" /></div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar produtos..." className="pl-9 h-11 border-gray-200 rounded-xl shadow-sm" />
                  </div>
                  <div className="border rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto bg-white">
                    {products.map(p => (
                        <div key={p.id} className="p-4 border-b last:border-0 flex justify-between items-center hover:bg-gray-50 transition-colors group">
                            <div><p className="font-bold text-gray-900">{p.name}</p><p className="text-xs text-[#5932EA] font-bold">R$ {p.price.toFixed(2)}</p></div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full bg-[#5932EA]/5 text-[#5932EA] group-hover:bg-[#5932EA] group-hover:text-white" onClick={() => addProductToOrder(p)}><Plus className="w-4 h-4" /></Button>
                        </div>
                    ))}
                  </div>
               </div>
               <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ShoppingCart className="w-4 h-4"/> Itens do Pedido</h3>
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] mb-4">
                    {selectedProducts.map(item => (
                        <div key={item.product_id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                            <div className="flex-1 min-w-0"><p className="text-sm font-bold text-gray-900 truncate">{item.product_name}</p><p className="text-xs text-gray-500">{item.quantity}x R$ {item.price.toFixed(2)}</p></div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => removeProduct(item.product_id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    ))}
                    {selectedProducts.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">Nenhum item selecionado</div>}
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-black text-[#5932EA]"><span>Total</span><span>R$ {subtotal.toFixed(2)}</span></div>
                  </div>
               </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Forma de Pagamento</h3>
                    <p className="text-sm text-gray-500">Selecione como o cliente realizará o pagamento.</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {['pix', 'credit_card', 'debit_card', 'cash'].map(method => (
                        <div key={method} className={`p-4 border-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${paymentMethod === method ? 'border-[#5932EA] bg-[#5932EA]/5 ring-4 ring-[#5932EA]/10' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => setPaymentMethod(method as any)}>
                            <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === method ? 'border-[#5932EA] bg-[#5932EA]' : 'border-gray-300'}`} />
                                <span className="font-bold text-gray-700 capitalize">{method.replace('_', ' ')}</span>
                            </div>
                            <CreditCard className={`w-5 h-5 ${paymentMethod === method ? 'text-[#5932EA]' : 'text-gray-300'}`} />
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 bg-gray-50 border-t flex justify-between items-center gap-3">
            <div className="text-gray-400 text-sm font-medium">Passo {currentStep} de 3</div>
            <div className="flex gap-3">
                {currentStep > 1 && <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} className="h-11 px-8">Voltar</Button>}
                {currentStep < 3 ? (
                    <Button onClick={() => setCurrentStep(prev => prev + 1)} className="bg-[#5932EA] hover:bg-[#4A28C7] text-white h-11 px-10 font-bold" disabled={currentStep === 1 && !customerData.name}>Continuar</Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white h-11 px-10 font-bold shadow-lg shadow-green-100">
                        {isSubmitting ? "Finalizando..." : "Finalizar Pedido"}
                    </Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};