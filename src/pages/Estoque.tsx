import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Image as ImageIcon, AlertTriangle, CheckCircle } from "lucide-react";

const initialProducts = [
  { id: 1, sku: "VN001", name: "Vans Old Skool", stock: 80, price: "R$ 399,90", cost: "R$ 180,00", supplier: "Fornecedor B", category: "Tênis", brand: "Vans", image: "https://images.unsplash.com/photo-1611510338559-2f463335092c?w=400&q=80", status: "Disponível" },
  { id: 2, sku: "NK002", name: "Nike Air Force", stock: 120, price: "R$ 799,90", cost: "R$ 350,00", supplier: "Fornecedor A", category: "Tênis", brand: "Nike", image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&q=80", status: "Disponível" },
  { id: 3, sku: "AD003", name: "Adidas Superstar", stock: 4, price: "R$ 499,90", cost: "R$ 220,00", supplier: "Fornecedor C", category: "Tênis", brand: "Adidas", image: "https://images.unsplash.com/photo-1595950653106-6090ee369599?w=400&q=80", status: "Estoque Baixo" },
  { id: 4, sku: "AD004", name: "Adidas Forum", stock: 0, price: "R$ 599,90", cost: "R$ 280,00", supplier: "Fornecedor C", category: "Tênis", brand: "Adidas", image: "https://images.unsplash.com/photo-1628174246915-c83491394364?w=400&q=80", status: "Esgotado" },
  { id: 5, sku: "NK005", name: "Nike Dunk", stock: 55, price: "R$ 649,90", cost: "R$ 299,90", supplier: "Fornecedor A", category: "Tênis", brand: "Nike", image: "https://images.unsplash.com/photo-1608231387042-89d0ac7c7939?w=400&q=80", status: "Disponível" },
  { id: 6, sku: "NB006", name: "New Balance 550", stock: 35, price: "R$ 849,90", cost: "R$ 400,00", supplier: "Fornecedor B", category: "Tênis", brand: "New Balance", image: "https://images.unsplash.com/photo-1634532829986-7356d6e24225?w=400&q=80", status: "Disponível" },
  { id: 7, sku: "CV007", name: "Converse Chuck 70", stock: 9, price: "R$ 449,90", cost: "R$ 210,00", supplier: "Fornecedor A", category: "Tênis", brand: "Converse", image: "https://images.unsplash.com/photo-1588117269595-18359f13484f?w=400&q=80", status: "Estoque Baixo" },
  { id: 8, sku: "AS008", name: "Asics Gel-Kayano", stock: 22, price: "R$ 999,90", cost: "R$ 450,00", supplier: "Fornecedor D", category: "Corrida", brand: "Asics", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80", status: "Disponível" },
  { id: 9, sku: "PM009", name: "Puma Suede Classic", stock: 60, price: "R$ 429,90", cost: "R$ 190,00", supplier: "Fornecedor C", category: "Tênis", brand: "Puma", image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&q=80", status: "Disponível" },
  { id: 10, sku: "RB010", name: "Reebok Club C 85", stock: 0, price: "R$ 479,90", cost: "R$ 230,00", supplier: "Fornecedor A", category: "Tênis", brand: "Reebok", image: "https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd?w=400&q=80", status: "Esgotado" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Disponível": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Disponível</Badge>;
    case "Estoque Baixo": return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Estoque Baixo</Badge>;
    case "Esgotado": return <Badge variant="destructive">Esgotado</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

const Estoque = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = () => {
    setIsEditModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* AJUSTE DE LAYOUT AQUI: Busca e botão na mesma linha */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por SKU ou nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#5932EA] hover:bg-[#4A28C7] w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            {/* ... Conteúdo do modal de Adicionar Produto ... */}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">SKU</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Preço de Venda</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell className="font-medium flex items-center space-x-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                  <span>{product.name}</span>
                </TableCell>
                <TableCell>{product.stock} unidades</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.supplier}</TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(product)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDeleteClick(product)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {/* ... Conteúdo do modal de Edição ... */}
      </Dialog>
      
      {/* Modal de Exclusão */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
         {/* ... Conteúdo do modal de Exclusão ... */}
      </Dialog>

      {/* Modal de Confirmação de Sucesso */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        {/* ... Conteúdo do modal de Sucesso ... */}
      </Dialog>
    </div>
  );
};

export default Estoque;