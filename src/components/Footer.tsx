// src/components/layout/Footer.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react"; 
import { AboutModal } from "./AboutModal";

export const Footer = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#050505] text-white py-24 px-4 border-t border-white/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <img src="/icone-branco.svg" alt="Logo" className="w-8 h-8" />
                <span className="text-2xl font-black tracking-tighter">Evolux360</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                A inteligência que transforma dados em lucro. Centralize, simplifique e escale sua operação.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Produtos</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <a href="https://evolux-catalogo-lp.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5932EA]"></span> Evolux Catálogo
                  </a>
                </li>
                <li>
                  <a href="https://vendeai-lp.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5932EA]"></span> VendeAI
                  </a>
                </li>
                <li>
                  <Link to="/products" className="hover:text-white transition-colors">Evolux Core</Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-white transition-colors">Evolux Vision</Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-white transition-colors">Evolux AI</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Institucional</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>
                  <button 
                    onClick={() => setIsAboutOpen(true)} 
                    className="hover:text-white transition-colors text-left font-medium"
                  >
                    Sobre a Evolux360
                  </button>
                </li>
                <li><Link to="/products" className="hover:text-white transition-colors">Nossas Soluções</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Funcionalidades</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Conecte-se</h4>
              <div className="flex space-x-4 mb-6">
                <a 
                  href="https://www.instagram.com/souevolux360/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/5 px-4 py-3 rounded-full hover:bg-[#5932EA] transition-all flex items-center gap-2 font-bold text-sm text-gray-300 hover:text-white border border-white/10"
                >
                  <Instagram className="w-5 h-5 text-white" />
                  <span>@souevolux360</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              Copyright 2026 © Evolux360 - Todos os direitos reservados
            </p>
            <div className="flex gap-8 text-[10px] text-gray-600 uppercase font-bold tracking-widest">
              <a href="#" className="hover:text-white">Privacidade</a>
              <a href="#" className="hover:text-white">Termos</a>
            </div>
          </div>
        </div>
      </footer>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};