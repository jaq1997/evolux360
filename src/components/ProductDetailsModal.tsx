// src/components/ProductDetailsModal.tsx - NOVO COMPONENTE

import { useState, useMemo } from 'react';
import { Product } from '../context/DataContext';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EditProductModal } from './EditProductModal';

export const ProductDetailsModal = ({ isOpen, onClose, product }: { isOpen: boolean; onClose: () => void; product: Product }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    onClose(); // Fecha o modal de detalhes também
  };

  const formattedPrice = product.price?.toFixed(2).replace('.', ',') || '0,00';
  const formattedCost = product.cost?.toFixed(2).replace('.', ',') || '0,00';
  const formattedDate = product.created_at ? format(new Date(product.created_at), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
            <DialogDescription>
              SKU: {product.sku}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div className="flex flex-col items-center justify-center">
              <img src={product.image_url || '/placeholder.svg'} alt={product.name || 'Produto'} className="w-full h-auto rounded-md object-cover" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>**Preço de Venda:**</span>
                <span>R$ {formattedPrice}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Custo:</span>
                <span>R$ {formattedCost}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Marca:</span>
                <span>{product.brand || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Categoria:</span>
                <span>{product.category || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Estoque:</span>
                <span>{product.stock_quantity || '0'} unidades</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Fornecedor:</span>
                <span>{product.supplier || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Criado em:</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-bold mb-2">Descrição</h4>
            <p className="text-sm text-gray-700">{product.description || 'Nenhuma descrição disponível.'}</p>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={handleEditClick} className="bg-[#5932EA] hover:bg-[#4A28C7]">
              Editar Produto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {isEditModalOpen && (
        <EditProductModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} product={product} />
      )}
    </>
  );
};