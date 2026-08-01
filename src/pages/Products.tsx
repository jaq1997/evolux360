import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Database, BrainCircuit, TrendingUp, Package, LineChart, Zap, Smartphone, ShieldCheck, ChevronDown, ChevronUp, DollarSign, Layers, ScanLine, FileText, BarChart3, ShoppingBag } from "lucide-react";
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
  shortParagraph,
  fullParagraphs, 
  features,
  href,
  buttonText,
  delay
}: { 
  icon: any; 
  title: string; 
  subtitle: string; 
  shortParagraph: string; 
  fullParagraphs: string[]; 
  features?: FeatureItem[];
  href?: string;
  buttonText?: string;
  delay: number; 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasExtraContent = features && features.length > 0;

  return (
    <div
      className={`group relative p-5 md:p-6 rounded-2xl transition-all duration-200 flex flex-col justify-between h-full w-full overflow-hidden ${
        isExpanded 
          ? "md:col-span-2 lg:col-span-3 bg-[#0F0728] border border-[#5932EA]/40 text-white shadow-xl shadow-purple-950/20" 
          : "bg-white shadow-sm hover:shadow-lg border border-slate-200/80 hover:border-[#5932EA] hover:shadow-purple-500/5 text-slate-900"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 ${
            isExpanded 
              ? "bg-[#5932EA] text-white shadow-md shadow-purple-500/20" 
              : "bg-[#5932EA]/10 text-[#5932EA] group-hover:scale-105"
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <h3 className={`text-xl font-black tracking-tight mb-1 ${isExpanded ? "text-white" : "text-slate-900"}`}>{title}</h3>
        
        <p className={`font-bold mb-3 text-xs md:text-sm tracking-tight ${isExpanded ? "text-purple-300" : "text-[#5932EA]"}`}>
          {subtitle}
        </p>
        
        <div className={`space-y-2.5 mb-4 font-medium leading-relaxed text-xs md:text-sm ${isExpanded ? "text-slate-200" : "text-slate-600"}`}>
          {isExpanded ? (
            fullParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))
          ) : (
            <p>{shortParagraph}</p>
          )}
        </div>

        {/* Expandable Features Section - Instant Display & 3 Columns */}
        {isExpanded && features && features.length > 0 && (
          <div className="my-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {features.map((item, idx) => {
              const FIcon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-purple-400/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#5932EA] text-white flex items-center justify-center shrink-0">
                        <FIcon className="w-4 h-4" />
                      </div>
                      <h5 className="font-bold text-xs md:text-sm text-white">{item.title}</h5>
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-purple-200/80">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Action Row - Botão Primário Oficial #5932EA + Botão Terciário (Texto sem fundo) */}
      <div className={`flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t ${isExpanded ? "border-white/10" : "border-slate-100"}`}>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
            <Button className="bg-[#5932EA] hover:bg-[#4A28C7] text-white font-bold h-9 px-4 rounded-lg shadow-sm text-xs group">
              {buttonText || "Conhecer VendeAI agora"} <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        ) : (
          <a href="https://forms.gle/Too6zAkpvu3uUDjf8" target="_blank" rel="noopener noreferrer" className="inline-block">
            <Button className="bg-[#5932EA] hover:bg-[#4A28C7] text-white font-bold h-9 px-4 rounded-lg shadow-sm text-xs group">
              {buttonText || "Saiba mais"} <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        )}

        {hasExtraContent && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`font-semibold text-xs inline-flex items-center gap-1 transition-colors py-1.5 px-1 ${
              isExpanded 
                ? "text-purple-300 hover:text-white" 
                : "text-[#5932EA] hover:text-[#4A28C7]"
            }`}
          >
            {isExpanded ? (
              <>Menos detalhes <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Ver detalhes <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        )}
      </div>
    </div>
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

      {/* Hero Section Compacto */}
      <section className="pt-20 pb-6 px-4 text-center">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
              Soluções Inteligentes para <span className="bg-gradient-to-r from-[#5932EA] to-[#7C3AED] bg-clip-text text-transparent">Pequenos Negócios</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
              Conheça os módulos do ecossistema Evolux360 projetados para acelerar suas vendas e transformar a gestão da sua empresa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products List Section - 3 Columns Grid */}
      <section className="py-4 pb-20 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            
            {/* 1. Evolux Catálogo - PRIMEIRO FOCO */}
            <SolutionCard 
              icon={Package}
              title="Evolux Catálogo"
              subtitle="Sua Estrutura Profissional sem Aluguel"
              shortParagraph="Sua vitrine profissional de produtos e serviços sem aluguel de plataforma, com fechamento rápido direto no seu WhatsApp."
              fullParagraphs={[
                "Desenvolvido para quem quer apresentar seu trabalho de forma rápida e profissional, o Evolux Catálogo é a alternativa definitiva para quem não quer mais depender de sites lentos ou pagar mensalidades para plataformas de terceiros.",
                "Ele organiza seus produtos ou serviços e facilita a escolha do cliente, enviando o pedido ou a solicitação de orçamento pronta diretamente para o seu WhatsApp."
              ]}
              features={[
                {
                  icon: DollarSign,
                  title: "Pagamento Único",
                  description: "Você paga apenas uma vez pela montagem. Sem mensalidade de plataforma."
                },
                {
                  icon: Zap,
                  title: "Velocidade Máxima",
                  description: "Site ultra-leve que abre instantaneamente, ideal para converter leads vindos de anúncios."
                },
                {
                  icon: Smartphone,
                  title: "Fechamento Organizado",
                  description: "O cliente escolhe o que deseja e fecha a compra direto no seu WhatsApp ou no checkout que você já usa."
                }
              ]}
              href="https://evolux-catalogo-lp.vercel.app/"
              buttonText="Conhecer Evolux Catálogo agora"
              delay={0.1}
            />

            {/* 2. VendeAI */}
            <SolutionCard 
              icon={TrendingUp}
              title="VendeAI"
              subtitle="A Ponta de Lança do Ecossistema Evolux360"
              shortParagraph="Sua solução oficial de automação de vendas no WhatsApp. Atende 24/7, responde clientes instantaneamente e fecha vendas sem deixar ninguém esperando."
              fullParagraphs={[
                "Desenvolvido para eliminar a complexidade da tecnologia e colocar mais lucro no caixa do pequeno empresário, o VendeAI é a nossa solução oficial de automação de vendas no WhatsApp.",
                "Ele atua como o braço direito comercial de lojas de varejo, salões de beleza e prestadores de serviços, garantindo que nenhum cliente fique sem resposta e nenhuma venda seja perdida por demora no atendimento."
              ]}
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
              href="https://vendeai-lp.vercel.app/"
              buttonText="Conhecer VendeAI agora"
              delay={0.2}
            />

            {/* 3. Evolux Core */}
            <SolutionCard 
              icon={Database}
              title="Evolux Core"
              subtitle="Onde a Conversa vira Cliente Fiel"
              shortParagraph="O sistema de gestão e CRM visual que organiza seu estoque, financeiro e clientes para transformar conversas em vendas recorrentes."
              fullParagraphs={[
                "Desenvolvido para o empresário que quer parar de esquecer quem são seus clientes, o Evolux Core une a organização do estoque e financeiro com um CRM de Atitude.",
                "Ele organiza cada lead que chega pelo WhatsApp e transforma em um histórico real, permitindo que você saiba exatamente quem parou de comprar e quem é o seu melhor cliente."
              ]}
              features={[
                {
                  icon: Database,
                  title: "CRM Inteligente",
                  description: "Saiba o nome, o que comprou e a última vez que apareceu. Nunca mais perca o contato de um cliente interessado."
                },
                {
                  icon: Package,
                  title: "Estoque e Financeiro",
                  description: "Controle suas mercadorias e veja seu lucro real na tela, tudo integrado ao seu movimento de vendas."
                },
                {
                  icon: Layers,
                  title: "Painel Visual de Pedidos",
                  description: "Um painel visual simples para você arrastar seus pedidos do 'Novo' até a 'Entrega', sem confusão e sem erros."
                }
              ]}
              buttonText="Conhecer Evolux Core agora"
              delay={0.3}
            />

            {/* 4. Evolux AI */}
            <SolutionCard 
              icon={BrainCircuit}
              title="Evolux AI"
              subtitle="O Estrategista que Conhece seu Negócio"
              shortParagraph="O consultor de inteligência de vendas que analisa seus dados de vendas e estoque para sugerir promoções e campanhas certeiras."
              fullParagraphs={[
                "Desenvolvido para quem quer vender mais usando as informações que já tem, o Evolux AI funciona como um consultor de marketing dentro da sua empresa.",
                "Ele analisa os dados reais do seu negócio (vendas, estoque, clientes) e sugere as melhores ideias de promoções e campanhas para atrair clientes na hora certa."
              ]}
              features={[
                {
                  icon: Sparkles,
                  title: "Ideias de Promoção",
                  description: "A IA te avisa qual produto está parado e sugere como vendê-lo mais rápido."
                },
                {
                  icon: Database,
                  title: "Perfil do Cliente",
                  description: "Saiba quem são seus melhores clientes e o que eles mais gostam de comprar."
                },
                {
                  icon: BarChart3,
                  title: "Relatórios Simples",
                  description: "Receba o resumo das suas vendas direto no WhatsApp, de forma clara e rápida."
                }
              ]}
              buttonText="Conhecer Evolux AI agora"
              delay={0.4}
            />

            {/* 5. Evolux Vision */}
            <SolutionCard 
              icon={LineChart}
              title="Evolux Vision"
              subtitle="O Fim da Digitação Manual de Notas"
              shortParagraph="A tecnologia que lê fotos ou PDFs de Notas Fiscais para dar entrada de estoque e atualizar seu financeiro automaticamente em segundos."
              fullParagraphs={[
                "Desenvolvido para quem perde tempo preenchendo o sistema manualmente, o Evolux Vision é a tecnologia que \"lê\" seus documentos por você.",
                "Basta uma foto ou o PDF da Nota Fiscal para que o sistema identifique os produtos e atualize seu estoque e financeiro automaticamente."
              ]}
              features={[
                {
                  icon: ScanLine,
                  title: "Leitura por Foto",
                  description: "Tire foto da nota do fornecedor e a IA faz o trabalho pesado."
                },
                {
                  icon: ShieldCheck,
                  title: "Zero Erro Humano",
                  description: "Elimine erros de digitação de preços, códigos e quantidades."
                },
                {
                  icon: Zap,
                  title: "Ganho de Tempo",
                  description: "O que levava horas de digitação agora é feito em segundos."
                }
              ]}
              buttonText="Conhecer Evolux Vision agora"
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