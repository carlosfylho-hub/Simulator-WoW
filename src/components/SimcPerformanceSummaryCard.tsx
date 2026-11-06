import { Zap, TrendingUp, Target, ShieldCheck, AlertTriangle, CheckCircle2, Award, Sparkles, BarChart3, HelpCircle, Swords, Flame } from 'lucide-react';
import { ParsedSimcProfile, ActiveSpec, CombatScenario } from '../types/wow';
import { getItemById } from '../data/items';
import { SPEC_PROFILES } from '../data/specs';
import { COMBAT_SCENARIOS } from '../data/scenarios';

interface Props {
  profile: ParsedSimcProfile;
  scenario: CombatScenario;
  activeSpec?: ActiveSpec;
}

interface SpecBreakpoints {
  softcap: number;
  sweetSpot: number;
  hardcap: number;
  notes: string;
  weights: {
    haste: number;
    crit: number;
    mastery: number;
    vers: number;
  };
}

const SPEC_METRICS_DATA: Record<ActiveSpec, SpecBreakpoints> = {
  affliction: {
    softcap: 20.0,
    sweetSpot: 28.0,
    hardcap: 32.0,
    notes: 'Ticks acelerados de Agonia, Corrupção e Agonia Instável (+28% é o ponto doce do Top 50 Murlok).',
    weights: { haste: 1.25, crit: 1.10, mastery: 0.95, vers: 0.75 }
  },
  demonology: {
    softcap: 20.0,
    sweetSpot: 28.5,
    hardcap: 32.0,
    notes: 'Geração acelerada de Estilhaços e cadência máxima de tiros dos Wild Imps e Mão de Gul\'dan.',
    weights: { haste: 1.30, crit: 1.12, mastery: 0.98, vers: 0.72 }
  },
  destruction: {
    softcap: 18.0,
    sweetSpot: 23.0,
    hardcap: 28.0,
    notes: 'Redução crucial do tempo de canalização do Fogo do Caos e aceleração de Incinerar.',
    weights: { mastery: 1.28, haste: 1.15, crit: 1.05, vers: 0.70 }
  },
  balance: {
    softcap: 22.0,
    sweetSpot: 28.0,
    hardcap: 32.0,
    notes: 'Transição rápida entre Eclipses (Solar/Lunar) e 2 ticks adicionais na Chuva Estelar (*Starfall*).',
    weights: { haste: 1.24, mastery: 1.18, crit: 1.04, vers: 0.70 }
  },
  shadow: {
    softcap: 20.0,
    sweetSpot: 26.0,
    hardcap: 30.0,
    notes: 'Redução do tempo de recarga de Impacto Mental e sustentação prolongada da Forma do Vazio.',
    weights: { haste: 1.26, mastery: 1.16, crit: 1.06, vers: 0.74 }
  }
};

export const SimcPerformanceSummaryCard: React.FC<Props> = ({ profile, scenario, activeSpec: propSpec }) => {
  // Deduce effective spec from profile text or props
  const specText = (profile.spec || '').toLowerCase();
  let specKey: ActiveSpec = propSpec || 'demonology';
  if (specText.includes('afflic') || specText.includes('suplí') || specText.includes('supli')) specKey = 'affliction';
  else if (specText.includes('destro')) specKey = 'destruction';
  else if (specText.includes('demo')) specKey = 'demonology';
  else if (specText.includes('balan') || specText.includes('equil')) specKey = 'balance';
  else if (specText.includes('shad') || specText.includes('somb')) specKey = 'shadow';

  const specProfile = SPEC_PROFILES[specKey];
  const specData = SPEC_METRICS_DATA[specKey];

  const SPEC_COLORS: Record<ActiveSpec, string> = {
    demonology: '#a855f7',
    affliction: '#22c55e',
    destruction: '#f97316',
    balance: '#06b6d4',
    shadow: '#ec4899'
  };
  const specColor = SPEC_COLORS[specKey];

  // Gear Audit & Accumulation
  let totalIlvl = 0;
  let equippedCount = 0;
  let tierCount = 0;
  let embellishmentsCount = 0;
  let enchantsCount = 0;
  let socketsCount = 0;
  let activeTrinketCount = 0;
  let passiveTrinketCount = 0;

  let totalInt = 2450; // base stat at level 80
  let totalStam = 38000;
  let totalHasteRating = 0;
  let totalCritRating = 0;
  let totalMasteryRating = 0;
  let totalVersRating = 0;

  const eligibleEnchantSlots = ['head', 'shoulders', 'chest', 'wrists', 'legs', 'feet', 'finger1', 'finger2', 'main_hand'];

  Object.entries(profile.equipped).forEach(([slot, eq]) => {
    if (!eq) return;
    equippedCount++;
    const item = getItemById(eq.id);
    const pieceIlvl = eq.ilvl || item?.ilvl || 321;
    totalIlvl += pieceIlvl;

    if (item?.isTier) tierCount++;
    if (item?.embellished || eq.craftedStats || (item?.isCrafted && item?.embellished)) embellishmentsCount++;
    if (eq.enchantId) enchantsCount++;
    if (eq.gemId) socketsCount++;

    if (item?.isTrinketOnUse) activeTrinketCount++;
    if (item?.isTrinketPassive) passiveTrinketCount++;

    // Add stats from item definition
    if (item?.stats) {
      if (item.stats.intellect) totalInt += item.stats.intellect;
      if (item.stats.stamina) totalStam += item.stats.stamina;
      if (item.stats.haste) totalHasteRating += item.stats.haste;
      if (item.stats.crit) totalCritRating += item.stats.crit;
      if (item.stats.mastery) totalMasteryRating += item.stats.mastery;
      if (item.stats.versatility) totalVersRating += item.stats.versatility;
    }

    // Add stats from crafted missives if specified
    if (eq.craftedStats && eq.craftedStats.length > 0) {
      totalHasteRating += 44;
      totalMasteryRating += 38;
    }
  });

  const avgIlvl = equippedCount > 0 ? (totalIlvl / equippedCount).toFixed(1) : '321.0';

  // Level 80 Secondary Stat Calculations & Diminishing Returns
  // ~40 rating per 1% haste at Level 80
  const rawHastePct = totalHasteRating / 40.0;
  let effectiveHastePct = rawHastePct;
  if (rawHastePct > 20.0) {
    const penaltyAmount = (rawHastePct - 20.0) * 0.10; // 10% penalty past 20%
    effectiveHastePct -= penaltyAmount;
  }
  if (rawHastePct > 30.0) {
    const secondPenalty = (rawHastePct - 30.0) * 0.10; // additional 10% penalty past 30%
    effectiveHastePct -= secondPenalty;
  }
  const hastePctFormatted = effectiveHastePct.toFixed(1);

  const critPct = (5.0 + totalCritRating / 42.0).toFixed(1);
  const masteryPct = (8.0 + totalMasteryRating / 45.0).toFixed(1);
  const versPct = (totalVersRating / 48.0).toFixed(1);

  // Dynamic Combat Scenario Resolution (Option 5)
  const activeScenarioKey: CombatScenario = 
    scenario === 'dungeon_slice' || scenario === 'mplus' 
      ? 'dungeon_slice' 
      : scenario === 'cleave_aoe' || scenario === 'delve_rooms' 
      ? 'cleave_aoe' 
      : 'patchwerk';
  const activeScenarioMeta = COMBAT_SCENARIOS[activeScenarioKey] || COMBAT_SCENARIOS.patchwerk;

  const hasteWeight = activeScenarioMeta.statWeights.haste;
  const critWeight = activeScenarioMeta.statWeights.crit;
  const masteryWeight = activeScenarioMeta.statWeights.mastery;
  const versWeight = activeScenarioMeta.statWeights.vers;

  // DPS Prediction Engine
  const baseDpsFactor = totalInt * 290;
  const secondaryMultiplier = (1 + (parseFloat(critPct) / 100) * critWeight * 0.95) *
    (1 + (effectiveHastePct / 100) * hasteWeight) *
    (1 + (parseFloat(masteryPct) / 100) * masteryWeight * 0.88) *
    (1 + (parseFloat(versPct) / 100) * versWeight * 0.78);

  const tierBonus = tierCount >= 4 ? 0.12 : (tierCount >= 2 ? 0.05 : 0.0);
  const embellishmentBonus = Math.min(2, embellishmentsCount) * 0.024;
  const enchantsBonus = Math.min(1.0, enchantsCount / eligibleEnchantSlots.length) * 0.035;
  const socketBonus = Math.min(3, socketsCount) * 0.015;

  const scenarioMultiplier = activeScenarioMeta.dpsMultiplier;

  const totalDps = Math.round(baseDpsFactor * secondaryMultiplier * (1 + tierBonus + embellishmentBonus + enchantsBonus + socketBonus) * scenarioMultiplier);
  const predictedGainPct = ((tierBonus + embellishmentBonus + enchantsBonus + socketBonus + (parseFloat(avgIlvl) - 300) * 0.005) * 100).toFixed(1);

  // Breakpoints Progress
  const currentHasteNum = parseFloat(hastePctFormatted);
  const sweetSpotNum = specData.sweetSpot;
  const softcapNum = specData.softcap;

  let hasteStatusLabel = 'No Ponto Doce Top 50';
  let hasteStatusColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
  let hasteProgressPct = 100;

  if (currentHasteNum < softcapNum) {
    hasteStatusLabel = `Abaixo do Softcap (${(softcapNum - currentHasteNum).toFixed(1)}% restante)`;
    hasteStatusColor = 'text-amber-400 bg-amber-950/40 border-amber-800/60';
    hasteProgressPct = Math.min(100, Math.round((currentHasteNum / softcapNum) * 50));
  } else if (currentHasteNum < sweetSpotNum) {
    hasteStatusLabel = `Em direção ao Ponto Doce (${(sweetSpotNum - currentHasteNum).toFixed(1)}% restante)`;
    hasteStatusColor = 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60';
    hasteProgressPct = 50 + Math.min(50, Math.round(((currentHasteNum - softcapNum) / (sweetSpotNum - softcapNum)) * 50));
  } else if (currentHasteNum > specData.hardcap) {
    hasteStatusLabel = 'Em Retorno Decrescente Severo (> 32%)';
    hasteStatusColor = 'text-rose-400 bg-rose-950/40 border-rose-800/60';
    hasteProgressPct = 100;
  }

  // Tactical Insight Formulation
  let tacticalInsight = '';
  if (tierCount < 4) {
    tacticalInsight = `Urgência máxima: você possui ${tierCount}/5 peças de tier. Priorize converter drops de M+ (321+) no Catalisador Matriz para liberar o bônus de 4 peças (+12% DPS direto).`;
  } else if (currentHasteNum < sweetSpotNum - 1.5) {
    tacticalInsight = `Aceleração atual (${hastePctFormatted}%) está abaixo do ponto doce do Top 50 (${sweetSpotNum}%). Priorize anéis e pescoço com Aceleração (ex: Feixe de Presas e Elo do Senhor da Guerra Amani).`;
  } else if (embellishmentsCount < 2) {
    tacticalInsight = `Você está com ${embellishmentsCount}/2 embelezamentos ativos. Fabricar Forro de Arcanotrama e Signo de Negraluna trará um ganho imediato de +${(4.8 - embellishmentsCount * 2.4).toFixed(1)}% de dano.`;
  } else if (currentHasteNum > specData.hardcap) {
    tacticalInsight = `Aceleração em ${hastePctFormatted}% ultrapassou o teto de rendimento (${specData.hardcap}%). Troque gemas ou missivas secundárias por ${specKey === 'destruction' ? 'Maestria' : 'Crítico'} para mitigar o retorno decrescente.`;
  } else {
    tacticalInsight = `Build perfeitamente equilibrada! Aceleração em ${hastePctFormatted}% atinge o ponto doce com 4 peças de tier e 2 embelezamentos ativos. Foque em subir o track de Mythic dos berloques.`;
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Glow decorative accent */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: specColor }}
      />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-zinc-800/80 gap-3">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner"
            style={{ backgroundColor: `${specColor}18`, borderColor: `${specColor}40` }}
          >
            <Zap className="w-5 h-5" style={{ color: specColor }} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold text-white tracking-wide">
                {profile.characterName}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold border"
                style={{
                  color: specColor,
                  backgroundColor: `${specColor}15`,
                  borderColor: `${specColor}40`
                }}
              >
                {specProfile.namePt} ({specProfile.nameEn})
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                ilvl {avgIlvl}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Simulação de Performance em tempo real · Patch 12.1.5 (Temporada 2: A Maldição de Ula'tek)
            </p>
          </div>
        </div>

        {/* Scenario and Target Indicator */}
        <div className="flex flex-col items-start md:items-end space-y-1">
          <div className="flex items-center space-x-2 bg-zinc-950/90 px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs shadow-inner">
            <span className="text-zinc-500 font-medium">Modo:</span>
            <span className="text-amber-400 font-bold">
              {activeScenarioMeta.namePt} ({activeScenarioMeta.nameEn})
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] text-zinc-400 font-medium text-left md:text-right max-w-xs sm:max-w-md">
            {activeScenarioMeta.description}
          </span>
        </div>
      </div>

      {/* 3 Core Metric Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        {/* Panel 1: Predicted DPS & Predicted Gain */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>DPS Projetado (Simulado)</span>
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-full">
              +{predictedGainPct}% Otimizado
            </span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black text-white tracking-tight flex items-baseline space-x-1">
              <span>{(totalDps / 1000000).toFixed(2)}M</span>
              <span className="text-xs font-semibold text-zinc-400">DPS</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              ~{totalDps.toLocaleString('pt-BR')} dano/segundo estimado
            </p>
          </div>

          {/* Breakdown Mini List */}
          <div className="pt-2 border-t border-zinc-800/60 grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Tier {tierCount >= 4 ? '4pc' : `${tierCount}pc`}:</span>
              <span className={tierCount >= 4 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                +{tierCount >= 4 ? '12.0%' : (tierCount >= 2 ? '5.0%' : '0%')}
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Embelez. ({embellishmentsCount}/2):</span>
              <span className={embellishmentsCount >= 2 ? 'text-purple-400 font-bold' : 'text-zinc-500'}>
                +{(embellishmentsCount * 2.4).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Engastes/Joias:</span>
              <span className="text-cyan-400 font-bold">
                +{(socketBonus * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Encantamentos:</span>
              <span className="text-amber-400 font-bold">
                +{(enchantsBonus * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Haste Breakpoints Tracker */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Limiares de Aceleração (Haste)</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hasteStatusColor}`}>
              {hasteStatusLabel}
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-white">
                {hastePctFormatted}%
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                Alvo Top 50: <span className="text-amber-400 font-bold">{sweetSpotNum}%</span>
              </div>
            </div>

            {/* Visual Breakpoints Progress Bar */}
            <div className="w-full bg-zinc-800 rounded-full h-2.5 my-1.5 overflow-hidden p-0.5 relative">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400"
                style={{ width: `${Math.min(100, Math.max(8, hasteProgressPct))}%` }}
              />
            </div>

            {/* Breakpoints Ticks */}
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono px-0.5">
              <span>0%</span>
              <span className="text-zinc-400">Softcap: {softcapNum}%</span>
              <span className="text-amber-400 font-bold">Ponto Doce: {sweetSpotNum}%</span>
              <span>Teto: {specData.hardcap}%</span>
            </div>
          </div>

          <p className="text-[10px] text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-2">
            💡 <strong className="text-zinc-300">Efeito no Spec:</strong> {specData.notes}
          </p>
        </div>

        {/* Panel 3: Stat Weights (Pesos de Atributos) */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Pesos de Atributos (Stat Weights)</span>
            </span>
            <span className="text-[10px] text-zinc-400">
              Escala Top 50
            </span>
          </div>

          <div className="space-y-2 my-1">
            {/* Haste */}
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-0.5">
                <span className="text-emerald-400 font-bold">Aceleração (Haste)</span>
                <span className="text-white font-mono">{(specData.weights.haste * hasteWeight).toFixed(2)}x · {hastePctFormatted}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(100, ((specData.weights.haste * hasteWeight) / 1.5) * 100)}%` }} />
              </div>
            </div>

            {/* Crit */}
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-0.5">
                <span className="text-amber-400 font-bold">Acerto Crítico</span>
                <span className="text-white font-mono">{(specData.weights.crit * critWeight).toFixed(2)}x · {critPct}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, ((specData.weights.crit * critWeight) / 1.5) * 100)}%` }} />
              </div>
            </div>

            {/* Mastery */}
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-0.5">
                <span className="text-purple-400 font-bold">Maestria (Mastery)</span>
                <span className="text-white font-mono">{(specData.weights.mastery * masteryWeight).toFixed(2)}x · {masteryPct}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: `${Math.min(100, ((specData.weights.mastery * masteryWeight) / 1.5) * 100)}%` }} />
              </div>
            </div>

            {/* Versatility */}
            <div>
              <div className="flex justify-between text-[11px] font-medium mb-0.5">
                <span className="text-blue-400 font-bold">Versatilidade</span>
                <span className="text-white font-mono">{(specData.weights.vers * versWeight).toFixed(2)}x · {versPct}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-400 h-full rounded-full" style={{ width: `${Math.min(100, ((specData.weights.vers * versWeight) / 1.5) * 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-zinc-400 border-t border-zinc-800/60 pt-1.5 flex flex-col sm:flex-row justify-between gap-1">
            <span>Foco ({activeScenarioMeta.badge}): <strong className="text-zinc-200">{activeScenarioMeta.statPriorityDescription}</strong></span>
            <span className="text-amber-400 font-mono font-bold">{activeScenarioMeta.targetCount}</span>
          </div>
        </div>
      </div>

      {/* Gear Set Health Badges & Tactical Diagnosis */}
      <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tier Badge */}
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center space-x-1.5 ${
              tierCount >= 4
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                : (tierCount >= 2 ? 'bg-amber-950/60 border-amber-800/80 text-amber-300' : 'bg-red-950/60 border-red-800/80 text-red-400')
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bônus de Tier: {tierCount}/5 {tierCount >= 4 ? '(4pc Ativo)' : (tierCount >= 2 ? '(2pc Ativo)' : '(Incompleto)')}</span>
            </div>

            {/* Embellishment Badge */}
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center space-x-1.5 ${
              embellishmentsCount <= 2
                ? 'bg-purple-950/60 border-purple-800/80 text-purple-300'
                : 'bg-red-950/60 border-red-800/80 text-red-300'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Embelezamentos: {embellishmentsCount}/2 {embellishmentsCount <= 2 ? '(Teto R4 Respeitado)' : '(Excedeu Limite!)'}</span>
            </div>

            {/* Enchants Badge */}
            <div className="px-2.5 py-1 rounded-lg border bg-zinc-900 border-zinc-800 text-zinc-300 text-xs font-medium flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Encantamentos: {enchantsCount}/{eligibleEnchantSlots.length} Peças</span>
            </div>

            {/* Trinket Rule Badge */}
            <div className="px-2.5 py-1 rounded-lg border bg-zinc-900 border-zinc-800 text-zinc-300 text-xs font-medium flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Berloques: {activeTrinketCount === 1 && passiveTrinketCount === 1 ? '1 Ativo + 1 Passivo ✓' : `${activeTrinketCount} Ativo / ${passiveTrinketCount} Passivo`}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Tactical Advisor Insight */}
        <div className="flex items-start space-x-2 bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-lg text-xs">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-zinc-300 leading-relaxed">
            <strong className="text-amber-300">Diagnóstico Tático da IA:</strong> {tacticalInsight}
          </p>
        </div>
      </div>
    </div>
  );
};
