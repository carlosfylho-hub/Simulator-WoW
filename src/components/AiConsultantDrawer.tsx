import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { ActiveSpec } from '../types/wow';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  scenario: string;
  currentSpec?: ActiveSpec;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

const QUICK_PROMPTS = [
  "Qual masmorra M+ devo priorizar considerando a quantidade de drops úteis e catalisador?",
  "Faça as contas de ROI de cada masmorra M+ e explique a densidade de drops úteis.",
  "Quais peças de M+ servem como matéria-prima de Tier 4pc no Catalisador?",
  "Onde devo colocar cada embelezamento (Signo de Sangue e Forro)?",
  "Onde devo gastar minha primeira Centelha de Marés no craft?",
  "Como derrotar o Kindo'jan no Tier 11 solo sem curador?"
];

export const AiConsultantDrawer: React.FC<Props> = ({ isOpen, onClose, scenario, currentSpec = 'demonology' }) => {
  const specDisplayName =
    currentSpec === 'balance'
      ? 'Druida do Equilíbrio'
      : currentSpec === 'shadow'
      ? 'Sacerdote das Sombras'
      : currentSpec === 'affliction'
      ? 'Bruxo Suplício'
      : currentSpec === 'destruction'
      ? 'Bruxo Destruição'
      : 'Bruxo Demonologia';

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Olá! Sou seu Consultor Tático e Motor de Decisão para World of Warcraft: Midnight (Patch 12.1.5, Temporada 2).\n\nEstou configurado com os dados auditados de **${specDisplayName}** e o motor de cálculo de ROI de drops de Masmorras M+ e Imersões. Como posso ajudar na sua otimização hoje?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          specId: currentSpec,
          currentGearSummary: `${specDisplayName}, foco em Imersões e M+, sem raide. Prioridade de secundários: Aceleração > Crítico/Maestria > Versatilidade. Rota de progressão sem raide.`,
          scenario: scenario === 'delve_boss' ? 'Chefe Kindo\'jan (T11 Solo)' : scenario === 'delve_rooms' ? 'Salas do Labirinto de Kindo\'jan' : 'Masmorras M+'
        })
      });

      const data = await res.json();
      const reply = data.response || 'Não foi possível obter resposta.';
      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `[Erro de conexão]: ${err.message || 'Verifique se o backend está ativo.'}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-900/60 border border-purple-700/50 text-purple-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Consultor Estratégico IA</h3>
              <p className="text-[11px] text-zinc-400">Diretrizes Mestras 12.1.5 · Base Auditada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-zinc-900/40 border-b border-zinc-850 overflow-x-auto scrollbar-none flex gap-2">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={isLoading}
              className="text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-3 py-1.5 rounded-lg whitespace-nowrap transition"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-lg bg-purple-900/80 border border-purple-700/60 text-purple-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-zinc-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Analisando combinações e tetos na base auditada...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida estratégica de build..."
              disabled={isLoading}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl shadow transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
