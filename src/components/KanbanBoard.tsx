import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, closestCorners, DragEndEvent } from '@dnd-kit/core';
import { Button } from './ui/button';
import { ExternalLink, Trash2, AlertTriangle } from 'lucide-react';
import { Order, useData } from '../context/DataContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function KanbanCard({ card, onCardClick }: { card: Order, onCardClick: (card: Order) => void }) {
  const { deleteOrder } = useData();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: card.id });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 999 } : undefined;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteOrder(card.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm mb-4 text-left w-full">
        <div className="flex justify-between items-start gap-2">
          <div {...listeners} {...attributes} className="cursor-grab flex-grow">
            <h4 className="font-semibold text-sm text-gray-800 mb-1">{card.title}</h4>
            <p className="text-xs text-gray-500">{card.description}</p>
          </div>
          <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-gray-400 hover:text-gray-700" onClick={() => onCardClick(card)}>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-red-500 hover:bg-red-100" onClick={handleDeleteClick}>
                <Trash2 className="h-4 w-4" />
              </Button>
          </div>
        </div>
      </div>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" />Confirmar Exclusão</DialogTitle>
            <DialogDescription>Você tem certeza que deseja excluir o <strong>Pedido #{card.id}</strong>? Esta ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Sim, excluir pedido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function KanbanColumn({ id, title, children }: { id: string, title: string, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (<div ref={setNodeRef} className="bg-gray-100/80 p-4 rounded-xl w-full"><h3 className="font-bold text-gray-700 mb-4 px-1">{title}</h3><div className="min-h-[200px]">{children}</div></div>);
}

const KanbanBoard = ({ onCardClick }: { onCardClick: (card: Order) => void }) => {
  const { orders, moveOrder } = useData();
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveOrder(active.id as string, over.id as string);
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(orders).map(([columnId, cards]) => (<KanbanColumn key={columnId} id={columnId} title={`${columnId} (${cards.length})`}>{cards.map((card) => (<KanbanCard key={card.id} card={card} onCardClick={onCardClick} />))}</KanbanColumn>))}
      </div>
    </DndContext>
  );
};
export default KanbanBoard;