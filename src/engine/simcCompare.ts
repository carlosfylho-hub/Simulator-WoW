import { ParsedSimcProfile, ParsedSimcItem, WowItem, ItemSlot, ActiveSpec } from '../types/wow';
import { serializeSimcProfile } from './simcExporter';

// Track ceiling bonuses: heroic/mythic 6/6, with and without the venom forge.
export const BONUS_POR_ILVL: Record<number, number> = {
    321: 12846, // Herói 6/6
    328: 12848, // Herói 6/6 + Forjado com Peçonha
    334: 12854, // Mítico 6/6
    341: 12856, // Mítico 6/6 + Forjado com Peçonha
};

export function bonusParaIlvl(ilvl?: number): number | undefined {
    if (ilvl && BONUS_POR_ILVL[ilvl]) return BONUS_POR_ILVL[ilvl];
    return undefined;
}

// Inverse map: upgrade bonus id -> item level, used to recover the real ilvl
// of an equipped item from the imported bonus_ids when the export omits it.
export const ILVL_POR_BONUS: Record<number, number> = {
    12846: 321,
    12848: 328,
    12854: 334,
    12856: 341,
};

export function ilvlDosBonusIds(bonusIds?: number[]): number | undefined {
    if (!bonusIds) return undefined;
    for (const bonus of bonusIds) {
        if (ILVL_POR_BONUS[bonus]) return ILVL_POR_BONUS[bonus];
    }
    return undefined;
}

export function buildBaseProfile(profile: ParsedSimcProfile, spec: ActiveSpec): string {
    return serializeSimcProfile(profile, spec);
}

export function buildCandidateProfile(
    profile: ParsedSimcProfile,
    spec: ActiveSpec,
    slot: ItemSlot,
    candidate: WowItem
): string {
    const atual = profile.equipped[slot];
    const bonus = bonusParaIlvl(candidate.ilvl);
    const novo: ParsedSimcItem = {
        slot,
        id: candidate.id,
        ilvl: candidate.ilvl,
        enchantId: atual?.enchantId,
        gemId: atual?.gemId,
        // Prefer the fixed track bonus for the candidate's ilvl; otherwise keep the
        // currently equipped item's bonus ids so the comparison stays valid.
        bonusIds: bonus ? [bonus] : atual?.bonusIds,
        craftedStats: atual?.craftedStats,
        craftingQuality: atual?.craftingQuality,
        rawString: '',
    };
    const equipped = { ...profile.equipped, [slot]: novo };
    return serializeSimcProfile({ ...profile, equipped }, spec);
}

export interface SimCompareResult {
    cenario: string;
    base_dps: number;
    candidate_dps: number;
    delta_pct: number;
    limiar_pct: number;
    veredito: string;
    erro_base_pct?: number | null;
    erro_cand_pct?: number | null;
    meta?: Record<string, unknown>;
}

export async function compararNoSimc(
    base: string,
    candidate: string,
    scenario: string,
    iterations = 3000
): Promise<SimCompareResult> {
    const resposta = await fetch('/api/sim/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base, candidate, scenario, iterations }),
    });
    if (!resposta.ok) {
        let detalhe = '';
        try {
            detalhe = JSON.stringify(await resposta.json());
        } catch {
            detalhe = await resposta.text();
        }
        throw new Error(`SimC falhou (${resposta.status}): ${detalhe}`);
    }
    return (await resposta.json()) as SimCompareResult;
}
