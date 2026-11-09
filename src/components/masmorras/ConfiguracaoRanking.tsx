import React from 'react';
import { Play, XCircle } from 'lucide-react';
import { BuildDisponivel, ESCADA, ILVL_FORJA, RankingEstimativa } from '../../services/masmorrasService';
import { CENARIOS_DROPDOWN, DESCRICAO_CENARIO } from '../../data/scenarios';
import { Botao, Campo, Cartao, Numero, Recolhivel, Segmentado, Selecao } from '../../ui';

export interface Config {
    modo: 'masmorras' | 'cofre' | 'craft';
    ilvl: number;            // atalho antigo; o pedido usa trilha + rank + forja
    trilha: 'heroi' | 'mito';
    rank: number;
    forja: boolean;
    scenario: string;
    itTriagem: number;
    itRefino: number;
    orcamento: number;
    builds: string[];
    pesos: Record<string, number>;
    cenarios: Record<string, string>;
    medirPesos: boolean;
}

interface Props {
    config: Config;
    mudar: (parcial: Partial<Config>) => void;
    buildsDisponiveis: BuildDisponivel[];
    estimativa: RankingEstimativa | null;
    rodando: boolean;
    podeRodar: boolean;
    criando: boolean;
    onRodar: () => void;
    onCancelar: () => void;
}

const minutos = (s: number) => (s < 90 ? `~${Math.round(s)} s` : `~${Math.round(s / 60)} min`);

export const ConfiguracaoRanking: React.FC<Props> = ({
    config,
    mudar,
    buildsDisponiveis,
    estimativa,
    rodando,
    podeRodar,
    criando,
    onRodar,
    onCancelar,
}) => {
    const marcadas = config.builds.filter((b) => buildsDisponiveis.some((d) => d.nome === b));
    const alternar = (nome: string) =>
        mudar({
            builds: config.builds.includes(nome)
                ? config.builds.filter((n) => n !== nome)
                : [...config.builds, nome].slice(0, 6),
        });

    return (
        <Cartao>
            {config.modo === 'masmorras' && (
                <div className="mb-4 flex flex-wrap items-end gap-4">
                    <Campo rotulo="Trilha" dica="Trilha de upgrade em que o item vai chegar (bônus roll da chave).">
                        <Segmentado<'heroi' | 'mito'>
                            rotuloAria="Trilha"
                            opcoes={[
                                { valor: 'heroi', rotulo: 'Herói' },
                                { valor: 'mito', rotulo: 'Mítico' },
                            ]}
                            valor={config.trilha}
                            onChange={(trilha) => mudar({ trilha })}
                        />
                    </Campo>
                    <Campo rotulo="Rank">
                        <Selecao
                            value={config.rank}
                            onChange={(e) => {
                                const rank = Number(e.target.value);
                                mudar({ rank, forja: rank === 6 ? config.forja : false });
                            }}
                        >
                            {ESCADA[config.trilha].map((ilvl, i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}/6 · {ilvl}
                                </option>
                            ))}
                        </Selecao>
                    </Campo>
                    <label
                        className={`flex h-9 items-center gap-2 text-sm ${config.rank === 6 ? 'text-texto' : 'text-texto-3'}`}
                        title={config.rank === 6 ? '' : 'A Forja do Veneno só existe no 6/6'}
                    >
                        <input
                            type="checkbox"
                            disabled={config.rank !== 6}
                            checked={config.forja && config.rank === 6}
                            onChange={(e) => mudar({ forja: e.target.checked })}
                            className="h-4 w-4 accent-destaque"
                        />
                        Forja do Veneno
                        <span className="num text-texto-3">({ILVL_FORJA[config.trilha]})</span>
                    </label>
                </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
                <Campo
                    rotulo="Cenário"
                    dica={
                        marcadas.length
                            ? 'Com builds marcadas, cada build usa o próprio cenário (em "Builds").'
                            : DESCRICAO_CENARIO[config.scenario]
                    }
                >
                    <Selecao
                        value={config.scenario}
                        disabled={marcadas.length > 0}
                        onChange={(e) => mudar({ scenario: e.target.value })}
                    >
                        {CENARIOS_DROPDOWN.map((c) => (
                            <option key={c.valor} value={c.valor}>
                                {c.rotulo}
                            </option>
                        ))}
                    </Selecao>
                </Campo>
            </div>

            <div className="mt-4 space-y-3 border-t border-borda pt-3">
                {config.modo !== 'craft' && (
                <Recolhivel
                    titulo="Builds"
                    resumo={marcadas.length ? `${marcadas.length} marcada(s)` : 'só a build atual'}
                >
                    {buildsDisponiveis.length === 0 ? (
                        <p className="text-sm text-texto-3">O export do SimC não tem builds salvas.</p>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-xs text-texto-3">
                                Cada build é medida contra ela mesma; o ranking usa a média pelos pesos. Custa uma
                                rodada por build.
                            </p>
                            {buildsDisponiveis.map((b) => {
                                const on = config.builds.includes(b.nome);
                                return (
                                    <div key={b.nome} className="flex flex-wrap items-center gap-3">
                                        <label className="flex w-48 items-center gap-2 text-sm text-texto">
                                            <input
                                                type="checkbox"
                                                checked={on}
                                                onChange={() => alternar(b.nome)}
                                                className="h-4 w-4 accent-destaque"
                                            />
                                            <span className="truncate" title={b.nome}>
                                                {b.nome}
                                            </span>
                                        </label>
                                        <label className={`flex items-center gap-2 text-xs text-texto-2 ${on ? '' : 'opacity-40'}`}>
                                            peso
                                            <Numero
                                                min={0}
                                                disabled={!on}
                                                value={config.pesos[b.nome] ?? 1}
                                                onChange={(e) =>
                                                    mudar({ pesos: { ...config.pesos, [b.nome]: Number(e.target.value) } })
                                                }
                                                className="w-16"
                                            />
                                        </label>
                                        <Selecao
                                            disabled={!on}
                                            value={config.cenarios[b.nome] ?? b.cenario_sugerido}
                                            onChange={(e) =>
                                                mudar({ cenarios: { ...config.cenarios, [b.nome]: e.target.value } })
                                            }
                                            className={on ? '' : 'opacity-40'}
                                        >
                                            {CENARIOS_DROPDOWN.map((c) => (
                                                <option key={c.valor} value={c.valor}>
                                                    {c.rotulo}
                                                </option>
                                            ))}
                                        </Selecao>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Recolhivel>
                )}

                <Recolhivel titulo="Mais opções" resumo={config.medirPesos ? 'com escala do Pawn' : undefined}>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Campo rotulo="Iterações (triagem)" dica="Primeira passada rápida que descarta o que perde com folga.">
                            <Numero min={50} value={config.itTriagem} onChange={(e) => mudar({ itTriagem: Number(e.target.value) })} />
                        </Campo>
                        <Campo rotulo="Iterações (refino)" dica="Medição final dos itens que sobraram.">
                            <Numero min={200} value={config.itRefino} onChange={(e) => mudar({ itRefino: Number(e.target.value) })} />
                        </Campo>
                        <Campo rotulo="Tempo máximo (s)">
                            <Numero min={30} value={config.orcamento} onChange={(e) => mudar({ orcamento: Number(e.target.value) })} />
                        </Campo>
                    </div>
                    <label className="mt-3 flex items-center gap-2 text-sm text-texto">
                        <input
                            type="checkbox"
                            checked={config.medirPesos}
                            onChange={(e) => mudar({ medirPesos: e.target.checked })}
                            className="h-4 w-4 accent-destaque"
                        />
                        Gerar escala do Pawn
                        <span className="text-xs text-texto-3">(mede os pesos de cada build com 5.000 iterações; demora)</span>
                    </label>
                </Recolhivel>
            </div>

            {estimativa && !rodando && estimativa.segundos_estimados > config.orcamento && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-aviso/40 bg-aviso/10 px-3 py-2 text-sm text-aviso">
                    <span className="flex-1">
                        A estimativa ({minutos(estimativa.segundos_estimados)}) passa do tempo máximo (
                        {minutos(config.orcamento)}): o ranking pararia no meio.
                    </span>
                    {estimativa.orcamento_sugerido && (
                        <Botao tamanho="sm" onClick={() => mudar({ orcamento: estimativa.orcamento_sugerido! })}>
                            Ajustar para {minutos(estimativa.orcamento_sugerido)}
                        </Botao>
                    )}
                </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-end gap-3 border-t border-borda pt-4">
                {estimativa && !rodando && (
                    <span className="text-sm text-texto-2">
                        <span className="num text-texto">{minutos(estimativa.segundos_estimados)}</span> estimados ·{' '}
                        {estimativa.elegiveis_total} itens
                    </span>
                )}
                {rodando ? (
                    <Botao variante="perigo" icone={<XCircle className="w-4 h-4" />} onClick={onCancelar}>
                        Cancelar
                    </Botao>
                ) : (
                    <Botao
                        variante="principal"
                        icone={<Play className="w-4 h-4" />}
                        carregando={criando}
                        disabled={!podeRodar}
                        onClick={onRodar}
                    >
                        Rodar ranking
                    </Botao>
                )}
            </div>
        </Cartao>
    );
};
