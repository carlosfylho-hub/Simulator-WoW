import { erroDaResposta } from './erroApi';
/**
 * Validação de combinação SimC + AMR (endpoint /api/import/combinar).
 *
 * Não executa simulação: só reporta o que o merge produz (raça, nº de itens,
 * possuídos, fontes e avisos de conflito) para o usuário conferir antes de rodar.
 */

export interface CombinarAlerta {
    codigo: string;
    severidade: string;
    detalhe: string;
    linha?: number | null;
}

export interface CombinacaoResultado {
    nome: string | null;
    classe: string | null;
    spec: string | null;
    nivel: number | null;
    raca: string | null;
    primario: 'simc' | 'amr';
    fontes: string[];
    itens: number;
    slots: string[];
    possuidos: number;
    talentos: boolean;
    avisos: CombinarAlerta[];
}

export interface CombinarRequest {
    simc?: string | null;
    amr?: string | null;
    primario?: 'simc' | 'amr';
    classe_hint?: string | null;
    spec_hint?: string | null;
    incluir_inv?: boolean;
}

// Lista de erros de validação vira texto legível (antes aparecia "[object Object]").
const erro = erroDaResposta;

export async function validarCombinacao(pedido: CombinarRequest): Promise<CombinacaoResultado> {
    const resposta = await fetch('/api/import/combinar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
    });
    if (!resposta.ok) throw await erro(resposta);
    return resposta.json();
}
