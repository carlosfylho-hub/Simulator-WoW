import type { TopGearConjunto } from './topGearService';

export type DropStatus = 'pending' | 'running' | 'done' | 'error' | 'cancelled';
export type DropModo = 'upgrade' | 'best_in_bags' | 'worst_in_bags';
export type DropVeredito = 'ganho' | 'perda' | 'empate';

export interface DropRankingItem {
    slot: string;
    item_id: number | null;
    nome_pt: string | null;
    ilvl: number | null;
    dps: number;
    delta_pct: number;
    limiar_pct: number;
    veredito: DropVeredito;
}

export interface DropResult {
    modo: DropModo;
    base_dps: number;
    iterations: number;
    itens: DropRankingItem[];
    /** Conjunto final montado (só no modo best_in_bags), medido pelo SimulationCraft. */
    conjunto?: TopGearConjunto | null;
    conjunto_dps?: number | null;
    delta_conjunto_pct?: number | null;
    avisos: string[];
}

export interface DropProgresso {
    modo?: DropModo;
    candidatos?: number;
    base_dps?: number;
}

export interface DropJob {
    id: string;
    status: DropStatus;
    request: Record<string, unknown>;
    progresso: DropProgresso | null;
    resultado: DropResult | null;
    erro: string | null;
    cancelado: boolean;
    created_at: string | null;
    started_at: string | null;
    finished_at: string | null;
}

export interface DropRequest {
    addon: string;
    amr?: string | null;
    primario?: 'simc' | 'amr';
    modo?: DropModo;
    scenario?: string;
    iterations?: number;
    max_profilesets_rodada?: number;
    orcamento_segundos?: number;
    target_error?: number | null;
    pool_por_slot?: number;
    classe_hint?: string | null;
    spec_hint?: string | null;
    incluir_inv?: boolean;
    excluir?: number[];
}

export interface DropEstimativa {
    profilesets_total_estimado: number;
    segundos_estimados: number;
    excede_orcamento: boolean;
    target_error_aplicado: number | null;
    target_error_ignorado: boolean;
    contagens?: Record<string, number>;
    avisos: string[];
}

async function erro(resposta: Response): Promise<Error> {
    try {
        const corpo = await resposta.json();
        return new Error(corpo?.detail || `Falha (${resposta.status})`);
    } catch {
        return new Error(`Falha (${resposta.status})`);
    }
}

export async function estimativaDrop(params: {
    addon: string;
    pool: number;
    iterations: number;
    orcamento_segundos: number;
    target_error?: number | null;
    max_profilesets_rodada?: number;
}): Promise<DropEstimativa> {
    const query = new URLSearchParams({
        addon: params.addon,
        pool: String(params.pool),
        iterations: String(params.iterations),
        orcamento_segundos: String(params.orcamento_segundos),
        max_profilesets_rodada: String(params.max_profilesets_rodada ?? 300),
    });
    if (params.target_error != null) query.set('target_error', String(params.target_error));
    const resposta = await fetch(`/api/droptimizer/estimativa?${query.toString()}`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function criarDrop(pedido: DropRequest): Promise<{ id: string; status: DropStatus }> {
    const resposta = await fetch('/api/droptimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
    });
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function consultarDrop(id: string): Promise<DropJob> {
    const resposta = await fetch(`/api/droptimizer/${id}`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function resultadoDrop(id: string): Promise<DropResult> {
    const resposta = await fetch(`/api/droptimizer/${id}/resultado`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function cancelarDrop(id: string): Promise<{ id: string; cancelado: boolean }> {
    const resposta = await fetch(`/api/droptimizer/${id}/cancelar`, { method: 'POST' });
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function listarDrop(): Promise<{ jobs: DropJob[] }> {
    const resposta = await fetch('/api/droptimizer');
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export const ROTULO_MODO: Record<DropModo, string> = {
    upgrade: 'Find Upgrade (achar upgrade)',
    best_in_bags: 'Best in Bags (melhores das bolsas)',
    worst_in_bags: 'Worst in Bags (piores das bolsas)',
};
