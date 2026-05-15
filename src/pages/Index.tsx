import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Share2, FileText, Users, ArrowRight, Sparkles, DollarSign, ShoppingCart, Zap, LayoutDashboard, TrendingUp, Plus, Filter, Search, ArrowUp, ArrowDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CustomCursor } from "@/components/CustomCursor";

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.2, delay }}
    whileHover={{ y: -5 }}
    className="group bg-white/60 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
  >
    <div className="bg-[#5932EA]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#5932EA] transition-colors duration-300">
      <Icon className="w-8 h-8 text-[#5932EA] group-hover:text-white transition-colors duration-300" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const StatCardMock = ({ title, value, icon: Icon }: { title: string, value: string, icon: any }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
      <Icon className="w-4 h-4 text-[#5932EA]" />
    </div>
    <p className="text-xl font-black text-gray-900">{value}</p>
  </div>
);

const MockDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const tabs = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: ShoppingCart, label: "Vendas" },
    { icon: Users, label: "Clientes" },
    { icon: Settings, label: "Produtos" },
    { icon: DollarSign, label: "Financeiro" },
  ];

  const AIInsightBar = ({ message }: { message: string }) => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden mb-8 shadow-xl shadow-purple-100 border border-white/5"
    >
      <Sparkles className="absolute right-[-1rem] top-[-1rem] w-24 h-24 text-[#5932EA] opacity-20 rotate-12" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-10 h-10 bg-[#5932EA] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">Evolux AI Insight</span>
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <p className="text-sm font-bold leading-snug text-gray-100">{message}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-full bg-[#F4F7FE] select-none text-gray-900 font-sans">
      {/* Sidebar - Fiel ao Print */}
      <div className="w-16 md:w-64 bg-white flex flex-col p-6 border-r border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/icone-colorido.svg" alt="Evolux Logo" className="w-full h-full object-contain" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-black text-xl leading-none tracking-tight">Evolux360</h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Simplificando sua gestão</p>
          </div>
        </div>

        <div className="space-y-2">
          {tabs.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 ${
                activeTab === item.label 
                  ? 'bg-[#5932EA] text-white shadow-lg shadow-purple-200' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="hidden md:block text-sm font-bold tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Evolux AI - Sidebar Footer */}
        <div className="mt-auto hidden md:block">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-3xl text-white relative overflow-hidden group border border-white/10">
            <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#5932EA]/20 rounded-full blur-2xl group-hover:bg-[#5932EA]/40 transition-colors" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#5932EA] rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-300">Evolux AI</span>
            </div>
            <p className="text-xs font-bold leading-tight mb-2">"Otimizei seu fluxo de caixa para os próximos 15 dias."</p>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-white/10 rounded-lg text-[9px] font-black hover:bg-white/20 transition-colors cursor-pointer">Ver Relatório</div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo - Fiel ao Print */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="h-20 bg-white/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{activeTab}</h2>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex bg-purple-50 text-[#5932EA] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100">
               Modo Demo Ativo
             </div>
             <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center font-black text-[#5932EA] text-sm">A</div>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "Dashboard" && (
                <div className="space-y-8">
                  <AIInsightBar message="Identifiquei uma oportunidade de aumentar seu ticket médio em 12% com bundles de produtos." />
                  
                  {/* Stats Cards - Fiel ao Print */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { l: "Receita Total", v: "R$ 42.850,00", i: DollarSign, c: "text-gray-400" },
                      { l: "Total de Pedidos", v: "154", i: ShoppingCart, c: "text-gray-400" },
                      { l: "Ticket Médio", v: "R$ 278,24", i: DollarSign, c: "text-gray-400" },
                    ].map((s, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <p className="text-sm font-bold text-gray-400 tracking-tight">{s.l}</p>
                          <s.i className={`w-5 h-5 ${s.c}`} />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{s.v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Kanban de Pedidos - Fiel ao Print */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="mb-8">
                      <h3 className="text-lg font-black mb-1">Controle de Pedidos</h3>
                      <p className="text-xs text-gray-400 font-bold">Arraste os pedidos para atualizar o status.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { title: "Novo Pedido", count: 2, color: "bg-blue-50" },
                        { title: "A Separar", count: 0, color: "bg-orange-50" },
                        { title: "Enviado", count: 1, color: "bg-green-50" }
                      ].map(column => (
                        <div key={column.title} className={`${column.color}/40 rounded-[2rem] p-6 min-h-[300px] border border-gray-50`}>
                          <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">{column.title} ({column.count})</h4>
                          {column.count > 0 && (
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-[#5932EA] transition-all cursor-grab active:cursor-grabbing group">
                              <p className="text-xs font-black mb-3">Pedido #102{column.count}</p>
                              <div className="flex items-center justify-between">
                                <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#5932EA] w-2/3" />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-[8px] font-black text-[#5932EA]">B</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {activeTab === "Vendas" && (
                <div className="space-y-6">
                   <AIInsightBar message="Detectei uma tendência de alta para a categoria 'Tênis Casual'. Considere uma promoção relâmpago." />
                   {/* Filtros - Fiel ao Print */}
                   <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-8">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <h3 className="text-lg font-black">Filtros e Busca</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="col-span-1 md:col-span-1 bg-gray-50 border border-gray-100 h-12 rounded-xl flex items-center px-4">
                          <Search className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-xs text-gray-400 font-bold">Buscar por ID, cliente...</span>
                        </div>
                        {["Status", "Canal", "Pagamento"].map(f => (
                          <div key={f} className="bg-gray-50 border border-gray-100 h-12 rounded-xl flex items-center justify-between px-4">
                            <span className="text-xs text-gray-400 font-bold">{f}: Todos</span>
                            <div className="w-3 h-3 border-r-2 border-b-2 border-gray-400 rotate-45 mb-1" />
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-8 py-5">ID</th>
                          <th className="px-8 py-5">Cliente</th>
                          <th className="px-8 py-5">Canal</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5 text-right">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-medium">
                        {[
                          { id: "#1502", client: "João Pedro", channel: "WhatsApp", status: "Novo", val: "R$ 1.500" },
                          { id: "#1501", client: "Loja do Sul", channel: "Marketplace", status: "Enviado", val: "R$ 4.200" },
                          { id: "#1500", client: "Distribuidora X", channel: "E-commerce", status: "Concluído", val: "R$ 12.000" },
                          { id: "#1499", client: "Carla Souza", channel: "Física", status: "Concluído", val: "R$ 89,90" },
                          { id: "#1498", client: "Bruno Silva", channel: "WhatsApp", status: "Separando", val: "R$ 250,00" },
                          { id: "#1497", client: "Maria Clara", channel: "E-commerce", status: "Concluído", val: "R$ 1.100,00" },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer">
                            <td className="px-8 py-6 text-gray-400 font-bold">{row.id}</td>
                            <td className="px-8 py-6 font-black">{row.client}</td>
                            <td className="px-8 py-6">
                              <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">{row.channel}</span>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                row.status === 'Novo' ? 'bg-blue-50 text-blue-600' : 
                                row.status === 'Enviado' ? 'bg-orange-50 text-orange-600' : 
                                row.status === 'Concluído' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right font-black text-[#5932EA]">{row.val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "Clientes" && (
                <div className="space-y-8">
                  <AIInsightBar message="Identifiquei 15 clientes com alto potencial de recompra este mês. Deseja ativar a automação?" />
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="flex-1 bg-gray-50 h-12 rounded-xl flex items-center px-4 max-w-md">
                      <Search className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-xs text-gray-400 font-bold">Buscar por nome, email...</span>
                    </div>
                    <Button className="bg-[#5932EA] rounded-xl font-black">+ Novo Cliente</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { l: "Total de Clientes", v: "142", sub: "Clientes na base" },
                      { l: "Receita total", v: "R$ 45.280", sub: "Total em vendas" },
                      { l: "Novos Clientes", v: "12", sub: "Últimos 30 dias" },
                    ].map((s, i) => (
                      <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 mb-1">{s.l}</p>
                        <p className="text-xl font-black mb-1">{s.v}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{s.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-8 py-5">Cliente</th>
                          <th className="px-8 py-5">Email</th>
                          <th className="px-8 py-5">Total Comprado</th>
                          <th className="px-8 py-5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-medium">
                        {[
                          { name: "Ana Maria", email: "ana@gmail.com", total: "R$ 2.450", status: "VIP" },
                          { name: "Lucas Rocha", email: "lucas@uol.com", total: "R$ 890", status: "Ativo" },
                          { name: "Felipe Neto", email: "felipe@bol.com", total: "R$ 15.000", status: "VIP" },
                          { name: "Gabi Martins", email: "gabi@ig.com", total: "R$ 0", status: "Inativo" },
                        ].map((c, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="px-8 py-6 font-black">{c.name}</td>
                            <td className="px-8 py-6 text-gray-400">{c.email}</td>
                            <td className="px-8 py-6 font-black">R$ {c.total}</td>
                            <td className="px-8 py-6">
                               <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${c.status === 'VIP' ? 'bg-purple-100 text-[#5932EA]' : c.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                 {c.status}
                               </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "Produtos" && (
                <div className="space-y-6">
                   <AIInsightBar message="Atenção: 3 produtos estão com estoque crítico. A reposição sugerida já está no seu carrinho." />
                   <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-lg font-black">Estoque (21)</h3>
                      <Button className="bg-[#5932EA] rounded-xl font-black">+ Novo Produto</Button>
                    </div>
                    <table className="w-full text-left">
                      <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                        <tr>
                          <th className="pb-4">SKU</th>
                          <th className="pb-4">Produto</th>
                          <th className="pb-4">Estoque</th>
                          <th className="pb-4">Preço Venda</th>
                          <th className="pb-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-bold">
                        {[
                          { sku: "AD-FRM-LOW", name: "Adidas Forum Low", stock: "40 un", price: "R$ 699,99" },
                          { sku: "AD-SMB-12", name: "Adidas Samba", stock: "20 un", price: "R$ 456,00" },
                          { sku: "NK-DNK-BL", name: "Nike Dunk Blue", stock: "15 un", price: "R$ 890,00" },
                          { sku: "NK-AF1-WT", name: "Nike Air Force 1", stock: "5 un", price: "R$ 550,00" },
                          { sku: "PU-SD-RD", name: "Puma Suede Red", stock: "0 un", price: "R$ 399,00" },
                        ].map((p, i) => (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="py-6 text-gray-400">{p.sku}</td>
                            <td className="py-6 font-black">{p.name}</td>
                            <td className="py-6">{p.stock}</td>
                            <td className="py-6 text-[#5932EA]">{p.price}</td>
                            <td className="py-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${p.stock === '0 un' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {p.stock === '0 un' ? 'Esgotado' : 'Disponível'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                   </div>
                </div>
              )}

              {activeTab === "Financeiro" && (
                <div className="space-y-8">
                  <AIInsightBar message="Seu lucro líquido cresceu 8.5% em relação ao mês passado. Ótimo desempenho!" />
                  {/* Cards Financeiros - Fiel ao Financeiro.tsx */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] border-l-4 border-l-green-500 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entradas</p>
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-xl font-black text-gray-900">R$ 124.5k</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border-l-4 border-l-red-500 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saídas</p>
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      </div>
                      <p className="text-xl font-black text-gray-900">R$ 82.4k</p>
                    </div>
                    <div className="bg-[#5932EA]/5 p-6 rounded-[2rem] border-l-4 border-l-[#5932EA] shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-bold text-[#5932EA] uppercase tracking-widest">Saldo</p>
                        <DollarSign className="w-4 h-4 text-[#5932EA]" />
                      </div>
                      <p className="text-xl font-black text-[#5932EA]">R$ 42.1k</p>
                    </div>
                  </div>

                  {/* Gráfico de Fluxo de Caixa Mensal - Replicando visual Recharts */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-black mb-8 text-gray-700">Fluxo de Caixa Mensal</h3>
                    <div className="flex items-end gap-1.5 h-40 px-2 border-b border-gray-50 pb-1">
                      {[35, 50, 30, 65, 85, 60, 95, 75, 90, 100, 80, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full">
                          <div className="w-full flex gap-1 items-end h-full">
                            <div className="flex-1 bg-green-500/80 rounded-t-sm" style={{ height: h + '%' }} />
                            <div className="flex-1 bg-red-400/80 rounded-t-sm" style={{ height: (h * 0.45) + '%' }} />
                          </div>
                          <span className="text-[7px] font-black text-gray-300 uppercase mt-2">M{i+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <CustomCursor />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[#5932EA]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[30%] h-[30%] bg-[#7C3AED]/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
                <div className="flex flex-wrap justify-center gap-x-6">
                  <span className="hover:text-[#5932EA] transition-colors duration-200 cursor-default">Centralize.</span>
                  <span className="hover:text-[#5932EA] transition-colors duration-200 cursor-default">Simplifique.</span>
                </div>
                <span className="inline-block hover:text-[#5932EA] transition-colors duration-200 cursor-default">Gerencie.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Centralize seus canais de venda em um só lugar.
                Simplifique seus processos e potencialize seus resultados.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => navigate('/auth')} className="bg-[#5932EA] hover:bg-[#4A28C7] px-12 h-16 text-xl font-bold shadow-lg rounded-xl transition-all hover:scale-105 active:scale-95">
                  Começar agora
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mockup do Monitor Interativo com Dashboard Real */}
        <section className="py-12 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
              Explore o sistema real abaixo
            </div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[500px] md:h-[650px] w-full shadow-3xl overflow-hidden shadow-[#5932EA]/10">
                <div className="h-full w-full bg-white">
                  <MockDashboard />
                </div>
              </div>
              <div className="relative mx-auto bg-gray-900 rounded-b-xl h-[24px] w-[150px] md:w-[200px]"></div>
              <div className="relative mx-auto bg-gray-800 rounded-b-xl h-[12px] w-[250px] md:w-[350px]"></div>
            </motion.div>
          </div>
        </section>

        {/* Diferenciais Originais */}
        <section className="py-32 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Por que escolher a Evolux?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Descubra como nossa plataforma pode transformar a gestão do seu negócio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={Settings} 
                title="Automação Inteligente" 
                description="Processos automatizados que economizam tempo e reduzem erros"
                delay={0.1}
              />
              <FeatureCard 
                icon={Share2} 
                title="Integração Total" 
                description="Conecte todos seus canais de venda em uma única plataforma"
                delay={0.2}
              />
              <FeatureCard 
                icon={FileText} 
                title="Relatórios Avançados" 
                description="Análises detalhadas para decisões estratégicas assertivas"
                delay={0.3}
              />
              <FeatureCard 
                icon={Users} 
                title="Gestão Unificada" 
                description="Controle total de vendas, estoque e relacionamento com clientes"
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* Final CTA - Full Width */}
        <section className="py-24">
          <div className="bg-[#5932EA] w-full py-32 px-4 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 leading-tight">
                Pronto para transformar a gestão do seu negócio?
              </h2>
              <a href="https://forms.gle/Too6zAkpvu3uUDjf8" target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-[#5932EA] hover:bg-gray-100 h-20 px-16 text-2xl font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl">
                  Entre em contato
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;