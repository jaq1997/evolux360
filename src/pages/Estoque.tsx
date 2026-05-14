import { useState, useMemo, useRef } from "react";
import { useData, Product } from '../context/DataContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Download, Upload, Eye } from "lucide-react";
import { AddProductModal } from "@/components/AddProductModal";
import { EditProductModal } from "@/components/EditProductModal";
import { DeleteProductModal } from "@/components/DeleteProductModal";
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'sonner';

const Estoque = () => {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const toastId = toast.loading("Importando produtos...");

    try {
      const response = await axios.post('http://localhost:8000/import-products', formData );
      const count = response.data.imported_count || 0;
      toast.success(`${count} produtos importados!`, { id: toastId });
      await fetchAllData(); 
    } catch (error) {
      toast.error('Erro ao importar arquivo.', { id: toastId });
    } finally {
      if(e.target) e.target.value = '';
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

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
  
  if (loading && products.length === 0) {
    return <div className="flex h-full items-center justify-center p-8"><p>Carregando estoque...</p></div>;
  }

  return (
    <div className="space-y-6 main-content-min-height">
      <input type="file" accept=".xlsx, .xls" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h3 className="text-lg font-bold text-gray-900">Estoque ({filteredProducts.length})</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={triggerFileInput}><Upload className="w-4 h-4 mr-2" /> Importar</Button>
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4 mr-2" /> Exportar</Button>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="bg-[#5932EA] hover:bg-[#4A28C7]"><Plus className="w-4 h-4 mr-2" /> Novo Produto</Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar por SKU ou nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-[100px]">SKU</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="w-[100px]">Estoque</TableHead>
                <TableHead className="w-[120px]">Preço Venda</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="text-right w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-[10px] text-gray-400">{product.sku || 'N/A'}</TableCell>
                  <TableCell className="font-medium text-gray-800">{product.name}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{product.stock_quantity} un</TableCell>
                  <TableCell className="font-bold text-[#5932EA]">R$ {product.price?.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>{getStatusBadge(product.stock_quantity)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" onClick={() => {}}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5932EA]" onClick={() => handleEditClick(product)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDeleteClick(product)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center pt-4 text-sm text-gray-500">
            <span>Página {currentPage} de {totalPages}</span>
            <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
        </div>
      </div>
      
      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      
      {selectedProduct && (
        <>
          <EditProductModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedProduct(null); }} product={selectedProduct} />
          <DeleteProductModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedProduct(null); }} product={selectedProduct} />
        </>
      )}
    </div>
  );
};

export default Estoque;
