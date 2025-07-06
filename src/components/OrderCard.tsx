
import { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Order = Database['public']['Tables']['orders']['Row'];

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-semibold">{order.customer_name || "Cliente não informado"}</CardTitle>
        <CardDescription className="text-xs">{order.product_name || "Produto não informado"}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-gray-500">Pedido: #{order.id}</p>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
