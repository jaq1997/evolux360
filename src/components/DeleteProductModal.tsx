// src/components/DeleteProductModal.tsx - VERSÃO FINAL (Corrigida)

import { useData, Product } from '../context/DataContext';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";

export const DeleteProductModal = ({ isOpen, onClose, product }: { isOpen: boolean; onClose: () => void; product: Product }) => {
  const { deleteProduct } = useData();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      toast({ title: "Sucesso!", description: "Produto removido com sucesso." });
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível remover o produto." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          <DialogTitle className="text-2xl font-bold">Confirmar Exclusão</DialogTitle>
          <DialogDescription className="text-base">
            Tem certeza que deseja excluir "{product.name}"?
            <br />
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row sm:justify-center gap-2">
          <Button variant="outline" onClick={onClose} className="w-full">Cancelar</Button>
          <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white w-full">Remover produto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};