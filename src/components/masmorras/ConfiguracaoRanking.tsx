import React from 'react';
import { Play, XCircle } from 'lucide-react';
import { BuildDisponivel, RankingEstimativa } from '../../services/masmorrasService';
import { CENARIOS_DROPDOWN, DESCRICAO_CENARIO } from '../../data/scenarios';
import { Botao, Campo, Cartao, Numero, Recolhivel, Selecao } from '../../ui';

export interface Config {
    modo: 'masmorras' | 'cofre';
    ilvl: number;
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
            <div className="grid gap-4 sm:grid-cols-3">
                {config.modo === 'masmorras' && (
                    <Campo rotulo="Nível do item" dica="Nível com que o item cai na chave que você vai fazer.">
                        <Selecao value={config.ilvl} onChange={(e) => mudar({ ilvl: Number(e.target.value) })}>
                            {[321, 328, 334, 341].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </Selecao>
                    </Campo>
                )}
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
