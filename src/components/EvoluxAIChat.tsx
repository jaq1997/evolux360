import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Trash2 } from "lucide-react";
import Groq from "groq-sdk";
import { useData } from "@/context/DataContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "evolux_ai_chat_history";

const SUGGESTED = [
  "Qual é o status geral do meu negócio?",
  "Quais meus produtos mais vendidos?",
  "Tenho estoque crítico?",
  "Quem são meus clientes VIP?",
  "Como está meu fluxo de caixa?",
];

const PROACTIVE = [
  "Tenho insights sobre seu negócio. Clique para ver!",
  "Evolux AI pronta. Me pergunte sobre vendas, estoque ou clientes.",
  "Analisei seus dados. Quer um resumo agora?",
];

export const EvoluxAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [proactive] = useState(() => PROACTIVE[Math.floor(Math.random() * PROACTIVE.length)]);
  const [showBubble, setShowBubble] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const { orders, products, customers, transactions, dashboardStats } = useData();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const buildSystemPrompt = () => {
    const entradas = transactions.filter(t => t.type === 'Entrada').reduce((s, t) => s + Number(t.value), 0);
    const saidas = transactions.filter(t => t.type === 'Saída').reduce((s, t) => s + Number(t.value), 0);
    const lowStock = products.filter(p => (p.stock_quantity || 0) < 10);
    const pending = orders.filter(o => ['novo_pedido', 'a_separar'].includes(o.status));
    const today = new Date().toLocaleDateString('pt-BR');

    return `Você é a Evolux AI, assistente de inteligência de negócios do sistema Evolux360.

DADOS DO SISTEMA (${today}):
PEDIDOS: Total=${orders.length} | Pendentes=${pending.length} | Receita=R$${dashboardStats.totalRevenue.toFixed(2)} | Ticket médio=R$${dashboardStats.averageOrderValue.toFixed(2)}
PRODUTOS: Total=${products.length} | Estoque crítico (<10un)=${lowStock.length}${lowStock.length > 0 ? ` — ${lowStock.map(p => `${p.name}(${p.stock_quantity}un)`).join(', ')}` : ''}
CLIENTES: Total=${customers.length}
FINANCEIRO: Entradas=R$${entradas.toFixed(2)} | Saídas=R$${saidas.toFixed(2)} | Saldo=R$${(entradas - saidas).toFixed(2)}

INSTRUÇÕES: Responda em português, seja direto e prático, use os dados acima nas respostas, sugira ações concretas, use emojis com moderação.`;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: Date.now() };
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "", timestamp: Date.now() };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        setMessages(prev => prev.map(m =>
          m.id === aiMsg.id ? { ...m, content: "⚠️ Chave de API não configurada. Adicione VITE_GROQ_API_KEY no arquivo .env e reinicie o servidor." } : m
        ));
        setIsLoading(false);
        return;
      }
      const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      const historyForApi = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));

      const stream = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...historyForApi,
          { role: "user", content: text },
        ],
        stream: true,
        max_tokens: 1024,
      });

      let full = "";
      for await (const chunk of stream) {
        full += chunk.choices[0]?.delta?.content || "";
        setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: full } : m));
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === aiMsg.id ? { ...m, content: "Desculpe, ocorreu um erro. Verifique sua chave de API no arquivo .env." } : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const unreadCount = messages.filter(m => m.role === 'assistant').length;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
          >
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className="bg-white border border-gray-100 shadow-xl rounded-2xl px-4 py-3 max-w-[230px] text-sm font-medium text-gray-700 relative cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#5932EA] shrink-0" />
                    <span>{proactive}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsOpen(true); setShowBubble(false); }}
              className="w-16 h-16 bg-[#5932EA] rounded-2xl flex items-center justify-center shadow-xl shadow-purple-200 relative"
            >
              <Sparkles className="w-7 h-7 text-white" />
              <span className="absolute inset-0 rounded-2xl bg-[#5932EA] animate-ping opacity-20" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="bg-gray-900 p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#5932EA] rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg leading-none">Evolux AI</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Assistente de negócios inteligente</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={clearHistory} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Limpar histórico">
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 bg-[#5932EA]/10 rounded-2xl flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-[#5932EA]" />
                    </div>
                    <h4 className="font-black text-gray-900 mb-2">Olá! Sou a Evolux AI.</h4>
                    <p className="text-sm text-gray-500 mb-6">Tenho acesso aos dados do seu negócio em tempo real. Pergunte qualquer coisa.</p>
                    <div className="w-full space-y-2">
                      {SUGGESTED.map((q, i) => (
                        <button key={i} onClick={() => sendMessage(q)}
                          className="w-full text-left p-3 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:border-[#5932EA] hover:text-[#5932EA] transition-all">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 bg-[#5932EA] rounded-lg flex items-center justify-center shrink-0 mr-2 mt-1">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-[#5932EA] text-white rounded-br-sm'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                        }`}>
                          {msg.content || (
                            <span className="flex gap-1 items-center h-4">
                              {[0, 150, 300].map(d => (
                                <span key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={endRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                {messages.length > 0 && (
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                    {SUGGESTED.slice(0, 3).map((q, i) => (
                      <button key={i} onClick={() => sendMessage(q)}
                        className="shrink-0 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-medium text-gray-600 hover:border-[#5932EA] hover:text-[#5932EA] transition-colors whitespace-nowrap">
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                  <input
                    type="text" value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Pergunte sobre vendas, estoque, clientes..."
                    disabled={isLoading}
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5932EA] transition-colors"
                  />
                  <button type="submit" disabled={!input.trim() || isLoading}
                    className="w-12 h-12 bg-[#5932EA] rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-[#4A28C7] transition-colors shrink-0">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
