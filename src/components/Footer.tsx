import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react"; 
import { AboutModal } from "./AboutModal";
import { LegalModal } from "./LegalModal";

export const Footer = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      <footer className="bg-[#050505] text-white py-20 px-4 border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-6" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img src="/icone-branco.svg" alt="Logo" className="w-8 h-8" />
                <span className="text-2xl font-black tracking-tighter">Evolux360</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
                A Evolux360 é uma plataforma de gestão que centraliza, otimiza e simplifica os processos internos do seu negócio.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Produtos</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="https://catalogo.evolux360.online/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C4FF0]"></span> Evolux Catálogo
                  </a>
                </li>
                <li>
                  <a href="https://vendeai-lp.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C4FF0]"></span> VendeAI
                  </a>
                </li>
                <li>
                  <Link to="/products" className="hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C4FF0]"></span> Evolux Core
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C4FF0]"></span> Evolux Vision
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6C4FF0]"></span> Evolux AI
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Institucional</h4>
              <ul className="space-y-3 text-sm text-gray-400 font-medium">
                <li><a href="#solucoes" className="hover:text-white transition-colors font-medium">Ecossistema Evolux360</a></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors font-medium">Como funciona</a></li>
                <li><a href="#diferenciais" className="hover:text-white transition-colors font-medium">Diferenciais</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contato & Redes</h4>
              <div className="flex flex-col space-y-3">
                <a 
                  href="mailto:contatoevolux360@gmail.com" 
                  className="bg-white/5 px-4 py-3 rounded-2xl hover:bg-[#5932EA] transition-all flex items-center gap-3 font-medium text-xs text-gray-300 hover:text-white border border-white/10 group"
                >
                  <Mail className="w-4 h-4 text-[#6C4FF0] group-hover:text-white transition-colors shrink-0" />
                  <span className="truncate">contatoevolux360@gmail.com</span>
                </a>
                <a 
                  href="https://www.instagram.com/souevolux360/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/5 px-4 py-3 rounded-2xl hover:bg-[#5932EA] transition-all flex items-center gap-3 font-medium text-xs text-gray-300 hover:text-white border border-white/10 group"
                >
                  <Instagram className="w-4 h-4 text-[#6C4FF0] group-hover:text-white transition-colors shrink-0" />
                  <span>@souevolux360</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Copyright 2026 © Evolux360 · Todos os direitos reservados
            </p>
            <div className="flex gap-8 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
              <button onClick={() => setLegalModalType('privacy')} className="hover:text-white transition-colors">Privacidade</button>
              <button onClick={() => setLegalModalType('terms')} className="hover:text-white transition-colors">Termos</button>
            </div>
          </div>
        </div>
      </footer>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <LegalModal isOpen={!!legalModalType} onClose={() => setLegalModalType(null)} type={legalModalType} />
    </>
  );
};