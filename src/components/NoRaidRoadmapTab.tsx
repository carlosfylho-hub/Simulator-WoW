import React from 'react';
import { Compass, Hammer, Sparkles, Shield, ArrowRight, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { DEMONOLOGY_WARLOCK } from '../data/specs';

export const NoRaidRoadmapTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-teal-950/50 border border-emerald-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
          <Compass className="w-4 h-4" />
          <span>Diretriz Estratégica Sem Raide · Patch 12.1.5 S2</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Caminho Ótimo de Progressão: M+, Delves & Crafting
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
          Para jogadores que <strong>não participam de raides</strong>, é perfeitamente viável atingir o teto de poder através da tríade: <strong>Crafting no teto 331</strong>, <strong>Masmorras Mítico+ prioritárias</strong>, <strong>Imersões de Kindo'jan (Wah'du)</strong> e fechamento do bônus de 4 peças através do <strong>Catalisador Matriz (Matrix Catalyst)</strong>.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pilar 1: Crafting 331 & 2 Embelezamentos */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="flex items-center space-x-2 pb-3 border-b border-zinc-800">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Pilar 1: Teto 331</span>
              <h3 className="text-sm font-bold text-white">Centelhas & Embelezamentos</h3>
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs text-zinc-300">
            <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-850">
              <span className="font-bold text-white">1ª Centelha: Braceletes do Mártir [239648]</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Pulsos de Alfaiataria. Missiva: <strong>Aceleração + Maestria</strong>. Embelezamento: <strong>Forro de Arcanotrama [240167]</strong>.
              </p>
            </div>

            <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-850">
              <span className="font-bold text-white">2ª Centelha: Lanterna de Aln'hara [245769]</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Mão secundária de Escrivania. Missiva: <strong>Aceleração + Maestria</strong>. Embelezamento: segundo <strong>Forro de Arcanotrama</strong> (totalizando 2 efeitos).
              </p>
            </div>

            <div className="p-2 bg-amber-950/30 border border-amber-800/40 rounded-lg text-[11px] text-amber-300">
              <strong>Regra de Ouro (§1.4):</strong> O limite oficial é de <strong>2 efeitos de embelezamento</strong> ativos por personagem, NÃO de peças fabricadas. Uma 3ª peça craftada (331) pode ser equipada pelos atributos brutos, desde que saia sem embelezamento!
            </div>
          </div>
        </div>

        {/* Pilar 2: Masmorras M+ Alvo */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="flex items-center space-x-2 pb-3 border-b border-zinc-800">
            <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Pilar 2: Masmorras Alvo</span>
              <h3 className="text-sm font-bold text-white">Dungeons M+ de Alta Prioridade</h3>
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs text-zinc-300">
            <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-850 flex items-start justify-between">
              <div>
                <strong className="text-purple-300">1. Descanso do Rei:</strong>
                <p className="text-[11px] text-zinc-400">Emblema Tempestuoso de Dazar [273649] (Berloque ativo Tier S, +1.082 Aceleração).</p>
              </div>
              <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded font-mono">341</span>
            </div>

            <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-850 flex items-start justify-between">
              <div>
                <strong className="text-purple-300">2. Altar das Presas:</strong>
                <p className="text-[11px] text-zinc-400">Nó de Serpentes Contorcidas [273794] (Berloque passivo de Intelecto constante).</p>
              </div>
              <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded font-mono">341</span>
            </div>

            <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-850 flex items-start justify-between">
              <div>
                <strong className="text-purple-300">3. Arena da Chaga do Caos:</strong>
                <p className="text-[11px] text-zinc-400">Atadura do Éter Etérea [251222] (Cinto BiS com 95 de Aceleração).</p>
              </div>
              <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded font-mono">334</span>
            </div>

            <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-850 flex items-start justify-between">
              <div>
                <strong className="text-purple-300">4. Templo de Sethraliss:</strong>
                <p className="text-[11px] text-zinc-400">Elo de Arenito Carregado [158366] (Anel com 232 Crítico e 174 Maestria).</p>
              </div>
              <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded font-mono">334</span>
            </div>
          </div>
        </div>

        {/* Pilar 3: Imersões e Wah'du */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="flex items-center space-x-2 pb-3 border-b border-zinc-800">
            <div className="p-2 bg-cyan-500/20 text-cyan-300 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Pilar 3: Delves Solo</span>
              <h3 className="text-sm font-bold text-white">Labirinto de Kindo'jan & Wah'du</h3>
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs text-zinc-300">
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Use as Imersões semanais no Tier 11 para farmar <strong>Fragmentos de Alma Mítica</strong> e adquirir com Wah'du as peças do conjunto <strong>Pisa-piras (Mítico 2/6 - ilvl 321)</strong> nos slots que não droparam em M+.
            </p>
            <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-850">
              <span className="font-bold text-cyan-300">Recomendações de Compra em Wah'du:</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-zinc-400">
                <li>Adaga do Eidolon Esquecido [272266] (1M com Crítico e Aceleração)</li>
                <li>Elo Colubrino [272147] (Anel com 107 de Aceleração)</li>
                <li>Talismã Serpentino [272229] (Pescoço com Crítico e Aceleração)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pilar 4: Catalisador Matriz (Matrix Catalyst) */}
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="flex items-center space-x-2 pb-3 border-b border-zinc-800">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Pilar 4: Bônus 4pc Sem Raide</span>
              <h3 className="text-sm font-bold text-white">Matrix Catalyst & Great Vault</h3>
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs text-zinc-300">
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Você <strong>NÃO precisa pisar em raide</strong> para fechar as 4 peças dos <em>Grilhões do Necrólito Maldito [2066]</em>:
            </p>
            <div className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-850">
              <span className="font-bold text-emerald-300">Caminho de Conversão:</span>
              <p className="text-[11px] text-zinc-400 mt-1">
                Leve peças míticas obtidas no baú de M+ ou Great Vault (Ombros, Peitoral, Mãos ou Pernas) ao <strong>Catalisador Matriz</strong>. A conversão concede a peça de conjunto completa preservando encaixes e nível!
              </p>
            </div>
            <div className="p-2 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-[11px] text-emerald-300">
              O bônus de 4 peças concede <strong>350% de implosão no alvo principal e 315% nos secundários</strong> aos diabretes. É a maior prioridade de DPS do personagem.
            </div>
          </div>
        </div>
      </div>

      {/* Full No-Raid BiS Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-base font-bold text-white pb-2 border-b border-zinc-800">
          Tabela BiS Completa Sem Raide (Bruxo Demonologia)
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2 px-3">Slot</th>
                <th className="py-2 px-3">Item Recomendado</th>
                <th className="py-2 px-3">Origem</th>
                <th className="py-2 px-3">Observação Tática</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {DEMONOLOGY_WARLOCK.noRaidBiS.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-850/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-zinc-200">{row.slot}</td>
                  <td className="py-2.5 px-3 text-amber-200 font-bold">{row.itemPt}</td>
                  <td className="py-2.5 px-3 text-zinc-400">{row.source}</td>
                  <td className="py-2.5 px-3 text-zinc-300">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
