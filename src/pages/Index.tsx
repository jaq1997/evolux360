import { Button } from "@/components/ui/button";
import { Settings, Share2, FileText, Users, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="inline-block hover:text-[#5932EA] transition-colors duration-300 cursor-default mr-3">Centralize.</span>
              <span className="inline-block hover:text-[#5932EA] transition-colors duration-300 cursor-default mr-3">Simplifique.</span>
              <span className="inline-block hover:text-[#5932EA] transition-colors duration-300 cursor-default">Gerencie.</span>
            </h1>
            <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Centralize seus canais de venda em um só lugar.
              Simplifique seus processos e potencialize seus resultados.
            </p>
            <div className="flex justify-center mt-8">
              <a 
                href="https://forms.gle/Too6zAkpvu3uUDjf8" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-[#5932EA] hover:bg-[#4A28C7] px-8 h-14 text-lg font-semibold shadow-lg">
                  Entre em contato
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Tudo o que você precisa em um só lugar
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gerencie suas vendas, seus clientes, seus produtos e seu financeiro em uma plataforma única e intuitiva.
            </p>
            <a 
              href="https://forms.gle/Too6zAkpvu3uUDjf8" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-[#5932EA] hover:bg-[#4A28C7] px-8 h-14 text-lg font-semibold shadow-lg">
                Entre em contato
              </Button>
            </a>
          </div>

          {/* Dashboard Preview */}
          <div className="max-w-6xl mx-auto">
            <img 
              src="/dashboard-evolux.svg" 
              alt="Dashboard Preview" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Por que escolher a Evolux?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como nossa plataforma pode transformar a gestão do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/features/automacao-inteligente" className="block h-full">
              <div className="group bg-gradient-to-br from-[#5932EA] to-[#7C3AED] text-white p-8 rounded-2xl hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                <Settings className="w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">Automação Inteligente</h3>
                <p className="text-purple-100">Processos automatizados que economizam tempo e reduzem erros</p>
              </div>
            </Link>
            <Link to="#" className="block h-full">
              <div className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                <Share2 className="w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">Integração Total</h3>
                <p className="text-blue-100">Conecte todos seus canais de venda em uma única plataforma</p>
              </div>
            </Link>
            <Link to="#" className="block h-full">
              <div className="group bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-2xl hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                <FileText className="w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">Relatórios Avançados</h3>
                <p className="text-green-100">Análises detalhadas para decisões estratégicas assertivas</p>
              </div>
            </Link>
            <Link to="#" className="block h-full">
              <div className="group bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-2xl hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                <Users className="w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">Gestão Unificada</h3>
                <p className="text-orange-100">Controle total de vendas, estoque e relacionamento com clientes</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            Pronto para revolucionar sua gestão?
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já transformaram seus resultados com nossa plataforma
          </p>
          <div className="flex justify-center mb-8">
            <Button className="bg-white text-[#5932EA] hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg" onClick={() => navigate('/products')}>
              Conheça nossas soluções
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-8 text-sm opacity-75">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;