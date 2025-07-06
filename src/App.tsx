
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// 1. Importe os componentes que criamos
import { Header } from "./components/Header"; // Ajuste o caminho se necessário
import { Footer } from "./components/Footer"; // Ajuste o caminho se necessário

// 2. Importe suas páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AutomacaoInteligente from "./pages/features/AutomacaoInteligente";

const queryClient = new QueryClient();

// 3. Defina o componente de Layout aqui
const AppLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 4. Rota principal que usa o Layout com Header e Footer */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Index />} />
            <Route path="products" element={<Products />} />
            <Route path="features/automacao-inteligente" element={<AutomacaoInteligente />} />
          </Route>

          {/* 5. Rotas que NÃO usam o layout principal */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/crm" element={<Dashboard />} />
          <Route path="/dashboard/estoque" element={<Dashboard />} />
          <Route path="/dashboard/financeiro" element={<Dashboard />} />
          
          {/* Rota "Catch-all" para página não encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;