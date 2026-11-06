import React, { useState, useMemo } from 'react';
import { Flame, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Info, RefreshCw, Zap, Layers } from 'lucide-react';
import { WowItem } from '../types/wow';
import { WOW_ITEMS, getItemById, getItemIconUrl, getItemQualityBorder } from '../data/items';
import { evaluateSubstitution } from '../engine/substitutionAuditor';
import { useItemTooltip } from '../context/TooltipContext';

interface Props {
  equippedItems: WowItem[];
  scenario: 'delve_rooms' | 'delve_boss' | 'mplus' | 'raid';
}

export const SimulatedBurstWindow: React.FC<Props> = ({ equippedItems, scenario }) => {
  const { showTooltip, updateTooltipPosition, hideTooltip, pinTooltip } = useItemTooltip();

  // User customizable stat profile
  const [intellect, setIntellect] = useState<number>(14200);
  const [hastePct, setHastePct] = useState<number>(33.5);
  const [critPct, setCritPct] = useState<number>(21.0);
  const [masteryPct, setMasteryPct] = useState<number>(45.0);
  const [versPct, setVersPct] = useState<number>(7.5);

  // Track toggle: Herói (321-328) vs Mito (334-341) - User requested flexibility for AoE!
  const [track, setTrack] = useState<'hero' | 'myth'>('myth');

  // Selected candidate item to simulate
  const [candidateId, setCandidateId] = useState<number>(273649); // Emblema Tempestuoso de Dazar
  const candidateItem = useMemo(() => getItemById(candidateId) ?? WOW_ITEMS[0], [candidateId]);

  // Find corresponding equipped item for candidate's slot
  const currentEquipped = useMemo(() => {
    return equippedItems.find(
      it =>
        it.slot === candidateItem.slot ||
        (candidateItem.slot.startsWith('finger') && it.slot.startsWith('finger')) ||
        (candidateItem.slot.startsWith('trinket') && it.slot.startsWith('trinket'))
    ) ?? null;
  }, [equippedItems, candidateItem]);

  // Run G0-G8 audit
  const audit = useMemo(() => {
    return evaluateSubstitution(currentEquipped, candidateItem, {
      targetScenario: scenario,
      activeTierPiecesCount: 4,
      equippedEmbellishmentsCount: 2,
      otherEquippedTrinket: candidateItem.slot === 'trinket1'
        ? getItemById(273794) // Nó de Serpentes (passivo)
        : getItemById(273649),
      hasSecondHandOccupied: true
    });
  }, [currentEquipped, candidateItem, scenario]);

  // Calculate 20-second timeline points for Baseline vs Candidate
  const { timeline, baselineTotal, upgradedTotal, deltaPct, deltaDps } = useMemo(() => {
    // Stat multipliers
    const trackScaling = track === 'hero' ? 0.94 : 1.0; // Heroic track delivers ~94% throughput, saving massive crests
    const baseIntMod = (intellect / 10000) * trackScaling;
    const baseHasteMod = 1 + hastePct / 100;
    const baseCritMod = 1 + (critPct / 100) * 1.0;
    const baseMastMod = 1 + (masteryPct / 100) * 0.85;

    // Candidate modifiers
    let candIntDelta = (candidateItem.stats?.intellect ?? 0) - (currentEquipped?.stats?.intellect ?? 0);
    let candHasteDelta = (candidateItem.stats?.haste ?? 0) - (currentEquipped?.stats?.haste ?? 0);
    let candCritDelta = (candidateItem.stats?.crit ?? 0) - (currentEquipped?.stats?.crit ?? 0);
    let candMastDelta = (candidateItem.stats?.mastery ?? 0) - (currentEquipped?.stats?.mastery ?? 0);

    // Trinket special active effect
    let isDazarBurst = candidateItem.id === 273649; // +1082 Haste during 20s
    let has4pcBroken = audit.gates.find(g => g.gate === 'G4' && !g.passed);
    let hasTrinketClash = audit.gates.find(g => g.gate === 'G5' && !g.passed);

    const candIntMod = ((intellect + candIntDelta) / 10000) * trackScaling;
    const candHasteMod = 1 + (hastePct + (candHasteDelta / 100) + (isDazarBurst ? 14.5 : 0)) / 100;
    const candCritMod = 1 + (critPct + candCritDelta / 100) / 100 * 1.0;
    const candMastMod = 1 + (masteryPct + candMastDelta / 100) / 100 * 0.85;

    const points: { second: number; baseline: number; upgraded: number; event?: string }[] = [];
    let bSum = 0;
    let uSum = 0;

    for (let s = 1; s <= 20; s++) {
      let phaseMultiplier = 1.0;
      let event: string | undefined;

      // Phase 1 (1-3s): Setup (Hand of Guldan, Imps spawn)
      if (s <= 3) {
        phaseMultiplier = 0.5 + (s * 0.25);
        if (s === 2) event = 'Setup: Mão de Gul\'dan';
      }
      // Phase 2 (4-7s): Tyrant Invocation + Dazar On-Use Peak
      else if (s <= 7) {
        phaseMultiplier = 1.6 + (s - 3) * 0.2;
        if (s === 4) event = 'Evocar Tirano + Berloque Ativo';
      }
      // Phase 3 (8-14s): Diabolist Greater Demon (Pit Lord / Infernal) + Folio Echoes
      else if (s <= 14) {
        phaseMultiplier = 2.4 + Math.sin(s) * 0.15;
        if (s === 9) event = 'Diabolista: Lorde do Poço';
        if (s === 12) event = 'Folio: Ecos 5C (50% dano)';
      }
      // Phase 4 (15-20s): Implosion sequence with 4pc (350%/315%)
      else {
        phaseMultiplier = 2.2 - (s - 14) * 0.12;
        if (s === 16) event = 'Implosão 4pc (350%/315%)';
      }

      // Base second damage
      let baseDps = 320000 * baseIntMod * baseHasteMod * baseCritMod * baseMastMod * phaseMultiplier;

      // Upgraded second damage
      let upDps = 320000 * candIntMod * candHasteMod * candCritMod * candMastMod * phaseMultiplier;

      // Penalties if gates failed
      if (has4pcBroken) {
        upDps *= 0.72; // Losing 4pc imp explosion is devastating (-28%)
      }
      if (hasTrinketClash) {
        upDps *= 0.88; // Two on-use trinkets sharing cooldown penalty
      }

      // Cantrip bonus
      if (candidateItem.cantrip) {
        upDps *= 1.035; // +3.5% passive cantrip procs
      }

      bSum += baseDps;
      uSum += upDps;

      points.push({
        second: s,
        baseline: Math.round(baseDps),
        upgraded: Math.round(upDps),
        event
      });
    }

    const bAvg = Math.round(bSum / 20);
    const uAvg = Math.round(uSum / 20);
    const delta = uAvg - bAvg;
    const pct = ((uAvg - bAvg) / bAvg) * 100;

    return {
      timeline: points,
      baselineTotal: bAvg,
      upgradedTotal: uAvg,
      deltaPct: parseFloat(pct.toFixed(2)),
      deltaDps: delta
    };
  }, [intellect, hastePct, critPct, masteryPct, candidateItem, currentEquipped, audit, track]);

  const maxDps = Math.max(...timeline.map(p => Math.max(p.baseline, p.upgraded)));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-6">
      {/* Title & Scope */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold text-amber-400">Simulador de Janela de Burst</span>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
              Janela de 20s · Tirano Diabólico
            </span>
            <span className="text-[10px] bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-700/50">
              {scenario === 'delve_boss' ? 'Modo: Chefe Kindo\'jan' : 'Modo: Salas do Labirinto (AoE)'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            Impacto da Troca de Peça no Pico de Dano (G0–G8)
          </h3>
          <p className="text-xs text-zinc-400">
            Ajuste seu perfil de atributos atuais e selecione o item candidato para visualizar a curva comparativa do burst com visual estilo Raidbots.
          </p>
        </div>

        {/* Heroic vs Mythic Track Toggle + Candidate Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {/* Track Switcher */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <span className="text-zinc-500 text-[11px] px-1.5 font-medium">Trilha:</span>
            <button
              onClick={() => setTrack('hero')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                track === 'hero' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Trilha Herói (321–328): Acessível e rápida de montar para AoE"
            >
              Herói (321–328)
            </button>
            <button
              onClick={() => setTrack('myth')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                track === 'myth' ? 'bg-amber-500 text-zinc-950 font-black shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Trilha Mito (334–341): Teto da temporada"
            >
              Mito (334–341)
            </button>
          </div>

          {/* Selected Candidate Quick Selector with Raidbots Icon */}
          <div className="flex items-center space-x-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <img
              src={getItemIconUrl(candidateItem)}
              alt={candidateItem.namePt}
              className={`w-7 h-7 rounded border ${getItemQualityBorder(candidateItem)} flex-shrink-0 cursor-pointer hover:scale-105 transition`}
              onMouseEnter={(e) => {
                showTooltip(candidateItem.id, e, {
                  slot: candidateItem.slot,
                  itemPt: candidateItem.namePt,
                  itemEn: candidateItem.nameEn,
                  ilvl: candidateItem.ilvl,
                  track: track === 'hero' ? 'hero' : 'myth'
                });
              }}
              onMouseMove={updateTooltipPosition}
              onMouseLeave={hideTooltip}
              onClick={() => {
                pinTooltip(candidateItem.id, {
                  slot: candidateItem.slot,
                  itemPt: candidateItem.namePt,
                  itemEn: candidateItem.nameEn,
                  ilvl: candidateItem.ilvl,
                  track: track === 'hero' ? 'hero' : 'myth'
                });
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
              }}
            />
            <select
              value={candidateId}
              onChange={(e) => setCandidateId(parseInt(e.target.value, 10))}
              className="bg-transparent border-none text-xs text-zinc-200 pr-2 focus:outline-none max-w-xs truncate font-medium"
            >
              {WOW_ITEMS.map((item) => (
                <option key={item.id} value={item.id} className="bg-zinc-900 text-zinc-100">
                  [{track === 'hero' ? (item.ilvl > 330 ? 328 : item.ilvl) : item.ilvl}] {item.namePt} ({item.slot.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User Stat Profile Inputs */}
      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-semibold">
          <span>Seu Perfil Atual de Atributos (Entrada do Jogador):</span>
          <span className="text-zinc-500 text-[11px]">Valores no nível 80</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="text-[11px] text-zinc-400">Intelecto Base</label>
            <input
              type="number"
              value={intellect}
              onChange={(e) => setIntellect(Number(e.target.value))}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-purple-400 font-semibold">Aceleração %</label>
            <input
              type="number"
              step="0.5"
              value={hastePct}
              onChange={(e) => setHastePct(Number(e.target.value))}
              className="w-full mt-1 bg-zinc-900 border border-purple-800/60 rounded-lg px-2.5 py-1 text-xs text-purple-200 font-mono focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-amber-400">Crítico %</label>
            <input
              type="number"
              step="0.5"
              value={critPct}
              onChange={(e) => setCritPct(Number(e.target.value))}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-cyan-400">Maestria %</label>
            <input
              type="number"
              step="0.5"
              value={masteryPct}
              onChange={(e) => setMasteryPct(Number(e.target.value))}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-emerald-400">Versatilidade %</label>
            <input
              type="number"
              step="0.5"
              value={versPct}
              onChange={(e) => setVersPct(Number(e.target.value))}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-100 font-mono focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* KPI Delta Cards with Raidbots-like Item Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Current Item */}
        <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-850 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 uppercase">Média do Burst Atual</span>
            <div className="text-xl font-black text-amber-400 mt-1">
              {baselineTotal.toLocaleString('pt-BR')} <span className="text-xs font-normal text-zinc-500">DPS</span>
            </div>
          </div>
          <div
            className={`mt-2 pt-2 border-t border-zinc-850 flex items-center space-x-2 ${currentEquipped ? 'cursor-pointer group' : ''}`}
            onMouseEnter={(e) => {
              if (currentEquipped) {
                showTooltip(currentEquipped.id, e, {
                  slot: currentEquipped.slot,
                  itemPt: currentEquipped.namePt,
                  itemEn: currentEquipped.nameEn,
                  ilvl: currentEquipped.ilvl
                });
              }
            }}
            onMouseMove={updateTooltipPosition}
            onMouseLeave={hideTooltip}
            onClick={() => {
              if (currentEquipped) {
                pinTooltip(currentEquipped.id, {
                  slot: currentEquipped.slot,
                  itemPt: currentEquipped.namePt,
                  itemEn: currentEquipped.nameEn,
                  ilvl: currentEquipped.ilvl
                });
              }
            }}
          >
            <img
              src={getItemIconUrl(currentEquipped)}
              alt="Atual"
              className={`w-6 h-6 rounded border ${getItemQualityBorder(currentEquipped)} flex-shrink-0 group-hover:scale-105 transition`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
              }}
            />
            <span className="text-[11px] text-zinc-400 truncate group-hover:text-amber-300 transition">
              {currentEquipped ? currentEquipped.namePt : 'Slot Vazio'}
            </span>
          </div>
        </div>

        {/* Candidate Item */}
        <div className="p-3.5 bg-zinc-950 rounded-xl border border-purple-800/40 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-purple-300 uppercase">Média com Item Proposto</span>
            <div className="text-xl font-black text-purple-400 mt-1">
              {upgradedTotal.toLocaleString('pt-BR')} <span className="text-xs font-normal text-zinc-500">DPS</span>
            </div>
          </div>
          <div
            className="mt-2 pt-2 border-t border-zinc-850 flex items-center space-x-2 cursor-pointer group"
            onMouseEnter={(e) => {
              showTooltip(candidateItem.id, e, {
                slot: candidateItem.slot,
                itemPt: candidateItem.namePt,
                itemEn: candidateItem.nameEn,
                ilvl: candidateItem.ilvl,
                track: track === 'hero' ? 'hero' : 'myth'
              });
            }}
            onMouseMove={updateTooltipPosition}
            onMouseLeave={hideTooltip}
            onClick={() => {
              pinTooltip(candidateItem.id, {
                slot: candidateItem.slot,
                itemPt: candidateItem.namePt,
                itemEn: candidateItem.nameEn,
                ilvl: candidateItem.ilvl,
                track: track === 'hero' ? 'hero' : 'myth'
              });
            }}
          >
            <img
              src={getItemIconUrl(candidateItem)}
              alt="Proposto"
              className={`w-6 h-6 rounded border ${getItemQualityBorder(candidateItem)} flex-shrink-0 group-hover:scale-105 transition`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
              }}
            />
            <span className="text-[11px] text-purple-200 truncate font-semibold group-hover:text-purple-300 transition">
              {candidateItem.namePt} ({candidateItem.ilvl})
            </span>
          </div>
        </div>

        {/* Delta */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          deltaPct >= 0
            ? 'bg-emerald-950/40 border-emerald-800/60'
            : 'bg-rose-950/40 border-rose-800/60'
        }`}>
          <div>
            <span className="text-[11px] font-semibold text-zinc-300 uppercase">Delta de Throughput</span>
            <div className={`text-xl font-black mt-1 flex items-center space-x-1 ${
              deltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              <span>{deltaPct >= 0 ? `+${deltaPct}%` : `${deltaPct}%`}</span>
              <span className="text-xs font-normal text-zinc-400">
                ({deltaDps >= 0 ? `+${deltaDps.toLocaleString('pt-BR')}` : deltaDps.toLocaleString('pt-BR')} DPS)
              </span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 pt-2 border-t border-zinc-800">
            Veredito G0–G8: <strong className={audit.verdict === 'Não vale' ? 'text-rose-400' : 'text-emerald-300'}>{audit.verdict}</strong>
          </p>
        </div>
      </div>

      {/* Visual Chart / Timeline Bar Representation */}
      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-zinc-200">Trajetória do Burst por Segundo (0 a 20 s):</span>
            <div className="flex items-center space-x-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="text-zinc-400">Atual</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              <span className="text-purple-300">Proposto</span>
            </div>
          </div>
          <span className="text-[11px] text-zinc-500">Pico: {maxDps.toLocaleString('pt-BR')} DPS</span>
        </div>

        {/* 20 Bars for Each Second */}
        <div className="h-44 flex items-end gap-1.5 pt-4 pb-2 border-b border-zinc-800">
          {timeline.map((point) => {
            const bHeight = Math.round((point.baseline / maxDps) * 100);
            const uHeight = Math.round((point.upgraded / maxDps) * 100);

            return (
              <div key={point.second} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on Hover */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-zinc-900 border border-zinc-700 p-2 rounded-lg text-[10px] text-zinc-200 z-30 shadow-xl whitespace-nowrap pointer-events-none">
                  <span className="font-bold text-white">Segundo {point.second}s</span>
                  {point.event && <span className="text-amber-300 font-semibold">{point.event}</span>}
                  <span className="text-amber-400">Atual: {point.baseline.toLocaleString('pt-BR')} DPS</span>
                  <span className="text-purple-300">Proposto: {point.upgraded.toLocaleString('pt-BR')} DPS</span>
                </div>

                {/* Comparative Double Bars */}
                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  <div
                    style={{ height: `${bHeight}%` }}
                    className="w-1/2 bg-amber-500/70 hover:bg-amber-400 rounded-t-sm transition-all"
                  />
                  <div
                    style={{ height: `${uHeight}%` }}
                    className={`w-1/2 rounded-t-sm transition-all ${
                      point.upgraded >= point.baseline
                        ? 'bg-purple-500 hover:bg-purple-400'
                        : 'bg-rose-500 hover:bg-rose-400'
                    }`}
                  />
                </div>

                <span className="text-[9px] text-zinc-500 mt-1">{point.second}s</span>
              </div>
            );
          })}
        </div>

        {/* Timeline Key Event Markers */}
        <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-zinc-400">
          <div className="p-1.5 bg-zinc-900/80 rounded border border-zinc-850">
            <strong className="text-amber-300">1s–3s Setup:</strong> Mão de Gul'dan + Diabretes Selvagens.
          </div>
          <div className="p-1.5 bg-zinc-900/80 rounded border border-zinc-850">
            <strong className="text-purple-300">4s–7s Tirano:</strong> Dazar (+1.082 Haste) empoderando demônios.
          </div>
          <div className="p-1.5 bg-zinc-900/80 rounded border border-zinc-850">
            <strong className="text-cyan-300">8s–14s Diabolista:</strong> Lorde do Poço + Ecos do Folio (5C).
          </div>
          <div className="p-1.5 bg-zinc-900/80 rounded border border-zinc-850">
            <strong className="text-emerald-300">15s–20s Implosão:</strong> Bônus 4pc detonando com 350%/315%.
          </div>
        </div>
      </div>

      {/* Official Project Disclaimer */}
      <div className="p-3 bg-zinc-950/80 border border-zinc-850 rounded-xl flex items-start space-x-2 text-[11px] text-zinc-400">
        <Info className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-zinc-300">Aviso Metodológico (§0.2):</strong> Este índice analítico calcula a elasticidade de dano com base nos pesos de atributos da Season 2 e nos amplificadores mecânicos do 4pc dos Grilhões do Necrólito Maldito. Ele reflete o ganho estrutural do equipamento. Para simulação estocástica iterativa de Monte Carlo em nível de milissegundo, confirme sempre no <em>Raidbots / SimulationCraft</em>.
        </p>
      </div>
    </div>
  );
};
