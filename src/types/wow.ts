export type ItemSlot =
  | 'head'
  | 'neck'
  | 'shoulders'
  | 'back'
  | 'chest'
  | 'wrists'
  | 'hands'
  | 'waist'
  | 'legs'
  | 'feet'
  | 'finger1'
  | 'finger2'
  | 'trinket1'
  | 'trinket2'
  | 'main_hand'
  | 'off_hand';

export type ItemSource = 'delve' | 'mplus' | 'raid' | 'craft' | 'catalyst' | 'vendor';

export type ArmorType = 'cloth' | 'leather' | 'mail' | 'plate' | 'misc';

export type WeaponType =
  | 'dagger_1h'
  | 'mace_1h'
  | 'sword_1h'
  | 'wand'
  | 'staff_2h'
  | 'off_hand'
  | 'shield'
  | 'none';

export type StatType = 'intellect' | 'agility' | 'strength' | 'stamina' | 'haste' | 'crit' | 'mastery' | 'versatility';

export interface WowItem {
  id: number;
  namePt: string;
  nameEn: string;
  slot: ItemSlot;
  ilvl: number; // e.g. 344, 341, 334, 331, 328, 321, 246
  normalizedIlvl?: number; // 334 for 341 forged (+7), etc.
  source: ItemSource;
  sourceDetail: string; // e.g. "Wah'du (Labirinto de Kindo'jan)", "Descanso do Rei", "Craft (Alfaiataria)"
  armorType?: ArmorType;
  weaponType?: WeaponType;
  stats?: Partial<Record<StatType, number>>;
  effect?: string;
  cantrip?: boolean;
  embellished?: boolean;
  isTier?: boolean;
  tierPiece?: string;
  isTrinketOnUse?: boolean;
  isTrinketPassive?: boolean;
  isCrafted?: boolean;
  craftMissivesAllowed?: boolean;
  requiresProfession?: string;
  notes?: string;
  icon?: string;
  quality?: 'epic' | 'rare' | 'uncommon' | 'artifact';
}

export interface FolioRune {
  id: string; // e.g. '1A', '2B', '4D', '5C'
  row: 1 | 2 | 3 | 4 | 5;
  namePt: string;
  nameEn: string;
  nodeId: number;
  buffId?: number | null;
  category: 'ofensiva' | 'defensiva' | 'utilitaria' | 'capstone';
  mechanism: string;
  whatItSacrifices: string;
  bestScenarios: string[];
}

export interface RuneCombination {
  code: string; // e.g. 'C24', 'C26', 'C13'
  runes: [string, string, string, string, string]; // e.g. ['1A', '2B', '3A', '4D', '5C']
  name: string;
  focus: 'Dano Máximo' | 'Equilibrado' | 'Sobrevivência Pura';
  scenario: string;
  isRecommendedFor?: string;
  mechanicsSummary: string;
}

export type VerdictType =
  | 'Vale a troca'
  | 'Vale com condição'
  | 'Empate técnico — simular'
  | 'Não vale'
  | 'Falta dado';

export interface GateResult {
  gate: string; // e.g. 'G0', 'G1', 'G2', etc.
  name: string;
  passed: boolean;
  warning?: boolean;
  description: string;
  detail: string;
}

export interface SubstitutionAudit {
  verdict: VerdictType;
  verdictSummary: string;
  gates: GateResult[];
  equippedItem: WowItem | null;
  candidateItem: WowItem;
  lostEffects: string[];
  gainedEffects: string[];
  statDelta: Partial<Record<StatType, number>>;
  ilvlDelta: number;
  opportunityCost: string[];
  actionRecommendation: string;
}

export interface ParsedSimcItem {
  slot: ItemSlot;
  id: number;
  name?: string;
  ilvl?: number;
  enchantId?: number;
  enchantName?: string;
  gemId?: number;
  gemName?: string;
  bonusIds?: number[];
  craftedStats?: number[];
  craftingQuality?: number;
  rawString: string;
}

export interface ParsedSimcProfile {
  characterName: string;
  spec: string;
  characterClass: string;
  level: number;
  race: string;
  professions: string[];
  equipped: Partial<Record<ItemSlot, ParsedSimcItem>>;
  equippedCount: number;
  checksum?: string;
  currentRunes?: string;
}

export type ActiveSpec = 'demonology' | 'affliction' | 'destruction' | 'balance' | 'shadow';

export type CombatScenario = 'patchwerk' | 'dungeon_slice' | 'cleave_aoe' | 'delve_rooms' | 'delve_boss' | 'mplus' | 'raid';

