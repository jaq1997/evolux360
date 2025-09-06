import React from 'react';
import { Badge } from './ui/badge';

// Interface foi simplificada para aceitar qualquer string, acabando com os conflitos de tipo.
interface StatusBadgeProps {
  status: string | null | undefined;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Verificação robusta para qualquer valor ausente (null, undefined, etc.)
  if (!status) {
    return (
      <Badge variant="outline" className="font-semibold text-gray-600 border-gray-600 bg-gray-50">
        Indefinido
      </Badge>
    );
  }

  const getBadgeDetails = () => {
    switch (status) {
      case 'novo_pedido':
        return { text: 'Novo Pedido', className: 'text-blue-600 border-blue-600 bg-blue-50' };
      case 'a_separar':
        return { text: 'A Separar', className: 'text-cyan-600 border-cyan-600 bg-cyan-50' };
      case 'separado':
        return { text: 'Separado', className: 'text-indigo-600 border-indigo-600 bg-indigo-50' };
      case 'a_enviar':
        return { text: 'Pronto p/ Envio', className: 'text-purple-600 border-purple-600 bg-purple-50' };
      case 'enviado':
        return { text: 'Enviado', className: 'text-yellow-600 border-yellow-600 bg-yellow-50' };
      case 'concluido':
        return { text: 'Concluído', className: 'text-green-600 border-green-600 bg-green-50' };
      case 'cancelado':
        return { text: 'Cancelado', className: 'text-red-600 border-red-600 bg-red-50' };
      case 'recuperar_carrinho':
        return { text: 'Rec. Carrinho', className: 'text-gray-600 border-gray-600 bg-gray-50' };
      default: {
        // Agora esta linha é 100% segura, pois já garantimos que 'status' é uma string.
        const defaultText = status.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
        return { text: defaultText, className: 'text-gray-600 border-gray-600 bg-gray-50' };
      }
    }
  };

  const { text, className } = getBadgeDetails();

  return (
    <Badge variant="outline" className={`font-semibold ${className}`}>
      {text}
    </Badge>
  );
};

