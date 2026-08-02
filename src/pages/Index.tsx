import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Package, Database, LineChart, BrainCircuit, Sparkles, FileScan, LayoutGrid, MessageCircle, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CustomCursor } from "@/components/CustomCursor";

const Index = () => {
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);

  const timelineSteps = [
    {
      step: "01",
      title: "Vitrine Profissional",
      subtitle: "Evolux Catálogo",
      description: "Apresente seus produtos no Evolux Catálogo sem mensalidade e receba pedidos organizados direto no seu WhatsApp.",
      linkText: "Conhecer Catálogo →",
      href: "https://evolux-catalogo-lp.vercel.app/",
      isExternal: true,
      icon: Package
    },
    {
      step: "02",
      title: "Automação no WhatsApp",
      subtitle: "VendeAI",
      description: "O VendeAI atende seus clientes, tira dúvidas e fecha vendas 24 horas por dia, sem você perder venda por demora.",
      linkText: "Conhecer VendeAI →",
      href: "https://vendeai-lp.vercel.app/",
      isExternal: true,
      icon: TrendingUp
    },
    {
      step: "03",
      title: "Gestão Inteligente & Estratégia",
      subtitle: "Evolux Core & AI",
      description: "O Evolux Core unifica estoque e vendas de múltiplos canais enquanto o Evolux AI analisa dados e sugere melhores ações pra vender mais.",
      linkText: "Conhecer Core →",
      href: "/products",
      isExternal: false,
      icon: Database
    },
    {
      step: "04",
      title: "Entrada Sem Digitação",
      subtitle: "Evolux Vision",
      description: "Envie a foto ou PDF da nota fiscal e o Evolux Vision atualiza seu estoque e financeiro sozinho, sem digitação manual.",
      linkText: "Conhecer Vision →",
      href: "/products",
      isExternal: false,
      icon: FileScan
    }
  ];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <CustomCursor />
      
      {/* Background Decor Animado com pulsação suave de luz */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[#6C4FF0]/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[5%] right-[-5%] w-[35%] h-[35%] bg-[#7C3AED]/10 rounded-full blur-[120px]" 
        />
      </div>

      <main className="relative z-10">
        
        {/* 1. Hero Section */}
        <section className="pt-24 md:pt-36 pb-16 md:pb-24 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-[1.18] tracking-tight">
                Do primeiro contato à venda fechada: <span className="text-[#6C4FF0] inline-block">sua operação inteira</span> em um só ecossistema.
              </h1>
              
              <p className="text-base sm:text-xl text-gray-600 mb-8 font-medium leading-relaxed max-w-3xl mx-auto">
                Do atendimento no WhatsApp à gestão de estoque, cada solução da Evolux360 resolve uma parte da operação, e você escolhe com quais começar.
              </p>

              {/* Bullets de escopo inline */}
              <div className="flex flex-wrap justify-center items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 mb-10">
                {["Evolux Catálogo", "VendeAI", "Evolux Core", "Evolux Vision", "Evolux AI"].map((item, idx) => (
                  <motion.span 
                    key={item} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    className="bg-gray-100 px-3.5 py-1.5 rounded-lg text-gray-800 hover:bg-[#6C4FF0]/10 hover:text-[#6C4FF0] transition-colors cursor-default"
                  >
                    {item} {idx < 4 && <span className="ml-2 text-gray-300">·</span>}
                  </motion.span>
                ))}
              </div>

              <div className="flex justify-center">
                <a href="#solucoes">
                  <Button className="bg-[#6C4FF0] hover:bg-[#5932EA] px-9 h-14 text-base sm:text-lg font-bold shadow-lg shadow-purple-500/25 rounded-full transition-all hover:scale-105 active:scale-95 text-white">
                    Conhecer as soluções
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Seção "Como funciona na prática" - Linha do Tempo Interativa com Animações Vibrantes */}
        <section id="como-funciona" className="py-20 px-4 relative bg-[#0F0728] text-white w-full border-y border-[#6C4FF0]/30 my-8">
          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                O ciclo completo para vender e gerenciar
              </h2>
              <p className="text-purple-200/80 text-sm md:text-base max-w-xl mx-auto font-medium">
                Conheça como os 4 módulos trabalham juntos do atendimento à gestão inteligente.
              </p>
            </div>

            {/* Linha do tempo interativa com Motion */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Menu lateral de Passos */}
              <div className="lg:col-span-5 flex flex-col space-y-3">
                {timelineSteps.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeTimelineStep === index;
                  return (
                    <motion.button
                      key={item.step}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTimelineStep(index)}
                      className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center justify-between ${
                        isActive
                          ? "bg-[#6C4FF0] border-purple-400 text-white shadow-lg shadow-purple-900/50 translate-x-1"
                          : "bg-[#180D3D]/80 border-[#6C4FF0]/30 text-purple-200/70 hover:bg-[#180D3D] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center transition-colors ${isActive ? 'bg-white text-[#6C4FF0]' : 'bg-[#6C4FF0]/30 text-purple-200'}`}>
                          {item.step}
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider opacity-80">{item.subtitle}</div>
                          <div className="text-sm font-black">{item.title}</div>
                        </div>
                      </div>
                      <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 opacity-100' : 'opacity-60'}`} />
                    </motion.button>
                  );
                })}
              </div>

              {/* Display do Passo Selecionado com AnimatePresence */}
              <div className="lg:col-span-7 bg-[#180D3D] border border-[#6C4FF0]/40 rounded-3xl p-8 flex flex-col justify-between min-h-[320px] shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTimelineStep}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-[#6C4FF0] text-white px-3 py-1 rounded-full text-xs font-black">
                          PASSO {timelineSteps[activeTimelineStep].step}
                        </span>
                        <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">
                          {timelineSteps[activeTimelineStep].subtitle}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-black text-white mb-4">
                        {timelineSteps[activeTimelineStep].title}
                      </h3>
                      
                      <p className="text-purple-100 text-sm md:text-base leading-relaxed font-medium mb-8">
                        {timelineSteps[activeTimelineStep].description}
                      </p>
                    </div>

                    <div>
                      {timelineSteps[activeTimelineStep].isExternal ? (
                        <a
                          href={timelineSteps[activeTimelineStep].href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#6C4FF0] hover:bg-[#5932EA] text-white px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                          {timelineSteps[activeTimelineStep].linkText}
                        </a>
                      ) : (
                        <Link
                          to={timelineSteps[activeTimelineStep].href}
                          className="inline-flex items-center gap-2 bg-[#6C4FF0] hover:bg-[#5932EA] text-white px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                          {timelineSteps[activeTimelineStep].linkText}
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Seção "Nossas Soluções" - Grade de 5 Cards Visíveis com Animações ao Scroll e Hover */}
        <section id="solucoes" className="py-20 md:py-32 px-4 bg-gray-50/50 relative">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-left mb-16">
              <span className="text-[#6C4FF0] font-bold uppercase tracking-widest text-xs mb-3 block">Ecossistema Evolux360</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Cada parte do seu negócio, uma solução
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl font-medium">
                Ative o que precisa agora e adicione mais conforme seu negócio cresce.
              </p>
            </div>

            {/* Grid 100% visível de 5 cards com Framer Motion */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* 1. Evolux Catálogo */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#6C4FF0]/10 text-[#6C4FF0] group-hover:bg-[#6C4FF0] group-hover:text-white flex items-center justify-center mb-6 transition-all duration-300 group-hover:rotate-6">
                    <LayoutGrid className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{`Evolux Catálogo`}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">
                    Sua vitrine profissional, sem mensalidade. Organize produtos e receba pedidos direto pelo WhatsApp.
                  </p>
                </div>
                <a href="https://evolux-catalogo-lp.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#6C4FF0] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Conhecer Catálogo →
                </a>
              </motion.div>

              {/* 2. VendeAI */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ y: -8 }}
                className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#6C4FF0]/10 text-[#6C4FF0] group-hover:bg-[#6C4FF0] group-hover:text-white flex items-center justify-center mb-6 transition-all duration-300 group-hover:rotate-6">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{`VendeAI`}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">
                    A ponta de lança do ecossistema. Automação de atendimento e fechamento de vendas no WhatsApp, 24 horas por dia.
                  </p>
                </div>
                <a href="https://vendeai-lp.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#6C4FF0] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Conhecer VendeAI →
                </a>
              </motion.div>

              {/* 3. Evolux Core */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ y: -8 }}
                className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#6C4FF0]/10 text-[#6C4FF0] group-hover:bg-[#6C4FF0] group-hover:text-white flex items-center justify-center mb-6 transition-all duration-300 group-hover:rotate-6">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{`Evolux Core`}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">
                    Gestão centralizada de estoque e vendas, pronta para crescer além do WhatsApp conforme seus canais se expandem.
                  </p>
                </div>
                <Link to="/products" className="text-xs font-bold text-[#6C4FF0] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Conhecer Core →
                </Link>
              </motion.div>

              {/* 4. Evolux AI */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ y: -8 }}
                className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#6C4FF0]/10 text-[#6C4FF0] group-hover:bg-[#6C4FF0] group-hover:text-white flex items-center justify-center mb-6 transition-all duration-300 group-hover:rotate-6">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{`Evolux AI`}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">
                    O estrategista que conhece seu negócio. Analisa vendas, estoque e clientes para sugerir promoções, identificar seus melhores clientes e enviar relatórios direto no WhatsApp.
                  </p>
                </div>
                <Link to="/products" className="text-xs font-bold text-[#6C4FF0] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Conhecer AI →
                </Link>
              </motion.div>

              {/* 5. Evolux Vision */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ y: -8 }}
                className="group bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#6C4FF0]/10 text-[#6C4FF0] group-hover:bg-[#6C4FF0] group-hover:text-white flex items-center justify-center mb-6 transition-all duration-300 group-hover:rotate-6">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{`Evolux Vision`}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">
                    O fim da digitação manual. Tire uma foto ou envie o PDF da nota fiscal, e o sistema atualiza estoque e financeiro sozinho.
                  </p>
                </div>
                <Link to="/products" className="text-xs font-bold text-[#6C4FF0] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Conhecer Vision →
                </Link>
              </motion.div>

            </div>
          </div>
        </section>

        {/* 4. Seção "Por que escolher a Evolux360?" (Layout 2x2 com Linha Divisória e Conteúdo Solicitado) */}
        <section id="diferenciais" className="py-20 md:py-28 px-4 bg-white border-t border-gray-100">
          <div className="container mx-auto max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="text-left mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Por que escolher a Evolux360?
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl font-medium">
                Um ecossistema modular pensado para quem vende no WhatsApp hoje e quer crescer sem trocar de sistema amanhã.
              </p>
            </motion.div>

            {/* Layout 2x2 em 2 Linhas com Divisória Horizontal da Screenshot 1 */}
            <div className="space-y-12">
              
              {/* Linha 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="group hover:translate-x-1 transition-transform"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#6C4FF0] transition-colors">Modular por natureza</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Ative só as soluções que seu negócio precisa agora. Sem pacote fechado, sem pagar por recurso que você não usa.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="group hover:translate-x-1 transition-transform"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#6C4FF0] transition-colors">Automação que atende de verdade</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    O VendeAI responde, tira dúvida e fecha venda sozinho, para você não perder cliente por demora no WhatsApp.
                  </p>
                </motion.div>
              </div>

              {/* Divisória sutil */}
              <div className="border-t border-gray-200/80" />

              {/* Linha 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="group hover:translate-x-1 transition-transform"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#6C4FF0] transition-colors">Decisão liberada de trabalho manual</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    O Evolux AI sugere o que fazer, o Evolux Vision elimina a digitação de nota. Menos operação, mais estratégia.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="group hover:translate-x-1 transition-transform"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#6C4FF0] transition-colors">Feito para crescer com você</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    Comece com um módulo e adicione outros conforme sua operação evolui, sem precisar migrar de plataforma.
                  </p>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. CTA Final - Box Arredondado com Animação de Entrada e Hover */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-[#6C4FF0] via-[#5932EA] to-[#4A28C7] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-purple-900/20 relative overflow-hidden"
            >
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight">
                  Pronto para montar seu ecossistema?
                </h2>
                <p className="text-purple-100 text-sm md:text-base font-medium mb-8">
                  Fale com a gente e descubra qual solução faz sentido para o seu momento hoje.
                </p>
                <a href="https://forms.gle/Too6zAkpvu3uUDjf8" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white text-[#6C4FF0] hover:bg-gray-100 h-14 px-8 text-base font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg">
                    Falar com a Evolux
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Index;