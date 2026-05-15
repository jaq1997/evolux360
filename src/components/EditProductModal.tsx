// src/components/EditProductModal.tsx
import React, { useState, useEffect } from 'react';
import { useData, Product } from '../context/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface EditProductModalProps { isOpen: boolean; onClose: () => void; product: Product; }

export const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product }) => {
  const { updateProduct } = useData();
  const [formData, setFormData] = useState({
    name: '', price: '', purchase_price: '', stock_quantity: '', sku: '', supplier: '', category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        purchase_price: (product as any).purchase_price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        sku: product.sku || '',
        supplier: product.supplier || '',
        category: product.category || ''
      });
    }
  }, [product]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      toast.error("Preencha o nome e o preço.");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProduct(product.id, {
        ...formData,
        price: Number(formData.price),
        purchase_price: Number(formData.purchase_price),
        stock_quantity: Number(formData.stock_quantity)
      } as any);
      toast.success("Produto atualizado com sucesso!");
      onClose();
    } catch (error) { 
      toast.error("Erro ao atualizar produto."); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] border-none outline-none p-0 overflow-hidden flex flex-col [&>button]:text-white [&>button]:top-4 [&>button]:right-4">
        <div className="bg-[#5932EA] p-4 shrink-0">
          <DialogTitle className="text-white text-xl font-medium">Editar Produto</DialogTitle>
          <DialogDescription className="hidden">Altere as informações do produto selecionado.</DialogDescription>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-gray-100 transition-colors">
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Alterar Foto do Produto</span>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Nome do Produto</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border-gray-200 focus-visible:ring-[#5932EA]" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">SKU</Label>
                <Input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="border-gray-200 focus-visible:ring-[#5932EA]" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Preço de Venda (R$)</Label>
                  <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="border-gray-200 focus-visible:ring-[#5932EA]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Preço de Custo (R$)</Label>
                  <Input type="number" value={formData.purchase_price} onChange={e => setFormData({...formData, purchase_price: e.target.value})} className="border-gray-200 focus-visible:ring-[#5932EA]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Quantidade em Estoque</Label>
                <Input type="number" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} className="border-gray-200 focus-visible:ring-[#5932EA]" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Categoria</Label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="border-gray-200 focus-visible:ring-[#5932EA]" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Fornecedor</Label>
                <Input value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="border-gray-200 focus-visible:ring-[#5932EA]" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-gray-50 border-t flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="h-11 px-6">Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#5932EA] hover:bg-[#4A28C7] text-white h-11 px-10 font-bold">
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};