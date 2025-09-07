// src/pages/Estoque.tsx - VERSÃO FINAL E COMPLETA

import { useState, useMemo, useRef } from "react";
import { useData } from '../context/DataContext';
import { Product } from '../context/DataContext'; // Importando Product do DataContext
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Download, Upload } from "lucide-react";
import { AddProductModal } from "@/components/AddProductModal";
import { EditProductModal } from "@/components/EditProductModal";
import { DeleteProductModal } from "@/components/DeleteProductModal";
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'sonner'; // Seu projeto já tem isso configurado no App.tsx!

const Estoque = () => {
  // Agora usamos 'fetchAllData' que existe no seu contexto! O erro deve sumir.
  const { products, loading, fetchAllData } = useData(); 
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");
    XLSX.writeFile(workbook, "Estoque_Produtos.xlsx");
  };

  // Lógica de importação usando axios e sonner
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading("Importando produtos...");

    try {
      const response = await axios.post('http://localhost:8000/import-products', formData );
      
      const count = response.data.imported_count || 0;
      toast.success(`${count} produtos importados com sucesso!`, { id: toastId });
      
      // Chama a função do seu contexto para garantir que a UI atualize!
      await fetchAllData(); 
      
    } catch (error) {
      toast.error('Erro ao importar o arquivo.', { id: toastId });
      console.error("Erro detalhado na importação:", error);
    } finally {
        if(e.target) e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getStatusBadge = (stock: number | null) => {
    if (stock === null || stock === 0) return <Badge variant="destructive">Esgotado</Badge>;
    if (stock > 0 && stock <= 10) return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Estoque Baixo</Badge>;
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Disponível</Badge>;
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };
  
  if (loading) {
    return <div className="p-8">Carregando estoque...</div>;
  }

  return (
    <div className="space-y-6">
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h3 className="text-lg font-bold text-gray-900 whitespace-nowrap">
            Lista de Produtos ({filteredProducts.length})
          </h3>
          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 w-full">
            <Button variant="outline" onClick={triggerFileInput}>
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#5932EA] hover:bg-[#4A28C7]">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Buscar por SKU ou nome..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-9" 
          />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">SKU</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="w-[120px]">Estoque</TableHead>
                <TableHead className="w-[150px]">Valor</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="text-right w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.stock_quantity} unidades</TableCell>
                  <TableCell>R$ {product.price?.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>{product.supplier || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(product.stock_quantity)}</TableCell>
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
        </div>

        <div className="flex justify-between items-center pt-4 text-sm text-gray-600">
            <span>Página {currentPage} de {totalPages}</span>
            <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}><ChevronLeft className="h-4 w-4" /> Anterior</Button>
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Próxima <ChevronRight className="h-4 w-4" /></Button>
            </div>
        </div>
      </div>
      
      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
      {selectedProduct && (
        <>
          <EditProductModal 
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
          />
          <DeleteProductModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
          />
        </>
      )}
    </div>
  );
};

export default Estoque;
