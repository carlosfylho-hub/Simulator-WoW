import { CatalogItemLite } from '../data/items';

export interface CatalogItem extends CatalogItemLite {
    slot?: string | null;
    ilvl?: number | null;
    bonus_id?: number | null;
    fonte?: string;
    alvo?: boolean;
    icon?: string | null;
    craftado?: boolean;
    embellished?: boolean;
    embelezado_embutido?: boolean;
    aceita_embelezamento?: boolean;
    embelezamento_recomendado?: string | null;
    limite_embelezamentos?: number | null;
}

export interface CatalogResponse {
    total: number;
    itens: CatalogItem[];
}

export async function fetchCatalogItems(): Promise<CatalogItem[]> {
    const resposta = await fetch('/api/catalog/items');
    if (!resposta.ok) {
        throw new Error(`Catálogo indisponível (${resposta.status})`);
    }
    const dados = (await resposta.json()) as CatalogResponse;
    return dados.itens || [];
}

/** All known item id -> icon slug (includes raid/tier items outside M+). */
export async function fetchIconMap(): Promise<Record<string, string>> {
    const resposta = await fetch('/api/catalog/icones');
    if (!resposta.ok) {
        throw new Error(`Ícones indisponíveis (${resposta.status})`);
    }
    const dados = await resposta.json();
    return dados.icones || {};
}
