import React, { useEffect, useRef, useState } from 'react';
import {
    BuildDisponivel,
    RankingEstimativa,
    RankingJob,
    RankingResult,
    cancelarRanking,
    consultarRanking,
    criarRanking,
    estimativaRanking,
    listarBuilds,
    resultadoRanking,
} from '../services/masmorrasService';
import { usePerfil } from '../context/PerfilContext';
import { usePersistedState } from '../services/persistedState';
import { SimulationProgressBar } from './SimulationProgressBar';
import { Aviso, Botao, Cartao, Segmentado } from '../ui';
import { Config, ConfiguracaoRanking } from './masmorras/ConfiguracaoRanking';
import { ResultadoRanking } from './masmorras/ResultadoRanking';
import { PorBuild } from './masmorras/PorBuild';
import { LevarParaOJogo } from './masmorras/LevarParaOJogo';

interface Props {
    scenario: string;
    setScenario?: (cenario: string) => void;
    /** Job do Histórico para abrir em modo leitura. */
    abrirJob?: string | null;
    onJobAberto?: () => void;
    irParaPerfil?: () => void;
}

const terminado = (status: string) => ['done', 'error', 'cancelled'].includes(status);

const PADRAO: Omit<Config, 'scenario'> = {
    modo: 'masmorras',
    ilvl: 341,
    trilha: 'mito',
    rank: 6,
    forja: true,
    itTriagem: 300,
    itRefino: 3000,
    orcamento: 900,
    builds: [],
    pesos: {},
    cenarios: {},
    medirPesos: false,
};

/**
 * Ranking de masmorras (bônus roll) e Grande Cofre. Só orquestra estado e
 * polling; a apresentação está em ``./masmorras/*`` (docs/PLANO-REDESIGN-UI.md §5.3).
 */
export const MasmorrasPanel: React.FC<Props> = ({ scenario, setScenario, abrirJob, onJobAberto, irParaPerfil }) => {
    const perfil = usePerfil();
    const [salva, setSalva] = usePersistedState<Omit<Config, 'scenario'>>('wowsim.masmorras.config', PADRAO);
    const config: Config = { ...PADRAO, ...salva, scenario };
    const mudar = (p: Partial<Config>) => {
        const { scenario: novoCenario, ...resto } = p;
        if (novoCenario !== undefined) setScenario?.(novoCenario);
        if (Object.keys(resto).length) setSalva((atual) => ({ ...PADRAO, ...atual, ...resto }));
    };

    const [buildsDisp, setBuildsDisp] = useState<BuildDisponivel[]>([]);
    const [estimativa, setEstimativa] = useState<RankingEstimativa | null>(null);
    const [job, setJob] = useState<RankingJob | null>(null);
    const [resultado, setResultado] = useState<RankingResult | null>(null);
    const [modoResultado, setModoResultado] = useState<'masmorras' | 'cofre'>('masmorras');
    const [selo, setSelo] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [criando, setCriando] = useState(false);
    const pollingRef = useRef<number | null>(null);
    const resultadoRef = useRef<HTMLDivElement>(null);

    const temSimc = perfil.addon.trim().length >= 20;
    const temAmr = perfil.amr.trim().length >= 20;
    const podeRodar = config.modo === 'cofre' ? temAmr : temSimc;
    const buildsAtivas = config.builds.filter((n) => buildsDisp.some((b) => b.nome === n));
    const cenariosDasBuilds = buildsAtivas.map(
        (n) => config.cenarios[n] ?? buildsDisp.find((b) => b.nome === n)?.cenario_sugerido ?? 'dungeon_slice',
    );

    // Builds do export: lidas sozinhas quando o perfil muda.
    useEffect(() => {
        if (!temSimc) {
            setBuildsDisp([]);
            return;
        }
        const t = window.setTimeout(() => {
            listarBuilds(perfil.addon)
                .then((r) => setBuildsDisp(r.builds))
                .catch(() => setBuildsDisp([]));
        }, 500);
        return () => window.clearTimeout(t);
    }, [perfil.addon, temSimc]);

    // Estimativa automática (sem botão "Estimar").
    useEffect(() => {
        if (!podeRodar) {
            setEstimativa(null);
            return;
        }
        const t = window.setTimeout(() => {
            estimativaRanking({
                addon: temSimc ? perfil.addon : perfil.amr,
                ilvl: config.ilvl,
                trilha: config.trilha,
                rank: config.rank,
                forja: config.forja && config.rank === 6,
                iteracoes_triagem: config.itTriagem,
                iteracoes_refino: config.itRefino,
                modo: config.modo,
                amr: config.modo === 'cofre' ? perfil.amr : undefined,
                builds: buildsAtivas.length,
                medir_pesos: config.medirPesos,
                scenario: config.scenario,
                cenarios: cenariosDasBuilds,
            })
                .then(setEstimativa)
                .catch(() => setEstimativa(null));
        }, 800);
        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [podeRodar, perfil.addon, perfil.amr, config.modo, config.trilha, config.rank, config.forja, config.itTriagem, config.itRefino, config.scenario, cenariosDasBuilds.join(','), config.medirPesos]);

    // Polling do job em andamento.
    useEffect(() => {
        if (!job || terminado(job.status)) return;
        let ativo = true;
        let atraso = 1000;
        const agendar = () => {
            pollingRef.current = window.setTimeout(async () => {
                if (!ativo) return;
                try {
                    const atual = await consultarRanking(job.id);
                    setJob(atual);
                    if (atual.status === 'done') setResultado(await resultadoRanking(atual.id));
                    if (!terminado(atual.status)) {
                        atraso = Math.min(atraso + 500, 5000);
                        agendar();
                    }
                } catch (e: any) {
                    setErro(e?.message || 'Falha ao consultar o ranking.');
                }
            }, atraso);
        };
        agendar();
        return () => {
            ativo = false;
            if (pollingRef.current) window.clearTimeout(pollingRef.current);
        };
    }, [job?.id, job?.status]);

    // Abrir um resultado vindo do Histórico.
    useEffect(() => {
        if (!abrirJob) return;
        (async () => {
            try {
                const j = await consultarRanking(abrirJob);
                setJob(j);
                setModoResultado((j.request?.modo as 'masmorras' | 'cofre') ?? 'masmorras');
                setResultado(await resultadoRanking(abrirJob));
                setSelo(
                    j.created_at
                        ? `resultado de ${new Date(j.created_at).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                          })}`
                        : 'resultado do histórico',
                );
            } catch (e: any) {
                setErro(e?.message || 'Não foi possível abrir o resultado.');
            } finally {
                onJobAberto?.();
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [abrirJob]);

    // Ao terminar, leva a tela até a resposta.
    useEffect(() => {
        if (resultado && !selo) resultadoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [resultado, selo]);

    const rodar = async () => {
        setErro(null);
        setResultado(null);
        setSelo(null);
        setJob(null);
        setCriando(true);
        try {
            const addonFinal = config.modo === 'cofre' && !temSimc ? perfil.amr : perfil.addon;
            const criado = await criarRanking({
                addon: addonFinal,
                amr: temAmr ? perfil.amr : null,
                primario: config.modo === 'cofre' && !temSimc ? 'amr' : perfil.primario,
                modo: config.modo,
                scenario: config.scenario,
                ilvl: config.ilvl,
                trilha: config.trilha,
                rank: config.rank,
                forja: config.forja && config.rank === 6,
                iteracoes_triagem: config.itTriagem,
                iteracoes_refino: config.itRefino,
                orcamento_segundos: config.orcamento,
                loadouts: buildsAtivas,
                pesos_loadouts: Object.fromEntries(buildsAtivas.map((n) => [n, config.pesos[n] ?? 1])),
                cenarios_loadouts: Object.fromEntries(buildsAtivas.map((n, i) => [n, cenariosDasBuilds[i]])),
                medir_pesos: config.medirPesos,
            });
            setModoResultado(config.modo);
            setJob(await consultarRanking(criado.id));
        } catch (e: any) {
            setErro(e?.message || 'Falha ao iniciar o ranking.');
        } finally {
            setCriando(false);
        }
    };

    const cancelar = async () => {
        if (!job) return;
        try {
            await cancelarRanking(job.id);
            setJob(await consultarRanking(job.id));
        } catch (e: any) {
            setErro(e?.message || 'Falha ao cancelar.');
        }
    };

    const rodando = job != null && !terminado(job.status);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-texto">Masmorras</h1>
                    <p className="text-sm text-texto-2">
                        {config.modo === 'cofre'
                            ? 'Qual opção do Grande Cofre rende mais para o seu conjunto.'
                            : 'Em qual masmorra vale gastar o bônus roll.'}
                    </p>
                </div>
                <Segmentado
                    rotuloAria="O que analisar"
                    opcoes={[
                        { valor: 'masmorras', rotulo: 'Masmorras M+' },
                        { valor: 'cofre', rotulo: 'Grande Cofre' },
                    ]}
                    valor={config.modo}
                    onChange={(modo) => mudar({ modo })}
                />
            </div>

            {!perfil.temPerfil ? (
                <Aviso
                    tom="aviso"
                    acao={
                        irParaPerfil && (
                            <Botao variante="principal" tamanho="sm" onClick={irParaPerfil}>
                                Importar perfil
                            </Botao>
                        )
                    }
                >
                    Importe o export do /simc (e, se quiser, o do AMR) na aba Perfil.
                </Aviso>
            ) : config.modo === 'cofre' && !temAmr ? (
                <Aviso tom="aviso">O Grande Cofre vem do export do AMR (.gv). Cole-o na aba Perfil.</Aviso>
            ) : null}

            <ConfiguracaoRanking
                config={config}
                mudar={mudar}
                buildsDisponiveis={buildsDisp}
                estimativa={estimativa}
                rodando={rodando}
                podeRodar={podeRodar}
                criando={criando}
                onRodar={rodar}
                onCancelar={cancelar}
            />

            {erro && <Aviso tom="erro">{erro}</Aviso>}

            {rodando && job && (
                <Cartao>
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-texto">{job.progresso?.estagio ?? 'preparando'}</span>
                        <span className="text-xs text-texto-3">job {job.id.slice(0, 8)}</span>
                    </div>
                    <SimulationProgressBar ativo startedAt={job.started_at} orcamentoSegundos={config.orcamento} />
                </Cartao>
            )}

            {job?.status === 'error' && job.erro && <Aviso tom="erro">{job.erro}</Aviso>}
            {job?.status === 'cancelled' && <Aviso>Ranking cancelado.</Aviso>}

            {resultado && (
                <div ref={resultadoRef} className="space-y-5 scroll-mt-20">
                    <ResultadoRanking resultado={resultado} modo={modoResultado} selo={selo} />
                    <PorBuild resultado={resultado} />
                    <LevarParaOJogo key={job?.id ?? 'r'} resultado={resultado} />
                    <div className="space-y-1 text-xs text-texto-3">
                        <p>{resultado.premissa_chance}</p>
                        {resultado.avisos.map((a, i) => (
                            <p key={i} className="text-aviso">
                                • {a}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
