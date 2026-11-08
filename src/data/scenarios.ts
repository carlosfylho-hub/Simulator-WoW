export type CombatScenario = 'patchwerk' | 'dungeon_slice' | 'cleave_aoe';

export interface CombatScenarioMeta {
  id: CombatScenario;
  namePt: string;
  nameEn: string;
  fullName: string;
  description: string;
  badge: string;
  targetCount: string;
  combatLength: string;
  iconName: 'Swords' | 'Flame' | 'Zap';
  dpsMultiplier: number;
  statWeights: {
    haste: number;
    crit: number;
    mastery: number;
    vers: number;
  };
  statPriorityDescription: string;
  tacticalFocus: string;
}

export const COMBAT_SCENARIOS: Record<CombatScenario, CombatScenarioMeta> = {
  patchwerk: {
    id: 'patchwerk',
    namePt: 'Alvo Único / Raide',
    nameEn: 'Patchwerk 5 min',
    fullName: 'Alvo Único / Raide (Patchwerk 5 min)',
    description: 'Prioriza Aceleração e Crítico para dano contínuo em chefe único.',
    badge: '1 Alvo Puro',
    targetCount: '1 Chefe Estático',
    combatLength: '300s (5 minutos)',
    iconName: 'Swords',
    dpsMultiplier: 1.0,
    statWeights: {
      haste: 1.05,
      crit: 0.98,
      mastery: 0.85,
      vers: 0.68
    },
    statPriorityDescription: 'Aceleração (1.05) > Crítico (0.98) > Maestria (0.85) > Versatilidade (0.68)',
    tacticalFocus: 'Sustentação pura de rotação, manutenção de DoTs em 100% de atividade e atrito com limite de GCD.'
  },
  dungeon_slice: {
    id: 'dungeon_slice',
    namePt: 'Mítica+ Dinâmica',
    nameEn: 'Dungeon Slice',
    fullName: 'Mítica+ Dinâmica (Dungeon Slice)',
    description: 'Simula puxadas grandes em grupos com intervalos de recarga (burst windows).',
    badge: 'Mítica+ Dinâmica',
    targetCount: 'Variável (1 a 8 mobs)',
    combatLength: 'Puxadas de 40s + 2 chefes de 120s',
    iconName: 'Flame',
    dpsMultiplier: 1.28,
    statWeights: {
      haste: 0.98,
      crit: 1.04,
      mastery: 0.96,
      vers: 0.72
    },
    statPriorityDescription: 'Crítico (1.04) > Aceleração (0.98) > Maestria (0.96) > Versatilidade (0.72)',
    tacticalFocus: 'Janelas explosivas de cooldown de 2 minutos (Burst), sincronização com berloques ativos e dano em packs.'
  },
  cleave_aoe: {
    id: 'cleave_aoe',
    namePt: 'Cleave Contínuo 3-5 Alvos',
    nameEn: 'Continuous Cleave AoE',
    fullName: 'Cleave Contínuo 3-5 Alvos (Continuous Cleave AoE)',
    description: 'Valoriza Maestria e efeitos de espalhamento de dano periódico (DoTs).',
    badge: '3-5 Alvos AoE',
    targetCount: '3 a 5 Inimigos Concorrentes',
    combatLength: '180s (3 minutos contínuos)',
    iconName: 'Zap',
    dpsMultiplier: 2.85,
    statWeights: {
      mastery: 1.18,
      crit: 0.96,
      haste: 0.90,
      vers: 0.70
    },
    statPriorityDescription: 'Maestria (1.18) > Crítico (0.96) > Aceleração (0.90) > Versatilidade (0.70)',
    tacticalFocus: 'Multi-DoTing, dano passivo de clivagem, pets compartilhando dano e saturação de Maestria.'
  }
};

export const COMBAT_SCENARIOS_LIST: CombatScenarioMeta[] = [
  COMBAT_SCENARIOS.patchwerk,
  COMBAT_SCENARIOS.dungeon_slice,
  COMBAT_SCENARIOS.cleave_aoe
];

/**
 * Rótulos e descrições PT-BR dos Fight Styles aceitos pelo backend
 * (ver `Cenario` em topgear/models.py e `estilo_de_luta` em runner.py).
 * Espelham os cenários do Raidbots. Usados nos painéis Droptimizer e Top Gear.
 */
export const ROTULO_CENARIO: Record<string, string> = {
  patchwerk: 'Patchwerk — alvo único, sem movimento',
  dungeon_slice: 'Dungeon Slice — M+ dinâmica',
  hectic_add_cleave: 'Hectic Add Cleave — adds caóticos',
  light_movement: 'Light Movement — movimento leve',
  heavy_movement: 'Heavy Movement — muito movimento',
  casting_patchwerk: 'Casting Patchwerk — com conjurações',
  cleave_add: 'Cleave Add — alvo + adds recorrentes',
  helter_skelter: 'Helter Skelter — caos constante',
  raid: 'Raide — vários alvos e fases',
  mplus: 'M+ — masmorra mítica',
  cleave_aoe: 'Cleave — 3 a 5 alvos',
  delve_rooms: 'Delve — salas com grupos de mobs',
  delve_boss: 'Delve — chefe único',
};

export const DESCRICAO_CENARIO: Record<string, string> = {
  patchwerk:
    'Um chefe parado, sem movimento nem adds: mede o DPS sustentado puro. Ideal para comparar itens sem interferência de mecânicas.',
  dungeon_slice:
    'Puxadas de mobs e chefes com intervalos e janelas de cooldown, como numa Mítica+. Bom para pacotes e burst.',
  hectic_add_cleave:
    'Alvo único com adds frequentes e caóticos; mistura dano single-target e em área.',
  light_movement:
    'Alvo único com movimento leve; mede a perda de DPS quando é preciso se mover um pouco.',
  heavy_movement:
    'Alvo único com muito movimento; pune rotações que dependem de ficar parado.',
  casting_patchwerk:
    'Alvo único com pausas para conjuração; considera o tempo parado para castar.',
  cleave_add:
    'Alvo principal com adds recorrentes; valoriza dano em área e clivagem.',
  helter_skelter:
    'Alvo único com eventos caóticos constantes (mecânicas aleatórias); testa adaptabilidade da rotação.',
  raid:
    'Luta de raide com alvos e fases variadas; bom para escolher um conjunto de uso geral.',
  mplus:
    'Cenário de masmorra mítica, com grupos de mobs e chefes ao longo da run.',
  cleave_aoe:
    'Vários inimigos simultâneos (3 a 5). Valoriza dano em área, DoT espalhado e Maestria.',
  delve_rooms:
    'Salas de delve com grupos de mobs; foco em dano em área moderado.',
  delve_boss:
    'Chefe de delve em alvo único; foco em dano sustentado contra um alvo.',
};

export interface OpcaoCenario {
  valor: string;
  rotulo: string;
  descricao: string;
}

/** Opções exibidas nos painéis Droptimizer/Top Gear (estilo Raidbots). */
export const CENARIOS_DROPDOWN: OpcaoCenario[] = [
  'patchwerk',
  'dungeon_slice',
  'hectic_add_cleave',
  'light_movement',
  'heavy_movement',
  'casting_patchwerk',
  'cleave_add',
  'helter_skelter',
  'raid',
  'mplus',
  'cleave_aoe',
  'delve_rooms',
  'delve_boss',
].map((valor) => ({
  valor,
  rotulo: ROTULO_CENARIO[valor],
  descricao: DESCRICAO_CENARIO[valor],
}));
