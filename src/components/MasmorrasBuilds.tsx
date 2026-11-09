import React, { useState } from 'react';
import { AlertTriangle, Check, Copy, Layers, Loader2, Wand2 } from 'lucide-react';
import {
    BuildDisponivel,
    BuildResultado,
    RankingResult,
    ROTULO_ETIQUETA,
    gerarStringAmr,
} from '../services/masmorrasService';
import { CENARIOS_DROPDOWN } from '../data/scenarios';

const pct = (valor: number | null | undefined) =>
    valor == null
        ? '—'
        : `${valor >= 0 ? '+' : ''}${valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;

const icone = (nome: string | null | undefined) =>
    nome ? `https://wow.zamimg.com/images/wow/icons/medium/${nome}.jpg` : undefined;

/** Copia com a API do navegador; sem ela (WebView sem contexto seguro), seleciona o texto. */
export const CopiarTexto: React.FC<{ texto: string; rotulo?: string }> = ({ texto, rotulo = 'Copiar' }) => {
    const [copiado, setCopiado] = useState(false);
    const [selecionar, setSelecionar] = useState(false);
    const copiar = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(texto);
                setCopiado(true);
                window.setTimeout(() => setCopiado(false), 1500);
                return;
            }
        } catch {
            /* cai no fallback */
        }
        setSelecionar(true);
    };
    return (
        <div className="space-y-1">
            <div className="flex items-start gap-2">
                <code className="flex-1 block text-[11px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 break-all max-h-24 overflow-auto">
                    {texto}
                </code>
                <button
                    onClick={copiar}
                    title="Copiar para a área de transferência"
                    className="shrink-0 inline-flex items-center gap-1 px-2 py-1.5 rounded-md border border-zinc-700 hover:border-zinc-500 text-[11px] text-zinc-200"
                >
                    {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiado ? 'Copiado' : rotulo}</span>
                </button>
            </div>
            {selecionar && (
                <textarea
                    readOnly
                    autoFocus
                    value={texto}
                    onFocus={(e) => e.currentTarget.select()}
                    className="w-full h-16 rounded-md bg-zinc-950 border border-amber-700/60 text-[11px] font-mono text-zinc-200 p-2"
                    title="Texto selecionado: use Ctrl+C"
                />
            )}
        </div>
    );
};

interface SeletorProps {
    disponiveis: BuildDisponivel[];
    selecionadas: string[];
    setSelecionadas: (v: string[]) => void;
    pesos: Record<string, number>;
    setPesos: (v: Record<string, number>) => void;
    cenarios: Record<string, string>;
    setCenarios: (v: Record<string, string>) => void;
    medirPesos: boolean;
    setMedirPesos: (v: boolean) => void;
    carregando: boolean;
    onLer: () => void;
    podeLer: boolean;
}

export const SeletorBuilds: React.FC<SeletorProps> = ({
    disponiveis,
    selecionadas,
    setSelecionadas,
    pesos,
    setPesos,
    cenarios,
    setCenarios,
    medirPesos,
    setMedirPesos,
    carregando,
    onLer,
    podeLer,
}) => {
    const alternar = (nome: string) =>
        setSelecionadas(
            selecionadas.includes(nome) ? selecionadas.filter((n) => n !== nome) : [...selecionadas, nome].slice(0, 6),
        );
    return (
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                    <Layers className="w-4 h-4 text-violet-300" />
                    Comparar builds (opcional)
                </span>
                <button
                    onClick={onLer}
                    disabled={!podeLer || carregando}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-zinc-700 hover:border-zinc-500 disabled:opacity-50 text-[11px] text-zinc-200"
                >
                    {carregando && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Ler builds do export do SimC
                </button>
            </div>
            <p className="text-[10px] text-zinc-500 leading-snug">
                Cada build marcada é medida separadamente, contra ela mesma. O ranking das masmorras passa a usar a
                média ponderada. Custa uma rodada inteira por build.
            </p>
            {disponiveis.length > 0 && (
                <div className="space-y-1">
                    {disponiveis.map((b) => {
                        const marcada = selecionadas.includes(b.nome);
                        return (
                            <div key={b.nome} className="flex items-center gap-2 text-[11px] text-zinc-300 flex-wrap">
                                <label className="inline-flex items-center gap-1.5 w-44 truncate">
                                    <input
                                        type="checkbox"
                                        checked={marcada}
                                        onChange={() => alternar(b.nome)}
                                        className="accent-violet-500"
                                    />
                                    <span className="truncate" title={b.nome}>{b.nome}</span>
                                </label>
                                <label className={`inline-flex items-center gap-1 ${marcada ? '' : 'opacity-40'}`}>
                                    peso
                                    <input
                                        type="number"
                                        min={0}
                                        step={1}
                                        disabled={!marcada}
                                        value={pesos[b.nome] ?? 1}
                                        onChange={(e) => setPesos({ ...pesos, [b.nome]: Number(e.target.value) })}
                                        className="w-14 bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-zinc-100"
                                    />
                                </label>
                                <select
                                    disabled={!marcada}
                                    value={cenarios[b.nome] ?? b.cenario_sugerido}
                                    onChange={(e) => setCenarios({ ...cenarios, [b.nome]: e.target.value })}
                                    className={`bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-zinc-100 ${marcada ? '' : 'opacity-40'}`}
                                >
                                    {CENARIOS_DROPDOWN.map((c) => (
                                        <option key={c.valor} value={c.valor}>
                                            {c.rotulo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    })}
                </div>
            )}
            <label className="inline-flex items-center gap-1.5 text-[11px] text-zinc-300">
                <input
                    type="checkbox"
                    checked={medirPesos}
                    onChange={(e) => setMedirPesos(e.target.checked)}
                    className="accent-violet-500"
                />
                Gerar escala do Pawn (mede os pesos de cada build com 5.000 iterações — demora)
            </label>
        </div>
    );
};

const AVISO_PAWN =
    'O Pawn soma atributos e não enxerga bônus de tier, procs nem efeitos de berloque. Use como primeira indicação.';
const AVISO_BIB =
    'Importar com várias linhas apaga os Best in Bags importados antes, inclusive os do site do AMR.';

const CartaoBuild: React.FC<{ build: BuildResultado; modelo: string }> = ({ build, modelo }) => {
    const [amr, setAmr] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [gerando, setGerando] = useState(false);
    const confirmado =
        build.delta_conjunto_pct != null && build.limiar_conjunto_pct != null
            ? build.delta_conjunto_pct > build.limiar_conjunto_pct
            : null;

    const gerar = async () => {
        setErro(null);
        setGerando(true);
        try {
            const r = await gerarStringAmr({ modelo, build: build.nome, itens: build.conjunto_itens });
            setAmr(r.string);
        } catch (e: any) {
            setErro(e?.message || 'Falha ao gerar a string.');
        } finally {
            setGerando(false);
        }
    };

    return (
        <div className="p-4 rounded-xl border border-violet-800/40 bg-violet-950/10 space-y-3">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white">{build.nome}</span>
                <span className="text-[11px] text-zinc-400">
                    {CENARIOS_DROPDOWN.find((c) => c.valor === build.cenario)?.rotulo ?? build.cenario}
                    {build.ref_dps ? ` · referência ${Math.round(build.ref_dps).toLocaleString('pt-BR')} DPS` : ''}
                </span>
            </div>

            {build.trocas.length === 0 ? (
                <p className="text-xs text-zinc-400">Nenhuma peça das masmorras melhora esta build.</p>
            ) : (
                <>
                    <div
                        className={`text-xs ${confirmado ? 'text-emerald-300' : 'text-amber-300'}`}
                        title="Medido numa execução própria: a build atual contra o conjunto montado"
                    >
                        Conjunto montado: <span className="font-mono font-semibold">{pct(build.delta_conjunto_pct)}</span>
                        {build.limiar_conjunto_pct != null && (
                            <span className="text-zinc-500"> (empate abaixo de {pct(build.limiar_conjunto_pct)})</span>
                        )}
                        {confirmado === false && ' — a combinação não confirmou o ganho das peças sozinhas'}
                    </div>
                    <ul className="space-y-1">
                        {build.trocas.map((t) => (
                            <li key={t.slot} className="flex items-center gap-2 text-xs text-zinc-300">
                                {icone(t.icone) && <img src={icone(t.icone)} alt="" className="h-5 w-5 rounded" loading="lazy" />}
                                <span className="w-20 text-zinc-500">{t.slot}</span>
                                <span className="flex-1 truncate">
                                    {t.nome_pt || t.nome_en || `#${t.item_id}`}
                                    {t.catalisado && <span className="ml-1 text-amber-300">(catalisar)</span>}
                                </span>
                                <span className="font-mono text-zinc-200">{pct(t.ganho_pct)}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {build.avisos.length > 0 && (
                <ul className="text-[11px] text-amber-300 space-y-0.5">
                    {build.avisos.map((a, i) => (
                        <li key={i}>• {a}</li>
                    ))}
                </ul>
            )}

            {build.pawn && (
                <div className="space-y-1">
                    <span className="text-[11px] text-zinc-400">Escala do Pawn</span>
                    <CopiarTexto texto={build.pawn} />
                </div>
            )}

            <div className="space-y-1">
                <button
                    onClick={gerar}
                    disabled={gerando || modelo.trim().length < 20}
                    title={modelo.trim().length < 20 ? 'Cole antes a string de Best in Bags do AMR (abaixo)' : ''}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-zinc-700 hover:border-zinc-500 disabled:opacity-50 text-[11px] text-zinc-200"
                >
                    {gerando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                    Gerar string do AMR
                </button>
                {erro && <p className="text-[11px] text-rose-300">{erro}</p>}
                {amr && <CopiarTexto texto={amr} />}
            </div>
        </div>
    );
};

export const ResultadoBuilds: React.FC<{ resultado: RankingResult }> = ({ resultado }) => {
    const [modelo, setModelo] = useState('');
    const builds = resultado.builds ?? [];
    const nomes = builds.map((b) => b.nome);
    const temPawn = builds.some((b) => b.pawn) || resultado.pawn_atual || resultado.pawn_mistura;
    if (builds.length === 0 && !resultado.pawn_atual) return null;

    return (
        <div className="space-y-4">
            {builds.length > 0 && (
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-x-auto">
                    <h3 className="text-sm font-bold text-white mb-2">Item × build</h3>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="text-zinc-500 text-left">
                                <th className="py-1 pr-2 font-normal">Item</th>
                                <th className="py-1 pr-2 font-normal">Masmorra</th>
                                {nomes.map((n) => (
                                    <th key={n} className="py-1 pr-2 font-normal text-right">
                                        {n}
                                        <span className="block text-[10px] text-zinc-600">
                                            peso {Math.round(100 * (resultado.pesos_builds[n] ?? 0))}%
                                        </span>
                                    </th>
                                ))}
                                <th className="py-1 pr-2 font-normal text-right">Média</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultado.matriz
                                .filter((l) => Object.values(l.etiquetas).some((e) => e !== 'nao_serve'))
                                .map((l) => (
                                    <tr key={l.item_id} className="border-t border-zinc-800/60">
                                        <td className="py-1 pr-2">
                                            <span className="inline-flex items-center gap-1.5">
                                                {icone(l.icone) && (
                                                    <img src={icone(l.icone)} alt="" className="h-5 w-5 rounded" loading="lazy" />
                                                )}
                                                <span className="truncate max-w-[14rem]">{l.nome_pt || l.nome_en || `#${l.item_id}`}</span>
                                                {l.divergente && (
                                                    <span title="Ganha numa build e perde em outra">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                                                    </span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="py-1 pr-2 text-zinc-400">{l.masmorra}</td>
                                        {nomes.map((n) => (
                                            <td
                                                key={n}
                                                className={`py-1 pr-2 text-right font-mono ${(l.deltas[n] ?? 0) > (l.limiares[n] ?? 0)
                                                        ? 'text-emerald-300'
                                                        : (l.deltas[n] ?? 0) < -(l.limiares[n] ?? 0)
                                                            ? 'text-rose-300'
                                                            : 'text-zinc-500'
                                                    }`}
                                                title={l.etiquetas[n] ? ROTULO_ETIQUETA[l.etiquetas[n]] : ''}
                                            >
                                                {pct(l.deltas[n])}
                                            </td>
                                        ))}
                                        <td className="py-1 pr-2 text-right font-mono font-semibold text-zinc-100">
                                            {pct(l.media_pct)}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <p className="mt-2 text-[10px] text-zinc-500">
                        Só itens que servem em pelo menos uma build. Cinza = empate dentro da margem de erro.
                    </p>
                </div>
            )}

            {builds.length > 0 && (
                <label className="flex flex-col gap-1 text-[11px] text-zinc-400">
                    String de Best in Bags do AMR (modelo para gerar a string de cada build)
                    <textarea
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        placeholder="_bib_ $181;US;Azralon;Nome;..."
                        className="w-full h-16 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 p-2"
                    />
                    <span className="text-[10px] text-amber-300/80">{AVISO_BIB}</span>
                </label>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {builds.map((b) => (
                    <CartaoBuild key={b.nome} build={b} modelo={modelo} />
                ))}
            </div>

            {temPawn && (
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-2">
                    <h3 className="text-sm font-bold text-white">Pawn</h3>
                    {resultado.pawn_atual && <CopiarTexto texto={resultado.pawn_atual} />}
                    {resultado.pawn_mistura && (
                        <div className="space-y-1">
                            <span className="text-[11px] text-zinc-400">Mistura (média ponderada das builds, vale para qualquer build)</span>
                            <CopiarTexto texto={resultado.pawn_mistura} />
                        </div>
                    )}
                    {resultado.pawn_iguais.map(([a, b]) => (
                        <p key={`${a}-${b}`} className="text-[11px] text-amber-300">
                            “{a}” e “{b}” têm a mesma escala dentro da margem de erro: use uma só.
                        </p>
                    ))}
                    <p className="text-[11px] text-zinc-500">{AVISO_PAWN}</p>
                </div>
            )}
        </div>
    );
};
