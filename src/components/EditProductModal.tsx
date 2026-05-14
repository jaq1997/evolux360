// src/components/EditProductModal.tsx
import React, { useState, useEffect } from 'react';
import { useData, Product, UpdateProductPayload } from '../context/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Package, X, Image as ImageIcon } from 'lucide-react';

interface EditProductModalProps { isOpen: boolean; onClose: () => void; product: Product; }

export const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product }) => {
  const { updateProduct } = useData();
  const [formData, setFormData] = useState<any>({
    name: '', description: '', price: '', purchase_price: '', stock_quantity: '', sku: '', supplier: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        purchase_price: product.purchase_price || '',
        stock_quantity: product.stock_quantity || '',
        sku: product.sku || '',
        supplier: product.supplier || ''
      });
    }
  }, [product]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateProduct(product.id, {
        ...formData,
        price: Number(formData.price),
        purchase_price: Number(formData.purchase_price),
        stock_quantity: Number(formData.stock_quantity)
      } as any);
      onClose();
    } catch (error) { toast.error("Erro ao atualizar produto."); }
    finally { setIsSubmitting(false); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#5932EA] flex items-center gap-2">
            <Package className="w-5 h-5" /> Editar Produto
          </DialogTitle>
          <DialogDescription>Altere as informações do produto e valores de mercado.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <Label>Descrição</Label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} />
            </div>
            <div className="space-y-1">
              <Label>SKU</Label>
              <Input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[#5932EA] font-bold">Venda (R$)</Label>
                <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label>Custo (R$)</Label>
                <Input type="number" value={formData.purchase_price} onChange={e => setFormData({...formData, purchase_price: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Estoque</Label>
              <Input type="number" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
            </div>
            <div className="space-y-1">
              <Label>Fornecedor</Label>
              <Input value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
            </div>
            
            <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ImageIcon className="text-gray-400" />
                    <span className="text-sm text-gray-600">Imagem do produto</span>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500"><X className="w-4 h-4 mr-1" /> Remover</Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#5932EA] hover:bg-[#4A28C7] text-white">
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};