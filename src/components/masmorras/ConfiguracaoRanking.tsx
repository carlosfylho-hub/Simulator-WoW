import React from 'react';
import { BookOpen, Play, RotateCcw, XCircle } from 'lucide-react';
import { BuildDisponivel, ESCADA, ILVL_FORJA, RankingEstimativa } from '../../services/masmorrasService';
import { CENARIOS_DROPDOWN, DESCRICAO_CENARIO } from '../../data/scenarios';
import { Botao, Campo, Cartao, Numero, Recolhivel, Segmentado, Selecao } from '../../ui';
import { InfoTip } from '../InfoTip';

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
    forcarTier: boolean;
    trilhaTier: 'heroi' | 'mito';
    rankTier: number;
}

/** Limites aceitos pelo servidor (masmorras/modelos.py) e valores recomendados. */
export const LIMITES = {
    itTriagem: { min: 50, max: 5_000, padrao: 300 },
    itRefino: { min: 200, max: 50_000, padrao: 3_000 },
    orcamento: { min: 30, max: 86_400, padrao: 900 },
} as const;

/** Problemas da configuração, por campo (vazio = pode rodar). */
export function problemasDaConfig(c: Config): Partial<Record<keyof typeof LIMITES, string>> {
    const saida: Partial<Record<keyof typeof LIMITES, string>> = {};
    (Object.keys(LIMITES) as (keyof typeof LIMITES)[]).forEach((k) => {
        const v = c[k];
        const { min, max } = LIMITES[k];
        if (!Number.isFinite(v) || v < min) saida[k] = `Mínimo ${min.toLocaleString('pt-BR')}.`;
        else if (v > max) saida[k] = `Máximo ${max.toLocaleString('pt-BR')}.`;
    });
    if (!saida.itRefino && !saida.itTriagem && c.itRefino < c.itTriagem) {
        saida.itRefino = 'O refino deve ter mais iterações que a triagem (é a medição precisa).';
    }
    return saida;
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

const Ajuda: React.FC<{ children: React.ReactNode; erro?: string }> = ({ children, erro }) => (
    <span className={`text-xs leading-snug ${erro ? 'text-perda' : 'text-texto-3'}`}>{erro ?? children}</span>
);

const GuiaRapido: React.FC<{ modo: Config['modo'] }> = ({ modo }) => (
    <div className="space-y-3 text-sm leading-relaxed text-texto-2">
        <p>
            <strong className="text-texto">O que esta tela faz.</strong>{' '}
            {modo === 'craft'
                ? 'Testa, no SimulationCraft, cada peça que você pode craftar com cada missiva (par de secundários) e depois cada embelezamento, e diz o que rende mais para o seu personagem.'
                : modo === 'cofre'
                  ? 'Pega as opções do seu Grande Cofre (do export do AMR), coloca cada uma no seu personagem e mede no SimulationCraft quanto de dano cada uma ganha.'
                  : 'Pega os itens que cada masmorra pode dropar para a sua classe, coloca cada um no seu personagem e mede no SimulationCraft quanto de dano ele ganha. A masmorra com mais itens que servem (ou com o maior ganho) é onde vale usar o bônus roll.'}
        </p>
        <p>
            <strong className="text-texto">Como a medição funciona (triagem e refino).</strong> O simulador "luta" várias
            vezes e tira a média: cada luta é uma <em>iteração</em>. Mais iterações = número mais preciso, porém mais
            lento. Para economizar tempo ele mede em duas etapas: a <em>triagem</em> testa todos os itens com poucas
            iterações e descarta os que claramente pioram; o <em>refino</em> mede só os melhores com muitas iterações.
        </p>
        <p>
            <strong className="text-texto">Margem de erro.</strong> Diferenças menores que a margem (normalmente 0,15%)
            aparecem em cinza: é empate, não vale trocar por isso.
        </p>
        <p>
            <strong className="text-texto">Configuração recomendada.</strong> Triagem 300, refino 3.000, e o tempo máximo
            que a estimativa sugerir. Para um teste rápido: triagem 100 e refino 1.000 (menos preciso).
        </p>
    </div>
);

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
    // O modo Craft mede só a build atual: as builds marcadas não valem aqui.
    const marcadas =
        config.modo === 'craft' ? [] : config.builds.filter((b) => buildsDisponiveis.some((d) => d.nome === b));
    const problemas = problemasDaConfig(config);
    const temProblema = Object.keys(problemas).length > 0;
    const alternar = (nome: string) =>
        mudar({
            builds: config.builds.includes(nome)
                ? config.builds.filter((n) => n !== nome)
                : [...config.builds, nome].slice(0, 6),
        });
    const restaurar = () =>
        mudar({
            itTriagem: LIMITES.itTriagem.padrao,
            itRefino: LIMITES.itRefino.padrao,
            orcamento: LIMITES.orcamento.padrao,
        });

    return (
        <Cartao>
            <div className="mb-4 border-b border-borda pb-3">
                <Recolhivel
                    titulo={
                        <span className="inline-flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" /> Como configurar
                        </span>
                    }
                    resumo="o que cada opção faz"
                >
                    <GuiaRapido modo={config.modo} />
                </Recolhivel>
            </div>

            {config.modo === 'masmorras' && (
                <div className="mb-4 grid gap-4 sm:grid-cols-3">
                    <Campo
                        rotulo="Trilha"
                        dica="Herói = itens das chaves mais baixas (até 321 no 6/6). Mítico = chaves altas e Grande Cofre (até 334 no 6/6). Escolha a trilha em que o item vai cair na chave que você vai fazer."
                    >
                        <Segmentado<'heroi' | 'mito'>
                            rotuloAria="Trilha"
                            opcoes={[
                                { valor: 'heroi', rotulo: 'Herói' },
                                { valor: 'mito', rotulo: 'Mítico' },
                            ]}
                            valor={config.trilha}
                            onChange={(trilha) => mudar({ trilha })}
                        />
                        <Ajuda>Em que trilha o item do bônus roll vai cair.</Ajuda>
                    </Campo>
                    <Campo
                        rotulo="Rank"
                        dica="Em que ponto da trilha o item chega (1/6 a 6/6). Ex.: Mítico 2/6 = nível 321. Para comparar o potencial máximo do item, use 6/6. O resultado mostra quantos brasões faltam para chegar ao 6/6."
                    >
                        <Selecao
                            value={config.rank}
                            onChange={(e) => {
                                const rank = Number(e.target.value);
                                mudar({ rank, forja: rank === 6 ? config.forja : false });
                            }}
                        >
                            {ESCADA[config.trilha].map((ilvl, i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}/6 · nível {ilvl}
                                </option>
                            ))}
                        </Selecao>
                        <Ajuda>Nível com que o item é medido.</Ajuda>
                    </Campo>
                    <Campo
                        rotulo="Forja do Veneno"
                        dica="Melhoria extra que só existe no 6/6 (Herói vai a 328, Mítico a 341). Marque se você vai forjar o item."
                    >
                        <label
                            className={`flex h-9 items-center gap-2 text-sm ${config.rank === 6 ? 'text-texto' : 'text-texto-3'}`}
                        >
                            <input
                                type="checkbox"
                                disabled={config.rank !== 6}
                                checked={config.forja && config.rank === 6}
                                onChange={(e) => mudar({ forja: e.target.checked })}
                                className="h-4 w-4 accent-destaque"
                            />
                            Forjar <span className="num text-texto-3">(nível {ILVL_FORJA[config.trilha]})</span>
                        </label>
                        <Ajuda>{config.rank === 6 ? 'Só vale no 6/6.' : 'Disponível só no rank 6/6.'}</Ajuda>
                    </Campo>
                </div>
            )}

            {config.modo === 'masmorras' && (
                <div className="mb-4 grid gap-4 border-t border-borda pt-3 sm:grid-cols-3">
                    <Campo
                        rotulo="Forçar tier set"
                        dica="Igual ao 'Force Tier Set' do AMR: o simulador monta um plano para você chegar a 4 peças de tier (bônus de 2 e 4 peças), escolhendo quais itens de masmorra levar ao Catalisador. Mede cada combinação inteira no simc e coloca no topo as masmorras que dão as peças do melhor plano."
                    >
                        <label className="flex h-9 items-center gap-2 text-sm text-texto">
                            <input
                                type="checkbox"
                                checked={config.forcarTier}
                                disabled={marcadas.length > 0}
                                onChange={(e) => mudar({ forcarTier: e.target.checked })}
                                className="h-4 w-4 accent-destaque"
                            />
                            Sempre buscar 4 peças
                        </label>
                        <Ajuda>
                            {marcadas.length > 0
                                ? 'Só funciona sem builds marcadas (desmarque em "Builds").'
                                : 'Útil para personagens secundários sem o set completo.'}
                        </Ajuda>
                    </Campo>
                    <Campo
                        rotulo="Trilha das peças de tier"
                        dica="Nível em que as peças que faltam vão ficar depois de catalisadas. Herói se você vai catalisar itens de chaves mais baixas (ex.: um secundário); Mítico se já pega itens de chave alta. Pode ser diferente da trilha dos outros itens."
                    >
                        <Segmentado<'heroi' | 'mito'>
                            rotuloAria="Trilha do tier"
                            opcoes={[
                                { valor: 'heroi', rotulo: 'Herói' },
                                { valor: 'mito', rotulo: 'Mítico' },
                            ]}
                            valor={config.trilhaTier}
                            onChange={(trilhaTier) => config.forcarTier && mudar({ trilhaTier })}
                        />
                        <Ajuda>{config.forcarTier ? 'Trilha das peças catalisadas.' : 'Marque "Forçar tier set" para usar.'}</Ajuda>
                    </Campo>
                    <Campo rotulo="Rank das peças de tier" dica="Em que ponto da trilha as peças de tier são medidas. 6/6 mostra o potencial máximo.">
                        <Selecao
                            value={config.rankTier}
                            disabled={!config.forcarTier}
                            onChange={(e) => mudar({ rankTier: Number(e.target.value) })}
                        >
                            {ESCADA[config.trilhaTier].map((ilvl, i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}/6 · nível {ilvl}
                                </option>
                            ))}
                        </Selecao>
                        <Ajuda>Nível com que o tier é medido.</Ajuda>
                    </Campo>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
                <Campo
                    rotulo="Cenário"
                    dica={
                        <>
                            <span className="block mb-1">Tipo de luta simulada. Muda quais atributos e itens rendem mais.</span>
                            {DESCRICAO_CENARIO[config.scenario]}
                            {marcadas.length > 0 && (
                                <span className="block mt-1">Com builds marcadas, cada build usa o cenário escolhido na lista dela.</span>
                            )}
                        </>
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
                    <Ajuda>
                        {marcadas.length > 0 ? 'Definido por build (abra "Builds").' : 'M+ e delves: Dungeon Slice. Chefe único: Patchwerk.'}
                    </Ajuda>
                </Campo>
            </div>

            <div className="mt-4 space-y-3 border-t border-borda pt-3">
                {config.modo !== 'craft' && (
                    <Recolhivel
                        titulo="Builds"
                        resumo={marcadas.length ? `${marcadas.length} marcada(s)` : 'só a build atual'}
                    >
                        {buildsDisponiveis.length === 0 ? (
                            <p className="text-sm text-texto-3">
                                O export do SimC não tem builds salvas. No jogo, salve as árvores de talento (loadouts) e
                                faça o /simc de novo.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-xs leading-snug text-texto-3">
                                    Marque as builds de talento que você joga. Cada uma é medida separadamente e o ranking
                                    usa a média. Cada build marcada é uma rodada inteira a mais (o tempo multiplica).
                                </p>
                                <div className="flex items-center gap-3 text-xs font-medium text-texto-3">
                                    <span className="w-48">Build</span>
                                    <span className="flex w-24 items-center gap-1">
                                        Peso
                                        <InfoTip titulo="Peso">
                                            Quanto essa build conta na média. Ex.: m+ peso 3 e raide peso 1 = o m+ vale 75%
                                            do resultado. Use o quanto você joga cada uma.
                                        </InfoTip>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        Cenário
                                        <InfoTip titulo="Cenário da build">
                                            Tipo de luta usado para medir essa build. Builds de "single/raid" usam Patchwerk
                                            (chefe único); as de M+/delves usam Dungeon Slice.
                                        </InfoTip>
                                    </span>
                                </div>
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
                                                    {b.nome === 'Atual' ? 'Atual (a equipada agora)' : b.nome}
                                                </span>
                                            </label>
                                            <Numero
                                                min={0}
                                                disabled={!on}
                                                aria-label={`Peso de ${b.nome}`}
                                                value={config.pesos[b.nome] ?? 1}
                                                onChange={(e) =>
                                                    mudar({ pesos: { ...config.pesos, [b.nome]: Math.max(0, Number(e.target.value)) } })
                                                }
                                                className={`w-24 ${on ? '' : 'opacity-40'}`}
                                            />
                                            <Selecao
                                                disabled={!on}
                                                aria-label={`Cenário de ${b.nome}`}
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

                <Recolhivel
                    titulo="Mais opções"
                    resumo={temProblema ? 'há valores inválidos' : config.medirPesos ? 'com escala do Pawn' : 'precisão e tempo'}
                    abertoInicial={temProblema}
                >
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Campo
                            rotulo="Iterações (triagem)"
                            dica="Quantas lutas por item na primeira passada, que só serve para descartar o que claramente piora. Recomendado: 300. Mínimo 50."
                        >
                            <Numero
                                min={LIMITES.itTriagem.min}
                                max={LIMITES.itTriagem.max}
                                value={config.itTriagem}
                                onChange={(e) => mudar({ itTriagem: Number(e.target.value) })}
                                className={problemas.itTriagem ? 'border-perda' : ''}
                            />
                            <Ajuda erro={problemas.itTriagem}>Passada rápida em todos os itens. Padrão 300.</Ajuda>
                        </Campo>
                        <Campo
                            rotulo="Iterações (refino)"
                            dica="Quantas lutas por item na medição final, feita só nos melhores da triagem. É ela que define a precisão do resultado. Recomendado: 3.000. Mínimo 200."
                        >
                            <Numero
                                min={LIMITES.itRefino.min}
                                max={LIMITES.itRefino.max}
                                value={config.itRefino}
                                onChange={(e) => mudar({ itRefino: Number(e.target.value) })}
                                className={problemas.itRefino ? 'border-perda' : ''}
                            />
                            <Ajuda erro={problemas.itRefino}>Medição precisa dos melhores. Padrão 3.000.</Ajuda>
                        </Campo>
                        <Campo
                            rotulo="Tempo máximo (segundos)"
                            dica="Limite de segurança: se a simulação passar disso, ela para (guardando as builds já prontas). Use a sugestão da estimativa. 900 s = 15 min."
                        >
                            <Numero
                                min={LIMITES.orcamento.min}
                                max={LIMITES.orcamento.max}
                                value={config.orcamento}
                                onChange={(e) => mudar({ orcamento: Number(e.target.value) })}
                                className={problemas.orcamento ? 'border-perda' : ''}
                            />
                            <Ajuda erro={problemas.orcamento}>
                                {`= ${Math.round(config.orcamento / 60)} min. Para tudo se passar disso.`}
                            </Ajuda>
                        </Campo>
                    </div>
                    <label className="mt-4 flex items-start gap-2 text-sm text-texto">
                        <input
                            type="checkbox"
                            checked={config.medirPesos}
                            onChange={(e) => mudar({ medirPesos: e.target.checked })}
                            className="mt-0.5 h-4 w-4 accent-destaque"
                        />
                        <span>
                            Gerar escala do Pawn
                            <span className="block text-xs text-texto-3">
                                Mede quanto vale cada atributo (Intelecto, Aceleração…) para cada build e gera a string para
                                colar no addon Pawn, que mostra setinhas de upgrade nos itens dentro do jogo. Usa 5.000
                                iterações por build: soma alguns minutos.
                            </span>
                        </span>
                    </label>
                    <button
                        type="button"
                        onClick={restaurar}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-info hover:underline"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Voltar aos valores recomendados
                    </button>
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
                {temProblema && <span className="text-sm text-perda">Corrija os valores em "Mais opções".</span>}
                {estimativa && !rodando && !temProblema && (
                    <span className="text-sm text-texto-2" title="Calculado com a velocidade medida do simc nesta máquina">
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
                        disabled={!podeRodar || temProblema}
                        onClick={onRodar}
                    >
                        {config.modo === 'craft' ? 'Rodar craft' : 'Rodar ranking'}
                    </Botao>
                )}
            </div>
        </Cartao>
    );
};
