import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, TrendingUp, Package, Database, BrainCircuit, Target, ArrowRight, DollarSign, Layers } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl bg-white">
        <DialogHeader className="text-left space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5932EA]/10 flex items-center justify-center p-2">
              <img src="/icone-colorido.svg" alt="Evolux360" className="w-full h-full object-contain" />
            </div>
            <div>
              <DialogTitle className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Sobre a Evolux360
              </DialogTitle>
              <DialogDescription className="text-[#5932EA] font-bold text-sm">
                O Sistema Operacional do Pequeno Negócio
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
          {/* Missão */}
          <div className="bg-purple-50/80 p-6 md:p-8 rounded-3xl border border-purple-100">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#5932EA] mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> A Nossa Missão
            </h4>
            <p className="text-gray-900 font-bold text-base md:text-lg leading-snug">
              Eliminar a complexidade da tecnologia e colocar mais lucro no caixa do pequeno empresário.
            </p>
          </div>

          {/* O que é o Ecossistema */}
          <div>
            <h4 className="text-base font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5932EA]" /> Ecossistema Evolux360
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              O Evolux360 foi desenhado para ser o sistema operacional do pequeno e médio negócio brasileiro — unificando vendas, estoque, finanças e inteligência artificial em uma experiência simples, prática e sem enrolação.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-[#5932EA]/10 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-[#5932EA]" />
                  </div>
                  <h5 className="font-black text-gray-900 text-sm">VendeAI</h5>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Ponta de lança do ecossistema. Automação oficial de vendas 24/7 no WhatsApp.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-[#5932EA]/10 flex items-center justify-center">
                    <Package className="w-3.5 h-3.5 text-[#5932EA]" />
                  </div>
                  <h5 className="font-black text-gray-900 text-sm">Evolux Catálogo</h5>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Vitrine digital conectada para exibição de produtos e pedidos instantâneos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-[#5932EA]/10 flex items-center justify-center">
                    <Database className="w-3.5 h-3.5 text-[#5932EA]" />
                  </div>
                  <h5 className="font-black text-gray-900 text-sm">Evolux Core</h5>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Gestão centralizada de vendas, controle de estoque e CRM unificado.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-[#5932EA]/10 flex items-center justify-center">
                    <BrainCircuit className="w-3.5 h-3.5 text-[#5932EA]" />
                  </div>
                  <h5 className="font-black text-gray-900 text-sm">Evolux Vision</h5>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Visão Computacional para leitura de notas fiscais e entrada automática de dados.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 sm:col-span-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-[#5932EA]/10 flex items-center justify-center">
                    <DollarSign className="w-3.5 h-3.5 text-[#5932EA]" />
                  </div>
                  <h5 className="font-black text-gray-900 text-sm">Evolux Financeiro</h5>
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">Em Breve</span>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Controle total de fluxo de caixa integrado para clareza sobre lucros e despesas (em desenvolvimento).
                </p>
              </div>
            </div>
          </div>

          {/* Garantia & Compromisso */}
          <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-100 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h5 className="font-bold text-emerald-900 text-sm">Garantia & Compromisso</h5>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">
                Desenvolvido para quem precisa de resultado prático no caixa. Garantia incondicional de 7 dias.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <a href="https://evolux-catalogo-lp.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#5932EA] hover:bg-[#4A28C7] text-white font-bold h-11 px-5 rounded-xl text-xs sm:text-sm">
                Conhecer Evolux Catálogo <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
            <a href="https://vendeai-lp.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="text-[#5932EA] border-purple-200 hover:bg-purple-50 font-bold h-11 px-5 rounded-xl text-xs sm:text-sm">
                Conhecer VendeAI <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
          </div>
          <Button onClick={onClose} variant="ghost" className="text-gray-500 hover:text-gray-900 font-bold">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

