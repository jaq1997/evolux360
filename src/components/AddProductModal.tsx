// src/components/AddProductModal.tsx
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface AddProductModalProps { isOpen: boolean; onClose: () => void; }

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useData();
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', purchase_price: '', stock_quantity: '', sku: '', supplier: '', category: ''
  });
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
    } catch (error) { 
      toast.error("Erro ao adicionar produto."); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', price: '', purchase_price: '', stock_quantity: '', sku: '', supplier: '', category: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] !border-none shadow-2xl outline-none p-0 overflow-hidden flex flex-col [&>button]:text-white [&>button]:top-4 [&>button]:right-4">
        <div className="bg-[#5932EA] p-4 shrink-0">
          <DialogTitle className="text-white text-xl font-medium">Adicionar Novo Produto</DialogTitle>
          <DialogDescription className="hidden">Cadastre um novo produto no sistema.</DialogDescription>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Coluna Esquerda */}
            <div className="space-y-6">
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => document.getElementById('product-image-upload')?.click()}>
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Enviar Foto do Produto</span>
                <input id="product-image-upload" type="file" className="hidden" accept="image/*" onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                     toast.success("Foto selecionada com sucesso! (Upload em breve)");
                  }
                }} />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Nome do Produto</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Camiseta Nike Dri-FIT" className="border-gray-200 focus-visible:ring-[#5932EA]" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">SKU / Código</Label>
                <Input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="EX: NK-001-PT" className="border-gray-200 focus-visible:ring-[#5932EA]" />
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Preço de Venda (R$)</Label>
                  <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0,00" className="border-gray-200 focus-visible:ring-[#5932EA]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Preço de Custo (R$)</Label>
                  <Input type="number" value={formData.purchase_price} onChange={e => setFormData({...formData, purchase_price: e.target.value})} placeholder="0,00" className="border-gray-200 focus-visible:ring-[#5932EA]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Estoque Inicial</Label>
                <Input type="number" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} placeholder="0" className="border-gray-200 focus-visible:ring-[#5932EA]" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Categoria</Label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Ex: Vestuário" className="border-gray-200 focus-visible:ring-[#5932EA]" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-[#5932EA] font-semibold uppercase tracking-wider">Fornecedor</Label>
                <Input value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} placeholder="Nome do fornecedor" className="border-gray-200 focus-visible:ring-[#5932EA]" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-gray-50 border-t flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleClose} className="h-11 px-6">Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-[#5932EA] hover:bg-[#4A28C7] text-white h-11 px-10 font-bold">
            {isSubmitting ? "Cadastrando..." : "Cadastrar Produto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};