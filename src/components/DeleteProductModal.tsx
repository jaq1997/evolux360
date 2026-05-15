// src/components/DeleteProductModal.tsx - VERSÃO CORRIGIDA E FUNCIONAL

import React, { useState } from 'react';
import { useData, Product } from '../context/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({ isOpen, onClose, product }) => {
  const { deleteProduct } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!product) {
      toast.error("Nenhum produto selecionado para excluir.");
      return;
    }

    setIsSubmitting(true);

    try {
      await deleteProduct(product.id);
      onClose();
    } catch (error) {
      console.error("Falha ao excluir produto no componente:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-6 text-center [&>button]:right-4 [&>button]:top-4">
        <div className="flex flex-col items-center justify-center space-y-4 pt-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
             <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">Confirmar Exclusão</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 max-w-[280px] mx-auto">
            Você tem certeza que deseja excluir o produto <strong className="text-gray-800">{product.name}</strong>? Esta ação não poderá ser desfeita.
          </DialogDescription>
        </div>
        <div className="flex gap-3 w-full mt-6">
          <Button variant="outline" onClick={onClose} className="w-full border-gray-300">Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting} className="w-full bg-red-500 hover:bg-red-600 text-white">
            {isSubmitting ? 'Excluindo...' : 'Sim, excluir'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};