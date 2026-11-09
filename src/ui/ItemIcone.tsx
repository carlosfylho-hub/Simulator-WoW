import React from 'react';
import { useItemTooltip } from '../context/TooltipContext';
import { getItemById, getItemIconUrl } from '../data/items';

interface Props {
    itemId: number | null | undefined;
    icone?: string | null;
    nome: string;
    slot?: string;
    ilvl?: number | null;
    stats?: Record<string, number> | null;
    /** Fonte exibida na tooltip (ex.: "Craft (Mítico Q5)", "Grande Cofre"). */
    fonte?: string | null;
    /** Selo curto da fonte (ex.: "Craftado"). */
    roleTag?: string | null;
    tamanho?: number;
}

/** Ícone + nome do item com o tooltip do jogo (PT-BR) ao passar o mouse. */
export const ItemIcone: React.FC<Props> = ({
    itemId,
    icone,
    nome,
    slot,
    ilvl,
    stats,
    fonte,
    roleTag,
    tamanho = 24,
}) => {
    const { showTooltip, hideTooltip } = useItemTooltip();
    const url = icone
        ? `https://wow.zamimg.com/images/wow/icons/medium/${icone}.jpg`
        : getItemIconUrl(getItemById(itemId ?? -1));
    return (
        <span
            className="inline-flex min-w-0 items-center gap-2 cursor-help"
            onMouseEnter={(e) =>
                itemId != null &&
                showTooltip(itemId, e, {
                    slot,
                    itemPt: nome,
                    ilvl: ilvl ?? undefined,
                    icon: icone ?? undefined,
                    stats: stats ?? undefined,
                    sourceLocation: fonte ?? undefined,
                    roleTag: roleTag ?? undefined,
                })
            }
            onMouseLeave={hideTooltip}
        >
            <img
                src={url}
                alt=""
                loading="lazy"
                width={tamanho}
                height={tamanho}
                className="shrink-0 rounded border border-borda"
            />
            <span className="truncate">{nome}</span>
        </span>
    );
};
