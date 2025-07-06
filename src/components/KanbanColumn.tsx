
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Database } from "@/integrations/supabase/types";
import { SortableOrderCard } from './SortableOrderCard';

type Order = Database['public']['Tables']['orders']['Row'];

interface KanbanColumnProps {
  id: string;
  title: string;
  orders: Order[];
}

export function KanbanColumn({ id, title, orders }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={orders.map(o => o.id.toString())} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="bg-gray-100 rounded-lg p-2 flex flex-col w-80 flex-shrink-0">
        <h3 className="font-semibold text-gray-800 mb-3 px-2 pt-2 sticky top-0 bg-gray-100 z-10">{title} ({orders.length})</h3>
        <div className="space-y-3 flex-grow overflow-y-auto min-h-[100px] p-1">
          {orders.map(order => (
            <SortableOrderCard key={order.id} order={order} />
          ))}
          {orders.length === 0 && (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-sm text-gray-500 py-8">
                Nenhum pedido aqui.
                </div>
            </div>
          )}
        </div>
      </div>
    </SortableContext>
  );
}
