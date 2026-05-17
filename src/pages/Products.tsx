import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles, Database, BrainCircuit, TrendingUp, Package, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { CustomCursor } from "@/components/CustomCursor";

const SolutionCard = ({ icon: Icon, title, subtitle, paragraphs, delay }: { icon: any, title: string, subtitle: string, paragraphs: string[], delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -5 }}
    className="group relative bg-white/70 backdrop-blur-xl border border-white/40 p-8 md:p-12 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center w-full overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
      <Sparkles className="w-24 h-24 text-[#5932EA]" />
    </div>
    
    <div className="w-24 h-24 shrink-0 bg-[#5932EA]/10 rounded-[2rem] flex items-center justify-center group-hover:bg-[#5932EA] transition-all duration-500 group-hover:rotate-6">
      <Icon className="w-12 h-12 text-[#5932EA] group-hover:text-white transition-colors" />
    </div>
    
    <div className="flex-1 z-10">
      <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-[#5932EA] font-bold mb-4 text-xl tracking-tight">
        {subtitle}
      </p>
      
      <div className="space-y-3 mb-6 md:mb-8 text-gray-600 font-medium leading-relaxed text-lg">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
      
      <Button className="bg-[#5932EA] hover:bg-[#4A28C7] h-14 px-8 rounded-2xl font-bold text-lg shadow-lg shadow-purple-100 group w-full sm:w-auto">
        Conhecer agora <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
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
              Ecossistema Completo
            </span>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
              O Poder do <span className="bg-gradient-to-r from-[#5932EA] to-[#7C3AED] bg-clip-text text-transparent">Evolux360</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
              Conheça em detalhes cada módulo projetado para escalar a gestão, as vendas e a inteligência do seu negócio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
            
            <SolutionCard 
              icon={Database}
              title="Evolux Core"
              subtitle="A base operacional do seu negócio"
              paragraphs={[
                "Centralize tudo em um só lugar. O Evolux Core reúne CRM, controle de estoque, gestão financeira e pipeline de vendas em uma plataforma integrada — pensada para micro e pequenos negócios que querem operar com clareza e crescer com controle.",
                "Chega de planilha perdida, dado desatualizado e decisão no escuro."
              ]}
              delay={0.1}
            />

            <SolutionCard 
              icon={BrainCircuit}
              title="Evolux AI"
              subtitle="Inteligência artificial direto na sua operação"
              paragraphs={[
                "O Evolux AI é o assistente integrado da plataforma. Ele lê seus dados, responde suas dúvidas sobre o negócio e ajuda você a tomar decisões mais rápidas — sem precisar sair do sistema ou abrir outra aba.",
                "Não é um chatbot genérico. É uma IA treinada para entender o contexto do seu negócio."
              ]}
              delay={0.2}
            />

            <SolutionCard 
              icon={TrendingUp}
              title="Evolux Comercial"
              subtitle="Sua máquina de vendas no WhatsApp, funcionando 24h"
              paragraphs={[
                "Três agentes automatizados que trabalham enquanto você dorme. O primeiro contato, a qualificação do lead e o follow-up acontecem de forma automática — com linguagem humana, sem parecer robô.",
                "Leads entram. Vendas saem. Tudo registrado no CRM."
              ]}
              delay={0.3}
            />

            <SolutionCard 
              icon={LineChart}
              title="Evolux Vision"
              subtitle="Seu sistema lê documentos e age por você"
              paragraphs={[
                "Nota fiscal chegou? O Evolux Vision lê, extrai os dados e atualiza o estoque automaticamente. Contrato assinado? Cria o cliente no CRM. Boleto vencido? Gera alerta e notifica no WhatsApp.",
                "Menos trabalho manual. Menos erro humano. Mais tempo para o que importa."
              ]}
              delay={0.4}
            />

            <SolutionCard 
              icon={Package}
              title="Evolux Catálogo"
              subtitle="Sua vitrine digital que vende pelo WhatsApp"
              paragraphs={[
                "Uma loja online leve, rápida e sem mensalidade de marketplace. Seus produtos organizados, com fotos e preços, direcionando o cliente direto para o seu WhatsApp com um clique.",
                "Simples para o cliente. Poderoso para o seu negócio."
              ]}
              delay={0.5}
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