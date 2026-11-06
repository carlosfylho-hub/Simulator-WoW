import React, { useState } from 'react';
import { Database, Search, Filter, Sparkles, Shield, ArrowUpRight } from 'lucide-react';
import { WOW_ITEMS, getItemIconUrl, getItemQualityBorder } from '../data/items';
import { WowItem, ItemSource } from '../types/wow';
import { useItemTooltip } from '../context/TooltipContext';

interface Props {
  onSelectItemForAudit?: (item: WowItem) => void;
}

export const DatabaseExplorerTab: React.FC<Props> = ({ onSelectItemForAudit }) => {
  const { showTooltip, updateTooltipPosition, hideTooltip, pinTooltip } = useItemTooltip();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [slotFilter, setSlotFilter] = useState<string>('all');

  const filteredItems = WOW_ITEMS.filter(item => {
    const matchesSearch =
      item.namePt.toLowerCase().includes(search.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toString().includes(search);

    const matchesSource = sourceFilter === 'all' || item.source === sourceFilter;
    const matchesSlot =
      slotFilter === 'all' ||
      item.slot === slotFilter ||
      (slotFilter === 'finger' && item.slot.startsWith('finger')) ||
      (slotFilter === 'trinket' && item.slot.startsWith('trinket'));

    return matchesSearch && matchesSource && matchesSlot;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold text-indigo-400">Banco de Dados Auditado</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Patch 12.1.5 S2</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Catálogo de Equipamentos e Fontes de Drop</h2>
            <p className="text-xs text-zinc-400">
              Todos os itens catalogados com nomes oficiais PT-BR, identificador em inglês, atributos fixos e limites de forja.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar item, ID ou nome EN..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-1.5 mr-2 text-zinc-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Fonte:</span>
          </div>
          {[
            { id: 'all', label: 'Todas as Fontes' },
            { id: 'delve', label: 'Imersões (Wah\'du)' },
            { id: 'mplus', label: 'M+ Masmorras' },
            { id: 'craft', label: 'Crafting (331)' },
            { id: 'catalyst', label: 'Catalyst (Tier 4pc)' },
            { id: 'raid', label: 'Raide (Cantrips)' }
          ].map(src => (
            <button
              key={src.id}
              onClick={() => setSourceFilter(src.id)}
              className={`px-2.5 py-1 rounded-lg transition ${
                sourceFilter === src.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col justify-between hover:border-purple-600/70 transition cursor-pointer group"
            onMouseEnter={(e) => {
              showTooltip(item.id, e, {
                slot: item.slot,
                itemPt: item.namePt,
                itemEn: item.nameEn,
                ilvl: item.ilvl,
                sourceLocation: item.sourceDetail,
                stats: item.stats,
                effect: item.effect,
                embellished: item.embellished
              });
            }}
            onMouseMove={updateTooltipPosition}
            onMouseLeave={hideTooltip}
            onClick={() => {
              pinTooltip(item.id, {
                slot: item.slot,
                itemPt: item.namePt,
                itemEn: item.nameEn,
                ilvl: item.ilvl,
                sourceLocation: item.sourceDetail,
                stats: item.stats,
                effect: item.effect,
                embellished: item.embellished
              });
            }}
          >
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span className="font-semibold text-zinc-300 uppercase">{item.slot}</span>
                <div className="flex items-center space-x-1">
                  <span className="px-1.5 py-0.2 rounded bg-zinc-800 font-mono text-purple-300 text-[10px]">
                    ilvl {item.ilvl}
                  </span>
                  {item.normalizedIlvl && item.normalizedIlvl !== item.ilvl && (
                    <span className="text-[10px] text-zinc-500">
                      (Norm: {item.normalizedIlvl})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3 mt-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={getItemIconUrl(item)}
                    alt={item.namePt}
                    className={`w-11 h-11 rounded-lg border-2 bg-zinc-950 object-cover ${getItemQualityBorder(item)} group-hover:scale-105 transition`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-black/90 px-1 rounded text-purple-300 border border-purple-800/80">
                    {item.ilvl}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-zinc-100 truncate group-hover:text-purple-300 transition">{item.namePt}</h3>
                  <p className="text-[11px] italic text-zinc-400 truncate">{item.nameEn} [{item.id}]</p>
                  <p className="text-[11px] text-indigo-400/90 mt-0.5 truncate">Origem: {item.sourceDetail}</p>
                </div>
              </div>

              {/* Stats badges */}
              <div className="mt-2.5 flex flex-wrap gap-1 text-[10px]">
                {item.stats && Object.entries(item.stats).map(([k, v]) => (
                  <span key={k} className="px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-850">
                    {k === 'intellect' ? 'Int' : k === 'stamina' ? 'Vig' : k === 'haste' ? 'Ace' : k === 'crit' ? 'Crí' : k === 'mastery' ? 'Mae' : 'Ver'}: {v}
                  </span>
                ))}
              </div>

              {item.effect && (
                <div className="mt-2.5 p-2 bg-zinc-950 border border-zinc-800 rounded text-[11px] text-amber-300/90 leading-tight">
                  {item.effect}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] text-zinc-500 font-mono">ID: {item.id}</span>
              {onSelectItemForAudit && (
                <button
                  onClick={() => onSelectItemForAudit(item)}
                  className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <span>Auditar Troca</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
