import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Gauge, Loader2, Play, Swords, XCircle } from 'lucide-react';
import {
    ItemRanking,
    MasmorraRanking,
    RankingEstimativa,
    RankingJob,
    RankingResult,
    ROTULO_ETIQUETA,
    cancelarRanking,
    consultarRanking,
    criarRanking,
    estimativaRanking,
    resultadoRanking,
} from '../services/masmorrasService';
import { carregarImportLocal, carregarImportRemoto, salvarImport } from '../services/simcStorage';
import {
    assinarAmrLocal,
    carregarAmrLocal,
    carregarAmrRemoto,
    salvarAmrLocal,
} from '../services/amrStorage';
import { CENARIOS_DROPDOWN, DESCRICAO_CENARIO } from '../data/scenarios';
import { SimulationProgressBar } from './SimulationProgressBar';
import { usePersistedState } from '../services/persistedState';
import { useItemTooltip } from '../context/TooltipContext';
import { getItemById, getItemIconUrl, getItemQualityBorder } from '../data/items';

interface Props {
    scenario: string;
    setScenario?: (cenario: string) => void;
}

const pct = (valor: number | null | undefined) =>
    valor == null
        ? '—'
        : `${valor >= 0 ? '+' : ''}${valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;

const terminado = (status: string) => ['done', 'error', 'cancelled'].includes(status);

const iconeDoItem = (item: ItemRanking): string =>
    item.icone
        ? `https://wow.zamimg.com/images/wow/icons/medium/${item.icone}.jpg`
        : getItemIconUrl(getItemById(item.item_id ?? -1));

const bordaDoItem = (item: ItemRanking): string =>
    getItemQualityBorder(getItemById(item.item_id ?? -1));

const nomeDoItem = (item: ItemRanking): string =>
    item.nome_pt || item.nome_en || (item.item_id != null ? `#${item.item_id}` : '—');

const corEtiqueta = (etiqueta: string): string => {
    if (etiqueta === 'direto' || etiqueta === 'ambos') return 'text-emerald-300';
    if (etiqueta === 'catalisar') return 'text-amber-300';
    return 'text-zinc-500';
};

const ganhoDe = (item: ItemRanking): number =>
    Math.max(item.delta_cru_pct, item.delta_catalisado_pct ?? item.delta_cru_pct);

export const MasmorrasPanel: React.FC<Props> = ({ scenario, setScenario }) => {
    const [addon, setAddon] = useState<string>(() => carregarImportLocal() || '');
    const [amr, setAmr] = useState<string>(() => carregarAmrLocal() || '');
    const [primario, setPrimario] = usePersistedState<'simc' | 'amr'>('wowsim.masmorras.primario', 'simc');
    const [modo, setModo] = usePersistedState<'masmorras' | 'cofre'>('wowsim.masmorras.modo', 'masmorras');
    const [ilvl, setIlvl] = usePersistedState<number>('wowsim.masmorras.ilvl', 341);
    const [itTriage, setItTriage] = usePersistedState<number>('wowsim.masmorras.itTriage', 300);
    const [itRefino, setItRefino] = usePersistedState<number>('wowsim.masmorras.itRefino', 3000);
    const [orcamento, setOrcamento] = usePersistedState<number>('wowsim.masmorras.orcamento', 900);
    const [ordem, setOrdem] = useState<'quantidade' | 'maior'>('quantidade');
    const [abertas, setAbertas] = useState<Set<string>>(new Set());
    const [job, setJob] = useState<RankingJob | null>(null);
    const [resultado, setResultado] = useState<RankingResult | null>(null);
    const [estimativa, setEstimativa] = useState<RankingEstimativa | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [estimando, setEstimando] = useState(false);
    const pollingRef = useRef<number | null>(null);
    const { showTooltip, hideTooltip } = useItemTooltip();

    useEffect(() => {
        if (!addon) return;
        const timer = window.setTimeout(() => salvarImport(addon), 600);
        return () => window.clearTimeout(timer);
    }, [addon]);

    useEffect(() => {
        if (!amr) return;
        const timer = window.setTimeout(() => salvarAmrLocal(amr), 600);
        return () => window.clearTimeout(timer);
    }, [amr]);

    useEffect(
        () =>
            assinarAmrLocal((texto) => {
                setAmr((atual) => ((texto ?? '') === atual ? atual : texto ?? ''));
            }),
        [],
    );

    useEffect(() => {
        if (primario === 'amr' && amr.trim().length < 20) setPrimario('simc');
    }, [amr, primario]);

    useEffect(() => {
        let ativo = true;
        if (!addon) {
            carregarImportRemoto().then((texto) => {
                if (ativo && texto) setAddon(texto);
            });
        }
        if (!amr) {
            carregarAmrRemoto().then((texto) => {
                if (ativo && texto) setAmr((atual) => atual || texto);
            });
        }
        return () => {
            ativo = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!job || terminado(job.status)) {
            if (pollingRef.current) {
                window.clearTimeout(pollingRef.current);
                pollingRef.current = null;
            }
            return;
        }
        let ativo = true;
        let atraso = 1000;
        const agendar = () => {
            pollingRef.current = window.setTimeout(async () => {
                if (!ativo) return;
                try {
                    const atual = await consultarRanking(job.id);
                    setJob(atual);
                    if (atual.status === 'done') {
                        setResultado(await resultadoRanking(atual.id));
                    }
                    if (!terminado(atual.status)) {
                        atraso = Math.min(atraso + 500, 5000);
                        agendar();
                    }
                } catch (e: any) {
                    setErro(e?.message || 'Falha ao consultar o job.');
                }
            }, atraso);
        };
        agendar();
        return () => {
            ativo = false;
            if (pollingRef.current) {
                window.clearTimeout(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [job?.id, job?.status]);

    useEffect(() => {
        if (resultado) {
            setAbertas(new Set(resultado.masmorras.slice(0, 5).map((m) => m.masmorra)));
        }
    }, [resultado]);

    const estimar = async () => {
        setErro(null);
        setEstimando(true);
        try {
            setEstimativa(
                await estimativaRanking({
                    addon,
                    ilvl,
                    iteracoes_triagem: itTriage,
                    iteracoes_refino: itRefino,
                }),
            );
        } catch (e: any) {
            setErro(e?.message || 'Falha ao estimar.');
            setEstimativa(null);
        } finally {
            setEstimando(false);
        }
    };

    const iniciar = async () => {
        setErro(null);
        setResultado(null);
        setJob(null);
        setCarregando(true);
        try {
            const addonFinal =
                modo === 'cofre' && addon.trim().length < 20 ? amr : addon;
            const criado = await criarRanking({
                addon: addonFinal,
                amr: amr.trim() ? amr : null,
                primario: modo === 'cofre' && addonFinal === amr ? 'amr' : primario,
                modo,
                scenario,
                ilvl,
                iteracoes_triagem: itTriage,
                iteracoes_refino: itRefino,
                orcamento_segundos: orcamento,
            });
            setJob(await consultarRanking(criado.id));
        } catch (e: any) {
            setErro(e?.message || 'Falha ao criar o job.');
        } finally {
            setCarregando(false);
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

    const masmorrasOrdenadas = useMemo(() => {
        if (!resultado) return [] as MasmorraRanking[];
        const arr = [...resultado.masmorras];
        arr.sort((a, b) =>
            ordem === 'maior'
                ? b.maior_pct - a.maior_pct || b.servem - a.servem
                : b.servem - a.servem || b.maior_pct - a.maior_pct,
        );
        return arr;
    }, [resultado, ordem]);

    const ativo = job != null && !terminado(job.status);
    const semAddon =
        modo === 'cofre' ? amr.trim().length < 20 : addon.trim().length < 20;

    const alternar = (nome: string) =>
        setAbertas((atual) => {
            const novo = new Set(atual);
            if (novo.has(nome)) novo.delete(nome);
            else novo.add(nome);
            return novo;
        });

    return (
        <div className="space-y-6">
            <div className="p-5 rounded-xl border border-sky-700/50 bg-sky-950/20">
                <div className="flex items-center space-x-2">
                    <Swords className="w-5 h-5 text-sky-300" />
                    <div>
                        <h2 className="text-sm font-bold text-white">Ranking de Masmorras (M+)</h2>
                        <p className="text-[11px] text-zinc-400">
                            Quais masmorras dão o maior ganho medido pelo SimulationCraft. Aceita export do
                            <span className="font-mono text-sky-300"> /simc </span> ou do AskMrRobot.
                        </p>
                    </div>
                </div>

                <textarea
                    value={addon}
                    onChange={(e) => setAddon(e.target.value)}
                    placeholder="Cole aqui a saída do /simc (principal)"
                    className="mt-4 w-full h-40 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 p-3 focus:outline-none focus:border-sky-600"
                />

                <label className="mt-3 flex flex-col gap-1 text-[11px] text-zinc-400">
                    AskMrRobot (opcional — complementa com raça, .inv, .hlv e tuning de item)
                    <textarea
                        value={amr}
                        onChange={(e) => setAmr(e.target.value)}
                        placeholder="$181;US;Azralon;Nome;..."
                        className="w-full h-20 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 p-3 focus:outline-none focus:border-sky-600"
                    />
                </label>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                    <span>Base (primário):</span>
                    <label className="inline-flex items-center gap-1">
                        <input type="radio" checked={primario === 'simc'} onChange={() => setPrimario('simc')} className="accent-sky-500" />
                        SimC
                    </label>
                    <label className={`inline-flex items-center gap-1 ${amr.trim().length < 20 ? 'opacity-50' : ''}`}>
                        <input
                            type="radio"
                            checked={primario === 'amr'}
                            onChange={() => setPrimario('amr')}
                            disabled={amr.trim().length < 20}
                            className="accent-sky-500"
                        />
                        AMR
                    </label>
                </div>

                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        Cenário
                        <select
                            value={scenario}
                            onChange={(e) => setScenario?.(e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        >
                            {CENARIOS_DROPDOWN.map((c) => (
                                <option key={c.valor} value={c.valor}>
                                    {c.rotulo}
                                </option>
                            ))}
                        </select>
                        <span className="text-[10px] text-zinc-500 leading-snug">{DESCRICAO_CENARIO[scenario]}</span>
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        ilvl alvo
                        <select
                            value={ilvl}
                            onChange={(e) => setIlvl(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        >
                            {[321, 328, 334, 341].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        Iterações (triagem)
                        <input
                            type="number"
                            min={50}
                            value={itTriage}
                            onChange={(e) => setItTriage(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        />
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        Iterações (refino)
                        <input
                            type="number"
                            min={200}
                            value={itRefino}
                            onChange={(e) => setItRefino(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        />
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        Orçamento (s)
                        <input
                            type="number"
                            min={30}
                            value={orcamento}
                            onChange={(e) => setOrcamento(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        />
                    </label>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                    <span>Analisar:</span>
                    <button
                        onClick={() => setModo('masmorras')}
                        aria-pressed={modo === 'masmorras'}
                        className={`px-3 py-1.5 rounded-md transition-colors ${modo === 'masmorras' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-200'}`}
                    >
                        Masmorras M+
                    </button>
                    <button
                        onClick={() => setModo('cofre')}
                        aria-pressed={modo === 'cofre'}
                        className={`px-3 py-1.5 rounded-md transition-colors ${modo === 'cofre' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-200'}`}
                    >
                        Grande Cofre (.gv)
                    </button>
                </div>

                {modo === 'masmorras' && estimativa && (
                    <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-[11px]">
                        <span className="text-zinc-400">Estimativa: </span>
                        <span className="text-zinc-200 font-mono">
                            ~{estimativa.profilesets_total_estimado} profilesets · ~
                            {Math.round(estimativa.segundos_estimados)} s
                        </span>
                        <span className="ml-2 text-zinc-500">
                            {estimativa.elegiveis_total} itens elegíveis
                        </span>
                    </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {modo === 'masmorras' && (
                        <button
                            onClick={estimar}
                            disabled={semAddon || estimando}
                            className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 disabled:opacity-50 text-zinc-200 text-sm transition"
                        >
                            {estimando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gauge className="w-4 h-4" />}
                            <span>Estimar</span>
                        </button>
                    )}
                    <button
                        onClick={iniciar}
                        disabled={semAddon || carregando || ativo}
                        className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-semibold transition"
                    >
                        {carregando || ativo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        <span>{ativo ? 'Rodando...' : 'Iniciar ranking'}</span>
                    </button>
                    {ativo && (
                        <button
                            onClick={cancelar}
                            className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-rose-800 text-rose-300 hover:bg-rose-950/40 text-sm transition"
                        >
                            <XCircle className="w-4 h-4" />
                            <span>Cancelar</span>
                        </button>
                    )}
                    <span className="text-[11px] text-zinc-500">
                        {job ? `job ${job.id.slice(0, 8)} · ${job.status}` : 'sem job ativo'}
                    </span>
                </div>

                {erro && (
                    <div className="mt-3 flex items-start space-x-2 text-sm text-rose-300 bg-rose-950/50 border border-rose-800 rounded-lg p-3">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{erro}</span>
                    </div>
                )}
            </div>

            {(job?.progresso || job?.status === 'running') && (
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                    <div className="flex items-center space-x-2 text-sm text-zinc-200">
                        <Gauge className="w-4 h-4 text-sky-300" />
                        <span className="font-semibold">Progresso</span>
                        <span className="text-zinc-500">{job?.progresso?.estagio ?? 'medição'}</span>
                    </div>
                    {job && (
                        <SimulationProgressBar
                            ativo={!terminado(job.status)}
                            startedAt={job.started_at}
                            orcamentoSegundos={orcamento}
                        />
                    )}
                </div>
            )}

            {resultado && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-sm font-bold text-white">
                            Ranking — base {Math.round(resultado.base_dps).toLocaleString('pt-BR')} DPS
                        </h3>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setOrdem('quantidade')}
                                aria-pressed={ordem === 'quantidade'}
                                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${ordem === 'quantidade' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-200'
                                    }`}
                            >
                                Mais itens que servem
                            </button>
                            <button
                                onClick={() => setOrdem('maior')}
                                aria-pressed={ordem === 'maior'}
                                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${ordem === 'maior' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-200'
                                    }`}
                            >
                                Maior ganho de um item
                            </button>
                        </div>
                    </div>

                    {masmorrasOrdenadas.map((masmorra, posicao) => {
                        const aberta = abertas.has(masmorra.masmorra);
                        const maxGanho = Math.max(...masmorra.itens.map(ganhoDe), 0.001);
                        return (
                            <div key={masmorra.masmorra} className="p-4 rounded-xl border border-emerald-800/40 bg-emerald-950/10">
                                <button
                                    onClick={() => alternar(masmorra.masmorra)}
                                    className="w-full flex items-center justify-between text-left"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-zinc-500 font-mono text-xs">#{posicao + 1}</span>
                                        <span className="text-sm font-semibold text-white">{masmorra.masmorra}</span>
                                        <span className="text-[11px] text-zinc-400">
                                            {masmorra.servem} de {masmorra.elegiveis} itens servem · chance {masmorra.chance_pct.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
                                        </span>
                                    </span>
                                    <span className="text-[11px] text-zinc-400 font-mono">
                                        {masmorra.servem} servem · maior {pct(masmorra.maior_pct)}
                                    </span>
                                </button>

                                {aberta && (
                                    <div className="mt-3 space-y-1.5">
                                        {masmorra.itens.map((item) => {
                                            const ganho = ganhoDe(item);
                                            const largura = Math.max(2, Math.round((Math.abs(ganho) / maxGanho) * 100));
                                            return (
                                                <div key={`${item.item_id}-${item.slot}`} className="flex items-center gap-2 text-xs">
                                                    <span
                                                        className="inline-flex items-center space-x-2 cursor-help shrink-0 w-56"
                                                        onMouseEnter={(e) =>
                                                            showTooltip(item.item_id, e, {
                                                                slot: item.slot,
                                                                itemPt: item.nome_pt ?? undefined,
                                                                itemEn: item.nome_en ?? undefined,
                                                                ilvl: item.ilvl ?? undefined,
                                                                icon: item.icone ?? undefined,
                                                                stats: item.stats ?? undefined,
                                                            })
                                                        }
                                                        onMouseLeave={hideTooltip}
                                                    >
                                                        <img
                                                            src={iconeDoItem(item)}
                                                            alt=""
                                                            loading="lazy"
                                                            className={`h-6 w-6 shrink-0 rounded border ${bordaDoItem(item)}`}
                                                        />
                                                        <span className="truncate">{nomeDoItem(item)}</span>
                                                    </span>
                                                    <div className="flex-1 h-2 rounded bg-zinc-800/70 overflow-hidden">
                                                        <div
                                                            className={`h-full ${ganho > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                            style={{ width: `${largura}%` }}
                                                        />
                                                    </div>
                                                    <span className="w-44 text-right font-semibold text-zinc-200">
                                                        {pct(item.delta_cru_pct)}
                                                        {item.delta_catalisado_pct != null && (
                                                            <span className="text-amber-300">
                                                                {' '}· cat {pct(item.delta_catalisado_pct)}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className={`w-64 text-right ${corEtiqueta(item.etiqueta)}`}>
                                                        {ROTULO_ETIQUETA[item.etiqueta]}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        <p className="pt-1 text-[11px] text-zinc-500">{masmorra.explicacao}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <p className="text-[11px] text-zinc-500 border-t border-zinc-900 pt-3">
                        {resultado.premissa_chance}
                    </p>

                    {resultado.avisos.length > 0 && (
                        <ul className="text-xs text-amber-300 space-y-1">
                            {resultado.avisos.map((aviso, indice) => (
                                <li key={indice}>• {aviso}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {job?.status === 'error' && job.erro && (
                <div className="p-4 rounded-xl border border-rose-800 bg-rose-950/30 text-sm text-rose-200">
                    {job.erro}
                </div>
            )}
        </div>
    );
};
