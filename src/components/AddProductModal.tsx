// src/components/AddProductModal.tsx
import React, { useState } from 'react';
import { useData, NewProductPayload } from '../context/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, X, DollarSign, Package, Tag } from 'lucide-react';

interface AddProductModalProps { isOpen: boolean; onClose: () => void; }

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useData();
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', purchase_price: '', stock_quantity: '', sku: '', supplier: '', category: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      toast.error("Preencha o nome e o preço de venda.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addProduct({
        ...formData,
        price: Number(formData.price),
        purchase_price: formData.purchase_price ? Number(formData.purchase_price) : undefined,
        stock_quantity: Number(formData.stock_quantity) || 0,
      } as any);
      handleClose();
    } catch (error) { toast.error("Erro ao adicionar produto."); }
    finally { setIsSubmitting(false); }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', price: '', purchase_price: '', stock_quantity: '', sku: '', supplier: '', category: '' });
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#5932EA] flex items-center gap-2 text-xl">
            <Package className="w-6 h-6" /> Novo Produto
          </DialogTitle>
          <DialogDescription>Cadastre um novo item no estoque com margem de lucro calculada.</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Nome do Produto</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Camiseta Evolux" />
            </div>
            <div className="space-y-1">
              <Label>Descrição (Opcional)</Label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detalhes do produto..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>SKU</Label>
                <Input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="EVX-001" />
              </div>
              <div className="space-y-1">
                <Label>Categoria</Label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Roupas" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[#5932EA] font-bold">Preço de Venda (R$)</Label>
                <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" className="border-[#5932EA]/30 focus:border-[#5932EA]" />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-500">Preço de Custo (R$)</Label>
                <Input type="number" value={formData.purchase_price} onChange={e => setFormData({...formData, purchase_price: e.target.value})} placeholder="0.00" />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label>Estoque Inicial</Label>
              <Input type="number" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} placeholder="0" />
            </div>

            <div className="space-y-1">
              <Label>Fornecedor</Label>
              <Input value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} placeholder="Nome do fornecedor" />
            </div>

            {formData.price && formData.purchase_price && (
               <div className="bg-green-50 p-3 rounded-lg border border-green-100 mt-2">
                  <p className="text-xs text-green-700 font-medium">Margem Estimada</p>
                  <p className="text-lg font-bold text-green-800">
                    R$ {(Number(formData.price) - Number(formData.purchase_price)).toFixed(2)} 
                    <span className="text-sm font-normal ml-2 text-green-600">
                      ({(((Number(formData.price) - Number(formData.purchase_price)) / Number(formData.price)) * 100).toFixed(1)}%)
                    </span>
                  </p>
               </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#5932EA] hover:bg-[#4A28C7] text-white">
            {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};