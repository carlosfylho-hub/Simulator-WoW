/**
 * Last AskMrRobot import persistence (complements the SimC import).
 *
 * The AMR string carries data the /simc export lacks: race/faction, the
 * `.inv` inventory (bags + Great Vault), `.hlv` watermarks and per-item
 * content tuning / crafting quality. It is merged with the SimC profile.
 */

import { carregarPreferencia, salvarPreferencia } from './preferences';

const CHAVE = 'wowsim.amr.import';
const CHAVE_BACKEND = 'amr.import';
const EVENTO = 'wowsim:amr-changed';

export function carregarAmrLocal(): string | null {
    try {
        const atual = localStorage.getItem(CHAVE);
        if (atual && atual.trim().length >= 20) return atual;
    } catch {
        /* localStorage indisponível */
    }
    return null;
}

export function salvarAmrLocal(texto: string): void {
    if (!texto || texto.trim().length < 20) return;
    try {
        localStorage.setItem(CHAVE, texto);
        window.dispatchEvent(new CustomEvent(EVENTO, { detail: texto }));
    } catch {
        /* ignora quota/modo privado */
    }
    // Persiste no backend: o localStorage é perdido quando a porta muda.
    salvarPreferencia(CHAVE_BACKEND, texto);
}


/** Lê o último export AMR do backend (sobrevive ao port aleatório). */
export async function carregarAmrRemoto(): Promise<string | null> {
    const valor = await carregarPreferencia(CHAVE_BACKEND);
    return valor && valor.trim().length >= 20 ? valor : null;
}

export function limparAmrLocal(): void {
    try {
        localStorage.removeItem(CHAVE);
        window.dispatchEvent(new CustomEvent(EVENTO, { detail: null }));
    } catch {
        /* ignora */
    }
}

/**
 * Escuta mudanças no AMR compartilhado (mesma chave entre as abas).
 *
 * Cobre tanto o evento custom desta aba (salvarAmrLocal) quanto o evento
 * `storage` disparado quando outra aba grava o valor. Retorna um unsubscribe.
 */
export function assinarAmrLocal(callback: (texto: string | null) => void): () => void {
    const aoCustom = (ev: Event) => {
        const detalhe = (ev as CustomEvent<string | null>).detail;
        callback(detalhe ?? carregarAmrLocal());
    };
    const aoStorage = (ev: StorageEvent) => {
        if (ev.key === CHAVE) {
            const valor = ev.newValue && ev.newValue.trim().length >= 20 ? ev.newValue : null;
            callback(valor);
        }
    };
    window.addEventListener(EVENTO, aoCustom);
    window.addEventListener('storage', aoStorage);
    return () => {
        window.removeEventListener(EVENTO, aoCustom);
        window.removeEventListener('storage', aoStorage);
    };
}
