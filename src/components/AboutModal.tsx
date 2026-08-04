import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, TrendingUp, Package, Database, BrainCircuit, Target, ArrowRight } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-gray-100 shadow-2xl bg-white">
        <DialogHeader className="text-left space-y-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5932EA]/10 flex items-center justify-center p-2">
              <img src="/icone-colorido.svg" alt="Evolux360" className="w-full h-full object-contain" />
            </div>
            <div>
              <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                Sobre a Evolux360
              </DialogTitle>
              <DialogDescription className="text-[#5932EA] font-bold text-xs">
                Tecnologia Prática para o Pequeno e Médio Negócio
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 text-gray-600 font-medium text-xs md:text-sm leading-relaxed">
          {/* Foco e Propósito */}
          <div className="bg-purple-50/80 p-5 rounded-2xl border border-purple-100">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#5932EA] mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Nosso Objetivo
            </h4>
            <p className="text-gray-900 font-bold text-sm md:text-base leading-snug">
              Simplificar a tecnologia para colocar mais vendas e lucro direto no caixa do pequeno empresário.
            </p>
          </div>

          {/* O que é o Ecossistema */}
          <div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4 font-medium">
              A <strong>Evolux360</strong> nasceu da necessidade real do comércio e prestadores de serviços brasileiros: parar de pagar mensalidades abusivas e eliminar o caos de gerenciar clientes em planilhas ou cadernos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-[#5932EA]/10 flex items-center justify-center">
                    <Package className="w-3 h-3 text-[#5932EA]" />
                  </div>
                  <h5 className="font-black text-gray-900 text-xs">Evolux Catálogo</h5>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-normal">
                  Sua vitrine online sem aluguel de plataforma, enviando pedidos prontos para seu WhatsApp.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-[#5932EA]/10 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-[#5932EA]" />
                  </div>
                  <h5 className="font-black text-gray-900 text-xs">VendeAI</h5>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-normal">
                  Automação comercial no WhatsApp que atende 24/7 e fecha vendas com cobrança Pix.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-[#5932EA]/10 flex items-center justify-center">
                    <Database className="w-3 h-3 text-[#5932EA]" />
                  </div>
                  <h5 className="font-black text-gray-900 text-xs">Evolux Core</h5>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-normal">
                  Gestão integrada de clientes (CRM), estoque e movimento de vendas.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-[#5932EA]/10 flex items-center justify-center">
                    <BrainCircuit className="w-3 h-3 text-[#5932EA]" />
                  </div>
                  <h5 className="font-black text-gray-900 text-xs">Evolux AI & Vision</h5>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-normal">
                  Leitura de notas fiscais por foto e inteligência estratégica de vendas.
                </p>
              </div>
            </div>
          </div>

          {/* Compromisso */}
          <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h5 className="font-bold text-emerald-900 text-xs">Desenvolvido para Resultados Práticos</h5>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Sem termos complicados. Ferramentas diretas e prontas para uso no seu negócio.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <a href="https://catalogo.evolux360.online/" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#5932EA] hover:bg-[#4A28C7] text-white font-bold h-10 px-4 rounded-xl text-xs">
                Conhecer Evolux Catálogo <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </a>
            <a href="https://vendeai-lp.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="text-[#5932EA] border-purple-200 hover:bg-purple-50 font-bold h-10 px-4 rounded-xl text-xs">
                Conhecer VendeAI <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </a>
          </div>
          <Button onClick={onClose} variant="ghost" className="text-gray-500 hover:text-gray-900 font-bold text-xs">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

