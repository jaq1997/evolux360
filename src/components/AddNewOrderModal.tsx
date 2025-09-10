import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { Search, Plus, Minus, ChevronLeft, ChevronRight, User, Package, CreditCard, MapPin, Phone, Mail, Tag, Save, X, ShoppingCart, Check, AlertCircle, Truck } from 'lucide-react';
import { useData, Product, Order } from '../context/DataContext';
import { toast } from 'sonner';

interface AddNewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  variant_id?: number | null;
  size_name?: string;
  color_name?: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
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
  notes: string;
}

interface DiscountData {
  type: 'none' | 'percentage' | 'fixed' | 'coupon';
  value: number;
  couponCode: string;
  isValidCoupon: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

const WIZARD_STEPS = [
  { id: 1, title: 'Cliente & Endereço', icon: User },
  { id: 2, title: 'Produtos', icon: Package },
  { id: 3, title: 'Pagamento & Entrega', icon: CreditCard }
];

const AVAILABLE_COUPONS = [
  { code: 'DESCONTO10', type: 'percentage', value: 10, description: '10% de desconto' },
  { code: 'FRETE20', type: 'fixed', value: 20, description: 'R$ 20 de desconto' },
];

const BRAZILIAN_STATES = [ { value: 'AC', label: 'Acre' }, { value: 'AL', label: 'Alagoas' }, { value: 'AP', label: 'Amapá' }, { value: 'AM', label: 'Amazonas' }, { value: 'BA', label: 'Bahia' }, { value: 'CE', label: 'Ceará' }, { value: 'DF', label: 'Distrito Federal' }, { value: 'ES', label: 'Espírito Santo' }, { value: 'GO', label: 'Goiás' }, { value: 'MA', label: 'Maranhão' }, { value: 'MT', label: 'Mato Grosso' }, { value: 'MS', label: 'Mato Grosso do Sul' }, { value: 'MG', label: 'Minas Gerais' }, { value: 'PA', label: 'Pará' }, { value: 'PB', label: 'Paraíba' }, { value: 'PR', label: 'Paraná' }, { value: 'PE', label: 'Pernambuco' }, { value: 'PI', label: 'Piauí' }, { value: 'RJ', label: 'Rio de Janeiro' }, { value: 'RN', label: 'Rio Grande do Norte' }, { value: 'RS', label: 'Rio Grande do Sul' }, { value: 'RO', label: 'Rondônia' }, { value: 'RR', label: 'Roraima' }, { value: 'SC', label: 'Santa Catarina' }, { value: 'SP', label: 'São Paulo' }, { value: 'SE', label: 'Sergipe' }, { value: 'TO', label: 'Tocantins' } ];


export const AddNewOrderModal: React.FC<AddNewOrderModalProps> = ({ isOpen, onClose }) => {
  const { createOrder, searchProducts, getProductVariantsWithDetails } = useData();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [customerData, setCustomerData] = useState<CustomerData>({ name: '', email: '', phone: '', cpf: '', address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' } });
  const [selectedProducts, setSelectedProducts] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [productVariants, setProductVariants] = useState<any[]>([]);
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<Product | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData>({ method: 'credit_card', installments: 1, notes: '' });
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({ type: 'pickup', date: '', time: '', fee: 0, notes: '' });
  const [discountData, setDiscountData] = useState<DiscountData>({ type: 'none', value: 0, couponCode: '', isValidCoupon: false });

  const saveToLocalStorage = useCallback(() => {
    const orderData = { currentStep, customerData, selectedProducts, paymentData, deliveryData, discountData };
    localStorage.setItem('draft_order', JSON.stringify(orderData));
  }, [currentStep, customerData, selectedProducts, paymentData, deliveryData, discountData]);

  const loadFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem('draft_order');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentStep(data.currentStep || 1);
        setCustomerData(data.customerData || customerData);
        setSelectedProducts(data.selectedProducts || []);
        setPaymentData(data.paymentData || paymentData);
        setDeliveryData(data.deliveryData || deliveryData);
        setDiscountData(data.discountData || discountData);
        setHasUnsavedChanges(true);
        toast.info('Rascunho carregado automaticamente');
      } catch (error) {
        console.error('Erro ao carregar rascunho:', error);
      }
    }
  }, []);

  const clearLocalStorage = () => {
    localStorage.removeItem('draft_order');
    setHasUnsavedChanges(false);
  };

  useEffect(() => {
    if (!isOpen) {
      // Resetar todos os estados
      setCurrentStep(1);
      setValidationErrors({});
      setCustomerData({ name: '', email: '', phone: '', cpf: '', address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' } });
      setSelectedProducts([]);
      setSearchTerm('');
      setSearchResults([]);
      setIsSearching(false);
      setProductVariants([]);
      setSelectedProductForVariants(null);
      setPaymentData({ method: 'credit_card', installments: 1, notes: '' });
      setDeliveryData({ type: 'pickup', date: '', time: '', fee: 0, notes: '' });
      setDiscountData({ type: 'none', value: 0, couponCode: '', isValidCoupon: false });
      setHasUnsavedChanges(false);
    } else {
      loadFromLocalStorage();
    }
  }, [isOpen, loadFromLocalStorage]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        saveToLocalStorage();
        setHasUnsavedChanges(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, customerData, selectedProducts, paymentData, deliveryData, discountData, saveToLocalStorage]);

  const validateCoupon = (code: string) => {
    const coupon = AVAILABLE_COUPONS.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (coupon) {
      setDiscountData(prev => ({ ...prev, type: coupon.type as any, value: coupon.value, isValidCoupon: true }));
      toast.success(`Cupom aplicado: ${coupon.description}`);
    } else {
      setDiscountData(prev => ({ ...prev, type: 'none', value: 0, isValidCoupon: false }));
      toast.error('Cupom inválido');
    }
  };

  const handleSearch = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 2) {
      setIsSearching(true);
      try {
        const results = await searchProducts(term);
        setSearchResults(results);
      } catch (error) {
        toast.error('Erro ao buscar produtos.');
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  }, [searchProducts]);

  const handleProductSelect = useCallback(async (product: Product) => {
    setSelectedProductForVariants(product);
    try {
      const variants = await getProductVariantsWithDetails(product.id);
      setProductVariants(variants);
    } catch (error) {
      console.error('Erro ao buscar variações:', error);
      setProductVariants([]);
    }
  }, [getProductVariantsWithDetails]);

  const addProductToOrder = (product: Product, variant?: any) => {
    const orderItem: OrderItem = {
      product_id: product.id,
      quantity: 1,
      price: variant?.price || product.price || 0,
      product_name: product.name || 'Produto Desconhecido',
      variant_id: variant?.id || null,
      size_name: variant?.sizes?.value,
      color_name: variant?.colors?.name
    };
    setSelectedProducts(prev => {
      const existingItemIndex = prev.findIndex(item => item.product_id === product.id && item.variant_id === (variant?.id || null));
      if (existingItemIndex >= 0) {
        return prev.map((item, index) => index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, orderItem];
      }
    });
    setSearchTerm('');
    setSearchResults([]);
    setSelectedProductForVariants(null);
    setProductVariants([]);
    toast.success('Produto adicionado ao pedido');
  };

  const updateProductQuantity = (index: number, newQuantity: number) => {
    setSelectedProducts(prev => {
      if (newQuantity <= 0) {
        return prev.filter((_, i) => i !== index);
      } else {
        return prev.map((item, i) => i === index ? { ...item, quantity: newQuantity } : item);
      }
    });
  };

  const removeProductFromOrder = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
    toast.success('Produto removido do pedido');
  };

  const subtotal = useMemo(() => selectedProducts.reduce((sum, item) => sum + (item.quantity * item.price), 0), [selectedProducts]);
  const discountAmount = useMemo(() => { /* ... sua lógica ... */ return 0; }, [discountData, subtotal]);
  const totalPrice = useMemo(() => Math.max(0, subtotal - discountAmount + deliveryData.fee), [subtotal, discountAmount, deliveryData.fee]);

  const validateStep = (step: number): { isValid: boolean; errors: ValidationErrors } => { /* ... sua lógica ... */ return { isValid: true, errors: {} }; };

  const nextStep = () => {
    const validation = validateStep(currentStep);
    setValidationErrors(validation.errors);
    if (validation.isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (!validation.isValid) {
      toast.error('Corrija os erros antes de continuar.');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({});
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        clearLocalStorage();
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSubmit = async () => { /* ... sua lógica ... */ };

  const OrderSummary = () => ( <Card className="sticky top-0 z-10"> {/* ... seu JSX do resumo ... */} </Card> );

  const renderStepContent = () => { /* ... seu JSX das etapas ... */ return null; };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Adicionar Novo Pedido</DialogTitle>
           <button onClick={handleClose} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        <div className="flex items-center justify-between mb-6">
          {WIZARD_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const validation = validateStep(step.id);
            const hasErrors = !validation.isValid && currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    hasErrors ? 'border-red-500 bg-red-500 text-white' : 
                    isActive ? 'border-[#5932EA] bg-[#5932EA] text-white' : 
                    isCompleted ? 'border-[#5932EA] bg-[#5932EA] text-white' : // Roxo aqui
                    'border-gray-300 bg-white text-gray-500'
                }`}>
                  {hasErrors ? <AlertCircle className="h-5 w-5" /> : isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                      hasErrors ? 'text-red-600' : 
                      isActive ? 'text-[#5932EA]' : 
                      isCompleted ? 'text-[#5932EA]' : 'text-gray-500' // Roxo aqui
                  }`}>
                    Etapa {step.id}
                  </p>
                  <p className={`text-xs ${
                      hasErrors ? 'text-red-600' : 
                      isActive ? 'text-[#5932EA]' : 
                      isCompleted ? 'text-[#5932EA]' : 'text-gray-500' // Roxo aqui
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${isCompleted && !hasErrors ? 'bg-[#5932EA]' : 'bg-gray-300'}`} /> // Roxo aqui
                )}
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto pr-4 -mr-4">
          {renderStepContent()}
        </div>

        <DialogFooter className="flex justify-between pt-4 mt-auto border-t">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
            {currentStep > 1 && ( <Button variant="outline" onClick={prevStep}> <ChevronLeft className="h-4 w-4 mr-1" /> Anterior </Button> )}
          </div>
          <div className="flex gap-2">
            {currentStep < 3 ? (
              <Button onClick={nextStep} className="bg-[#5932EA] hover:bg-[#4A28C7]"> Próximo <ChevronRight className="h-4 w-4 ml-1" /> </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-[#5932EA] hover:bg-[#4A28C7]"> Finalizar Pedido </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};