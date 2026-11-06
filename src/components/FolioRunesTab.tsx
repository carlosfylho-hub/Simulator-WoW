import React, { useState } from 'react';
import { BookOpen, Sparkles, ShieldAlert, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { FOLIO_RUNES, NOTABLE_COMBINATIONS, getRuneById } from '../data/runes';

interface Props {
  onSelectCombination?: (code: string) => void;
}

export const FolioRunesTab: React.FC<Props> = () => {
  const [selectedRunes, setSelectedRunes] = useState<[string, string, string, string, string]>([
    '1A',
    '2B',
    '3A',
    '4D',
    '5C'
  ]); // Default to C24 (Kindo'jan T11 Boss)

  const handleSelectRune = (rowIdx: number, runeId: string) => {
    const next = [...selectedRunes] as [string, string, string, string, string];
    next[rowIdx] = runeId;
    setSelectedRunes(next);
  };

  const applyPreset = (preset: [string, string, string, string, string]) => {
    setSelectedRunes(preset);
  };

  // Find matching combination if in catalog
  const currentComboStr = selectedRunes.join('-');
  const matchedCombo = NOTABLE_COMBINATIONS.find(
    c => c.runes.join('-') === currentComboStr
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-zinc-800 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold text-cyan-400">Sistema da Temporada 2</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">72 Combinações Possíveis</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Matriz do Folio Ômnico</h2>
            <p className="text-xs text-zinc-400">
              O Folio possui 5 linhas obrigatórias. Cada linha altera um mecanismo diferente; a linha 4 define o atributo e a linha 5 define a capstone.
            </p>
          </div>

          {/* Quick Presets for All 3 Specs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => applyPreset(['1A', '2B', '3A', '4D', '5C'])}
              className="px-2.5 py-1 bg-purple-950/70 hover:bg-purple-900 border border-purple-700/60 text-purple-200 text-xs font-semibold rounded-lg transition"
              title="Bruxo / Druida: Defesa máxima com eco para Kindo'jan T11"
            >
              Kindo'jan T11 (C24)
            </button>
            <button
              onClick={() => applyPreset(['1A', '2C', '3A', '4A', '5B'])}
              className="px-2.5 py-1 bg-amber-950/70 hover:bg-amber-900 border border-amber-700/60 text-amber-200 text-xs font-semibold rounded-lg transition"
              title="Bruxo / Druida: Kiting e velocidade para salas de monstros"
            >
              Salas Delve (C26)
            </button>
            <button
              onClick={() => applyPreset(['1A', '2B', '3A', '4A', '5A'])}
              className="px-2.5 py-1 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-semibold rounded-lg transition"
              title="Universal (Druida, Shadow, Bruxo): Fogo Incontido + Poder Crítico"
            >
              Raide ST BiS (C13)
            </button>
            <button
              onClick={() => applyPreset(['1B', '2C', '3A', '4A', '5A'])}
              className="px-2.5 py-1 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs font-semibold rounded-lg transition"
              title="Shadow Priest: Esferas + Reflexos de Lince para M+"
            >
              Shadow M+ (C61)
            </button>
            <button
              onClick={() => applyPreset(['1B', '2B', '3A', '4C', '5C'])}
              className="px-2.5 py-1 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 text-xs font-semibold rounded-lg transition"
              title="Shadow Priest: Defesa com eco para Delve T11"
            >
              Shadow Delve (C57)
            </button>
          </div>
        </div>

        {/* Warning Banner: Rule 2C vs 2A/2B */}
        <div className="mt-4 p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl flex items-start space-x-2.5 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Atenção à Regra de Leitura Recorrente (§2.7.1):</strong> Dizer que "2C brilha em imersão porque você toma dano" é um erro conceitual grave. A runa <strong>2C (Reflexos de Lince)</strong> concede <strong>+77,5 de velocidade de movimento</strong> para correr e kitear; ela <strong>NÃO É MITIGAÇÃO DE DANO</strong>. A verdadeira mitigação e sobrevida em Delves solo vem de <strong>2A (escudo de absorção)</strong> e <strong>2B (autocura abaixo de 75%)</strong>!
          </div>
        </div>
      </div>

      {/* 5 Rows Visual Selector */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(rowNum => {
          const rowRunes = FOLIO_RUNES.filter(r => r.row === rowNum);
          const currentSelectedId = selectedRunes[rowNum - 1];

          return (
            <div key={rowNum} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-400">
                  Linha {rowNum} {rowNum === 5 ? '— Capstone' : rowNum === 4 ? '— Atributo' : ''}
                </span>
                <span className="text-zinc-500 text-[11px]">
                  Runa Ativa: <strong className="text-cyan-300">{currentSelectedId}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {rowRunes.map(rune => {
                  const isSelected = rune.id === currentSelectedId;
                  return (
                    <div
                      key={rune.id}
                      onClick={() => handleSelectRune(rowNum - 1, rune.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500 shadow-sm ring-1 ring-cyan-500/50'
                          : 'bg-zinc-950 border-zinc-800/90 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-zinc-800">
                            {rune.id}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] bg-cyan-500 text-zinc-950 font-bold px-1.5 py-0.2 rounded">
                              EQUIPADA
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-zinc-100 mt-1.5">{rune.namePt}</h4>
                        <p className="text-[10px] italic text-zinc-500">{rune.nameEn}</p>
                        <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">{rune.mechanism}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-zinc-850 text-[10px] text-zinc-400">
                        <strong className="text-amber-400/90">Custo:</strong> {rune.whatItSacrifices}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Combination Diagnosis */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
          <div>
            <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider">Combinação Formada</span>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2 mt-0.5">
              <span>{matchedCombo ? matchedCombo.code : 'Combinação Personalizada'}:</span>
              <span className="text-cyan-300 font-mono tracking-widest">{selectedRunes.join(' · ')}</span>
            </h3>
          </div>
          {matchedCombo && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60 self-start sm:self-auto">
              {matchedCombo.focus}
            </span>
          )}
        </div>

        <div className="mt-3 text-xs text-zinc-300 space-y-2">
          {matchedCombo ? (
            <>
              <p><strong>Nome Tático:</strong> {matchedCombo.name}</p>
              <p><strong>Cenário Ideal:</strong> {matchedCombo.scenario}</p>
              <p className="text-zinc-400 leading-relaxed"><strong>Mecanismo Geral:</strong> {matchedCombo.mechanicsSummary}</p>
            </>
          ) : (
            <p className="text-zinc-400">
              Esta é uma das 72 combinações do Folio. Cada linha opera de forma independente para mover os eixos de dano, sobrevivência e consistência.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
