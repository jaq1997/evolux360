// src/App.tsx - VERSÃO ATUALIZADA

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<Products />} />
              <Route path="features/automacao-inteligente" element={<AutomacaoInteligente />} />
            </Route>
            <Route path="/auth" element={<Auth />} />

            {/* ROTA ADICIONADA AQUI */}
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

export default App;