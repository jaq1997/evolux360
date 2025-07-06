
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import KanbanBoard from "@/components/KanbanBoard";
import CRM from "./CRM";
import Estoque from "./Estoque";
import Financeiro from "./Financeiro";
import { LogOut, Settings, Briefcase, Bot, BarChart3, ShoppingCart, Users, Package, DollarSign } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Vendas", icon: ShoppingCart, url: "/dashboard" },
  { title: "CRM", icon: Users, url: "/dashboard/crm" },
  { title: "Estoque", icon: Package, url: "/dashboard/estoque" },
  { title: "Financeiro", icon: DollarSign, url: "/dashboard/financeiro" },
];

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  // Determine which component to render based on the route
  const renderContent = () => {
    const currentPath = location.pathname;
    switch (currentPath) {
      case '/dashboard/crm':
        return <CRM />;
      case '/dashboard/estoque':
        return <Estoque />;
      case '/dashboard/financeiro':
        return <Financeiro />;
      default:
        return (
          <>
            <div className="mb-8">
              <KanbanBoard />
            </div>

            {/* BI Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Intelligence</h2>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Relatórios e Análises</h3>
                    <p className="text-gray-500">Dashboards e métricas em desenvolvimento</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Conheça nossos outros produtos</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <Bot className="w-10 h-10 text-[#5932EA] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Agente SDR</h3>
                  <p className="text-gray-600 mb-4">Um agente de pré-vendas que qualifica leads e agenda reuniões automaticamente.</p>
                  <Button variant="outline">Em breve</Button>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <Briefcase className="w-10 h-10 text-[#5932EA] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Agente Closer</h3>
                  <p className="text-gray-600 mb-4">Um agente de fechamento que negocia e finaliza vendas de forma autônoma.</p>
                  <Button variant="outline">Em breve</Button>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  // Get page title based on route
  const getPageTitle = () => {
    const currentPath = location.pathname;
    switch (currentPath) {
      case '/dashboard/crm':
        return 'CRM';
      case '/dashboard/estoque':
        return 'Estoque';
      case '/dashboard/financeiro':
        return 'Financeiro';
      default:
        return 'Dashboard de Vendas';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Evolux360</span>
              </div>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.url} 
                          className={`flex items-center space-x-2 ${
                            location.pathname === item.url ? 'bg-muted text-primary font-medium' : 'hover:bg-muted/50'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Olá, {session.user.email}</span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-8">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
