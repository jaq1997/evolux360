// src/components/layout/Header.tsx

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const features: { title: string; href: string; description: string }[] = [
  {
    title: "Automação Inteligente",
    href: "/features/automacao-inteligente",
    description: "Processos automatizados que economizam tempo e reduzem erros.",
  },
  {
    title: "Integração Total",
    href: "#",
    description: "Conecte todos seus canais de venda em uma única plataforma.",
  },
  {
    title: "Relatórios Avançados",
    href: "#",
    description: "Análises detalhadas para decisões estratégicas assertivas.",
  },
  {
    title: "Gestão Unificada",
    href: "#",
    description: "Controle total de vendas, estoque e relacionamento com clientes.",
  },
];

export const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-lg flex items-center justify-center">
            <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">Evolux360</span>
        </Link>
        <nav className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={navigationMenuTriggerStyle()}>
                  Início
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/products" className={navigationMenuTriggerStyle()}>
                  Nossas Soluções
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                  Funcionalidades
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {features.map((feature) => (
                      <ListItem
                        key={feature.title}
                        title={feature.title}
                        to={feature.href}
                      >
                        {feature.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* O item de menu "Suporte" foi removido daqui */}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button onClick={handleLogout} variant="outline" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="text-[#5932EA] border-[#5932EA] hover:bg-[#5932EA] hover:text-white" 
                onClick={() => navigate('/auth')}
              >
                Entrar
              </Button>
              <Button className="bg-[#5932EA] text-white hover:bg-[#4A28C7] shadow-lg" onClick={() => navigate('/products')}>
                Conheça nossas soluções
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { to: string; title: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link to={to} ref={ref} className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";