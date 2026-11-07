import React, { useState } from 'react';
import { Sparkles, Clipboard, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, Wand2, Share2, ArrowLeftRight, Layers } from 'lucide-react';
import { ParsedSimcProfile, WowItem, ItemSlot, ActiveSpec, ParsedSimcItem, CombatScenario } from '../types/wow';
import { parseSimcString, SAMPLE_SIMC_STRING } from '../engine/simcParser';
import { getItemById, WOW_ITEMS, getItemIconUrl, getItemQualityBorder } from '../data/items';
import { evaluateSubstitution } from '../engine/substitutionAuditor';
import { buildBaseProfile, buildCandidateProfile } from '../engine/simcCompare';
import { SubstitutionAuditorModal } from './SubstitutionAuditorModal';
import { SimulatedBurstWindow } from './SimulatedBurstWindow';
import { useItemTooltip } from '../context/TooltipContext';
import { SimcPerformanceSummaryCard } from './SimcPerformanceSummaryCard';
import { SimcExportModal } from './SimcExportModal';
import { SimcSideBySideComparison } from './SimcSideBySideComparison';

interface Props {
  scenario: CombatScenario;
  setScenario?: (scen: CombatScenario) => void;
  currentSpec?: ActiveSpec;
}

const ORDERED_SLOTS: { slot: ItemSlot; label: string }[] = [
  { slot: 'head', label: 'Cabeça' },
  { slot: 'neck', label: 'Pescoço' },
  { slot: 'shoulders', label: 'Ombros' },
  { slot: 'back', label: 'Costas' },
  { slot: 'chest', label: 'Torso' },
  { slot: 'wrists', label: 'Pulsos' },
  { slot: 'hands', label: 'Mãos' },
  { slot: 'waist', label: 'Cintura' },
  { slot: 'legs', label: 'Pernas' },
  { slot: 'feet', label: 'Pés' },
  { slot: 'finger1', label: 'Anel 1' },
  { slot: 'finger2', label: 'Anel 2' },
  { slot: 'trinket1', label: 'Berloque 1' },
  { slot: 'trinket2', label: 'Berloque 2' },
  { slot: 'main_hand', label: 'Arma 1M/2M' },
  { slot: 'off_hand', label: 'Mão Secundária' }
];

export const SimcInspectorTab: React.FC<Props> = ({ scenario, currentSpec }) => {
  const [simcInput, setSimcInput] = useState<string>(SAMPLE_SIMC_STRING);
  const [profile, setProfile] = useState<ParsedSimcProfile>(() => parseSimcString(SAMPLE_SIMC_STRING));
  const [activeAudit, setActiveAudit] = useState<any | null>(null);
  const [activeSim, setActiveSim] = useState<{
    base: string;
    candidate: string;
    scenario: string;
    candidateLabel: string;
  } | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number>(272238); // Cingidouro do Pisa-piras
  const [selectedAuditSlot, setSelectedAuditSlot] = useState<ItemSlot>('wrists');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [inspectorViewMode, setInspectorViewMode] = useState<'side_by_side' | 'paperdoll'>('side_by_side');

  const { showTooltip, updateTooltipPosition, hideTooltip, pinTooltip } = useItemTooltip();

  const handleApplySetupB = (newEquipped: Partial<Record<ItemSlot, ParsedSimcItem>>) => {
    setProfile(prev => ({
      ...prev,
      equipped: newEquipped,
      equippedCount: Object.keys(newEquipped).length
    }));
  };

  const handleParse = () => {
    const res = parseSimcString(simcInput);
    setProfile(res);
  };

  const handleLoadSample = () => {
    setSimcInput(SAMPLE_SIMC_STRING);
    setProfile(parseSimcString(SAMPLE_SIMC_STRING));
  };

  const triggerAudit = (slot: ItemSlot, candidateItem?: WowItem) => {
    const equippedParsed = profile.equipped[slot];
    const equippedItem = equippedParsed ? getItemById(equippedParsed.id) ?? {
      id: equippedParsed.id,
      namePt: `Item ID ${equippedParsed.id}`,
      nameEn: `Item ${equippedParsed.id}`,
      slot: slot,
      ilvl: 321,
      source: 'delve' as const,
      sourceDetail: 'Importado via SimC'
    } : null;

    const cand = candidateItem ?? getItemById(selectedCandidateId) ?? WOW_ITEMS[0];

    // Compute active tier pieces and embellishments count
    let tierCount = 0;
    let embellishmentsCount = 0;
    Object.values(profile.equipped).forEach(eq => {
      const it = getItemById(eq.id);
      if (it?.isTier) tierCount++;
      if (it?.embellished) embellishmentsCount++;
    });

    const otherTrinketParsed = slot === 'trinket1' ? profile.equipped['trinket2'] : profile.equipped['trinket1'];
    const otherTrinketItem = otherTrinketParsed ? getItemById(otherTrinketParsed.id) : null;

    const auditRes = evaluateSubstitution(equippedItem, cand, {
      targetScenario: scenario,
      activeTierPiecesCount: tierCount || 4,
      equippedEmbellishmentsCount: embellishmentsCount || 2,
      otherEquippedTrinket: otherTrinketItem,
      hasSecondHandOccupied: !!profile.equipped['off_hand']
    });

    setActiveAudit(auditRes);

    try {
      const spec: ActiveSpec = currentSpec || 'demonology';
      const baseProfile = buildBaseProfile(profile, spec);
      const candidateProfile = buildCandidateProfile(profile, spec, slot, cand);
      setActiveSim({
        base: baseProfile,
        candidate: candidateProfile,
        scenario,
        candidateLabel: cand.namePt,
      });
    } catch {
      setActiveSim(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Performance & Gear Metrics Summary Card */}
      <SimcPerformanceSummaryCard profile={profile} scenario={scenario} activeSpec={currentSpec} />

      {/* Overview & Ceilings (collapsed by default to reduce clutter) */}
      <details className="group bg-zinc-900 border border-zinc-800 rounded-xl">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm text-zinc-300 hover:text-white flex items-center justify-between">
          <span>Limites da temporada (5 tetos)</span>
          <span className="text-xs text-zinc-500">{'ver detalhes'}</span>
        </summary>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 pb-4">
          <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
            <div className="text-[10px] font-bold uppercase text-zinc-500">Teto de Craft</div>
            <div className="text-base font-bold text-zinc-100">ilvl 331</div>
            <p className="text-[11px] text-zinc-500">Centelha de Marés + 80 Cristas Míticas</p>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
            <div className="text-[10px] font-bold uppercase text-zinc-500">Embelezamentos</div>
            <div className="text-base font-bold text-zinc-100">Máx. 2 efeitos</div>
            <p className="text-[11px] text-zinc-500">Limite de efeitos ativos, não de peças</p>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
            <div className="text-[10px] font-bold uppercase text-zinc-500">Gema Prismática</div>
            <div className="text-base font-bold text-zinc-100">1 diamante</div>
            <p className="text-[11px] text-zinc-500">Canto Eterno Poderoso ou Estoico</p>
          </div>
          <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
            <div className="text-[10px] font-bold uppercase text-zinc-500">Berloques (R4)</div>
            <div className="text-base font-bold text-zinc-100">1 ativo + 1 passivo</div>
            <p className="text-[11px] text-zinc-500">Proibido 2 on-use (dividem recarga)</p>
          </div>
        </div>
      </details>

      {/* SimC Input Drawer / Box */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-zinc-800 gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Clipboard className="w-4 h-4 text-amber-400" />
              <span>Importador de SimulationCraft (`/simc`)</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Cole a string gerada pelo comando <code className="bg-zinc-800 px-1 py-0.5 rounded text-amber-300">/simc</code> no jogo para auditar os portões G0–G8.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
              title="Exportar perfil formatado para o SimulationCraft / Raidbots"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Exportar SimC</span>
            </button>

            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition"
            >
              Carregar Exemplo (Demo Lock)
            </button>
            <button
              onClick={handleParse}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Processar Import</span>
            </button>
          </div>
        </div>

        <textarea
          value={simcInput}
          onChange={(e) => setSimcInput(e.target.value)}
          rows={4}
          className="w-full mt-3 p-3 bg-zinc-950 font-mono text-xs text-zinc-300 rounded-xl border border-zinc-800 focus:outline-none focus:border-purple-500"
          placeholder="Cole seu export do SimC aqui..."
        />

        {/* Parsed Summary Bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-300 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
          <span className="font-semibold text-white">{profile.characterName}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-purple-300">{profile.spec} {profile.characterClass}</span>
          <span className="text-zinc-600">·</span>
          <span>Nível {profile.level}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400">Profissões: {profile.professions.join(', ') || 'Nenhuma'}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-emerald-400 font-semibold">{profile.equippedCount} slots equipados</span>
          {profile.checksum && (
            <>
              <span className="text-zinc-600">·</span>
              <span className="text-[11px] text-zinc-500 font-mono">Checksum: {profile.checksum}</span>
            </>
          )}
        </div>
      </div>

      {/* View Mode Switcher: Comparador Lado a Lado vs Inspetor de Slots */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-2xl gap-2 shadow-md">
        <div className="flex items-center space-x-1.5 w-full sm:w-auto">
          <button
            onClick={() => setInspectorViewMode('side_by_side')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition flex-1 sm:flex-initial justify-center ${inspectorViewMode === 'side_by_side'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-300" />
            <span>Comparador Lado a Lado (Setup A × B)</span>
          </button>

          <button
            onClick={() => setInspectorViewMode('paperdoll')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition flex-1 sm:flex-initial justify-center ${inspectorViewMode === 'paperdoll'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
              }`}
          >
            <Layers className="w-4 h-4 text-cyan-300" />
            <span>Visão de Slots & Auditoria G0–G8</span>
          </button>
        </div>

        <div className="text-[11px] text-zinc-400 px-3 hidden md:flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span>
            {inspectorViewMode === 'side_by_side'
              ? 'Comparando configurações com simulação de DPS e pesos de atributos'
              : 'Auditoria de portões G0–G8 e janela de burst'}
          </span>
        </div>
      </div>

      {inspectorViewMode === 'side_by_side' ? (
        <SimcSideBySideComparison
          profile={profile}
          scenario={scenario}
          activeSpec={currentSpec}
          candidateItemId={selectedCandidateId}
          candidateSlot={selectedAuditSlot}
          onApplySetupBAsActive={handleApplySetupB}
        />
      ) : (
        <>
          {/* Quick Candidate Auditor Bar */}
          <div className="bg-purple-950/30 border border-purple-800/40 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-900/60 rounded-xl text-purple-300">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-purple-100">Testar Substituição Rápida de Peça</h3>
                <p className="text-xs text-zinc-400">Escolha um item do catálogo e compare instantaneamente contra o seu slot equipado.</p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 w-full md:w-auto">
              {(() => {
                const cand = getItemById(selectedCandidateId);
                return (
                  <img
                    src={getItemIconUrl(cand)}
                    alt={cand?.namePt ?? 'Item'}
                    className={`w-9 h-9 rounded border ${getItemQualityBorder(cand)} flex-shrink-0 shadow cursor-pointer hover:scale-105 transition`}
                    onMouseEnter={(e) => {
                      if (cand) showTooltip(cand.id, e, { slot: cand.slot, itemPt: cand.namePt, itemEn: cand.nameEn, ilvl: cand.ilvl });
                    }}
                    onMouseMove={updateTooltipPosition}
                    onMouseLeave={hideTooltip}
                    onClick={() => {
                      if (cand) pinTooltip(cand.id, { slot: cand.slot, itemPt: cand.namePt, itemEn: cand.nameEn, ilvl: cand.ilvl });
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                    }}
                  />
                );
              })()}
              <select
                value={selectedCandidateId}
                onChange={(e) => {
                  const id = parseInt(e.target.value, 10);
                  setSelectedCandidateId(id);
                  const it = getItemById(id);
                  if (it) setSelectedAuditSlot(it.slot);
                }}
                className="bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 rounded-lg px-3 py-2 flex-1 md:w-80 focus:outline-none"
              >
                {WOW_ITEMS.map((item) => (
                  <option key={item.id} value={item.id}>
                    [{item.ilvl}] {item.namePt} ({item.slot.toUpperCase()})
                  </option>
                ))}
              </select>

              <button
                onClick={() => triggerAudit(selectedAuditSlot)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow transition active:scale-95 whitespace-nowrap"
              >
                Auditar (G0-G8)
              </button>

              <button
                onClick={() => setInspectorViewMode('side_by_side')}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg shadow transition active:scale-95 whitespace-nowrap hidden sm:block"
                title="Abrir este item no comparador lado a lado"
              >
                Ver Lado a Lado
              </button>
            </div>
          </div>

          {/* Simulated Burst Window Component */}
          <SimulatedBurstWindow
            equippedItems={Object.values(profile.equipped).map(eq => getItemById(eq.id) ?? {
              id: eq.id,
              namePt: `Item ID ${eq.id}`,
              nameEn: `Item ${eq.id}`,
              slot: eq.slot,
              ilvl: 321,
              source: 'delve' as const,
              sourceDetail: 'Importado via SimC'
            })}
            scenario={scenario}
          />

          {/* Equipped Gear Paperdoll Layout */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                Equipamentos Detectados no Export
              </h3>
              <span className="text-xs text-zinc-500">Clique em qualquer slot para auditar ou substituir</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {ORDERED_SLOTS.map(({ slot, label }) => {
                const eq = profile.equipped[slot];
                const itemCatalog = eq ? getItemById(eq.id) : null;

                return (
                  <div
                    key={slot}
                    onClick={() => {
                      if (itemCatalog) {
                        setSelectedAuditSlot(slot);
                        triggerAudit(slot, itemCatalog);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${eq
                      ? 'bg-zinc-900/90 border-zinc-800 hover:border-purple-600 hover:bg-zinc-850'
                      : 'bg-zinc-950/40 border-dashed border-zinc-800/80 text-zinc-600'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
                        <span className="font-semibold text-zinc-300">{label}</span>
                        {eq && (
                          <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] font-mono text-amber-300">
                            ilvl {itemCatalog?.ilvl ?? eq.ilvl ?? 321}
                          </span>
                        )}
                      </div>

                      {eq ? (
                        <div
                          className="flex items-start space-x-2.5 cursor-pointer group"
                          onMouseEnter={(e) => {
                            showTooltip(eq.id, e, {
                              slot: label,
                              itemPt: itemCatalog?.namePt ?? eq.name,
                              itemEn: itemCatalog?.nameEn ?? eq.name,
                              ilvl: itemCatalog?.ilvl ?? eq.ilvl,
                              icon: itemCatalog?.icon
                            });
                          }}
                          onMouseMove={updateTooltipPosition}
                          onMouseLeave={hideTooltip}
                          onClick={() => {
                            pinTooltip(eq.id, {
                              slot: label,
                              itemPt: itemCatalog?.namePt ?? eq.name,
                              itemEn: itemCatalog?.nameEn ?? eq.name,
                              ilvl: itemCatalog?.ilvl ?? eq.ilvl,
                              icon: itemCatalog?.icon
                            });
                          }}
                        >
                          {/* Authentic Wowhead / Raidbots-like Item Icon */}
                          <img
                            src={getItemIconUrl(itemCatalog)}
                            alt={itemCatalog?.namePt ?? eq.name ?? 'Item'}
                            className={`w-9 h-9 rounded border ${getItemQualityBorder(itemCatalog)} flex-shrink-0 shadow group-hover:scale-105 transition`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-zinc-100 truncate">
                              {itemCatalog?.namePt ?? eq.name ?? `Item ID ${eq.id}`}
                            </h4>
                            <p className="text-[10px] italic text-zinc-500 truncate">
                              {itemCatalog?.nameEn ?? `ID: ${eq.id}`}
                            </p>

                            {/* Enchant & Gem indicators */}
                            <div className="mt-1.5 space-y-0.5 text-[10px]">
                              {eq.enchantName ? (
                                <div className="text-purple-400 truncate flex items-center space-x-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                                  <span>{eq.enchantName}</span>
                                </div>
                              ) : (
                                ['head', 'shoulders', 'chest', 'feet', 'finger1', 'finger2', 'main_hand'].includes(slot) && (
                                  <div className="text-amber-500/80 flex items-center space-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 inline-block" />
                                    <span>Sem encantamento</span>
                                  </div>
                                )
                              )}

                              {slot === 'legs' && (
                                <div className="text-cyan-400 truncate flex items-center space-x-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                                  <span>Magilinha de Arcanotrama (+41 Int)</span>
                                </div>
                              )}

                              {itemCatalog?.embellished && (
                                <div className="text-amber-300 font-semibold truncate flex items-center space-x-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                                  <span>Embelezado (Forro de Arcanotrama)</span>
                                </div>
                              )}

                              {itemCatalog?.isTier && (
                                <div className="text-emerald-400 font-semibold truncate flex items-center space-x-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                  <span>Peça de Tier (Grilhões 2066)</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2 text-center text-xs text-zinc-600 italic">
                          Slot Vazio / Não Equipado
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* SimC Export Modal */}
      <SimcExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        profile={profile}
        activeSpec={currentSpec}
      />

      {/* Audit Modal */}
      <SubstitutionAuditorModal
        audit={activeAudit}
        sim={activeSim}
        onClose={() => {
          setActiveAudit(null);
          setActiveSim(null);
        }}
      />
    </div>
  );
};
