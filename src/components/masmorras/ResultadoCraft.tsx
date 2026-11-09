import React from 'react';
import { Gem, Hammer } from 'lucide-react';
import { CraftResultado, DuplaCraft } from '../../services/masmorrasService';
import { Aviso, Cartao, Delta, ItemIcone } from '../../ui';
import { slotPt } from './rotulos';

const Dupla: React.FC<{ d: DuplaCraft; nivel: string; destaque?: boolean }> = ({ d, nivel, destaque }) => (
    <div className={`rounded-lg border px-3 py-2 ${destaque ? 'border-destaque/50' : 'border-borda'}`}>
        <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="text-texto-2">{d.slots.map(slotPt).join(' + ')}</span>
            <span className="flex items-baseline gap-2">
                <Delta valor={d.ganho_pct} limiar={d.limiar_pct} />
                {!destaque && (
                    <span className="text-xs text-texto-3" title="Diferença para o melhor plano, em % do seu DPS">
                        ({d.diferenca_pct.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}% vs melhor)
                    </span>
                )}
            </span>
        </div>
        {d.pecas.map((p) => (
            <div key={p.slot} className="grid grid-cols-[6rem_minmax(0,1fr)_minmax(0,11rem)] items-center gap-3 py-0.5 text-sm">
                <span className="text-xs text-texto-3">{slotPt(p.slot)}</span>
                <span className="flex min-w-0 items-center gap-1.5">
                    <ItemIcone
                        itemId={p.item_id}
                        icone={p.icone}
                        nome={p.nome_pt || p.nome_en || `#${p.item_id}`}
                        slot={slotPt(p.slot)}
                        ilvl={p.ilvl}
                        stats={p.stats}
                        fonte={`Craft (${nivel})`}
                        roleTag="Craftado"
                        degrau={nivel}
                        tamanho={20}
                    />
                    {p.embutido && <span className="shrink-0 text-xs text-aviso">embelezado</span>}
                </span>
                <span className="truncate text-xs text-texto-2">{p.missiva}{p.centelhas > 2 ? ` · ${p.centelhas} Centelhas` : ''}</span>
            </div>
        ))}
    </div>
);

/** Modo Craft: peça + missiva por slot e embelezamentos, todos medidos pelo simc. */
export const ResultadoCraft: React.FC<{ craft: CraftResultado; selo?: string | null }> = ({ craft, selo }) => {
    const servem = craft.pecas.filter((p) => p.serve);
    const melhoresEmb = craft.embelezamentos.slice(0, 2);
    const plano = craft.plano;
    return (
        <div className="space-y-5">
            {plano && (
                <Cartao
                    titulo={
                        <span className="flex items-center gap-2">
                            <Hammer className="w-4 h-4 text-destaque" /> Plano: craftar 2 peças
                        </span>
                    }
                >
                    <p className="-mt-1 mb-3 text-xs text-texto-3">
                        As duas peças foram medidas juntas no simc
                        {plano.iteracoes ? ` (${plano.iteracoes.toLocaleString('pt-BR')} iterações)` : ''}.{' '}
                        {plano.nota}
                    </p>
                    {plano.melhor ? (
                        <div className="space-y-2">
                            <Dupla d={plano.melhor} nivel={craft.custo.nivel} destaque />
                            {plano.alternativas.length > 0 && (
                                <>
                                    <p className="pt-1 text-xs text-texto-3">
                                        Alternativas (você decide): o número entre parênteses é quanto de DPS a menos que o melhor plano.
                                    </p>
                                    {plano.alternativas.map((d) => (
                                        <Dupla key={d.slots.join('-')} d={d} nivel={craft.custo.nivel} />
                                    ))}
                                </>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-texto-2">{plano.motivo}</p>
                    )}
                </Cartao>
            )}
            <Cartao
                titulo={
                    <span className="flex items-center gap-2">
                        <Hammer className="w-4 h-4 text-destaque" /> {plano ? 'Cada peça sozinha' : 'Peças para craftar'}
                    </span>
                }
            >
                <p className="-mt-1 mb-3 text-xs text-texto-3">
                    {craft.custo.nivel} · nível <span className="num">{craft.custo.ilvl}</span> · custo por peça:{' '}
                    <span className="text-texto-2">
                        {craft.custo.brasoes} {craft.custo.moeda.includes('Mítico') ? 'Brasões Míticos' : 'Brasões de Herói'} +{' '}
                        {craft.custo.centelhas} Centelhas de Marés
                    </span>
                    {selo ? ` · ${selo}` : ''}
                </p>
                {craft.pecas.length === 0 ? (
                    <p className="text-sm text-texto-2">Nenhuma peça craftável medida.</p>
                ) : (
                    <div className="space-y-1">
                        {craft.pecas.map((p) => (
                            <div
                                key={`${p.slot}-${p.item_id}`}
                                className={`grid grid-cols-[6rem_minmax(0,1fr)_minmax(0,11rem)_5.5rem] items-center gap-3 rounded-lg px-2 py-1.5 text-sm ${p.serve ? '' : 'opacity-60'}`}
                            >
                                <span className="text-xs text-texto-3">{slotPt(p.slot)}</span>
                                <span className="flex min-w-0 items-center gap-1.5">
                                    <ItemIcone
                                        itemId={p.item_id}
                                        icone={p.icone}
                                        nome={p.nome_pt || p.nome_en || `#${p.item_id}`}
                                        slot={slotPt(p.slot)}
                                        ilvl={p.ilvl}
                                        stats={p.stats}
                                        fonte={craft.custo.nivel ? `Craft (${craft.custo.nivel})` : 'Craft'}
                                        roleTag="Craftado"
                                        degrau={craft.custo.nivel}
                                        tamanho={20}
                                    />
                                    {p.embutido && <span className="shrink-0 text-xs text-aviso">embelezado</span>}
                                </span>
                                <span className="truncate text-xs text-texto-2" title="Missiva Talassiana: par de secundários garantido">
                                    {p.missiva}
                                </span>
                                <span className="text-right">
                                    <Delta valor={p.ganho_pct} limiar={p.limiar_pct} />
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                <p className="mt-3 text-xs text-texto-3">
                    {servem.length
                        ? `${servem.length} peça(s) superam o que você usa hoje. O ganho é da peça sozinha, sem embelezamento.`
                        : 'Nenhuma peça craftada supera o que você usa hoje (sem contar embelezamento).'}
                </p>
                {craft.bloqueados && craft.bloqueados.length > 0 && (
                    <div className="mt-3 border-t border-borda pt-2">
                        <p className="text-xs text-texto-3">
                            Não medidas: estourariam o limite de 2 embelezamentos.
                        </p>
                        <ul className="mt-1 space-y-1">
                            {craft.bloqueados.map((b) => (
                                <li key={`${b.slot}-${b.item_id}`} className="text-xs leading-snug text-texto-3">
                                    <span className="text-texto-2">{slotPt(b.slot)} · {b.nome_pt || b.nome_en || `#${b.item_id}`}</span>
                                    {' — '}
                                    {b.motivo}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Cartao>

            <Cartao
                titulo={
                    <span className="flex items-center gap-2">
                        <Gem className="w-4 h-4 text-destaque" /> Embelezamentos
                    </span>
                }
            >
                <p className="-mt-1 mb-3 text-xs text-texto-3">{craft.limite_embelezamentos} Ganho = só o efeito, medido na peça indicada.</p>
                {craft.embelezamentos.length === 0 ? (
                    <p className="text-sm text-texto-2">Nenhum embelezamento pôde ser medido.</p>
                ) : (
                    <div className="space-y-2">
                        {craft.embelezamentos.map((e, i) => (
                            <div
                                key={e.reagente_id}
                                className={`rounded-lg border px-3 py-2 ${i < 2 && e.ganho_pct > e.limiar_pct ? 'border-destaque/50' : 'border-borda'}`}
                            >
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <span className="flex items-center gap-2 text-sm font-medium text-texto">
                                        {e.icone_url && (
                                            <img
                                                src={e.icone_url}
                                                alt=""
                                                loading="lazy"
                                                width={20}
                                                height={20}
                                                className="shrink-0 rounded border border-borda"
                                            />
                                        )}
                                        {e.tipo === 'troca' && e.troca_de ? (
                                            <span className="mr-1 text-xs font-normal text-texto-3">
                                                Trocar {e.troca_de} por
                                            </span>
                                        ) : e.tipo === 'peca' && e.troca_de ? (
                                            <span className="mr-1 text-xs font-normal text-texto-3">
                                                Trocar a peça embutida #{e.troca_de} por
                                            </span>
                                        ) : null}
                                        {e.nome_pt || e.nome_en}
                                        <span className="ml-2 text-xs font-normal text-texto-3">{e.nome_en}</span>
                                    </span>
                                    <span className="text-sm">
                                        <Delta valor={e.ganho_pct} limiar={e.limiar_pct} />
                                        <span className="ml-2 text-xs text-texto-3">em {slotPt(e.slot_medido)}</span>
                                    </span>
                                </div>
                                {e.descricao && (
                                    <p className="mt-1 text-xs leading-snug text-texto-2">{e.descricao}</p>
                                )}
                                {e.texto_completo && (
                                    <details className="mt-1 text-xs text-texto-3">
                                        <summary className="cursor-pointer text-texto-2">Tooltip completo do jogo</summary>
                                        <p className="mt-1 whitespace-pre-line leading-snug">{e.texto_completo}</p>
                                    </details>
                                )}
                                {e.materiais && e.materiais.length > 0 && (
                                    <details className="mt-1 text-xs text-texto-3">
                                        <summary className="cursor-pointer text-texto-2">Materiais</summary>
                                        <ul className="mt-1 list-disc pl-4">
                                            {e.materiais.map((m) => (
                                                <li key={m}>{m}</li>
                                            ))}
                                        </ul>
                                    </details>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {melhoresEmb.length === 2 && melhoresEmb.every((e) => e.ganho_pct > e.limiar_pct) && (
                    <p className="mt-3 text-sm text-texto">
                        Sugestão: <span className="text-destaque">{melhoresEmb[0].nome_pt}</span> +{' '}
                        <span className="text-destaque">{melhoresEmb[1].nome_pt}</span> (os dois que mais rendem; o jogo
                        permite 2).
                    </p>
                )}
            </Cartao>

            {craft.avisos.length > 0 && (
                <Aviso tom="aviso">
                    {craft.avisos.map((a, i) => (
                        <div key={i}>{a}</div>
                    ))}
                </Aviso>
            )}
        </div>
    );
};
