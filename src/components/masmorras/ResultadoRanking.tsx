import React, { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { MasmorraRanking, RankingResult } from '../../services/masmorrasService';
import { Cartao, Delta, Etiqueta, ItemIcone, Segmentado, formatarDps } from '../../ui';
import { nomeItem, slotPt, textoUpgrade } from './rotulos';

const TOPO = 5;

const ItensDaMasmorra: React.FC<{ masmorra: MasmorraRanking }> = ({ masmorra }) => (
    <div className="mt-2 space-y-1 border-t border-borda pt-2">
        {masmorra.itens.map((item) => (
            <div
                key={`${item.item_id}-${item.slot}`}
                className="grid grid-cols-[minmax(0,1fr)_7.5rem_5.5rem_5.5rem_6.5rem_auto] items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-superficie-2"
            >
                <ItemIcone
                    itemId={item.item_id}
                    icone={item.icone}
                    nome={nomeItem(item)}
                    slot={item.slot}
                    ilvl={item.ilvl}
                    stats={item.stats}
                />
                <span className="text-xs text-texto-3">
                    {slotPt(item.slot)} · {item.degrau ?? <span className="num">{item.ilvl}</span>}
                </span>
                <Delta valor={item.delta_cru_pct} limiar={item.limiar_pct} className="text-right" />
                <span className="text-right text-xs text-texto-3" title="Ganho se catalisado para o tier">
                    {item.delta_catalisado_pct != null ? (
                        <>
                            cat <Delta valor={item.delta_catalisado_pct} limiar={item.limiar_pct} />
                        </>
                    ) : (
                        '—'
                    )}
                </span>
                <span
                    className="text-right text-xs text-texto-2"
                    title={item.upgrade ? `Brasões para chegar a ${item.upgrade.ate} (custo cheio, sem desconto de slot)` : ''}
                >
                    {item.upgrade
                        ? item.upgrade.brasoes
                            ? <>→ 6/6: <span className="num text-texto">{textoUpgrade(item.upgrade)}</span></>
                            : 'já no 6/6'
                        : '—'}
                </span>
                <span className="justify-self-end">
                    <Etiqueta tipo={item.etiqueta} />
                </span>
            </div>
        ))}
        <p className="px-2 pt-1 text-xs text-texto-3">{masmorra.explicacao}</p>
    </div>
);

const LinhaMasmorra: React.FC<{ masmorra: MasmorraRanking; posicao: number; abertaInicial: boolean }> = ({
    masmorra,
    posicao,
    abertaInicial,
}) => {
    const [aberta, setAberta] = useState(abertaInicial);
    return (
        <div className={`rounded-lg border ${posicao === 1 ? 'border-destaque/50' : 'border-borda'} bg-superficie px-3 py-2`}>
            <button
                type="button"
                aria-expanded={aberta}
                onClick={() => setAberta((v) => !v)}
                className="grid w-full grid-cols-[1.5rem_minmax(0,1fr)_auto_6.5rem_1rem] items-center gap-3 text-left"
            >
                <span className={`num text-sm ${posicao === 1 ? 'text-destaque font-semibold' : 'text-texto-3'}`}>
                    {posicao}
                </span>
                <span className="truncate text-sm font-medium text-texto">{masmorra.masmorra}</span>
                <span className="text-xs text-texto-2">
                    <span className="num text-texto">{masmorra.servem}</span> de{' '}
                    <span className="num">{masmorra.elegiveis}</span> servem ·{' '}
                    <span className="num">{masmorra.chance_pct.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%</span>
                </span>
                <span className="text-right text-sm">
                    <span className="text-xs text-texto-3">maior </span>
                    <Delta valor={masmorra.maior_pct} />
                </span>
                <ChevronRight className={`w-4 h-4 text-texto-3 transition-transform ${aberta ? 'rotate-90' : ''}`} />
            </button>
            {aberta && <ItensDaMasmorra masmorra={masmorra} />}
        </div>
    );
};

interface Props {
    resultado: RankingResult;
    modo: 'masmorras' | 'cofre' | 'craft';
    /** "Resultado de dd/mm hh:mm" quando aberto pelo Histórico. */
    selo?: string | null;
}

export const ResultadoRanking: React.FC<Props> = ({ resultado, modo, selo }) => {
    const [ordem, setOrdem] = useState<'quantidade' | 'maior'>('quantidade');
    const [todas, setTodas] = useState(false);

    const lista = useMemo(() => {
        const arr = [...resultado.masmorras];
        arr.sort((a, b) =>
            ordem === 'maior'
                ? b.maior_pct - a.maior_pct || b.servem - a.servem
                : b.servem - a.servem || b.maior_pct - a.maior_pct,
        );
        return arr;
    }, [resultado, ordem]);

    const cofre = modo === 'cofre';
    const visiveis = todas || cofre ? lista : lista.slice(0, TOPO);
    const melhor = lista[0];
    const builds = resultado.builds?.length ?? 0;

    return (
        <Cartao
            titulo={cofre ? 'Opções do Grande Cofre' : 'Rolar o bônus em'}
            acao={
                !cofre && (
                    <Segmentado<'quantidade' | 'maior'>
                        rotuloAria="Ordenar por"
                        opcoes={[
                            { valor: 'quantidade', rotulo: 'Mais itens que servem' },
                            { valor: 'maior', rotulo: 'Maior ganho de um item' },
                        ]}
                        valor={ordem}
                        onChange={setOrdem}
                    />
                )
            }
        >
            <p className="-mt-1 mb-3 text-xs text-texto-3">
                {resultado.nivel ? `${resultado.nivel} (${resultado.ilvl}) · ` : ''}
                {builds
                    ? `Média ponderada de ${builds} build(s)`
                    : `Base ${formatarDps(resultado.base_dps)} DPS`}
                {' · '}
                <span className="num">{resultado.iteracoes.toLocaleString('pt-BR')}</span> iterações
                {selo ? ` · ${selo}` : ''}
            </p>

            <details className="mb-3 text-xs text-texto-3">
                <summary className="cursor-pointer text-texto-2 hover:text-texto">Como ler este resultado</summary>
                <ul className="mt-2 space-y-1 leading-snug">
                    <li>
                        <strong className="text-texto-2">servem</strong>: quantos itens dessa masmorra aumentam o seu dano
                        (acima da margem de erro). <strong className="text-texto-2">%</strong> ao lado: chance de o bônus
                        roll cair num item que serve.
                    </li>
                    <li>
                        <strong className="text-texto-2">maior</strong>: o maior ganho de dano de um único item dela.
                    </li>
                    <li>
                        Em cada item: o primeiro % é o ganho usando o item como ele cai; <strong className="text-texto-2">cat</strong>{' '}
                        é o ganho se você transformar a peça em tier no Catalisador.
                    </li>
                    <li>
                        <span className="text-ganho">verde</span> = ganho real, <span className="text-perda">vermelho</span> = perda,
                        cinza = empate dentro da margem de erro (não vale trocar).
                    </li>
                    <li>
                        <strong className="text-texto-2">→ 6/6</strong>: brasões que faltam para upar o item até o máximo da
                        trilha (custo cheio, sem o desconto de slot do jogo).
                    </li>
                </ul>
            </details>

            {!melhor || melhor.servem === 0 ? (
                <p className="text-sm text-texto-2">Nenhum item medido é upgrade para o seu conjunto atual.</p>
            ) : (
                <div className="space-y-2">
                    {visiveis.map((m, i) => (
                        <LinhaMasmorra
                            key={m.masmorra}
                            masmorra={m}
                            posicao={i + 1}
                            abertaInicial={cofre || i === 0}
                        />
                    ))}
                </div>
            )}

            {!cofre && lista.length > TOPO && (
                <button
                    type="button"
                    onClick={() => setTodas((v) => !v)}
                    className="mt-3 text-sm text-info hover:underline"
                >
                    {todas ? 'Mostrar só as 5 melhores' : `Ver todas (${lista.length})`}
                </button>
            )}
        </Cartao>
    );
};
