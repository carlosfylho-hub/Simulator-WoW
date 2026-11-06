import React, { useState } from 'react';
import { Swords, Flame, Zap, ChevronDown, CheckCircle2, Info } from 'lucide-react';
import { CombatScenario } from '../types/wow';
import { COMBAT_SCENARIOS, COMBAT_SCENARIOS_LIST, CombatScenarioMeta } from '../data/scenarios';

interface Props {
  currentScenario: CombatScenario;
  onSelectScenario: (scenario: CombatScenario) => void;
  variant?: 'banner' | 'cards' | 'compact';
}

export const CombatScenarioSelector: React.FC<Props> = ({
  currentScenario,
  onSelectScenario,
  variant = 'cards'
}) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  // Fallback to patchwerk if scenario was delve_rooms/delve_boss
  const activeKey: 'patchwerk' | 'dungeon_slice' | 'cleave_aoe' =
    currentScenario === 'dungeon_slice' || currentScenario === 'mplus'
      ? 'dungeon_slice'
      : currentScenario === 'cleave_aoe' || currentScenario === 'delve_rooms'
      ? 'cleave_aoe'
      : 'patchwerk';

  const activeMeta = COMBAT_SCENARIOS[activeKey] || COMBAT_SCENARIOS.patchwerk;

  const renderIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Swords':
        return <Swords className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      default:
        return <Swords className={className} />;
    }
  };

  // Compact navbar or drawer dropdown
  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpenDropdown(!isOpenDropdown)}
          className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl text-xs font-semibold transition active:scale-95 text-zinc-100 shadow-sm"
          title={`Modo de Combate: ${activeMeta.fullName}`}
        >
          <div className="text-amber-400">
            {renderIcon(activeMeta.iconName, 'w-3.5 h-3.5')}
          </div>
          <div className="text-left flex flex-col">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider leading-none">Cenário</span>
            <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {activeMeta.namePt}
            </span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpenDropdown ? 'rotate-180' : ''}`} />
        </button>

        {isOpenDropdown && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Modos de Combate Dinâmicos (Dynamic Combat Scenarios)</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Patch 12.1.5</span>
            </div>

            {COMBAT_SCENARIOS_LIST.map((scen) => {
              const isSelected = activeKey === scen.id;
              return (
                <div
                  key={scen.id}
                  onClick={() => {
                    onSelectScenario(scen.id);
                    setIsOpenDropdown(false);
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-inner'
                      : 'bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-800/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                        {renderIcon(scen.iconName, 'w-4 h-4')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          {scen.namePt} <span className="text-zinc-400 font-normal">({scen.nameEn})</span>
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-amber-300 font-mono">
                          {scen.badge}
                        </span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="mt-1.5 text-[11px] text-zinc-300 leading-snug pl-8">
                    {scen.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Cards layout for tabs (SimcInspectorTab & SimcSideBySideComparison)
  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-zinc-800/80 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-amber-500/15 border border-amber-500/30 rounded-lg text-amber-400">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wide flex items-center space-x-2">
              <span>Modos de Combate Dinâmicos (Dynamic Combat Scenarios)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono font-normal">
                Alterne para recalcular DPS e Pesos de Atributos
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Escolha a situação de luta para avaliar como os itens e atributos escalam em alvo único sustentado, masmorras M+ com burst ou cleave contínuo.
            </p>
          </div>
        </div>

        <div className="text-right hidden md:block">
          <span className="text-[10px] uppercase font-mono text-zinc-500">Cenário Atual:</span>
          <div className="text-xs font-black text-amber-400">
            {activeMeta.namePt} ({activeMeta.nameEn})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {COMBAT_SCENARIOS_LIST.map((scen) => {
          const isSelected = activeKey === scen.id;
          return (
            <div
              key={scen.id}
              onClick={() => onSelectScenario(scen.id)}
              className={`p-4 rounded-xl border transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500/15 to-zinc-900 border-amber-500 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/60'
                  : 'bg-zinc-950/60 border-zinc-800/90 hover:bg-zinc-800/50 hover:border-zinc-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-amber-500 text-zinc-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-bl-lg flex items-center space-x-1 shadow">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ativo</span>
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2.5 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow'
                        : 'bg-zinc-800/80 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    {renderIcon(scen.iconName, 'w-4 h-4')}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      {scen.namePt}
                    </h4>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      ({scen.nameEn})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  {scen.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-zinc-800/60 mt-auto space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">Prioridade:</span>
                  <span className="font-mono text-zinc-200 font-semibold text-[10px]">
                    {scen.statPriorityDescription}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">Duração / Alvos:</span>
                  <span className="text-zinc-400 font-medium text-[10px]">
                    {scen.targetCount} · {scen.combatLength}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
