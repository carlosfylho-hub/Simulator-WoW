import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Zap,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Flame,
  ArrowUpRight,
  RefreshCw,
  Copy,
  Info,
  Sliders,
  Check,
  X,
  Swords
} from 'lucide-react';
import { ParsedSimcProfile, WowItem, ItemSlot, ActiveSpec, ParsedSimcItem, CombatScenario } from '../types/wow';
import { getItemById, WOW_ITEMS, getItemIconUrl, getItemQualityBorder, getItemsBySlot } from '../data/items';
import { ilvlDosBonusIds } from '../engine/simcCompare';
import { SPEC_PROFILES } from '../data/specs';
import { COMBAT_SCENARIOS, COMBAT_SCENARIOS_LIST } from '../data/scenarios';
import { useItemTooltip } from '../context/TooltipContext';

interface Props {
  profile: ParsedSimcProfile;
  scenario: CombatScenario;
  onScenarioChange?: (newScenario: CombatScenario) => void;
  activeSpec?: ActiveSpec;
  candidateItemId?: number;
  candidateSlot?: ItemSlot;
  onApplySetupBAsActive?: (newEquipped: Partial<Record<ItemSlot, ParsedSimcItem>>) => void;
}

export type SetupPresetKey = 'equipped' | 'bis_no_raid' | 'murlok_top50' | 'delve_solo' | 'candidate_test';

interface GearSlotData {
  slot: ItemSlot;
  label: string;
  itemA: WowItem | null;
  itemB: WowItem | null;
  ilvlA: number;
  ilvlB: number;
  status: 'identical' | 'upgrade' | 'downgrade' | 'sidegrade';
  ilvlDiff: number;
  isOverridden?: boolean;
}

const ORDERED_SLOTS: { slot: ItemSlot; label: string }[] = [
  { slot: 'head', label: 'Cabeça (Head)' },
  { slot: 'neck', label: 'Pescoço (Neck)' },
  { slot: 'shoulders', label: 'Ombros (Shoulders)' },
  { slot: 'back', label: 'Costas (Back)' },
  { slot: 'chest', label: 'Torso (Chest)' },
  { slot: 'wrists', label: 'Pulsos (Wrists)' },
  { slot: 'hands', label: 'Mãos (Hands)' },
  { slot: 'waist', label: 'Cintura (Waist)' },
  { slot: 'legs', label: 'Pernas (Legs)' },
  { slot: 'feet', label: 'Pés (Feet)' },
  { slot: 'finger1', label: 'Anel 1 (Finger 1)' },
  { slot: 'finger2', label: 'Anel 2 (Finger 2)' },
  { slot: 'trinket1', label: 'Berloque 1 (Trinket 1)' },
  { slot: 'trinket2', label: 'Berloque 2 (Trinket 2)' },
  { slot: 'main_hand', label: 'Arma 1M/2M (Main Hand)' },
  { slot: 'off_hand', label: 'Mão Secundária (Off-Hand)' }
];

// Official tier items across specs for foolproof tier piece detection
const TIER_ITEM_IDS = new Set([
  271546, 271544, 271549, 271547, 271545, // Warlock Tier (Necrólito)
  271528, 271526, 271531, 271529, 271527, // Druid Tier (Velassonhos)
  271555, 271553, 271558, 271556, 271554  // Priest Tier (Penitente)
]);

// Embellished crafted items
const EMBELLISHED_ITEM_IDS = new Set([
  239648, // Braceletes do Mártir (Arcanotrama)
  239649, // Banda do Mártir (Arcanotrama)
  239654, // Sapatilhas do Mártir
  239656, // Mortalha Sedosa do Seguidor
  240949, // Elo Sin'dorei Magistral
  245769, // Lanterna de Aln'hara
  244576, // Defletores do Agente de Luaprata
  244569  // Calçados do Agente de Luaprata
]);

export const SimcSideBySideComparison: React.FC<Props> = ({
  profile,
  scenario,
  activeSpec = 'affliction',
  candidateItemId = 272238,
  candidateSlot = 'wrists',
  onApplySetupBAsActive
}) => {
  const [setupAKey, setSetupAKey] = useState<SetupPresetKey>('equipped');
  const [setupBKey, setSetupBKey] = useState<SetupPresetKey>('murlok_top50');
  const [customOverridesB, setCustomOverridesB] = useState<Partial<Record<ItemSlot, number>>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const { showTooltip, updateTooltipPosition, hideTooltip, pinTooltip } = useItemTooltip();

  const specProfile = SPEC_PROFILES[activeSpec] || SPEC_PROFILES.affliction;

  // Resolve equipped items map from profile
  const equippedMap = useMemo(() => {
    const map: Partial<Record<ItemSlot, WowItem>> = {};
    ORDERED_SLOTS.forEach(({ slot }) => {
      const eq = profile.equipped[slot];
      if (eq) {
        // Use the real imported ilvl (from the export or from the bonus_id),
        // never the catalog default, so "what you have" reflects the character.
        const ilvlReal = eq.ilvl ?? ilvlDosBonusIds(eq.bonusIds);
        const catalogItem = getItemById(eq.id);
        if (catalogItem) {
          map[slot] = ilvlReal ? { ...catalogItem, ilvl: ilvlReal } : catalogItem;
        } else {
          map[slot] = {
            id: eq.id,
            namePt: eq.name || `Item ${eq.id}`,
            nameEn: eq.name || `Item ${eq.id}`,
            slot: slot,
            ilvl: ilvlReal || 321,
            source: 'delve',
            sourceDetail: 'Importado SimC'
          };
        }
      }
    });
    return map;
  }, [profile]);

  // Curated presets based on context docs
  const presetDefinitions = useMemo(() => {
    // 1. BiS No-Raid Preset (Craft 331, Catalyst 334, M+ 341, Delve Wah'du 321)
    const bisNoRaidMap: Partial<Record<ItemSlot, number>> = {
      head: activeSpec === 'balance' ? 271528 : activeSpec === 'shadow' ? 271555 : 271546,
      neck: 273781, // Feixe de Presas Protetoras (341 M+)
      shoulders: activeSpec === 'balance' ? 271526 : activeSpec === 'shadow' ? 271553 : 271544,
      back: 239656, // Mortalha Sedosa do Seguidor (331 Craft)
      chest: activeSpec === 'balance' ? 271531 : activeSpec === 'shadow' ? 271558 : 271549,
      wrists: activeSpec === 'balance' ? 244576 : 239648, // 331 Craft
      hands: activeSpec === 'balance' ? 271529 : activeSpec === 'shadow' ? 271556 : 271547,
      waist: 251222, // Atadura do Éter Etérea (334 M+)
      legs: activeSpec === 'balance' ? 271527 : activeSpec === 'shadow' ? 271554 : 271545,
      feet: activeSpec === 'balance' ? 244569 : 239654, // Sapatilhas do Mártir (331 Craft)
      finger1: 273792, // Elo do Senhor da Guerra Amani (341 M+)
      finger2: 240949, // Elo Sin'dorei Magistral (331 Craft)
      trinket1: 273649, // Emblema de Dazar (341 On-Use M+)
      trinket2: 273794, // Nó de Serpentes (341 Passive M+)
      main_hand: 273778, // Canalizador de Lumineira (341 M+)
      off_hand: 245769 // Lanterna de Aln'hara (331 Craft)
    };

    // 2. Top 50 Murlok Meta (Mythic Raid 334/344 + Venom-Cursed + BiS Trinkets)
    const murlokTop50Map: Partial<Record<ItemSlot, number>> = {
      head: activeSpec === 'demonology' ? 271874 : (activeSpec === 'balance' ? 271528 : activeSpec === 'shadow' ? 271555 : 271546),
      neck: 268265, // Relicário Aqiricida (Raide Ula'tek)
      shoulders: activeSpec === 'balance' ? 271526 : activeSpec === 'shadow' ? 271553 : 271544,
      back: 239656, // Mortalha Sedosa do Seguidor (331 Craft)
      chest: activeSpec === 'balance' ? 271531 : activeSpec === 'shadow' ? 271558 : 271549,
      wrists: activeSpec === 'balance' ? 244576 : 239648, // 331 Craft
      hands: activeSpec === 'balance' ? 271529 : activeSpec === 'shadow' ? 271556 : 271547,
      waist: 239649, // Banda do Mártir (331 Craft)
      legs: activeSpec === 'balance' ? 271527 : activeSpec === 'shadow' ? 271554 : 271545,
      feet: 271548, // Solas do Necrólito Maldito (334 Raide)
      finger1: 281029, // Elo do Chama-enxame (Raide Kith'ix)
      finger2: 240949, // Elo Sin'dorei Magistral (331 Craft)
      trinket1: 281215, // Tentáculo do Terror Pervertido (Raide Ula'tek)
      trinket2: 270164, // Bolsa sem Fundo de Gebbo (M+)
      main_hand: 271092, // Jan'thrazet, a Presa Anímica (344 Raide)
      off_hand: 245769 // Lanterna de Aln'hara (331 Craft)
    };

    // 3. Delve Solo Kindo'jan T11 (Pyretreader Cloth Set 321 + Survivability Accessories)
    const delveSoloMap: Partial<Record<ItemSlot, number>> = {
      head: 272234, // Mitra do Pisa-piras
      neck: 272229, // Talismã Serpentino
      shoulders: 272236, // Dragonas do Pisa-piras
      back: 272225, // Dragonas do Pisa-piras (Capa)
      chest: 272231, // Perponte do Pisa-piras
      wrists: 272238, // Cingidouro do Pisa-piras
      hands: 272233, // Luvas do Pisa-piras
      waist: 272237, // Obi do Pisa-piras
      legs: 272235, // Botinas do Pisa-piras
      feet: 272232, // Alpargatas do Pisa-piras
      finger1: 272147, // Elo Colubrino
      finger2: 272148, // Torvelinho Anguino
      trinket1: 273649, // Emblema de Dazar
      trinket2: 273794, // Nó de Serpentes
      main_hand: 272266, // Adaga do Eidolon Esquecido (328)
      off_hand: 272275 // Trombeta do Canta-almas (321)
    };

    return {
      bis_no_raid: bisNoRaidMap,
      murlok_top50: murlokTop50Map,
      delve_solo: delveSoloMap
    };
  }, [activeSpec]);

  // Helper to resolve an item map for a given setup preset key
  const resolveSetupItems = (key: SetupPresetKey, overrides?: Partial<Record<ItemSlot, number>>): Partial<Record<ItemSlot, WowItem>> => {
    let baseMap: Partial<Record<ItemSlot, WowItem>> = {};

    if (key === 'equipped') {
      baseMap = { ...equippedMap };
    } else if (key === 'candidate_test') {
      baseMap = { ...equippedMap };
      const cand = getItemById(candidateItemId);
      if (cand) {
        baseMap[candidateSlot] = cand;
      }
    } else {
      const presetIds = presetDefinitions[key as keyof typeof presetDefinitions];
      if (presetIds) {
        Object.entries(presetIds).forEach(([slotStr, id]) => {
          const slot = slotStr as ItemSlot;
          const it = getItemById(id);
          if (it) baseMap[slot] = it;
        });
      } else {
        baseMap = { ...equippedMap };
      }
    }

    // Apply any slot overrides (e.g. for Setup B customization)
    if (overrides && Object.keys(overrides).length > 0) {
      Object.entries(overrides).forEach(([slotStr, id]) => {
        if (id) {
          const slot = slotStr as ItemSlot;
          const it = getItemById(id);
          if (it) baseMap[slot] = it;
        }
      });
    }

    return baseMap;
  };

  const setupAItems = useMemo(() => resolveSetupItems(setupAKey), [setupAKey, equippedMap, candidateItemId, candidateSlot, presetDefinitions]);
  const setupBItems = useMemo(() => resolveSetupItems(setupBKey, customOverridesB), [setupBKey, customOverridesB, equippedMap, candidateItemId, candidateSlot, presetDefinitions]);

  // Calculate comprehensive metrics for any item set
  const calculateSetupMetrics = (items: Partial<Record<ItemSlot, WowItem>>) => {
    const itemList = Object.values(items).filter((it): it is WowItem => !!it);
    const count = itemList.length;

    let totalIlvl = 0;
    let totalInt = 2450; // base intellect at Level 80
    let totalStamina = 36000;
    let totalCrit = 0;
    let totalHaste = 0;
    let totalMastery = 0;
    let totalVers = 0;
    let tierCount = 0;
    let embellishmentsCount = 0;
    let hasVenomCursedWeapon = false;
    let onUseTrinketCount = 0;

    itemList.forEach(it => {
      totalIlvl += it.ilvl;
      if (it.stats) {
        if (it.stats.intellect) totalInt += it.stats.intellect;
        if (it.stats.stamina) totalStamina += it.stats.stamina;
        if (it.stats.crit) totalCrit += it.stats.crit;
        if (it.stats.haste) totalHaste += it.stats.haste;
        if (it.stats.mastery) totalMastery += it.stats.mastery;
        if (it.stats.versatility) totalVers += it.stats.versatility;
      }

      // Robust tier detection
      if (it.isTier || TIER_ITEM_IDS.has(it.id)) {
        tierCount++;
      }

      // Robust embellishments detection
      if (it.embellished || EMBELLISHED_ITEM_IDS.has(it.id)) {
        embellishmentsCount++;
      }

      if (it.id === 271092 || it.id === 271874) hasVenomCursedWeapon = true;
      if (it.id === 273649 || it.id === 273796 || it.id === 250215) onUseTrinketCount++;
    });

    const avgIlvl = count > 0 ? totalIlvl / count : 321;

    // Spec baseline ratings at level 80 (~40 rating per 1% haste)
    const baseHastePct = 12;
    const estimatedHastePct = Math.max(10, Math.min(36, baseHastePct + (totalHaste / 40.5)));
    const estimatedCritPct = Math.max(10, Math.min(42, 14 + (totalCrit / 45.0)));
    const estimatedMasteryPct = Math.max(30, Math.min(95, 42 + (totalMastery / 28.0)));
    const estimatedVersPct = Math.max(1, Math.min(18, 2 + (totalVers / 55.0)));

    // Simulation DPS formula calibrated for 12.1.5 (Patch 12.1.5 benchmark: 1.5M for 308 up to 2.2M for 344)
    const ilvlDeltaFactor = Math.pow(avgIlvl / 321, 2.8);
    const primaryFactor = 1 + ((totalInt - 2450) / 14000);
    const secondaryFactor = (1 + (estimatedCritPct / 100) * 0.75) *
      (1 + (estimatedHastePct / 100) * 0.85) *
      (1 + (estimatedMasteryPct / 100) * 0.45) *
      (1 + (estimatedVersPct / 100) * 0.35);

    let tierMultiplier = 1.0;
    if (tierCount >= 4) tierMultiplier = 1.095; // +9.5% for 4pc
    else if (tierCount >= 2) tierMultiplier = 1.04; // +4% for 2pc

    let embellishmentMultiplier = 1.0;
    const cappedEmbellishments = Math.min(2, embellishmentsCount);
    embellishmentMultiplier = 1 + (cappedEmbellishments * 0.025); // +2.5% per active effect up to 2

    let cantripMultiplier = hasVenomCursedWeapon ? 1.025 : 1.0;
    let r4PenaltyMultiplier = onUseTrinketCount > 1 ? 0.965 : 1.0; // -3.5% DPS if double on-use lock

    const rawDps = 1050000 * ilvlDeltaFactor * primaryFactor * secondaryFactor * tierMultiplier * embellishmentMultiplier * cantripMultiplier * r4PenaltyMultiplier;
    const projectedDps = Math.round(rawDps);

    return {
      count,
      avgIlvl,
      totalInt,
      totalStamina,
      totalCrit,
      totalHaste,
      totalMastery,
      totalVers,
      estimatedHastePct,
      estimatedCritPct,
      estimatedMasteryPct,
      estimatedVersPct,
      tierCount,
      embellishmentsCount: Math.min(2, embellishmentsCount),
      hasVenomCursedWeapon,
      onUseTrinketCount,
      projectedDps
    };
  };

  const metricsA = useMemo(() => calculateSetupMetrics(setupAItems), [setupAItems]);
  const metricsB = useMemo(() => calculateSetupMetrics(setupBItems), [setupBItems]);

  // Deltas
  const dpsDelta = metricsB.projectedDps - metricsA.projectedDps;
  const dpsDeltaPct = metricsA.projectedDps > 0 ? (dpsDelta / metricsA.projectedDps) * 100 : 0;
  const ilvlDelta = metricsB.avgIlvl - metricsA.avgIlvl;
  const hasteDelta = metricsB.estimatedHastePct - metricsA.estimatedHastePct;
  const critDelta = metricsB.estimatedCritPct - metricsA.estimatedCritPct;
  const masteryDelta = metricsB.estimatedMasteryPct - metricsA.estimatedMasteryPct;
  const versDelta = metricsB.estimatedVersPct - metricsA.estimatedVersPct;
  const intDelta = metricsB.totalInt - metricsA.totalInt;

  // Check if setups are currently identical
  const areSetupsIdentical = useMemo(() => {
    return Math.abs(dpsDelta) < 100 && Math.abs(ilvlDelta) < 0.05 && Math.abs(hasteDelta) < 0.05;
  }, [dpsDelta, ilvlDelta, hasteDelta]);

  // Slot-by-Slot Comparison Array
  const slotComparisons: GearSlotData[] = useMemo(() => {
    return ORDERED_SLOTS.map(({ slot, label }) => {
      const itemA = setupAItems[slot] ?? null;
      const itemB = setupBItems[slot] ?? null;

      const ilvlA = itemA ? itemA.ilvl : 0;
      const ilvlB = itemB ? itemB.ilvl : 0;
      const ilvlDiff = ilvlB - ilvlA;
      const isOverridden = !!customOverridesB[slot];

      let status: 'identical' | 'upgrade' | 'downgrade' | 'sidegrade' = 'identical';

      if (!itemA && !itemB) {
        status = 'identical';
      } else if (!itemA && itemB) {
        status = 'upgrade';
      } else if (itemA && !itemB) {
        status = 'downgrade';
      } else if (itemA && itemB) {
        if (itemA.id === itemB.id && ilvlA === ilvlB) {
          status = 'identical';
        } else if (ilvlDiff > 0) {
          status = 'upgrade';
        } else if (ilvlDiff < 0) {
          status = 'downgrade';
        } else {
          status = 'sidegrade';
        }
      }

      return {
        slot,
        label,
        itemA,
        itemB,
        ilvlA,
        ilvlB,
        status,
        ilvlDiff,
        isOverridden
      };
    });
  }, [setupAItems, setupBItems, customOverridesB]);

  const handleApplyAsActive = () => {
    if (!onApplySetupBAsActive) return;
    const newEquipped: Partial<Record<ItemSlot, ParsedSimcItem>> = {};
    ORDERED_SLOTS.forEach(({ slot }) => {
      const it = setupBItems[slot];
      if (it) {
        newEquipped[slot] = {
          slot: slot,
          id: it.id,
          name: it.namePt,
          ilvl: it.ilvl,
          rawString: `${slot}=,id=${it.id},bonus_id=328`
        };
      }
    });

    onApplySetupBAsActive(newEquipped);

    // Auto-advance Setup B to a different preset to avoid identical comparison!
    setSetupAKey('equipped');
    if (setupBKey === 'delve_solo') {
      setSetupBKey('murlok_top50');
    } else if (setupBKey === 'murlok_top50') {
      setSetupBKey('bis_no_raid');
    } else {
      setSetupBKey('murlok_top50');
    }
    setCustomOverridesB({});

    setSuccessToast('Setup B foi aplicado como seu perfil Equipado Atual! Setup B avançou para novo preset.');
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const handleSwapSetups = () => {
    const tempKey = setupAKey;
    setSetupAKey(setupBKey);
    setSetupBKey(tempKey);
    setCustomOverridesB({});
  };

  const handleSlotOverride = (slot: ItemSlot, itemId: number) => {
    setCustomOverridesB(prev => ({
      ...prev,
      [slot]: itemId
    }));
  };

  const handleClearSlotOverride = (slot: ItemSlot) => {
    setCustomOverridesB(prev => {
      const copy = { ...prev };
      delete copy[slot];
      return copy;
    });
  };

  const PRESET_OPTIONS: { key: SetupPresetKey; label: string; icon: string }[] = [
    { key: 'equipped', label: 'Equipado Atual (/simc)', icon: '🎒' },
    { key: 'murlok_top50', label: 'Meta Top 50 Murlok', icon: '🏆' },
    { key: 'bis_no_raid', label: 'BiS sem Raide (M+)', icon: '🛡️' },
    { key: 'delve_solo', label: 'Build Solo Delves T11', icon: '⚔️' },
    { key: 'candidate_test', label: 'Candidato em Teste', icon: '🧪' }
  ];

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-600 rounded-xl flex items-center justify-between text-xs text-emerald-200 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header & Dual Setup Preset Selectors */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-zinc-800/80 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Comparador Lado a Lado de Setups (Setup A × Setup B)
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Avalie o ganho líquido de DPS, deltas de atributos, pontos doces de Aceleração e conformidade de tetos da Season 2.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSwapSetups}
              className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-700 transition active:scale-95 shadow-sm"
              title="Inverter Setup A com Setup B"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inverter (A ⇄ B)</span>
            </button>

            {onApplySetupBAsActive && (
              <button
                onClick={handleApplyAsActive}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition active:scale-95"
                title="Gravar peças do Setup B no perfil ativo"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Promover Setup B para Atual</span>
              </button>
            )}
          </div>
        </div>

        {/* Dual Preset Cards with Quick Click Chips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Setup A Box */}
          <div className="p-4 bg-zinc-950/80 border border-cyan-800/30 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <span>Setup A (Base / Referência)</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-500">{metricsA.count} slots ativos</span>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSetupAKey(opt.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center space-x-1 ${setupAKey === opt.key
                      ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-600/80 shadow-sm font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Setup B Box */}
          <div className="p-4 bg-zinc-950/80 border border-purple-800/40 rounded-xl space-y-2.5 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                <span>Setup B (Comparação / Meta)</span>
              </span>
              <div className="flex items-center space-x-2">
                {Object.keys(customOverridesB).length > 0 && (
                  <button
                    onClick={() => setCustomOverridesB({})}
                    className="text-[10px] text-amber-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Limpar {Object.keys(customOverridesB).length} troca(s)</span>
                  </button>
                )}
                <span className="text-[11px] font-mono text-purple-400">{metricsB.count} slots ativos</span>
              </div>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setSetupBKey(opt.key);
                    setCustomOverridesB({});
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center space-x-1 ${setupBKey === opt.key && Object.keys(customOverridesB).length === 0
                      ? 'bg-purple-900/70 text-purple-200 border border-purple-500 shadow-sm font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Identical Setups Warning / Helpful Guidance Banner */}
      {areSetupsIdentical && (
        <div className="p-4 bg-amber-950/40 border border-amber-600/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-900/50 rounded-xl text-amber-400 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wide">
                Setups Idênticos Selecionados
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                O Setup A e o Setup B estão com os mesmos itens equipados. Escolha uma meta diferente para o Setup B para ver as diferenças de DPS e atributos:
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setSetupBKey('murlok_top50');
                setCustomOverridesB({});
              }}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow transition active:scale-95 whitespace-nowrap"
            >
              Comparar com Top 50 Meta
            </button>
            <button
              onClick={() => {
                setSetupBKey('bis_no_raid');
                setCustomOverridesB({});
              }}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg border border-zinc-700 shadow transition active:scale-95 whitespace-nowrap"
            >
              Comparar com BiS sem Raide
            </button>
          </div>
        </div>
      )}

      {/* KPI Comparison Cards (Projected DPS, Average ilvl, Haste Sweet Spot, Tier Set) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Projected DPS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase">
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Dano Projetado (DPS)</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${dpsDelta > 0
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                : dpsDelta < 0
                  ? 'bg-red-950 text-red-400 border border-red-800/80'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
              {dpsDelta > 0 ? `+${dpsDelta.toLocaleString('pt-BR')}` : dpsDelta.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-[10px] text-zinc-500">Setup A</div>
              <div className="text-sm font-bold text-zinc-300">{(metricsA.projectedDps / 1000000).toFixed(3)}M</div>
            </div>

            <div className="text-center px-2">
              <span className={`text-xs font-black flex items-center justify-center ${dpsDelta > 0 ? 'text-emerald-400' : dpsDelta < 0 ? 'text-red-400' : 'text-zinc-500'
                }`}>
                {dpsDelta > 0 && <TrendingUp className="w-4 h-4 mr-0.5" />}
                {dpsDelta < 0 && <TrendingDown className="w-4 h-4 mr-0.5" />}
                {dpsDelta > 0 ? `+${dpsDeltaPct.toFixed(1)}%` : `${dpsDeltaPct.toFixed(1)}%`}
              </span>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-purple-400 font-semibold">Setup B</div>
              <div className="text-lg font-black text-white">{(metricsB.projectedDps / 1000000).toFixed(3)}M</div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-2">
            {dpsDelta > 0
              ? `Ganho líquido de +${dpsDeltaPct.toFixed(1)}% de dano simulado.`
              : dpsDelta < 0
                ? `Redução de ${Math.abs(dpsDeltaPct).toFixed(1)}% no potencial ofensivo.`
                : 'Dano idêntico entre os conjuntos selecionados.'}
          </p>
        </div>

        {/* Card 2: Average ilvl */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase">
            <span className="flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Nível Médio (ilvl)</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${ilvlDelta > 0
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                : ilvlDelta < 0
                  ? 'bg-red-950 text-red-400 border border-red-800/80'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
              {ilvlDelta > 0 ? `+${ilvlDelta.toFixed(1)}` : ilvlDelta.toFixed(1)}
            </span>
          </div>

          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-[10px] text-zinc-500">Setup A</div>
              <div className="text-sm font-bold text-zinc-300">{metricsA.avgIlvl.toFixed(1)}</div>
            </div>

            <div className="text-center px-2">
              <span className={`text-xs font-bold ${ilvlDelta > 0 ? 'text-emerald-400' : ilvlDelta < 0 ? 'text-red-400' : 'text-zinc-500'
                }`}>
                Δ {ilvlDelta > 0 ? `+${ilvlDelta.toFixed(1)}` : ilvlDelta.toFixed(1)}
              </span>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-purple-400 font-semibold">Setup B</div>
              <div className="text-lg font-black text-amber-300">{metricsB.avgIlvl.toFixed(1)}</div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-2">
            {metricsB.avgIlvl >= 334 ? 'Teto Mítico 6/6 (334) atingido' : 'Faixa de progressão Herói/Mítico'}
          </p>
        </div>

        {/* Card 3: Haste & Sweet Spot Breakpoint */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase">
            <span>Aceleração (Haste %)</span>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">Ponto Doce: 28%</span>
          </div>

          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-[10px] text-zinc-500">Setup A</div>
              <div className="text-sm font-bold text-zinc-300">{metricsA.estimatedHastePct.toFixed(1)}%</div>
            </div>

            <div className="text-center px-2">
              <span className={`text-xs font-bold ${hasteDelta > 0 ? 'text-cyan-400' : hasteDelta < 0 ? 'text-red-400' : 'text-zinc-500'
                }`}>
                {hasteDelta > 0 ? `+${hasteDelta.toFixed(1)}%` : `${hasteDelta.toFixed(1)}%`}
              </span>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-purple-400 font-semibold">Setup B</div>
              <div className="text-lg font-black text-cyan-300">{metricsB.estimatedHastePct.toFixed(1)}%</div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-2">
            {metricsB.estimatedHastePct >= 28
              ? '✅ Aceleração atinge o ponto ideal do Top 50'
              : '⚡ Falta aceleração para o ritmo ótimo de ticks'}
          </p>
        </div>

        {/* Card 4: Tier Synergy & Embellishments */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase">
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Sinergias & Bônus</span>
            </span>
            <span className="text-[10px] text-purple-300 font-mono">Tier 2066</span>
          </div>

          <div className="my-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Bônus de Tier:</span>
              <div className="flex items-center space-x-1.5 font-bold">
                <span className="text-zinc-400">{metricsA.tierCount}pc</span>
                <span className="text-zinc-600">→</span>
                <span className={metricsB.tierCount >= 4 ? 'text-emerald-400' : metricsB.tierCount >= 2 ? 'text-amber-400' : 'text-zinc-500'}>
                  {metricsB.tierCount}pc {metricsB.tierCount >= 4 ? '(Ativo)' : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Embelezamentos:</span>
              <div className="flex items-center space-x-1.5 font-bold">
                <span className="text-zinc-400">{metricsA.embellishmentsCount}/2</span>
                <span className="text-zinc-600">→</span>
                <span className={metricsB.embellishmentsCount <= 2 ? 'text-purple-300' : 'text-red-400'}>
                  {metricsB.embellishmentsCount}/2
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-2">
            {metricsB.onUseTrinketCount > 1 ? '⚠️ Conflito R4: 2 berloques on-use' : 'Conforme às 5 regras de teto Season 2'}
          </p>
        </div>
      </div>

      {/* Secondary Stats & Ratings Delta Matrix */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <span>Balanço e Pesos de Atributos Secundários</span>
          <span className="text-xs font-normal text-zinc-400">({specProfile.namePt})</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {/* Intelecto */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="text-zinc-400 font-semibold mb-1">Intelecto (Primary)</div>
            <div className="flex items-baseline justify-between">
              <span className="text-zinc-500">{metricsA.totalInt}</span>
              <span className="font-mono text-white font-bold">{metricsB.totalInt}</span>
            </div>
            <div className={`mt-1 text-[11px] font-bold ${intDelta > 0 ? 'text-emerald-400' : intDelta < 0 ? 'text-red-400' : 'text-zinc-500'}`}>
              Δ {intDelta > 0 ? `+${intDelta}` : intDelta}
            </div>
          </div>

          {/* Acerto Crítico */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="text-orange-400 font-semibold mb-1">Crítico (Crit)</div>
            <div className="flex items-baseline justify-between">
              <span className="text-zinc-500">{metricsA.estimatedCritPct.toFixed(1)}%</span>
              <span className="font-mono text-white font-bold">{metricsB.estimatedCritPct.toFixed(1)}%</span>
            </div>
            <div className={`mt-1 text-[11px] font-bold ${critDelta > 0 ? 'text-emerald-400' : critDelta < 0 ? 'text-red-400' : 'text-zinc-500'}`}>
              Δ {critDelta > 0 ? `+${critDelta.toFixed(1)}%` : `${critDelta.toFixed(1)}%`}
            </div>
          </div>

          {/* Aceleração */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="text-cyan-400 font-semibold mb-1">Aceleração (Haste)</div>
            <div className="flex items-baseline justify-between">
              <span className="text-zinc-500">{metricsA.estimatedHastePct.toFixed(1)}%</span>
              <span className="font-mono text-white font-bold">{metricsB.estimatedHastePct.toFixed(1)}%</span>
            </div>
            <div className={`mt-1 text-[11px] font-bold ${hasteDelta > 0 ? 'text-emerald-400' : hasteDelta < 0 ? 'text-red-400' : 'text-zinc-500'}`}>
              Δ {hasteDelta > 0 ? `+${hasteDelta.toFixed(1)}%` : `${hasteDelta.toFixed(1)}%`}
            </div>
          </div>

          {/* Maestria */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="text-purple-400 font-semibold mb-1">Maestria (Mastery)</div>
            <div className="flex items-baseline justify-between">
              <span className="text-zinc-500">{metricsA.estimatedMasteryPct.toFixed(1)}%</span>
              <span className="font-mono text-white font-bold">{metricsB.estimatedMasteryPct.toFixed(1)}%</span>
            </div>
            <div className={`mt-1 text-[11px] font-bold ${masteryDelta > 0 ? 'text-emerald-400' : masteryDelta < 0 ? 'text-red-400' : 'text-zinc-500'}`}>
              Δ {masteryDelta > 0 ? `+${masteryDelta.toFixed(1)}%` : `${masteryDelta.toFixed(1)}%`}
            </div>
          </div>

          {/* Versatilidade */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="text-emerald-400 font-semibold mb-1">Versatilidade (Vers)</div>
            <div className="flex items-baseline justify-between">
              <span className="text-zinc-500">{metricsA.estimatedVersPct.toFixed(1)}%</span>
              <span className="font-mono text-white font-bold">{metricsB.estimatedVersPct.toFixed(1)}%</span>
            </div>
            <div className={`mt-1 text-[11px] font-bold ${versDelta > 0 ? 'text-emerald-400' : versDelta < 0 ? 'text-red-400' : 'text-zinc-500'}`}>
              Δ {versDelta > 0 ? `+${versDelta.toFixed(1)}%` : `${versDelta.toFixed(1)}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Slot-by-Slot Equipment Matrix (16 slots side-by-side with Interactive Swapper in Setup B) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
              Tabela de Comparação Peça por Peça (16 Slots)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Passe o cursor sobre os ícones para ver os tooltips oficiais. No Setup B, você pode trocar itens individuais para simular substituições pontuais.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs text-zinc-400">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Upgrade (+ilvl)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
              <span>Sidegrade</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 inline-block" />
              <span>Idêntico</span>
            </span>
          </div>
        </div>

        <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
          {slotComparisons.map((row) => {
            const { slot, label, itemA, itemB, ilvlA, ilvlB, status, ilvlDiff, isOverridden } = row;
            const availableSlotItems = getItemsBySlot(slot);

            return (
              <div
                key={slot}
                className="grid grid-cols-1 lg:grid-cols-12 p-3 items-center hover:bg-zinc-900/60 transition gap-2"
              >
                {/* Slot Label */}
                <div className="lg:col-span-2 text-xs font-bold text-zinc-400">
                  {label}
                </div>

                {/* Setup A Item */}
                <div className="lg:col-span-4 flex items-center space-x-2.5 min-w-0">
                  {itemA ? (
                    <div
                      className="flex items-center space-x-2.5 min-w-0 cursor-pointer group"
                      onMouseEnter={(e) => {
                        showTooltip(itemA.id, e, {
                          slot: label,
                          itemPt: itemA.namePt,
                          itemEn: itemA.nameEn,
                          ilvl: itemA.ilvl,
                          icon: itemA.icon
                        });
                      }}
                      onMouseMove={updateTooltipPosition}
                      onMouseLeave={hideTooltip}
                      onClick={() => {
                        pinTooltip(itemA.id, {
                          slot: label,
                          itemPt: itemA.namePt,
                          itemEn: itemA.nameEn,
                          ilvl: itemA.ilvl,
                          icon: itemA.icon
                        });
                      }}
                    >
                      <img
                        src={getItemIconUrl(itemA)}
                        alt={itemA.namePt}
                        className={`w-8 h-8 rounded border ${getItemQualityBorder(itemA)} flex-shrink-0 group-hover:scale-105 transition shadow`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-zinc-200 truncate group-hover:text-cyan-300 transition">
                          {itemA.namePt}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono truncate">
                          ilvl {ilvlA} · {itemA.source.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-600 italic">Vazio</span>
                  )}
                </div>

                {/* Status / Delta Indicator */}
                <div className="lg:col-span-2 text-center py-1">
                  {status === 'identical' && (
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 text-[10px] font-mono border border-zinc-800">
                      = Idêntico
                    </span>
                  )}
                  {status === 'upgrade' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-800/80 flex items-center justify-center space-x-1">
                      <span>▲</span>
                      <span>+{ilvlDiff} ilvl</span>
                    </span>
                  )}
                  {status === 'downgrade' && (
                    <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-400 text-[10px] font-mono font-bold border border-red-800/80 flex items-center justify-center space-x-1">
                      <span>▼</span>
                      <span>{ilvlDiff} ilvl</span>
                    </span>
                  )}
                  {status === 'sidegrade' && (
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 text-[10px] font-mono font-bold border border-cyan-800/80">
                      ↔ Troca Secundários
                    </span>
                  )}
                </div>

                {/* Setup B Item with Interactive Swapper */}
                <div className="lg:col-span-4 flex items-center space-x-2.5 min-w-0">
                  {itemB ? (
                    <div
                      className="flex items-center space-x-2.5 min-w-0 cursor-pointer group flex-1"
                      onMouseEnter={(e) => {
                        showTooltip(itemB.id, e, {
                          slot: label,
                          itemPt: itemB.namePt,
                          itemEn: itemB.nameEn,
                          ilvl: itemB.ilvl,
                          icon: itemB.icon
                        });
                      }}
                      onMouseMove={updateTooltipPosition}
                      onMouseLeave={hideTooltip}
                      onClick={() => {
                        pinTooltip(itemB.id, {
                          slot: label,
                          itemPt: itemB.namePt,
                          itemEn: itemB.nameEn,
                          ilvl: itemB.ilvl,
                          icon: itemB.icon
                        });
                      }}
                    >
                      <img
                        src={getItemIconUrl(itemB)}
                        alt={itemB.namePt}
                        className={`w-8 h-8 rounded border ${getItemQualityBorder(itemB)} flex-shrink-0 group-hover:scale-105 transition shadow`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-semibold text-purple-200 truncate group-hover:text-purple-300 transition">
                            {itemB.namePt}
                          </span>
                          {isOverridden && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 text-[9px] font-bold border border-amber-800 flex-shrink-0">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono truncate">
                          ilvl {ilvlB} · {itemB.source.toUpperCase()}
                          {TIER_ITEM_IDS.has(itemB.id) ? ' · [Tier 4pc]' : ''}
                          {EMBELLISHED_ITEM_IDS.has(itemB.id) ? ' · [Embelezado]' : ''}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-600 italic flex-1">Vazio</span>
                  )}

                  {/* Slot Item Swapper Select */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <select
                      value={itemB?.id || ''}
                      onChange={(e) => {
                        const newId = parseInt(e.target.value, 10);
                        if (newId) handleSlotOverride(slot, newId);
                      }}
                      className="bg-zinc-900 border border-zinc-700/80 text-[11px] text-zinc-300 rounded px-1.5 py-1 focus:outline-none focus:border-purple-500 max-w-[130px]"
                      title="Substituir este slot no Setup B"
                    >
                      <option value="" disabled>Trocar peça...</option>
                      {availableSlotItems.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          [{opt.ilvl}] {opt.namePt}
                        </option>
                      ))}
                    </select>

                    {isOverridden && (
                      <button
                        onClick={() => handleClearSlotOverride(slot)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                        title="Restaurar item padrão do preset"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
