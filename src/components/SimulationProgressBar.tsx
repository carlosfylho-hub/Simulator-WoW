import React, { useEffect, useRef, useState } from 'react';

interface Props {
    ativo: boolean;
    /** ISO timestamp de início (job.started_at). */
    startedAt?: string | null;
    /** Orçamento previsto, em segundos; base da previsão. */
    orcamentoSegundos?: number;
    /** Rodada atual (Top Gear) — apenas informativo. */
    rodada?: number;
    maxRodadas?: number;
    label?: string;
}

function formatarDuracao(segundos: number): string {
    const s = Math.max(0, Math.round(segundos));
    if (s >= 3600) {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        return `${h}h ${m.toString().padStart(2, '0')}m`;
    }
    if (s >= 60) {
        const m = Math.floor(s / 60);
        const r = s % 60;
        return `${m}m ${r.toString().padStart(2, '0')}s`;
    }
    return `${s}s`;
}

/**
 * Barra de progresso em tempo real.
 * - Enquanto está dentro do orçamento: preenche conforme o tempo decorrido e
 *   mostra previsão de término.
 * - Se estoura o orçamento (ou não há previsão): vira "indeterminada", com uma
 *   faixa animada, para deixar claro que o SimC ainda está trabalhando — em vez
 *   de travar em 98% com "faltam 0s".
 */
export const SimulationProgressBar: React.FC<Props> = ({
    ativo,
    startedAt,
    orcamentoSegundos,
    rodada,
    maxRodadas,
    label,
}) => {
    const [agora, setAgora] = useState<number>(() => Date.now());
    const inicioRef = useRef<number | null>(null);

    useEffect(() => {
        inicioRef.current = startedAt ? new Date(startedAt).getTime() : null;
        setAgora(Date.now());
    }, [startedAt]);

    useEffect(() => {
        if (!ativo) return;
        const id = window.setInterval(() => setAgora(Date.now()), 500);
        return () => window.clearInterval(id);
    }, [ativo]);

    const inicio = inicioRef.current;
    const decorrido = ativo && inicio ? Math.max(0, (agora - inicio) / 1000) : 0;
    const temOrcamento = !!orcamentoSegundos && orcamentoSegundos > 0;
    const estourou = ativo && temOrcamento && decorrido > (orcamentoSegundos as number);
    const indeterminado = ativo && (!temOrcamento || estourou);

    let pct = 100;
    if (ativo && !indeterminado) {
        pct = Math.min(99, (decorrido / (orcamentoSegundos as number)) * 100);
    }
    pct = Math.max(0, Math.min(100, pct));

    let restante: number | null = null;
    if (ativo && !indeterminado && temOrcamento) {
        restante = Math.max(0, (orcamentoSegundos as number) - decorrido);
    }

    const horaFim =
        restante != null
            ? new Date(Date.now() + restante * 1000).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            })
            : null;

    return (
        <div className="mt-2">
            <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-texto-2">
                    {label || (ativo ? 'Executando…' : 'Concluído')}
                    {ativo && rodada != null ? (
                        <span className="ml-2 text-zinc-500">
                            rodada {rodada}
                            {maxRodadas ? `/${maxRodadas}` : ''}
                        </span>
                    ) : null}
                </span>
                <span className="num font-semibold text-texto">
                    {ativo ? (indeterminado ? '…' : `${pct.toFixed(0)}%`) : '100%'}
                </span>
            </div>

            {/* Trilho escuro e preenchimento dourado: 0% tem que PARECER vazio. */}
            <div className="h-2.5 w-full overflow-hidden rounded-full border border-borda bg-fundo">
                {indeterminado ? (
                    <div className="h-full w-1/3 rounded-full bg-destaque animate-wowsim-indeterminate" />
                ) : (
                    <div
                        className="h-full rounded-full bg-destaque transition-all duration-500"
                        style={{ width: `${pct}%` }}
                    />
                )}
            </div>

            {ativo && (
                <div className="mt-1 flex items-center justify-between text-xs text-texto-3">
                    {estourou ? (
                        <>
                            <span className="text-aviso">Passou da estimativa — o simc ainda está trabalhando</span>
                            <span>decorrido {formatarDuracao(decorrido)}</span>
                        </>
                    ) : restante != null ? (
                        <>
                            <span>Faltam ~{formatarDuracao(restante)}</span>
                            <span>{horaFim ? `termina às ${horaFim}` : ''}</span>
                        </>
                    ) : (
                        <>
                            <span>Aguardando o SimC concluir a rodada…</span>
                            <span>decorrido {formatarDuracao(decorrido)}</span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
