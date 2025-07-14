import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { useData, Order, OrderProduct } from '../context/DataContext';
import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import KanbanBoard from "../components/KanbanBoard";
import CRM from "./CRM";
import Estoque from "./Estoque";
import Financeiro from "./Financeiro";
import { LogOut, BarChart3, ShoppingCart, Users, Package, DollarSign, ArrowUpRight, ExternalLink, CheckCircle, Trash2, PlusCircle, Phone, Mail } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarInset } from "../components/ui/sidebar";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

// --- Componentes de Suporte ---
const StatCard = ({ title, value, change, icon: Icon }: { title: string, value: string, change: string, icon: React.ElementType }) => ( <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col"><div className="flex-grow"><div className="flex justify-between items-start mb-4"><h3 className="text-sm font-medium text-gray-500">{title}</h3><Icon className="w-5 h-5 text-gray-400" /></div><p className="text-3xl font-bold text-gray-900 mb-1">{value}</p></div><div className="flex items-center text-xs text-green-600 mt-2"><ArrowUpRight className="w-4 h-4 mr-1" /><span>{change}</span></div></div> );
const DashboardCard = ({ title, children, className = '' }: { title: string, children: React.ReactNode, className?: string }) => ( <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col ${className}`}><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-gray-900">{title}</h3></div><div className="flex-grow">{children}</div></div> );
const getStatusBadge = (status: string) => { switch (status) { case "Concluído": return <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">{status}</Badge>; case "Em processamento": return <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">{status}</Badge>; case "Cancelado": return <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">{status}</Badge>; default: return <Badge variant="secondary">{status}</Badge>; } };
const menuItems = [{ title: "Vendas", icon: ShoppingCart, url: "/dashboard" }, { title: "CRM", icon: Users, url: "/dashboard/crm" }, { title: "Estoque", icon: Package, url: "/dashboard/estoque" }, { title: "Financeiro", icon: DollarSign, url: "/dashboard/financeiro" }];
const mockRecentOrders = [ { id: 121, customerName: 'Maria Silva', productName: 'Vans Old Skool', value: 'R$ 799,99', status: 'Concluído', origin: 'E-commerce' }, { id: 122, customerName: 'João Santos', productName: 'Nike Air Force', value: 'R$ 549,99', status: 'Em processamento', origin: 'Instagram' }, { id: 124, customerName: 'Matheus Oliveira', productName: 'Tênis Nike', value: 'R$ 449,99', status: 'Cancelado', origin: 'WhatsApp' }, ];

// --- Componente Principal ---
const Dashboard = () => {
    const { products: productCatalog, updateOrder, isSuccessModalOpen, successModalMessage, closeSuccessModal } = useData();
    const [session, setSession] = useState<Session | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => { if (!session) { navigate("/auth"); } else { setSession(session); } });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { if (!session) { navigate('/auth'); } else { setSession(session); } });
        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = () => supabase.auth.signOut().then(() => navigate("/"));
    const handleOrderCardClick = (orderData: Order) => { setSelectedOrder(JSON.parse(JSON.stringify(orderData))); setIsOrderDetailModalOpen(true); setIsEditing(false); };
    const handleSave = () => { if (selectedOrder) { updateOrder(selectedOrder.id, selectedOrder.products); } setIsEditing(false); };
    const handleProductChange = (index: number, field: keyof OrderProduct, value: string | number) => { setSelectedOrder(prevOrder => { if (!prevOrder) return null; const newProducts = [...prevOrder.products]; const updatedProduct = { ...newProducts[index], [field]: value }; if (field === 'name') { const productFromCatalog = productCatalog.find(p => p.name === value); if (productFromCatalog) { updatedProduct.id = productFromCatalog.id; updatedProduct.sku = productFromCatalog.sku; updatedProduct.price = productFromCatalog.price; updatedProduct.color = ''; updatedProduct.size = ''; } } newProducts[index] = updatedProduct; return { ...prevOrder, products: newProducts }; }); };
    const handleAddProduct = () => { setSelectedOrder(prevOrder => { if (!prevOrder) return null; const defaultProduct = productCatalog[0]; const newProduct: OrderProduct = { id: defaultProduct.id, sku: defaultProduct.sku, name: defaultProduct.name, color: '', size: '', quantity: 1, price: defaultProduct.price, }; return { ...prevOrder, products: [...prevOrder.products, newProduct] }; }); };
    const handleRemoveProduct = (index: number) => { setSelectedOrder(prevOrder => { if (!prevOrder || prevOrder.products.length <= 1) return prevOrder; const newProducts = prevOrder.products.filter((_, i) => i !== index); return { ...prevOrder, products: newProducts }; }); };
    const handleClientInfoChange = (field: string, value: string) => { setSelectedOrder(prevOrder => { if (!prevOrder) return null; const keys = field.split('.'); const newOrder = JSON.parse(JSON.stringify(prevOrder)); let current = newOrder; for (let i = 0; i < keys.length - 1; i++) { current = current[keys[i]]; } current[keys[keys.length - 1]] = value; return newOrder; }); };

    if (!session) { return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>; }

    const getPageTitle = () => { const pathMap: { [key: string]: string } = { '/dashboard/crm': 'CRM', '/dashboard/estoque': 'Estoque', '/dashboard/financeiro': 'Financeiro', }; return pathMap[location.pathname] || 'Dashboard de Vendas'; };

    const renderContent = () => {
        const pathMap: { [key: string]: JSX.Element } = { '/dashboard/crm': <CRM />, '/dashboard/estoque': <Estoque />, '/dashboard/financeiro': <Financeiro />, };
        if (pathMap[location.pathname]) { return pathMap[location.pathname]; }
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><StatCard title="Vendas Hoje" value="R$ 12.450" change="+12%" icon={DollarSign} /><StatCard title="Pedidos" value="156" change="+8%" icon={ShoppingCart} /><StatCard title="Taxa de conversão" value="47,9%" change="+1.5%" icon={BarChart3} /><StatCard title="Receita Mensal" value="R$ 284.750" change="+20%" icon={DollarSign} /></div>
                <DashboardCard title="Controle de Pedidos"><p className="text-sm text-gray-500 mb-4 -mt-4">Clique no ícone <ExternalLink className="inline h-3 w-3" /> para ver os detalhes do pedido.</p><KanbanBoard onCardClick={handleOrderCardClick} /></DashboardCard>
                <DashboardCard title="Pedidos Recentes"><ul className="space-y-4">{mockRecentOrders.map((order) => ( <li key={order.id} className="flex items-center justify-between"><div className="flex items-center space-x-3"><div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-gray-500" /></div><div><p className="font-semibold text-gray-800">{order.customerName}</p><p className="text-xs text-gray-500">{order.productName} - Pedido #{order.id}</p></div></div><div className="text-right"><p className="font-semibold text-gray-800">{order.value}</p>{getStatusBadge(order.status)}</div></li> ))}</ul></DashboardCard>
            </div>
        );
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gray-50">
                <Sidebar>
                    <SidebarContent>
                        <div className="p-4">
                            <Link to="/dashboard" className="flex items-center space-x-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-lg flex items-center justify-center">
                                    <img src="/logo.svg" alt="Logo Evolux360" className="w-5 h-5" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">Evolux360</span>
                            </Link>
                        </div>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {menuItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <Link to={item.url} className={`flex items-center space-x-2 p-2 rounded-md ${location.pathname === item.url ? 'bg-gray-100 text-[#5932EA] font-semibold' : 'hover:bg-gray-100/50'}`}>
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-40">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <SidebarTrigger />
                                <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                            </div>
                            {session && (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-600">Olá, {session.user.email?.split('@')[0]}</span>
                                    <Button onClick={handleLogout} variant="outline" size="sm">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sair
                                    </Button>
                                </div>
                            )}
                        </div>
                    </header>
                    <main className="p-4 md:p-8">
                        {renderContent()}
                    </main>
                </SidebarInset>
            </div>

            <Dialog open={isOrderDetailModalOpen} onOpenChange={setIsOrderDetailModalOpen}>
              {/* ... conteúdo do modal de detalhes do pedido ... */}
            </Dialog>

            <Dialog open={isSuccessModalOpen} onOpenChange={closeSuccessModal}>
              {/* ... conteúdo do modal de sucesso ... */}
            </Dialog>
        </SidebarProvider>
    );
};

export default Dashboard;