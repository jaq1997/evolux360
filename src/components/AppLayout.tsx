import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { 
  BarChart3, ShoppingCart, Users, Package, DollarSign, Settings, LogOut, ChevronUp, Sparkles
} from "lucide-react";
import { 
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarFooter 
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EvoluxAIChat } from "@/components/EvoluxAIChat";

const menuItems = [
  { title: "Dashboard", icon: BarChart3, url: "/dashboard" },
  { title: "Vendas", icon: ShoppingCart, url: "/dashboard/vendas" },
  { title: "Clientes", icon: Users, url: "/dashboard/crm" },
  { title: "Produtos", icon: Package, url: "/dashboard/estoque" },
  { title: "Financeiro", icon: DollarSign, url: "/dashboard/financeiro" },
  { title: "Relatórios", icon: Sparkles, url: "/dashboard/relatorios" },
];

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoading(false);
      if (!session && localStorage.getItem('demo_mode') !== 'true') {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && localStorage.getItem('demo_mode') !== 'true') {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    if (localStorage.getItem('demo_mode') === 'true') {
        localStorage.removeItem('demo_mode');
        navigate("/");
        return;
    }
    await supabase.auth.signOut();
    navigate("/");
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/dashboard/configuracoes") return "Configurações";
    const activeItem = menuItems.slice().reverse().find(item => currentPath.startsWith(item.url));
    return activeItem?.title || 'Dashboard';
  };
  
  const isLinkActive = (itemUrl: string) => {
    if (itemUrl === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(itemUrl);
  };

  if (isSessionLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5932EA] mx-auto"></div>
        <p className="mt-2 text-gray-600">Verificando sessão...</p>
      </div>
    </div>
  );

  const userEmail = session?.user?.email || "Admin Demo";
  const userName = session?.user?.user_metadata?.full_name || userEmail.split('@')[0];
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-100" collapsible="icon">
          <SidebarContent>
            <div className="p-6 flex items-center justify-between group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mt-4">
              <Link to="/dashboard" className="flex items-center group-data-[collapsible=icon]:hidden">
                <img src="/logo-com-tagline.svg" alt="Evolux360" className="h-10 w-auto" />
              </Link>
              <SidebarTrigger className="hidden md:flex group-data-[collapsible=icon]:mx-auto" />
            </div>
            <SidebarGroup>
              <SidebarGroupContent className="px-2 group-data-[collapsible=icon]:px-0">
                <SidebarMenu className="group-data-[collapsible=icon]:items-center">
                  {menuItems.map((item) => {
                    const active = isLinkActive(item.url);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          tooltip={item.title} 
                          isActive={active}
                          size="lg"
                          className={`rounded-xl transition-all duration-200 ${
                            active 
                              ? 'bg-[#5932EA] text-white hover:bg-[#4A28C7] hover:text-white shadow-md shadow-purple-100 font-semibold data-[active=true]:bg-[#5932EA] data-[active=true]:text-white group-data-[collapsible=icon]:!bg-[#5932EA]' 
                              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                          } group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:justify-center`}
                        >
                          <Link to={item.url} className="flex items-center gap-3">
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : ''}`} />
                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t border-gray-100 group-data-[collapsible=icon]:p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 w-full p-2 rounded-xl hover:bg-gray-100 transition-colors text-left group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:bg-transparent">
                  <Avatar className="h-9 w-9 border-2 border-purple-100 flex-shrink-0 group-data-[collapsible=icon]:mx-auto">
                    <AvatarFallback className="bg-purple-50 text-[#5932EA] font-bold">{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                  <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 group-data-[collapsible=icon]:hidden" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mb-2">
                <DropdownMenuItem className="text-gray-600 p-0" asChild>
                  <Link to="/dashboard/configuracoes" className="w-full flex items-center px-2 py-1.5 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" /> Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Sair do Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-w-0">
          <ScrollArea className="flex-grow">
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-40">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger className="md:hidden" />
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    {localStorage.getItem('demo_mode') === 'true' && (
                      <Badge variant="outline" className="bg-purple-50 text-[#5932EA] border-purple-100 px-3 py-1">
                        Modo Demo Ativo
                      </Badge>
                    )}
                </div>
              </div>
            </header>
            
            <main className="p-6">
              {children}
            </main>
          </ScrollArea>
        </div>
      </div>
      {/* Evolux AI - Chat Flutuante Global */}
      <EvoluxAIChat />
    </SidebarProvider>
  );
};
