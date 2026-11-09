import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Aviso, Botao, Cartao } from '../ui';

interface JobResumo {
    id: string;
    status: 'pending' | 'running' | 'done' | 'error' | 'cancelled';
    request: Record<string, any>;
    erro: string | null;
    created_at: string | null;
    started_at: string | null;
    finished_at: string | null;
}

const STATUS: Record<JobResumo['status'], { rotulo: string; classe: string }> = {
    done: { rotulo: 'concluído', classe: 'text-ganho' },
    running: { rotulo: 'rodando', classe: 'text-info' },
    pending: { rotulo: 'na fila', classe: 'text-texto-2' },
    error: { rotulo: 'erro', classe: 'text-perda' },
    cancelled: { rotulo: 'cancelado', classe: 'text-texto-3' },
};

const data = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

const duracao = (a: string | null, b: string | null) => {
    if (!a || !b) return '—';
    const s = Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 1000));
    return s >= 60 ? `${Math.floor(s / 60)} min ${s % 60}s` : `${s}s`;
};

/** Rodadas anteriores do ranking; clicar abre o resultado na aba Masmorras. */
export const HistoricoTab: React.FC<{ onAbrir: (id: string) => void }> = ({ onAbrir }) => {
    const [jobs, setJobs] = useState<JobResumo[] | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

    const carregar = async () => {
        setCarregando(true);
        setErro(null);
        try {
            const r = await fetch('/api/masmorras');
            if (!r.ok) throw new Error(`Falha (${r.status})`);
            setJobs((await r.json()).jobs ?? []);
        } catch (e: any) {
            setErro(e?.message || 'Não foi possível carregar o histórico.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        void carregar();
    }, []);

    return (
        <div className="space-y-5">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-texto">Histórico</h1>
                    <p className="text-sm text-texto-2">Rankings anteriores. Clique para abrir o resultado.</p>
                </div>
                <Botao variante="discreto" icone={<RefreshCw className="w-4 h-4" />} carregando={carregando} onClick={carregar}>
                    Atualizar
                </Botao>
            </div>
            {erro && <Aviso tom="erro">{erro}</Aviso>}
            {jobs && jobs.length === 0 && <Aviso>Nenhum ranking rodado ainda.</Aviso>}
            {jobs && jobs.length > 0 && (
                <Cartao className="p-0 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-borda text-left text-xs text-texto-3">
                                <th className="px-4 py-2 font-medium">Quando</th>
                                <th className="px-4 py-2 font-medium">Tipo</th>
                                <th className="px-4 py-2 font-medium">Builds</th>
                                <th className="px-4 py-2 font-medium">Duração</th>
                                <th className="px-4 py-2 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((j) => {
                                const builds: string[] = j.request?.loadouts ?? [];
                                const pode = j.status === 'done';
                                return (
                                    <tr
                                        key={j.id}
                                        onClick={() => pode && onAbrir(j.id)}
                                        className={`border-b border-borda last:border-0 ${pode ? 'cursor-pointer hover:bg-superficie-2' : ''}`}
                                    >
                                        <td className="num px-4 py-2.5 text-texto">{data(j.created_at)}</td>
                                        <td className="px-4 py-2.5 text-texto-2">
                                            {j.request?.modo === 'cofre' ? 'Grande Cofre' : 'Masmorras M+'}
                                            {j.request?.ilvl && j.request?.modo !== 'cofre' ? ` · ${j.request.ilvl}` : ''}
                                        </td>
                                        <td className="px-4 py-2.5 text-texto-2">{builds.length ? builds.join(', ') : '—'}</td>
                                        <td className="num px-4 py-2.5 text-texto-2">{duracao(j.started_at, j.finished_at)}</td>
                                        <td className={`px-4 py-2.5 ${STATUS[j.status]?.classe ?? ''}`}>
                                            {STATUS[j.status]?.rotulo ?? j.status}
                                            {j.status === 'error' && j.erro && (
                                                <span className="block max-w-xs truncate text-xs text-texto-3" title={j.erro}>
                                                    {j.erro}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Cartao>
            )}
        </div>
    );
};
