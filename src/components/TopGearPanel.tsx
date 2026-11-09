import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    AlertCircle,
    Download,
    Gauge,
    Layers,
    Loader2,
    Play,
    RefreshCw,
    Trophy,
    XCircle,
} from 'lucide-react';
import {
    TopGearArquivoSalvo,
    TopGearEstimativa,
    TopGearHeuristica,
    TopGearJob,
    TopGearPoolsResumo,
    TopGearResultado,
    cancelarTopGear,
    consultarTopGear,
    criarTopGear,
    estimativaTopGear,
    heuristicaTopGear,
    perfilTopGear,
    previaPools,
    resultadoTopGear,
    salvarPerfilTopGear,
} from '../services/topGearService';
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
import { useItemTooltip } from '../context/TooltipContext';
import { usePersistedState } from '../services/persistedState';
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

type ItemVisual = { item_id?: number | null; icone?: string | null } | undefined;

const iconeDoItem = (cand: ItemVisual): string => {
    if (cand?.icone) {
        return `https://wow.zamimg.com/images/wow/icons/medium/${cand.icone}.jpg`;
    }
    return getItemIconUrl(getItemById(cand?.item_id ?? -1));
};

const bordaDoItem = (cand: ItemVisual): string =>
    getItemQualityBorder(getItemById(cand?.item_id ?? -1));

export const TopGearPanel: React.FC<Props> = ({ scenario, setScenario }) => {
    const [addon, setAddon] = useState<string>(() => carregarImportLocal() || '');
    const [amr, setAmr] = useState<string>(() => carregarAmrLocal() || '');
    const [primario, setPrimario] = usePersistedState<'simc' | 'amr'>('wowsim.topgear.primario', 'simc');
    const cenarioLocal = scenario;
    const [iteracoes, setIteracoes] = usePersistedState<number>('wowsim.topgear.iteracoes', 200);
    const [orcamento, setOrcamento] = usePersistedState<number>('wowsim.topgear.orcamento', 600);
    const [targetError, setTargetError] = usePersistedState<number>('wowsim.topgear.targetError', 0.2);
    const [preset, setPreset] = usePersistedState<string>('wowsim.topgear.preset', 'padrao');
    const aplicarPreset = (p: string) => {
        setPreset(p);
        if (p === 'rapido') { setIteracoes(200); setTargetError(0.5); setOrcamento(300); }
        else if (p === 'padrao') { setIteracoes(200); setTargetError(0.2); setOrcamento(600); }
        else if (p === 'preciso') { setIteracoes(2000); setTargetError(0.1); setOrcamento(1800); }
        else if (p === 'overnight') { setIteracoes(50000); setTargetError(0.02); setOrcamento(28800); }
    };
    const [pool, setPool] = usePersistedState<number>('wowsim.topgear.pool', 12);
    const [catalisador, setCatalisador] = usePersistedState<boolean>('wowsim.topgear.catalisador', false);
    const [maxCatalisados, setMaxCatalisados] = usePersistedState<number | null>(
        'wowsim.topgear.maxCatalisados',
        null,
    );
    const [talentosExtra, setTalentosExtra] = usePersistedState<string>('wowsim.topgear.talentosExtra', '');
    const [job, setJob] = useState<TopGearJob | null>(null);
    const [resultado, setResultado] = useState<TopGearResultado | null>(null);

    useEffect(() => {
        if (!job) return;
        console.info(`[topgear] ${job.id} status=${job.status}`, job.progresso ?? '');
    }, [job?.status, job?.progresso]);
    const [perfilServidor, setPerfilServidor] = useState<string>('');
    const [salvandoPerfil, setSalvandoPerfil] = useState(false);
    const [perfilSalvo, setPerfilSalvo] = useState<TopGearArquivoSalvo | null>(null);
    const [erroPerfil, setErroPerfil] = useState<string | null>(null);
    const [pools, setPools] = useState<TopGearPoolsResumo | null>(null);
    const [slotsTravados, setSlotsTravados] = usePersistedState<Record<string, number>>('wowsim.topgear.slotsTravados', {});
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [previaCarregando, setPreviaCarregando] = useState(false);
    const [validando, setValidando] = useState(false);
    const { showTooltip, updateTooltipPosition, hideTooltip } = useItemTooltip();
    const [combinacao, setCombinacao] = useState<CombinacaoResultado | null>(null);
    const [estimativa, setEstimativa] = useState<TopGearEstimativa | null>(null);
    const [heuristica, setHeuristica] = useState<TopGearHeuristica | null>(null);
    const [heuristicaCarregando, setHeuristicaCarregando] = useState(false);
    const pollingRef = useRef<number | null>(null);

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

    // Share the same last import as the Inspector, even after a restart.
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
                    const atual = await consultarTopGear(job.id);
                    setJob(atual);
                    if (atual.status === 'done') {
                        setResultado(await resultadoTopGear(atual.id));
                        // Canonical profile from the backend keeps gems/folio.
                        setPerfilServidor((await perfilTopGear(atual.id)).simc);
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
                    await estimativaTopGear({
                        addon,
                        pool,
                        iterations: iteracoes,
                        orcamento_segundos: orcamento,
                        target_error: targetError > 0 ? targetError : null,
                        max_profilesets_rodada: 300,
                        catalisador,
                        max_catalisados: catalisador ? maxCatalisados : null,
                    }),
                );
            } catch {
                setEstimativa(null);
            }
        }, 700);
        return () => window.clearTimeout(timer);
    }, [addon, pool, iteracoes, orcamento, targetError, catalisador, maxCatalisados]);

    const iniciar = async () => {
        setErro(null);
        setResultado(null);
        setPerfilServidor('');
        setJob(null);
        setCarregando(true);
        try {
            const criado = await criarTopGear({
                addon,
                amr: amr.trim() ? amr : null,
                primario,
                scenario: cenarioLocal,
                iterations_triagem: iteracoes,
                orcamento_segundos: orcamento,
                target_error: targetError > 0 ? targetError : null,
                pool_por_slot: pool,
                max_profilesets_rodada: 300,
                slots_travados: slotsTravados,
                talentos_extra: talentosExtra
                    .split(/\r?\n/)
                    .map((codigo) => codigo.trim())
                    .filter(Boolean),
                catalisador,
                max_catalisados: catalisador ? maxCatalisados : null,
            });
            setJob(await consultarTopGear(criado.id));
        } catch (e: any) {
            setErro(e?.message || 'Falha ao criar o job.');
        } finally {
            setCarregando(false);
        }
    };

    const carregarHeuristica = async () => {
        if (!addon.trim()) return;
        setHeuristicaCarregando(true);
        try {
            setHeuristica(await heuristicaTopGear(addon, pool, 6));
        } catch (e: any) {
            setErro(e?.message || 'Falha ao carregar a estimativa heurística.');
        } finally {
            setHeuristicaCarregando(false);
        }
    };

    const cancelar = async () => {
        if (!job) return;
        try {
            await cancelarTopGear(job.id);
            setJob(await consultarTopGear(job.id));
        } catch (e: any) {
            setErro(e?.message || 'Falha ao cancelar.');
        }
    };

    const carregarPrevia = async () => {
        setErro(null);
        setPreviaCarregando(true);
        try {
            setPools(await previaPools(addon, pool));
        } catch (e: any) {
            setErro(e?.message || 'Falha ao carregar as pools.');
        } finally {
            setPreviaCarregando(false);
        }
    };

    const perfilOtimizado = useMemo(() => {
        if (!resultado) return '';
        const linhas: string[] = [];
        Object.values(resultado.melhor.itens).forEach((candidato) => {
            if (!candidato.item_id) return;
            let linha = `${candidato.slot}=,id=${candidato.item_id}`;
            if (candidato.enchant_id) linha += `,enchant_id=${candidato.enchant_id}`;
            if (candidato.gem_ids?.length) linha += `,gem_id=${candidato.gem_ids.join('/')}`;
            const bonus = candidato.bonus_ids?.length
                ? candidato.bonus_ids
                : candidato.bonus_id
                    ? [candidato.bonus_id]
                    : [];
            if (bonus.length) linha += `,bonus_id=${bonus.join('/')}`;
            linhas.push(linha);
        });
        if (resultado.melhor.talentos) linhas.push(`talents=${resultado.melhor.talentos}`);
        const consumiveis: [string, string | null | undefined][] = [
            ['flask', resultado.melhor.flask],
            ['potion', resultado.melhor.potion],
            ['food', resultado.melhor.food],
            ['augmentation', resultado.melhor.augmentation],
        ];
        consumiveis.forEach(([campo, valor]) => {
            if (valor) linhas.push(`${campo}=${valor}`);
        });
        return `${addon.trim()}\n\n# Top Gear — melhor conjunto medido\n${linhas.join('\n')}\n`;
    }, [resultado, addon]);

    // Comparação lado a lado (equipado × sugerido), estilo AMR.
    const comparacao = useMemo(() => {
        if (!resultado) return [];
        const baseItens = resultado.base?.itens ?? {};
        const melhorItens = resultado.melhor.itens ?? {};
        const ordem = [
            'head', 'neck', 'shoulder', 'back', 'chest', 'wrist', 'hands',
            'waist', 'legs', 'feet', 'finger1', 'finger2', 'trinket1',
            'trinket2', 'main_hand', 'off_hand',
        ];
        const slots = Array.from(new Set([...Object.keys(baseItens), ...Object.keys(melhorItens)]));
        slots.sort((a, b) => {
            const ia = ordem.indexOf(a);
            const ib = ordem.indexOf(b);
            return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
        });
        return slots.map((slot) => {
            const de = baseItens[slot];
            const para = melhorItens[slot];
            const mudou =
                (de?.item_id ?? null) !== (para?.item_id ?? null) ||
                (de?.enchant_id ?? null) !== (para?.enchant_id ?? null) ||
                (de?.gem_ids ?? []).join(',') !== (para?.gem_ids ?? []).join(',');
            return { slot, de, para, mudou };
        });
    }, [resultado]);

    // Prefer the backend profile (canonical, includes gems and omnium_talents).
    const perfilFinal = perfilServidor || perfilOtimizado;

    // Gravado pelo backend: a janela do app desktop não tem gerenciador de
    // download, e o link `blob:` que havia aqui não produzia arquivo nem erro.
    const baixarPerfil = async () => {
        if (!job?.id || salvandoPerfil) return;
        setSalvandoPerfil(true);
        setErroPerfil(null);
        setPerfilSalvo(null);
        try {
            setPerfilSalvo(await salvarPerfilTopGear(job.id));
        } catch (e: any) {
            setErroPerfil(e?.message || 'Não foi possível salvar o perfil.');
        } finally {
            setSalvandoPerfil(false);
        }
    };

    const aplicarNoCampo = () => {
        if (!perfilFinal) return;
        setAddon(perfilFinal);
    };

    const ativo = job != null && !terminado(job.status);
    const semAddon = addon.trim().length < 20;

    return (
        <div className="space-y-6">
            <div className="p-5 rounded-xl border border-purple-700/50 bg-purple-950/20">
                <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-purple-300" />
                    <div>
                        <h2 className="text-sm font-bold text-white">Top Gear</h2>
                        <p className="text-[11px] text-zinc-400">
                            Busca em estágios (marginal → gulosa → beam → encantos/gemas/talentos/folio → refino).
                            Todo DPS vem do SimulationCraft.
                        </p>
                    </div>
                </div>

                <textarea
                    value={addon}
                    onChange={(e) => setAddon(e.target.value)}
                    placeholder="Cole aqui a saída do /simc (principal)"
                    className="mt-4 w-full h-40 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 p-3 focus:outline-none focus:border-purple-600"
                />

                <label className="mt-3 flex flex-col gap-1 text-[11px] text-zinc-400">
                    AskMrRobot (opcional — complementa com raça, .inv, .hlv e tuning de item)
                    <textarea
                        value={amr}
                        onChange={(e) => setAmr(e.target.value)}
                        placeholder="$181;US;Azralon;Nome;..."
                        className="w-full h-20 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 p-3 focus:outline-none focus:border-purple-600"
                    />
                </label>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                    <span>Base (primário):</span>
                    <label className="inline-flex items-center gap-1">
                        <input
                            type="radio"
                            checked={primario === 'simc'}
                            onChange={() => setPrimario('simc')}
                            className="accent-purple-500"
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
                            className="accent-purple-500"
                        />
                        AMR
                    </label>
                    <span className="text-zinc-500">
                        equipado e talentos vêm do primário; o outro export complementa.
                    </span>
                </div>

                <label className="mt-3 flex flex-col gap-1 text-[11px] text-zinc-400">
                    Builds de talento extras (uma import string por linha)
                    <textarea
                        value={talentosExtra}
                        onChange={(e) => setTalentosExtra(e.target.value)}
                        placeholder="Cole aqui outras import strings de talento para comparar"
                        className="w-full h-20 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 p-3 focus:outline-none focus:border-purple-600"
                    />
                </label>

                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
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
                            Iterações (triagem)
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
                            Pool por slot
                            <InfoTip titulo="Pools de itens">Pool = conjunto de itens candidatos que o app testa por slot (cabeça, peito, anel…). "Pool por slot" é quantos itens por slot entram na busca. As pools respeitam elegibilidade (tipo de armadura, arma, embelezamentos). Pools maiores = busca mais ampla, porém mais lenta. Veja as contagens em "Prévia das pools" sem rodar o SimC.</InfoTip>
                        </span>
                        <input
                            type="number"
                            min={1}
                            value={pool}
                            onChange={(e) => setPool(Number(e.target.value))}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100"
                        />
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1 justify-end">
                        <span className="inline-flex items-center gap-1">
                            Catalisador
                            <InfoTip titulo="Catalisador (tier)">Converte candidatos de cabeça/ombros/peito/mãos/pernas na peça de tier da classe, preservando trilha e stats base (redirected_base_stats no SimC). Mede gêmeos na pool e pacotes de 2/4 peças. Desligado por padrão.</InfoTip>
                        </span>
                        <span className="inline-flex items-center gap-2 h-[30px]">
                            <input
                                type="checkbox"
                                checked={catalisador}
                                onChange={(e) => setCatalisador(e.target.checked)}
                                className="rounded border-zinc-700"
                            />
                            <span className="text-zinc-300">converter em tier</span>
                        </span>
                    </label>
                    <label className="text-[11px] text-zinc-400 flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1">
                            Cargas (máx.)
                            <InfoTip titulo="Cargas do Catalisador">Quantas conversões novas a busca pode gastar. Vazio = sem teto no pedido (ainda respeita regras do conjunto). Peças que você já catalisou não consomem carga nova.</InfoTip>
                        </span>
                        <input
                            type="number"
                            min={0}
                            max={5}
                            disabled={!catalisador}
                            placeholder="sem limite"
                            value={maxCatalisados ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                setMaxCatalisados(v === '' ? null : Math.min(5, Math.max(0, Number(v))));
                            }}
                            className="bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-xs text-zinc-100 disabled:opacity-40"
                        />
                    </label>
                </div>

                {estimativa && (
                    <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-[11px]">
                        <span className="text-zinc-400">Estimativa: </span>
                        <span className="text-zinc-200 font-mono">
                            ~{estimativa.profilesets_total_estimado} profilesets · ~
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
                        className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold transition"
                    >
                        {carregando || ativo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        <span>{ativo ? 'Rodando...' : 'Iniciar Top Gear'}</span>
                    </button>
                    <button
                        onClick={validar}
                        disabled={semAddon || validando}
                        className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 disabled:opacity-50 text-zinc-200 text-sm transition"
                    >
                        {validando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                        <span>Validar combinação</span>
                    </button>
                    <button
                        onClick={carregarPrevia}
                        disabled={semAddon || previaCarregando}
                        className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 disabled:opacity-50 text-zinc-200 text-sm transition"
                    >
                        {previaCarregando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                        <span>Prévia das pools</span>
                    </button>
                    <button
                        onClick={carregarHeuristica}
                        disabled={semAddon || heuristicaCarregando}
                        className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg border border-amber-800/60 hover:border-amber-600 disabled:opacity-50 text-amber-200 text-sm transition"
                        title="Estimativa instantânea por pesos de atributos (não é DPS)."
                    >
                        {heuristicaCarregando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gauge className="w-4 h-4" />}
                        <span>Estimativa rápida</span>
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
                <div className="p-4 rounded-xl border border-purple-800/50 bg-purple-950/20 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-zinc-200">
                        <Layers className="w-4 h-4 text-purple-300" />
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

            {heuristica && (
                <div className="p-4 rounded-xl border border-amber-800/50 bg-amber-950/20 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-200">
                        <Gauge className="w-4 h-4 text-amber-300" />
                        <span className="font-semibold">Estimativa rápida (heurística)</span>
                        <span className="text-[11px] text-amber-300/80">não é DPS · fonte: {heuristica.fonte_pesos}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                        Ordena por pesos de atributos para pré-selecionar; o número medido vem do SimulationCraft ao rodar o job.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(heuristica.por_slot).map(([slot, itens]) => (
                            <div key={slot} className="text-xs text-zinc-400">
                                <div className="text-zinc-300 font-medium mb-1">{slot}</div>
                                <ul className="space-y-0.5">
                                    {itens.slice(0, 3).map((item, indice) => (
                                        <li key={`${slot}-${item.item_id ?? indice}`} className="flex justify-between space-x-2">
                                            <span className="truncate">{item.nome_pt ?? item.nome_en ?? `item ${item.item_id ?? '—'}`}</span>
                                            <span className="text-amber-300/90 tabular-nums">{item.score.toFixed(0)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {job && (job.status === 'running' || job.status === 'pending') && (
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                    <div className="flex items-center space-x-2 text-sm text-zinc-200">
                        <Gauge className="w-4 h-4 text-purple-300" />
                        <span className="font-semibold">Progresso</span>
                        <span className="text-zinc-500">rodada {job.progresso?.rodada ?? '—'} · {job.progresso?.estagio ?? '—'}</span>
                    </div>
                    <SimulationProgressBar
                        ativo={!terminado(job.status)}
                        startedAt={job.started_at}
                        orcamentoSegundos={orcamento}
                        rodada={job.progresso?.rodada}
                    />
                    <div className="mt-2 text-xs text-zinc-400">
                        Melhor DPS parcial: <span className="text-zinc-100 font-semibold">{numero(job.progresso?.melhor_dps)}</span>
                        {job.progresso?.candidatos != null && ` · ${job.progresso.candidatos} candidatos na rodada`}
                    </div>
                </div>
            )}

            {pools && (
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">
                            Pools ({pools.classe ?? '—'} / {pools.spec ?? '—'}
                            {pools.tipo_armadura ? ` · ${pools.tipo_armadura}` : ''}
                            {pools.atributo ? ` · ${pools.atributo}` : ''})
                        </h3>
                        <span className="text-[11px] text-zinc-500">top {pool} por slot</span>
                    </div>
                    {pools.avisos && pools.avisos.length > 0 && (
                        <ul className="mt-2 text-[11px] text-amber-300 space-y-1">
                            {pools.avisos.map((aviso, indice) => (
                                <li key={indice}>• {aviso}</li>
                            ))}
                        </ul>
                    )}
                    <p className="mt-2 text-[11px] text-zinc-500">
                        Marque um slot para travá-lo (mantém item, encanto e gema no resultado).
                    </p>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(pools.contagens).map(([slot, total]) => {
                            const travado = slotsTravados[slot] !== undefined;
                            return (
                                <label
                                    key={slot}
                                    className={`rounded-lg border p-2 cursor-pointer ${travado ? 'border-amber-600 bg-amber-950/20' : 'border-zinc-800 bg-zinc-950/70'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase text-zinc-500">{slot}</span>
                                        <input
                                            type="checkbox"
                                            checked={travado}
                                            onChange={(e) =>
                                                setSlotsTravados((prev) => {
                                                    const proximo = { ...prev };
                                                    if (e.target.checked) proximo[slot] = 0;
                                                    else delete proximo[slot];
                                                    return proximo;
                                                })
                                            }
                                            className="accent-amber-500"
                                        />
                                    </div>
                                    <div className="text-sm font-bold text-zinc-100">{total}</div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}

            {resultado && (
                <div className="rounded-2xl border border-emerald-700/40 bg-emerald-950/10 overflow-hidden">
                    {/* Destaque principal */}
                    <div className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-emerald-950/50 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-emerald-500/15 p-2.5">
                                <Trophy className="w-6 h-6 text-emerald-300" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <h3 className="text-lg font-bold leading-tight text-white">Melhor conjunto encontrado</h3>
                                    <InfoTip titulo="Como ler">DPS medido pelo SimulationCraft para o conjunto otimizado vs. o equipado atual. Nada aqui é estimado.</InfoTip>
                                </div>
                                <p className="text-xs text-zinc-400">Resultado medido — não é estimativa.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div>
                                <div className="flex items-center text-[11px] uppercase tracking-wide text-zinc-400">
                                    Ganho
                                    <InfoTip titulo="Ganho">Percentual de DPS do melhor conjunto sobre o equipado. Verde = melhora; vermelho = pior.</InfoTip>
                                </div>
                                <div className={`text-4xl font-extrabold leading-none ${resultado.delta_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {pct(resultado.delta_pct)}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end text-[11px] uppercase tracking-wide text-zinc-400">
                                    DPS
                                    <InfoTip titulo="DPS">DPS do melhor conjunto (grande) comparado à base equipada (pequeno).</InfoTip>
                                </div>
                                <div className="text-2xl font-bold leading-none text-white">{numero(resultado.melhor_dps)}</div>
                                <div className="text-[11px] text-zinc-500">base {numero(resultado.base_dps)}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-1">
                                <button
                                    onClick={aplicarNoCampo}
                                    className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 text-xs text-zinc-200"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Aplicar ao campo</span>
                                </button>
                                <InfoTip titulo="Aplicar ao campo">Coloca este conjunto otimizado na caixa de import, para você simular/exportar a partir dele.</InfoTip>
                            </div>
                            <div className="inline-flex items-center gap-1">
                                <button
                                    onClick={baixarPerfil}
                                    disabled={salvandoPerfil}
                                    className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-semibold text-white"
                                >
                                    {salvandoPerfil ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Download className="w-3.5 h-3.5" />
                                    )}
                                    <span>{salvandoPerfil ? 'Salvando...' : 'Salvar .simc'}</span>
                                </button>
                                <InfoTip titulo="Salvar .simc">Grava o perfil final em disco, pronto para colar no jogo ou no Raidbots. O caminho aparece abaixo.</InfoTip>
                            </div>
                        </div>
                        {perfilSalvo && (
                            <div className="mt-2 text-[11px] text-emerald-300 bg-emerald-950/30 border border-emerald-800/60 rounded-lg px-3 py-2">
                                <span className="font-semibold">Salvo em</span>{' '}
                                <span className="font-mono break-all text-emerald-200">{perfilSalvo.caminho}</span>
                            </div>
                        )}
                        {erroPerfil && (
                            <div className="mt-2 text-[11px] text-rose-300 bg-rose-950/30 border border-rose-800/60 rounded-lg px-3 py-2">
                                {erroPerfil}
                            </div>
                        )}
                    </div>

                    {/* Métricas */}
                    <div className="px-5 pb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                            <div className="flex items-center text-[10px] uppercase tracking-wide text-zinc-400">
                                Base
                                <InfoTip titulo="Base">DPS do conjunto atualmente equipado, medido no mesmo cenário.</InfoTip>
                            </div>
                            <div className="mt-1 text-2xl font-bold text-zinc-100">{numero(resultado.base_dps)}</div>
                        </div>
                        <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                            <div className="flex items-center text-[10px] uppercase tracking-wide text-zinc-400">
                                Melhor
                                <InfoTip titulo="Melhor">DPS do melhor conjunto que a busca encontrou.</InfoTip>
                            </div>
                            <div className="mt-1 text-2xl font-bold text-zinc-100">{numero(resultado.melhor_dps)}</div>
                        </div>
                        <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                            <div className="flex items-center text-[10px] uppercase tracking-wide text-zinc-400">
                                Diferença
                                <InfoTip titulo="Diferença">Melhor − Base. Positivo significa ganho de DPS com as trocas.</InfoTip>
                            </div>
                            <div className={`mt-1 text-2xl font-bold ${resultado.delta_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {pct(resultado.delta_pct)}
                            </div>
                        </div>
                        <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                            <div className="flex items-center text-[10px] uppercase tracking-wide text-zinc-400">
                                Limiar de erro
                                <InfoTip titulo="Limiar de erro">Diferenças abaixo deste valor são tratadas como empate técnico (ruído da simulação).</InfoTip>
                            </div>
                            <div className="mt-1 text-2xl font-bold text-zinc-100">{resultado.limiar_pct}%</div>
                        </div>
                    </div>

                    {/* Comparação lado a lado: equipado × sugerido (estilo AMR) */}
                    {comparacao.length > 0 && (
                        <div className="px-5 pb-5">
                            <div className="mb-2 flex items-center gap-1">
                                <h4 className="text-sm font-bold text-white">Equipado × Sugerido</h4>
                                <InfoTip titulo="Comparação">À esquerda o item equipado atualmente; à direita o sugerido. Linhas destacadas em verde mudaram. Passe o mouse para ver os detalhes do item.</InfoTip>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-zinc-800">
                                <div className="grid grid-cols-2 gap-px bg-zinc-800 text-[10px] uppercase tracking-wide text-zinc-400">
                                    <div className="bg-zinc-950 px-3 py-2">Equipado</div>
                                    <div className="bg-zinc-950 px-3 py-2">Sugerido</div>
                                </div>
                                <div className="divide-y divide-zinc-800">
                                    {comparacao.map(({ slot, de, para, mudou }) => {
                                        const nomeDe = de?.nome_pt ?? de?.nome_en ?? '—';
                                        const nomePara = para?.nome_pt ?? para?.nome_en ?? '—';
                                        return (
                                            <div key={slot} className="grid grid-cols-2 gap-px bg-zinc-800">
                                                <div
                                                    className="flex min-w-0 items-center gap-2 bg-zinc-950/70 px-3 py-2"
                                                    onMouseEnter={(e) => de?.item_id && showTooltip(de.item_id, e, { slot, itemPt: nomeDe, itemEn: de.nome_en ?? undefined, ilvl: de.ilvl ?? undefined, icon: de.icone ?? undefined, stats: de.stats ?? undefined })}
                                                    onMouseMove={updateTooltipPosition}
                                                    onMouseLeave={hideTooltip}
                                                >
                                                    <img src={iconeDoItem(de)} alt="" className={`h-9 w-9 shrink-0 rounded border ${bordaDoItem(de)}`} />
                                                    <div className="min-w-0">
                                                        <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-mono uppercase text-purple-300">{slot}</span>
                                                        <div className={`truncate text-xs ${de ? 'text-zinc-300' : 'text-zinc-600'}`}>{nomeDe}</div>
                                                        {de?.ilvl != null && (
                                                            <div className="text-[10px] text-zinc-500">ilvl {de.ilvl}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div
                                                    className={`flex min-w-0 items-center gap-2 px-3 py-2 ${mudou ? 'bg-emerald-950/30' : 'bg-zinc-950/70'}`}
                                                    onMouseEnter={(e) => para?.item_id && showTooltip(para.item_id, e, { slot, itemPt: nomePara, itemEn: para.nome_en ?? undefined, ilvl: para.ilvl ?? undefined, icon: para.icone ?? undefined, stats: para.stats ?? undefined })}
                                                    onMouseMove={updateTooltipPosition}
                                                    onMouseLeave={hideTooltip}
                                                >
                                                    <img src={iconeDoItem(para)} alt="" className={`h-9 w-9 shrink-0 rounded border ${bordaDoItem(para)}`} />
                                                    <div className="min-w-0">
                                                        {mudou && (
                                                            <div className="text-[10px] font-semibold text-emerald-400">▲ troca</div>
                                                        )}
                                                        <div className={`truncate text-xs font-semibold ${para ? 'text-white' : 'text-zinc-600'}`}>{nomePara}</div>
                                                        {para?.ilvl != null && (
                                                            <div className="text-[10px] text-zinc-500">ilvl {para.ilvl}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Histórico */}
                    {resultado.rodadas.length > 0 && (
                        <div className="px-5 pb-5">
                            <details className="text-xs text-zinc-400">
                                <summary className="flex cursor-pointer items-center gap-1 text-zinc-300">
                                    Histórico de rodadas ({resultado.rodadas.length})
                                    <InfoTip titulo="Rodadas">Cada rodada testa um lote de candidatos e só aceita ganho acima do limiar de erro. Serve para auditar como o conjunto foi refinado.</InfoTip>
                                </summary>
                                <ul className="mt-2 space-y-1">
                                    {resultado.rodadas.map((rodada, indice) => (
                                        <li key={`${rodada.numero}-${indice}`} className="flex items-center justify-between gap-3 border-b border-zinc-800/50 py-1">
                                            <span className="text-zinc-300">#{rodada.numero} · {rodada.estagio}</span>
                                            <span className="flex items-center gap-3">
                                                <span className="font-mono text-zinc-200">{numero(rodada.dps)}</span>
                                                <span className={(rodada.delta_pct ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                                    {rodada.delta_pct != null ? pct(rodada.delta_pct) : '—'}
                                                </span>
                                                <span className="text-zinc-500">{rodada.candidatos} cand.</span>
                                                {rodada.duracao_s != null && <span className="text-zinc-500">{rodada.duracao_s.toFixed(1)}s</span>}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </div>
                    )}

                    {resultado.avisos.length > 0 && (
                        <ul className="px-5 pb-5 text-xs text-amber-300 space-y-1">
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
