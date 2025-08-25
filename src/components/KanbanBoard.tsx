// src/components/KanbanBoard.tsx - VERSÃO FINAL COM CORREÇÃO NO handleDragEnd

import React, { useState, useMemo } from 'react';
import { DndContext, useDraggable, useDroppable, closestCorners, DragEndEvent } from '@dnd-kit/core';
import { Button } from './ui/button';
import { ExternalLink, Trash2, AlertTriangle } from 'lucide-react';
// ✅ 1. IMPORTAR O TIPO 'OrderStatus'
import { Order, useData, OrderStatus } from '../context/DataContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

// ===================================================================
// KANBAN CARD (Sem alterações)
// ===================================================================
function KanbanCard({ card, onCardClick }: { card: Order, onCardClick: (card: Order) => void }) {
  const { cancelOrder } = useData();
  const { toast } = useToast();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: card.id });
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 999 } : undefined;

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCancelModalOpen(true);
  };

  const confirmCancel = () => {
    cancelOrder(card.id)
      .then(() => {
        toast({ title: "Pedido Cancelado!", description: `O Pedido #${card.id} foi movido para o histórico.` });
        setIsCancelModalOpen(false);
      })
      .catch((error) => toast({ variant: "destructive", title: "Erro!", description: `Não foi possível cancelar o pedido. ${error.message}` }));
  };

  const productName = card.description?.split(',')[1]?.trim() || 'Produto';

  return (
    <>
      <div ref={setNodeRef} style={style} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-left w-full">
        <div className="flex justify-between items-start gap-2">
          <div {...listeners} {...attributes} className="cursor-grab flex-grow min-w-0">
            <h4 className="font-semibold text-sm text-gray-800 mb-1">Pedido #{card.id}</h4>
            <p className="text-xs text-gray-500 truncate" title={productName}>{productName}</p>
          </div>
          <div className="flex items-center flex-shrink-0">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500" onClick={() => onCardClick(card)}>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={handleCancelClick}>
                <Trash2 className="h-4 w-4" />
              </Button>
          </div>
        </div>
      </div>
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" />Confirmar Cancelamento</DialogTitle>
            <DialogDescription>Você tem certeza que deseja cancelar o <strong>Pedido #{card.id}</strong>? Ele será removido do Kanban e movido para o histórico.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>Voltar</Button>
            <Button variant="destructive" onClick={confirmCancel}>Sim, cancelar pedido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ===================================================================
// KANBAN COLUMN (Sem alterações)
// ===================================================================
function KanbanColumn({ id, title, children }: { id: string, title: string, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="bg-gray-100/80 p-4 rounded-xl w-full flex flex-col">
      <h3 className="font-bold text-gray-700 mb-4 px-1">{title}</h3>
      <div className="min-h-[200px] space-y-3 flex-grow">
        {children}
      </div>
    </div>
  );
}

// ===================================================================
// KANBAN BOARD (COMPONENTE PRINCIPAL)
// ===================================================================
const KanbanBoard = ({ onCardClick }: { onCardClick: (card: Order) => void }) => {
  const { orders, setOrders, updateOrderStatus } = useData();

  const activeOrders = useMemo(() => {
    const activeStatuses: OrderStatus[] = ['novo_pedido', 'a_separar', 'enviado', 'separado', 'a_enviar'];
    return orders.filter(order => order.status && activeStatuses.includes(order.status));
  }, [orders]);

  const groupedOrders = useMemo(() => {
    const columns: Record<string, Order[]> = { 'novo_pedido': [], 'a_separar': [], 'enviado': [] };
    (activeOrders || []).forEach((order) => {
      if (order.status && columns[order.status]) {
        columns[order.status].push(order);
      }
    });
    return columns;
  }, [activeOrders]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const orderId = Number(active.id);
    // ✅ 2. A CORREÇÃO ESTÁ AQUI
    // Garantimos que o ID da coluna de destino seja tratado como um 'OrderStatus'
    const newStatus = over.id as OrderStatus;

    // Atualização otimista da UI (move o card imediatamente)
    setOrders((currentOrders) => {
      const activeOrderIndex = currentOrders.findIndex((o) => o.id === orderId);
      if (activeOrderIndex === -1) return currentOrders;
      
      // Cria uma cópia do pedido e atualiza o status
      const updatedOrder = { ...currentOrders[activeOrderIndex], status: newStatus };
      
      // Cria uma nova lista com o pedido atualizado
      const newOrders = [...currentOrders];
      newOrders[activeOrderIndex] = updatedOrder;
      
      return newOrders;
    });

    // Envia a atualização para o banco de dados em segundo plano
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn id="novo_pedido" title={`Novo Pedido (${groupedOrders['novo_pedido']?.length || 0})`}>
            {groupedOrders['novo_pedido']?.map((card) => (<KanbanCard key={card.id} card={card} onCardClick={onCardClick} />))}
        </KanbanColumn>
        <KanbanColumn id="a_separar" title={`A Separar (${groupedOrders['a_separar']?.length || 0})`}>
            {groupedOrders['a_separar']?.map((card) => (<KanbanCard key={card.id} card={card} onCardClick={onCardClick} />))}
        </KanbanColumn>
        <KanbanColumn id="enviado" title={`Enviado (${groupedOrders['enviado']?.length || 0})`}>
            {groupedOrders['enviado']?.map((card) => (<KanbanCard key={card.id} card={card} onCardClick={onCardClick} />))}
        </KanbanColumn>
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
