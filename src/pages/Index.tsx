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
  const [selectedDetail, setSelectedDetail] = useState<{
    title: string;
    subtitle: string;
    fields: { label: string; value: React.ReactNode }[];
    primaryActionLabel?: string;
  } | null>(null);

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
      className="bg-gray-900 rounded-2xl md:rounded-3xl p-4 md:p-6 text-white relative overflow-hidden mb-6 md:mb-8 shadow-xl shadow-purple-100 border border-white/5"
    >
      <Sparkles className="absolute right-[-1rem] top-[-1rem] w-24 h-24 text-[#5932EA] opacity-20 rotate-12" />
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#5932EA] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-purple-300">Evolux AI Insight</span>
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <p className="text-xs md:text-sm font-bold leading-snug text-gray-100">{message}</p>
        </div>
      </div>
    </motion.div>
  );

  const vendasData = [
    { id: "#1502", client: "João Pedro", channel: "WhatsApp", status: "Novo", val: "R$ 1.500,00", date: "16 Mai, 14:32", items: "1x Tênis Esportivo", payMethod: "PIX" },
    { id: "#1501", client: "Loja do Sul", channel: "Marketplace", status: "Enviado", val: "R$ 4.200,00", date: "16 Mai, 11:15", items: "3x Tênis Casual, 2x Meias", payMethod: "Boleto" },
    { id: "#1500", client: "Distribuidora X", channel: "E-commerce", status: "Concluído", val: "R$ 12.000,00", date: "15 Mai, 18:45", items: "10x Grade Tênis Corrida", payMethod: "Cartão de Crédito" },
    { id: "#1499", client: "Carla Souza", channel: "Física", status: "Concluído", val: "R$ 89,90", date: "15 Mai, 16:20", items: "1x Limpador de Couro", payMethod: "Débito" },
    { id: "#1498", client: "Bruno Silva", channel: "WhatsApp", status: "Separando", val: "R$ 250,00", date: "15 Mai, 10:05", items: "1x Tênis Skate", payMethod: "PIX" },
    { id: "#1497", client: "Maria Clara", channel: "E-commerce", status: "Concluído", val: "R$ 1.100,00", date: "14 Mai, 09:30", items: "2x Tênis Edição Limitada", payMethod: "Cartão de Crédito" },
  ];

  const handleVendaClick = (row: any) => {
    setSelectedDetail({
      title: `Pedido ${row.id}`,
      subtitle: `Cliente: ${row.client}`,
      fields: [
        { label: "Status do Pedido", value: <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${row.status === 'Novo' ? 'bg-blue-50 text-blue-600' : row.status === 'Enviado' ? 'bg-orange-50 text-orange-600' : row.status === 'Concluído' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>{row.status}</span> },
        { label: "Canal de Venda", value: row.channel },
        { label: "Data e Hora", value: row.date },
        { label: "Itens do Pedido", value: row.items },
        { label: "Forma de Pagamento", value: row.payMethod },
        { label: "Valor Total", value: <span className="text-[#5932EA] font-black">{row.val}</span> },
      ],
      primaryActionLabel: "Avançar Status",
    });
  };

  const clientesData = [
    { name: "Ana Maria", email: "ana@gmail.com", total: "R$ 2.450,00", status: "VIP", phone: "(11) 98888-7777", ordersCount: 4, since: "Jan 2025" },
    { name: "Lucas Rocha", email: "lucas@uol.com", total: "R$ 890,00", status: "Ativo", phone: "(21) 97777-6666", ordersCount: 2, since: "Mar 2025" },
    { name: "Felipe Neto", email: "felipe@bol.com", total: "R$ 15.000,00", status: "VIP", phone: "(41) 96666-5555", ordersCount: 18, since: "Nov 2024" },
    { name: "Gabi Martins", email: "gabi@ig.com", total: "R$ 0,00", status: "Inativo", phone: "(31) 95555-4444", ordersCount: 0, since: "Mai 2026" },
  ];

  const handleClienteClick = (c: any) => {
    setSelectedDetail({
      title: c.name,
      subtitle: c.email,
      fields: [
        { label: "Status do Cliente", value: <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${c.status === 'VIP' ? 'bg-purple-100 text-[#5932EA]' : c.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span> },
        { label: "Telefone", value: c.phone },
        { label: "Cliente Desde", value: c.since },
        { label: "Total de Pedidos", value: `${c.ordersCount} pedidos` },
        { label: "Total Gasto", value: <span className="text-[#5932EA] font-black">{c.total}</span> },
      ],
      primaryActionLabel: "Enviar Mensagem",
    });
  };

  const produtosData = [
    { sku: "AD-FRM-LOW", name: "Adidas Forum Low", stock: "40 un", price: "R$ 699,99", category: "Tênis Casual", brand: "Adidas", location: "Corredor A - Prat. 2" },
    { sku: "AD-SMB-12", name: "Adidas Samba", stock: "20 un", price: "R$ 456,00", category: "Tênis Casual", brand: "Adidas", location: "Corredor A - Prat. 4" },
    { sku: "NK-DNK-BL", name: "Nike Dunk Blue", stock: "15 un", price: "R$ 890,00", category: "Tênis Casual", brand: "Nike", location: "Corredor B - Prat. 1" },
    { sku: "NK-AF1-WT", name: "Nike Air Force 1", stock: "5 un", price: "R$ 550,00", category: "Tênis Casual", brand: "Nike", location: "Corredor B - Prat. 3" },
    { sku: "PU-SD-RD", name: "Puma Suede Red", stock: "0 un", price: "R$ 399,00", category: "Tênis Casual", brand: "Puma", location: "Corredor C - Prat. 1" },
  ];

  const handleProdutoClick = (p: any) => {
    setSelectedDetail({
      title: p.name,
      subtitle: `SKU: ${p.sku}`,
      fields: [
        { label: "Status", value: <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${p.stock === '0 un' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{p.stock === '0 un' ? 'Esgotado' : 'Disponível'}</span> },
        { label: "Marca", value: p.brand },
        { label: "Categoria", value: p.category },
        { label: "Localização no Estoque", value: p.location },
        { label: "Estoque Atual", value: p.stock },
        { label: "Preço de Venda", value: <span className="text-[#5932EA] font-black">{p.price}</span> },
      ],
      primaryActionLabel: "Ajustar Estoque",
    });
  };

  return (
    <div className="flex h-full bg-[#F4F7FE] select-none text-gray-900 font-sans overflow-hidden relative">
      {/* Drawer / Modal de Detalhes (Framer Motion Overlay) */}
      <AnimatePresence>
        {selectedDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-6"
            onClick={() => setSelectedDetail(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full md:max-w-lg bg-white rounded-t-[2rem] md:rounded-[2.5rem] max-h-[90%] overflow-y-auto custom-scrollbar p-6 md:p-8 shadow-2xl border border-gray-100 flex flex-col"
            >
              {/* Header do Modal/Drawer */}
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                <div>
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-4 mx-auto md:hidden" />
                  <h3 className="text-lg md:text-xl font-black text-gray-900">{selectedDetail.title}</h3>
                  <p className="text-xs text-gray-400 font-bold">{selectedDetail.subtitle}</p>
                </div>
                <button 
                  onClick={() => setSelectedDetail(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors font-bold text-sm shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Conteúdo do Modal/Drawer */}
              <div className="space-y-4 my-2 flex-1">
                {selectedDetail.fields.map((field: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-bold text-gray-400">{field.label}</span>
                    <span className="text-xs md:text-sm font-black text-gray-800 text-right">{field.value}</span>
                  </div>
                ))}
              </div>

              {/* Footer do Modal/Drawer com Ações Mockadas */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex gap-3">
                <Button className="flex-1 bg-[#5932EA] hover:bg-[#4A28C7] text-white font-bold h-12 rounded-xl shadow-lg shadow-purple-200">
                  {selectedDetail.primaryActionLabel || "Concluído"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedDetail(null)}
                  className="flex-1 border-gray-200 text-gray-600 font-bold h-12 rounded-xl hover:bg-gray-50"
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Fiel ao Print */}
      <div className="w-16 md:w-64 bg-white flex flex-col p-2 md:p-6 border-r border-gray-100 shadow-sm shrink-0">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-8 md:mb-12 md:px-2 mt-2 md:mt-0">
          <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
            <img src="/icone-colorido.svg" alt="Evolux Logo" className="w-full h-full object-contain" />
          </div>
          <div className="hidden md:block overflow-hidden">
            <h1 className="font-black text-xl leading-none tracking-tight truncate">Evolux360</h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider truncate">Simplificando sua gestão</p>
          </div>
        </div>

        <div className="space-y-1.5 md:space-y-2">
          {tabs.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center justify-center md:justify-start gap-3 p-2.5 md:p-3.5 rounded-xl md:rounded-2xl transition-all duration-200 ${
                activeTab === item.label 
                  ? 'bg-[#5932EA] text-white shadow-lg shadow-purple-200' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="hidden md:block text-sm font-bold tracking-tight truncate">{item.label}</span>
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
        <div className="h-16 md:h-20 bg-white/50 backdrop-blur-md px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 border-b border-gray-100/50">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">{activeTab}</h2>
          <div className="flex items-center gap-2 md:gap-4">
             <div className="hidden sm:flex bg-purple-50 text-[#5932EA] px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-purple-100">
               Modo Demo Ativo
             </div>
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center font-black text-[#5932EA] text-xs md:text-sm">A</div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "Dashboard" && (
                <div className="space-y-6 md:space-y-8">
                  <AIInsightBar message="Identifiquei uma oportunidade de aumentar seu ticket médio em 12% com bundles de produtos." />
                  
                  {/* Stats Cards - Fiel ao Print */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    {[
                      { l: "Receita Total", v: "R$ 42.850,00", i: DollarSign, c: "text-gray-400" },
                      { l: "Total de Pedidos", v: "154", i: ShoppingCart, c: "text-gray-400" },
                      { l: "Ticket Médio", v: "R$ 278,24", i: DollarSign, c: "text-gray-400" },
                    ].map((s, idx) => (
                      <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-4 md:mb-6">
                          <p className="text-xs md:text-sm font-bold text-gray-400 tracking-tight">{s.l}</p>
                          <s.i className={`w-4 h-4 md:w-5 md:h-5 ${s.c}`} />
                        </div>
                        <p className="text-xl md:text-2xl font-black text-gray-900">{s.v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Kanban de Pedidos - Fiel ao Print */}
                  <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="mb-6 md:mb-8">
                      <h3 className="text-base md:text-lg font-black mb-1">Controle de Pedidos</h3>
                      <p className="text-xs text-gray-400 font-bold">Arraste os pedidos para atualizar o status.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      {[
                        { title: "Novo Pedido", count: 2, color: "bg-blue-50" },
                        { title: "A Separar", count: 0, color: "bg-orange-50" },
                        { title: "Enviado", count: 1, color: "bg-green-50" }
                      ].map(column => (
                        <div key={column.title} className={`${column.color}/40 rounded-xl md:rounded-[2rem] p-4 md:p-6 min-h-[200px] md:min-h-[300px] border border-gray-50`}>
                          <h4 className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-widest mb-4 md:mb-6">{column.title} ({column.count})</h4>
                          {column.count > 0 && (
                            <div className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 hover:border-[#5932EA] transition-all cursor-grab active:cursor-grabbing group">
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
                   <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-6 md:mb-8">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <h3 className="text-base md:text-lg font-black">Filtros e Busca</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <div className="bg-gray-50 border border-gray-100 h-12 rounded-xl flex items-center px-4">
                          <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                          <span className="text-xs text-gray-400 font-bold truncate">Buscar por ID, cliente...</span>
                        </div>
                        {["Status", "Canal", "Pagamento"].map(f => (
                          <div key={f} className="bg-gray-50 border border-gray-100 h-12 rounded-xl flex items-center justify-between px-4">
                            <span className="text-xs text-gray-400 font-bold truncate">{f}: Todos</span>
                            <div className="w-3 h-3 border-r-2 border-b-2 border-gray-400 rotate-45 mb-1 shrink-0" />
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Versão Desktop: Tabela */}
                   <div className="hidden md:block bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left min-w-[550px]">
                        <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <tr>
                            <th className="px-6 md:px-8 py-4 md:py-5">ID</th>
                            <th className="px-6 md:px-8 py-4 md:py-5">Cliente</th>
                            <th className="px-6 md:px-8 py-4 md:py-5">Canal</th>
                            <th className="px-6 md:px-8 py-4 md:py-5">Status</th>
                            <th className="px-6 md:px-8 py-4 md:py-5 text-right">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs md:text-sm font-medium">
                          {vendasData.map((row, i) => (
                            <tr key={i} onClick={() => handleVendaClick(row)} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer">
                              <td className="px-6 md:px-8 py-4 md:py-6 text-gray-400 font-bold">{row.id}</td>
                              <td className="px-6 md:px-8 py-4 md:py-6 font-black">{row.client}</td>
                              <td className="px-6 md:px-8 py-4 md:py-6">
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-gray-400">{row.channel}</span>
                              </td>
                              <td className="px-6 md:px-8 py-4 md:py-6">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase ${
                                  row.status === 'Novo' ? 'bg-blue-50 text-blue-600' : 
                                  row.status === 'Enviado' ? 'bg-orange-50 text-orange-600' : 
                                  row.status === 'Concluído' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                                }`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-6 md:px-8 py-4 md:py-6 text-right font-black text-[#5932EA]">{row.val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Versão Mobile: Cards */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {vendasData.map((row, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleVendaClick(row)}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#5932EA] transition-all cursor-pointer flex flex-col gap-3 active:scale-[0.99]"
                      >
                        <div className="flex flex-col gap-1.5 border-b border-gray-50 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400">ID: {row.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase w-fit ${
                              row.status === 'Novo' ? 'bg-blue-50 text-blue-600' : 
                              row.status === 'Enviado' ? 'bg-orange-50 text-orange-600' : 
                              row.status === 'Concluído' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                            }`}>
                              {row.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block">Cliente:</span>
                            <h4 className="text-base font-black text-gray-900">{row.client}</h4>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block">Canal:</span>
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{row.channel}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block">Valor:</span>
                            <span className="text-base font-black text-[#5932EA]">{row.val}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-[#5932EA] inline-flex items-center gap-1">Ver detalhes →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Clientes" && (
                <div className="space-y-6 md:space-y-8">
                  <AIInsightBar message="Identifiquei 15 clientes com alto potencial de recompra este mês. Deseja ativar a automação?" />
                  <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex-1 bg-gray-50 h-12 rounded-xl flex items-center px-4 max-w-md">
                      <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                      <span className="text-xs text-gray-400 font-bold truncate">Buscar por nome, email...</span>
                    </div>
                    <Button className="bg-[#5932EA] rounded-xl font-black h-12 sm:w-auto">+ Novo Cliente</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    {[
                      { l: "Total de Clientes", v: "142", sub: "Clientes na base" },
                      { l: "Receita total", v: "R$ 45.280", sub: "Total em vendas" },
                      { l: "Novos Clientes", v: "12", sub: "Últimos 30 dias" },
                    ].map((s, i) => (
                      <div key={i} className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 mb-1">{s.l}</p>
                        <p className="text-xl font-black mb-1">{s.v}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{s.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Versão Desktop: Tabela */}
                  <div className="hidden md:block bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left min-w-[500px]">
                        <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <tr>
                            <th className="px-6 md:px-8 py-4 md:py-5">Cliente</th>
                            <th className="px-6 md:px-8 py-4 md:py-5">Email</th>
                            <th className="px-6 md:px-8 py-4 md:py-5">Total Comprado</th>
                            <th className="px-6 md:px-8 py-4 md:py-5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs md:text-sm font-medium">
                          {clientesData.map((c, i) => (
                            <tr key={i} onClick={() => handleClienteClick(c)} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer">
                              <td className="px-6 md:px-8 py-4 md:py-6 font-black">{c.name}</td>
                              <td className="px-6 md:px-8 py-4 md:py-6 text-gray-400">{c.email}</td>
                              <td className="px-6 md:px-8 py-4 md:py-6 font-black">R$ {c.total}</td>
                              <td className="px-6 md:px-8 py-4 md:py-6">
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

                  {/* Versão Mobile: Cards */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {clientesData.map((c, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleClienteClick(c)}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#5932EA] transition-all cursor-pointer flex flex-col gap-3 active:scale-[0.99]"
                      >
                        <div className="flex flex-col gap-1.5 border-b border-gray-50 pb-3">
                          <div>
                            <span className="text-xs text-gray-400 block">Cliente:</span>
                            <h4 className="text-base font-black text-gray-900">{c.name}</h4>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block">Status:</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase w-fit inline-block ${c.status === 'VIP' ? 'bg-purple-100 text-[#5932EA]' : c.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {c.status}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block">Email:</span>
                            <p className="text-xs font-bold text-gray-700">{c.email}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block">Total Comprado:</span>
                            <span className="text-base font-black text-[#5932EA]">{c.total}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-[#5932EA] inline-flex items-center gap-1">Ver detalhes →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Produtos" && (
                <div className="space-y-6">
                   <AIInsightBar message="Atenção: 3 produtos estão com estoque crítico. A reposição sugerida já está no seu carrinho." />
                   <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 md:mb-8">
                      <h3 className="text-base md:text-lg font-black">Estoque (21)</h3>
                      <Button className="bg-[#5932EA] rounded-xl font-black h-12 sm:w-auto">+ Novo Produto</Button>
                    </div>

                    {/* Versão Desktop: Tabela */}
                    <div className="hidden md:block overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left min-w-[500px]">
                        <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                          <tr>
                            <th className="pb-4 px-2">SKU</th>
                            <th className="pb-4 px-2">Produto</th>
                            <th className="pb-4 px-2">Estoque</th>
                            <th className="pb-4 px-2">Preço Venda</th>
                            <th className="pb-4 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-bold">
                          {produtosData.map((p, i) => (
                            <tr key={i} onClick={() => handleProdutoClick(p)} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer">
                              <td className="py-4 md:py-6 px-2 text-gray-400">{p.sku}</td>
                              <td className="py-4 md:py-6 px-2 font-black">{p.name}</td>
                              <td className="py-4 md:py-6 px-2">{p.stock}</td>
                              <td className="py-4 md:py-6 px-2 text-[#5932EA]">{p.price}</td>
                              <td className="py-4 md:py-6 px-2">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-tight ${p.stock === '0 un' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                  {p.stock === '0 un' ? 'Esgotado' : 'Disponível'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Versão Mobile: Cards */}
                    <div className="grid grid-cols-1 gap-4 md:hidden mt-2">
                      {produtosData.map((p, i) => (
                        <div 
                          key={i} 
                          onClick={() => handleProdutoClick(p)}
                          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#5932EA] transition-all cursor-pointer flex flex-col gap-3 active:scale-[0.99]"
                        >
                          <div className="flex flex-col gap-1.5 border-b border-gray-50 pb-3">
                            <div>
                              <span className="text-xs text-gray-400 block">SKU:</span>
                              <span className="text-xs font-bold text-gray-700">{p.sku}</span>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 block">Produto:</span>
                              <h4 className="text-base font-black text-gray-900">{p.name}</h4>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 block">Status:</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight w-fit inline-block ${p.stock === '0 un' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {p.stock === '0 un' ? 'Esgotado' : 'Disponível'}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 block">Estoque:</span>
                              <span className="text-xs font-bold text-gray-700">{p.stock}</span>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400 block">Preço de Venda:</span>
                              <span className="text-base font-black text-[#5932EA]">{p.price}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-[#5932EA] inline-flex items-center gap-1">Ver detalhes →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                   </div>
                </div>
              )}

              {activeTab === "Financeiro" && (
                <div className="space-y-6 md:space-y-8">
                  <AIInsightBar message="Seu lucro líquido cresceu 8.5% em relação ao mês passado. Ótimo desempenho!" />
                  {/* Cards Financeiros - Fiel ao Financeiro.tsx */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-l-4 border-l-green-500 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entradas</p>
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-xl font-black text-gray-900">R$ 124.5k</p>
                    </div>
                    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-l-4 border-l-red-500 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saídas</p>
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      </div>
                      <p className="text-xl font-black text-gray-900">R$ 82.4k</p>
                    </div>
                    <div className="bg-[#5932EA]/5 p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-l-4 border-l-[#5932EA] shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[9px] md:text-[10px] font-bold text-[#5932EA] uppercase tracking-widest">Saldo</p>
                        <DollarSign className="w-4 h-4 text-[#5932EA]" />
                      </div>
                      <p className="text-xl font-black text-[#5932EA]">R$ 42.1k</p>
                    </div>
                  </div>

                  {/* Gráfico de Fluxo de Caixa Mensal - Replicando visual Recharts */}
                  <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <h3 className="text-base md:text-lg font-black mb-6 md:mb-8 text-gray-700">Fluxo de Caixa Mensal</h3>
                    <div className="overflow-x-auto custom-scrollbar pb-2">
                      <div className="flex items-end gap-1 md:gap-1.5 h-40 px-2 border-b border-gray-50 pb-1 min-w-[380px]">
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
        <section className="pt-28 md:pt-32 pb-16 md:pb-24 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-gray-900 mb-6 md:mb-8 leading-[1.1] tracking-tight">
                <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6">
                  <span className="hover:text-[#5932EA] transition-colors duration-200 cursor-default">Centralize.</span>
                  <span className="hover:text-[#5932EA] transition-colors duration-200 cursor-default">Simplifique.</span>
                </div>
                <span className="inline-block hover:text-[#5932EA] transition-colors duration-200 cursor-default">Gerencie.</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
                Centralize seus canais de venda em um só lugar.
                Simplifique seus processos e potencialize seus resultados.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => navigate('/auth')} className="bg-[#5932EA] hover:bg-[#4A28C7] px-8 md:px-12 h-14 md:h-16 text-lg md:text-xl font-bold shadow-lg rounded-xl transition-all hover:scale-105 active:scale-95">
                  Começar agora
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mockup do Monitor Interativo com Dashboard Real */}
        <section className="py-8 md:py-12 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-6 text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest">
              Explore o sistema real abaixo
            </div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="relative px-2 sm:px-0"
            >
              <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] md:border-[14px] rounded-2xl md:rounded-[2.5rem] h-[500px] md:h-[650px] w-full shadow-3xl overflow-hidden shadow-[#5932EA]/10">
                <div className="h-full w-full bg-white">
                  <MockDashboard />
                </div>
              </div>
              <div className="relative mx-auto bg-gray-900 rounded-b-xl h-[16px] md:h-[24px] w-[120px] md:w-[200px]"></div>
              <div className="relative mx-auto bg-gray-800 rounded-b-xl h-[8px] md:h-[12px] w-[180px] md:w-[350px]"></div>
            </motion.div>
          </div>
        </section>

        {/* Diferenciais Originais */}
        <section className="py-20 md:py-32 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Por que escolher a Evolux?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Descubra como nossa plataforma pode transformar a gestão do seu negócio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
        <section className="py-16 md:py-24">
          <div className="bg-[#5932EA] w-full py-20 md:py-32 px-4 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
            <div className="relative z-10 max-w-4xl mx-auto px-4">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-8 md:mb-10 leading-tight">
                Pronto para transformar a gestão do seu negócio?
              </h2>
              <a href="https://forms.gle/Too6zAkpvu3uUDjf8" target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-[#5932EA] hover:bg-gray-100 h-16 md:h-20 px-10 md:px-16 text-xl md:text-2xl font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl">
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