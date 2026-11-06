import React from 'react';
import { Shield, Swords, Sparkles, AlertCircle, Coins, HeartPulse, Zap, CheckCircle2 } from 'lucide-react';
import { WOW_ITEMS } from '../data/items';
import { DEMONOLOGY_WARLOCK } from '../data/specs';

interface Props {
  scenario: 'delve_rooms' | 'delve_boss' | 'mplus' | 'raid';
  setScenario: (scen: 'delve_rooms' | 'delve_boss' | 'mplus' | 'raid') => void;
}

export const DelveMasteryTab: React.FC<Props> = ({ scenario, setScenario }) => {
  const delveItems = WOW_ITEMS.filter(item => item.source === 'delve');
  const pisaPirasSet = delveItems.filter(item => item.namePt.includes('Pisa-piras') && item.slot !== 'back');
  const wahduWeapons = delveItems.filter(item => item.weaponType);
  const wahduJewelry = delveItems.filter(item => ['neck', 'finger1', 'finger2', 'back'].includes(item.slot));

  return (
    <div className="space-y-6">
      {/* Hero Banner for Kindo'jan Delve */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/90 via-zinc-900 to-amber-950/50 border border-purple-800/40 p-6 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
            <Shield className="w-4 h-4" />
            <span>Guia Mestre de Imersões Solo · Labirinto de Kindo'jan (Tier 11)</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Estratégia Especializada para Bruxo Demonologia
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            As Imersões no Patch 12.1.5 recompensam peças de nível <strong>321 (Mítico 2/6)</strong> através do vendedor <strong>Wah'du</strong> com <em>Fragmentos de Alma Mítica</em>. Por ser conteúdo solo sem curador, o segredo do sucesso no Tier 11 está na alternância estrita entre as <strong>Salas do Labirinto</strong> e o <strong>Chefe Kindo'jan</strong>.
          </p>
        </div>
      </div>

      {/* Dual Tactical Switcher & Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile 1: Salas do Labirinto */}
        <div
          onClick={() => setScenario('delve_rooms')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            scenario === 'delve_rooms'
              ? 'bg-amber-950/30 border-amber-500/70 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/50'
              : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Perfil 1 (Ativo)</span>
                <h3 className="text-base font-bold text-white">Salas do Labirinto (Packs & Trash)</h3>
              </div>
            </div>
            {scenario === 'delve_rooms' && (
              <span className="text-[10px] bg-amber-500 text-zinc-950 font-black px-2 py-0.5 rounded-full uppercase">
                Selecionado
              </span>
            )}
          </div>

          <div className="mt-4 space-y-2 text-xs text-zinc-300">
            <div className="p-2.5 bg-zinc-950/70 rounded-xl border border-zinc-850">
              <span className="font-bold text-amber-300">Runa Indicada: C26</span> (<code>1A-2C-3A-4A-5B</code>)
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Reflexos de Lince (2C) garante <strong>+77,5 de velocidade</strong> ao ser atingido para kiting entre colunas, enquanto Energia Residual (5B) potencializa o dano em área contínuo.
              </p>
            </div>

            <div className="p-2.5 bg-zinc-950/70 rounded-xl border border-zinc-850">
              <span className="font-bold text-amber-300">Demônio Recomendado:</span> Vilguarda (Felguard)
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Uso de Machado Giratório para controle de área e agrupamento. Mantenha <em>Tratar Demônio</em> e utilize Implosão com 6+ diabretes para detonar grupos densos.
              </p>
            </div>
          </div>
        </div>

        {/* Profile 2: Chefe Kindo'jan */}
        <div
          onClick={() => setScenario('delve_boss')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            scenario === 'delve_boss'
              ? 'bg-purple-950/30 border-purple-500/70 shadow-lg shadow-purple-950/30 ring-1 ring-purple-500/50'
              : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Perfil 2</span>
                <h3 className="text-base font-bold text-white">Chefe Kindo'jan (Tier 11 Solo)</h3>
              </div>
            </div>
            {scenario === 'delve_boss' && (
              <span className="text-[10px] bg-purple-500 text-white font-black px-2 py-0.5 rounded-full uppercase">
                Selecionado
              </span>
            )}
          </div>

          <div className="mt-4 space-y-2 text-xs text-zinc-300">
            <div className="p-2.5 bg-zinc-950/70 rounded-xl border border-zinc-850">
              <span className="font-bold text-purple-300">Runa Indicada: C24</span> (<code>1A-2B-3A-4D-5C</code>)
              <p className="text-[11px] text-zinc-400 mt-0.5">
                <strong>Defesa Máxima:</strong> Autorrecomposição (2B) cura emergencialmente abaixo de 75%, Guerreiro Versátil (4D) reduz o dano sofrido e Ecos (5C) replica 50% de dano após 10 s de combate longo.
              </p>
            </div>

            <div className="p-2.5 bg-zinc-950/70 rounded-xl border border-zinc-850">
              <span className="font-bold text-purple-300">Janela de Burst:</span> Emblema de Dazar + Tirano Diabólico
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Ative o Emblema Tempestuoso de Dazar (+1.082 de Aceleração) exatamente na invocação do Tirano Diabólico e Comandante Vil para queimar as fases de invocação de chamas do chefe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conjunto de Tecido: Pisa-piras */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">Conjunto de Tecido: Pisa-piras (Mítico 2/6 - ilvl 321)</h2>
              <span className="text-[10px] bg-purple-900/70 text-purple-200 px-2 py-0.5 rounded border border-purple-700/50 font-semibold">
                Wah'du
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Conjunto completo de 8 peças obtível com Fragmentos de Alma Mítica. Excelente para preencher slots enquanto busca o teto 331 no craft.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {pisaPirasSet.map(item => (
            <div key={item.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-850">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-300">{item.slot.toUpperCase()}</span>
                <span className="text-purple-300 font-mono">ilvl {item.ilvl}</span>
              </div>
              <h4 className="text-xs font-bold text-zinc-100 mt-1 truncate">{item.namePt}</h4>
              <p className="text-[10px] italic text-zinc-500 truncate">{item.nameEn} [{item.id}]</p>
              
              <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
                {item.stats && Object.entries(item.stats).map(([k, v]) => (
                  k !== 'stamina' && k !== 'intellect' && (
                    <span key={k} className="px-1.5 py-0.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800">
                      {k.slice(0, 3)}: {v}
                    </span>
                  )
                ))}
              </div>
              {item.notes && <p className="text-[10px] text-amber-400/90 mt-1.5">{item.notes}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Wah'du Weapons & Off-hands */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <h2 className="text-base font-bold text-white pb-2 border-b border-zinc-800">
          Armas e Mãos Secundárias de Wah'du (Utilizáveis por Conjurador)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {wahduWeapons.map(item => (
            <div key={item.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-850">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="font-semibold text-zinc-300">{item.weaponType?.toUpperCase()}</span>
                <span className="text-purple-300 font-mono">ilvl {item.ilvl}</span>
              </div>
              <h4 className="text-xs font-bold text-zinc-100 mt-1">{item.namePt}</h4>
              <p className="text-[10px] italic text-zinc-500">{item.nameEn} [{item.id}]</p>
              {item.notes && <p className="text-[10px] text-zinc-400 mt-1">{item.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
