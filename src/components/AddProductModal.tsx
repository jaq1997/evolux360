// src/components/AddProductModal.tsx - VERSÃO FINAL E COMPLETA

import { useState, useRef } from "react";
import { useData, NewProductPayload } from '../context/DataContext';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AddProductModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { createProduct, fetchAllData } = useData();
  const [formData, setFormData] = useState<Partial<NewProductPayload>>({});
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  // ✅ FUNÇÃO CORRIGIDA PARA CONVERTER TIPOS DE DADOS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumericField = e.target.type === 'number';
    
    const parsedValue = isNumericField 
      ? (value === '' ? null : parseFloat(value)) 
      : value;

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const triggerImageInput = () => {
    imageInputRef.current?.click();
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`; // Nome de arquivo mais robusto
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product_images')
      .upload(filePath, file);

    setIsUploading(false);
    if (uploadError) {
      console.error("Erro no upload da imagem:", uploadError);
      toast.error("Falha ao fazer upload da imagem.");
      return null;
    }

    return filePath;
  };
  
  const handleSubmit = async () => {
    if (!formData.name || !formData.sku) {
      toast.error("Erro de Validação", { description: "Nome do Produto e SKU são obrigatórios." });
      return;
    }

    const toastId = toast.loading("Adicionando novo produto...");

    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        const uploadedPath = await uploadImage(imageFile);
        if (uploadedPath) {
          const { data } = supabase.storage.from('product_images').getPublicUrl(uploadedPath);
          imageUrl = data.publicUrl;
        } else {
          toast.error("Falha no Upload", { id: toastId, description: "O produto não foi salvo pois o upload da imagem falhou." });
          return;
        }
      }

      const finalPayload: NewProductPayload = {
        ...formData,
        image_url: imageUrl,
      } as NewProductPayload;

      await createProduct(finalPayload);
      
      toast.success("Sucesso!", { id: toastId, description: "Produto adicionado com sucesso." });
      await fetchAllData();
      handleClose(); // Usa a função handleClose para limpar e fechar
    } catch (error: any) {
      console.error("Erro ao adicionar produto:", error);
      toast.error("Erro no Servidor", { id: toastId, description: error.message || "Não foi possível adicionar o produto." });
    }
  };

  const handleClose = () => {
    setFormData({});
    setImageFile(null);
    setImagePreview(null);
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Adicionar novo produto</DialogTitle>
        </DialogHeader>

        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageChange}
          accept="image/png, image/jpeg, image/jpg"
          style={{ display: 'none' }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
          <div 
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={triggerImageInput}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Pré-visualização" className="w-full h-48 object-cover rounded-md" />
            ) : (
              <div className="text-center">
                <UploadCloud className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
                <Button variant="outline" type="button">Adicionar Imagem</Button>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG, JPEG</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="name">Nome do Produto</Label><Input id="name" name="name" onChange={handleChange} /></div>
              <div><Label htmlFor="sku">SKU</Label><Input id="sku" name="sku" onChange={handleChange} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* ✅ NOME DA COLUNA CORRIGIDO */}
              <div><Label htmlFor="cost">Custo de aquisição</Label><Input id="cost" name="cost" type="number" onChange={handleChange} /></div>
              <div><Label htmlFor="price">Preço de Venda</Label><Input id="price" name="price" type="number" onChange={handleChange} /></div>
            </div>
            <div><Label htmlFor="stock_quantity">Quantidade em estoque</Label><Input id="stock_quantity" name="stock_quantity" type="number" onChange={handleChange} /></div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="category">Categoria</Label><Input id="category" name="category" onChange={handleChange} /></div>
                <div><Label htmlFor="brand">Marca</Label><Input id="brand" name="brand" onChange={handleChange} /></div>
            </div>
            <div><Label htmlFor="supplier">Fornecedor Principal</Label><Input id="supplier" name="supplier" onChange={handleChange} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isUploading} className="bg-[#5932EA] hover:bg-[#4A28C7]">
            {isUploading ? "Enviando imagem..." : "Adicionar Novo Produto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
