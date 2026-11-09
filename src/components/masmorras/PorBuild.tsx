import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { BuildResultado, RankingResult } from '../../services/masmorrasService';
import { CENARIOS_DROPDOWN } from '../../data/scenarios';
import { Cartao, Delta, ItemIcone, formatarDps } from '../../ui';
import { nomeItem, slotPt, textoUpgrade } from './rotulos';

const rotuloCenario = (v: string) => CENARIOS_DROPDOWN.find((c) => c.valor === v)?.rotulo ?? v;

const CartaoBuild: React.FC<{ build: BuildResultado }> = ({ build }) => {
    const confirmado =
        build.delta_conjunto_pct != null && build.limiar_conjunto_pct != null
            ? build.delta_conjunto_pct > build.limiar_conjunto_pct
            : null;
    return (
        <div className="rounded-lg border border-borda bg-superficie-2 p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-texto">{build.nome}</span>
                <span className="text-xs text-texto-3">
                    {rotuloCenario(build.cenario)}
                    {build.ref_dps ? ` · ${formatarDps(build.ref_dps)} DPS` : ''}
                </span>
            </div>
            {build.trocas.length === 0 ? (
                <p className="mt-2 text-sm text-texto-2">Nenhuma peça melhora esta build.</p>
            ) : (
                <>
                    <p className="mt-2 text-sm text-texto-2" title="Medido numa execução própria: build atual × conjunto montado">
                        Conjunto montado <Delta valor={build.delta_conjunto_pct} limiar={build.limiar_conjunto_pct} />
                        {confirmado === false && (
                            <span className="text-aviso"> · a combinação não confirmou o ganho das peças sozinhas</span>
                        )}
                    </p>
                    <ul className="mt-2 space-y-1">
                        {build.trocas.map((t) => (
                            <li key={t.slot} className="grid grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-2 text-sm">
                                <span className="text-xs text-texto-3">{slotPt(t.slot)}</span>
                                <span className="flex min-w-0 items-center gap-1">
                                    <ItemIcone itemId={t.item_id} icone={t.icone} nome={nomeItem(t)} slot={slotPt(t.slot)} degrau={t.degrau} efeito={t.efeito} conjunto={t.conjunto} ilvl={t.ilvl} stats={t.stats} tamanho={20} />
                                    {t.catalisado && <span className="shrink-0 text-xs text-aviso">catalisar</span>}
                                </span>
                                <span className="flex items-center gap-2">
                                    {t.upgrade?.brasoes ? (
                                        <span className="text-xs text-texto-3" title={`Até ${t.upgrade.ate}`}>
                                            {textoUpgrade(t.upgrade)}
                                        </span>
                                    ) : null}
                                    <Delta valor={t.ganho_pct} />
                                </span>
                            </li>
                        ))}
                    </ul>
                    {build.brasoes && Object.keys(build.brasoes).length > 0 && (
                        <p className="mt-2 text-xs text-texto-2" title="Custo cheio para levar todas as trocas ao 6/6; o desconto de slot do jogo pode reduzir">
                            Para upar tudo ao 6/6:{' '}
                            {Object.entries(build.brasoes)
                                .map(([moeda, n]) => `${n} ${moeda.includes('Mítico') ? 'Brasões Míticos' : 'Brasões de Herói'}`)
                                .join(' + ')}
                        </p>
                    )}
                </>
            )}
            {build.avisos.length > 0 && (
                <ul className="mt-2 space-y-0.5 text-xs text-aviso">
                    {build.avisos.map((a, i) => (
                        <li key={i}>• {a}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export const PorBuild: React.FC<{ resultado: RankingResult }> = ({ resultado }) => {
    const builds = resultado.builds ?? [];
    if (builds.length === 0) return null;
    const nomes = builds.map((b) => b.nome);
    const linhas = resultado.matriz.filter((l) => Object.values(l.etiquetas).some((e) => e !== 'nao_serve'));

    return (
        <Cartao titulo="Por build">
            {linhas.length > 0 && (
                <div className="-mx-1 overflow-x-auto">
                    <table className="w-full min-w-[36rem] text-sm">
                        <thead>
                            <tr className="text-left text-xs text-texto-3">
                                <th className="px-1 py-1.5 font-medium">Item</th>
                                {nomes.map((n) => (
                                    <th key={n} className="px-1 py-1.5 text-right font-medium">
                                        <span className="block max-w-[8rem] truncate" title={n}>
                                            {n}
                                        </span>
                                        <span className="num font-normal">{Math.round(100 * (resultado.pesos_builds[n] ?? 0))}%</span>
                                    </th>
                                ))}
                                <th className="px-1 py-1.5 text-right font-medium text-texto-2">Média</th>
                            </tr>
                        </thead>
                        <tbody>
                            {linhas.map((l) => (
                                <tr key={l.item_id} className="border-t border-borda">
                                    <td className="px-1 py-1.5">
                                        <span className="flex min-w-0 items-center gap-1.5">
                                            <ItemIcone itemId={l.item_id} icone={l.icone} nome={nomeItem(l)} slot={slotPt(l.slot)} stats={l.stats} efeito={l.efeito} conjunto={l.conjunto} tamanho={20} />
                                            {l.divergente && (
                                                <span title="Ganha numa build e perde em outra" className="shrink-0">
                                                    <AlertTriangle className="w-4 h-4 text-aviso" />
                                                </span>
                                            )}
                                        </span>
                                        <span className="block text-xs text-texto-3">{l.masmorra}</span>
                                    </td>
                                    {nomes.map((n) => (
                                        <td key={n} className="px-1 py-1.5 text-right">
                                            <Delta valor={l.deltas[n]} limiar={l.limiares[n]} />
                                        </td>
                                    ))}
                                    <td className="px-1 py-1.5 text-right font-semibold">
                                        <Delta valor={l.media_pct} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="mt-2 px-1 text-xs text-texto-3">
                        Só itens que servem em pelo menos uma build. Cinza = empate dentro da margem de erro.
                    </p>
                </div>
            )}
            <div className="mt-4 grid gap-3 md:grid-cols-2">
                {builds.map((b) => (
                    <CartaoBuild key={b.nome} build={b} />
                ))}
            </div>
        </Cartao>
    );
};
