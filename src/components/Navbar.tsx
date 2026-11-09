import React from 'react';
import { Flame, Bot } from 'lucide-react';
import { ActiveSpec, CombatScenario } from '../types/wow';
import { CENARIOS_PRINCIPAIS, CENARIOS_AVANCADOS, normalizarCenario } from '../data/scenarios';

export type Area = 'simular' | 'explorar' | 'planejar';

interface NavbarProps {
  area: Area;
  setArea: (area: Area) => void;
  currentSpec: ActiveSpec;
  setCurrentSpec: (spec: ActiveSpec) => void;
  scenario: CombatScenario;
  setScenario: (scen: CombatScenario) => void;
  onOpenAiChat: () => void;
}

const AREAS: { id: Area; label: string }[] = [
  { id: 'simular', label: 'Simular' },
  { id: 'explorar', label: 'Explorar' },
  { id: 'planejar', label: 'Planejar' },
];

const SPECS: { id: ActiveSpec; label: string }[] = [
  { id: 'demonology', label: 'Bruxo Demonologia' },
  { id: 'affliction', label: 'Bruxo Suplício' },
  { id: 'destruction', label: 'Bruxo Destruição' },
  { id: 'balance', label: 'Druida Equilíbrio' },
  { id: 'shadow', label: 'Sacerdote Sombra' },
];


export const Navbar: React.FC<NavbarProps> = ({
  area,
  setArea,
  currentSpec,
  setCurrentSpec,
  scenario,
  setScenario,
  onOpenAiChat,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 text-zinc-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-semibold text-white">Simulador WoW</span>
              <span className="hidden sm:block text-[10px] text-zinc-500">Midnight · S2 · 12.1.5</span>
            </div>
          </div>

          {/* Primary navigation */}
          <nav className="flex items-center gap-1">
            {AREAS.map((item) => {
              const ativo = area === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setArea(item.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${ativo
                    ? 'text-white bg-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Compact settings */}
          <div className="flex items-center gap-2">
            <select
              aria-label="Especialização"
              value={currentSpec}
              onChange={(e) => setCurrentSpec(e.target.value as ActiveSpec)}
              className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-600"
            >
              {SPECS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Cenário"
              value={normalizarCenario(scenario)}
              onChange={(e) => setScenario(e.target.value as CombatScenario)}
              className="hidden lg:block bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-600"
            >
              <optgroup label="Principais">
                {CENARIOS_PRINCIPAIS.map((s) => (
                  <option key={s.valor} value={s.valor}>
                    {s.rotulo}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Mais cenários">
                {CENARIOS_AVANCADOS.map((s) => (
                  <option key={s.valor} value={s.valor}>
                    {s.rotulo}
                  </option>
                ))}
              </optgroup>
            </select>

            <button
              onClick={onOpenAiChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Consultor</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
