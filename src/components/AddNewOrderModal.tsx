// src/components/.../AddNewOrderModal.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Minus, ChevronLeft, ChevronRight, User, Package, CreditCard, Check, ShoppingCart } from 'lucide-react';
import { useData, Product, ProductVariant, Size, Color, NewOrderPayloadExtended, Address as AddressType, OrderItem as OrderItemType } from '../context/DataContext';
import { toast } from 'sonner';

interface AddNewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: AddressType;
}

interface PaymentData {
  method: 'credit_card' | 'debit_card' | 'pix' | 'cash' | 'bank_transfer';
  installments: number;
  notes: string;
}

interface DeliveryData {
  type: 'pickup' | 'delivery';
  date: string;
  time: string;
  fee: number;
  notes?: string;
}

interface DiscountData {
  type: 'none' | 'percentage' | 'fixed' | string;
  value: number;
  couponCode: string;
  isValidCoupon: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

type VariantWithDetails = ProductVariant & {
  sizes?: Size;
  colors?: Color;
};

const WIZARD_STEPS = [
  { id: 1, title: 'Cliente & Endereço', icon: User },
  { id: 2, title: 'Produtos', icon: Package },
  { id: 3, title: 'Pagamento & Entrega', icon: CreditCard }
];

const AVAILABLE_COUPONS = [
  { code: 'DESCONTO10', type: 'percentage', value: 10, description: '10% de desconto' },
  { code: 'FRETE20', type: 'fixed', value: 20, description: 'R$ 20 de desconto' },
  { code: 'PRIMEIRACOMPRA', type: 'percentage', value: 15, description: '15% de desconto para primeira compra' },
  { code: 'BLACKFRIDAY', type: 'percentage', value: 25, description: '25% de desconto Black Friday' }
];

const BRAZILIAN_STATES = [
  { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' }, { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' }, { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' }, { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' }, { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' }, { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' }, { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' }, { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' }, { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' }, { value: 'TO', label: 'Tocantins' }
];

const DRAFT_STORAGE_KEY = 'new-order-draft';

export const AddNewOrderModal: React.FC<AddNewOrderModalProps> = ({ isOpen, onClose }) => {
  const { products, createOrder, getProductVariantsWithDetails } = useData();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' }
  });

  const [selectedProducts, setSelectedProducts] = useState<OrderItemType[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentData>({ method: 'credit_card', installments: 1, notes: '' });
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({ type: 'pickup', date: '', time: '', fee: 0, notes: '' });
  const [discountData, setDiscountData] = useState<DiscountData>({ type: 'none', value: 0, couponCode: '', isValidCoupon: false });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<Product | null>(null);
  const [productVariants, setProductVariants] = useState<VariantWithDetails[]>([]);

  // save draft
  const saveToLocalStorage = useCallback(() => {
    if (!hasUnsavedChanges) return;
    const draft = { customerData, selectedProducts, paymentData, deliveryData, discountData, currentStep };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [hasUnsavedChanges, customerData, selectedProducts, paymentData, deliveryData, discountData, currentStep]);

  // load draft
  const loadFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!saved) return;
    if (!window.confirm('Encontramos um pedido não finalizado. Deseja continuar de onde parou?')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      return;
    }
    try {
      const draft = JSON.parse(saved) as Partial<{
        customerData: CustomerData;
        selectedProducts: OrderItemType[];
        paymentData: PaymentData;
        deliveryData: DeliveryData;
        discountData: DiscountData;
        currentStep: number;
      }>;
      if (draft.customerData) setCustomerData(draft.customerData);
      if (draft.selectedProducts) setSelectedProducts(draft.selectedProducts);
      if (draft.paymentData) setPaymentData(draft.paymentData);
      if (draft.deliveryData) setDeliveryData(draft.deliveryData);
      if (draft.discountData) setDiscountData(draft.discountData);
      if (draft.currentStep) setCurrentStep(draft.currentStep);
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Erro ao carregar rascunho', err);
    }
  }, []);

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (isOpen) loadFromLocalStorage();
  }, [isOpen, loadFromLocalStorage]);

  useEffect(() => {
    const timer = setTimeout(() => saveToLocalStorage(), 1000);
    return () => clearTimeout(timer);
  }, [saveToLocalStorage]);

  // handlers
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const key = name as keyof Omit<CustomerData, 'address'>;
    setCustomerData(prev => ({ ...prev, [key]: value } as CustomerData));
    setHasUnsavedChanges(true);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof AddressType;
    setCustomerData(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
    setHasUnsavedChanges(true);
  };

  const handleStateChange = (value: string) => {
    setCustomerData(prev => ({ ...prev, address: { ...prev.address, state: value } }));
    setHasUnsavedChanges(true);
  };

  const handlePaymentChange = (name: keyof PaymentData, value: PaymentData[ keyof PaymentData ]) => {
    setPaymentData(prev => ({ ...prev, [name]: value } as PaymentData));
    setHasUnsavedChanges(true);
  };

  const handleDeliveryChange = (name: keyof DeliveryData, value: DeliveryData[ keyof DeliveryData ]) => {
    if (name === 'type' && value === 'pickup') {
      setDeliveryData(prev => ({ ...prev, fee: 0, type: value as 'pickup' | 'delivery' }));
    } else {
      setDeliveryData(prev => ({ ...prev, [name]: value } as DeliveryData));
    }
    setHasUnsavedChanges(true);
  };

  const handleDiscountChange = (name: keyof DiscountData, value: DiscountData[ keyof DiscountData ]) => {
    setDiscountData(prev => ({ ...prev, [name]: value } as DiscountData));
    setHasUnsavedChanges(true);
  };

  const filteredProducts = useMemo(() => {
    if (searchTerm.length < 2) return [];
    const term = searchTerm.toLowerCase();
    return products.filter(p => (p.name ?? '').toLowerCase().includes(term) || (p.sku ?? '').toLowerCase().includes(term));
  }, [searchTerm, products]);

  const validateCoupon = () => {
    const coupon = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === discountData.couponCode.toUpperCase());
    if (coupon) {
      handleDiscountChange('type', coupon.type as DiscountData['type']);
      handleDiscountChange('value', coupon.value);
      handleDiscountChange('isValidCoupon', true);
      toast.success(`Cupom "${coupon.code}" aplicado!`);
    } else {
      handleDiscountChange('type', 'none');
      handleDiscountChange('value', 0);
      handleDiscountChange('isValidCoupon', false);
      toast.error('Cupom inválido ou não encontrado.');
    }
  };

  const handleProductSelect = useCallback(async (product: Product) => {
    setSelectedProductForVariants(product);
    const variants = await getProductVariantsWithDetails(product.id);
    setProductVariants(variants);
  }, [getProductVariantsWithDetails]);

  const addProductToOrder = (product: Product, variant?: VariantWithDetails) => {
    const orderItem: OrderItemType = {
      product_id: product.id,
      quantity: 1,
      price: variant?.price ?? product.price ?? 0,
      product_name: product.name ?? 'Produto',
      variant_id: variant?.id ?? null,
      size_name: variant?.sizes?.value,
      color_name: variant?.colors?.name
    };
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.product_id === orderItem.product_id && p.variant_id === orderItem.variant_id);
      if (existing) {
        return prev.map(p => (p.product_id === orderItem.product_id && p.variant_id === orderItem.variant_id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, orderItem];
    });
    toast.success(`${orderItem.product_name} adicionado.`);
    setSelectedProductForVariants(null);
    setSearchTerm('');
    setHasUnsavedChanges(true);
  };

  const updateProductQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProductFromOrder(index);
    } else {
      setSelectedProducts(prev => prev.map((item, i) => i === index ? { ...item, quantity: newQuantity } : item));
      setHasUnsavedChanges(true);
    }
  };

  const removeProductFromOrder = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const subtotal = useMemo(() => selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0), [selectedProducts]);

  const discountAmount = useMemo(() => {
    if (discountData.type === 'percentage') return subtotal * (discountData.value / 100);
    if (discountData.type === 'fixed') return discountData.value;
    return 0;
  }, [discountData, subtotal]);

  const totalPrice = useMemo(() => Math.max(0, subtotal - discountAmount + deliveryData.fee), [subtotal, discountAmount, deliveryData.fee]);

  // validações por etapa
  const validateStep = (step: number): { isValid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {};
    if (step === 1) {
      if (!customerData.name.trim()) errors.name = 'Nome é obrigatório';
      if (!customerData.email.trim()) errors.email = 'Email é obrigatório';
      else {
        // checagem básica de email
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(customerData.email)) errors.email = 'Email inválido';
      }
      if (deliveryData.type === 'delivery') {
        const addr = customerData.address;
        if (!addr.street?.trim()) errors['address.street'] = 'Rua é obrigatória';
        if (!addr.number?.toString()?.trim()) errors['address.number'] = 'Número é obrigatório';
        if (!addr.neighborhood?.trim()) errors['address.neighborhood'] = 'Bairro é obrigatório';
        if (!addr.city?.trim()) errors['address.city'] = 'Cidade é obrigatória';
        if (!addr.state?.trim()) errors['address.state'] = 'Estado é obrigatório';
        if (!addr.zipCode?.trim()) errors['address.zipCode'] = 'CEP é obrigatório';
      }
    } else if (step === 2) {
      if (selectedProducts.length === 0) errors.products = 'Adicione pelo menos um produto';
    } else if (step === 3) {
      if (!paymentData.method) errors['payment.method'] = 'Selecione o método de pagamento';
      if (paymentData.method === 'credit_card') {
        if (!paymentData.installments || paymentData.installments < 1) errors['payment.installments'] = 'Parcelas inválidas';
      }
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const nextStep = () => {
    const { isValid, errors } = validateStep(currentStep);
    if (isValid) {
      setValidationErrors({});
      if (currentStep < WIZARD_STEPS.length) setCurrentStep(prev => prev + 1);
    } else {
      setValidationErrors(errors);
      // optional: scroll to top of modal to show errors
    }
  };

  const prevStep = () => {
    setValidationErrors({});
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      if (window.confirm('Você tem alterações não salvas. Deseja realmente sair? Os dados serão perdidos.')) {
        clearLocalStorage();
        onClose();
      }
    } else {
      clearLocalStorage();
      onClose();
    }
  }, [hasUnsavedChanges, clearLocalStorage, onClose]);

  // envia o pedido (valida todas as etapas antes)
  const handleSubmit = async () => {
    // valida todas as etapas
    const step1 = validateStep(1);
    const step2 = validateStep(2);
    const step3 = validateStep(3);
    const allErrors = { ...step1.errors, ...step2.errors, ...step3.errors };
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      // posiciona na etapa do primeiro erro
      if (step1.errors && Object.keys(step1.errors).length) setCurrentStep(1);
      else if (step2.errors && Object.keys(step2.errors).length) setCurrentStep(2);
      else setCurrentStep(3);
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error('Adicione pelo menos um produto.');
      setCurrentStep(2);
      return;
    }

    const newOrderData: NewOrderPayloadExtended = {
      customer_name: customerData.name,
      customer_email: customerData.email,
      address: customerData.address,
      items: selectedProducts,
      delivery_type: deliveryData.type,
      payment_method: paymentData.method,
      total_price: totalPrice,
      status: 'Pendente'
    };

    try {
      await createOrder(newOrderData);
      toast.success('Pedido criado com sucesso!');
      clearLocalStorage();
      setHasUnsavedChanges(false);
      onClose();
    } catch (err) {
      console.error('Erro ao criar pedido', err);
      toast.error('Falha ao criar o pedido. Veja console.');
    }
  };

  // resumo do pedido (lado direito)
  const OrderSummary = () => (
    <Card className="sticky top-0 z-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {selectedProducts.length > 0 ? selectedProducts.map((item, index) => (
            <div key={index} className="flex justify-between items-start text-sm">
              <div>
                <p className="font-semibold">{item.product_name}</p>
                {item.color_name && <p className="text-xs text-gray-500">Cor: {item.color_name}</p>}
                {item.size_name && <p className="text-xs text-gray-500">Tamanho: {item.size_name}</p>}
              </div>
              <div className="text-right">
                <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateProductQuantity(index, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateProductQuantity(index, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          )) : (<p className="text-sm text-gray-500 text-center py-4">Nenhum produto adicionado.</p>)}
        </div>
        <Separator />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Desconto</span><span className="text-green-600">- R$ {discountAmount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Taxa de Entrega</span><span>R$ {deliveryData.fee.toFixed(2)}</span></div>
          <Separator />
          <div className="flex justify-between font-bold text-base"><span>Total</span><span>R$ {totalPrice.toFixed(2)}</span></div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Dados do Cliente</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" name="name" value={customerData.name} onChange={handleCustomerChange} />
                    {validationErrors.name && <p className="text-red-600 text-sm">{validationErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" name="cpf" value={customerData.cpf} onChange={handleCustomerChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={customerData.email} onChange={handleCustomerChange} />
                    {validationErrors.email && <p className="text-red-600 text-sm">{validationErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" name="phone" value={customerData.phone} onChange={handleCustomerChange} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Endereço de Entrega</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-2 md:col-span-4">
                      <Label htmlFor="street">Rua</Label>
                      <Input id="street" name="street" value={customerData.address.street} onChange={handleAddressChange} />
                      {validationErrors['address.street'] && <p className="text-red-600 text-sm">{validationErrors['address.street']}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="number">Número</Label>
                      <Input id="number" name="number" value={customerData.address.number} onChange={handleAddressChange} />
                      {validationErrors['address.number'] && <p className="text-red-600 text-sm">{validationErrors['address.number']}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input id="complement" name="complement" value={customerData.address.complement} onChange={handleAddressChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input id="neighborhood" name="neighborhood" value={customerData.address.neighborhood} onChange={handleAddressChange} />
                      {validationErrors['address.neighborhood'] && <p className="text-red-600 text-sm">{validationErrors['address.neighborhood']}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" name="city" value={customerData.address.city} onChange={handleAddressChange} />
                      {validationErrors['address.city'] && <p className="text-red-600 text-sm">{validationErrors['address.city']}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="state">Estado</Label>
                      <Select name="state" value={customerData.address.state} onValueChange={handleStateChange}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>{BRAZILIAN_STATES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                      </Select>
                      {validationErrors['address.state'] && <p className="text-red-600 text-sm">{validationErrors['address.state']}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input id="zipCode" name="zipCode" value={customerData.address.zipCode} onChange={handleAddressChange} />
                      {validationErrors['address.zipCode'] && <p className="text-red-600 text-sm">{validationErrors['address.zipCode']}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div><OrderSummary /></div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {!selectedProductForVariants ? (
                <>
                  <h4 className="font-semibold">Buscar Produtos</h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Buscar por nome ou SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                  </div>
                  {validationErrors.products && <p className="text-red-600 text-sm">{validationErrors.products}</p>}
                  <div className="border rounded-md min-h-[200px] max-h-[400px] overflow-y-auto">
                    {filteredProducts.map(product => (
                      <div key={product.id} className="flex justify-between items-center p-3 border-b cursor-pointer hover:bg-gray-50" onClick={() => handleProductSelect(product)}>
                        <div>
                          <p>{product.name}</p>
                          <p className="text-sm text-gray-500">{product.description}</p>
                        </div>
                        <Badge variant="outline">{product.sku}</Badge>
                      </div>
                    ))}
                    {searchTerm.length > 1 && filteredProducts.length === 0 && (
                      <p className="text-center text-gray-500 p-4">Nenhum produto encontrado.</p>
                    )}
                  </div>
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Selecione a Variação</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedProductForVariants(null)}>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Voltar para busca
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 pt-2">Produto: <span className="font-semibold">{selectedProductForVariants?.name}</span></p>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                    {productVariants.length > 0 ? productVariants.map(variant => (
                      <div key={variant.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                        <div>
                          <span className="font-medium">Cor:</span> {variant.colors?.name ?? 'N/A'} | <span className="font-medium">Tamanho:</span> {variant.sizes?.value ?? 'N/A'}
                          <p className="text-sm text-gray-500">SKU: {variant.sku} | Estoque: {variant.stock_quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">R$ {variant.price?.toFixed(2)}</p>
                          <Button size="sm" onClick={() => addProductToOrder(selectedProductForVariants!, variant)} className="bg-[#5932EA] hover:bg-[#4A28C7] mt-1">Adicionar</Button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center p-4">
                        <p className="text-gray-600">Este produto não possui variações cadastradas.</p>
                        <Button size="sm" onClick={() => addProductToOrder(selectedProductForVariants!)} className="bg-[#5932EA] hover:bg-[#4A28C7] mt-4">Adicionar mesmo assim</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div><OrderSummary /></div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Pagamento</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Método de Pagamento</Label>
                    <Select value={paymentData.method} onValueChange={(value) => handlePaymentChange('method', value as PaymentData['method'])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                        <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors['payment.method'] && <p className="text-red-600 text-sm">{validationErrors['payment.method']}</p>}
                  </div>

                  {paymentData.method === 'credit_card' && (
                    <div>
                      <Label htmlFor="installments">Parcelas</Label>
                      <Input id="installments" type="number" min={1} value={paymentData.installments} onChange={(e) => handlePaymentChange('installments', parseInt(e.target.value || '1', 10))} />
                      {validationErrors['payment.installments'] && <p className="text-red-600 text-sm">{validationErrors['payment.installments']}</p>}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="payment_notes">Observações do Pagamento</Label>
                    <Textarea id="payment_notes" value={paymentData.notes} onChange={(e) => handlePaymentChange('notes', e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Entrega</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tipo de Entrega</Label>
                    <RadioGroup value={deliveryData.type} onValueChange={(value) => handleDeliveryChange('type', value as DeliveryData['type'])} className="flex gap-4">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="delivery" id="delivery" /><Label htmlFor="delivery">Entrega</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="pickup" id="pickup" /><Label htmlFor="pickup">Retirada no local</Label></div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="delivery_date">Data</Label><Input id="delivery_date" type="date" value={deliveryData.date} onChange={(e) => handleDeliveryChange('date', e.target.value)} /></div>
                    <div><Label htmlFor="delivery_time">Hora</Label><Input id="delivery_time" type="time" value={deliveryData.time} onChange={(e) => handleDeliveryChange('time', e.target.value)} /></div>
                  </div>

                  {deliveryData.type === 'delivery' && (
                    <div>
                      <Label htmlFor="delivery_fee">Taxa de Entrega</Label>
                      <Input id="delivery_fee" type="number" value={deliveryData.fee} onChange={(e) => handleDeliveryChange('fee', parseFloat(e.target.value || '0'))} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Descontos e Cupons</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="Digite o código do cupom" value={discountData.couponCode} onChange={(e) => handleDiscountChange('couponCode', e.target.value.toUpperCase())} />
                    <Button onClick={validateCoupon} className="bg-[#5932EA] hover:bg-[#4A28C7]">Aplicar</Button>
                  </div>

                  {discountData.isValidCoupon && (
                    <Alert variant="default" className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        Cupom válido aplicado! ({AVAILABLE_COUPONS.find(c => c.code === discountData.couponCode)?.description})
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            <div><OrderSummary /></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Adicionar Novo Pedido</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-6">
          {WIZARD_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isActive ? 'border-[#5932EA] bg-[#5932EA] text-white' : isCompleted ? 'border-[#5932EA] bg-[#5932EA] text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-[#5932EA]' : 'text-gray-500'}`}>{`Etapa ${step.id}`}</p>
                    <p className={`text-xs ${isActive || isCompleted ? 'text-[#5932EA]' : 'text-gray-500'}`}>{step.title}</p>
                  </div>
                </div>
                {index < WIZARD_STEPS.length - 1 && (<div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-[#5932EA]' : 'bg-gray-300'}`} />)}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto pr-4 -mr-4">{renderStepContent()}</div>

        <DialogFooter className="flex justify-between pt-4 mt-auto border-t">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
            {currentStep > 1 && (<Button variant="outline" onClick={prevStep}><ChevronLeft className="h-4 w-4 mr-1" /> Anterior</Button>)}
          </div>
          <div className="flex gap-2">
            {currentStep < WIZARD_STEPS.length ? (
              <Button onClick={nextStep} className="bg-[#5932EA] hover:bg-[#4A28C7]">
                Próximo <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-[#5932EA] hover:bg-[#4A28C7]">
                Finalizar Pedido
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
