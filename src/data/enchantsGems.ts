export interface EnchantInfo {
  simcId: number;
  namePt: string;
  nameEn: string;
  slot: string;
  tier: number;
  effect: string;
}

export interface GemInfo {
  id: number;
  namePt: string;
  nameEn: string;
  type: 'prismatic' | 'regular';
  stats: string;
  notes?: string;
}

export const SIMC_ENCHANT_MAP: Record<number, EnchantInfo> = {
  // Arma permanentes
  7980: { simcId: 7980, namePt: "Precisão de Jan'alai Tier 1", nameEn: "Jan'alai's Precision T1", slot: "main_hand", tier: 1, effect: "+Acerto Crítico em proc" },
  7981: { simcId: 7981, namePt: "Precisão de Jan'alai Tier 2", nameEn: "Jan'alai's Precision T2", slot: "main_hand", tier: 2, effect: "+Acerto Crítico moderado em proc" },
  7982: { simcId: 7982, namePt: "Precisão de Jan'alai Tier 3", nameEn: "Jan'alai's Precision T3", slot: "main_hand", tier: 3, effect: "+Acerto Crítico máximo em proc" },
  8689: { simcId: 8689, namePt: "Encantamento da Maestria Arcana - Arma", nameEn: "Arcane Mastery Weapon", slot: "main_hand", tier: 3, effect: "+124 de Maestria por 15 s" },
  
  // Óleos temporários de 120 min (coexistem na arma!)
  8051: { simcId: 8051, namePt: "Óleo da Chaga Negra", nameEn: "Black Blight Oil", slot: "main_hand", tier: 2, effect: "Causa dano de Sombra extra a cada feitiço" },
  8052: { simcId: 8052, namePt: "Óleo de Mana Fluido", nameEn: "Fluid Mana Oil", slot: "main_hand", tier: 3, effect: "Regeneração periódica de recurso" },
  8612: { simcId: 8612, namePt: "Óleo da Peçonha Corrosiva", nameEn: "Corrosive Venom Oil", slot: "main_hand", tier: 3, effect: "Aumenta o dano de Natureza contra alvos únicos" },

  // Torso
  8650: { simcId: 8650, namePt: "Encantamento da Marca do Magíster - Torso", nameEn: "Mark of the Magister", slot: "chest", tier: 3, effect: "+40 de Intelecto" },
  8651: { simcId: 8651, namePt: "Vigor Talassiano - Torso", nameEn: "Thalassian Stamina", slot: "chest", tier: 3, effect: "+Vigor e armadura passiva" },

  // Anéis
  8660: { simcId: 8660, namePt: "Encantamento da Aceleração Talassiana - Anel", nameEn: "Thalassian Haste", slot: "finger", tier: 3, effect: "+24 de Aceleração" },
  8661: { simcId: 8661, namePt: "Encantamento do Acerto Crítico Talassiano - Anel", nameEn: "Thalassian Critical Strike", slot: "finger", tier: 3, effect: "+24 de Acerto Crítico" },
  8662: { simcId: 8662, namePt: "Encantamento da Maestria Talassiana - Anel", nameEn: "Thalassian Mastery", slot: "finger", tier: 3, effect: "+24 de Maestria" },
  8663: { simcId: 8663, namePt: "Encantamento da Versatilidade Talassiana - Anel", nameEn: "Thalassian Versatility", slot: "finger", tier: 3, effect: "+24 de Versatilidade" },

  // Ombros
  8670: { simcId: 8670, namePt: "Recomposição de Luaprata - Ombros", nameEn: "Silvermoon Restoration", slot: "shoulders", tier: 3, effect: "+166 de Sorver (Cura por dano causado)" },

  // Elmo
  8675: { simcId: 8675, namePt: "Runa da Evasão Potencializada - Elmo", nameEn: "Empowered Avoidance Rune", slot: "head", tier: 3, effect: "+37 de Evasão (Redução de dano em área)" },
  8702: { simcId: 8702, namePt: "Tinker R0CKY - Elmo", nameEn: "R0CKY Tinker", slot: "head", tier: 1, effect: "Queda lenta por 2 min (Disputa a linha do encantamento de elmo)" },

  // Pés
  8680: { simcId: 8680, namePt: "Passos da Floresta Eterna - Pés", nameEn: "Eternal Forest Steps", slot: "feet", tier: 3, effect: "+Velocidade de movimento e Vigor" }
};

export const GEM_CATALOG: GemInfo[] = [
  {
    id: 213740,
    namePt: "Diamante do Canto Eterno Poderoso",
    nameEn: "Powerful Eversong Diamond",
    type: "prismatic",
    stats: "+32 Intelecto e +2% de Aceleração Máxima",
    notes: "Limite de 1 por personagem (Unique-Equipped: Thalassian Diamond)."
  },
  {
    id: 213741,
    namePt: "Diamante do Canto Eterno Estoico",
    nameEn: "Stoic Eversong Diamond",
    type: "prismatic",
    stats: "+23 Intelecto e +13 Armadura",
    notes: "Opção defensiva para Delves Tier 11 e chaves M+ +10."
  },
  {
    id: 213742,
    namePt: "Diamante do Canto Eterno Telúrico",
    nameEn: "Telluric Eversong Diamond",
    type: "prismatic",
    stats: "+23 Intelecto e +Regeneração de Mana",
    notes: "Uso específico para curadores / specs de alto dreno."
  },
  {
    id: 213450,
    namePt: "Safira Rápida Talassiana",
    nameEn: "Quick Thalassian Sapphire",
    type: "regular",
    stats: "+18 de Aceleração e +9 de Acerto Crítico",
    notes: "Gema recomendada para slots amarelos/azuis de Bruxo Demonologia."
  },
  {
    id: 213451,
    namePt: "Rubi Radiante Talassiano",
    nameEn: "Radiant Thalassian Ruby",
    type: "regular",
    stats: "+18 de Aceleração e +9 de Maestria",
    notes: "Equilíbrio entre Aceleração e Maestria."
  }
];

export const LEG_ENHANCEMENTS = {
  spellthread: {
    namePt: "Magilinha de Arcanotrama",
    nameEn: "Arcanoweave Spellthread",
    profession: "Alfaiataria",
    slot: "legs",
    stats: "+41 de Intelecto e +4% de Mana Máxima",
    notes: "Pernas NÃO recebem encantamento comum: usam Magilinha (Ofensiva)!"
  },
  armorKit: {
    namePt: "Kit de Armadura Reforçado",
    nameEn: "Reinforced Armor Kit",
    profession: "Couraria",
    slot: "legs",
    stats: "+Vigor reforçado e +Armadura física",
    notes: "Opção para sobrevivência pura em Imersões Tier 11."
  }
};
