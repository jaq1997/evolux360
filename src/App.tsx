
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AutomacaoInteligente from "./pages/features/AutomacaoInteligente";

// NOVO: Importar o componente para a página de atualização de senha
import { UpdatePasswordForm } from "./components/Auth/UpdatePasswordForm";

import { DataProvider } from "./context/DataContext";

const queryClient = new QueryClient();

const AppLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner richColors />
        <DataProvider>
          <BrowserRouter>
            <AuthHandler />
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Index />} />
                <Route path="products" element={<Products />} />
                <Route path="features/automacao-inteligente" element={<AutomacaoInteligente />} />
              </Route>
              <Route path="/auth" element={<Auth />} />

              <Route 
                path="/update-password" 
                element={
                  <div className="min-h-screen w-full flex justify-center items-center bg-gray-50">
                    <UpdatePasswordForm />
                  </div>
                }
              />

              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Componente para lidar com eventos de autenticação globais
const AuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        console.log("Evento de recuperação de senha detectado!");
        navigate("/update-password");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

export default App;