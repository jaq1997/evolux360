// src/components/AddProductModal.tsx - VERSÃO FINAL (Corrigida)

import { useState } from "react";
import { useData, NewProductPayload } from '../context/DataContext';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Image as ImageIcon } from "lucide-react";

export const AddProductModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { createProduct } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<NewProductPayload>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async () => {
    if (!formData.name || !formData.sku || !formData.price || !formData.stock_quantity) {
      toast({ variant: "destructive", title: "Erro", description: "Preencha todos os campos obrigatórios." });
      return;
    }

    try {
      await createProduct(formData as NewProductPayload);
      toast({ title: "Sucesso!", description: "Produto adicionado com sucesso." });
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível adicionar o produto." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Adicionar novo produto</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
            <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
            <Button variant="outline">Adicionar Imagem</Button>
            <p className="text-xs text-gray-500 mt-2">Arraste e solte ou clique</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="name">Nome do Produto</Label><Input id="name" name="name" onChange={handleChange} /></div>
              <div><Label htmlFor="sku">SKU</Label><Input id="sku" name="sku" onChange={handleChange} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="cost">Custo de aquisição</Label><Input id="cost" name="cost" type="number" onChange={handleChange} /></div>
              <div><Label htmlFor="price">Preço de Venda</Label><Input id="price" name="price" type="number" onChange={handleChange} /></div>
            </div>
            <div><Label htmlFor="stock_quantity">Quantidade em estoque</Label><Input id="stock_quantity" name="stock_quantity" type="number" onChange={handleChange} /></div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="category">Categoria</Label><Input id="category" name="category" onChange={handleChange} /></div>
                <div><Label htmlFor="brand">Marca</Label><Input id="brand" name="brand" onChange={handleChange} /></div>
            </div>
            <div><Label htmlFor="supplier">Fornecedor Principal</Label><Input id="supplier" name="supplier" onChange={handleChange} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost">Salvar como rascunho</Button>
          <Button onClick={handleSubmit} className="bg-[#5932EA] hover:bg-[#4A28C7]">Adicionar Novo Produto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};