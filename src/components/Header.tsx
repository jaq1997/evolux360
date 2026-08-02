import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import * as React from "react";
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
import { useState } from "react";

const features: { title: string; href: string; description: string }[] = [
  {
    title: "Automação Inteligente",
    href: "/features/automacao-inteligente",
    description: "Reduza o trabalho manual e foque no que realmente importa: crescer.",
  },
  {
    title: "Integração 360°",
    href: "#",
    description: "Conecte marketplaces, ERPs e transportadoras em um só lugar.",
  },
  {
    title: "Business Intelligence",
    href: "#",
    description: "Dados em tempo real para decisões estratégicas e lucros maiores.",
  },
  {
    title: "Gestão Omnichannel",
    href: "#",
    description: "Controle estoque e vendas de todos os canais sem esforço.",
  },
];

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo-com-tagline.svg" alt="Evolux360" className="h-10 w-auto" />
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#como-funciona" className="font-semibold text-gray-600 hover:text-[#5932EA] transition-colors text-sm">Como funciona</a>
          <a href="#solucoes" className="font-semibold text-gray-600 hover:text-[#5932EA] transition-colors text-sm">Soluções</a>
          <a href="#sobre" className="font-semibold text-gray-600 hover:text-[#5932EA] transition-colors text-sm">Sobre</a>
          <a href="#diferenciais" className="font-semibold text-gray-600 hover:text-[#5932EA] transition-colors text-sm">Diferenciais</a>
        </nav>
        
        {/* Botão Único de Destaque Desktop */}
        <div className="hidden md:flex items-center">
          <a href="https://forms.gle/Too6zAkpvu3uUDjf8" target="_blank" rel="noopener noreferrer">
            <Button className="bg-[#6C4FF0] hover:bg-[#5932EA] text-white font-bold h-11 px-7 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 text-sm">
              Falar com a Evolux
            </Button>
          </a>
        </div>

        {/* Botão do Menu Hambúrguer (Mobile) */}
        <div className="md:hidden">
          <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variant="ghost" size="icon">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Painel do Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-40 border-b border-gray-100">
          <div className="container mx-auto flex flex-col p-6 space-y-4">
            <a href="#como-funciona" className="py-2 text-base font-bold text-gray-900 hover:text-[#5932EA]" onClick={() => setIsMobileMenuOpen(false)}>
              Como funciona
            </a>
            <a href="#solucoes" className="py-2 text-base font-bold text-gray-900 hover:text-[#5932EA]" onClick={() => setIsMobileMenuOpen(false)}>
              Soluções
            </a>
            <a href="#sobre" className="py-2 text-base font-bold text-gray-900 hover:text-[#5932EA]" onClick={() => setIsMobileMenuOpen(false)}>
              Sobre
            </a>
            <a href="#diferenciais" className="py-2 text-base font-bold text-gray-900 hover:text-[#5932EA]" onClick={() => setIsMobileMenuOpen(false)}>
              Diferenciais
            </a>
            <div className="border-t border-gray-100 pt-4">
              <a href="https://forms.gle/Too6zAkpvu3uUDjf8" target="_blank" rel="noopener noreferrer" className="w-full block" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-[#6C4FF0] text-white font-bold h-12 rounded-full">
                  Falar com a Evolux
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
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