import React from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, ArrowRight, ShieldAlert, Sparkles, Scale, Coins } from 'lucide-react';
import { SubstitutionAudit, VerdictType } from '../types/wow';
import { getItemIconUrl, getItemQualityBorder } from '../data/items';
import { useItemTooltip } from '../context/TooltipContext';

interface ModalProps {
  audit: SubstitutionAudit | null;
  onClose: () => void;
}

const VERDICT_STYLES: Record<VerdictType, { bg: string; border: string; text: string; icon: any }> = {
  'Vale a troca': {
    bg: 'bg-emerald-950/80',
    border: 'border-emerald-600',
    text: 'text-emerald-300',
    icon: CheckCircle
  },
  'Vale com condição': {
    bg: 'bg-amber-950/80',
    border: 'border-amber-600',
    text: 'text-amber-300',
    icon: AlertTriangle
  },
  'Empate técnico — simular': {
    bg: 'bg-blue-950/80',
    border: 'border-blue-600',
    text: 'text-blue-300',
    icon: Scale
  },
  'Não vale': {
    bg: 'bg-rose-950/80',
    border: 'border-rose-600',
    text: 'text-rose-300',
    icon: XCircle
  },
  'Falta dado': {
    bg: 'bg-zinc-900',
    border: 'border-zinc-600',
    text: 'text-zinc-300',
    icon: AlertTriangle
  }
};

export const SubstitutionAuditorModal: React.FC<ModalProps> = ({ audit, onClose }) => {
  const { showTooltip, updateTooltipPosition, hideTooltip, pinTooltip } = useItemTooltip();
  if (!audit) return null;

  const verdictConfig = VERDICT_STYLES[audit.verdict] || VERDICT_STYLES['Empate técnico — simular'];
  const VerdictIcon = verdictConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 text-zinc-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-400">Protocolo de Substituição G0–G8</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Auditado Wowhead / DB2</span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">Laudo Técnico de Equipamento</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verdict Banner */}
        <div className={`mt-4 p-4 rounded-xl border ${verdictConfig.bg} ${verdictConfig.border} flex items-start space-x-3`}>
          <VerdictIcon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${verdictConfig.text}`} />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Veredito Oficial:</span>
              <span className={`text-base font-extrabold ${verdictConfig.text}`}>{audit.verdict}</span>
            </div>
            <p className="text-sm mt-1 text-zinc-200">{audit.verdictSummary}</p>
          </div>
        </div>

        {/* Comparison Cards (Equipped vs Candidate) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Equipped Item */}
          <div
            className={`p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 ${audit.equippedItem ? 'cursor-pointer hover:border-amber-600/70 group' : ''}`}
            onMouseEnter={(e) => {
              if (audit.equippedItem) {
                showTooltip(audit.equippedItem.id, e, {
                  slot: audit.equippedItem.slot,
                  itemPt: audit.equippedItem.namePt,
                  itemEn: audit.equippedItem.nameEn,
                  ilvl: audit.equippedItem.ilvl,
                  sourceLocation: audit.equippedItem.sourceDetail,
                  effect: audit.equippedItem.effect,
                  stats: audit.equippedItem.stats
                });
              }
            }}
            onMouseMove={updateTooltipPosition}
            onMouseLeave={hideTooltip}
            onClick={() => {
              if (audit.equippedItem) {
                pinTooltip(audit.equippedItem.id, {
                  slot: audit.equippedItem.slot,
                  itemPt: audit.equippedItem.namePt,
                  itemEn: audit.equippedItem.nameEn,
                  ilvl: audit.equippedItem.ilvl,
                  sourceLocation: audit.equippedItem.sourceDetail,
                  effect: audit.equippedItem.effect,
                  stats: audit.equippedItem.stats
                });
              }
            }}
          >
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
              <span className="font-semibold text-zinc-300">PEÇA ATUALMENTE EQUIPADA</span>
              <span className="font-mono uppercase text-zinc-400">{audit.equippedItem?.slot?.toUpperCase() || 'VAZIO'}</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="relative flex-shrink-0">
                <img
                  src={getItemIconUrl(audit.equippedItem)}
                  alt={audit.equippedItem?.namePt || 'Slot'}
                  className={`w-12 h-12 rounded-lg border-2 bg-zinc-950 object-cover ${getItemQualityBorder(audit.equippedItem)} group-hover:scale-105 transition`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-black/90 px-1 rounded text-purple-300 border border-purple-800/80">
                  {audit.equippedItem?.ilvl || 0}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-amber-200 leading-snug truncate group-hover:text-amber-100 transition">
                  {audit.equippedItem ? audit.equippedItem.namePt : 'Slot Vazio'}
                </h3>
                {audit.equippedItem && (
                  <p className="text-xs italic text-zinc-400 truncate">{audit.equippedItem.nameEn} [{audit.equippedItem.id}]</p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 font-semibold text-zinc-300">
                    ilvl {audit.equippedItem?.ilvl || 0}
                  </span>
                  {audit.equippedItem?.normalizedIlvl && (
                    <span className="text-[11px] text-zinc-400">
                      (Norm: {audit.equippedItem.normalizedIlvl})
                    </span>
                  )}
                  <span className="text-zinc-500">·</span>
                  <span className="text-zinc-400 text-[11px]">{audit.equippedItem?.sourceDetail || 'Sem fonte'}</span>
                </div>
              </div>
            </div>
            {audit.equippedItem?.effect && (
              <div className="mt-3 p-2 bg-amber-950/30 border border-amber-800/40 rounded text-xs text-amber-300">
                <strong>Efeito Passivo:</strong> {audit.equippedItem.effect}
              </div>
            )}
          </div>

          {/* Candidate Item */}
          <div
            className="p-4 rounded-xl bg-zinc-950/70 border border-purple-800/50 cursor-pointer hover:border-purple-600/80 group transition"
            onMouseEnter={(e) => {
              showTooltip(audit.candidateItem.id, e, {
                slot: audit.candidateItem.slot,
                itemPt: audit.candidateItem.namePt,
                itemEn: audit.candidateItem.nameEn,
                ilvl: audit.candidateItem.ilvl,
                sourceLocation: audit.candidateItem.sourceDetail,
                effect: audit.candidateItem.effect,
                stats: audit.candidateItem.stats
              });
            }}
            onMouseMove={updateTooltipPosition}
            onMouseLeave={hideTooltip}
            onClick={() => {
              pinTooltip(audit.candidateItem.id, {
                slot: audit.candidateItem.slot,
                itemPt: audit.candidateItem.namePt,
                itemEn: audit.candidateItem.nameEn,
                ilvl: audit.candidateItem.ilvl,
                sourceLocation: audit.candidateItem.sourceDetail,
                effect: audit.candidateItem.effect,
                stats: audit.candidateItem.stats
              });
            }}
          >
            <div className="flex items-center justify-between text-xs text-purple-300 mb-2">
              <span className="font-semibold text-purple-300">ITEM CANDIDATO PARA TROCA</span>
              <span className="font-mono text-purple-400 font-bold">SUBSTITUIÇÃO PROPOSTA</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="relative flex-shrink-0">
                <img
                  src={getItemIconUrl(audit.candidateItem)}
                  alt={audit.candidateItem.namePt}
                  className={`w-12 h-12 rounded-lg border-2 bg-zinc-950 object-cover ${getItemQualityBorder(audit.candidateItem)} group-hover:scale-105 transition`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-black/90 px-1 rounded text-purple-300 border border-purple-800/80">
                  {audit.candidateItem.ilvl}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-purple-200 leading-snug truncate group-hover:text-purple-100 transition">{audit.candidateItem.namePt}</h3>
                <p className="text-xs italic text-zinc-400 truncate">{audit.candidateItem.nameEn} [{audit.candidateItem.id}]</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-semibold border border-purple-700/50">
                    ilvl {audit.candidateItem.ilvl}
                  </span>
                  {audit.candidateItem.normalizedIlvl && (
                    <span className="text-[11px] text-zinc-400">
                      (Norm: {audit.candidateItem.normalizedIlvl})
                    </span>
                  )}
                  <span className="text-zinc-500">·</span>
                  <span className="text-zinc-400 text-[11px]">{audit.candidateItem.sourceDetail}</span>
                </div>
              </div>
            </div>
            {audit.candidateItem.effect && (
              <div className="mt-3 p-2 bg-purple-950/30 border border-purple-800/40 rounded text-xs text-purple-300">
                <strong>Efeito Passivo:</strong> {audit.candidateItem.effect}
              </div>
            )}
          </div>
        </div>

        {/* Stat Delta Pills */}
        <div className="mt-4 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
          <div className="text-xs font-semibold text-zinc-400 mb-2 flex items-center space-x-1.5">
            <Scale className="w-3.5 h-3.5 text-zinc-400" />
            <span>Impacto nos Atributos Secundários:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(audit.statDelta).map(([stat, val]) => (
              <span
                key={stat}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  val > 0
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                    : val < 0
                    ? 'bg-rose-950/60 text-rose-300 border-rose-700/50'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                {stat}: {val > 0 ? `+${val}` : val}
              </span>
            ))}
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
              Nível Base: {audit.ilvlDelta > 0 ? `+${audit.ilvlDelta}` : audit.ilvlDelta} ilvl
            </span>
          </div>
        </div>

        {/* 9 Gates Detailed Checklist */}
        <div className="mt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Verificação dos 9 Portões Sequenciais (G0–G8)
          </h4>
          <div className="space-y-2">
            {audit.gates.map(gate => (
              <div
                key={gate.gate}
                className={`p-3 rounded-lg border flex items-start space-x-3 transition ${
                  gate.passed
                    ? 'bg-zinc-950/40 border-zinc-800'
                    : 'bg-rose-950/30 border-rose-800/60'
                }`}
              >
                {gate.passed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{gate.gate} — {gate.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        gate.passed ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {gate.passed ? 'APROVADO' : 'REPROVADO'}
                    </span>
                  </div>
                  <p className="text-zinc-300 mt-0.5">{gate.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunity Cost & Recommendation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-800 text-xs">
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="flex items-center space-x-1.5 font-bold text-amber-400 mb-1">
              <Coins className="w-4 h-4" />
              <span>Custo de Oportunidade (G8):</span>
            </div>
            {audit.opportunityCost.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                {audit.opportunityCost.map((cost, idx) => (
                  <li key={idx}>{cost}</li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-400">Sem custos adicionais de reagentes ou centelhas.</p>
            )}
          </div>

          <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-800/50">
            <div className="flex items-center space-x-1.5 font-bold text-purple-300 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Ação Estratégica Recomendada:</span>
            </div>
            <p className="text-zinc-200 leading-relaxed">{audit.actionRecommendation}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Fechar Laudo
          </button>
        </div>
      </div>
    </div>
  );
};
