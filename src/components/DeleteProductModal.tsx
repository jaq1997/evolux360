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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription className="pt-2">
            Você tem certeza que deseja excluir o produto <strong>{product.name}</strong>? Esta ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
            {isSubmitting ? 'Excluindo...' : 'Sim, excluir produto'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};