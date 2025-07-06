
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCorners
} from '@dnd-kit/core';
import { toast } from "sonner";
import { KanbanColumn } from './KanbanColumn';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderStatus = Database['public']['Enums']['order_status'];

const fetchOrders = async (): Promise<Order[]> => {
    const { data, error } = await supabase.from("orders").select("*").order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
};

const updateOrderStatus = async ({ id, status }: { id: number, status: OrderStatus }) => {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }
};

const statusLabels: Record<OrderStatus, string> = {
  novo_pedido: "Novo Pedido",
  a_separar: "A separar",
  separado: "Separado",
  a_enviar: "A enviar",
  enviado: "Enviado",
  recuperar_carrinho: "Recuperar Carrinho"
};

const KanbanBoard = () => {
    const queryClient = useQueryClient();
    const { data: orders, isLoading, error } = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });
    const [localOrders, setLocalOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (orders) {
            setLocalOrders(orders);
        }
    }, [orders]);

    const updateOrderMutation = useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success("Pedido atualizado com sucesso!");
        },
        onError: (err: Error) => {
            toast.error(`Erro ao atualizar pedido: ${err.message}`);
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    const columns: OrderStatus[] = [
        'novo_pedido',
        'a_separar',
        'separado',
        'a_enviar',
        'enviado',
        'recuperar_carrinho'
    ];

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;
        
        const activeId = active.id.toString();
        const overContainerId = over.data.current?.sortable?.containerId || over.id.toString();

        const activeOrder = localOrders.find(o => o.id.toString() === activeId);
        const newStatus = overContainerId as OrderStatus;

        if (activeOrder && newStatus && activeOrder.status !== newStatus) {
            // Optimistic update for instant UI feedback
            setLocalOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id.toString() === activeId ? { ...order, status: newStatus } : order
                )
            );

            // Trigger mutation to update the database
            updateOrderMutation.mutate({ id: activeOrder.id, status: newStatus });
        }
    };

    if (isLoading) return <div className="text-center">Carregando pedidos...</div>;
    if (error) return <div className="text-center text-red-500">Erro ao carregar pedidos: {error.message}</div>;

    const ordersByStatus = (status: OrderStatus) => {
        return localOrders?.filter(order => order.status === status) || [];
    }

    // Organize columns in 3 rows of 2 columns each
    const row1 = columns.slice(0, 2);
    const row2 = columns.slice(2, 4);
    const row3 = columns.slice(4, 6);

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">Controle de Pedidos</h2>
                
                <div className="space-y-6">
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {row1.map(status => (
                      <KanbanColumn 
                        key={status}
                        id={status}
                        title={statusLabels[status]}
                        orders={ordersByStatus(status)}
                      />
                    ))}
                  </div>
                  
                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {row2.map(status => (
                      <KanbanColumn 
                        key={status}
                        id={status}
                        title={statusLabels[status]}
                        orders={ordersByStatus(status)}
                      />
                    ))}
                  </div>
                  
                  {/* Third Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {row3.map(status => (
                      <KanbanColumn 
                        key={status}
                        id={status}
                        title={statusLabels[status]}
                        orders={ordersByStatus(status)}
                      />
                    ))}
                  </div>
                </div>
            </div>
        </DndContext>
    );
};

export default KanbanBoard;
