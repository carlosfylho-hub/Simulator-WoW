import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertCircle,
    ArrowDownRight,
    ArrowUpRight,
    Download,
    Gauge,
    Loader2,
    MinusCircle,
    Play,
    Search,
    XCircle,
} from 'lucide-react';
import {
    DropCsvSalvo,
    DropEstimativa,
    DropJob,
    DropModo,
    DropRankingItem,
    DropResult,
    ROTULO_MODO,
    cancelarDrop,
    consultarDrop,
    criarDrop,
    estimativaDrop,
    resultadoDrop,
    salvarCsvDrop,
} from '../services/dropService';
import {
    carregarImportLocal,
    carregarImportRemoto,
    salvarImport,
} from '../services/simcStorage';
import { assinarAmrLocal, carregarAmrLocal, carregarAmrRemoto, salvarAmrLocal } from '../services/amrStorage';
import { CombinacaoResultado, validarCombinacao } from '../services/combinarService';
import { CENARIOS_DROPDOWN, DESCRICAO_CENARIO } from '../data/scenarios';
import { SimulationProgressBar } from './SimulationProgressBar';
import { InfoTip } from './InfoTip';
import { usePersistedState } from '../services/persistedState';
import { useItemTooltip } from '../context/TooltipContext';
import { getItemById, getItemIconUrl, getItemQualityBorder } from '../data/items';

interface Props {
    scenario: string;
    setScenario?: (cenario: string) => void;
}

const numero = (valor: number | null | undefined) =>
    valor == null ? '—' : valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

const pct = (valor: number | null | undefined) =>
    valor == null
        ? '—'
        : `${valor >= 0 ? '+' : ''}${valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;

const terminado = (status: string) => ['done', 'error', 'cancelled'].includes(status);

const ehAmr = (texto: string) => texto.trim().startsWith('$');

const iconeDoItem = (item: DropRankingItem): string =>
    item.icone
        ? `https://wow.zamimg.com/images/wow/icons/medium/${item.icone}.jpg`
        : getItemIconUrl(getItemById(item.item_id ?? -1));

const bordaDoItem = (item: DropRankingItem): string =>
    getItemQualityBorder(getItemById(item.item_id ?? -1));

const nomeDoItem = (item: DropRankingItem): string =>
    item.nome_pt || item.nome_en || (item.item_id != null ? `#${item.item_id}` : '—');

export const DroptimizerPanel: React.FC<Props> = ({ scenario, setScenario }) => {
    const [addon, setAddon] = useState<string>(() => carregarImportLocal() || '');
    const [amr, setAmr] = useState<string>(() => carregarAmrLocal() || '');
    const [primario, setPrimario] = usePersistedState<'simc' | 'amr'>('wowsim.drop.primario', 'simc');
    const [modo, setModo] = usePersistedState<DropModo>('wowsim.drop.modo', 'upgrade');
    const cenarioLocal = scenario;
    const [iteracoes, setIteracoes] = usePersistedState<number>('wowsim.drop.iteracoes', 200);
    const [orcamento, setOrcamento] = usePersistedState<number>('wowsim.drop.orcamento', 600);
    const [targetError, setTargetError] = usePersistedState<number>('wowsim.drop.targetError', 0.2);
    const [preset, setPreset] = usePersistedState<string>('wowsim.drop.preset', 'padrao');
    const aplicarPreset = (p: string) => {
        setPreset(p);
        if (p === 'rapido') { setIteracoes(200); setTargetError(0.5); setOrcamento(300); }
        else if (p === 'padrao') { setIteracoes(200); setTargetError(0.2); setOrcamento(600); }
        else if (p === 'preciso') { setIteracoes(2000); setTargetError(0.1); setOrcamento(1800); }
        else if (p === 'overnight') { setIteracoes(50000); setTargetError(0.02); setOrcamento(28800); }
    };
    const [pool, setPool] = usePersistedState<number>('wowsim.drop.pool', 12);
    const [incluirInv, setIncluirInv] = usePersistedState<boolean>('wowsim.drop.incluirInv', true);
    const [job, setJob] = useState<DropJob | null>(null);
    const [resultado, setResultado] = useState<DropResult | null>(null);

    useEffect(() => {
        if (!job) return;
        console.info(`[drop] ${job.id} status=${job.status}`, job.progresso ?? '');
    }, [job?.status, job?.progresso]);
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [validando, setValidando] = useState(false);
    const [combinacao, setCombinacao] = useState<CombinacaoResultado | null>(null);
    const [estimativa, setEstimativa] = useState<DropEstimativa | null>(null);
    const [salvandoCsv, setSalvandoCsv] = useState(false);
    const [csvSalvo, setCsvSalvo] = useState<DropCsvSalvo | null>(null);
    const [erroCsv, setErroCsv] = useState<string | null>(null);
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

    // AMR compartilhado entre abas: recarrega quando o outro painel altera.
    useEffect(
        () =>
            assinarAmrLocal((texto) => {
                setAmr((atual) => (texto ?? '') === atual ? atual : texto ?? '');
            }),
        [],
    );

    // P1-04: não permitir AMR como base sem uma string AMR válida.
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
        // A15: polling com backoff (1s → 5s), sem tempestade de requisições.
        let ativo = true;
        let atraso = 1000;
        const agendar = () => {
            pollingRef.current = window.setTimeout(async () => {
                if (!ativo) return;
                try {
                    const atual = await consultarDrop(job.id);
                    setJob(atual);
                    if (atual.status === 'done') {
                        setResultado(await resultadoDrop(atual.id));
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

    const validar = async () => {
        setErro(null);
        setValidando(true);
        try {
            setCombinacao(
                await validarCombinacao({
                    simc: addon,
                    amr: amr.trim() ? amr : null,
                    primario,
                    incluir_inv: incluirInv,
                }),
            );
        } catch (e: any) {
            setErro(e?.message || 'Falha ao validar a combinação.');
        } finally {
            setValidando(false);
        }
    };

    // P0: estimativa de custo visível antes do Run (debounced).
    useEffect(() => {
        if (addon.trim().length < 20) {
            setEstimativa(null);
            return;
        }
        const timer = window.setTimeout(async () => {
            try {
                setEstimativa(
                    await estimativaDrop({
                        addon,
                        pool,
                        iterations: iteracoes,
                        orcamento_segundos: orcamento,
                        target_error: targetError > 0 ? targetError : null,
                        max_profilesets_rodada: 300,
                    }),
                );
            } catch {
                setEstimativa(null);
            }
        }, 700);
        return () => window.clearTimeout(timer);
    }, [addon, pool, iteracoes, orcamento, targetError]);

    const iniciar = async () => {
        setErro(null);
        setResultado(null);
        setJob(null);
        setCsvSalvo(null);
        setErroCsv(null);
        setCarregando(true);
        try {
            const criado = await criarDrop({
                addon,
                amr: amr.trim() ? amr : null,
                primario,
                modo,
                scenario: cenarioLocal,
                iterations: iteracoes,
                orcamento_segundos: orcamento,
                target_error: targetError > 0 ? targetError : null,
                pool_por_slot: pool,
                incluir_inv: incluirInv,
            });
            setJob(await consultarDrop(criado.id));
        } catch (e: any) {
            setErro(e?.message || 'Falha ao criar o job.');
        } finally {
            setCarregando(false);
        }
    };

    const cancelar = async () => {
        if (!job) return;
        try {
            await cancelarDrop(job.id);
            setJob(await consultarDrop(job.id));
        } catch (e: any) {
            setErro(e?.message || 'Falha ao cancelar.');
        }
    };

    // O CSV é gravado pelo backend: a janela do app desktop não tem gerenciador
    // de download, e o link `blob:` que havia aqui não gerava arquivo nem erro.
    const baixarCsv = async () => {
        if (!job?.id || salvandoCsv) return;
        setSalvandoCsv(true);
        setErroCsv(null);
        setCsvSalvo(null);
        try {
            setCsvSalvo(await salvarCsvDrop(job.id));
        } catch (e: any) {
            setErroCsv(e?.message || 'Não foi possível salvar o CSV.');
        } finally {
            setSalvandoCsv(false);
        }
    };

    const mostraInv = useMemo(() => ehAmr(addon) || amr.trim().length > 0, [addon, amr]);
    const ativo = job != null && !terminado(job.status);
    const semAddon = addon.trim().length < 20;

    return (
        <div className="space-y-6">
            <div className="p-5 rounded-xl border border-sky-700/50 bg-sky-950/20">
                <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-sky-300" />
                    <div>
                        <h2 className="text-sm font-bold text-white">Droptimizer</h2>
                        <p className="text-[11px] text-zinc-400">
                            Ranking de trocas single-slot medido pelo SimulationCraft. Aceita export do
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
                        <input
                            type="radio"
                            checked={primario === 'simc'}
                            onChange={() => setPrimario('simc')}
                            className="accent-sky-500"
                        />
                        SimC
                    </label>
                    <label
                        className={`inline-flex items-center gap-1 ${amr.trim().length < 20 ? 'opacity-50' : ''}`}
                        title={amr.trim().length < 20 ? 'Cole um export AMR para usar como base' : undefined}
                    >
                        <input
                            type="radio"
                            checked={primario === 'amr'}
                            onChange={() => setPrimario('amr')}
                            disabled={amr.trim().length < 20}
                            className="accent-sky-500"
                        />
                        AMR
                    </label>
                    <span className="text-zinc-500">
                        equipado e talentos vêm do primário; o outro export complementa.
                    </span>
                </div>

                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1">
                            Modo
                            <InfoTip titulo="Modo do Droptimizer">Find Upgrade: procura no catálogo itens que superam o equipado. Best in Bags: monta o melhor conjunto usando itens da mochila. Worst in Bags: mostra os piores, útil para descartar.</InfoTip>
                        </span>
                        <select
                            value={modo}
                            onChange={(e) => setModo(e.target.value as DropModo)}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        >
                            {(Object.keys(ROTULO_MODO) as DropModo[]).map((chave) => (
                                <option key={chave} value={chave}>
                                    {ROTULO_MODO[chave]}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1">
                            Cenário
                            <InfoTip titulo="Cenário de combate">Define duração, adds, movimento e número de alvos. Escolher o cenário errado muda o ranking de itens. Ex.: Patchwerk = alvo único parado; DungeonSlice = puxadas de M+; Heavy Movement = muito movimento.</InfoTip>
                        </span>
                        <select
                            value={cenarioLocal}
                            onChange={(e) => {
                                setScenario?.(e.target.value);
                            }}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        >
                            {CENARIOS_DROPDOWN.map((c) => (
                                <option key={c.valor} value={c.valor}>
                                    {c.rotulo}
                                </option>
                            ))}
                        </select>
                        <span className="text-[10px] text-zinc-500 leading-snug">
                            {DESCRICAO_CENARIO[cenarioLocal]}
                        </span>
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1">
                            Preset
                            <InfoTip titulo="Preset de execução">Atalho que preenche Iterações, Erro-alvo e Orçamento de uma vez. Rápido = comparações rápidas; Padrão = equilíbrio; Preciso = mais iterações; Overnight = deixa rodando por horas para máxima precisão.</InfoTip>
                        </span>
                        <select
                            value={preset}
                            onChange={(e) => aplicarPreset(e.target.value)}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        >
                            <option value="rapido">Rápido — 200 it, erro 0,5%</option>
                            <option value="padrao">Padrão — 200 it, erro 0,2%</option>
                            <option value="preciso">Preciso — 2.000 it, erro 0,1%</option>
                            <option value="overnight">Overnight — 50.000 it, erro 0,02%</option>
                        </select>
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1">
                            Iterações
                            <InfoTip titulo="Iterações">Quantas lutas o SimC simula por rodada. Mais iterações = resultado mais estável (erro menor), mas mais tempo. Com Erro-alvo definido, o SimC pode parar antes.</InfoTip>
                        </span>
                        <input
                            type="number"
                            min={10}
                            value={iteracoes}
                            onChange={(e) => setIteracoes(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        />
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1">
                            Erro-alvo (%)
                            <InfoTip titulo="Erro-alvo">Margem de erro desejada no DPS. O SimC para quando o erro cai abaixo desse valor. 0 = sem limite (roda todas as iterações). Valores típicos: 0,1 a 0,5%.</InfoTip>
                        </span>
                        <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={targetError}
                            onChange={(e) => setTargetError(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        />
                        <span className="text-[10px] text-zinc-500 leading-snug">
                            0 = sem limite; menor = mais iterações/precisão.
                        </span>
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1">
                            Orçamento (s)
                            <InfoTip titulo="Orçamento de tempo">Tempo máximo, em segundos, que o job pode gastar. Ao estourar, o app encerra a busca e devolve o melhor resultado medido até ali. Overnight usa 28.800 s (8 h).</InfoTip>
                        </span>
                        <input
                            type="number"
                            min={1}
                            value={orcamento}
                            onChange={(e) => setOrcamento(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        />
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1">
                            Pool por slot (upgrade)
                            <InfoTip titulo="Pools de itens">Pool = conjunto de itens candidatos que o app testa por slot (cabeça, peito, anel…). "Pool por slot" é quantos itens por slot entram na busca no modo upgrade. As pools respeitam elegibilidade (tipo de armadura, arma, emblemas). Pools maiores = busca mais ampla, porém mais lenta.</InfoTip>
                        </span>
                        <input
                            type="number"
                            min={1}
                            value={pool}
                            onChange={(e) => setPool(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        />
                    </label>
                </div>

                {mostraInv && (
                    <label className="mt-3 flex items-center gap-2 text-[11px] text-zinc-400">
                        <input
                            type="checkbox"
                            checked={incluirInv}
                            onChange={(e) => setIncluirInv(e.target.checked)}
                            className="accent-sky-500"
                        />
                        Incluir itens do inventário AMR (.inv — bolsas/cofre) como possuídos
                    </label>
                )}

                {estimativa && (
                    <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-[11px]">
                        <span className="text-zinc-400">Estimativa: </span>
                        <span className="text-zinc-200 font-mono">
                            ~{estimativa.profilesets_total_estimado} candidatos · ~
                            {Math.round(estimativa.segundos_estimados)} s
                        </span>
                        {estimativa.target_error_ignorado && (
                            <span className="ml-2 text-amber-300">erro-alvo ignorado (lote grande)</span>
                        )}
                        {estimativa.excede_orcamento && (
                            <span className="ml-2 text-rose-300">
                                excede o orçamento de {orcamento} s
                            </span>
                        )}
                    </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                        onClick={iniciar}
                        disabled={semAddon || carregando || ativo}
                        className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-semibold transition"
                    >
                        {carregando || ativo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        <span>{ativo ? 'Rodando...' : 'Iniciar Droptimizer'}</span>
                    </button>
                    <button
                        onClick={validar}
                        disabled={semAddon || validando}
                        className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 disabled:opacity-50 text-zinc-200 text-sm transition"
                    >
                        {validando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        <span>Validar combinação</span>
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

            {combinacao && (
                <div className="p-4 rounded-xl border border-sky-800/50 bg-sky-950/20 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-zinc-200">
                        <Search className="w-4 h-4 text-sky-300" />
                        <span className="font-semibold">Combinação validada</span>
                        <span className="text-zinc-500">
                            {combinacao.classe ?? '—'} / {combinacao.spec ?? '—'}
                            {combinacao.raca ? ` · ${combinacao.raca}` : ''}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-zinc-400">
                        <span>Primário: <span className="text-zinc-100">{combinacao.primario}</span></span>
                        <span>Itens equipados: <span className="text-zinc-100">{combinacao.itens}</span></span>
                        <span>Possuídos: <span className="text-zinc-100">{combinacao.possuidos}</span></span>
                        <span>Talentos: <span className="text-zinc-100">{combinacao.talentos ? 'sim' : 'não'}</span></span>
                    </div>
                    <div className="text-[11px] text-zinc-500">Fontes: {combinacao.fontes.join(', ') || '—'}</div>
                    {combinacao.avisos.length > 0 && (
                        <ul className="text-[11px] text-amber-300 space-y-1">
                            {combinacao.avisos.map((aviso, indice) => (
                                <li key={indice}>• {aviso.detalhe}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {(job?.progresso || job?.status === 'running') && (
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                    <div className="flex items-center space-x-2 text-sm text-zinc-200">
                        <Gauge className="w-4 h-4 text-sky-300" />
                        <span className="font-semibold">Progresso</span>
                        <span className="text-zinc-500">
                            {job?.progresso?.candidatos != null ? `${job.progresso.candidatos} candidatos` : 'medição'}
                        </span>
                    </div>
                    {job && (
                        <SimulationProgressBar
                            ativo={!terminado(job.status)}
                            startedAt={job.started_at}
                            orcamentoSegundos={orcamento}
                        />
                    )}
                    <div className="mt-2 text-xs text-zinc-400">
                        Base DPS: <span className="text-zinc-100 font-semibold">{numero(job?.progresso?.base_dps)}</span>
                    </div>
                </div>
            )}

            {resultado && (
                <div className="p-5 rounded-xl border border-emerald-700/40 bg-emerald-950/10 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                            <Search className="w-5 h-5 text-emerald-300" />
                            <h3 className="text-sm font-bold text-white">
                                Ranking — {ROTULO_MODO[resultado.modo]}
                            </h3>
                        </div>
                        {resultado.itens.length > 0 && (
                            <button
                                onClick={baixarCsv}
                                disabled={salvandoCsv}
                                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-semibold text-white"
                            >
                                {salvandoCsv ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Download className="w-3.5 h-3.5" />
                                )}
                                <span>{salvandoCsv ? 'Salvando...' : 'Salvar CSV'}</span>
                            </button>
                        )}
                    </div>

                    {csvSalvo && (
                        <div className="text-[11px] text-emerald-300 bg-emerald-950/30 border border-emerald-800/60 rounded-lg px-3 py-2">
                            <span className="font-semibold">{csvSalvo.linhas} linhas salvas em</span>{' '}
                            <span className="font-mono break-all text-emerald-200">{csvSalvo.caminho}</span>
                        </div>
                    )}
                    {erroCsv && (
                        <div className="text-[11px] text-rose-300 bg-rose-950/30 border border-rose-800/60 rounded-lg px-3 py-2">
                            {erroCsv}
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                            <div className="text-[10px] uppercase text-zinc-500">Base</div>
                            <div className="text-lg font-bold text-zinc-100">{numero(resultado.base_dps)}</div>
                        </div>
                        <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                            <div className="text-[10px] uppercase text-zinc-500">Candidatos</div>
                            <div className="text-lg font-bold text-zinc-100">{resultado.itens.length}</div>
                        </div>
                        <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                            <div className="text-[10px] uppercase text-zinc-500">Iterações</div>
                            <div className="text-lg font-bold text-zinc-100">{numero(resultado.iterations)}</div>
                        </div>
                    </div>

                    {resultado.itens.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="text-zinc-500 text-left">
                                    <tr>
                                        <th className="py-1 pr-3">Slot</th>
                                        <th className="py-1 pr-3">Item</th>
                                        <th className="py-1 pr-3">iLvl</th>
                                        <th className="py-1 pr-3">DPS</th>
                                        <th className="py-1 pr-3">Δ%</th>
                                        <th className="py-1">Veredito</th>
                                    </tr>
                                </thead>
                                <tbody className="text-zinc-200">
                                    {resultado.itens.map((item, indice) => {
                                        const cor =
                                            item.veredito === 'ganho'
                                                ? 'text-emerald-400'
                                                : item.veredito === 'perda'
                                                    ? 'text-rose-400'
                                                    : 'text-zinc-400';
                                        // Anel e berloque são medidos em dois slots; a linha mostra o
                                        // melhor e registra aqui onde mais o item foi testado.
                                        const outros = (item.slots_testados ?? []).filter(
                                            (slot) => slot !== item.slot,
                                        );
                                        return (
                                            <tr
                                                key={`${item.item_id ?? indice}-${item.ilvl ?? ''}-${item.slot}`}
                                                className="border-t border-zinc-800/70 hover:bg-zinc-900/40"
                                            >
                                                <td className="py-1.5 pr-3 font-mono text-sky-300 align-top">
                                                    {item.slot}
                                                    {outros.length > 0 && (
                                                        <span
                                                            className="block text-[10px] text-zinc-500 font-sans"
                                                            title={`Também medido em: ${outros.join(', ')}`}
                                                        >
                                                            +{outros.length} slot{outros.length > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-1.5 pr-3">
                                                    <span
                                                        className="inline-flex items-center space-x-2 cursor-help"
                                                        onMouseEnter={(e) =>
                                                            item.item_id != null &&
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
                                                        <span>{nomeDoItem(item)}</span>
                                                    </span>
                                                </td>
                                                <td className="py-1.5 pr-3 text-zinc-400">{item.ilvl ?? '—'}</td>
                                                <td className="py-1.5 pr-3">{numero(item.dps)}</td>
                                                <td className={`py-1.5 pr-3 font-semibold ${cor}`}>{pct(item.delta_pct)}</td>
                                                <td className={`py-1.5 ${cor}`}>
                                                    <span className="inline-flex items-center space-x-1">
                                                        {item.veredito === 'ganho' && <ArrowUpRight className="w-3.5 h-3.5" />}
                                                        {item.veredito === 'perda' && <ArrowDownRight className="w-3.5 h-3.5" />}
                                                        {item.veredito === 'empate' && <MinusCircle className="w-3.5 h-3.5" />}
                                                        <span className="capitalize">{item.veredito}</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-xs text-zinc-400">Nenhum candidato legal para comparar com o equipado.</p>
                    )}

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
