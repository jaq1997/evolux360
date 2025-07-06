import { Button } from "@/components/ui/button";
import { Settings, CheckCircle, Star, Zap } from "lucide-react";

const Products = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Nossas Soluções
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubra nossas soluções completas para transformar a gestão do seu negócio
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Solution 1 - Agente SDR */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-xl flex items-center justify-center mb-6">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Agente SDR</h3>
                <p className="text-gray-600 mb-6">
                  Automatize a prospecção e qualificação de leads com inteligência artificial
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Prospecção automática</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Qualificação de leads</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Follow-up inteligente</span>
                  </li>
                </ul>
              </div>
              <Button className="w-full bg-[#5932EA] hover:bg-[#4A28C7] mt-auto">
                Saiba mais
              </Button>
            </div>

            {/* Solution 2 - Agente Closer */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-xl flex items-center justify-center mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Agente Closer</h3>
                <p className="text-gray-600 mb-6">
                  Maximize suas conversões com automação inteligente de vendas
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Fechamento automático</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Negociação inteligente</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Análise de objeções</span>
                  </li>
                </ul>
              </div>
              <Button className="w-full bg-[#5932EA] hover:bg-[#4A28C7] mt-auto">
                Saiba mais
              </Button>
            </div>

            {/* Solution 3 - Automação Inteligente */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#5932EA] to-[#7C3AED] rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Automação Inteligente</h3>
                <p className="text-gray-600 mb-6">
                  Processos automatizados que economizam tempo e reduzem erros operacionais
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Automação de vendas</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Gestão de estoque</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Relatórios automáticos</span>
                  </li>
                </ul>
              </div>
              <Button className="w-full bg-[#5932EA] hover:bg-[#4A28C7] mt-auto">
                Saiba mais
              </Button>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Products;