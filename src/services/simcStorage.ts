/**
 * Last /simc import persistence.
 *
 * The desktop app opens on a random local port, so localStorage is only a
 * fast cache: the authoritative copy lives in the backend SQLite and is read
 * through /api/perfil/importacao.
 */

const CHAVE = 'wowsim.simc.import';
const CHAVE_LEGADA = 'topgear.addon';

export function carregarImportLocal(): string | null {
    try {
        const atual = localStorage.getItem(CHAVE);
        if (atual && atual.trim().length >= 20) return atual;
        const legado = localStorage.getItem(CHAVE_LEGADA);
        if (legado && legado.trim().length >= 20) {
            localStorage.setItem(CHAVE, legado);
            return legado;
        }
    } catch {
        /* localStorage indisponível */
    }
    return null;
}

export function salvarImportLocal(texto: string): void {
    try {
        if (texto && texto.trim().length >= 20) {
            localStorage.setItem(CHAVE, texto);
        }
    } catch {
        /* ignora quota/modo privado */
    }
}

export function limparImportLocal(): void {
    try {
        localStorage.removeItem(CHAVE);
    } catch {
        /* ignora */
    }
}

export async function carregarImportRemoto(): Promise<string | null> {
    try {
        const resposta = await fetch('/api/perfil/importacao');
        if (!resposta.ok) return null;
        const dados = await resposta.json();
        return typeof dados?.texto === 'string' && dados.texto.trim().length >= 20
            ? dados.texto
            : null;
    } catch {
        return null;
    }
}

export async function salvarImportRemoto(texto: string): Promise<void> {
    if (!texto || texto.trim().length < 20) return;
    try {
        await fetch('/api/perfil/importacao', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto }),
        });
    } catch {
        /* backend offline: o cache local ainda guarda o texto */
    }
}

/** Save locally and (fire-and-forget) in the backend. */
export function salvarImport(texto: string): void {
    if (!texto || texto.trim().length < 20) return;
    salvarImportLocal(texto);
    void salvarImportRemoto(texto);
}
