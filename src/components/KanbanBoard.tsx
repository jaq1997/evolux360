import React, { useMemo, useState } from 'react';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCorners, DragEndEvent, DragOverlay, DragStartEvent, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from './ui/button';
import { ExternalLink, Trash2, AlertTriangle } from 'lucide-react';
import { Order, useData, OrderStatus } from '../context/DataContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { OrderDetailsModal } from './OrderDetailsModal';

function KanbanCard({ card, onCardClick }: { card: Order; onCardClick: (card: Order) => void }) {
  const { cancelOrder } = useData();
  const { toast } = useToast();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id.toString(),
    data: { type: 'card', order: card },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    try {
      await cancelOrder(card.id);
      toast({ title: "Pedido Cancelado!", description: `O Pedido #${card.id} foi movido para o histórico.` });
      setIsCancelModalOpen(false);
    } catch (error) { // A CORREÇÃO ESTÁ AQUI: removemos o ': any'
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      toast({ variant: "destructive", title: "Erro!", description: `Não foi possível cancelar o pedido. ${errorMessage}` });
    }
  };

  const productName = card.description?.split(',')[1]?.trim() || 'Produto';

  return (
    <>
      <div ref={setNodeRef} style={style} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-left w-full touch-none">
        <div className="flex justify-between items-start gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-grow min-w-0">
            <h4 className="font-semibold text-sm text-gray-800 mb-1">Pedido #{card.id}</h4>
            <p className="text-xs text-gray-500 truncate" title={productName}>{productName}</p>
          </div>
          <div className="flex items-center flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500" onClick={() => onCardClick(card)}><ExternalLink className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={handleCancelClick}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive" />Confirmar Cancelamento</DialogTitle>
            <DialogDescription>Você tem certeza que deseja cancelar o <strong>Pedido #{card.id}</strong>?</DialogDescription>
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

function KanbanColumn({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { type: 'column', status: id } });
  return (
    <div ref={setNodeRef} className={`bg-gray-100/80 p-4 rounded-xl w-full flex flex-col transition-colors ${isOver ? 'bg-blue-100/80' : ''}`}>
      <h3 className="font-bold text-gray-700 mb-4 px-1">{title}</h3>
      <div className="min-h-[200px] space-y-3 flex-grow">{children}</div>
    </div>
  );
}

const KanbanBoard = () => {
  const { orders, updateOrder } = useData();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(KeyboardSensor));

  const groupedOrders = useMemo(() => {
    const columns: Record<string, Order[]> = { 'novo_pedido': [], 'a_separar': [], 'enviado': [] };
    orders.forEach((order) => {
      const status = order.status as OrderStatus;
      if (columns[status]) columns[status].push(order);
    });
    return columns;
  }, [orders]);

  const handleDragStart = (event: DragStartEvent) => {
    const order = orders.find(o => o.id.toString() === event.active.id);
    if (order) setActiveOrder(order);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOrder(null);
    if (!over || !activeOrder || active.id === over.id) return;

    const overIsColumn = over.data.current?.type === 'column';
    if (overIsColumn) {
      const newStatus = over.data.current?.status as OrderStatus;
      if (activeOrder.status !== newStatus) {
        updateOrder(activeOrder.id, { status: newStatus });
      }
    }
  };

  const columnIds = ['novo_pedido', 'a_separar', 'enviado'];
  const columnTitles: Record<string, string> = { 'novo_pedido': 'Novo Pedido', 'a_separar': 'A Separar', 'enviado': 'Enviado' };

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columnIds.map(columnId => (
            <KanbanColumn key={columnId} id={columnId} title={`${columnTitles[columnId]} (${groupedOrders[columnId]?.length || 0})`}>
              <SortableContext items={groupedOrders[columnId]?.map(c => c.id.toString()) || []} strategy={verticalListSortingStrategy}>
                {groupedOrders[columnId]?.map((card) => (
                  <KanbanCard key={card.id} card={card} onCardClick={() => setSelectedOrder(card)} />
                ))}
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>
        <DragOverlay>{activeOrder ? <KanbanCard card={activeOrder} onCardClick={() => {}} /> : null}</DragOverlay>
      </DndContext>
      <OrderDetailsModal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} />
    </>
  );
};

export default KanbanBoard;
