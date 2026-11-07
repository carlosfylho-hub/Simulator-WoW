import { CatalogItemLite } from '../data/items';

export interface CatalogItem extends CatalogItemLite {
    slot?: string | null;
    ilvl?: number | null;
    bonus_id?: number | null;
    fonte?: string;
    alvo?: boolean;
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
