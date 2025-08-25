// src/components/AddNewOrderModal.tsx - VERSÃO FINAL E DEFINITIVA

import React, { useState, useEffect, useCallback } from 'react';
import { useData, Order, Product, OrderStatus } from '../context/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from './ui/scroll-area';

const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
    {children}
  </div>
);

export function AddNewOrderModal({ isOpen, onClose, orderToEdit }: { isOpen: boolean, onClose: () => void, orderToEdit: Order | null }) {
  const { createOrder, updateOrder, searchProducts } = useData();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined);
  const [totalPrice, setTotalPrice] = useState('');
  const [status, setStatus] = useState<OrderStatus>('novo_pedido');
  const [origin, setOrigin] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [discount, setDiscount] = useState(''); // ✅ ADICIONADO: Estado para o desconto
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!orderToEdit;

  const fetchInitialProducts = useCallback(async () => {
    const initialProducts = await searchProducts('');
    setProducts(initialProducts);
  }, [searchProducts]);

  useEffect(() => {
    fetchInitialProducts();

    if (isEditMode && orderToEdit) {
      const [fName, ...lNameParts] = (orderToEdit.description?.split(',')[0]?.replace('Cliente:', '').trim() || '').split(' ');
      setFirstName(fName || '');
      setLastName(lNameParts.join(' ') || '');
      setSelectedProductId(orderToEdit.product_id?.toString());
      setTotalPrice(orderToEdit.total_price?.toString() || '');
      setStatus(orderToEdit.status || 'novo_pedido');
      setOrigin(orderToEdit.origin || '');
      setNotes(orderToEdit.notes || '');
      setPaymentMethod(orderToEdit.payment_method || '');
      // ✅ AQUI VOCÊ PODE ADICIONAR A LÓGICA PARA RECUPERAR O DESCONTO SE NECESSÁRIO
    } else {
      setFirstName('');
      setLastName('');
      setSelectedProductId(undefined);
      setTotalPrice('');
      setStatus('novo_pedido');
      setOrigin('');
      setNotes('');
      setPaymentMethod('');
      setDiscount(''); // ✅ ADICIONADO
    }
  }, [isEditMode, orderToEdit, fetchInitialProducts]);
  
  // ✅ FUNÇÃO PARA LIDAR COM A SELEÇÃO DO PRODUTO E AJUSTAR O PREÇO
  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const selectedProduct = products.find(p => p.id.toString() === productId);
    if (selectedProduct) {
      const productPrice = selectedProduct.price || 0;
      const appliedDiscount = parseFloat(discount) || 0;
      const finalPrice = productPrice - appliedDiscount;
      setTotalPrice(finalPrice.toFixed(2));
    } else {
      setTotalPrice('');
    }
  };
  
  // ✅ FUNÇÃO PARA LIDAR COM O DESCONTO E ATUALIZAR O PREÇO TOTAL
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDiscount = e.target.value;
    setDiscount(newDiscount);
    const selectedProduct = products.find(p => p.id.toString() === selectedProductId);
    if (selectedProduct) {
      const productPrice = selectedProduct.price || 0;
      const appliedDiscount = parseFloat(newDiscount) || 0;
      const finalPrice = productPrice - appliedDiscount;
      setTotalPrice(finalPrice.toFixed(2));
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !totalPrice || !selectedProductId || !paymentMethod) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, sobrenome, produto, valor e forma de pagamento.",
      });
      return;
    }
  
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ variant: "destructive", title: "Erro de Autenticação", description: "Você precisa estar logado para realizar esta ação." });
      setIsSubmitting(false);
      return;
    }

    const selectedProduct = products.find(p => p.id.toString() === selectedProductId);
    const description = `Cliente: ${firstName} ${lastName}, Produto: ${selectedProduct?.name || 'N/A'}`;
    
    const commonData = {
      customer_id: user.id,
      user_id: user.id,
      description,
      total_price: parseFloat(totalPrice) || 0,
      status,
      origin: origin || null,
      notes: notes || null,
      product_id: selectedProductId ? parseInt(selectedProductId) : null,
      payment_method: paymentMethod,
    };

    try {
      if (isEditMode && orderToEdit) {
        await updateOrder(orderToEdit.id, commonData);
        toast({ title: "Sucesso!", description: "Pedido atualizado com sucesso." });
      } else {
        await createOrder(commonData);
        toast({ title: "Sucesso!", description: "Novo pedido criado com sucesso." });
      }
      onClose();
    } catch (error: unknown) {
      let errorMessage = "Não foi possível salvar o pedido.";
      if (error instanceof Error) {
        errorMessage += ` ${error.message}`;
      }
      toast({ variant: "destructive", title: "Erro!", description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isEditMode && orderToEdit ? `Editar Pedido #${orderToEdit.id}` : 'Adicionar Novo Pedido'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] p-1">
          <div className="space-y-4 pr-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nome"><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></FormField>
              <FormField label="Sobrenome"><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></FormField>
            </div>
            <FormField label="Selecione o produto">
              {/* ✅ MUDANÇA: usa a nova função handleProductChange */}
              <Select value={selectedProductId} onValueChange={handleProductChange}>
                <SelectTrigger><SelectValue placeholder="Selecione ou busque um produto..." /></SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id.toString()}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              {/* ✅ CAMPO DE DESCONTO ADICIONADO */}
              <FormField label="Desconto (R$)"><Input type="number" value={discount} onChange={handleDiscountChange} /></FormField>
              <FormField label="Valor do pedido (R$)"><Input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} /></FormField>
            </div>
            <FormField label="Status do pedido">
              <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo_pedido">Novo Pedido</SelectItem>
                  <SelectItem value="a_separar">A Separar</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Canal de vendas">
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Loja Física">Loja Física</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Forma de Pagamento">
              {/* ✅ MUDANÇA: Input substituído por Select */}
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
            <FormField label="Informações adicionais">
              <Textarea placeholder="Detalhes extras, observações para entrega, etc." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </FormField>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-[#5932EA] hover:bg-[#4C2CA9] text-white">
            {isSubmitting ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Adicionar Pedido')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewOrderModal;