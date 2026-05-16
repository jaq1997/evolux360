import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AIInsightBarProps {
  message: string;
  action?: { label: string; onClick: () => void };
}

export const AIInsightBar = ({ message, action }: AIInsightBarProps) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="bg-gray-900 rounded-2xl px-5 py-4 text-white flex items-center justify-between gap-4 shadow-lg shadow-purple-100 border border-white/5"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-[#5932EA] rounded-lg flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-purple-300 shrink-0">Evolux AI</span>
        <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse shrink-0" />
        <p className="text-sm font-medium text-gray-100 leading-snug">{message}</p>
      </div>
    </div>
    {action && (
      <button
        onClick={action.onClick}
        className="shrink-0 px-4 py-1.5 bg-[#5932EA] hover:bg-[#4A28C7] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
      >
        {action.label}
      </button>
    )}
  </motion.div>
);
