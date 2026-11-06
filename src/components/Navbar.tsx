import React from 'react';
import { Shield, Sparkles, Flame, Swords, BookOpen, Database, Compass, Bot, Layers, CheckCircle2, ChevronDown } from 'lucide-react';
import { ActiveSpec, CombatScenario } from '../types/wow';
import { CombatScenarioSelector } from './CombatScenarioSelector';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scenario: CombatScenario;
  setScenario: (scen: CombatScenario) => void;
  currentSpec: ActiveSpec;
  setCurrentSpec: (spec: ActiveSpec) => void;
  onOpenAiChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  scenario,
  setScenario,
  currentSpec,
  setCurrentSpec,
  onOpenAiChat
}) => {
  const SPEC_CONFIG: Record<ActiveSpec, { name: string; hero: string; color: string; badgeBg: string }> = {
    demonology: {
      name: 'Bruxo Demonologia',
      hero: 'Diabolista',
      color: 'text-purple-400',
      badgeBg: 'bg-purple-900/50 text-purple-300 border-purple-700/50'
    },
    affliction: {
      name: 'Bruxo Suplício',
      hero: 'Ceifador de Almas',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50'
    },
    destruction: {
      name: 'Bruxo Destruição',
      hero: 'Saqueador do Inferno',
      color: 'text-orange-400',
      badgeBg: 'bg-orange-900/50 text-orange-300 border-orange-700/50'
    },
    balance: {
      name: 'Druida do Equilíbrio',
      hero: 'Escolhido de Eluna',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-900/50 text-amber-300 border-amber-700/50'
    },
    shadow: {
      name: 'Sacerdote das Sombras',
      hero: 'Tecelão do Vazio',
      color: 'text-indigo-400',
      badgeBg: 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50'
    }
  };

  const currentSpecInfo = SPEC_CONFIG[currentSpec] || SPEC_CONFIG.demonology;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-2.5 gap-3">
          {/* Logo & Spec Info */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 via-indigo-800 to-amber-600 flex items-center justify-center shadow-lg shadow-purple-950/50 border border-purple-500/30">
              <Flame className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-white text-base">WoW Decision Engine</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">
                  Patch 12.1.5 · S2
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                <strong className={currentSpecInfo.color}>{currentSpecInfo.name}</strong> · {currentSpecInfo.hero} · Sem Raide
              </p>
            </div>
          </div>

          {/* Class / Spec Switcher Selector */}
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => setCurrentSpec('demonology')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition font-semibold whitespace-nowrap ${
                currentSpec === 'demonology'
                  ? 'bg-purple-700 text-white shadow font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>😈 Demonologia</span>
            </button>

            <button
              onClick={() => setCurrentSpec('affliction')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition font-semibold whitespace-nowrap ${
                currentSpec === 'affliction'
                  ? 'bg-emerald-700 text-white shadow font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>☠️ Suplício</span>
            </button>

            <button
              onClick={() => setCurrentSpec('destruction')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition font-semibold whitespace-nowrap ${
                currentSpec === 'destruction'
                  ? 'bg-orange-600 text-white shadow font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🔥 Destruição</span>
            </button>

            <button
              onClick={() => setCurrentSpec('balance')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition font-semibold whitespace-nowrap ${
                currentSpec === 'balance'
                  ? 'bg-amber-600 text-white shadow font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🌙 Balance</span>
            </button>

            <button
              onClick={() => setCurrentSpec('shadow')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition font-semibold whitespace-nowrap ${
                currentSpec === 'shadow'
                  ? 'bg-indigo-600 text-white shadow font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🔮 Shadow</span>
            </button>
          </div>

          {/* Dynamic Combat Scenarios Selector & AI Advisor Trigger */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <CombatScenarioSelector
              currentScenario={scenario}
              onSelectScenario={setScenario}
              variant="compact"
            />

            <button
              onClick={onOpenAiChat}
              className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-900/40 transition active:scale-95 border border-purple-400/30"
            >
              <Bot className="w-4 h-4 text-purple-200 animate-pulse" />
              <span className="hidden sm:inline">Consultor Tático IA</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation - Perfectly sized to NEVER truncate on any screen */}
        <div className="flex space-x-2 overflow-x-auto py-2 border-t border-zinc-850 scrollbar-thin scrollbar-thumb-zinc-800 pr-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('simc')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex-shrink-0 ${
              activeTab === 'simc' ? 'bg-zinc-800 text-white font-semibold shadow-inner ring-1 ring-zinc-700' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Inspetor SimC</span>
          </button>

          <button
            onClick={() => setActiveTab('builds')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex-shrink-0 ${
              activeTab === 'builds' ? 'bg-zinc-800 text-white font-semibold shadow-inner ring-1 ring-zinc-700' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-pink-400" />
            <span>Simulador de Builds</span>
          </button>

          <button
            onClick={() => setActiveTab('delves')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex-shrink-0 ${
              activeTab === 'delves' ? 'bg-zinc-800 text-white font-semibold shadow-inner ring-1 ring-zinc-700' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Delves & Kindo'jan</span>
          </button>

          <button
            onClick={() => setActiveTab('runes')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex-shrink-0 ${
              activeTab === 'runes' ? 'bg-zinc-800 text-white font-semibold shadow-inner ring-1 ring-zinc-700' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Folio Ômnico (Runas)</span>
          </button>

          <button
            onClick={() => setActiveTab('noraid')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex-shrink-0 ${
              activeTab === 'noraid' ? 'bg-zinc-800 text-white font-semibold shadow-inner ring-1 ring-zinc-700' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rota Sem Raide</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex-shrink-0 ${
              activeTab === 'database' ? 'bg-zinc-800 text-white font-semibold shadow-inner ring-1 ring-zinc-700' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Catálogo de Itens</span>
          </button>
        </div>
      </div>
    </header>
  );
};
