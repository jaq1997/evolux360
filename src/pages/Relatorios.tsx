import { useState, useMemo, useRef, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { AIInsightBar } from "@/components/AIInsightBar";
import { TrendingUp, Users, Zap, Download, FileText, Target, Send, Sparkles, Trash2, Clock, Search } from "lucide-react";
import Groq from "groq-sdk";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ─── Helpers ───────────────────────────────────────────────────────────────
const CHANNEL_COLORS: Record<string, string> = {
  "WhatsApp": "#25D366",
  "E-commerce": "#5932EA",
  "Marketplace": "#F59E0B",
  "Física": "#06B6D4",
  "Outros": "#9CA3AF",
};
const getChannelColor = (ch: string) => CHANNEL_COLORS[ch] ?? "#9CA3AF";

const fmtBRL = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const exportCSV = (filename: string, rows: Record<string, unknown>[]) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([`${headers}\n${body}`], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${filename}.csv`; a.click();
};

const exportPDF = async (elementId: string, filename: string) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#fff" });
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(`${filename}.pdf`);
};

// ─── Sub-components ────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, icon: Icon, highlight }: {
  label: string; value: string; sub?: string; icon: React.ElementType; highlight?: boolean;
}) => (
  <div className={`rounded-2xl border shadow-sm p-5 flex flex-col gap-3 ${highlight ? "bg-[#5932EA] border-[#4A28C7]" : "bg-white border-gray-100"}`}>
    <div className="flex items-center justify-between">
      <span className={`text-xs font-bold uppercase tracking-widest ${highlight ? "text-purple-200" : "text-gray-400"}`}>{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highlight ? "bg-white/20" : "bg-[#5932EA]/10"}`}>
        <Icon className={`w-4 h-4 ${highlight ? "text-white" : "text-[#5932EA]"}`} />
      </div>
    </div>
    <p className={`text-2xl font-black leading-none ${highlight ? "text-white" : "text-gray-900"}`}>{value}</p>
    {sub && <p className={`text-xs font-medium ${highlight ? "text-purple-200" : "text-gray-400"}`}>{sub}</p>}
  </div>
);

const ChartBlock = ({ id, title, children, csvData, csvName, className = "" }: {
  id: string; title: string; children: React.ReactNode;
  csvData?: Record<string, unknown>[]; csvName?: string; className?: string;
}) => (
  <div id={id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      <div className="flex gap-1">
        {csvData && csvName && (
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-gray-400 hover:text-[#5932EA]"
            onClick={() => exportCSV(csvName, csvData)}>
            <Download className="w-3 h-3 mr-1" /> CSV
          </Button>
        )}
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-gray-400 hover:text-[#5932EA]"
          onClick={() => exportPDF(id, title)}>
          <FileText className="w-3 h-3 mr-1" />PDF
        </Button>
      </div>
    </div>
    {children}
  </div>
);

// ─── Custom Tooltip ────────────────────────────────────────────────────────
const ForecastTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-xs">
      <p className="font-black text-gray-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.stroke }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold">{fmtBRL(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Heat Matrix ────────────────────────────────────────────────────────────
const HeatMatrix = ({ data, channels }: { data: any[]; channels: string[] }) => {
  const maxPerChannel = channels.reduce((acc, ch) => {
    acc[ch] = Math.max(...data.map((d: any) => d[ch] || 0), 1);
    return acc;
  }, {} as Record<string, number>);

  if (!data.length || !channels.length) return (
    <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">
      Nenhum pedido com produto e canal cadastrados
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left font-bold text-gray-400 uppercase tracking-wider pb-3 pr-4 text-[10px]">Produto</th>
            {channels.map(ch => (
              <th key={ch} className="text-center font-black pb-3 px-2 text-[10px]" style={{ color: getChannelColor(ch) }}>
                {ch}
              </th>
            ))}
            <th className="text-right font-bold text-gray-400 uppercase tracking-wider pb-3 pl-4 text-[10px]">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => {
            const total = channels.reduce((s, ch) => s + (row[ch] || 0), 0);
            return (
              <tr key={row.name} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-2.5 pr-4 font-semibold text-gray-700 whitespace-nowrap max-w-[120px] truncate">{row.name}</td>
                {channels.map(ch => {
                  const val = row[ch] || 0;
                  const intensity = val / maxPerChannel[ch];
                  const hex = Math.round(intensity * 180 + 20).toString(16).padStart(2, '0');
                  return (
                    <td key={ch} className="px-2 py-2 text-center">
                      {val > 0 ? (
                        <div className="rounded-lg px-2 py-1.5 font-bold inline-block min-w-[60px]"
                          style={{ backgroundColor: `${getChannelColor(ch)}22`, color: getChannelColor(ch), border: `1px solid ${getChannelColor(ch)}${hex}` }}>
                          {fmtBRL(val)}
                        </div>
                      ) : <span className="text-gray-200">—</span>}
                    </td>
                  );
                })}
                <td className="py-2.5 pl-4 text-right font-black text-[#5932EA]">{fmtBRL(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── Product Leaderboard ─────────────────────────────────────────────────────
const ProductLeaderboard = ({ products }: { products: { name: string; revenue: number }[] }) => {
  const maxRev = products[0]?.revenue || 1;
  const total = products.reduce((s, p) => s + p.revenue, 0);
  const medals = ['🥇', '🥈', '🥉'];

  if (!products.length) return (
    <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">Nenhum produto com pedidos</div>
  );

  return (
    <div className="space-y-4">
      {products.map((p, i) => (
        <div key={p.name} className="flex items-center gap-3">
          <span className="text-base w-7 text-center shrink-0 leading-none">
            {i < 3 ? medals[i] : <span className="text-xs font-black text-gray-400">{i + 1}</span>}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-gray-800 truncate">{p.name}</span>
              <span className="text-xs font-black text-[#5932EA] ml-3 shrink-0">{fmtBRL(p.revenue)}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full"
                style={{ width: `${(p.revenue / maxRev) * 100}%`, background: `hsl(${252 + i * 10}, ${82 - i * 6}%, ${56 + i * 4}%)` }} />
            </div>
          </div>
          <span className="text-[10px] font-black text-gray-300 shrink-0 w-8 text-right">
            {((p.revenue / total) * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Embedded Analytics Chat ─────────────────────────────────────────────────────
interface Msg { id: string; role: 'user' | 'assistant'; content: string; }

const REPORT_QUESTIONS = [
  "Qual produto gera mais receita para o meu negócio?",
  "Qual canal de vendas performa melhor?",
  "Quais produtos tenho risco de ficar sem estoque?",
  "Tenho risco de saldo negativo nos próximos dias?",
  "Quais são as formas de pagamento mais usadas?",
  "Quais clientes devo priorizar agora?",
  "Como eu posso aumentar meu faturamento?",
  "Qual o perfil dos meus clientes VIP?",
  "Quais produtos vendem mais por WhatsApp vs E-commerce?",
  "Quais despesas estão pendentes de pagamento?",
];

const CHAT_KEY = "evolux_relatorios_chat";

const AnalyticsChat = ({ systemContext, greeting }: { systemContext: string; greeting: string }) => {
  const initialMsg: Msg = { id: 'init', role: 'assistant', content: greeting };
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CHAT_KEY) || '[]');
      return saved.length > 0 ? saved : [initialMsg];
    } catch { return [initialMsg]; }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem(CHAT_KEY, JSON.stringify(msgs)); }, [msgs]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [msgs]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { id: Date.now().toString(), role: 'user', content: text };
    const aiMsg: Msg = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' };
    setMsgs(prev => [...prev, userMsg, aiMsg]);
    setInput('');
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) throw new Error('missing key');
      const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      const historyForApi = msgs.filter(m => m.id !== 'init').slice(-8).map(m => ({ role: m.role, content: m.content }));
      const stream = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemContext },
          ...historyForApi,
          { role: 'user', content: text },
        ],
        stream: true, max_tokens: 800,
      });
      let full = '';
      for await (const chunk of stream) {
        full += chunk.choices[0]?.delta?.content || '';
        setMsgs(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: full } : m));
      }
    } catch {
      setMsgs(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: 'Erro ao conectar. Verifique VITE_GROQ_API_KEY no arquivo .env.' } : m));
    } finally { setLoading(false); }
  };

  const isOnlyGreeting = msgs.length === 1 && msgs[0].id === 'init';

  return (
    <div id="analytics-chat-top" className="bg-white rounded-2xl shadow-sm w-full">
      {/* Header */}
      <div className="bg-[#5932EA] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-black text-base leading-none truncate">Evolux AI</p>
            <p className="text-purple-200 text-xs mt-0.5 truncate">Assistente inteligente com acesso aos dados do seu negócio</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-300 font-bold">online</span>
          {msgs.length > 1 && (
            <button onClick={() => { setMsgs([initialMsg]); localStorage.removeItem(CHAT_KEY); }}
              className="ml-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Nova conversa">
              <Trash2 className="w-3.5 h-3.5 text-white/60" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="p-6 min-h-[260px] max-h-[400px] overflow-y-auto overflow-x-hidden space-y-4 bg-gray-50/50">
        {msgs.map((m) => (
          <div key={m.id} className="w-full min-w-0">
            <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 bg-[#5932EA] rounded-lg flex items-center justify-center shrink-0 mr-2 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere ${
                m.role === 'user'
                  ? 'bg-[#5932EA] text-white rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm shadow-sm'
              }`}>
                {m.content || (
                  <span className="flex gap-1 items-center h-4">
                    {[0,150,300].map(d => <span key={d} className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                  </span>
                )}
              </div>
            </div>
            {/* Suggested questions after greeting */}
            {m.id === 'init' && isOnlyGreeting && (
              <div className="mt-4 ml-9 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-full overflow-hidden min-w-0">
                {REPORT_QUESTIONS.slice(0, 6).map((q, i) => (
                  <button key={i} onClick={() => send(q)}
                    className="text-left px-3 py-2 rounded-xl bg-white hover:bg-[#5932EA]/5 border border-gray-100 hover:border-[#5932EA]/30 text-xs text-gray-600 font-medium transition-all shadow-sm break-words min-w-0">
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
        {msgs.length > 1 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide max-w-full min-w-0">
            {REPORT_QUESTIONS.slice(0, 4).map((q, i) => (
              <button key={i} onClick={() => send(q)}
                className="shrink px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-500 hover:border-[#5932EA]/50 hover:text-[#5932EA] transition-colors break-words text-left leading-tight max-w-[200px]">
                {q}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} disabled={loading}
            placeholder="Pergunte qualquer coisa sobre seus pedidos, clientes, estoque..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#5932EA]/60 focus:bg-white transition-colors min-w-0" />
          <button type="submit" disabled={!input.trim() || loading}
            className="w-11 h-11 bg-[#5932EA] rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-[#4A28C7] transition-colors shrink-0">
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
        <p className="text-[10px] text-gray-300 text-center mt-3">A Evolux AI acessa seus dados em tempo real e pode cometer erros. Sempre verifique informações importantes.</p>
      </div>
    </div>
  );
};

const Relatorios = () => {
  const { orders, products, customers, transactions, dashboardStats, customerInsights, loading } = useData();
  const [forecastDays, setForecastDays] = useState<7 | 15 | 30>(15);

  // ── Computed values ──────────────────────────────────────────────────────
  const entradas = useMemo(() => transactions.filter(t => t.type === 'Entrada').reduce((s, t) => s + Number(t.value), 0), [transactions]);
  const saidas = useMemo(() => transactions.filter(t => t.type === 'Saída').reduce((s, t) => s + Number(t.value), 0), [transactions]);
  const saldo = entradas - saidas;

  const lowStockProducts = useMemo(() => products.filter(p => (p.stock_quantity || 0) < 10), [products]);
  const inactiveCustomers = useMemo(() => customerInsights.filter(c => c.status === 'Cliente Inativo'), [customerInsights]);
  const vipCount = useMemo(() => customerInsights.filter(c => c.status === 'Cliente VIP').length, [customerInsights]);

  // ── Top Products ─────────────────────────────────────────────────────────
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; revenue: number }> = {};
    orders.forEach(o => {
      const items = (o.items as unknown as { product_name: string; quantity: number; price: number }[]) || [];
      items.forEach(item => {
        if (!map[item.product_name]) map[item.product_name] = { name: item.product_name, revenue: 0 };
        map[item.product_name].revenue += item.price * item.quantity;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  }, [orders]);

  // ── Product × Channel (stacked bar) ──────────────────────────────────────
  const { crossData, allChannels } = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    const channelSet = new Set<string>();
    orders.forEach(o => {
      const ch = (o.origin as string) || "Outros";
      channelSet.add(ch);
      const items = (o.items as unknown as { product_name: string; quantity: number; price: number }[]) || [];
      items.forEach(item => {
        if (!map[item.product_name]) map[item.product_name] = {};
        map[item.product_name][ch] = (map[item.product_name][ch] || 0) + item.price * item.quantity;
      });
    });
    const allChannels = Array.from(channelSet);
    const crossData = Object.entries(map)
      .map(([name, channels]) => ({ name, ...channels }))
      .sort((a: any, b: any) => {
        const sumA = allChannels.reduce((s, ch) => s + (a[ch] || 0), 0);
        const sumB = allChannels.reduce((s, ch) => s + (b[ch] || 0), 0);
        return sumB - sumA;
      })
      .slice(0, 6);
    return { crossData, allChannels };
  }, [orders]);

  // ── Cash Flow Forecast — 3-layer algorithm ───────────────────────────────
  // Layer 1: Confirmed inflows (pending orders)
  // Layer 2: Confirmed outflows (pending transactions)
  // Layer 3: Projected (historical daily average × horizon)
  const forecastData = useMemo(() => {
    // Layer 1: confirmed revenue from non-concluded orders
    const confirmedIn = orders
      .filter(o => !['concluido', 'cancelado'].includes(o.status))
      .reduce((s, o) => s + (o.total_price || 0), 0);

    // Layer 2: confirmed expenses from pending transactions
    const confirmedOut = transactions
      .filter(t => t.type === 'Saída' && t.status === 'Pendente')
      .reduce((s, t) => s + Number(t.value), 0);

    // Layer 3: historical daily averages
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const spanDays = sorted.length > 1
      ? Math.max(1, Math.ceil((new Date(sorted[sorted.length - 1].date).getTime() - new Date(sorted[0].date).getTime()) / (1000 * 60 * 60 * 24)) + 1)
      : 30;
    const avgDailyIn = entradas / spanDays;
    const avgDailyOut = saidas / spanDays;

    // Generate points (filtered by density)
    const step = forecastDays <= 7 ? 1 : forecastDays <= 15 ? 2 : 5;
    const points = Array.from({ length: Math.ceil(forecastDays / step) }, (_, i) => {
      const dayN = (i + 1) * step;
      const historicalIn = Math.round(avgDailyIn * dayN);
      const historicalOut = Math.round(avgDailyOut * dayN);
      return {
        label: `D+${dayN}`,
        "A Receber (pedidos)": Math.round(confirmedIn),
        "A Pagar (despesas)": Math.round(confirmedOut),
        "Projetado (histórico)": Math.round(historicalIn - historicalOut),
        "Saldo Estimado": Math.round(saldo + confirmedIn - confirmedOut + (historicalIn - historicalOut)),
        _confirmedIn: confirmedIn,
        _confirmedOut: confirmedOut,
        _projIn: historicalIn,
        _projOut: historicalOut,
      };
    });
    return points;
  }, [transactions, orders, entradas, saidas, saldo, forecastDays]);

  // ── Insight message ───────────────────────────────────────────────────────
  const insightMsg = useMemo(() => {
    const parts = [];
    if (saldo > 0) parts.push(`Saldo atual de ${fmtBRL(saldo)}.`);
    if (lowStockProducts.length > 0) parts.push(`${lowStockProducts.length} produto(s) com estoque crítico para repor.`);
    if (inactiveCustomers.length > 0) parts.push(`${inactiveCustomers.length} cliente(s) inativos — oportunidade de reativação.`);
    if (vipCount > 0) parts.push(`${vipCount} cliente(s) VIP contribuindo para a maior parte da receita.`);
    return parts.join(' ') || "Cadastre pedidos e transações para gerar insights estratégicos.";
  }, [saldo, lowStockProducts, inactiveCustomers, vipCount]);

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5932EA]" />
      <p className="ml-4 text-gray-500">Processando análises...</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <AIInsightBar message={insightMsg} />

      {/* KPIs Estratégicos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
        <KPICard label="Receita Total" icon={TrendingUp} highlight
          value={`R$ ${dashboardStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          sub={`${dashboardStats.totalOrders} pedidos`} />
        <KPICard label="Ticket Médio" icon={Target}
          value={`R$ ${dashboardStats.averageOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          sub="por pedido" />
        <KPICard label="Clientes VIP" icon={Users}
          value={vipCount.toString()}
          sub={`de ${customers.length} na base`} />
        <KPICard label="Saldo Atual" icon={Zap}
          value={fmtBRL(saldo)}
          sub={`${fmtBRL(entradas)} entrada / ${fmtBRL(saidas)} saída`} />
      </div>

      {/* Previsão de Caixa */}
      <ChartBlock id="rpt-forecast" title="Previsão de Caixa"
        className="w-full min-w-0 overflow-hidden"
        csvData={forecastData.map(d => ({ periodo: d.label, aReceber: d["A Receber (pedidos)"], aPagar: d["A Pagar (despesas)"], projetado: d["Projetado (histórico)"], saldoEstimado: d["Saldo Estimado"] }))}
        csvName="previsao-caixa">
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest shrink-0">Horizonte:</span>
          {([7, 15, 30] as const).map(d => (
            <button key={d} onClick={() => setForecastDays(d)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-black transition-all ${forecastDays === d ? 'bg-[#5932EA] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {d} dias
            </button>
          ))}
        </div>
        {/* Layer legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-[10px] font-bold text-gray-500">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-blue-400" /> A Receber (pedidos)</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-orange-400" /> A Pagar (despesas)</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-gray-300" /> Projetado (histórico)</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#5932EA]" /> Saldo Estimado</div>
        </div>

        <div className="h-[240px] w-full relative">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} barGap={2} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={fmtBRL} width={60} />
                <Tooltip content={<ForecastTooltip />} />
                <ReferenceLine y={0} stroke="#e5e7eb" strokeWidth={1} />
                <Bar dataKey="A Receber (pedidos)" fill="#60A5FA" fillOpacity={0.85} radius={[3, 3, 0, 0]} />
                <Bar dataKey="A Pagar (despesas)" fill="#FB923C" fillOpacity={0.85} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Projetado (histórico)" fill="#D1D5DB" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Saldo Estimado" radius={[3, 3, 0, 0]}>
                  {forecastData.map((entry, i) => (
                    <Cell key={i} fill={entry["Saldo Estimado"] >= 0 ? "#5932EA" : "#F43F5E"} fillOpacity={1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="text-[10px] text-gray-300 mt-2 italic text-right">Pedidos em aberto + despesas + média histórica</p>
      </ChartBlock>

      {/* Evolux AI — Chat de Análise */}
      {(() => {
        const confirmedIn = orders
          .filter(o => !['concluido', 'cancelado'].includes(o.status))
          .reduce((s, o) => s + (o.total_price || 0), 0);
        const lowStockList = lowStockProducts.map(p => `${p.name}(${p.stock_quantity}un)`).join(', ');
        const topProdList = topProducts.slice(0, 3).map(p => `${p.name}:${fmtBRL(p.revenue)}`).join(', ');
        const channelList = allChannels.join(', ');
        const paymentMethods = [...new Set(transactions.map(t => t.payment_method).filter(Boolean))].join(', ');

        const greeting = `Olá! Sou a Evolux AI — tenho acesso completo aos dados do seu negócio em tempo real.

Aqui está o que eu sei sobre você agora:
• ${dashboardStats.totalOrders} pedido(s) | Receita total: ${fmtBRL(dashboardStats.totalRevenue)}
• ${products.length} produto(s) cadastrado(s)${lowStockProducts.length > 0 ? ` — ${lowStockProducts.length} com estoque crítico` : ''}
• ${customers.length} cliente(s) na base${vipCount > 0 ? ` — ${vipCount} VIP(s)` : ''}
• Saldo atual: ${fmtBRL(saldo)} | A receber: ${fmtBRL(confirmedIn)}

Me pergunte qualquer coisa sobre seus dados — vendas, clientes, estoque ou financeiro.`;

        const ctx = `Você é a Evolux AI, assistente de análise de negócios do Evolux360.

DADOS ATUAIS (${new Date().toLocaleDateString('pt-BR')}):
- Receita total: ${fmtBRL(dashboardStats.totalRevenue)} | ${dashboardStats.totalOrders} pedidos | Ticket médio: ${fmtBRL(dashboardStats.averageOrderValue)}
- Saldo de caixa: ${fmtBRL(saldo)} (entradas: ${fmtBRL(entradas)}, saídas: ${fmtBRL(saidas)})
- A receber (pedidos em aberto): ${fmtBRL(confirmedIn)}
- Produtos: ${products.length} cadastrados${lowStockList ? ` | Estoque crítico: ${lowStockList}` : ''}
- Top produtos por receita: ${topProdList || 'sem dados'}
- Canais de venda: ${channelList || 'não informado'}
- Formas de pagamento: ${paymentMethods || 'não informado'}
- Clientes: ${customers.length} total | ${vipCount} VIPs | ${inactiveCustomers.length} inativos

INSTRUÇÕES: Responda em português, seja direto e prático, use os dados acima, sugira ações concretas.`;

        return (
          <div className="w-full min-w-0">
            <AnalyticsChat systemContext={ctx} greeting={greeting} />
          </div>
        );
      })()}

      {/* Biblioteca de Consultas */}
      {(() => {
        const savedMsgs = JSON.parse(localStorage.getItem('evolux_relatorios_chat') || '[]');
        const history = Array.from(new Set(
          savedMsgs
            .filter((m: any) => m.role === 'user')
            .map((m: any) => m.content)
        )).reverse().slice(0, 3);

        const hasHistory = history.length > 0;
        const displayList = hasHistory ? history : [
          "Análise de Sazonalidade: Qual o melhor mês de vendas?",
          "Desempenho por Canal: Onde devo investir mais?",
          "Projeção de Margem: Como melhorar meu lucro líquido?"
        ];

        return (
          <div className="pt-2 w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                {hasHistory ? "Pesquisas Recentes" : "Análises Recomendadas"}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0">
              {displayList.map((q: any, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    window.scrollTo({ top: document.getElementById('analytics-chat-top')?.offsetTop || 0, behavior: 'smooth' });
                  }}
                  className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#5932EA]/30 transition-all text-left min-w-0 w-full"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#5932EA]/5 transition-colors">
                      <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#5932EA]" />
                    </div>
                    <p className="text-xs font-medium text-gray-600 line-clamp-2 group-hover:text-gray-900 leading-relaxed break-words min-w-0">
                      {q}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Alertas estratégicos */}
      {(lowStockProducts.length > 0 || inactiveCustomers.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lowStockProducts.length > 0 && (
            <ChartBlock id="rpt-estoque" title={`⚠️ Estoque Crítico (${lowStockProducts.length})`}
              csvData={lowStockProducts.map(p => ({ produto: p.name, sku: p.sku || '-', estoque: p.stock_quantity }))}
              csvName="alerta-estoque">
              <div className="space-y-2">
                {lowStockProducts.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium text-gray-700">{p.name}</span>
                    <span className={`text-xs font-black px-2 py-1 rounded-full ${p.stock_quantity === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {p.stock_quantity === 0 ? 'Esgotado' : `${p.stock_quantity} un`}
                    </span>
                  </div>
                ))}
              </div>
            </ChartBlock>
          )}
          {inactiveCustomers.length > 0 && (
            <ChartBlock id="rpt-inativos" title={`🔄 Clientes a Reativar (${inactiveCustomers.length})`}
              csvData={inactiveCustomers.map(c => ({ nome: c.name, email: c.email, dias: c.daysSinceLastOrder }))}
              csvName="clientes-inativos">
              <div className="space-y-2">
                {inactiveCustomers.slice(0, 5).map(c => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </div>
                    <span className="text-xs font-black px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                      {c.daysSinceLastOrder}d sem comprar
                    </span>
                  </div>
                ))}
              </div>
            </ChartBlock>
          )}
        </div>
      )}
    </div>
  );
};

export default Relatorios;
