import { erroDaResposta } from './erroApi';
export type RankingStatus = 'pending' | 'running' | 'done' | 'error' | 'cancelled';
export type Etiqueta = 'direto' | 'catalisar' | 'ambos' | 'nao_serve';

export interface ItemRanking {
    item_id: number;
    nome_pt: string | null;
    nome_en: string | null;
    slot: string;
    ilvl: number;
    etiqueta: Etiqueta;
    delta_cru_pct: number;
    delta_catalisado_pct: number | null;
    limiar_pct: number;
    icone: string | null;
    stats: Record<string, number> | null;
    aviso: string | null;
    degrau?: string | null;
    upgrade?: Upgrade | null;
}

/** Brasões para levar o item ao 6/6 da trilha (custo cheio, sem desconto de slot). */
export interface Upgrade {
    moeda: string;
    brasoes: number;
    etapas: number;
    ate: string;
}

export interface MasmorraRanking {
    masmorra: string;
    servem: number;
    elegiveis: number;
    chance_pct: number;
    maior_pct: number;
    direto: number;
    catalisar: number;
    explicacao: string;
    itens: ItemRanking[];
}

export interface TrocaBuild {
    slot: string;
    item_id: number | null;
    nome_pt: string | null;
    nome_en: string | null;
    ilvl: number | null;
    catalisado: boolean;
    ganho_pct: number;
    icone: string | null;
    stats?: Record<string, number> | null;
    degrau?: string | null;
    upgrade?: Upgrade | null;
}

export interface BuildResultado {
    nome: string;
    cenario: string;
    ref_dps: number | null;
    delta_conjunto_pct: number | null;
    limiar_conjunto_pct: number | null;
    trocas: TrocaBuild[];
    conjunto_itens: Record<string, unknown>[];
    avisos: string[];
    pawn: string | null;
    pawn_pesos: Record<string, number> | null;
    brasoes?: Record<string, number>;
}

export interface LinhaMatriz {
    item_id: number;
    nome_pt: string | null;
    nome_en: string | null;
    masmorra: string;
    slot: string;
    icone: string | null;
    stats?: Record<string, number> | null;
    deltas: Record<string, number>;
    limiares: Record<string, number>;
    etiquetas: Record<string, Etiqueta>;
    media_pct: number;
    divergente: boolean;
}

export interface BuildDisponivel {
    nome: string;
    cenario_sugerido: string;
}

export interface CraftPeca {
    slot: string;
    item_id: number;
    nome_pt: string | null;
    nome_en: string | null;
    missiva: string;
    secundarios: string[];
    ganho_pct: number;
    limiar_pct: number;
    serve: boolean;
    embutido: boolean;
    ilvl: number;
    icone?: string | null;
    stats?: Record<string, number> | null;
}

/** Peça que estouraria o limite de 2 embelezamentos e por isso não foi medida. */
export interface CraftBloqueado {
    slot: string;
    item_id: number;
    nome_pt: string | null;
    nome_en: string | null;
    embutido: boolean;
    motivo: string;
}

export interface CraftEmbelezamento {
    nome_pt: string | null;
    nome_en: string;
    descricao: string | null;
    reagente_id: number;
    slot_medido: string;
    /** adicionar = peça nova + efeito; troca = reagente; peca = substitui embutida. */
    tipo?: 'adicionar' | 'troca' | 'peca';
    /** O que está sendo trocado (nome do embelezamento ou id da peça embutida). */
    troca_de?: string | null;
    /** Dados visuais do Wowhead (A8): só exibição, nunca entram em cálculo. */
    icone_url?: string | null;
    texto_completo?: string | null;
    materiais?: string[];
    usado_em?: string[];
    ganho_pct: number;
    ganho_total_pct: number;
    limiar_pct: number;
}

export interface CraftResultado {
    pecas: CraftPeca[];
    embelezamentos: CraftEmbelezamento[];
    bloqueados?: CraftBloqueado[];
    custo: { ilvl: number; nivel: string; brasoes: number; moeda: string; centelhas: number; nota: string };
    limite_embelezamentos: string;
    avisos: string[];
}

export interface RankingResult {
    base_dps: number;
    cenario: string;
    ilvl: number;
    nivel?: string | null;
    iteracoes: number;
    ordem_padrao: 'quantidade';
    masmorras: MasmorraRanking[];
    premissa_chance: string;
    avisos: string[];
    /** Informações neutras (ex.: .inv mesclado), fora dos avisos âmbar (P-053). */
    informacoes?: string[];
    builds: BuildResultado[];
    matriz: LinhaMatriz[];
    pesos_builds: Record<string, number>;
    pawn_atual: string | null;
    pawn_mistura: string | null;
    pawn_iguais: string[][];
    craft?: CraftResultado | null;
}

export interface RankingProgresso {
    estagio?: string;
    duracao_s?: number;
}

export interface RankingJob {
    id: string;
    status: RankingStatus;
    request: Record<string, unknown>;
    progresso: RankingProgresso | null;
    resultado: RankingResult | null;
    erro: string | null;
    cancelado: boolean;
    created_at: string | null;
    started_at: string | null;
    finished_at: string | null;
}

export interface RankingRequest {
    addon: string;
    amr?: string | null;
    primario?: 'simc' | 'amr';
    scenario?: string;
    modo?: 'masmorras' | 'cofre' | 'craft';
    ilvl?: number;
    trilha?: 'heroi' | 'mito';
    rank?: number;
    forja?: boolean;
    iteracoes_triagem?: number;
    iteracoes_refino?: number;
    orcamento_segundos?: number;
    loadouts?: string[];
    pesos_loadouts?: Record<string, number>;
    cenarios_loadouts?: Record<string, string>;
    medir_pesos?: boolean;
}

export interface RankingEstimativa {
    profilesets_total_estimado: number;
    segundos_estimados: number;
    elegiveis_total: number;
    contagens: Record<string, number>;
    orcamento_sugerido?: number;
}

// Lista de erros de validação vira texto legível (antes aparecia "[object Object]").
const erro = erroDaResposta;

export async function estimativaRanking(params: {
    addon: string;
    ilvl: number;
    iteracoes_triagem: number;
    iteracoes_refino: number;
    modo?: 'masmorras' | 'cofre' | 'craft';
    amr?: string;
    builds?: number;
    medir_pesos?: boolean;
    scenario?: string;
    cenarios?: string[];
    trilha?: 'heroi' | 'mito';
    rank?: number;
    forja?: boolean;
}): Promise<RankingEstimativa> {
    const query = new URLSearchParams({
        addon: params.addon,
        ilvl: String(params.ilvl),
        iteracoes_triagem: String(params.iteracoes_triagem),
        iteracoes_refino: String(params.iteracoes_refino),
        modo: params.modo ?? 'masmorras',
        builds: String(params.builds ?? 0),
        medir_pesos: String(Boolean(params.medir_pesos)),
    });
    if (params.amr) query.set('amr', params.amr);
    if (params.scenario) query.set('scenario', params.scenario);
    if (params.trilha) {
        query.set('trilha', params.trilha);
        query.set('rank', String(params.rank ?? 6));
        query.set('forja', String(Boolean(params.forja)));
    }
    if (params.cenarios?.length) query.set('cenarios', params.cenarios.join(','));
    const resposta = await fetch(`/api/masmorras/estimativa?${query.toString()}`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function criarRanking(pedido: RankingRequest): Promise<{ id: string; status: RankingStatus }> {
    const resposta = await fetch('/api/masmorras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
    });
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function consultarRanking(id: string): Promise<RankingJob> {
    const resposta = await fetch(`/api/masmorras/${id}`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function resultadoRanking(id: string): Promise<RankingResult> {
    const resposta = await fetch(`/api/masmorras/${id}/resultado`);
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function cancelarRanking(id: string): Promise<{ id: string; cancelado: boolean }> {
    const resposta = await fetch(`/api/masmorras/${id}/cancelar`, { method: 'POST' });
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function listarBuilds(addon: string): Promise<{ builds: BuildDisponivel[] }> {
    const resposta = await fetch('/api/masmorras/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addon }),
    });
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

export async function gerarStringAmr(pedido: {
    modelo: string;
    build: string;
    itens: Record<string, unknown>[];
}): Promise<{ string: string; setup_id: string; aviso: string }> {
    const resposta = await fetch('/api/exportar/amr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
    });
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}

/** Escada de níveis (bonus_ilvl.json / Raidbots; Method.gg). Forja só no 6/6. */
export const ESCADA: Record<'heroi' | 'mito', number[]> = {
    heroi: [305, 308, 311, 315, 318, 321],
    mito: [318, 321, 324, 328, 331, 334],
};
export const ILVL_FORJA: Record<'heroi' | 'mito', number> = { heroi: 328, mito: 341 };

export const ilvlDoNivel = (trilha: 'heroi' | 'mito', rank: number, forja: boolean) =>
    forja && rank === 6 ? ILVL_FORJA[trilha] : ESCADA[trilha][rank - 1];

export const ROTULO_ETIQUETA: Record<Etiqueta, string> = {
    direto: 'upgrade direto',
    catalisar: 'para catalisar',
    ambos: 'upgrade direto, e ainda melhor catalisado',
    nao_serve: 'não serve',
};
