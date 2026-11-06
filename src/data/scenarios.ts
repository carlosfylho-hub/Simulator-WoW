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
