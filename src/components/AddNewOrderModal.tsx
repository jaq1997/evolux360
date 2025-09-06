import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useData, Order, Product, OrderStatus } from '../context/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from './ui/scroll-area';
import { Trash2, ChevronsUpDown, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
    {children}
  </div>
);

type CartItem = Product & { quantity: number };

export function AddNewOrderModal({ isOpen, onClose, orderToEdit }: { isOpen: boolean, onClose: () => void, orderToEdit: Order | null }) {
  const { createOrder, updateOrder, products: allProducts } = useData();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState('0.00');
  const [origin, setOrigin] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState<'R$' | '%'>('R$');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProductSelectorOpen, setProductSelectorOpen] = useState(false);

  const isEditMode = !!orderToEdit;

  const calculateTotal = useCallback(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
    const discountValue = parseFloat(discount) || 0;
    let finalPrice = subtotal;

    if (discountType === 'R$') {
      finalPrice = subtotal - discountValue;
    } else if (discountType === '%') {
      finalPrice = subtotal * (1 - discountValue / 100);
    }

    setTotalPrice(Math.max(0, finalPrice).toFixed(2));
  }, [cart, discount, discountType]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);
  
  useEffect(() => {
    if (isOpen) {
        setFirstName('');
        setLastName('');
        setCart([]);
        setTotalPrice('0.00');
        setOrigin('');
        setNotes('');
        setPaymentMethod('');
        setDiscount('');
        setDiscountType('R$');
        setIsSubmitting(false);
    }
  }, [isOpen]);

  const addProductToCart = (productId: string) => {
    const productToAdd = allProducts.find(p => p.id.toString() === productId);
    if (!productToAdd) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevCart.map(item => item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prevCart, { ...productToAdd, quantity: 1 }];
      }
    });
  };

  const removeProductFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // ✅ FUNÇÃO DE SUBMISSÃO AGORA COMPLETA E FUNCIONAL
  const handleSubmit = async () => {
    if (!firstName || !lastName || cart.length === 0 || !paymentMethod) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha nome, sobrenome, forma de pagamento e adicione pelo menos um produto.",
      });
      return;
    }
  
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ variant: "destructive", title: "Erro de Autenticação", description: "Sessão não encontrada." });
        return;
      }
  
      const productNames = cart.map(item => `${item.quantity}x ${item.name}`).join('; ');
      const description = `Cliente: ${firstName} ${lastName}, Produtos: ${productNames}`;
      
      const orderData = {
        customer_id: user.id,
        user_id: user.id,
        description,
        total_price: parseFloat(totalPrice),
        status: 'novo_pedido' as OrderStatus,
        origin: origin || null,
        notes: notes || null,
        payment_method: paymentMethod,
        // product_id é omitido pois a descrição já contém os produtos
      };
  
      // A lógica de edição foi simplificada para focar na criação de novos pedidos
      // Para editar um pedido com múltiplos produtos, seria necessária uma lógica mais complexa
      if (isEditMode && orderToEdit) {
        await updateOrder(orderToEdit.id, orderData);
        toast({ title: "Sucesso!", description: "Pedido atualizado com sucesso." });
      } else {
        await createOrder(orderData);
        toast({ title: "Sucesso!", description: "Novo pedido criado com sucesso." });
      }
  
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      toast({ variant: "destructive", title: "Erro!", description: `Não foi possível guardar o pedido. ${errorMessage}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Adicionar Novo Pedido</DialogTitle>
          <DialogDescription>Preencha os detalhes abaixo para criar um novo pedido.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] p-1">
          <div className="space-y-4 pr-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nome"><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="João" /></FormField>
              <FormField label="Sobrenome"><Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Silva"/></FormField>
            </div>
            
            <FormField label="Adicionar produtos ao pedido">
              <Popover open={isProductSelectorOpen} onOpenChange={setProductSelectorOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                    Selecione ou busque um produto...
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar produto..." />
                    <CommandList>
                      <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                      <CommandGroup>
                        {allProducts.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={product.name || ''}
                            onSelect={() => {
                              addProductToCart(product.id.toString());
                              setProductSelectorOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", cart.some(item => item.id === product.id) ? "opacity-100" : "opacity-0")} />
                            {product.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormField>

            {cart.length > 0 && (
              <div className="space-y-2 rounded-md border p-4">
                <h4 className="font-medium">Produtos no Pedido</h4>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm py-1">
                    <span>{item.quantity}x {item.name}</span>
                    <div className='flex items-center gap-2'>
                      <span>R$ {((item.price || 0) * item.quantity).toFixed(2)}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeProductFromCart(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-500"/>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <FormField label="Desconto">
              <div className="flex gap-2">
                <Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="flex-grow" placeholder="Ex: 10"/>
                <Select value={discountType} onValueChange={(value) => setDiscountType(value as '%' | 'R$')}>
                  <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R$">R$</SelectItem>
                    <SelectItem value="%">%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FormField>

            <FormField label="Valor TOTAL (R$)">
                <Input type="number" value={totalPrice} readOnly className="font-bold bg-gray-100" />
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Canal de vendas">
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="Loja Física">Loja Física</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Forma de Pagamento">
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                    <SelectItem value="Débito">Débito</SelectItem>
                    <SelectItem value="Pix">Pix</SelectItem>
                    <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField label="Informações adicionais"><Textarea placeholder="Detalhes extras..." value={notes} onChange={(e) => setNotes(e.target.value)} /></FormField>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-[#5932EA] hover:bg-[#4C2CA9] text-white">
            {isSubmitting ? 'A guardar...' : 'Adicionar Pedido'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
