// src/components/EditProductModal.tsx - VERSÃO FINAL (Corrigida)

import { useState, useEffect } from "react";
// ✅ CORREÇÃO: Usando o tipo UpdateProductPayload corretamente
import { useData, UpdateProductPayload, Product } from '../context/DataContext';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export const EditProductModal = ({ isOpen, onClose, product }: { isOpen: boolean; onClose: () => void; product: Product }) => {
  const { updateProduct } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<UpdateProductPayload>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'price' || name === 'cost' || name === 'stock_quantity') ? parseFloat(value) || null : value 
    }));
  };
  
  const handleSubmit = async () => {
    try {
      await updateProduct(product.id, formData);
      toast({ title: "Sucesso!", description: "Produto atualizado com sucesso." });
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar o produto." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Editar Produto</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
             <img src={formData.image_url || '/placeholder.svg'} alt={formData.name || ''} className="w-24 h-24 rounded-md object-cover mb-4" />
            <Button variant="outline">Alterar Imagem</Button>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="name">Nome do Produto</Label><Input id="name" name="name" value={formData.name || ''} onChange={handleChange} /></div>
              <div><Label htmlFor="sku">SKU</Label><Input id="sku" name="sku" value={formData.sku || ''} onChange={handleChange} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="cost">Custo de aquisição</Label><Input id="cost" name="cost" type="number" value={formData.cost || ''} onChange={handleChange} /></div>
              <div><Label htmlFor="price">Preço de Venda</Label><Input id="price" name="price" type="number" value={formData.price || ''} onChange={handleChange} /></div>
            </div>
            <div><Label htmlFor="stock_quantity">Quantidade em estoque</Label><Input id="stock_quantity" name="stock_quantity" type="number" value={formData.stock_quantity || ''} onChange={handleChange} /></div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="category">Categoria</Label><Input id="category" name="category" value={formData.category || ''} onChange={handleChange} /></div>
                <div><Label htmlFor="brand">Marca</Label><Input id="brand" name="brand" value={formData.brand || ''} onChange={handleChange} /></div>
            </div>
            <div><Label htmlFor="supplier">Fornecedor Principal</Label><Input id="supplier" name="supplier" value={formData.supplier || ''} onChange={handleChange} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost">Salvar como rascunho</Button>
          <Button onClick={handleSubmit} className="bg-[#5932EA] hover:bg-[#4A28C7]">Atualizar Produto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};