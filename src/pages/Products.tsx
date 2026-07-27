import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Database, BrainCircuit, TrendingUp, Package, LineChart, Zap, Smartphone, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomCursor } from "@/components/CustomCursor";
import { useState } from "react";

interface FeatureItem {
  icon: any;
  title: string;
  description: string;
}

const SolutionCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  paragraphs, 
  features,
  badge,
  targetAudience,
  href,
  delay
}: { 
  icon: any; 
  title: string; 
  subtitle: string; 
  paragraphs: string[]; 
  features?: FeatureItem[];
  badge?: string;
  targetAudience?: string;
  href?: string;
  delay: number; 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasExtraContent = (features && features.length > 0) || Boolean(targetAudience);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-6 md:p-8 rounded-3xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-[#5932EA] hover:shadow-xl hover:shadow-purple-500/10 text-slate-900 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start w-full overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Sparkles className="w-20 h-20 text-[#5932EA]" />
      </div>
      
      <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl bg-[#5932EA]/10 text-[#5932EA] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 mt-1">
        <Icon className="w-8 h-8 md:w-10 md:h-10" />
      </div>
      
      <div className="flex-1 z-10 w-full">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
          {badge && (
            <span className="bg-purple-100 text-[#5932EA] font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider border border-purple-200">
              {badge}
            </span>
          )}
        </div>
        
        <p className="font-bold mb-3 text-base md:text-lg text-[#5932EA] tracking-tight">
          {subtitle}
        </p>
        
        <div className="space-y-3 mb-5 font-medium leading-relaxed text-sm md:text-base text-slate-600">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Expandable Accordion Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Recurso Cards */}
              {features && features.length > 0 && (
                <div className="my-5 pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {features.map((item, idx) => {
                    const FIcon = item.icon;
                    return (
                      <div 
                        key={idx} 
                        className="p-3.5 rounded-xl border bg-white border-slate-200/60 group-hover:border-purple-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <FIcon className="w-4 h-4 text-[#5932EA]" />
                          <h5 className="font-bold text-xs text-slate-900">{item.title}</h5>
                        </div>
                        <p className="text-[11px] font-medium leading-tight text-slate-500">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Target Audience */}
              {targetAudience && (
                <p className="text-xs font-medium mb-5 text-slate-500">
                  <span className="font-bold uppercase tracking-wider text-xs text-slate-700">Público-alvo:</span> {targetAudience}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Action Row - Sempre Visível */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button className="bg-[#5932EA] hover:bg-[#4A28C7] text-white font-bold h-12 px-7 rounded-xl shadow-md shadow-purple-100 group">
                Conhecer VendeAI agora <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          ) : (
            <a href="https://forms.gle/Too6zAkpvu3uUDjf8" target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-slate-300 hover:bg-purple-50 hover:border-purple-200 text-slate-800">
                Saiba mais <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          )}

          {hasExtraContent && (
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#5932EA] hover:bg-purple-50 font-bold h-12 px-4 rounded-xl text-sm flex items-center gap-1.5"
            >
              {isExpanded ? (
                <>Menos detalhes <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>Ver detalhes <ChevronDown className="w-4 h-4" /></>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <CustomCursor />
      
      {/* Background Subtle Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[5%] right-[-5%] w-[30%] h-[30%] bg-[#5932EA]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[5%] left-[-10%] w-[30%] h-[30%] bg-[#7C3AED]/5 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 text-center">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="bg-[#5932EA]/10 text-[#5932EA] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">
              Esteira de Produtos
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Soluções Inteligentes para <span className="bg-gradient-to-r from-[#5932EA] to-[#7C3AED] bg-clip-text text-transparent">Pequenos Negócios</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Conheça os módulos do ecossistema Evolux360 projetados para acelerar suas vendas e transformar a gestão da sua empresa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products List Section */}
      <section className="py-12 pb-24 px-4 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            
            {/* VendeAI */}
            <SolutionCard 
              icon={TrendingUp}
              title="VendeAI"
              subtitle="A Ponta de Lança do Ecossistema Evolux360"
              paragraphs={[
                "Desenvolvido para eliminar a complexidade da tecnologia e colocar mais lucro no caixa do pequeno empresário, o VendeAI é a nossa solução oficial de automação de vendas no WhatsApp.",
                "Ele atua no atendimento, tira dúvidas sobre produtos e fecha vendas via Pix no piloto automático 24/7."
              ]}
              badge="Automação WhatsApp"
              features={[
                {
                  icon: Zap,
                  title: "Ativação em 5 Minutos",
                  description: "Sem sistemas difíceis. Ativação direta no WhatsApp."
                },
                {
                  icon: Smartphone,
                  title: "Vendas Automáticas 24/7",
                  description: "Atendimento noturno e fechamento via Pix."
                },
                {
                  icon: ShieldCheck,
                  title: "Garantia de 7 Dias",
                  description: "Teste no seu negócio sem riscos."
                }
              ]}
              targetAudience="Lojas de varejo, e-commerce, salões de beleza e prestadores de serviços."
              href="https://vendeai-lp.vercel.app/"
              delay={0.1}
            />

            {/* Evolux Catálogo */}
            <SolutionCard 
              icon={Package}
              title="Evolux Catálogo"
              subtitle="Sua vitrine digital direta no WhatsApp"
              paragraphs={[
                "Uma loja online leve e rápida para apresentar seus produtos com fotos e preços, direcionando o cliente diretamente para o seu WhatsApp."
              ]}
              delay={0.2}
            />

            {/* Evolux Core */}
            <SolutionCard 
              icon={Database}
              title="Evolux Core"
              subtitle="A base operacional do seu negócio"
              paragraphs={[
                "Centralize CRM, controle de estoque e pipeline de vendas em uma plataforma integrada, criada para quem quer operar com controle total."
              ]}
              delay={0.3}
            />

            {/* Evolux Vision */}
            <SolutionCard 
              icon={LineChart}
              title="Evolux Vision"
              subtitle="Leitura inteligente de documentos e notas"
              paragraphs={[
                "Visão computacional que lê notas fiscais, contratos e boletos, atualizando o estoque e o CRM automaticamente."
              ]}
              delay={0.4}
            />

            {/* Evolux AI */}
            <SolutionCard 
              icon={BrainCircuit}
              title="Evolux AI"
              subtitle="Assistente de IA integrado à sua operação"
              paragraphs={[
                "Assistente inteligente treinado nos dados do seu negócio para responder dúvidas gerenciais e orientar tomadas de decisão."
              ]}
              delay={0.5}
            />

          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl bg-slate-50 rounded-[2.5rem] p-10 md:p-14 border border-slate-200/80">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Precisa de uma solução sob medida?</h2>
          <p className="text-base text-slate-500 mb-8 max-w-xl mx-auto font-medium">Criamos integrações e fluxos personalizados para o seu modelo de negócio. Vamos conversar?</p>
          <a href="https://forms.gle/Too6zAkpvu3uUDjf8" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="h-12 px-8 text-base font-bold rounded-xl border-slate-300 hover:bg-white shadow-sm transition-all text-slate-800">
              Falar com um consultor
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Products;