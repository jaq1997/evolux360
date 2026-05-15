import { Product } from '../context/DataContext';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Image as ImageIcon, Package, Tag, Building2, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ProductDetailsModal = ({ isOpen, onClose, product, onEdit }: { isOpen: boolean; onClose: () => void; product: Product; onEdit?: () => void }) => {
  if (!product) return null;

  const formattedPrice = product.price?.toFixed(2).replace('.', ',') || '0,00';
  const purchasePrice = (product as any).purchase_price || (product as any).cost || 0;
  const formattedCost = purchasePrice.toFixed(2).replace('.', ',') || '0,00';
  
  const createdDate = product.created_at ? new Date(product.created_at) : null;
  const formattedDate = (createdDate && isValid(createdDate)) ? format(createdDate, 'dd/MM/yyyy', { locale: ptBR }) : 'N/A';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] !border-none shadow-2xl outline-none p-0 overflow-hidden flex flex-col [&>button]:text-white [&>button]:top-4 [&>button]:right-4">
        <div className="bg-[#5932EA] p-6 shrink-0">
          <DialogTitle className="text-white text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" /> Detalhes do Produto
          </DialogTitle>
          <DialogDescription className="text-purple-100 mt-1">Informações completas do item no inventário.</DialogDescription>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Coluna Imagem */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-gray-50 rounded-2xl aspect-square flex flex-col items-center justify-center border-2 border-gray-100 overflow-hidden shadow-inner">
                {product?.image_url ? (
                   <img src={product.image_url} alt="Produto" className="w-full h-full object-cover" />
                ) : (
                   <div className="flex flex-col items-center text-gray-300">
                     <ImageIcon className="w-16 h-16 mb-2" />
                     <span className="text-sm font-medium uppercase tracking-widest">Sem Foto</span>
                   </div>
                )}
              </div>
              <div className="bg-[#5932EA]/5 p-4 rounded-xl border border-[#5932EA]/10">
                <Label className="text-[10px] text-[#5932EA] font-bold uppercase tracking-widest block mb-2">Cadastrado em</Label>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Calendar className="w-4 h-4 text-[#5932EA]" />
                    {formattedDate}
                </div>
              </div>
            </div>

            {/* Coluna Informações Principais */}
            <div className="md:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400 font-bold uppercase tracking-widest">Nome do Produto</Label>
                  <div className="text-lg font-bold text-gray-900 border-b pb-1">{product.name || 'N/A'}</div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-400 font-bold uppercase tracking-widest">SKU / Código Único</Label>
                  <div className="text-lg font-mono text-gray-600 border-b pb-1">{product.sku || 'N/A'}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <Label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Preço Venda</Label>
                  <div className="text-xl font-black text-[#5932EA]">R$ {formattedPrice}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <Label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Preço Custo</Label>
                  <div className="text-xl font-bold text-gray-700">R$ {formattedCost}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <Label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Em Estoque</Label>
                  <div className={`text-xl font-black ${product.stock_quantity && product.stock_quantity > 10 ? 'text-green-600' : 'text-orange-500'}`}>
                    {product.stock_quantity || 0} <span className="text-xs font-normal text-gray-400">un</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <div>
                        <Label className="text-[10px] text-gray-400 font-bold uppercase block">Categoria</Label>
                        <span className="text-sm font-bold text-gray-700">{product.category || 'Não categorizado'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                        <Label className="text-[10px] text-gray-400 font-bold uppercase block">Fornecedor</Label>
                        <span className="text-sm font-bold text-gray-700">{product.supplier || 'Não informado'}</span>
                    </div>
                </div>
              </div>

              {product.description && (
                <div className="space-y-2">
                   <Label className="text-xs text-gray-400 font-bold uppercase tracking-widest">Descrição</Label>
                   <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
            {onEdit && (
              <Button variant="outline" onClick={onEdit} className="h-11 px-8 font-bold text-gray-600 border-gray-300 flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Editar Produto
              </Button>
            )}
            <Button className="bg-[#5932EA] hover:bg-[#4A28C7] text-white h-11 px-8 font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Ver Histórico de Vendas
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};