// src/components/layout/Footer.tsx

import { Link } from "react-router-dom";
// 1. Trocamos 'MessageCircle' por 'Phone' na importação
import { Instagram, Mail, Phone } from "lucide-react"; 

export const Footer = () => {
  return (
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
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Produto</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/products" className="hover:text-white transition-colors">Nossas Soluções</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors">Funcionalidades</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Planos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Institucional</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Sobre a Evolux</a></li>
              <li><a href="https://wa.me/5551993417866" className="hover:text-white transition-colors">Fale Conosco</a></li>
              <li><a href="https://www.instagram.com/evolux_360/" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Conecte-se</h4>
            <div className="flex space-x-4 mb-6">
              <a href="https://www.instagram.com/evolux_360/" target="_blank" className="bg-white/5 p-3 rounded-full hover:bg-[#5932EA] transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:contatoevolux360@gmail.com" className="bg-white/5 p-3 rounded-full hover:bg-[#5932EA] transition-all">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://wa.me/5551993417866" target="_blank" className="bg-white/5 p-3 rounded-full hover:bg-[#5932EA] transition-all">
                <Phone className="w-5 h-5" />
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
  );
};