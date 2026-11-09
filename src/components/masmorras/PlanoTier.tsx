import React from 'react';
import { PlanoTier } from '../../services/masmorrasService';
import { Aviso, Cartao, Delta, ItemIcone } from '../../ui';
import { slotPt } from './rotulos';

/** T23 — cartão "Plano de tier set": quais peças catalisar para fechar 4 peças. */
export const PlanoTierCartao: React.FC<{ plano: PlanoTier }> = ({ plano }) => {
    if (!plano.disponivel) {
        return (
            <Cartao titulo="Plano de tier set">
                <p className="text-sm text-texto-2">{plano.motivo ?? 'Plano de tier indisponível.'}</p>
            </Cartao>
        );
    }
    const ja = plano.ja_equipadas ?? [];
    const melhor = plano.melhor;
    const outras = (plano.combinacoes ?? []).slice(1, 4);
    return (
        <Cartao titulo="Plano de tier set (4 peças)">
            <p className="-mt-1 mb-3 text-xs text-texto-3">
                Peças catalisadas em {plano.nivel} · já equipadas:{' '}
                {ja.length ? ja.map(slotPt).join(', ') : 'nenhuma'} · faltam{' '}
                <span className="num text-texto">{plano.faltam ?? 0}</span>
            </p>
            {!melhor ? (
                <p className="text-sm text-texto-2">{plano.motivo ?? 'Nenhuma combinação foi medida.'}</p>
            ) : (
                <>
                    <div className="mb-2 flex items-baseline gap-2 text-sm">
                        <span className="text-texto-2">Melhor plano, medido com o conjunto inteiro:</span>
                        <Delta valor={melhor.ganho_pct} limiar={melhor.limiar_pct} />
                        <span className="text-xs text-texto-3">
                            · usa <span className="num">{melhor.conversoes}</span> carga(s) do Catalisador
                        </span>
                    </div>
                    <div className="space-y-1">
                        {melhor.pecas.map((p) => (
                            <div
                                key={p.slot}
                                className="grid grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-superficie-2"
                            >
                                <span className="text-xs text-texto-3">{slotPt(p.slot)}</span>
                                <ItemIcone itemId={p.fonte_item_id} nome={p.fonte_nome ?? `Item ${p.fonte_item_id}`} slot={p.slot} />
                                <span className="truncate text-xs text-texto-2">
                                    {p.masmorra} → catalisar em{' '}
                                    <span className="text-texto">{p.nome_tier ?? `item ${p.item_tier}`}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                    {outras.length > 0 && (
                        <details className="mt-2 text-xs text-texto-3">
                            <summary className="cursor-pointer text-texto-2 hover:text-texto">Outras combinações</summary>
                            <ul className="mt-1 space-y-1">
                                {outras.map((c) => (
                                    <li key={c.slots.join(',')} className="flex gap-2">
                                        <span>{c.slots.map(slotPt).join(' + ')}</span>
                                        <Delta valor={c.ganho_pct} limiar={c.limiar_pct} />
                                    </li>
                                ))}
                            </ul>
                        </details>
                    )}
                    <p className="mt-2 text-xs text-texto-3">
                        As masmorras com peças deste plano aparecem primeiro na lista abaixo. O ganho já inclui o bônus de
                        2 e 4 peças.
                    </p>
                </>
            )}
            {(plano.sem_fonte?.length ?? 0) > 0 && (
                <div className="mt-2">
                    <Aviso tom="info">
                        Sem item de masmorra que vire tier em: {plano.sem_fonte!.map(slotPt).join(', ')}.
                    </Aviso>
                </div>
            )}
        </Cartao>
    );
};
