import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, closestCorners } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const initialKanbanData = {
  'Novo Pedido': [
    { id: '126', title: 'Pedido #126', description: '1x Nike Air Force', tag: 'Cliente Novo', customer: { name: 'João Santos', phone: '(21) 98765-4321', email: 'joao.santos@example.com' }, shipping: { address: 'Rua das Flores, 123, Rio de Janeiro, RJ', method: 'Retira', carrier: 'N/A' }, billing: { address: 'Rua das Flores, 123, Rio de Janeiro, RJ' }, product: { name: 'Nike Air Force', color: 'Branco', size: '42', quantity: 1 } },
    { id: '125', title: 'Pedido #125', description: '2x Vans Old Skool', tag: 'Prioridade Alta', customer: { name: 'Maria Silva', phone: '(11) 91234-5678', email: 'maria.silva@example.com' }, shipping: { address: 'Av. Paulista, 1000, São Paulo, SP', method: 'Envio', carrier: 'Correios (SEDEX)' }, billing: { address: 'Av. Paulista, 1000, São Paulo, SP' }, product: { name: 'Vans Old Skool', color: 'Preto/Branco', size: '38', quantity: 2 } },
  ],
  'A Separar': [
    { id: '123', title: 'Pedido #123', description: '1x Adidas Forum', tag: 'Frágil', customer: { name: 'Pedro Costa', phone: '(31) 95555-4444', email: 'pedro.costa@example.com' }, shipping: { address: 'Rua dos Inconfidentes, 500, Belo Horizonte, MG', method: 'Envio', carrier: 'Total Express' }, billing: { address: 'Rua dos Inconfidentes, 500, Belo Horizonte, MG' }, product: { name: 'Adidas Forum', color: 'Branco/Azul', size: '40', quantity: 1 } },
  ],
  'Enviado': [
    { id: '120', title: 'Pedido #120', description: '5x Nike Dunk', tag: 'Loggi', customer: { name: 'Ana Pereira', phone: '(41) 93333-2222', email: 'ana.pereira@example.com' }, shipping: { address: 'Rua 24 Horas, 1, Curitiba, PR', method: 'Envio', carrier: 'Loggi' }, billing: { address: 'Rua 24 Horas, 1, Curitiba, PR' }, product: { name: 'Nike Dunk', color: 'Panda', size: '39', quantity: 5 } },
  ],
};

function KanbanCard({ card, onCardClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: card.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 999 } : undefined;

  return (
    <div ref={setNodeRef} style={style} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm mb-4 text-left w-full">
      <div className="flex justify-between items-start gap-2">
        <div {...listeners} {...attributes} className="cursor-grab flex-grow">
          <h4 className="font-semibold text-sm text-gray-800 mb-1">{card.title}</h4>
          <p className="text-xs text-gray-500">{card.description}</p>
          {/* A linha do Badge foi removida daqui */}
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-gray-400 hover:text-gray-700" onClick={() => onCardClick(card)}>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function KanbanColumn({ id, title, children }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="bg-gray-100/80 p-4 rounded-xl w-full">
      <h3 className="font-bold text-gray-700 mb-4 px-1">{title}</h3>
      <div className="min-h-[200px]">{children}</div>
    </div>
  );
}

const KanbanBoard = ({ onCardClick }) => {
  const [columns, setColumns] = useState(initialKanbanData);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    
    setColumns((prev) => {
      const activeColumn = Object.keys(prev).find(key => prev[key].some(card => card.id === active.id));
      const overColumn = over.id as string;

      if (!activeColumn || !overColumn || activeColumn === overColumn) {
        return prev;
      }
      
      const newActiveItems = [...prev[activeColumn]];
      const newOverItems = [...prev[overColumn]];
      
      const activeIndex = newActiveItems.findIndex(card => card.id === active.id);
      const [movedItem] = newActiveItems.splice(activeIndex, 1);
      
      newOverItems.push(movedItem);

      return {
        ...prev,
        [activeColumn]: newActiveItems,
        [overColumn]: newOverItems,
      };
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(columns).map(([columnId, cards]) => (
          <KanbanColumn key={columnId} id={columnId} title={`${columnId} (${cards.length})`}>
            {cards.map((card) => (
              <KanbanCard key={card.id} card={card} onCardClick={onCardClick} />
            ))}
          </KanbanColumn>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;