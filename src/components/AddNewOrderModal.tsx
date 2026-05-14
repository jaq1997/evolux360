// src/components/AddNewOrderModal.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, Plus, Minus, User, Package, CreditCard, ShoppingCart, Trash2 } from 'lucide-react';
import { useData, Product, NewOrderFormData, Address as AddressType, OrderItem as OrderItemType } from '../context/DataContext';
import { toast } from 'sonner';

interface AddNewOrderModalProps { isOpen: boolean; onClose: () => void; }

export const AddNewOrderModal: React.FC<AddNewOrderModalProps> = ({ isOpen, onClose }) => {
  const { products, createOrder } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
    
    const result = await createOrder(newOrderData);
    if (result) {
      handleClose();
    }
    setIsSubmitting(false);
  };

  const addProduct = (p: Product) => {
    const existing = selectedProducts.find(item => item.product_id === p.id);
    if (existing) {
      setSelectedProducts(selectedProducts.map(item => item.product_id === p.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setSelectedProducts([...selectedProducts, { product_id: p.id, product_name: p.name, quantity: 1, price: p.price || 0 }]);
    }
    toast.success(`${p.name} adicionado!`);
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(item => item.product_id !== productId));
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#5932EA] flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" /> Novo Pedido - Etapa {currentStep} de 3
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2 border-b pb-1">
                <User className="w-5 h-5 text-[#5932EA]" /> Dados do Cliente
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Nome Completo</Label>
                  <Input value={customerData.name} onChange={e => setCustomerData({...customerData, name: e.target.value})} placeholder="Nome do cliente" />
                </div>
                <div className="space-y-1">
                  <Label>E-mail</Label>
                  <Input type="email" value={customerData.email} onChange={e => setCustomerData({...customerData, email: e.target.value})} placeholder="email@exemplo.com" />
                </div>
                <div className="space-y-1">
                  <Label>Telefone</Label>
                  <Input value={customerData.phone} onChange={e => setCustomerData({...customerData, phone: e.target.value})} placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-1">
                  <Label>Origem do Pedido</Label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Loja Física">Loja Física</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mt-6 border-b pb-1">
                <Package className="w-5 h-5 text-[#5932EA]" /> Endereço de Entrega
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <Label>Rua</Label>
                  <Input value={customerData.address.street} onChange={e => setCustomerData({...customerData, address: {...customerData.address, street: e.target.value}})} />
                </div>
                <div className="space-y-1">
                  <Label>Número</Label>
                  <Input value={customerData.address.number} onChange={e => setCustomerData({...customerData, address: {...customerData.address, number: e.target.value}})} />
                </div>
                <div className="space-y-1">
                  <Label>Bairro</Label>
                  <Input value={customerData.address.neighborhood} onChange={e => setCustomerData({...customerData, address: {...customerData.address, neighborhood: e.target.value}})} />
                </div>
                <div className="space-y-1">
                  <Label>Cidade</Label>
                  <Input value={customerData.address.city} onChange={e => setCustomerData({...customerData, address: {...customerData.address, city: e.target.value}})} />
                </div>
                <div className="space-y-1">
                  <Label>CEP</Label>
                  <Input value={customerData.address.zip_code} onChange={e => setCustomerData({...customerData, address: {...customerData.address, zip_code: e.target.value}})} />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 border-b pb-1">
                    <Search className="w-5 h-5 text-[#5932EA]" /> Buscar Produtos
                  </div>
                  <Input placeholder="Pesquisar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                    {filteredProducts.map(p => (
                      <div key={p.id} className="p-3 flex justify-between items-center hover:bg-gray-50 border-b last:border-0">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-gray-500">R$ {p.price?.toFixed(2)} | Estoque: {p.stock_quantity}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-[#5932EA]" onClick={() => addProduct(p)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 border-b pb-1">
                    <ShoppingCart className="w-5 h-5 text-[#5932EA]" /> Itens do Pedido
                  </div>
                  <div className="border rounded-lg min-h-[100px] bg-gray-50/50 p-2">
                    {selectedProducts.length === 0 ? (
                      <p className="text-center text-gray-400 py-8 text-sm">Nenhum produto adicionado</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedProducts.map(item => (
                          <div key={item.product_id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                            <div className="text-sm">
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-gray-500">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                            </div>
                            <Button size="icon" variant="ghost" className="text-red-500 h-8 w-8" onClick={() => removeProduct(item.product_id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right pt-2 border-t">
                    <p className="text-lg font-bold text-[#5932EA]">Total: R$ {subtotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 border-b pb-1">
                <CreditCard className="w-5 h-5 text-[#5932EA]" /> Pagamento
              </div>
              <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:border-[#5932EA] cursor-pointer">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="cursor-pointer">PIX</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:border-[#5932EA] cursor-pointer">
                  <RadioGroupItem value="credit_card" id="cc" />
                  <Label htmlFor="cc" className="cursor-pointer">Cartão de Crédito</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:border-[#5932EA] cursor-pointer">
                  <RadioGroupItem value="debit_card" id="dc" />
                  <Label htmlFor="dc" className="cursor-pointer">Cartão de Débito</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:border-[#5932EA] cursor-pointer">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="cursor-pointer">Dinheiro</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:border-[#5932EA] cursor-pointer">
                  <RadioGroupItem value="bank_transfer" id="bt" />
                  <Label htmlFor="bt" className="cursor-pointer">Transferência</Label>
                </div>
              </RadioGroup>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h4 className="font-bold text-[#5932EA] mb-4">Resumo do Pedido</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between"><span>Cliente:</span> <span className="font-medium">{customerData.name || 'Não informado'}</span></p>
                  <p className="flex justify-between"><span>Origem:</span> <span className="font-medium">{origin}</span></p>
                  <p className="flex justify-between border-t pt-2 mt-2"><span>Subtotal:</span> <span className="font-medium">R$ {subtotal.toFixed(2)}</span></p>
                  <p className="flex justify-between text-lg font-bold text-[#5932EA]"><span>Total:</span> <span>R$ {subtotal.toFixed(2)}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center border-t pt-4">
          <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>Anterior</Button>
            )}
            {currentStep < 3 ? (
              <Button onClick={() => setCurrentStep(prev => prev + 1)} className="bg-[#5932EA] hover:bg-[#4C2CA9] text-white">
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#5932EA] hover:bg-[#4C2CA9] text-white">
                {isSubmitting ? 'Finalizando...' : 'Finalizar Pedido'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};