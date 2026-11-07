import React, { useState } from 'react';
import { Play, Loader2, AlertCircle, Gauge } from 'lucide-react';
import { compararNoSimc, SimCompareResult } from '../engine/simcCompare';

interface Props {
    base: string;
    candidate: string;
    scenario: string;
    candidateLabel: string;
}

const numero = (valor: number) =>
    valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

export const SimcRealCompareCard: React.FC<Props> = ({ base, candidate, scenario, candidateLabel }) => {
    const [carregando, setCarregando] = useState(false);
    const [resultado, setResultado] = useState<SimCompareResult | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    const rodar = async () => {
        setCarregando(true);
        setErro(null);
        try {
            const res = await compararNoSimc(base, candidate, scenario, 3000);
            setResultado(res);
        } catch (e: any) {
            setErro(e?.message || 'Falha ao rodar o SimC.');
        } finally {
            setCarregando(false);
        }
    };

    const deltaPositivo = resultado ? resultado.delta_pct >= 0 : false;

    return (
        <div className="mt-4 p-4 rounded-xl border border-purple-700/50 bg-purple-950/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Gauge className="w-5 h-5 text-purple-300" />
                    <div>
                        <h3 className="text-sm font-bold text-white">DPS medido no SimulationCraft</h3>
                        <p className="text-[11px] text-zinc-400">
                            Roda o <code className="text-purple-300">simc</code> de verdade para {candidateLabel} vs peça atual.
                        </p>
                    </div>
                </div>
                <button
                    onClick={rodar}
                    disabled={carregando}
                    className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white text-sm font-semibold transition"
                >
                    {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    <span>{carregando ? 'Simulando...' : 'Rodar SimC real'}</span>
                </button>
            </div>

            {erro && (
                <div className="mt-3 flex items-start space-x-2 text-sm text-rose-300 bg-rose-950/50 border border-rose-800 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{erro}</span>
                </div>
            )}

            {resultado && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                        <div className="text-[10px] uppercase text-zinc-500">Base (atual)</div>
                        <div className="text-lg font-bold text-zinc-100">{numero(resultado.base_dps)}</div>
                    </div>
                    <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                        <div className="text-[10px] uppercase text-zinc-500">Candidato</div>
                        <div className="text-lg font-bold text-zinc-100">{numero(resultado.candidate_dps)}</div>
                    </div>
                    <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                        <div className="text-[10px] uppercase text-zinc-500">Delta</div>
                        <div className={`text-lg font-bold ${deltaPositivo ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {resultado.delta_pct >= 0 ? '+' : ''}
                            {resultado.delta_pct.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%
                        </div>
                    </div>
                    <div className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3">
                        <div className="text-[10px] uppercase text-zinc-500">Veredito (erro)</div>
                        <div className="text-sm font-bold text-zinc-100">{resultado.veredito}</div>
                    </div>
                    <div className="col-span-2 md:col-span-4 text-[10px] text-zinc-500">
                        Empate por erro: limiar {resultado.limiar_pct.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}pp ·
                        erro base {resultado.erro_base_pct ?? '—'}% · erro cand {resultado.erro_cand_pct ?? '—'}% · cenário {resultado.cenario}
                    </div>
                </div>
            )}
        </div>
    );
};
