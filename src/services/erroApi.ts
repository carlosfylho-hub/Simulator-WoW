/**
 * Mensagem de erro legível a partir da resposta da API.
 *
 * O FastAPI devolve ``detail`` como texto OU como lista de erros de validação
 * ({loc, msg, input, ctx}). Antes a lista virava "[object Object]" na tela.
 */

const CAMPOS: Record<string, string> = {
    iteracoes_triagem: 'Iterações da triagem',
    iteracoes_refino: 'Iterações do refino',
    orcamento_segundos: 'Tempo máximo',
    max_refino: 'Itens no refino',
    iteracoes_pesos: 'Iterações da escala do Pawn',
    addon: 'Export do SimC',
    amr: 'Export do AMR',
    ilvl: 'Nível do item',
    rank: 'Rank',
    trilha: 'Trilha',
    loadouts: 'Builds',
    pesos_loadouts: 'Peso das builds',
    scenario: 'Cenário',
};

function traduzir(msg: string, ctx?: Record<string, unknown>): string {
    if (ctx && 'ge' in ctx) return `precisa ser no mínimo ${ctx.ge}`;
    if (ctx && 'le' in ctx) return `pode ser no máximo ${ctx.le}`;
    if (ctx && 'gt' in ctx) return `precisa ser maior que ${ctx.gt}`;
    if (ctx && 'max_length' in ctx) return `passou do tamanho máximo (${ctx.max_length})`;
    if (/field required|missing/i.test(msg)) return 'é obrigatório';
    if (/valid integer|valid number/i.test(msg)) return 'precisa ser um número inteiro';
    if (/Input should be/i.test(msg)) return `valor inválido (${msg.replace(/^Input should be /i, 'esperado: ')})`;
    return msg;
}

export async function erroDaResposta(resposta: Response): Promise<Error> {
    try {
        const corpo = await resposta.json();
        const detalhe = corpo?.detail;
        if (Array.isArray(detalhe)) {
            const linhas = detalhe.map((d: any) => {
                const campo = Array.isArray(d?.loc) ? String(d.loc[d.loc.length - 1]) : '';
                const nome = CAMPOS[campo] ?? campo;
                return `${nome}: ${traduzir(String(d?.msg ?? ''), d?.ctx)}`;
            });
            return new Error(linhas.join(' · '));
        }
        if (typeof detalhe === 'string' && detalhe) return new Error(detalhe);
        return new Error(`Falha (${resposta.status})`);
    } catch {
        return new Error(`Falha (${resposta.status})`);
    }
}
