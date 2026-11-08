import { WowItem, ItemSlot } from '../types/wow';

export const WOW_ITEMS: WowItem[] = [
  // --- CONJUNTO DE TECIDO DE DELVE: PISA-PIRAS (Vendedor Wah'du / Labirinto de Kindo'jan) ---
  {
    id: 272234,
    namePt: 'Mitra do Pisa-piras',
    nameEn: 'Pyretreader\'s Miter',
    slot: 'head',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan) - Moeda de Alma Mítica",
    armorType: 'cloth',
    stats: { intellect: 162, stamina: 3200, haste: 71, mastery: 119 },
    notes: 'Conjunto Pisa-piras. Mítico 2/6. Ideal para transição solo em Delves.',
    icon: 'inv_helm_cloth_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272236,
    namePt: 'Dragonas do Pisa-piras',
    nameEn: 'Pyretreader\'s Pauldrons',
    slot: 'shoulders',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan) - Moeda de Alma Mítica",
    armorType: 'cloth',
    stats: { intellect: 121, stamina: 2400, haste: 87, versatility: 56 },
    notes: 'Conjunto Pisa-piras. Mítico 2/6.',
    icon: 'inv_shoulder_cloth_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272231,
    namePt: 'Perponte do Pisa-piras',
    nameEn: 'Pyretreader\'s Gambeson',
    slot: 'chest',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan) - Moeda de Alma Mítica",
    armorType: 'cloth',
    stats: { intellect: 162, stamina: 3200, crit: 122, mastery: 68 },
    notes: 'Conjunto Pisa-piras. Mítico 2/6.',
    icon: 'inv_robe_cloth_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272238,
    namePt: 'Cingidouro do Pisa-piras',
    nameEn: 'Pyretreader\'s Cinch',
    slot: 'wrists',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan) - Moeda de Alma Mítica",
    armorType: 'cloth',
    stats: { intellect: 91, stamina: 1800, versatility: 69, mastery: 38 },
    notes: 'Auditado: Cingidouro é PULSOS no catálogo oficial.',
    icon: 'inv_bracer_cloth_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272233,
    namePt: 'Luvas do Pisa-piras',
    nameEn: 'Pyretreader\'s Gloves',
    slot: 'hands',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan) - Moeda de Alma Mítica",
    armorType: 'cloth',
    stats: { intellect: 121, stamina: 2400, crit: 86, mastery: 56 },
    notes: 'Conjunto Pisa-piras. Mítico 2/6.',
    icon: 'inv_glove_cloth_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272237,
    namePt: 'Obi do Pisa-piras',
    nameEn: 'Pyretreader\'s Sash',
    slot: 'waist',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan) - Moeda de Alma Mítica",
    armorType: 'cloth',
    stats: { intellect: 121, stamina: 2400, versatility: 56, mastery: 87 },
    notes: 'Conjunto Pisa-piras. Mítico 2/6.',
    icon: 'inv_belt_cloth_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272235,
    namePt: 'Botinas do Pisa-piras',
    nameEn: 'Pyretreader\'s Treads',
    slot: 'legs',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan) - Moeda de Alma Mítica",
    armorType: 'cloth',
    stats: { intellect: 162, stamina: 3200, haste: 73, versatility: 117 },
    notes: 'Auditado: Botinas é PERNAS no catálogo oficial PT-BR.',
    icon: 'inv_pant_cloth_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272232,
    namePt: 'Alpargatas do Pisa-piras',
    nameEn: 'Pyretreader\'s Slippers',
    slot: 'feet',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan) - Moeda de Alma Mítica",
    armorType: 'cloth',
    stats: { intellect: 121, stamina: 2400, crit: 50, haste: 92 },
    notes: 'Conjunto Pisa-piras. Mítico 2/6.',
    icon: 'inv_boot_cloth_outdooramaniloa_c_01',
    quality: 'epic'
  },

  // --- JOIAS E CAPAS DE DELVE: WAH'DU ---
  {
    id: 272228,
    namePt: 'Periapto Sussurrante',
    nameEn: 'Whispering Periapt',
    slot: 'neck',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    stats: { stamina: 1800, versatility: 65, mastery: 91 },
    icon: 'inv_121_jewelry_neck02_purple',
    quality: 'epic'
  },
  {
    id: 272229,
    namePt: 'Talismã Serpentino',
    nameEn: 'Serpentine Talisman',
    slot: 'neck',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    stats: { stamina: 1800, crit: 91, haste: 65 },
    icon: 'inv_121_jewelry_neck03_purple',
    quality: 'epic'
  },
  {
    id: 272147,
    namePt: 'Elo Colubrino',
    nameEn: 'Colubrine Link',
    slot: 'finger1',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    stats: { stamina: 1800, haste: 107, mastery: 49 },
    notes: 'Excelente para Bruxo Demonologia (Aceleração primária).',
    icon: 'inv_121_jewelry_ring01_purple',
    quality: 'epic'
  },
  {
    id: 272148,
    namePt: 'Torvelinho Anguino',
    nameEn: 'Anguine Swirl',
    slot: 'finger2',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    stats: { stamina: 1800, crit: 100, versatility: 56 },
    icon: 'inv_121_jewelry_ring03_purple',
    quality: 'epic'
  },
  {
    id: 272149,
    namePt: 'Aro de Bagata',
    nameEn: 'Trinket Ring of Bagata',
    slot: 'finger1',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    stats: { stamina: 1800, crit: 47, mastery: 109 },
    icon: 'inv_121_jewelry_ring02_purple',
    quality: 'epic'
  },
  {
    id: 272150,
    namePt: 'Sinete Ourobórico',
    nameEn: 'Ouroboric Signet',
    slot: 'finger2',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    stats: { stamina: 1800, haste: 58, mastery: 98 },
    icon: 'inv_jewelry_ring_181',
    quality: 'epic'
  },
  {
    id: 272225,
    namePt: 'Dragonas do Pisa-piras (Capa)',
    nameEn: 'Pyretreader\'s Cloak',
    slot: 'back',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    armorType: 'cloth',
    stats: { intellect: 91, stamina: 1800, crit: 20, haste: 34 },
    notes: 'Item 272225 é capa (nome compartilhado no cliente oficial).',
    icon: 'inv_cape_cloth_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272230,
    namePt: 'Mortalha do Portador do Juramento',
    nameEn: 'Oathbearer\'s Shroud',
    slot: 'back',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    armorType: 'cloth',
    stats: { intellect: 91, stamina: 1800, crit: 20, haste: 34 },
    icon: 'inv_cape_plate_outdooramaniloa_c_01',
    quality: 'epic'
  },

  // --- ARMAS E MÃOS SECUNDÁRIAS DE DELVE: WAH'DU ---
  {
    id: 272266,
    namePt: 'Adaga do Eidolon Esquecido',
    nameEn: 'Dagger of the Forgotten Eidolon',
    slot: 'main_hand',
    ilvl: 328,
    normalizedIlvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan) - Moeda de Alma Mítica",
    weaponType: 'dagger_1h',
    stats: { intellect: 504, stamina: 1800, crit: 29, haste: 19 },
    notes: 'Forjado com Peçonha: Herói (ilvl 328). Adaga 1M com Aceleração.',
    icon: 'inv_knife_1h_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272270,
    namePt: 'Pilão de Pó de Osso',
    nameEn: 'Bone Powder Pestle',
    slot: 'main_hand',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    weaponType: 'mace_1h',
    stats: { intellect: 480, stamina: 1600, crit: 19, haste: 29 },
    icon: 'inv_mace_1h_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272271,
    namePt: 'Foco do Espírito Vinculado',
    nameEn: 'Bound Spirit Focus',
    slot: 'main_hand',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    weaponType: 'wand',
    stats: { intellect: 480, stamina: 1600, versatility: 29, mastery: 19 },
    icon: 'inv_wand_1h_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272273,
    namePt: 'Cetro Cerimonial Consagrado',
    nameEn: 'Consecrated Ceremonial Scepter',
    slot: 'main_hand',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    weaponType: 'staff_2h',
    stats: { intellect: 960, stamina: 3200, versatility: 38, mastery: 58 },
    notes: 'Cajado 2M. Ocupa ambos os slots de arma.',
    icon: 'inv_staff_2h_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 272275,
    namePt: 'Trombeta do Canta-almas',
    nameEn: 'Soulsinger\'s Horn',
    slot: 'off_hand',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Wah'du (Labirinto de Kindo'jan)",
    weaponType: 'off_hand',
    stats: { intellect: 110, stamina: 600, crit: 18, versatility: 30 },
    icon: 'inv_offhand_1h_outdooramaniloa_c_01',
    quality: 'epic'
  },

  // --- PEÇAS CRAFTADAS COM CENTELHA (Teto 331 / Piso Herói 318) ---
  {
    id: 239648,
    namePt: 'Braceletes do Mártir',
    nameEn: 'Martyr\'s Bindings',
    slot: 'wrists',
    ilvl: 331,
    normalizedIlvl: 331,
    source: 'craft',
    sourceDetail: 'Craft (Alfaiataria) - Centelha de Marés + Cristas',
    armorType: 'cloth',
    stats: { intellect: 68, stamina: 1120 },
    isCrafted: true,
    craftMissivesAllowed: true,
    embellished: true,
    embellishmentName: 'Forro de Arcanotrama [240167]',
    embellishmentRecommendation: 'Forro de Arcanotrama',
    effect: 'Embelezamento recomendado: Forro de Arcanotrama (240167). Secundários via Missiva: Aceleração + Maestria.',
    notes: 'BiS absoluto para Bruxo e Sacerdote em pulsos. Não possui secundários fixos (definidos por missiva).',
    icon: 'inv_bracer_cloth_questbloodelf_b_01',
    quality: 'epic'
  },
  {
    id: 239649,
    namePt: 'Banda do Mártir',
    nameEn: 'Martyr\'s Waistwrap',
    slot: 'waist',
    ilvl: 331,
    normalizedIlvl: 331,
    source: 'craft',
    sourceDetail: 'Craft (Alfaiataria) - Centelha de Marés + Cristas',
    armorType: 'cloth',
    stats: { intellect: 91, stamina: 1800, haste: 88, mastery: 48 },
    isCrafted: true,
    craftMissivesAllowed: true,
    embellished: true,
    embellishmentName: 'Forro de Arcanotrama [240167]',
    embellishmentRecommendation: 'Forro de Arcanotrama',
    notes: 'Cinto craftado de Alfaiataria. Permite encaixe de missivas customizadas e Forro de Arcanotrama.',
    icon: 'inv_belt_cloth_questbloodelf_b_01',
    quality: 'epic'
  },
  {
    id: 239654,
    namePt: 'Sapatilhas do Mártir',
    nameEn: 'Martyr\'s Slippers',
    slot: 'feet',
    ilvl: 331,
    normalizedIlvl: 331,
    source: 'craft',
    sourceDetail: 'Craft (Alfaiataria) - Centelha de Marés + Cristas',
    armorType: 'cloth',
    stats: { intellect: 91, stamina: 1800, haste: 92, crit: 44 },
    isCrafted: true,
    craftMissivesAllowed: true,
    notes: 'Sapatilhas craftadas de Alfaiataria (M+ / Raide).',
    icon: 'inv_boot_cloth_questbloodelf_b_01',
    quality: 'epic'
  },
  {
    id: 239656,
    namePt: 'Mortalha Sedosa do Seguidor',
    nameEn: 'Adherent\'s Silken Shroud',
    slot: 'back',
    ilvl: 331,
    normalizedIlvl: 331,
    source: 'craft',
    sourceDetail: 'Craft (Alfaiataria) - Centelha de Marés + Cristas',
    armorType: 'cloth',
    stats: { intellect: 68, stamina: 1120, haste: 58, mastery: 32 },
    isCrafted: true,
    craftMissivesAllowed: true,
    notes: 'Capa BiS craftada para conjuradores de tecido na Temporada 2.',
    icon: 'inv_cape_cloth_questbloodelf_b_01',
    quality: 'epic'
  },
  {
    id: 240949,
    namePt: 'Elo Sin\'dorei Magistral',
    nameEn: 'Masterwork Sin\'dorei Band',
    slot: 'finger1',
    ilvl: 331,
    normalizedIlvl: 331,
    source: 'craft',
    sourceDetail: 'Craft (Joalheria) - Centelha de Marés + Cristas',
    stats: { stamina: 1800, haste: 112, mastery: 64 },
    isCrafted: true,
    craftMissivesAllowed: true,
    embellished: true,
    embellishmentName: 'Amolita Polida',
    embellishmentRecommendation: 'Amolita Polida',
    notes: 'Anel craftado de Joalheria. Engaste prismático e embelezamento de acessório (Amolita Polida).',
    icon: 'inv_12_profession_jewelcrafting_ring4_gold',
    quality: 'epic'
  },
  {
    id: 245769,
    namePt: 'Lanterna de Aln\'hara',
    nameEn: 'Aln\'hara Lantern',
    slot: 'off_hand',
    ilvl: 331,
    normalizedIlvl: 331,
    source: 'craft',
    sourceDetail: 'Craft (Escrivania) - Centelha de Marés + Cristas',
    weaponType: 'off_hand',
    stats: { intellect: 184, stamina: 996 },
    isCrafted: true,
    craftMissivesAllowed: true,
    embellished: true,
    embellishmentName: 'Pedra Ritual do Caçador [273060]',
    embellishmentRecommendation: 'Pedra Ritual do Caçador',
    effect: 'Embelezamento recomendado: Pedra Ritual do Caçador (273060) — 101 de secundário aleatório por 15 s, +50% em Caça às Presas. Secundários via Missiva: Aceleração + Maestria.',
    notes: 'Mão secundária BiS craftada. Murlok S2: 36/50 usam Pedra Ritual do Caçador; Signo de Sangue é alternativa.',
    icon: 'inv_offhand_1h_dungeonharronir_c_01',
    quality: 'epic'
  },

  // --- BERLOQUES AUDITADOS DE M+ E DELVES (No-Raid Priority) ---
  {
    id: 273649,
    namePt: 'Emblema Tempestuoso de Dazar',
    nameEn: 'Stormbound Emblem of Dazar',
    slot: 'trinket1',
    ilvl: 341,
    normalizedIlvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Repouso do Rei',
    stats: { intellect: 191 },
    isTrinketOnUse: true,
    isTrinketPassive: false,
    effect: 'Uso: Canaliza por até 2 s para ganhar +1.082 de Aceleração por 20 s (Recarga: 2 min).',
    notes: 'Tier S absoluto sem raide. Não equipar simultaneamente com outro berloque on-use (R4).',
    icon: 'inv_7_0raid_necklace_14a',
    quality: 'epic'
  },
  {
    id: 273794,
    namePt: 'Nó de Serpentes Contorcidas',
    nameEn: 'Knot of Writhing Serpents',
    slot: 'trinket2',
    ilvl: 341,
    normalizedIlvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Altar das Presas',
    stats: { intellect: 191 },
    isTrinketOnUse: false,
    isTrinketPassive: true,
    effect: 'Equipado: Seus feitiços de dano têm chance de liberar serpentes venenosas, concedendo Intelecto passivo constante.',
    notes: 'Parceiro perfeito do Emblema de Dazar (1 ativo + 1 passivo).',
    icon: 'inv_121_trinket_dungeon_ulatek_writhe',
    quality: 'epic'
  },
  {
    id: 250215,
    namePt: 'Frasco do Cargueiro',
    nameEn: 'Freighter\'s Flask',
    slot: 'trinket1',
    ilvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Travessa dos Assassinos',
    stats: { intellect: 178 },
    isTrinketOnUse: true,
    effect: 'Uso: Aumenta o dano de sombra e concede bônus de Intelecto em surto.',
    icon: 'inv_alchemy_90_flask_red',
    quality: 'epic'
  },

  // --- ITENS DE MASMORRA M+ CHAVE (No-Raid BiS) ---
  {
    id: 251222,
    namePt: 'Atadura do Éter Etérea',
    nameEn: 'Ethereal Netherwrap',
    slot: 'waist',
    ilvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Arena da Chaga do Caos',
    armorType: 'cloth',
    stats: { intellect: 141, stamina: 2932, crit: 56, haste: 95 },
    notes: 'Cinto BiS sem raide para Bruxo Demonologia. Aceleração pura.',
    icon: 'inv_belt_cloth_dungeonharronir_c_01',
    quality: 'epic'
  },
  {
    id: 158366,
    namePt: 'Elo de Arenito Carregado',
    nameEn: 'Charged Sandstone Band',
    slot: 'finger1',
    ilvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Templo de Sethraliss',
    stats: { stamina: 2199, crit: 232, mastery: 174 },
    notes: 'Anel BiS sem raide para Bruxo Demonologia.',
    icon: 'inv_ring_80_03d',
    quality: 'epic'
  },
  {
    id: 251132,
    namePt: 'Mortalha do Inferninho',
    nameEn: 'Speakeasy Shroud',
    slot: 'back',
    ilvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Travessa dos Assassinos',
    armorType: 'cloth',
    stats: { intellect: 106, stamina: 2199, crit: 66, mastery: 47 },
    notes: 'Capa BiS sem raide para Bruxo Demonologia.',
    icon: 'inv_cape_leather_dungeonharronir_c_01',
    quality: 'epic'
  },

  // --- CONJUNTO DE TIER 4PC (Catalyst / Raide): GRILHÕES DO NECRÓLITO MALDITO ---
  {
    id: 271544,
    namePt: 'Pináculos do Necrólito Maldito',
    nameEn: 'Spires of the Damned Necrolyte',
    slot: 'shoulders',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalisador Matriz (Matrix Catalyst) via M+ / Great Vault',
    armorType: 'cloth',
    isTier: true,
    tierPiece: 'shoulders',
    stats: { intellect: 141, stamina: 2932, haste: 50, versatility: 101 },
    notes: 'Peça do conjunto 2066 (4pc prioridade máxima).',
    icon: 'inv_shoulder_cloth_raidwarlockulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271549,
    namePt: 'Vestes Chacoalhantes do Necrólito Maldito',
    nameEn: 'Damned Necrolyte\'s Rattling Robes',
    slot: 'chest',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalisador Matriz (Matrix Catalyst) via M+ / Great Vault',
    armorType: 'cloth',
    isTier: true,
    tierPiece: 'chest',
    stats: { intellect: 189, stamina: 3910, haste: 141, mastery: 60 },
    notes: 'Peça de torso de tier. Aceleração alta.',
    icon: 'inv_robe_cloth_raidwarlockulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271547,
    namePt: 'Agarres Calcinados do Necrólito Maldito',
    nameEn: 'Damned Necrolyte\'s Charred Grasps',
    slot: 'hands',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalisador Matriz (Matrix Catalyst) via M+ / Great Vault',
    armorType: 'cloth',
    isTier: true,
    tierPiece: 'hands',
    stats: { intellect: 141, stamina: 2932, crit: 45, haste: 106 },
    notes: 'Luvas de tier. Aceleração alta.',
    icon: 'inv_glove_cloth_raidwarlockulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271545,
    namePt: 'Amarras de Perna do Necrólito Maldito',
    nameEn: 'Damned Necrolyte\'s Leg Bindings',
    slot: 'legs',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalisador Matriz (Matrix Catalyst) via M+ / Great Vault',
    armorType: 'cloth',
    isTier: true,
    tierPiece: 'legs',
    stats: { intellect: 189, stamina: 3910, haste: 141, mastery: 60 },
    notes: 'Pernas de tier. Recebe Magilinha de Arcanotrama (+41 Int / +4% mana).',
    icon: 'inv_pant_cloth_raidwarlockulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271546,
    namePt: 'Crânio do Necrólito Maldito',
    nameEn: 'Skull of the Damned Necrolyte',
    slot: 'head',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalisador Matriz (Matrix Catalyst) via M+ / Great Vault',
    armorType: 'cloth',
    isTier: true,
    tierPiece: 'head',
    stats: { intellect: 189, stamina: 3910, crit: 60, haste: 141 },
    notes: 'Elmo de tier alternativo ao cantrip do Guardião da Peçonha.',
    icon: 'inv_helm_cloth_raidwarlockulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271548,
    namePt: 'Solas do Necrólito Maldito',
    nameEn: 'Soles of the Damned Necrolyte',
    slot: 'feet',
    ilvl: 334,
    source: 'raid',
    sourceDetail: "Raide: Ula'tek / Masmorra M+",
    armorType: 'cloth',
    stats: { intellect: 141, stamina: 2932, haste: 104, mastery: 48 },
    notes: 'Botas de tecido do conjunto Necrólito Maldito.',
    icon: 'inv_boot_cloth_raidwarlockulatek_d_01',
    quality: 'epic'
  },

  // --- ARMAS E ACESSÓRIOS CHAVE DE M+ (No-Raid BiS) ---
  {
    id: 273778,
    namePt: 'Canalizador de Lumineira Polido',
    nameEn: 'Polished Luminary Channeler',
    slot: 'main_hand',
    ilvl: 341,
    normalizedIlvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Altar das Presas (Altar of Fangs)',
    weaponType: 'dagger_1h',
    stats: { intellect: 586, stamina: 2192, haste: 58, mastery: 46 },
    effect: 'Causa dano Sagrado em área com amplificação de até +150% em pacotes agrupados.',
    notes: 'Melhor arma 1M de M+ para conjuradores (Aceleração + Maestria).',
    icon: 'inv_knife_1h_zuljin_d_01',
    quality: 'epic'
  },
  {
    id: 273781,
    namePt: 'Feixe de Presas Protetoras',
    nameEn: 'Bundle of Ward-Fangs',
    slot: 'neck',
    ilvl: 341,
    normalizedIlvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Altar das Presas (Altar of Fangs)',
    stats: { stamina: 2466, crit: 240, haste: 182 },
    notes: 'Melhor pescoço de M+ para Suplício e Demonologia fora da raide.',
    icon: 'inv_121_jewelry_neck03_teal',
    quality: 'epic'
  },
  {
    id: 273792,
    namePt: 'Elo do Senhor da Guerra Amani',
    nameEn: 'Amani Warlord\'s Band',
    slot: 'finger1',
    ilvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Altar das Presas (Altar of Fangs)',
    stats: { stamina: 2199, haste: 188, crit: 142 },
    notes: 'Anel com atributo massivo de Aceleração.',
    icon: 'inv_121_jewelry_ring02_green',
    quality: 'epic'
  },
  {
    id: 270167,
    namePt: 'Rocha Marinha do Clamaondas',
    nameEn: 'Wavespeaker\'s Sea Rock',
    slot: 'trinket2',
    ilvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: O Vale Ofuscante',
    stats: { haste: 148 },
    isTrinketPassive: true,
    effect: 'Feitiços concedem cargas de Maré Crescente (+28 Intelecto por acúmulo, até 15 acúmulos). Ao atingir 15, concede Surto Oceânico.',
    notes: 'Excelente berloque passivo de Intelecto progressivo.',
    icon: 'inv_tradeskillitem_sorcererswater',
    quality: 'epic'
  },

  // --- ITENS DE RAIDE / CANTRIPS (Para Referência e Comparação nos Portões) ---
  {
    id: 271874,
    namePt: 'Capucho Horrendo do Guardião da Peçonha',
    nameEn: 'Venomkeeper\'s Horrific Cowl',
    slot: 'head',
    ilvl: 344,
    normalizedIlvl: 344,
    source: 'raid',
    sourceDetail: 'Raide: Ula\'tek',
    armorType: 'cloth',
    cantrip: true,
    stats: { intellect: 207, stamina: 4385, mastery: 209 },
    effect: 'Cantrip Passivo: Chance de disparar saliva ácida de peçonha causando dano de Natureza.',
    notes: 'Cantrip 344 de raide. Catalisar preserva o cantrip (R12).',
    icon: 'inv_helm_cloth_raidwarlockulatek_d_01',
    quality: 'epic'
  },
  {
    id: 268265,
    namePt: 'Relicário Aqiricida',
    nameEn: 'Aqirbane Reliquary',
    slot: 'neck',
    ilvl: 344,
    normalizedIlvl: 344,
    source: 'raid',
    sourceDetail: 'Raide: Ula\'tek',
    stats: { stamina: 2466, crit: 107, haste: 107, mastery: 107, versatility: 107 },
    effect: 'Engaste prismático. Chance de conceder +434 a um atributo secundário aleatório (-73 nos outros por 12 s).',
    notes: 'Pescoço 344 de raide.',
    icon: 'inv_121_jewelry_neck03_green',
    quality: 'epic'
  },
  {
    id: 271092,
    namePt: 'Jan\'thrazet, a Presa Anímica',
    nameEn: 'Jan\'thrazet, the Soul Fang',
    slot: 'main_hand',
    ilvl: 344,
    normalizedIlvl: 344,
    source: 'raid',
    sourceDetail: 'Raide: Ula\'tek',
    weaponType: 'dagger_1h',
    cantrip: true,
    stats: { intellect: 603, stamina: 2192, haste: 104 },
    effect: 'Ataques de feitiço reduzem a velocidade de lançamento do inimigo em 10% e concedem +71 de Aceleração por 12 s.',
    icon: 'inv_knife_1h_ulatekfang_d_01_spirit',
    quality: 'epic'
  },
  {
    id: 281029,
    namePt: 'Elo do Chama-enxame',
    nameEn: 'Band of the Swarmcaller',
    slot: 'finger2',
    ilvl: 334,
    source: 'raid',
    sourceDetail: 'Raide: Kith\'ix',
    stats: { stamina: 2199, haste: 110, mastery: 295 },
    effect: 'Chance de evocar o Flagelo da Ninhada Ácida, causando dano de Natureza em área.',
    icon: '8268560',
    quality: 'epic'
  },
  {
    id: 281215,
    namePt: 'Tentáculo do Terror Pervertido',
    nameEn: 'Spirehorn\'s Corrupted Tentacle',
    slot: 'trinket1',
    ilvl: 334,
    source: 'raid',
    sourceDetail: 'Raide: Kith\'ix',
    stats: { intellect: 180 },
    isTrinketPassive: true,
    effect: 'Dano tem chance de conceder Poder Devastador (+35 Crítico por 15 s, acumula). Ao bater em novo alvo, ganha 3 aplicações.',
    icon: '8268563',
    quality: 'epic'
  },
  {
    id: 270164,
    namePt: 'Bolsa sem Fundo de Gebbo',
    nameEn: 'Gebbo\'s Bottomless Bag',
    slot: 'trinket2',
    ilvl: 334,
    source: 'raid',
    sourceDetail: 'Raide: Exploradores Perdidos',
    stats: { intellect: 180 },
    isTrinketPassive: true,
    effect: 'Retira periodicamente artefatos da bolsa, concedendo bônus aleatório a Aceleração, Maestria ou Crítico.',
    icon: 'inv_10_tailoring_bag1_color2',
    quality: 'epic'
  },

  // --- DRUIDA DO EQUILÍBRIO: TIER 2057 (Casca do Velassonhos Enigmático) ---
  {
    id: 271528,
    namePt: 'Olhar Soporífero do Velassonhos Enigmático',
    nameEn: 'Dreamwatcher\'s Soporific Gaze',
    slot: 'head',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalyst / Great Vault (Tier 2057)',
    armorType: 'leather',
    stats: { intellect: 189, stamina: 3910, haste: 142, versatility: 59 },
    isTier: true,
    tierPiece: 'Druida T2057',
    icon: 'inv_helm_leather_raiddruidulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271526,
    namePt: 'Plumagem do Velassonhos Enigmático',
    nameEn: 'Dreamwatcher\'s Plumage',
    slot: 'shoulders',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalyst / Great Vault (Tier 2057)',
    armorType: 'leather',
    stats: { intellect: 141, stamina: 2932, crit: 104, mastery: 47 },
    isTier: true,
    tierPiece: 'Druida T2057',
    icon: 'inv_shoulder_leather_raiddruidulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271531,
    namePt: 'Traje Lunar do Velassonhos Enigmático',
    nameEn: 'Dreamwatcher\'s Lunar Garb',
    slot: 'chest',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalyst / Great Vault (Tier 2057)',
    armorType: 'leather',
    stats: { intellect: 189, stamina: 3910, crit: 131, haste: 70 },
    isTier: true,
    tierPiece: 'Druida T2057',
    icon: 'inv_robe_leather_raiddruidulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271529,
    namePt: 'Manoplas do Velassonhos Enigmático',
    nameEn: 'Dreamwatcher\'s Gauntlets',
    slot: 'hands',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalyst / Great Vault (Tier 2057)',
    armorType: 'leather',
    stats: { intellect: 141, stamina: 2932, mastery: 44, versatility: 106 },
    isTier: true,
    tierPiece: 'Druida T2057',
    icon: 'inv_glove_leather_raiddruidulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271527,
    namePt: 'Perneiras do Velassonhos Enigmático',
    nameEn: 'Dreamwatcher\'s Leggings',
    slot: 'legs',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalyst / Great Vault (Tier 2057)',
    armorType: 'leather',
    stats: { intellect: 189, stamina: 3910, crit: 67, haste: 134 },
    isTier: true,
    tierPiece: 'Druida T2057',
    icon: 'inv_pant_leather_raiddruidulatek_d_01',
    quality: 'epic'
  },
  {
    id: 244576,
    namePt: 'Defletores do Agente de Luaprata',
    nameEn: 'Silvermoon Agent\'s Deflectors',
    slot: 'wrists',
    ilvl: 331,
    normalizedIlvl: 331,
    source: 'craft',
    sourceDetail: 'Craft: Couraria (Centelha de Marés)',
    armorType: 'leather',
    isCrafted: true,
    craftMissivesAllowed: true,
    stats: { intellect: 102, stamina: 2100, haste: 88, mastery: 48 },
    embellished: true,
    notes: 'Recomendado com Forro de Arcanotrama e Missiva Febre Ardente (Mae/Ace)',
    icon: 'inv_bracer_leather_dungeonharronir_c_01',
    quality: 'epic'
  },
  {
    id: 244569,
    namePt: 'Calçados do Agente de Luaprata',
    nameEn: 'Silvermoon Agent\'s Sneakers',
    slot: 'feet',
    ilvl: 331,
    normalizedIlvl: 331,
    source: 'craft',
    sourceDetail: 'Craft: Couraria (Centelha de Marés)',
    armorType: 'leather',
    isCrafted: true,
    craftMissivesAllowed: true,
    stats: { intellect: 141, stamina: 2932, haste: 98, mastery: 54 },
    notes: 'Fabricação de Couraria. Secundários ajustados com Missiva.',
    icon: 'inv_boot_leather_outdooramaniloa_c_01',
    quality: 'epic'
  },
  {
    id: 273796,
    namePt: 'Ampola Torpe de Peçonha Volátil',
    nameEn: 'Vile Flask of Volatile Venom',
    slot: 'trinket1',
    ilvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Altar das Presas',
    stats: { intellect: 180 },
    isTrinketOnUse: true,
    effect: 'Uso: Concede +992 a um atributo secundário aleatório com penalidade de -142 em outro por 15 s. Recarga: 2 min.',
    icon: 'inv_121_trinket_dungeon_ulatek_vile',
    quality: 'epic'
  },
  {
    id: 270169,
    namePt: 'Ídolo da Perdição do Grão-bagateiro',
    nameEn: 'High Trinketeer\'s Idol of Ruin',
    slot: 'trinket2',
    ilvl: 344,
    source: 'raid',
    sourceDetail: 'Raide: Altar Enrolado',
    stats: { haste: 149 },
    isTrinketOnUse: true,
    effect: 'Equipar: Drena 1 Intelecto a cada 6 s (até 30 acúmulos). Uso: Consome os acúmulos e concede +12 Intelecto por acúmulo (até +360) por 30 s. Recarga: 30 s.',
    icon: 'inv_archaeology_orcclans_crackedidol',
    quality: 'epic'
  },

  // --- SACERDOTE DAS SOMBRAS: TIER 2063 (Fatiota do Penitente Cósmico) & ITENS ESPECÍFICOS ---
  {
    id: 271555,
    namePt: 'Visão Verdadeira do Penitente Cósmico',
    nameEn: 'Cosmic Penitent\'s Truesight',
    slot: 'head',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalyst / Great Vault (Tier 2063)',
    armorType: 'cloth',
    stats: { intellect: 189, stamina: 3910, crit: 141, mastery: 60 },
    isTier: true,
    tierPiece: 'Sacerdote T2063',
    icon: 'inv_helm_cloth_raidpriestulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271553,
    namePt: 'Gritos Ecoantes do Penitente Cósmico',
    nameEn: 'Cosmic Penitent\'s Echoing Screams',
    slot: 'shoulders',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalyst / Great Vault (Tier 2063)',
    armorType: 'cloth',
    stats: { intellect: 141, stamina: 2932, crit: 101, haste: 49 },
    isTier: true,
    tierPiece: 'Sacerdote T2063',
    icon: 'inv_shoulder_cloth_raidpriestulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271558,
    namePt: 'Vestes Eclipsantes do Penitente Cósmico',
    nameEn: 'Cosmic Penitent\'s Eclipsing Robes',
    slot: 'chest',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalyst / Great Vault (Tier 2063)',
    armorType: 'cloth',
    stats: { intellect: 189, stamina: 3910, crit: 62, mastery: 139 },
    isTier: true,
    tierPiece: 'Sacerdote T2063',
    icon: 'inv_robe_cloth_raidpriestulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271556,
    namePt: 'Guantes Celestiais do Penitente Cósmico',
    nameEn: 'Cosmic Penitent\'s Celestial Grips',
    slot: 'hands',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalyst / Great Vault (Tier 2063)',
    armorType: 'cloth',
    stats: { intellect: 141, stamina: 2932, crit: 53, mastery: 98 },
    isTier: true,
    tierPiece: 'Sacerdote T2063',
    icon: 'inv_glove_cloth_raidpriestulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271554,
    namePt: 'Culotes Envolventes do Penitente Cósmico',
    nameEn: 'Enveloping Legwraps of the Cosmic Penitent',
    slot: 'legs',
    ilvl: 334,
    source: 'catalyst',
    sourceDetail: 'Catalyst / Great Vault (Tier 2063)',
    armorType: 'cloth',
    stats: { intellect: 189, stamina: 3910, haste: 143, versatility: 58 },
    isTier: true,
    tierPiece: 'Sacerdote T2063',
    icon: 'inv_pant_cloth_raidpriestulatek_d_01',
    quality: 'epic'
  },
  {
    id: 239045,
    namePt: 'Dragonas da Ascensão Cerimonial',
    nameEn: 'Mantle of Ceremonial Ascension',
    slot: 'shoulders',
    ilvl: 334,
    source: 'mplus',
    sourceDetail: 'Masmorra M+: Repouso do Rei',
    armorType: 'cloth',
    stats: { intellect: 141, stamina: 2932, haste: 52, mastery: 99 },
    notes: 'BiS de M+ fora do tier (ombros livres)',
    icon: 'inv_shoulder_cloth_zandalardungeon_c_01',
    quality: 'epic'
  },
  {
    id: 268197,
    namePt: 'Espinha do Abismo Sibilante',
    nameEn: 'Spine of the Hissing Abyss',
    slot: 'off_hand',
    ilvl: 334,
    source: 'raid',
    sourceDetail: 'Raide: Sentinelas Entombadas',
    weaponType: 'off_hand',
    stats: { intellect: 289, stamina: 1955, haste: 32, mastery: 68 },
    icon: 'inv_offhand_1h_ulatek_d_01',
    quality: 'epic'
  },
  {
    id: 271543,
    namePt: 'Cilha Tilintante do Necrólito Maldito',
    nameEn: 'Clinking Cinch of the Damned Necrolyte',
    slot: 'waist',
    ilvl: 334,
    source: 'raid',
    sourceDetail: "Raide: Abismo Peçonhento (Templo de Ula'tek)",
    armorType: 'cloth',
    stats: { intellect: 141, stamina: 2932, haste: 95, mastery: 56 },
    icon: 'inv_belt_cloth_raidwarlockulatek_d_01',
    quality: 'epic',
    notes: 'Cinto de raide alternativo do Bruxo.'
  },
  {
    id: 275527,
    namePt: 'Sinete do Rapinador',
    nameEn: 'Preyhunter\'s Signet',
    slot: 'finger1',
    ilvl: 321,
    source: 'delve',
    sourceDetail: "Imersões (Labirinto de Kindo'jan) — anel",
    stats: { stamina: 1629, haste: 129, mastery: 218 },
    icon: 'inv_121_jewelry_ring03_orange',
    quality: 'epic'
  },
  {
    id: 251156,
    namePt: 'Cajado do Orador Decaído',
    nameEn: 'Fallen Speaker\'s Staff',
    slot: 'main_hand',
    ilvl: 341,
    source: 'delve',
    sourceDetail: "Imersões (Labirinto de Kindo'jan) — cajado 2M",
    weaponType: 'staff_2h',
    icon: 'inv_staff_2h_amani_c_01',
    quality: 'epic'
  }
];

// --- Reconciliação com o catálogo Python (fonte única) ---
// O backend expõe /api/catalog/items com nomes PT/EN oficiais. Aplicamos um
// override em memória para que getItemById devolva o nome canônico do Python.
const CATALOG_OVERRIDES = new Map<number, Partial<WowItem>>();

export interface CatalogItemLite {
  id: number;
  nome_pt?: string | null;
  nome_en?: string | null;
  slot?: string | null;
  ilvl?: number | null;
  craftado?: boolean;
  embellished?: boolean;
  embelezado_embutido?: boolean;
  aceita_embelezamento?: boolean;
  embelezamento_recomendado?: string | null;
  limite_embelezamentos?: number | null;
  icon?: string | null;
}

export function aplicarCatalogo(itens: CatalogItemLite[]): number {
  let aplicados = 0;
  for (const item of itens) {
    const patch: Partial<WowItem> = {};
    if (item.nome_pt) patch.namePt = item.nome_pt;
    if (item.nome_en) patch.nameEn = item.nome_en;
    if (item.slot) patch.slot = item.slot as ItemSlot;
    if (typeof item.ilvl === 'number') patch.ilvl = item.ilvl;
    if (item.icon) patch.icon = item.icon;
    if (item.craftado) patch.isCrafted = true;
    // Never clear a curated local embellishment flag with a catalog "false":
    // several craftable bases are used with an optional embellishment in the
    // recommended builds even though the base recipe has none built in.
    if (item.embellished) patch.embellished = true;
    if (item.aceita_embelezamento) patch.acceptsEmbellishment = true;
    if (item.embelezamento_recomendado) {
      patch.embellishmentRecommendation = item.embelezamento_recomendado;
      patch.embellishmentName = item.embelezamento_recomendado;
    }
    if (Object.keys(patch).length === 0) continue;
    const atual = CATALOG_OVERRIDES.get(item.id) || {};
    CATALOG_OVERRIDES.set(item.id, { ...atual, ...patch });
    aplicados++;
  }
  return aplicados;
}

export function aplicarIcones(icones: Record<string, string>): number {
  let aplicados = 0;
  for (const [chave, icon] of Object.entries(icones)) {
    const id = Number(chave);
    if (!Number.isFinite(id) || !icon) continue;
    const atual = CATALOG_OVERRIDES.get(id) || {};
    CATALOG_OVERRIDES.set(id, { ...atual, icon });
    aplicados++;
  }
  return aplicados;
}

export function getItemById(id: number): WowItem | undefined {
  const base = WOW_ITEMS.find(item => item.id === id);
  const override = CATALOG_OVERRIDES.get(id);
  if (base) return override ? { ...base, ...override } : base;
  // Items outside the static list (delve/craft/raid) still get name and icon
  // from the Python catalog overrides; synthesise a minimal item so the UI
  // never falls back to "Item <id>" when the backend knows the item.
  if (!override) return undefined;
  const nome = override.namePt ?? override.nameEn ?? `Item ${id}`;
  return {
    id,
    namePt: override.namePt ?? nome,
    nameEn: override.nameEn ?? nome,
    slot: (override.slot as ItemSlot) ?? 'head',
    ilvl: override.ilvl ?? 0,
    source: 'vendor',
    sourceDetail: 'Catálogo',
    ...override,
  } as WowItem;
}

export function getItemsBySlot(slot: string): WowItem[] {
  return WOW_ITEMS.filter(
    item =>
      item.slot === slot ||
      (slot.startsWith('finger') && item.slot.startsWith('finger')) ||
      (slot.startsWith('trinket') && item.slot.startsWith('trinket'))
  );
}

export function getItemsBySource(source: string): WowItem[] {
  return WOW_ITEMS.filter(item => item.source === source);
}

export function getItemIconUrl(item?: WowItem | null): string {
  if (!item || !item.icon) {
    return 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
  }
  return `https://wow.zamimg.com/images/wow/icons/medium/${item.icon}.jpg`;
}

export function getItemQualityBorder(item?: WowItem | null): string {
  if (!item) return 'border-zinc-700';
  if (item.quality === 'epic') return 'border-[#a335ee] shadow-[0_0_8px_rgba(163,53,238,0.3)]';
  if (item.quality === 'rare') return 'border-[#0070dd] shadow-[0_0_8px_rgba(0,112,221,0.3)]';
  if (item.quality === 'artifact') return 'border-[#e6cc80] shadow-[0_0_8px_rgba(230,204,128,0.3)]';
  return 'border-zinc-600';
}
