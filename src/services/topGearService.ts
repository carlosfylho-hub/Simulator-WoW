export type TopGearStatus = 'pending' | 'running' | 'done' | 'error' | 'cancelled';

export interface TopGearCandidato {
    slot: string;
    item_id: number | null;
    enchant_id: number | null;
    gem_ids: number[];
    bonus_id: number | null;
    bonus_ids: number[];
    ilvl: number | null;
    nome_pt: string | null;
    nome_en: string | null;
    tipo_arma?: string;
    tipo_efeito?: string | null;
    stats?: Record<string, number> | null;
    icone?: string | null;
}

export interface TopGearConjunto {
    itens: Record<string, TopGearCandidato>;
    talentos: string | null;
    runas_folio: string[];
    flask: string | null;
    potion: string | null;
    food: string | null;
    augmentation: string | null;
}

export interface TopGearTroca {
    slot: string;
    de: string | null;
    para: string | null;
    delta_pct: number | null;
    de_item_id: number | null;
    para_item_id: number | null;
}

export interface TopGearRodada {
    numero: number;
    estagio: string;
    dps: number | null;
    delta_pct: number | null;
    candidatos: number;
    trocas: number;
    duracao_s?: number | null;
}

export interface TopGearResultado {
    melhor: TopGearConjunto;
    base: TopGearConjunto | null;
    base_dps: number;
    melhor_dps: number;
    delta_pct: number;
    limiar_pct: number;
    trocas: TopGearTroca[];
    rodadas: TopGearRodada[];
    avisos: string[];
}

export interface TopGearProgresso {
    rodada?: number;
    estagio?: string;
    candidatos?: number;
    melhor_dps?: number;
}

export interface TopGearJob {
    id: string;
    status: TopGearStatus;
    request: Record<string, unknown>;
    progresso: TopGearProgresso | null;
    resultado: TopGearResultado | null;
    erro: string | null;
    cancelado: boolean;
    created_at: string | null;
    started_at: string | null;
    finished_at: string | null;
}

export interface TopGearPoolsResumo {
    classe: string | null;
    spec: string | null;
    tipo_armadura?: string | null;
    atributo?: string | null;
    avisos?: string[];
    contagens: Record<string, number>;
    itens: Record<string, Array<{
        item_id: number | null;
        nome_pt: string | null;
        nome_en: string | null;
        ilvl: number | null;
        bonus_id: number | null;
        slot: string;
    }>>;
}

export interface TopGearArquivoSalvo {
    caminho: string;
    pasta: string;
    arquivo: string;
    linhas: number;
}

export interface TopGearRequest {
    addon: string;
    amr?: string | null;
    primario?: 'simc' | 'amr';
    scenario?: string;
    iterations_triagem?: number;
    iterations_refino?: number;
    orcamento_segundos?: number;
    target_error?: number | null;
    pool_por_slot?: number;
    max_profilesets_rodada?: number;
    incluir?: string[];
    slots_travados?: Record<string, number>;
    talentos_extra?: string[];
    // Poda heurística: top-K por slot antes do SimC (berloques/armas preservados).
    podar?: boolean;
    pool_efetiva_por_slot?: number;
    verificar_podados?: boolean;
}

export interface TopGearHeuristicaItem {
    item_id: number | null;
    nome_pt: string | null;
    nome_en: string | null;
    ilvl: number | null;
    score: number;
    breakdown: Record<string, number>;
}

export interface TopGearHeuristica {
    classe: string | null;
    spec: string | null;
    heuristico: boolean;
    fonte_pesos: string;
    por_slot: Record<string, TopGearHeuristicaItem[]>;
    avisos: string[];
}

export interface TopGearEstimativa {
    profilesets_total_estimado: number;
    segundos_estimados: number;
    excede_orcamento: boolean;
    target_error_aplicado: number | null;
    target_error_ignorado: boolean;
    contagens?: Record<string, number>;
    avisos: string[];
}

export async function estimativaTopGear(params: {
    addon: string;
    pool: number;
    iterations: number;
    orcamento_segundos: number;
    target_error?: number | null;
    max_profilesets_rodada?: number;
}): Promise<TopGearEstimativa> {
    const query = new URLSearchParams({
        addon: params.addon,
        pool: String(params.pool),
        iterations: String(params.iterations),
        orcamento_segundos: String(params.orcamento_segundos),
        max_profilesets_rodada: String(params.max_profilesets_rodada ?? 300),
    });
    if (params.target_error != null) query.set('target_error', String(params.target_error));
    const resposta = await fetch(`/api/topgear/estimativa?${query.toString()}`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function heuristicaTopGear(
    addon: string,
    pool: number,
    top = 6,
): Promise<TopGearHeuristica> {
    const params = new URLSearchParams({ addon, pool: String(pool), top: String(top) });
    const resposta = await fetch(`/api/topgear/heuristica?${params.toString()}`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

async function erro(resposta: Response): Promise<Error> {
    try {
        const corpo = await resposta.json();
        return new Error(corpo?.detail || `Falha (${resposta.status})`);
    } catch {
        return new Error(`Falha (${resposta.status})`);
    }
}

export async function criarTopGear(pedido: TopGearRequest): Promise<{ id: string; status: TopGearStatus }> {
    const resposta = await fetch('/api/topgear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
    });
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function consultarTopGear(id: string): Promise<TopGearJob> {
    const resposta = await fetch(`/api/topgear/${id}`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function resultadoTopGear(id: string): Promise<TopGearResultado> {
    const resposta = await fetch(`/api/topgear/${id}/resultado`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function perfilTopGear(id: string): Promise<{ simc: string }> {
    const resposta = await fetch(`/api/topgear/${id}/perfil`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

/**
 * Grava o `.simc` otimizado no disco pelo backend e devolve o caminho.
 *
 * A janela do app desktop (pywebview) não tem gerenciador de download: clicar
 * num link `blob:` não gerava arquivo nem erro.
 */
export async function salvarPerfilTopGear(id: string): Promise<TopGearArquivoSalvo> {
    const resposta = await fetch(`/api/topgear/${id}/perfil/salvar`, { method: 'POST' });
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function cancelarTopGear(id: string): Promise<{ id: string; cancelado: boolean }> {
    const resposta = await fetch(`/api/topgear/${id}/cancelar`, { method: 'POST' });
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function previaPools(
    addon: string,
    pool: number,
    tipoArmadura?: string,
    atributo?: string,
): Promise<TopGearPoolsResumo> {
    // Armor/attribute are derived from the class on the backend when omitted.
    const params = new URLSearchParams({ addon, pool: String(pool) });
    if (tipoArmadura) params.set('tipo_armadura', tipoArmadura);
    if (atributo) params.set('atributo', atributo);
    const resposta = await fetch(`/api/topgear/pools?${params.toString()}`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}
