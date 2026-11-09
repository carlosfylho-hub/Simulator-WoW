import React from 'react';
import { FullItemTooltip } from '../services/itemTooltipService';
import { MapPin, Sparkles, Shield, Compass } from 'lucide-react';

interface Props {
  tooltipData: FullItemTooltip | null;
  position: { x: number; y: number } | null;
  pinnedItem?: FullItemTooltip | null;
  onClosePinned?: () => void;
}

export const WowItemTooltip: React.FC<Props> = ({ tooltipData, position, pinnedItem, onClosePinned }) => {
  const item = pinnedItem || tooltipData;
  if (!item) return null;

  // Compute position clamped to viewport boundaries
  let style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 999999,
    pointerEvents: pinnedItem ? 'auto' : 'none',
  };

  if (pinnedItem) {
    // Pinned mobile / click modal
    style = {
      ...style,
      bottom: '16px',
      right: '16px',
      maxWidth: '360px',
      width: 'calc(100vw - 32px)',
    };
  } else if (position) {
    const tooltipWidth = 330;
    const padding = 16;

    let left = position.x + padding;
    let top = position.y + 12;

    if (typeof window !== 'undefined') {
      // Flip to left if overflowing viewport on right
      if (left + tooltipWidth > window.innerWidth - 12) {
        left = Math.max(8, position.x - tooltipWidth - padding);
      }
      // Clamp vertical position so tooltip is never clipped at bottom
      const approxHeight = 360;
      if (top + approxHeight > window.innerHeight - 8) {
        top = Math.max(8, window.innerHeight - approxHeight - 8);
      }
    }

    style = {
      ...style,
      left: `${left}px`,
      top: `${top}px`,
      width: `${tooltipWidth}px`,
    };
  } else {
    // Safe viewport fallback if coordinates were not captured
    style = {
      ...style,
      top: '80px',
      right: '24px',
      width: '330px',
    };
  }

  const qualityColor = item.qualityColor || '#a335ee';

  return (
    <div
      style={style}
      className="bg-[#0b0d13]/98 backdrop-blur-md border border-[#3b4352] ring-1 ring-black/90 rounded-xl p-4 shadow-2xl text-xs transition-opacity duration-100 animate-in fade-in max-h-[90vh] overflow-y-auto"
    >
      {/* Header with Blizzard Icon and Item Title */}
      <div className="flex items-start space-x-3 pb-3 border-b border-[#2b313d]">
        <div className="relative flex-shrink-0">
          <img
            src={item.iconUrl}
            alt={item.namePt}
            className={`w-12 h-12 rounded-lg border-2 ${item.qualityBorder} bg-black object-cover shadow-lg`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
            }}
          />
          {item.embellished && (
            <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-black px-1 rounded-full shadow">
              EMB
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4
              className="font-bold text-sm leading-tight tracking-tight drop-shadow-sm"
              style={{ color: qualityColor }}
            >
              {item.namePt}
            </h4>
            {pinnedItem && (
              <button
                onClick={onClosePinned}
                className="text-zinc-500 hover:text-white text-xs px-1.5 py-0.5 rounded bg-zinc-800 ml-2"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-[11px] text-zinc-400 italic mt-0.5">
            {item.nameEn}
          </div>

          <div className="flex items-center space-x-2 mt-1">
            <span className="text-[#ffd100] font-mono font-bold text-[11px]">
              Nível do Item {item.ilvl}
            </span>
            {item.track && (
              <span className="text-zinc-400 text-[10px] font-mono bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800">
                {item.track}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Slot & Armor Type Row */}
      <div className="flex items-center justify-between text-zinc-300 py-1.5 border-b border-zinc-800/80 text-[11px]">
        <span className="font-medium">{item.slot}</span>
        {item.armorOrWeaponType && (
          <span className="text-zinc-400 font-medium">{item.armorOrWeaponType}</span>
        )}
      </div>

      {/* Primary & Secondary Stats */}
      <div className="py-2 space-y-1 text-[11.5px] border-b border-zinc-800/80">
        {item.primaryStat && (
          <div className="text-white font-medium">
            +{item.primaryStat.value.toLocaleString('pt-BR')} {item.primaryStat.name}
          </div>
        )}
        {item.stamina && (
          <div className="text-white font-medium">
            +{item.stamina.toLocaleString('pt-BR')} Vigor
          </div>
        )}

        {!item.primaryStat && !item.stamina && item.secondaryStats.length === 0 && (
          <div className="text-zinc-400 italic">Atributos não catalogados para este item.</div>
        )}
        {item.secondaryStats.map((st, i) => (
          <div key={i} className="text-[#00ff00] font-medium flex items-center justify-between">
            <span>+{st.value.toLocaleString('pt-BR')} {st.name}</span>
          </div>
        ))}
      </div>

      {/* Embellishment info */}
      {item.embellished && (
        <div className="py-2 border-b border-zinc-800/80 space-y-1 text-[11px]">
          <div className="text-[#ffd100] font-bold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Único-equipado: Embelezado (2)</span>
          </div>
          {(item.embellishmentName || item.embellishmentRecommendation) && (
            <div className="text-purple-300 font-medium">
              Efeito: {item.embellishmentName || item.embellishmentRecommendation}
            </div>
          )}
          {item.embellishmentDescription && (
            <div className="text-zinc-300 leading-snug">
              {item.embellishmentDescription}
            </div>
          )}
        </div>
      )}

      {/* Crafted item without a built-in embellishment */}
      {!item.embellished && item.isCrafted && (
        <div className="py-2 border-b border-zinc-800/80 space-y-1 text-[11px]">
          <div className="text-amber-300 font-bold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Craftado — pode receber embelezamento (máx. 2)</span>
          </div>
          {item.embellishmentRecommendation ? (
            <>
              <div className="text-purple-300 font-medium">
                Recomendado: {item.embellishmentRecommendation}
              </div>
              {item.embellishmentDescription && (
                <div className="text-zinc-300 leading-snug">
                  {item.embellishmentDescription}
                </div>
              )}
            </>
          ) : (
            <div className="text-zinc-400">
              Este craft aceita um reagente de embelezamento opcional; sem ele, não conta para o limite de 2 efeitos.
            </div>
          )}
        </div>
      )}

      {/* On-Use or Equip Effect */}
      {item.effect && (
        <div className="py-2 text-[11px] text-[#00ff00] leading-relaxed border-b border-zinc-800/80">
          {item.effect}
        </div>
      )}

      {/* Source Dungeon / Delve / Raid Box (Raidbots UX) */}
      <div className="mt-2.5 p-2 rounded-lg bg-[#141822] border border-[#2b3548] text-[11px] space-y-1">
        <div className="flex items-center space-x-1 text-indigo-300 font-bold">
          <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span>Fonte / Drop:</span>
        </div>
        <div className="text-zinc-200 font-medium pl-4">
          {item.sourceLocation}
        </div>

        {item.roleTag && (
          <div className="pl-4 pt-0.5">
            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${item.roleTag.includes('BiS')
              ? 'bg-amber-950/90 text-amber-300 border border-amber-700/60'
              : item.roleTag.includes('Catalisador') || item.roleTag.includes('Tier')
                ? 'bg-purple-950/90 text-purple-300 border border-purple-700/60'
                : 'bg-cyan-950/90 text-cyan-300 border border-cyan-700/60'
              }`}>
              {item.roleTag}
            </span>
          </div>
        )}
      </div>

      {/* Raidbots UX Footer Tag */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span>Raidbots UX · Blizzard CDN</span>
        <span className="text-purple-400">Patch 12.1.5</span>
      </div>
    </div>
  );
};
