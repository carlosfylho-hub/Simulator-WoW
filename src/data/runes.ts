import { FolioRune, RuneCombination } from '../types/wow';

export const FOLIO_RUNES: FolioRune[] = [
  // Linha 1
  {
    id: '1A',
    row: 1,
    namePt: 'Fogo Incontido',
    nameEn: 'Wildfire',
    nodeId: 1279603,
    buffId: 1287768,
    category: 'ofensiva',
    mechanism: 'Cria um pilar de fogo que causa dano em área ou cura um aliado a cada proc instantâneo da runa.',
    whatItSacrifices: 'Não acumula cargas como 1B; entrega dano imediato desde o primeiro segundo.',
    bestScenarios: ['Imersões (Delves)', 'Masmorras M+', 'Raide curto']
  },
  {
    id: '1B',
    row: 1,
    namePt: 'Orbes do Caos',
    nameEn: 'Chaos Orbs',
    nodeId: 1279604,
    buffId: 1287769,
    category: 'ofensiva',
    mechanism: 'Gera um orbe de caos a cada 10 s, até 5 orbes, gastos sequencialmente ao desferir golpes.',
    whatItSacrifices: 'Exige rampa lenta (ramp de 40 a 50 s) para atingir eficácia máxima.',
    bestScenarios: ['Chefes longos de raide', 'Lutas com início pausado']
  },

  // Linha 2
  {
    id: '2A',
    row: 2,
    namePt: 'Concha Maculada',
    nameEn: 'Tainted Shell',
    nodeId: 1279605,
    buffId: 1287770,
    category: 'defensiva',
    mechanism: 'Gera um escudo de absorção robusto sempre que você recebe um golpe superior a 10% da sua vida máxima.',
    whatItSacrifices: 'Não concede autocura nem velocidade de corrida; focado em prevenir picos de dano (*one-shots*).',
    bestScenarios: ['Masmorras M+ com picos', 'Mecânicas de impacto alto em Delves']
  },
  {
    id: '2B',
    row: 2,
    namePt: 'Autorrecomposição',
    nameEn: 'Self-Restoration',
    nodeId: 1279606,
    buffId: 1287771,
    category: 'defensiva',
    mechanism: 'Dispara uma cura contínua de emergência sempre que a sua vida atual cai abaixo de 75%.',
    whatItSacrifices: 'Não gera escudo preventivo pré-dano; recupera a vida após o impacto.',
    bestScenarios: ['Imersão Tier 11 Solo (Chefe Kindo\'jan)', 'Conteúdo sem curador']
  },
  {
    id: '2C',
    row: 2,
    namePt: 'Reflexos de Lince',
    nameEn: 'Lynx Reflexes',
    nodeId: 1279607,
    buffId: 1287772,
    category: 'utilitaria',
    mechanism: 'Concede +77,5 de velocidade de movimento por 10 s ao ser atingido por um golpe.',
    whatItSacrifices: 'ATENÇÃO: NÃO É MITIGAÇÃO DE DANO. Não reduz dano recebido nem cura; serve exclusivamente para reposicionamento e kiting.',
    bestScenarios: ['Kiting em salas de Delve', 'Esquiva de poças e mecânicas de área']
  },

  // Linha 3
  {
    id: '3A',
    row: 3,
    namePt: 'Perenidade',
    nameEn: 'Perenniality',
    nodeId: 1279608,
    buffId: 1287773,
    category: 'ofensiva',
    mechanism: 'Efeito periódico constante que causa dano ou concede cura ao longo de 8 s. É a base ativadora para a runa capstone 5B.',
    whatItSacrifices: 'Runa única obrigatória na linha 3 do Folio.',
    bestScenarios: ['Todos os cenários']
  },

  // Linha 4
  {
    id: '4A',
    row: 4,
    namePt: 'Caçador Crítico',
    nameEn: 'Critical Hunter',
    nodeId: 1279609,
    buffId: 1287772,
    category: 'ofensiva',
    mechanism: '+52,7 de Acerto Crítico por 10 s a cada ativação da Runa Central, acumulando sobreposições.',
    whatItSacrifices: 'Não concede atributos defensivos; prioriza dano bruto.',
    bestScenarios: ['Raide Alvo Único', 'Builds que escalam com Crítico']
  },
  {
    id: '4B',
    row: 4,
    namePt: 'Ímpeto Acelerado',
    nameEn: 'Accelerated Momentum',
    nodeId: 1279610,
    buffId: 1287774,
    category: 'ofensiva',
    mechanism: '+52,7 de Aceleração por 10 s a cada ativação da Runa Central, acumulando sobreposições.',
    whatItSacrifices: 'Não concede mitigação de dano.',
    bestScenarios: ['Bruxo Demonologia (Aceleração é stat nº 1)', 'Masmorras M+ até +9']
  },
  {
    id: '4C',
    row: 4,
    namePt: 'Maestria Profunda',
    nameEn: 'Deep Mastery',
    nodeId: 1279612,
    buffId: 1287771,
    category: 'ofensiva',
    mechanism: '+52,7 de Maestria por 10 s a cada ativação da Runa Central, acumulando sobreposições.',
    whatItSacrifices: 'Menos flexibilidade que Aceleração.',
    bestScenarios: ['Cenários em que o Crítico já passou de 35%']
  },
  {
    id: '4D',
    row: 4,
    namePt: 'Guerreiro Versátil',
    nameEn: 'Versatile Warrior',
    nodeId: 1279613,
    buffId: null, // Lacuna conhecida documentada no projeto
    category: 'defensiva',
    mechanism: '+52,7 de Versatilidade por 10 s a cada ativação da Runa Central. É a ÚNICA runa da linha 4 com componente defensivo (redução de dano recebido).',
    whatItSacrifices: 'Perde o pico de dano puro oferecido por 4B/4A em troca de mitigação passiva.',
    bestScenarios: ['Imersão Tier 11 Solo (Chefe Kindo\'jan)', 'Masmorras M+ chave +10 e acima']
  },

  // Linha 5
  {
    id: '5A',
    row: 5,
    namePt: 'Sobrecarga Arcana',
    nameEn: 'Arcane Overload',
    nodeId: 1279614,
    buffId: 1287775,
    category: 'capstone',
    mechanism: 'Aumenta em +100% o efeito bruto da Runa Central (Linha 1).',
    whatItSacrifices: 'Não amplifica dano periódico nem replica dano futuro.',
    bestScenarios: ['Pico de dano inicial', 'Lutas muito curtas']
  },
  {
    id: '5B',
    row: 5,
    namePt: 'Energia Residual',
    nameEn: 'Residual Energy',
    nodeId: 1279615,
    buffId: 1287776,
    category: 'capstone',
    mechanism: 'Aumenta em +100% o efeito da Perenidade (Linha 3), gerando dano e sustentação periódica estendida.',
    whatItSacrifices: 'Exige combate contínuo sem pausas para extrair o valor total.',
    bestScenarios: ['Masmorras com atrito constante', 'Salas do Labirinto de Kindo\'jan']
  },
  {
    id: '5C',
    row: 5,
    namePt: 'Ecos do Folio',
    nameEn: 'Echoes of the Folio',
    nodeId: 1279616,
    buffId: 1287777,
    category: 'capstone',
    mechanism: 'Cria um eco retardado de 50% de todo o dano e cura gerados por todas as runas após 10 s de combate.',
    whatItSacrifices: 'Inútil em lutas relâmpago de menos de 10 s; brilha intensamente contra chefes resistentes.',
    bestScenarios: ['Chefe Final Kindo\'jan (Tier 11)', 'Chefes de Raide ST']
  }
];

export const NOTABLE_COMBINATIONS: RuneCombination[] = [
  {
    code: 'C24',
    runes: ['1A', '2B', '3A', '4D', '5C'],
    name: 'Bastião do Caos Solitário (Defesa Máxima & Ecos)',
    focus: 'Sobrevivência Pura',
    scenario: 'Imersão Tier 11 — Chefe Final Kindo\'jan Solo',
    isRecommendedFor: 'Imersões Tier 11 (Kindo\'jan)',
    mechanicsSummary: 'Combina autocura abaixo de 75% (2B) com mitigação de Versatilidade (4D) e replicação de 50% de dano sustentado via Ecos (5C). Permite matar o chefe sem curador.'
  },
  {
    code: 'C26',
    runes: ['1A', '2C', '3A', '4A', '5B'],
    name: 'Celeridade das Chamas (Kiting & Perenidade)',
    focus: 'Equilibrado',
    scenario: 'Imersão Tier 8–10 / Salas do Labirinto (Packs e Mobs)',
    isRecommendedFor: 'Salas do Labirinto de Kindo\'jan',
    mechanicsSummary: 'Velocidade de corrida (2C) ao receber dano para kiting entre pilares, com amplificação de dano periódico (5B) e fogo instantâneo (1A).'
  },
  {
    code: 'C29',
    runes: ['1A', '2C', '3A', '4B', '5B'],
    name: 'Ritmo dos Diabretes (Aceleração & Mobilidade)',
    focus: 'Equilibrado',
    scenario: 'Masmorras M+ Médias (+2 a +9)',
    isRecommendedFor: 'M+ +2 a +9',
    mechanicsSummary: 'Aceleração prioritária (4B) para o Bruxo Demonologia com bônus de velocidade para esquivar de mecânicas de área.'
  },
  {
    code: 'C30',
    runes: ['1A', '2C', '3A', '4D', '5B'],
    name: 'Sobrevivência Mítica (Mitigação de Afixo)',
    focus: 'Sobrevivência Pura',
    scenario: 'Masmorras M+ Altas (+10 e acima)',
    isRecommendedFor: 'M+ +10 ou superior',
    mechanicsSummary: 'Substitui 4B por 4D para absorver o dano de atrito de Tirânico + Fortificado e afixos de Xal\'atath.'
  },
  {
    code: 'C13',
    runes: ['1A', '2B', '3A', '4A', '5A'],
    name: 'Fúria Concentrada (Dano Máximo ST)',
    focus: 'Dano Máximo',
    scenario: 'Raide Alvo Único (Sobrecarga de Fogo)',
    isRecommendedFor: 'Raide ST',
    mechanicsSummary: 'Dobra o dano do Fogo Incontido (5A) com acúmulos contínuos de Crítico (4A).'
  },
  {
    code: 'C06',
    runes: ['1A', '2A', '3A', '4B', '5C'],
    name: 'Sinfonia Diabólica (Aceleração & Ecos)',
    focus: 'Dano Máximo',
    scenario: 'Raide Alvo Único com Aceleração',
    isRecommendedFor: 'Raide Variante',
    mechanicsSummary: 'Aceleração sobreposta (4B) para invocar diabretes em cadeia e replicar 50% de dano após 10 s (5C).'
  }
];

export function getRuneById(id: string): FolioRune | undefined {
  return FOLIO_RUNES.find(r => r.id === id);
}

export function getRuneByCode(code: string): RuneCombination | undefined {
  return NOTABLE_COMBINATIONS.find(c => c.code.toLowerCase() === code.toLowerCase());
}
