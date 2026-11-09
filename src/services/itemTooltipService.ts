import { WOW_ITEMS, getItemById } from '../data/items';
import { getEmbellishmentDescription } from '../data/embellishments';

export interface FullItemTooltip {
  id: number;
  namePt: string;
  nameEn: string;
  quality: 'epic' | 'rare' | 'uncommon' | 'artifact';
  qualityColor: string; // e.g. '#a335ee'
  qualityBorder: string;
  ilvl: number;
  track?: string; // e.g. 'Mito 6/6' | 'Herói 6/6'
  slot: string;
  armorOrWeaponType?: string; // e.g. 'Tecido', 'Couro', 'Adaga'
  primaryStat?: { name: string; value: number };
  stamina?: number;
  secondaryStats: Array<{ name: string; value: number; key: string }>;
  effect?: string;
  embellished?: boolean;
  embellishmentName?: string;
  embellishmentDescription?: string;
  embellishmentRecommendation?: string;
  acceptsEmbellishment?: boolean;
  isTier?: boolean;
  tierPiece?: string;
  isCrafted?: boolean;
  sourceLocation: string; // e.g. "Masmorra M+: Altar das Presas (Altar of Fangs)"
  roleTag?: string; // e.g. "BiS Direto", "Matéria de Tier (Catalisador)"
  notes?: string;
  icon: string;
  iconUrl: string;
  flavorText?: string;
}

// In-memory real-time cache
const tooltipCache = new Map<string, FullItemTooltip>();

// Static audit database of 12.1.5 items for zero-latency instant display
const OFFICIAL_1215_DATABASE: Record<number, Partial<FullItemTooltip>> = {
  // --- BERLOQUES ---
  273649: {
    id: 273649,
    namePt: 'Emblema Tempestuoso de Dazar',
    nameEn: 'Stormbound Emblem of Dazar',
    quality: 'epic',
    slot: 'Berloque',
    icon: 'inv_7_0raid_necklace_14a',
    primaryStat: { name: 'Intelecto', value: 191 },
    secondaryStats: [],
    effect: 'Uso: O espírito de Dazar canaliza uma tempestade ancestral, concedendo 1.082 de Aceleração por 20 s. (Recarga de 2 min - Regra R4)',
    sourceLocation: "Masmorra M+: Repouso do Rei (King's Rest) — Chefe: Dazar, o Primeiro Rei",
    roleTag: 'BiS Direto',
    notes: 'Melhor berloque on-use da Temporada 2 para conjuradores sem raide.'
  },
  273796: {
    id: 273796,
    namePt: 'Ampola Torpe de Peçonha Volátil',
    nameEn: 'Vile Vial of Volatile Venom',
    quality: 'epic',
    slot: 'Berloque',
    icon: 'inv_121_trinket_dungeon_ulatek_vile',
    primaryStat: { name: 'Intelecto', value: 191 },
    secondaryStats: [],
    effect: 'Uso: Quebra a ampola no chão gerando uma névoa tóxica que concede 992 de Aceleração e Maestria por 15 s. (Recarga de 1 min 30 s)',
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: Rav\'i',
    roleTag: 'BiS Direto',
    notes: 'Berloque ativo de altíssimo burst para dano em área e chefes.'
  },
  273794: {
    id: 273794,
    namePt: 'Nó de Serpentes Contorcidas',
    nameEn: 'Knot of Writhing Serpents',
    quality: 'epic',
    slot: 'Berloque',
    icon: 'inv_121_trinket_dungeon_ulatek_writhe',
    primaryStat: { name: 'Intelecto', value: 191 },
    secondaryStats: [],
    effect: 'Equipar: Seus feitiços de dano periódico e invocações têm chance de despertar serpentes espectrais que causam dano de Natureza e aumentam seu Intelecto em 412 por 12 s.',
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: O Enovelado Rastejante',
    roleTag: 'BiS Direto',
    notes: 'Melhor berloque passivo de Intelecto sem raide. Combina com Dazar respeitando a Regra R4.'
  },
  250215: {
    id: 250215,
    namePt: 'Frasco do Cargueiro',
    nameEn: 'Freightrunner\'s Flask',
    quality: 'epic',
    slot: 'Berloque',
    icon: 'inv_alchemy_90_flask_red',
    primaryStat: { name: 'Intelecto', value: 191 },
    secondaryStats: [],
    effect: 'Uso: Injeta adrenalina de Luaprata, concedendo 845 de Aceleração por 15 s. (Recarga de 1 min 30 s)',
    sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row) — Chefe: Kystia Coração de Mana',
    roleTag: 'Progressão M+',
    notes: 'Excelente opção de burst alternativo.'
  },
  250224: {
    id: 250224,
    namePt: 'Signo do Furamentes',
    nameEn: 'Mindpiercer\'s Sigil',
    quality: 'epic',
    slot: 'Berloque',
    icon: 'inv_icon_shadowcouncilorb_purple',
    primaryStat: { name: 'Intelecto', value: 191 },
    secondaryStats: [],
    effect: 'Equipar: Feitiços de alvo único cravam agulhas mentais no alvo que explodem causando dano de Sombra após 4 acúmulos.',
    sourceLocation: 'Masmorra M+: Arena da Chaga do Caos (Voidscar Arena) — Chefe: Taz\'Rah',
    roleTag: 'Progressão M+',
    notes: 'Passivo forte para encontros de alvo único.'
  },
  193757: {
    id: 193757,
    namePt: 'Casca de Dragonete Rubi',
    nameEn: 'Ruby Whelp Shell',
    quality: 'epic',
    slot: 'Berloque',
    icon: 'inv_item_dragonegg_redbroken01',
    primaryStat: { name: 'Intelecto', value: 191 },
    secondaryStats: [],
    effect: 'Equipar: Treina um dragonete rubi que periodicamente cospe chamas causando dano de Fogo e concedendo bônus aos seus atributos.',
    sourceLocation: 'Masmorra M+: Poços da Vida Rubi (Ruby Life Pools) — Chefe: Melidrussa Geladrussa',
    roleTag: 'Progressão M+',
    notes: 'Berloque clássico adaptado para o patch 12.1.5.'
  },

  // --- TECIDO (WARLOCK & SHADOW PRIEST) ---
  273785: {
    id: 273785,
    namePt: 'Veste de Ritos Primordial',
    nameEn: 'Primordial Robe of Rites',
    quality: 'epic',
    slot: 'Peitoral',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_robe_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 189 },
    stamina: 3910,
    secondaryStats: [
      { name: 'Aceleração', value: 105, key: 'haste' },
      { name: 'Maestria', value: 96, key: 'mastery' }
    ],
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: Zul\'jan',
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Drop no track Mítico (334). Converte no Catalisador Matriz no Peitoral 4pc mantendo ilvl 334!'
  },
  273786: {
    id: 273786,
    namePt: 'Perneiras de Serpentes Entrelaçadas',
    nameEn: 'Leggings of Entwined Serpents',
    quality: 'epic',
    slot: 'Pernas',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_pant_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 189 },
    stamina: 3910,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 110, key: 'crit' },
      { name: 'Aceleração', value: 90, key: 'haste' }
    ],
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: Rav\'i',
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Matéria-prima de Tier 4pc para Calças no Catalisador Matriz.'
  },
  273773: {
    id: 273773,
    namePt: 'Mitenes de Ritos Blasfemos',
    nameEn: 'Handwraps of Blasphemous Rites',
    quality: 'epic',
    slot: 'Mãos',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_glove_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 141 },
    stamina: 2932,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 69, key: 'crit' },
      { name: 'Maestria', value: 82, key: 'mastery' }
    ],
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: O Enovelado Rastejante',
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Converte em Luvas de Tier 4pc no Catalisador Matriz.'
  },
  239045: {
    id: 239045,
    namePt: 'Dragonas da Ascensão Cerimonial',
    nameEn: 'Mantle of Ceremonial Ascension',
    quality: 'epic',
    slot: 'Ombros',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_shoulder_cloth_zandalardungeon_c_01',
    primaryStat: { name: 'Intelecto', value: 141 },
    stamina: 2932,
    secondaryStats: [
      { name: 'Aceleração', value: 52, key: 'haste' },
      { name: 'Maestria', value: 99, key: 'mastery' }
    ],
    sourceLocation: "Masmorra M+: Repouso do Rei (King's Rest) — Chefe: Muquimba, o Embalsamador",
    roleTag: 'BiS Direto',
    notes: 'BiS absoluto para o 5º slot livre fora do Tier 4pc! Combinação perfeita de Aceleração e Maestria.'
  },
  239047: {
    id: 239047,
    namePt: 'Turbante do Primeiro Império',
    nameEn: 'Headdress of the First Empire',
    quality: 'epic',
    slot: 'Cabeça',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_helm_cloth_zandalardungeon_c_01',
    primaryStat: { name: 'Intelecto', value: 189 },
    stamina: 3910,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 88, key: 'crit' },
      { name: 'Versatilidade', value: 113, key: 'versatility' }
    ],
    sourceLocation: "Masmorra M+: Repouso do Rei (King's Rest) — Chefe: A Serpente Dourada",
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Converte no Catalisador Matriz em Elmo de Tier 4pc ilvl 334.'
  },
  251222: {
    id: 251222,
    namePt: 'Atadura do Éter Etérea',
    nameEn: 'Ethereal Netherwrap',
    quality: 'epic',
    slot: 'Cinto',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_belt_cloth_dungeonharronir_c_01',
    primaryStat: { name: 'Intelecto', value: 141 },
    stamina: 2932,
    secondaryStats: [
      { name: 'Aceleração', value: 95, key: 'haste' },
      { name: 'Acerto Crítico', value: 56, key: 'crit' }
    ],
    sourceLocation: 'Masmorra M+: Arena da Chaga do Caos (Voidscar Arena) — Chefe: Atroxus',
    roleTag: 'BiS Direto',
    notes: 'BiS da Série 2 para Cinto sem raide: Aceleração primária dominante.'
  },
  251132: {
    id: 251132,
    namePt: 'Mortalha do Inferninho',
    nameEn: 'Speakeasy Shroud',
    quality: 'epic',
    slot: 'Costas',
    icon: 'inv_cape_leather_dungeonharronir_c_01',
    primaryStat: { name: 'Intelecto', value: 106 },
    stamina: 2199,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 66, key: 'crit' },
      { name: 'Maestria', value: 47, key: 'mastery' }
    ],
    sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row) — Chefe: Lithiel Fúria de Brasa',
    roleTag: 'BiS Direto',
    notes: 'BiS de Costas universal para conjuradores em M+.'
  },
  272234: {
    id: 272234,
    namePt: 'Mitra do Pisa-piras',
    nameEn: "Pyretreader's Miter",
    quality: 'epic',
    slot: 'Cabeça',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_helm_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 172 },
    stamina: 3510,
    secondaryStats: [
      { name: 'Aceleração', value: 71, key: 'haste' },
      { name: 'Maestria', value: 119, key: 'mastery' }
    ],
    sourceLocation: "Imersão Solo: Wah'du / Labirinto de Kindo'jan (Tier 8+)",
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Comprado com Fragmentos de Alma Mítica de Delve. Converte em Tier 4pc no Catalisador.'
  },
  272236: {
    id: 272236,
    namePt: 'Dragonas do Pisa-piras',
    nameEn: "Pyretreader's Pauldrons",
    quality: 'epic',
    slot: 'Ombros',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_shoulder_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 128 },
    stamina: 2650,
    secondaryStats: [
      { name: 'Aceleração', value: 87, key: 'haste' },
      { name: 'Versatilidade', value: 56, key: 'versatility' }
    ],
    sourceLocation: "Imersão Solo: Wah'du / Labirinto de Kindo'jan (Tier 8+)",
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Conjunto oficial de Imersão Pisa-piras 321/334.'
  },
  272231: {
    id: 272231,
    namePt: 'Perponte do Pisa-piras',
    nameEn: "Pyretreader's Gambeson",
    quality: 'epic',
    slot: 'Torso',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_robe_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 162 },
    stamina: 3200,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 122, key: 'crit' },
      { name: 'Maestria', value: 68, key: 'mastery' }
    ],
    sourceLocation: "Imersão Solo: Wah'du / Labirinto de Kindo'jan (Tier 8+)",
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Conjunto Pisa-piras. Mítico 2/6.'
  },
  272238: {
    id: 272238,
    namePt: 'Cingidouro do Pisa-piras',
    nameEn: "Pyretreader's Cinch",
    quality: 'epic',
    slot: 'Pulsos',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_bracer_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 91 },
    stamina: 1800,
    secondaryStats: [
      { name: 'Versatilidade', value: 69, key: 'versatility' },
      { name: 'Maestria', value: 38, key: 'mastery' }
    ],
    sourceLocation: "Imersão Solo: Wah'du / Labirinto de Kindo'jan (Tier 8+)",
    roleTag: 'Progressão Solo',
    notes: 'Auditado no catálogo oficial: Cingidouro é PULSOS (Wrists), não cintura.'
  },
  272233: {
    id: 272233,
    namePt: 'Luvas do Pisa-piras',
    nameEn: "Pyretreader's Gloves",
    quality: 'epic',
    slot: 'Mãos',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_glove_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 121 },
    stamina: 2400,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 86, key: 'crit' },
      { name: 'Maestria', value: 56, key: 'mastery' }
    ],
    sourceLocation: "Imersão Solo: Wah'du / Labirinto de Kindo'jan (Tier 8+)",
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Conjunto Pisa-piras. Mítico 2/6.'
  },
  272237: {
    id: 272237,
    namePt: 'Obi do Pisa-piras',
    nameEn: "Pyretreader's Sash",
    quality: 'epic',
    slot: 'Cinto',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_belt_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 121 },
    stamina: 2400,
    secondaryStats: [
      { name: 'Versatilidade', value: 56, key: 'versatility' },
      { name: 'Maestria', value: 87, key: 'mastery' }
    ],
    sourceLocation: "Imersão Solo: Wah'du / Labirinto de Kindo'jan (Tier 8+)",
    roleTag: 'Progressão Solo',
    notes: 'Conjunto Pisa-piras. Mítico 2/6.'
  },
  272235: {
    id: 272235,
    namePt: 'Botinas do Pisa-piras',
    nameEn: "Pyretreader's Treads",
    quality: 'epic',
    slot: 'Pernas',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_pant_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 162 },
    stamina: 3200,
    secondaryStats: [
      { name: 'Aceleração', value: 73, key: 'haste' },
      { name: 'Versatilidade', value: 117, key: 'versatility' }
    ],
    sourceLocation: "Imersão Solo: Wah'du / Labirinto de Kindo'jan (Tier 8+)",
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Auditado: Botinas é PERNAS (Legs) no cliente oficial PT-BR.'
  },
  272232: {
    id: 272232,
    namePt: 'Alpargatas do Pisa-piras',
    nameEn: "Pyretreader's Slippers",
    quality: 'epic',
    slot: 'Pés',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_boot_cloth_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 121 },
    stamina: 2400,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 50, key: 'crit' },
      { name: 'Aceleração', value: 92, key: 'haste' }
    ],
    sourceLocation: "Imersão Solo: Wah'du / Labirinto de Kindo'jan (Tier 8+)",
    roleTag: 'Progressão Solo',
    notes: 'Conjunto Pisa-piras. Mítico 2/6.'
  },

  // --- COURO (BALANCE DRUID) ---
  273791: {
    id: 273791,
    namePt: 'Capuz do Porta-voz Sobressalente',
    nameEn: "Spare Speaker's Hood",
    quality: 'epic',
    slot: 'Cabeça',
    armorOrWeaponType: 'Couro',
    icon: 'inv_helm_leather_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 189 },
    stamina: 3910,
    secondaryStats: [
      { name: 'Aceleração', value: 115, key: 'haste' },
      { name: 'Acerto Crítico', value: 86, key: 'crit' }
    ],
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: Zul\'jan',
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Converte no Catalisador em Olhar Soporífero [271528] (Tier 2057).'
  },
  273774: {
    id: 273774,
    namePt: 'Espaldares de Couro de Cobra',
    nameEn: 'Snakeskin Spaulders',
    quality: 'epic',
    slot: 'Ombros',
    armorOrWeaponType: 'Couro',
    icon: 'inv_shoulder_leather_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 141 },
    stamina: 2932,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 88, key: 'crit' },
      { name: 'Versatilidade', value: 62, key: 'versatility' }
    ],
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: O Enovelado Rastejante',
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Converte no Catalisador em Plumagem do Velassonhos [271526] (Tier 2057).'
  },
  239048: {
    id: 239048,
    namePt: 'Colete da Adoração Reverente',
    nameEn: 'Vest of Reverent Adoration',
    quality: 'epic',
    slot: 'Peitoral',
    armorOrWeaponType: 'Couro',
    icon: 'inv_chest_leather_zandalardungeon_c_01',
    primaryStat: { name: 'Intelecto', value: 189 },
    stamina: 3910,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 113, key: 'crit' },
      { name: 'Maestria', value: 88, key: 'mastery' }
    ],
    sourceLocation: "Masmorra M+: Repouso do Rei (King's Rest) — Chefe: Conselho das Tribos",
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Converte no Catalisador em Traje Lunar [271531] (Tier 2057).'
  },
  251124: {
    id: 251124,
    namePt: 'Manoplas da Defesa Febril',
    nameEn: 'Gauntlets of Fevered Defense',
    quality: 'epic',
    slot: 'Mãos',
    armorOrWeaponType: 'Couro',
    icon: 'inv_glove_leather_dungeonharronir_c_01',
    primaryStat: { name: 'Intelecto', value: 141 },
    stamina: 2932,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 98, key: 'crit' },
      { name: 'Aceleração', value: 53, key: 'haste' }
    ],
    sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row) — Chefe: Zaen Lâmina do Luto',
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Converte em Luvas de Tier 2057.'
  },
  251130: {
    id: 251130,
    namePt: 'Calções do Acordo Célere',
    nameEn: 'Breeches of Deft Deals',
    quality: 'epic',
    slot: 'Pernas',
    armorOrWeaponType: 'Couro',
    icon: 'inv_pant_leather_dungeonharronir_c_01',
    primaryStat: { name: 'Intelecto', value: 189 },
    stamina: 3910,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 118, key: 'crit' },
      { name: 'Maestria', value: 83, key: 'mastery' }
    ],
    sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row) — Chefe: Lithiel Fúria de Brasa',
    roleTag: 'Matéria de Tier (Catalisador)',
    notes: 'Converte em Perneiras do Velassonhos [271527] (Fecha 4pc Tier 2057).'
  },
  159317: {
    id: 159317,
    namePt: 'Faixa do Dervixe Giratório',
    nameEn: 'Whirling Dervish Sash',
    quality: 'epic',
    slot: 'Cinto',
    armorOrWeaponType: 'Couro',
    icon: 'inv_belt_leather_zandalardungeon_c_01',
    primaryStat: { name: 'Intelecto', value: 141 },
    stamina: 2932,
    secondaryStats: [
      { name: 'Maestria', value: 91, key: 'mastery' },
      { name: 'Aceleração', value: 59, key: 'haste' }
    ],
    sourceLocation: 'Masmorra M+: Templo de Sethraliss (Temple of Sethraliss) — Chefe: Adderis e Aspix',
    roleTag: 'Upgrade de Secundários',
    notes: 'BiS Cinto para Druida Equilíbrio com Maestria dominante.'
  },

  // --- ACESSÓRIOS & ARMAS ---
  273778: {
    id: 273778,
    namePt: 'Canalizador de Lumineira Polido',
    nameEn: 'Polished Lightwood Channeler',
    quality: 'epic',
    slot: 'Arma de Uma Mão',
    armorOrWeaponType: 'Adaga',
    icon: 'inv_knife_1h_zuljin_d_01',
    primaryStat: { name: 'Intelecto', value: 586 },
    stamina: 2118,
    secondaryStats: [
      { name: 'Aceleração', value: 58, key: 'haste' },
      { name: 'Maestria', value: 46, key: 'mastery' }
    ],
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: Zul\'jan',
    roleTag: 'BiS Direto',
    notes: 'Melhor adaga de Intelecto em M+ (cuidado: 5 das 8 adagas de M+ são de Agilidade!).'
  },
  273779: {
    id: 273779,
    namePt: 'Presa Focal Maléfica',
    nameEn: 'Nocuous Focal Fang',
    quality: 'epic',
    slot: 'Mão Secundária',
    armorOrWeaponType: 'Mão Secundária',
    icon: 'inv_offhand_1h_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 289 },
    stamina: 1955,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 57, key: 'crit' },
      { name: 'Aceleração', value: 44, key: 'haste' }
    ],
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: Rav\'i',
    roleTag: 'BiS Direto',
    notes: 'Mão secundária com Aceleração e Crítico para usar com Canalizador.'
  },
  273792: {
    id: 273792,
    namePt: 'Elo do Senhor da Guerra Amani',
    nameEn: 'Band of the Amani Warlord',
    quality: 'epic',
    slot: 'Dedo (Anel)',
    icon: 'inv_121_jewelry_ring02_green',
    stamina: 2199,
    secondaryStats: [
      { name: 'Aceleração', value: 258, key: 'haste' },
      { name: 'Acerto Crítico', value: 147, key: 'crit' }
    ],
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: Zul\'jan',
    roleTag: 'BiS Direto',
    notes: 'Anel com Aceleração primária massiva de M+.'
  },
  273781: {
    id: 273781,
    namePt: 'Feixe de Presas Protetoras',
    nameEn: 'Bundle of Protective Fangs',
    quality: 'epic',
    slot: 'Pescoço',
    icon: 'inv_121_jewelry_neck03_teal',
    stamina: 2199,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 236, key: 'crit' },
      { name: 'Aceleração', value: 169, key: 'haste' }
    ],
    sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs) — Chefe: Rav\'i',
    roleTag: 'BiS Direto',
    notes: 'Pescoço de M+ com Crítico e Aceleração.'
  },
  158366: {
    id: 158366,
    namePt: 'Elo de Arenito Carregado',
    nameEn: 'Charged Sandstone Band',
    quality: 'epic',
    slot: 'Dedo (Anel)',
    icon: 'inv_ring_80_03d',
    stamina: 2199,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 232, key: 'crit' },
      { name: 'Maestria', value: 174, key: 'mastery' }
    ],
    sourceLocation: 'Masmorra M+: Templo de Sethraliss (Temple of Sethraliss) — Chefe: Galvazzt',
    roleTag: 'BiS Direto',
    notes: 'Anel clássico com Crítico e Maestria excepcionais.'
  },

  // --- ARMAS E MÃOS SECUNDÁRIAS DE DELVE: WAH'DU ---
  272266: {
    id: 272266,
    namePt: 'Adaga do Eidolon Esquecido',
    nameEn: 'Dagger of the Forgotten Eidolon',
    quality: 'epic',
    slot: 'Arma de Uma Mão',
    armorOrWeaponType: 'Adaga',
    icon: 'inv_knife_1h_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 504 },
    stamina: 1800,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 29, key: 'crit' },
      { name: 'Aceleração', value: 19, key: 'haste' }
    ],
    sourceLocation: "Wah'du / Labirinto de Kindo'jan (Tier 8+)",
    roleTag: 'Forjado com Peçonha: Herói (328)',
    notes: 'Adaga de Intelecto Forjada com Peçonha (+7 ilvl sobre o teto 321).'
  },
  272270: {
    id: 272270,
    namePt: 'Pilão de Pó de Osso',
    nameEn: 'Bone Powder Pestle',
    quality: 'epic',
    slot: 'Arma de Uma Mão',
    armorOrWeaponType: 'Maça',
    icon: 'inv_mace_1h_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 480 },
    stamina: 1600,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 19, key: 'crit' },
      { name: 'Aceleração', value: 29, key: 'haste' }
    ],
    sourceLocation: "Wah'du / Labirinto de Kindo'jan",
    roleTag: 'Progressão Solo',
    notes: 'Maça 1M de Intelecto ilvl 321.'
  },
  272271: {
    id: 272271,
    namePt: 'Foco do Espírito Vinculado',
    nameEn: 'Bound Spirit Focus',
    quality: 'epic',
    slot: 'Arma de Uma Mão',
    armorOrWeaponType: 'Varinha',
    icon: 'inv_wand_1h_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 480 },
    stamina: 1600,
    secondaryStats: [
      { name: 'Versatilidade', value: 29, key: 'versatility' },
      { name: 'Maestria', value: 19, key: 'mastery' }
    ],
    sourceLocation: "Wah'du / Labirinto de Kindo'jan",
    roleTag: 'Progressão Solo',
    notes: 'Varinha de Intelecto ilvl 321.'
  },
  272273: {
    id: 272273,
    namePt: 'Cetro Cerimonial Consagrado',
    nameEn: 'Consecrated Ceremonial Scepter',
    quality: 'epic',
    slot: 'Arma de Duas Mãos',
    armorOrWeaponType: 'Cajado',
    icon: 'inv_staff_2h_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 960 },
    stamina: 3200,
    secondaryStats: [
      { name: 'Versatilidade', value: 38, key: 'versatility' },
      { name: 'Maestria', value: 58, key: 'mastery' }
    ],
    sourceLocation: "Wah'du / Labirinto de Kindo'jan",
    roleTag: 'Progressão Solo',
    notes: 'Cajado 2M ilvl 321.'
  },
  272275: {
    id: 272275,
    namePt: 'Trombeta do Canta-almas',
    nameEn: 'Soulsinger\'s Horn',
    quality: 'epic',
    slot: 'Mão Secundária',
    armorOrWeaponType: 'Mão Secundária',
    icon: 'inv_offhand_1h_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 110 },
    stamina: 600,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 18, key: 'crit' },
      { name: 'Versatilidade', value: 30, key: 'versatility' }
    ],
    sourceLocation: "Wah'du / Labirinto de Kindo'jan",
    roleTag: 'Progressão Solo',
    notes: 'Mão secundária de Intelecto ilvl 321.'
  },

  // --- CRAFTING (TETO 331) ---
  239648: {
    id: 239648,
    namePt: 'Braceletes do Mártir',
    nameEn: "Martyr's Bindings",
    quality: 'epic',
    slot: 'Pulsos',
    armorOrWeaponType: 'Tecido',
    icon: 'inv_bracer_cloth_questbloodelf_b_01',
    primaryStat: { name: 'Intelecto', value: 104 },
    stamina: 2150,
    secondaryStats: [
      { name: 'Aceleração', value: 72, key: 'haste' },
      { name: 'Maestria', value: 41, key: 'mastery' }
    ],
    embellished: true,
    embellishmentName: 'Forro de Arcanotrama [240167]',
    effect: 'Embelezamento: Concede +248 de Intelecto contínuo enquanto sua vida estiver acima de 80%.',
    sourceLocation: 'Ordem de Criação: Alfaiataria (Centelha de Marés + 80 Cristas Míticas)',
    roleTag: 'Embelezamento Artesanal',
    notes: 'Teto 331. Melhor slot para o primeiro embelezamento de dano.'
  },
  245769: {
    id: 245769,
    namePt: 'Lanterna de Aln\'hara',
    nameEn: "Aln'hara Lantern",
    quality: 'epic',
    slot: 'Mão Secundária',
    armorOrWeaponType: 'Mão Secundária',
    icon: 'inv_offhand_1h_dungeonharronir_c_01',
    primaryStat: { name: 'Intelecto', value: 284 },
    stamina: 1910,
    secondaryStats: [
      { name: 'Aceleração', value: 68, key: 'haste' },
      { name: 'Maestria', value: 33, key: 'mastery' }
    ],
    embellished: true,
    embellishmentName: 'Pedra Ritual do Caçador [273060]',
    embellishmentRecommendation: 'Pedra Ritual do Caçador',
    effect: 'Embelezamento: concede 101 de um atributo secundário aleatório por 15 s; +50% durante Caça às Presas (ambiente externo).',
    sourceLocation: 'Ordem de Criação: Escrivania (Centelha de Marés + 80 Cristas Míticas)',
    roleTag: 'Embelezamento Artesanal',
    notes: 'Murlok S2: 36/50 usam Pedra Ritual do Caçador na Lanterna. Signo de Negraluna: Sangue aparece como alternativa.'
  },
  244576: {
    id: 244576,
    namePt: 'Defletores do Agente de Luaprata',
    nameEn: "Silvermoon Agent's Deflectors",
    quality: 'epic',
    slot: 'Pulsos',
    armorOrWeaponType: 'Couro',
    icon: 'inv_bracer_leather_dungeonharronir_c_01',
    primaryStat: { name: 'Intelecto', value: 104 },
    stamina: 2150,
    secondaryStats: [
      { name: 'Aceleração', value: 72, key: 'haste' },
      { name: 'Maestria', value: 41, key: 'mastery' }
    ],
    embellished: true,
    embellishmentName: 'Forro de Arcanotrama [240167]',
    effect: 'Embelezamento: Concede +248 de Intelecto enquanto com vida alta.',
    sourceLocation: 'Ordem de Criação: Couraria (Centelha de Marés)',
    roleTag: 'Embelezamento Artesanal',
    notes: 'Craft de couro BiS para Druida Equilíbrio.'
  },
  244569: {
    id: 244569,
    namePt: 'Calçados do Agente de Luaprata',
    nameEn: "Silvermoon Agent's Sneakers",
    quality: 'epic',
    slot: 'Pés',
    armorOrWeaponType: 'Couro',
    icon: 'inv_boot_leather_outdooramaniloa_c_01',
    primaryStat: { name: 'Intelecto', value: 138 },
    stamina: 2870,
    secondaryStats: [
      { name: 'Aceleração', value: 92, key: 'haste' },
      { name: 'Maestria', value: 58, key: 'mastery' }
    ],
    sourceLocation: 'Ordem de Criação: Couraria (Centelha de Marés)',
    roleTag: 'Upgrade de Secundários',
    notes: 'Botas de couro com Missiva Febre Ardente.'
  },

  // --- RAIDE (A MALDIÇÃO DE ULA'TEK) ---
  271092: {
    id: 271092,
    namePt: 'Jan\'thrazet, a Presa Anímica',
    nameEn: "Jan'thrazet, the Soul Fang",
    quality: 'epic',
    slot: 'Arma de Uma Mão',
    armorOrWeaponType: 'Adaga de Uma Mão',
    icon: 'inv_knife_1h_ulatekfang_d_01_spirit',
    primaryStat: { name: 'Intelecto', value: 603 },
    stamina: 2192,
    secondaryStats: [
      { name: 'Aceleração', value: 104, key: 'haste' }
    ],
    effect: 'Equipar: Cantrip 344 — Seus feitiços consomem fragmentos de alma para disparar uma rajada que causa dano de Caos e concede +71 de Aceleração por 10 s.',
    sourceLocation: "Raide: A Maldição de Ula'tek — Chefe: Ula'tek, a Matriarca Rastejante",
    roleTag: 'BiS Direto',
    notes: 'Teto absoluto 344 de Raide Mítica. BiS de arma 1M.'
  },
  268265: {
    id: 268265,
    namePt: 'Relicário Aqiricida',
    nameEn: 'Aqirbane Reliquary',
    quality: 'epic',
    slot: 'Pescoço',
    icon: 'inv_121_jewelry_neck03_green',
    stamina: 2466,
    secondaryStats: [
      { name: 'Acerto Crítico', value: 107, key: 'crit' },
      { name: 'Aceleração', value: 107, key: 'haste' },
      { name: 'Maestria', value: 107, key: 'mastery' },
      { name: 'Versatilidade', value: 107, key: 'versatility' }
    ],
    sourceLocation: "Raide: A Maldição de Ula'tek — Chefe: Guardiões Aqir",
    roleTag: 'BiS Direto',
    notes: 'Pescoço 344 com distribuição quadrupla equilibrada e engaste prismático.'
  },
  281029: {
    id: 281029,
    namePt: 'Elo do Chama-enxame',
    nameEn: 'Band of the Swarmcaller',
    quality: 'epic',
    slot: 'Dedo',
    icon: '8268560',
    stamina: 2199,
    secondaryStats: [
      { name: 'Aceleração', value: 110, key: 'haste' },
      { name: 'Maestria', value: 295, key: 'mastery' }
    ],
    effect: 'Equipar: Seus feitiços têm chance de evocar o Flagelo da Ninhada Ácida, causando dano de Natureza.',
    sourceLocation: "Raide: A Maldição de Ula'tek — Chefe: Kith'ix",
    roleTag: 'BiS Direto',
    notes: '32/50 bruxos do topo equipam este anel.'
  },
  281215: {
    id: 281215,
    namePt: 'Tentáculo do Terror Pervertido',
    nameEn: "Twisted Horror's Tendril",
    quality: 'epic',
    slot: 'Berloque',
    icon: '8268563',
    primaryStat: { name: 'Intelecto', value: 191 },
    secondaryStats: [],
    effect: 'Equipar: Seus ataques têm chance de acumular Poder Devastador (+35 de Acerto Crítico por 15 s, sobrepondo-se até 10 vezes).',
    sourceLocation: "Raide: A Maldição de Ula'tek — Chefe: Kith'ix",
    roleTag: 'BiS Direto',
    notes: '48/50 jogadores nos rankings de topo no Murlok.'
  },
  270164: {
    id: 270164,
    namePt: 'Bolsa sem Fundo de Gebbo',
    nameEn: "Gebbo's Bottomless Bag",
    quality: 'epic',
    slot: 'Berloque',
    icon: 'inv_10_tailoring_bag1_color2',
    ilvl: 341,
    primaryStat: { name: 'Intelecto', value: 191 },
    secondaryStats: [],
    effect: 'Equipar: Seus feitiços de dano sorteiam artefatos no interior da bolsa que amplificam seus atributos secundários de forma variável em combate contínuo.',
    sourceLocation: "Raide: A Maldição de Ula'tek — Chefe: Exploradores Perdidos / Mor'zahi",
    roleTag: 'Acessório BiS',
    notes: 'BiS absoluto passivo para bruxos e sacerdotes de topo.'
  },
  270167: {
    id: 270167,
    namePt: 'Rocha Marinha do Clamaondas',
    nameEn: "Wavecaller's Seastone",
    quality: 'epic',
    slot: 'Berloque',
    icon: 'inv_tradeskillitem_sorcererswater',
    ilvl: 341,
    primaryStat: { name: 'Aceleração', value: 148 },
    secondaryStats: [],
    effect: 'Equipar: Seus acertos críticos têm chance de acumular gotas marinhas que aumentam continuamente seu Intelecto.',
    sourceLocation: 'Masmorra M+: Costa das Ondas',
    roleTag: 'BiS Direto',
    notes: 'Par perfeito sem raide para Suplício e Equilíbrio.'
  },
  270169: {
    id: 270169,
    namePt: 'Ídolo da Perdição do Grão-bagateiro',
    nameEn: "Hex Lord's Dooming Idol",
    quality: 'epic',
    slot: 'Berloque',
    icon: 'inv_archaeology_orcclans_crackedidol',
    ilvl: 344,
    primaryStat: { name: 'Aceleração', value: 149 },
    secondaryStats: [],
    effect: 'Equipar: Drena 1 de Intelecto a cada 6 s (até 30 acúmulos). Uso: Consome as cargas e concede +12 de Intelecto por acúmulo (+360 Int) por 30 s (Recarga: 30 s).',
    sourceLocation: 'Masmorra M+: Altar Enrolado',
    roleTag: 'BiS Direto',
    notes: 'Berloque híbrido de altíssimo teto de dano para Sombra.'
  },
  271548: {
    id: 271548,
    namePt: 'Solas do Necrólito Maldito',
    nameEn: "Damned Necrolyte's Soles",
    quality: 'epic',
    slot: 'Pés',
    icon: 'inv_boot_cloth_raidwarlockulatek_d_01',
    ilvl: 334,
    primaryStat: { name: 'Intelecto', value: 141 },
    stamina: 2932,
    secondaryStats: [
      { name: 'Aceleração', value: 106, key: 'haste' },
      { name: 'Maestria', value: 53, key: 'mastery' }
    ],
    sourceLocation: "Raide: A Maldição de Ula'tek / Great Vault",
    roleTag: 'BiS Direto',
    notes: 'Botas de tecido BiS com Aceleração predominante.'
  },
  239649: {
    id: 239649,
    namePt: 'Banda do Mártir',
    nameEn: "Martyr's Waistwrap",
    quality: 'epic',
    slot: 'Cintura',
    icon: 'inv_belt_cloth_questbloodelf_b_01',
    ilvl: 331,
    primaryStat: { name: 'Intelecto', value: 141 },
    stamina: 2932,
    secondaryStats: [
      { name: 'Aceleração', value: 85, key: 'haste' },
      { name: 'Maestria', value: 65, key: 'mastery' }
    ],
    isCrafted: true,
    embellished: true,
    embellishmentName: 'Forro de Arcanotrama [240167]',
    sourceLocation: 'Profissão: Alfaiataria (Centelha da Criação + 80 Cristas Míticas)',
    roleTag: 'Embelezamento Artesanal',
    notes: 'Cinto de tecido customizado com Missiva e Forro de Arcanotrama.'
  },
  239654: {
    id: 239654,
    namePt: 'Sapatilhas do Mártir',
    nameEn: "Martyr's Slippers",
    quality: 'epic',
    slot: 'Pés',
    icon: 'inv_boot_cloth_questbloodelf_b_01',
    ilvl: 331,
    primaryStat: { name: 'Intelecto', value: 141 },
    stamina: 2932,
    secondaryStats: [
      { name: 'Aceleração', value: 88, key: 'haste' },
      { name: 'Maestria', value: 62, key: 'mastery' }
    ],
    isCrafted: true,
    sourceLocation: 'Profissão: Alfaiataria (Centelha da Criação)',
    roleTag: 'Upgrade de Secundários',
    notes: 'Pés craftados 331 com atributos perfeitos via Missiva.'
  },
  239656: {
    id: 239656,
    namePt: 'Mortalha Sedosa do Seguidor',
    nameEn: "Adherent's Silken Shroud",
    quality: 'epic',
    slot: 'Costas',
    icon: 'inv_12_profession_tailoring_spellthread_blue',
    ilvl: 331,
    primaryStat: { name: 'Intelecto', value: 106 },
    stamina: 2199,
    secondaryStats: [
      { name: 'Aceleração', value: 68, key: 'haste' },
      { name: 'Maestria', value: 45, key: 'mastery' }
    ],
    isCrafted: true,
    sourceLocation: 'Profissão: Alfaiataria (Centelha da Criação)',
    roleTag: 'Upgrade de Secundários',
    notes: 'Capa craftada com atributos calibrados.'
  },
  240949: {
    id: 240949,
    namePt: 'Elo Sin\'dorei Magistral',
    nameEn: 'Masterwork Sin\'dorei Band',
    quality: 'epic',
    slot: 'Dedo',
    icon: 'inv_12_profession_jewelcrafting_ring4_gold',
    ilvl: 331,
    primaryStat: undefined,
    stamina: 2199,
    secondaryStats: [
      { name: 'Aceleração', value: 210, key: 'haste' },
      { name: 'Maestria', value: 155, key: 'mastery' }
    ],
    isCrafted: true,
    embellished: true,
    embellishmentName: 'Amolita Polida',
    embellishmentRecommendation: 'Amolita Polida',
    sourceLocation: 'Profissão: Joalheria (Centelha da Criação)',
    roleTag: 'Acessório BiS',
    notes: 'Engaste prismático garantido e atributos configuráveis por missiva. Recebe o embelezamento de acessório (Amolita Polida).'
  },
  273060: {
    id: 273060,
    namePt: 'Pedra Ritual do Caçador',
    nameEn: "Hunter's Ritual Stone",
    quality: 'rare',
    slot: 'Reagente de Embelezamento',
    icon: 'inv_misc_stonetablet_02',
    effect: 'Concede +101 de atributo secundário prioritário e +50% de eficácia em Caça às Presas (+5 de dificuldade de receita).',
    sourceLocation: 'Drop de Mundo / Imersões',
    roleTag: 'Embelezamento Artesanal',
    notes: 'Reagente oficial de embelezamento para Lanterna de Aln\'hara.'
  },
  245872: {
    id: 245872,
    namePt: 'Signo de Negraluna: Sangue',
    nameEn: 'Darkmoon Sigil: Blood',
    quality: 'rare',
    slot: 'Reagente de Embelezamento',
    icon: 'inv_misc_ticket_darkmoon_01',
    effect: 'Seus ataques têm chance de roubar a vitalidade do alvo, causando dano de Sangue e curando você pelo mesmo valor.',
    sourceLocation: 'Feira de Negraluna / Escrivania',
    roleTag: 'Embelezamento Artesanal',
    notes: 'Excelente para sobrevivência contínua em Delves solo Tier 11.'
  }
};

/**
 * Synchronous Real-time Tooltip Builder:
 * Instantly resolves item tooltips without microtask delay.
 */
export function getItemTooltipSync(
  itemId: number,
  fallbackOptions?: {
    slot?: string;
    itemPt?: string;
    itemEn?: string;
    icon?: string;
    heroIlvl?: number;
    mythIlvl?: number;
    ilvl?: number;
    track?: 'hero' | 'myth';
    sourceLocation?: string;
    roleTag?: string;
    notes?: string;
    stats?: { intellect?: number; agility?: number; strength?: number; stamina?: number; haste?: number; crit?: number; mastery?: number; versatility?: number };
    effect?: string;
    embellished?: boolean;
    embellishmentName?: string;
    embellishmentDescription?: string;
    embellishmentRecommendation?: string;
    acceptsEmbellishment?: boolean;
  }
): FullItemTooltip {
  const track = fallbackOptions?.track ?? 'myth';
  const cacheKey = `${itemId}_${track}_${fallbackOptions?.ilvl ?? ''}`;

  if (tooltipCache.has(cacheKey)) {
    return tooltipCache.get(cacheKey)!;
  }

  // 1. Try local verified 12.1.5 database
  const official = OFFICIAL_1215_DATABASE[itemId];
  const catalogItem = getItemById(itemId);

  const namePt = official?.namePt ?? catalogItem?.namePt ?? fallbackOptions?.itemPt ?? 'Item Desconhecido';
  const nameEn = official?.nameEn ?? catalogItem?.nameEn ?? fallbackOptions?.itemEn ?? 'Unknown Item';
  const icon = official?.icon ?? catalogItem?.icon ?? fallbackOptions?.icon ?? 'inv_misc_questionmark';
  const quality = (official?.quality ?? catalogItem?.quality ?? 'epic') as 'epic' | 'rare' | 'uncommon' | 'artifact';
  const slot = official?.slot ?? catalogItem?.slot ?? fallbackOptions?.slot ?? 'Equipamento';

  // Determine ilvl based on track or explicit options
  let ilvl = fallbackOptions?.ilvl ?? 334;
  let trackLabel = 'Mito 6/6';
  if (track === 'hero') {
    ilvl = fallbackOptions?.heroIlvl ?? (fallbackOptions?.ilvl ?? 321);
    trackLabel = 'Herói 6/6';
  } else {
    ilvl = fallbackOptions?.ilvl ?? official?.ilvl ?? fallbackOptions?.mythIlvl ?? 334;
    if (ilvl === 344) trackLabel = 'Mítico Mítico (Raide)';
    else if (ilvl === 341) trackLabel = 'Mítico Forjado com Peçonha (+7)';
    else if (ilvl === 331) trackLabel = 'Artesanato Mítico (Teto 331)';
    else trackLabel = 'Mito 6/6 (334)';
  }

  // Quality color mapping
  const qualityColor = quality === 'epic' ? '#a335ee' : quality === 'rare' ? '#0070dd' : quality === 'artifact' ? '#e6cc80' : '#1eff00';
  const qualityBorder = quality === 'epic' ? 'border-[#a335ee] shadow-[0_0_10px_rgba(163,53,238,0.4)]' : 'border-[#0070dd] shadow-[0_0_8px_rgba(0,112,221,0.3)]';

  // Sem fonte conhecida, dizemos a verdade (P1): nunca "Masmorra M+" por palpite.
  const sourceLocation = official?.sourceLocation ?? catalogItem?.sourceDetail ?? fallbackOptions?.sourceLocation ?? 'Fonte não informada';
  const roleTag =
    official?.roleTag ??
    fallbackOptions?.roleTag ??
    (catalogItem?.source === 'delve' ? 'Drop Imersão' : catalogItem?.source ? 'Drop M+' : undefined);
  const notes = official?.notes ?? catalogItem?.notes ?? fallbackOptions?.notes ?? '';

  // Extract stats
  let primaryStat = official?.primaryStat;
  let stamina = official?.stamina;
  let secondaryStats = official?.secondaryStats ? [...official.secondaryStats] : [];

  const opcoes = fallbackOptions?.stats;
  const candidateStats = opcoes && Object.keys(opcoes).length ? opcoes : catalogItem?.stats;
  if (secondaryStats.length === 0 && candidateStats) {
    if (candidateStats.intellect) primaryStat = { name: 'Intelecto', value: candidateStats.intellect };
    else if (candidateStats.agility) primaryStat = { name: 'Agilidade', value: candidateStats.agility };
    else if (candidateStats.strength) primaryStat = { name: 'Força', value: candidateStats.strength };
    if (candidateStats.stamina) stamina = candidateStats.stamina;
    if (candidateStats.haste) secondaryStats.push({ name: 'Aceleração', value: candidateStats.haste, key: 'haste' });
    if (candidateStats.crit) secondaryStats.push({ name: 'Acerto Crítico', value: candidateStats.crit, key: 'crit' });
    if (candidateStats.mastery) secondaryStats.push({ name: 'Maestria', value: candidateStats.mastery, key: 'mastery' });
    if (candidateStats.versatility) secondaryStats.push({ name: 'Versatilidade', value: candidateStats.versatility, key: 'versatility' });
  }

  // Sem atributos catalogados: a tooltip mostra "não catalogados" (P1: nunca
  // inventar números — antes aparecia +189 Intelecto/+3.910 Vigor para qualquer item).

  const embellished =
    official?.embellished ?? fallbackOptions?.embellished ?? catalogItem?.embellished;
  const embellishmentName =
    official?.embellishmentName ??
    fallbackOptions?.embellishmentName ??
    catalogItem?.embellishmentName;
  const isCrafted = official?.isCrafted ?? catalogItem?.isCrafted;
  const acceptsEmbellishment =
    official?.acceptsEmbellishment ??
    fallbackOptions?.acceptsEmbellishment ??
    catalogItem?.acceptsEmbellishment ??
    (!embellished && isCrafted === true);
  const embellishmentRecommendation =
    official?.embellishmentRecommendation ??
    fallbackOptions?.embellishmentName ??
    catalogItem?.embellishmentRecommendation ??
    embellishmentName;
  const embellishmentDescription =
    official?.embellishmentDescription ??
    fallbackOptions?.embellishmentDescription ??
    getEmbellishmentDescription(embellishmentName ?? embellishmentRecommendation);

  const tooltipData: FullItemTooltip = {
    id: itemId,
    namePt,
    nameEn,
    quality,
    qualityColor,
    qualityBorder,
    ilvl,
    track: trackLabel,
    slot,
    armorOrWeaponType: official?.armorOrWeaponType ?? catalogItem?.armorType ?? catalogItem?.weaponType ?? '',
    primaryStat,
    stamina,
    secondaryStats,
    effect: official?.effect ?? fallbackOptions?.effect ?? catalogItem?.effect,
    embellished,
    embellishmentName,
    embellishmentDescription,
    embellishmentRecommendation,
    acceptsEmbellishment,
    isCrafted,
    isTier: official?.isTier ?? catalogItem?.isTier,
    tierPiece: official?.tierPiece ?? catalogItem?.tierPiece,
    sourceLocation,
    roleTag,
    notes,
    icon,
    iconUrl: `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`
  };

  tooltipCache.set(cacheKey, tooltipData);
  return tooltipData;
}

/**
 * Real-time Tooltip Fetcher:
 * Wrapper for backward compatibility.
 */
export async function fetchItemTooltip(
  itemId: number,
  fallbackOptions?: Parameters<typeof getItemTooltipSync>[1]
): Promise<FullItemTooltip> {
  return getItemTooltipSync(itemId, fallbackOptions);
}


