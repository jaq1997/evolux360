import { Button } from "@/components/ui/button";
import { Settings, CheckCircle, Star, Zap, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CustomCursor } from "@/components/CustomCursor";

const SolutionCard = ({ icon: Icon, title, description, features, delay }: { icon: any, title: string, description: string, features: string[], delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -10 }}
    className="group relative bg-white/70 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
  >
    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
      <Sparkles className="w-12 h-12 text-[#5932EA]" />
    </div>
    
    <div className="w-16 h-16 bg-[#5932EA]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#5932EA] transition-all duration-500 group-hover:rotate-6">
      <Icon className="w-8 h-8 text-[#5932EA] group-hover:text-white transition-colors" />
    </div>
    
    <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-gray-500 mb-8 leading-relaxed text-lg font-medium">
      {description}
    </p>
    
    <ul className="space-y-4 mb-10 flex-1">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-3 group/item">
          <div className="bg-green-100 p-1 rounded-full group-hover/item:bg-green-500 transition-colors">
            <CheckCircle className="w-4 h-4 text-green-600 group-hover/item:text-white" />
          </div>
          <span className="text-gray-700 font-semibold">{feature}</span>
        </li>
      ))}
    </ul>
    
    <Button className="w-full bg-[#5932EA] hover:bg-[#4A28C7] h-14 rounded-2xl font-bold text-lg shadow-lg shadow-purple-100 group">
      Conhecer agora <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </Button>
  </motion.div>
);

const Products = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <CustomCursor />
      
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-[#5932EA]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[-10%] w-[35%] h-[35%] bg-[#7C3AED]/5 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-[#5932EA]/10 text-[#5932EA] px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-6 inline-block">
              Inteligência & Automação
            </span>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
              Nossas <span className="bg-gradient-to-r from-[#5932EA] to-[#7C3AED] bg-clip-text text-transparent">Soluções</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
              Transforme dados em decisões e prospecção em fechamento com nossos agentes de IA exclusivos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            
            <SolutionCard 
              icon={Settings}
              title="Agente SDR"
              description="Sua máquina de prospecção e qualificação de leads rodando 24/7 sem interrupções."
              features={[
                "Prospecção automática multi-canal",
                "Qualificação de leads em tempo real",
                "Follow-up inteligente personalizado",
                "Agendamento direto na agenda"
              ]}
              delay={0.1}
            />

            <SolutionCard 
              icon={Star}
              title="Agente Closer"
              description="O especialista em fechamento que nunca perde uma oportunidade e entende cada objeção."
              features={[
                "Fechamento automático assistido",
                "Negociação inteligente de valores",
                "Análise profunda de objeções",
                "Escalonamento para humano se necessário"
              ]}
              delay={0.2}
            />

            <SolutionCard 
              icon={Zap}
              title="Automação Inteligente"
              description="O cérebro do seu negócio, conectando estoque, vendas e financeiro em um só fluxo."
              features={[
                "Sincronização de estoque real",
                "Gestão unificada de canais",
                "Relatórios de BI automáticos",
                "Fluxos operacionais inteligentes"
              ]}
              delay={0.3}
            />

          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center bg-gray-50 rounded-[3rem] p-16 md:p-24 border border-gray-100">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">Não encontrou o que precisava?</h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">Criamos soluções personalizadas para desafios complexos. Vamos conversar?</p>
          <a href="https://forms.gle/Too6zAkpvu3uUDjf8" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="h-16 px-12 text-xl font-bold rounded-2xl border-gray-200 hover:bg-white shadow-sm transition-all">
              Falar com um consultor
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Products;