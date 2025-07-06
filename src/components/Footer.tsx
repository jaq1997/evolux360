// src/components/layout/Footer.tsx

import { Link } from "react-router-dom";
// 1. Trocamos 'MessageCircle' por 'Phone' na importação
import { Instagram, Mail, Phone } from "lucide-react"; 

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-lg flex items-center justify-center">
              <img src="/logo.svg" alt="Logo" className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Evolux360</span>
          </Link>
        </div>
        <p className="text-center text-gray-400 text-sm mb-4">
          A Evolux360 é uma plataforma inteligente que transforma dados em decisões. Centralizando vendas, gestão de clientes (CRM)
e finanças em um único lugar, automatizamos e simplificamos sua gestão permitindo que você potencialize seu negócio.
        </p>
        
        <div className="flex justify-center space-x-6 my-8">
          <a 
            href="https://www.instagram.com/evolux_360/" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Instagram da Evolux360"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a 
            href="mailto:contatoevolux360@gmail.com" 
            aria-label="Enviar e-mail para Evolux360"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Mail className="w-6 h-6" />
          </a>
          <a 
            href="https://wa.me/5551993417866?text=%F0%9F%91%8B%20Ol%C3%A1!%20Obrigado%20por%20entrar%20em%20contato.%20Como%20posso%20ajudar%20voc%C3%AA%20hoje%3F" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Contato via WhatsApp da Evolux360"
            className="text-gray-400 hover:text-white transition-colors"
          >
            {/* 2. Usamos o ícone 'Phone' aqui */}
            <Phone className="w-6 h-6" />
          </a>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            Copyright 2025 © Evolux360 - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};