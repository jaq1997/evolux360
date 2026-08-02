import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | null;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  const isPrivacy = type === 'privacy';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto p-6 md:p-8 rounded-3xl border border-gray-100 shadow-2xl bg-white">
        <DialogHeader className="text-left space-y-2 mb-4">
          <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            {isPrivacy ? "Política de Privacidade" : "Termos de Uso"}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 font-medium">
            Última atualização: Agosto de 2026 — Evolux360
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
          {isPrivacy ? (
            <>
              <p>
                A <strong>Evolux360</strong> respeita a sua privacidade e está comprometida em proteger os seus dados pessoais. Esta política descreve como coletamos, usamos e armazenamos informações coletadas em nossa plataforma e soluções.
              </p>
              <h4 className="font-bold text-gray-900 text-sm mt-3">1. Coleta de Informações</h4>
              <p>
                Coletamos apenas os dados estritamente necessários para o atendimento comercial e prestação dos nossos serviços, como nome, telefone de contato (WhatsApp) e e-mail informados voluntariamente em nossos formulários.
              </p>
              <h4 className="font-bold text-gray-900 text-sm mt-3">2. Uso dos Dados</h4>
              <p>
                Seus dados são utilizados exclusivamente para entrar em contato, tirar dúvidas sobre o ecossistema Evolux360 e viabilizar a ativação dos serviços contratados. Não vendemos nem compartilhamos seus dados com terceiros.
              </p>
              <h4 className="font-bold text-gray-900 text-sm mt-3">3. Segurança</h4>
              <p>
                Utilizamos padrões modernos de criptografia e proteção de dados para garantir que suas informações estejam seguras contra acesso não autorizado.
              </p>
            </>
          ) : (
            <>
              <p>
                Ao acessar e utilizar os serviços e landing pages do ecossistema <strong>Evolux360</strong>, você concorda com os termos de uso aqui descritos.
              </p>
              <h4 className="font-bold text-gray-900 text-sm mt-3">1. Uso da Plataforma</h4>
              <p>
                Nossos produtos (Evolux Catálogo, VendeAI, Evolux Core, Vision e AI) foram desenvolvidos para auxiliar o gerenciamento e a automação de vendas de pequenos e médios negócios.
              </p>
              <h4 className="font-bold text-gray-900 text-sm mt-3">2. Responsabilidade do Usuário</h4>
              <p>
                O usuário é responsável pela veracidade dos dados informados nos formulários e pelo uso adequado das soluções de automação em conformidade com as políticas do WhatsApp.
              </p>
              <h4 className="font-bold text-gray-900 text-sm mt-3">3. Alterações dos Termos</h4>
              <p>
                A Evolux360 reserva-se o direito de atualizar estes termos para refletir melhorias contínuas em nossos produtos e legislações vigentes.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <Button onClick={onClose} className="bg-[#5932EA] hover:bg-[#4A28C7] text-white px-6 h-10 rounded-xl font-bold text-xs">
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
