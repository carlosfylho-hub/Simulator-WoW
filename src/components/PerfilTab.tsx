import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { classeSpecPt, usePerfil } from '../context/PerfilContext';
import { AreaTexto, Aviso, Botao, Cartao, Segmentado } from '../ui';

/** Único lugar onde se cola o export. As outras telas leem daqui. */
export const PerfilTab: React.FC<{ onPronto?: () => void }> = ({ onPronto }) => {
    const p = usePerfil();
    const temAmr = p.amr.trim().length >= 20;
    const avisos = (p.resumo?.avisos ?? []).filter((a) => a.severidade !== 'info');

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-semibold text-texto">Perfil</h1>
                <p className="text-sm text-texto-2">Cole os exports uma vez; todas as telas usam este perfil.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Cartao titulo="SimulationCraft (/simc)">
                    <AreaTexto
                        value={p.addon}
                        onChange={(e) => p.setAddon(e.target.value)}
                        placeholder="# Nome - Spec - data…"
                        className="h-56"
                    />
                </Cartao>
                <Cartao titulo={<span>AskMrRobot <span className="text-sm font-normal text-texto-3">(opcional)</span></span>}>
                    <AreaTexto
                        value={p.amr}
                        onChange={(e) => p.setAmr(e.target.value)}
                        placeholder="$181;US;Azralon;Nome;…"
                        className="h-56"
                    />
                    <p className="mt-2 text-xs text-texto-3">
                        Acrescenta raça, mochila (.inv), Grande Cofre (.gv) e nível de cada item.
                    </p>
                </Cartao>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {temAmr && (
                    <>
                        <span className="text-sm text-texto-2">Base dos itens equipados</span>
                        <Segmentado<'simc' | 'amr'>
                            rotuloAria="Base dos itens equipados"
                            opcoes={[
                                { valor: 'simc', rotulo: 'SimC' },
                                { valor: 'amr', rotulo: 'AMR' },
                            ]}
                            valor={p.primario}
                            onChange={p.setPrimario}
                        />
                    </>
                )}
                <div className="flex-1" />
                <Botao variante="secundario" onClick={() => void p.validar()} carregando={p.validando}>
                    Validar agora
                </Botao>
                {onPronto && (
                    <Botao variante="principal" disabled={!p.resumo} onClick={onPronto}>
                        Ir para Masmorras
                    </Botao>
                )}
            </div>

            {p.erro && <Aviso tom="erro">{p.erro}</Aviso>}

            {p.resumo && (
                <Cartao>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        {p.validando ? (
                            <Loader2 className="w-4 h-4 animate-spin text-texto-2" />
                        ) : (
                            <CheckCircle2 className="w-4 h-4 text-ganho" />
                        )}
                        <span className="text-[15px] font-semibold text-texto">{p.resumo.nome ?? 'Personagem'}</span>
                        <span className="text-sm text-texto-2">
                            {[classeSpecPt(p.resumo.classe, p.resumo.spec), p.resumo.raca, p.resumo.nivel && `nível ${p.resumo.nivel}`]
                                .filter(Boolean)
                                .join(' · ')}
                        </span>
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        <Dado rotulo="Itens equipados" valor={p.resumo.itens} />
                        <Dado rotulo="Na mochila" valor={p.resumo.possuidos} />
                        <Dado rotulo="Talentos" valor={p.resumo.talentos ? 'ok' : 'ausentes'} />
                        <Dado rotulo="Fontes" valor={p.resumo.fontes.join(' + ') || '—'} />
                    </dl>
                    {avisos.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-aviso">
                            {avisos.map((a, i) => (
                                <li key={i}>• {a.detalhe}</li>
                            ))}
                        </ul>
                    )}
                </Cartao>
            )}
        </div>
    );
};

const Dado: React.FC<{ rotulo: string; valor: React.ReactNode }> = ({ rotulo, valor }) => (
    <div>
        <dt className="text-xs text-texto-3">{rotulo}</dt>
        <dd className="num text-texto">{valor}</dd>
    </div>
);
