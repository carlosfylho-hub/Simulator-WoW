/**
 * Descrições dos embelezamentos (reagentes de criação).
 *
 * Fonte: `wow-sim/dados/craft_sistemas_s2.json` (campos `fornece_propriedade` /
 * `texto_pt`). A tooltip mostra o nome já existente no item; aqui guardamos a
 * descrição do efeito para exibir junto. Nada é estimado: é o texto do item.
 */

const DESCRICOES: Record<string, string> = {
    'forro de arcanotrama':
        'Seus feitiços e habilidades têm chance de atrair uma moreia de mana que potencializa você e um aliado com Percepção da Arcanotrama, aumentando o atributo primário de ambos.',
    'pedra ritual do caçador':
        'Suas habilidades e feitiços que causam dano têm chance de conceder 101 de um atributo secundário aleatório por 15 s. Durante uma Caça às Presas, este efeito aumenta em 50% (apenas ao ar livre, caçando).',
    'amolita polida':
        'Acertos críticos concedem uma bênção cumulativa que aumenta o seu Acerto Crítico. Com o máximo de aplicações, os acertos críticos causam uma explosão de dano.',
    'cordão de arcanotrama':
        'Equipar: seus feitiços de cura e de dano têm chance de aumentar em 136 a sua Maestria por 12 s.',
    'signo de negraluna: sangue':
        'Suas habilidades que causam dano têm chance de conceder Astúcia do Andarilho, aumentando em 76 o seu segundo atributo mais baixo por 15 s. Quando um aliado morre, você ganha 63 do seu maior atributo secundário por 15 s (1x a cada 5 min).',
    'signo de negraluna: caos':
        'Suas habilidades que causam dano têm chance de envolver você em Vidro Caótico, concedendo 40 de Versatilidade por 15 s. Múltiplas aplicações podem se sobrepor.',
    'signo de negraluna: caçada':
        'Seus feitiços e habilidades têm chance de conceder 56 de atributos secundários por 15 s, conforme o tipo da criatura-alvo.',
    'signo de negraluna: podridão':
        'Atinge o alvo com Raízes Pútridas, causando 113 de dano de Natureza a cada 2 s por 6 s. Acumula até 10 vezes; novos acúmulos não renovam os já aplicados.',
    'domínio de negraluna: sangue':
        'Equipar: suas habilidades que causam dano têm chance de conceder Astúcia do Andarilho, aumentando em 379 o seu segundo atributo mais baixo por 15 s. Quando um aliado morre, você ganha 232 do seu maior secundário por 15 s (1x a cada 5 min).',
    'domínio de negraluna: caos':
        'Equipar: suas habilidades que causam dano têm chance de envolver você em Vidro Caótico, concedendo 105 de Versatilidade por 15 s. Múltiplas aplicações podem se sobrepor.',
    'domínio de negraluna: caçada':
        'Equipar: seus feitiços e habilidades têm chance de conceder 144 atributos secundários por 15 s, conforme o tipo da criatura-alvo.',
    'domínio de negraluna: podridão':
        'Equipar: atinge o alvo com Raízes Pútridas, causando 214 de dano de Natureza a cada 2 s por 6 s. Acumula até 10 vezes.',
};

// Aliases curtos usados em alguns textos do app.
const ALIASES: Record<string, string> = {
    'signo de sangue': 'signo de negraluna: sangue',
    'signo de caos': 'signo de negraluna: caos',
    'signo de caçada': 'signo de negraluna: caçada',
    'signo de podridão': 'signo de negraluna: podridão',
};

export function normalizarEmbelezamento(nome?: string | null): string {
    if (!nome) return '';
    // Remove sufixos de id como " [240167]" e normaliza espaços/caixa.
    return nome
        .replace(/\[[^\]]*\]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

/** Descrição PT-BR do embelezamento, ou undefined se não catalogado. */
export function getEmbellishmentDescription(nome?: string | null): string | undefined {
    const chave = normalizarEmbelezamento(nome);
    if (!chave) return undefined;
    const alvo = ALIASES[chave] ?? chave;
    return DESCRICOES[alvo];
}
