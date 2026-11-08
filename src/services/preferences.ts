/**
 * Preferências persistidas no backend (SQLite), não só no localStorage.
 *
 * O app desktop abre numa porta local aleatória a cada execução; como a origem
 * inclui a porta, o localStorage não sobrevive entre reinícios. O backend é a
 * fonte confiável — aqui mantemos um cache em memória e gravamos por chave.
 */

let _cache: Record<string, string> | null = null;
let _promessa: Promise<Record<string, string>> | null = null;

export function obterTodasPreferencias(): Promise<Record<string, string>> {
    if (_cache) return Promise.resolve(_cache);
    if (!_promessa) {
        _promessa = fetch('/api/preferencias')
            .then((r) => (r.ok ? r.json() : {}))
            .then((d: { preferencias?: Record<string, string> } | null) => {
                _cache = d?.preferencias ?? {};
                return _cache;
            })
            .catch(() => {
                _cache = {};
                return _cache as Record<string, string>;
            });
    }
    return _promessa;
}

export async function carregarPreferencia(chave: string): Promise<string | null> {
    const todas = await obterTodasPreferencias();
    return todas[chave] ?? null;
}

export function salvarPreferencia(chave: string, valor: string): void {
    agendarSalvarPreferencia(chave, valor);
}

let _pendentes: Record<string, string> = {};
let _timer: number | null = null;

/**
 * Acumula gravações e envia todas num único PUT após 500 ms. Evita uma
 * requisição por campo no boot.
 */
export function agendarSalvarPreferencia(chave: string, valor: string): void {
    _pendentes[chave] = valor;
    if (_cache) _cache[chave] = valor;
    if (_timer != null) return;
    _timer = window.setTimeout(() => {
        const lote = _pendentes;
        _pendentes = {};
        _timer = null;
        if (Object.keys(lote).length === 0) return;
        try {
            void fetch('/api/preferencias', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ preferencias: lote }),
            }).catch(() => {
                /* backend offline: localStorage ainda guarda o valor */
            });
        } catch {
            /* fetch indisponível */
        }
    }, 500);
}
