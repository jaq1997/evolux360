import React, { createContext, useState, useContext, ReactNode } from 'react';

// --- INTERFACES ---
export interface Customer { name: string; phone: string; email: string; }
export interface ShippingDetails { address: string; method: string; carrier: string; }
export interface BillingDetails { address: string; }
export interface Product {
    id: number;
    sku: string;
    name: string;
    stock: number;
    price: string;
    cost: string;
    supplier: string;
    category: string;
    brand: string;
    image: string;
    status: string;
}
export interface OrderProduct {
    name: string;
    color: string;
    size: string | number;
    quantity: number;
    id: number;
    sku: string;
    price: string;
}
export interface Order {
    id: string;
    title: string;
    description: string;
    tag: string;
    customer: Customer;
    shipping: ShippingDetails;
    billing: BillingDetails;
    products: OrderProduct[];
}

// --- Dados Iniciais Centralizados ---
const initialProductsData: Product[] = [
    { id: 1, sku: "VN001", name: "Vans Old Skool", stock: 80, price: "R$ 399,90", cost: "R$ 180,00", supplier: "Fornecedor B", category: "Tênis", brand: "Vans", image: "https://images.unsplash.com/photo-1611510338559-2f463335092c?w=400&q=80", status: "Disponível" },
    { id: 2, sku: "NK002", name: "Nike Air Force", stock: 120, price: "R$ 799,90", cost: "R$ 350,00", supplier: "Fornecedor A", category: "Tênis", brand: "Nike", image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&q=80", status: "Disponível" },
    { id: 3, sku: "AD003", name: "Adidas Superstar", stock: 4, price: "R$ 499,90", cost: "R$ 220,00", supplier: "Fornecedor C", category: "Tênis", brand: "Adidas", image: "https://images.unsplash.com/photo-1595950653106-6090ee369599?w=400&q=80", status: "Estoque Baixo" },
    { id: 4, sku: "AD004", name: "Adidas Forum", stock: 0, price: "R$ 599,90", cost: "R$ 280,00", supplier: "Fornecedor C", category: "Tênis", brand: "Adidas", image: "https://images.unsplash.com/photo-1628174246915-c83491394364?w=400&q=80", status: "Esgotado" },
    { id: 5, sku: "NK005", name: "Nike Dunk", stock: 55, price: "R$ 649,90", cost: "R$ 299,90", supplier: "Fornecedor A", category: "Tênis", brand: "Nike", image: "https://images.unsplash.com/photo-1608231387042-89d0ac7c7939?w=400&q=80", status: "Disponível" },
];

const initialOrdersData: { [key: string]: Order[] } = {
  'Novo Pedido': [
    { id: '126', title: 'Pedido #126', description: '1x Nike Air Force', tag: 'Cliente Novo', customer: { name: 'João Santos', phone: '(21) 98765-4321', email: 'joao.santos@example.com' }, shipping: { address: 'Rua das Flores, 123, Rio de Janeiro, RJ', method: 'Retira', carrier: 'N/A' }, billing: { address: 'Rua das Flores, 123, Rio de Janeiro, RJ' }, products: [ { id: 2, sku: "NK002", name: 'Nike Air Force', color: 'Branco', size: '42', quantity: 1, price: "R$ 799,90" } ] },
    { id: '125', title: 'Pedido #125', description: '2x Vans Old Skool', tag: 'Prioridade Alta', customer: { name: 'Maria Silva', phone: '(11) 91234-5678', email: 'maria.silva@example.com' }, shipping: { address: 'Av. Paulista, 1000, São Paulo, SP', method: 'Envio', carrier: 'Correios (SEDEX)' }, billing: { address: 'Av. Paulista, 1000, São Paulo, SP' }, products: [ { id: 1, sku: "VN001", name: 'Vans Old Skool', color: 'Preto/Branco', size: '38', quantity: 2, price: "R$ 399,90" } ] },
  ],
  'A Separar': [
    { id: '123', title: 'Pedido #123', description: '1x Adidas Forum', tag: 'Frágil', customer: { name: 'Pedro Costa', phone: '(31) 95555-4444', email: 'pedro.costa@example.com' }, shipping: { address: 'Rua dos Inconfidentes, 500, Belo Horizonte, MG', method: 'Envio', carrier: 'Total Express' }, billing: { address: 'Rua dos Inconfidentes, 500, Belo Horizonte, MG' }, products: [ { id: 4, sku: "AD004", name: 'Adidas Forum', color: 'Branco/Azul', size: '40', quantity: 1, price: "R$ 599,90" } ] },
  ],
  'Enviado': [
    { id: '120', title: 'Pedido #120', description: '5x Nike Dunk', tag: 'Loggi', customer: { name: 'Ana Pereira', phone: '(41) 93333-2222', email: 'ana.pereira@example.com' }, shipping: { address: 'Rua 24 Horas, 1, Curitiba, PR', method: 'Envio', carrier: 'Loggi' }, billing: { address: 'Rua 24 Horas, 1, Curitiba, PR' }, products: [ { id: 5, sku: "NK005", name: 'Nike Dunk', color: 'Panda', size: '39', quantity: 5, price: "R$ 649,90" } ] },
  ],
};


interface DataContextType {
  products: Product[];
  orders: { [key: string]: Order[] };
  updateOrder: (orderId: string, updatedProducts: OrderProduct[]) => void;
  moveOrder: (orderId: string, newColumn: string) => void;
  deleteOrder: (orderId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export default function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProductsData);
  const [orders, setOrders] = useState<{ [key: string]: Order[] }>(initialOrdersData);

  const updateOrder = (orderId: string, updatedProducts: OrderProduct[]) => {
    const newOrders = { ...orders };
    for (const column in newOrders) {
        const orderIndex = newOrders[column].findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            newOrders[column][orderIndex].products = updatedProducts;
            newOrders[column][orderIndex].description = updatedProducts.map(p => `${p.quantity}x ${p.name}`).join(', ');
            break;
        }
    }
    setOrders(newOrders);
  };

  const moveOrder = (orderId: string, newColumnId: string) => {
    setOrders(prevOrders => {
      const allOrdersInOneList = Object.values(prevOrders).flat();
      const orderToMove = allOrdersInOneList.find(order => order.id === orderId);
      if (!orderToMove) return prevOrders;

      const newOrdersState = { ...prevOrders };
      // Remove o card da coluna antiga
      for (const columnId in newOrdersState) {
        newOrdersState[columnId] = newOrdersState[columnId].filter(order => order.id !== orderId);
      }
      // Adiciona o card na nova coluna
      if (newOrdersState[newColumnId]) {
        newOrdersState[newColumnId].push(orderToMove);
      }
      return newOrdersState;
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prevOrders => {
      const newOrders = { ...prevOrders };
      for (const column in newOrders) {
        newOrders[column] = newOrders[column].filter(o => o.id !== orderId);
      }
      return newOrders;
    });
  };

  const value = { products, orders, updateOrder, moveOrder, deleteOrder };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};