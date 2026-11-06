import { ActiveSpec } from '../types/wow';

export interface SpecProfile {
  id: ActiveSpec;
  namePt: string;
  nameEn: string;
  role: 'DPS';
  heroTalents: string[];
  recommendedHero: string;
  talentImportString: string;
  statPriority: string[];
  statWeightsDescription: string;
  tierSet: {
    id: number;
    namePt: string;
    nameEn: string;
    twoPiece: string;
    fourPiece: string;
  };
  recommendedEmbellishments: string[];
  noRaidBiS: {
    slot: string;
    itemPt: string;
    source: string;
    notes: string;
  }[];
  delveStrategy: {
    roomsFocus: string;
    bossFocus: string;
    recommendedPet: string;
    survivalTips: string[];
  };
}

export const DEMONOLOGY_WARLOCK: SpecProfile = {
  id: 'demonology',
  namePt: 'Bruxo Demonologia',
  nameEn: 'Demonology Warlock',
  role: 'DPS',
  heroTalents: ['Diabolista (Diabolist)', 'Ceifador de Almas (Soul Harvester)'],
  recommendedHero: 'Diabolista (Diabolist) — 100% de adesão no topo de M+ e Delves',
  talentImportString: 'CoQA4DPb6v5x8sU9O9+6jT/5DAAAAAAAAAAAAAAAAAAAAAYmZGzMzMDzYGzMmZbmZMzMzMMMzAAAAAAYbYMjFjhZmBzMmtB',
  statPriority: ['Aceleração (Haste)', 'Acerto Crítico (Crit)', 'Maestria (Mastery)', 'Versatilidade (Versatility)'],
  statWeightsDescription: 'Aceleração é o stat prioritário para acelerar a geração de Estilhaços e cadência de Diabretes. Crítico amplifica as implosões explosivas. Versatilidade entra em Delves Tier 11 e chaves M+ +10 para mitigação de dano de atrito.',
  tierSet: {
    id: 2066,
    namePt: 'Grilhões Despedaçados do Necrólito Maldito',
    nameEn: "Damned Necrolyte's Shattered Restraints",
    twoPiece: 'Dano do Diabrete Selvagem +10%. Dano da Implosão +20%.',
    fourPiece: 'Ao esgotar a energia, os Diabretes Selvagens têm 20% de chance de se lançar no alvo e implodir com 350% de eficácia no alvo principal e 315% nos secundários.'
  },
  recommendedEmbellishments: [
    '2× Forro de Arcanotrama (Arcanoweave Lining - 240167): Concede Intelecto para você e um aliado acima de 80% de vida nos Braceletes do Mártir (331) e Banda do Mártir (331).',
    'Alternativa: 1× Forro de Arcanotrama + 1× Signo de Negraluna: Sangue (245872) na Lanterna de Aln\'hara para autocura contínua em Delves.'
  ],
  noRaidBiS: [
    { slot: 'Cabeça', itemPt: 'Crânio do Necrólito Maldito (334)', source: 'Matrix Catalyst via M+ ou Great Vault', notes: 'Peça do conjunto 4pc.' },
    { slot: 'Pescoço', itemPt: 'Talismã Serpentino (321) / Feixe de Presas (341)', source: "Wah'du (Delve) / Altar das Presas (M+)", notes: 'Crítico + Aceleração prioritários.' },
    { slot: 'Ombros', itemPt: 'Pináculos do Necrólito Maldito (334)', source: 'Catalyst (Templo de Sethraliss drop)', notes: 'Peça de tier 4pc.' },
    { slot: 'Costas', itemPt: 'Mortalha do Inferninho (334)', source: 'Travessa dos Assassinos (M+)', notes: 'Capa BiS sem raide (Crí 66 / Mae 47).' },
    { slot: 'Torso', itemPt: 'Vestes Chacoalhantes do Necrólito Maldito (334)', source: 'Catalyst (Arena da Chaga do Caos)', notes: 'Peça de tier 4pc.' },
    { slot: 'Pulsos', itemPt: 'Braceletes do Mártir (331)', source: 'Craft Alfaiataria (Centelha + 80 Cristas Míticas)', notes: 'Missiva Aceleração + Maestria com Forro de Arcanotrama.' },
    { slot: 'Mãos', itemPt: 'Agarres Calcinados do Necrólito Maldito (334)', source: 'Catalyst (Altar Enrolado)', notes: 'Peça de tier 4pc.' },
    { slot: 'Cinto', itemPt: 'Atadura do Éter Etérea (334)', source: 'Arena da Chaga do Caos (M+)', notes: 'Cinto BiS de masmorra (Crí 56 / Ace 95).' },
    { slot: 'Pernas', itemPt: 'Amarras de Perna do Necrólito Maldito (334)', source: 'Catalyst (M+ Drop)', notes: 'Aplica Magilinha de Arcanotrama (+41 Int / +4% mana).' },
    { slot: 'Pés', itemPt: 'Alpargatas do Pisa-piras (321) / Sapatilhas do Mártir (331)', source: "Wah'du (Delve) / Craft Alfaiataria", notes: 'Aceleração prioritária.' },
    { slot: 'Anel 1', itemPt: 'Elo de Arenito Carregado (334)', source: 'Templo de Sethraliss (M+)', notes: 'Crí 232 / Mae 174.' },
    { slot: 'Anel 2', itemPt: 'Elo do Senhor da Guerra Amani (341)', source: 'Altar das Presas (M+)', notes: 'Ace + Mae.' },
    { slot: 'Berloque 1', itemPt: 'Emblema Tempestuoso de Dazar (341)', source: 'Descanso do Rei (M+)', notes: 'Uso ativo: +1.082 de Aceleração por 20 s (Recarga 2 min).' },
    { slot: 'Berloque 2', itemPt: 'Nó de Serpentes Contorcidas (341)', source: 'Altar das Presas (M+)', notes: 'Passivo constante de Intelecto. Não entra em conflito com Dazar.' },
    { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido (341)', source: 'Altar das Presas (M+)', notes: '1M para permitir mão secundária; cantrip de dano sagrado em área.' },
    { slot: 'Mão Secundária', itemPt: 'Lanterna de Aln\'hara (331)', source: 'Craft Escrivania (Centelha)', notes: 'Segundo embelezamento (Arcanotrama ou Signo) + Missiva Aceleração/Maestria.' }
  ],
  delveStrategy: {
    roomsFocus: 'Nas salas com vários packs, use a Runa C26 (Reflexos de Lince 2C para mobilidade + Energia Residual 5B para amplificar o dano em área). Deixe o Vilguarda agrupando mobs e exploda com Implosão cíclica a cada 6 diabretes.',
    bossFocus: 'No chefe final Kindo\'jan, troque imediatamente para a Runa C24 (Autorrecomposição 2B para curar abaixo de 75% + Guerreiro Versátil 4D para mitigação + Ecos 5C para replicar 50% de dano após 10 s). Guarde o Emblema de Dazar para a fase de invocação de chamas do Kindo\'jan.',
    recommendedPet: 'Vilguarda (Felguard) para atordoamento (Machado Giratório) e agro consistente em pulls solo.',
    survivalTips: [
      'Pacto Sombrio (Dark Pact) antes de mecânicas de dano alto inevitáveis.',
      'Pedra de Vida potencializada com macros de emergência.',
      'Nunca acumule dois berloques de uso ativo para não dividir recarga na hora do perigo.',
      'Manter Forro de Arcanotrama acima de 80% usando poções e drenar vida pontual.'
    ]
  }
};

export const AFFLICTION_WARLOCK: SpecProfile = {
  id: 'affliction',
  namePt: 'Bruxo Suplício',
  nameEn: 'Affliction Warlock',
  role: 'DPS',
  heroTalents: ['Ceifador de Almas (Soul Harvester)', 'Saqueador do Inferno (Hellcaller)'],
  recommendedHero: 'Ceifador de Almas (Soul Harvester) — Domina M+ e Delves com Ceifa Sombria',
  talentImportString: 'CkQAAAAAAAAAAAAAAAAAAAAAAwMMzoZzMz2MzYWGAAwMmlZZmZWGDAM22GYATwMsFYYbAAAYAAAYmZmZMjNmxMzMzMMDzMzAAMgB',
  statPriority: ['Aceleração (28%)', 'Acerto Crítico (27%)', 'Maestria (69%)', 'Versatilidade (4%)'],
  statWeightsDescription: 'Aceleração (28%) acelera ticks de DoTs e geração de Estilhaços; ultrapassa o ponto doce de +20%. Crítico (27%) amplia dano e gera estilhaços. Maestria (69%) escala todo o dano periódico direto. Versatilidade entra como sobra residual defensiva.',
  tierSet: {
    id: 2066,
    namePt: 'Grilhões Despedaçados do Necrólito Maldito',
    nameEn: "Damned Necrolyte's Shattered Restraints",
    twoPiece: 'Dano de Corrupção (ou Murchar) +25% e dano de Agonia +15%.',
    fourPiece: 'Cada Agonia Instável ativa aumenta em 2% o dano causado por seus feitiços e habilidades, até um máximo de 6%. A Semente da Corrupção aplica Agonia Instável ao seu alvo principal com 20% de eficácia.'
  },
  recommendedEmbellishments: [
    '1× Forro de Arcanotrama (Arcanoweave Lining - 240167) nos Braceletes do Mártir (331): +Intelecto ativo acima de 80% de vida.',
    '1× Pedra Ritual do Caçador (273060) ou Signo de Negraluna: Sangue (245872) na Lanterna de Aln\'hara (331) para dano contínuo e autocura.'
  ],
  noRaidBiS: [
    { slot: 'Cabeça', itemPt: 'Crânio do Necrólito Maldito (334)', source: 'Matrix Catalyst via M+ semanal', notes: 'Peça do conjunto 4pc/5pc.' },
    { slot: 'Pescoço', itemPt: 'Feixe de Presas Protetoras (341)', source: 'M+ Altar das Presas', notes: 'Crí 240 · Ace 182: melhor pescoço fora de raide.' },
    { slot: 'Ombros', itemPt: 'Pináculos do Necrólito Maldito (334)', source: 'Matrix Catalyst', notes: 'Peça do conjunto 4pc.' },
    { slot: 'Costas', itemPt: 'Mortalha Sedosa do Seguidor (331)', source: 'Craft Alfaiataria', notes: 'Missiva Aceleração + Maestria.' },
    { slot: 'Torso', itemPt: 'Vestes Chacoalhantes do Necrólito Maldito (334)', source: 'Matrix Catalyst', notes: 'Peça central do conjunto 4pc.' },
    { slot: 'Pulsos', itemPt: 'Braceletes do Mártir (331)', source: 'Craft Alfaiataria', notes: 'Com Forro de Arcanotrama (240167).' },
    { slot: 'Mãos', itemPt: 'Agarres Calcinados do Necrólito Maldito (334)', source: 'Matrix Catalyst', notes: 'Peça do conjunto 4pc.' },
    { slot: 'Cinto', itemPt: 'Banda do Mártir (331) / Atadura do Éter (334)', source: 'Craft Alfaiataria / Arena da Chaga (M+)', notes: 'Maestria e Aceleração.' },
    { slot: 'Pernas', itemPt: 'Amarras de Perna do Necrólito Maldito (334)', source: 'Matrix Catalyst', notes: 'Peça do conjunto 4pc.' },
    { slot: 'Pés', itemPt: 'Sapatilhas do Mártir (331) / Alpargatas do Pisa-piras (321)', source: 'Craft Alfaiataria / Wah\'du (Delve)', notes: 'Aceleração prioritária.' },
    { slot: 'Anel 1', itemPt: 'Elo do Senhor da Guerra Amani (341)', source: 'M+ Altar das Presas', notes: 'Atributos Míticas+ 341.' },
    { slot: 'Anel 2', itemPt: 'Elo Sin\'dorei Magistral (331)', source: 'Craft Joalheria', notes: 'Engaste prismático garantido + Ace/Mae.' },
    { slot: 'Berloque 1', itemPt: 'Ampola Torpe de Peçonha Volátil (341)', source: 'M+ Altar das Presas', notes: 'On-use +992 de atributo secundário por 15 s.' },
    { slot: 'Berloque 2', itemPt: 'Rocha Marinha do Clamaondas (341)', source: 'M+ Costa das Ondas', notes: 'Passivo Aceleração 148 + Intelecto acumulativo.' },
    { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido (341)', source: 'M+ Altar das Presas', notes: 'Ace +58 / Mae +46; proc sagrado em área perfeito para Suplício.' },
    { slot: 'Mão Secundária', itemPt: 'Lanterna de Aln\'hara (331)', source: 'Craft Escrivania', notes: 'Leva Pedra Ritual do Caçador (273060) ou Signo de Sangue.' }
  ],
  delveStrategy: {
    roomsFocus: 'Com Runa C29 (Reflexos de Lince + Aceleração Ardente + Energia Residual 5B), espalhe Agonia em todos os alvos e detone Semente da Corrupção com Ceifa Sombria. Use Voidwalker para agrupar e absorver dano.',
    bossFocus: 'Em Kindo\'jan Tier 11, troque para a Runa C24 (Autorrecomposição 2B + Guerreiro Versátil 4D + Ecos de Poder 5C). Mantenha Agonia Instável e Assombração 100% ativos; use Soulburn + Pedra de Vida seguido de Pacto Sombrio.',
    recommendedPet: 'Voidwalker (Emissário do Caos) para tanquar mobs no Delve ou Felhunter quando houver conjurações cruciais.',
    survivalTips: [
      'Deixar o Círculo Demoníaco armado antes de todo pull arriscado.',
      'Soulburn + Pedra de Vida concede +30% de cura imediata e +20% de vida máxima por 12 s.',
      'Pacto Sombrio escala com a vida atual: use sempre com vida cheia ou após a Pedra de Vida.',
      'Drenar Vida com Soulburn provê escudo absorvente contra mecânicas inevitáveis.'
    ]
  }
};

export const DESTRUCTION_WARLOCK: SpecProfile = {
  id: 'destruction',
  namePt: 'Bruxo Destruição',
  nameEn: 'Destruction Warlock',
  role: 'DPS',
  heroTalents: ['Saqueador do Inferno (Hellcaller)', 'Diabolista (Diabolist)'],
  recommendedHero: 'Saqueador do Inferno (Hellcaller) para Raide e Delve; Diabolista para M+ de alto AoE',
  talentImportString: 'CsQAAAAAAAAAAAAAAAAAAAAAAwMjZGNLmxmZGzysNzYmFzYZZMAAYGjZmZBMmxwCMw2wCNWYAAgxMMsBgZGgxMjZ2AAAMzMzAAYMM',
  statPriority: ['Maestria (65%)', 'Aceleração (23%)', 'Acerto Crítico (27%)', 'Versatilidade (3%)'],
  statWeightsDescription: 'Maestria (65%) é o atributo mestre de escala que amplia o dano de feitiços de Caos e bônus de Fogo. Aceleração (23%) acelera Seta do Caos e Incinerar. Crítico (27%) dobra nas Setas do Caos. Versatilidade residual.',
  tierSet: {
    id: 2066,
    namePt: 'Grilhões Despedaçados do Necrólito Maldito',
    nameEn: "Damned Necrolyte's Shattered Restraints",
    twoPiece: 'Dano de Incinerar aumentado em 25%, e Incinerar tem mais 10% de chance de evocar um Eco de Sargeras.',
    fourPiece: 'Alvos que recebem dano de Eco de Sargeras recebem mais 6% de dano dos seus feitiços e habilidades por 6 s.'
  },
  recommendedEmbellishments: [
    '2× Forro de Arcanotrama (Arcanoweave Lining - 240167 / 244588) nos Braceletes do Mártir (331) e Banda do Mártir (331) para Intelecto contínuo.',
    'Alternativa: 1× Forro de Arcanotrama + 1× Lanterna de Aln\'hara (331) com Signo de Negraluna: Sangue (245872).'
  ],
  noRaidBiS: [
    { slot: 'Cabeça', itemPt: 'Crânio do Necrólito Maldito (334)', source: 'Matrix Catalyst semanal', notes: 'Peça do conjunto 4pc.' },
    { slot: 'Pescoço', itemPt: 'Feixe de Presas Protetoras (341)', source: 'M+ Altar das Presas', notes: 'Teto forjado M+ 341; Crítico + Aceleração.' },
    { slot: 'Ombros', itemPt: 'Pináculos do Necrólito Maldito (334)', source: 'Matrix Catalyst semanal', notes: 'Peça do conjunto 4pc.' },
    { slot: 'Costas', itemPt: 'Mortalha do Inferninho (334)', source: 'M+ Travessa dos Assassinos', notes: 'Crítico 66 / Maestria 47.' },
    { slot: 'Torso', itemPt: 'Vestes Chacoalhantes do Necrólito Maldito (334)', source: 'Matrix Catalyst semanal', notes: 'Peça central do conjunto 4pc.' },
    { slot: 'Pulsos', itemPt: 'Braceletes do Mártir (331)', source: 'Craft Alfaiataria', notes: 'Embelezamento 1: Forro de Arcanotrama + Mae/Ace.' },
    { slot: 'Mãos', itemPt: 'Agarres Calcinados do Necrólito Maldito (334)', source: 'Matrix Catalyst semanal', notes: 'Peça do conjunto 4pc.' },
    { slot: 'Cinto', itemPt: 'Banda do Mártir (331)', source: 'Craft Alfaiataria', notes: 'Embelezamento 2: Forro de Arcanotrama + Mae/Ace.' },
    { slot: 'Pernas', itemPt: 'Amarras de Perna do Necrólito Maldito (334)', source: 'Matrix Catalyst semanal', notes: 'Peça do conjunto 4pc.' },
    { slot: 'Pés', itemPt: 'Sapatilhas do Mártir (331)', source: 'Craft Alfaiataria', notes: 'Maestria + Aceleração via missiva (sem embelezamento).' },
    { slot: 'Anel 1', itemPt: 'Elo Sin\'dorei Magistral (331)', source: 'Craft Joalheria', notes: 'Engaste prismático + Mae/Ace.' },
    { slot: 'Anel 2', itemPt: 'Elo do Senhor da Guerra Amani (341)', source: 'M+ Altar das Presas', notes: 'Teto de masmorra M+ 341.' },
    { slot: 'Berloque 1', itemPt: 'Emblema Tempestuoso de Dazar (341)', source: 'M+ Descanso do Rei', notes: 'On-use +1.082 de Maestria por 20 s perfeitamente alinhado com o Infernão.' },
    { slot: 'Berloque 2', itemPt: 'Ampola Torpe de Peçonha Volátil (341)', source: 'M+ Altar das Presas', notes: 'On-use +992 de secundário por 15 s.' },
    { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido (341)', source: 'M+ Altar das Presas', notes: 'Proc de dano sagrado em área; substitui Jan\'thrazet.' },
    { slot: 'Mão Secundária', itemPt: 'Lanterna de Aln\'hara (331)', source: 'Craft Escrivania', notes: 'Atributos personalizáveis Maestria + Aceleração.' }
  ],
  delveStrategy: {
    roomsFocus: 'Com a Runa C02 (Fogo Incontido + Concha Maculada + Perenidade + Poder Crítico + Energia Residual 5B), queime pacotes de monstros com Cataclismo + Chuva de Fogo contínua, colhendo fragmentos rápidos de Incinerar.',
    bossFocus: 'Em Kindo\'jan Tier 11, ative a Runa C24 (Autorrecomposição 2B + Guerreiro Versátil 4D + Ecos 5C). Alinhe Infernão e Seta do Caos duplicada durante a janela do Emblema de Dazar (+1.082 Maestria).',
    recommendedPet: 'Voidwalker (Emissário do Caos) para manter o aggro estável e evitar interrupções no lançamento de Seta do Caos.',
    survivalTips: [
      'Disparar Conflagrar em movimento para manter o buff de Aceleração/Cast de Seta do Caos.',
      'Usar Resolução Infindável (Unending Resolve) antes de feitiços de dano massivo de área.',
      'Pedra de Vida com Soulburn garante regeneração instantânea se o Voidwalker cair.',
      'Controlar posicionamento para que a Chuva de Fogo não atraia patrulhas extras acidentalmente.'
    ]
  }
};

export const BALANCE_DRUID: SpecProfile = {
  id: 'balance',
  namePt: 'Druida do Equilíbrio',
  nameEn: 'Balance Druid',
  role: 'DPS',
  heroTalents: ['Escolhido de Eluna (Elune\'s Chosen)', 'Guardião do Bosque (Keeper of the Grove)'],
  recommendedHero: 'Escolhido de Eluna (Elune\'s Chosen) — Dominante em dano Astral e Chuva Estelar',
  talentImportString: 'CYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALDAAAAAmZbwMLjtNzssxMDDz2iZYGAAAYMmZZmZbGzysNzMmZZmhNAzG',
  statPriority: ['Aceleração (Haste)', 'Maestria (Mastery)', 'Acerto Crítico (Crit)', 'Versatilidade (Versatility)'],
  statWeightsDescription: 'Aceleração é prioritária para fechar ciclos rápidos de Eclipse Solar e Lunar e acelerar ticks de Fogo Estelar e Fogo Solar. Maestria amplifica o dano Astral durante os Eclipses. Crítico converte dano direto.',
  tierSet: {
    id: 2057,
    namePt: 'Casca do Velassonhos Enigmático',
    nameEn: 'Bark of the Enigmatic Dreamwatcher',
    twoPiece: 'Dano de Surto Estelar +20%. A Chuva Estelar também causa dano Astral instantaneamente a todos os inimigos válidos ao alcance quando lançada.',
    fourPiece: 'Dano +10% em qualquer Eclipse. O bônus cai para 2% no ponto intermediário do Eclipse e volta a 10% no final dele.'
  },
  recommendedEmbellishments: [
    '2× Forro de Arcanotrama (240167 / 244588) nos Defletores do Agente de Luaprata (331 Couraria) e na Lanterna de Aln\'hara (331 Escrivania) com missiva Aceleração + Maestria.',
    'Alternativa: 1× Forro de Arcanotrama + 1× Signo de Negraluna: Sangue (245872) para suporte.'
  ],
  noRaidBiS: [
    { slot: 'Cabeça', itemPt: 'Olhar Soporífero do Velassonhos Enigmático (334)', source: 'Great Vault / Catalyst', notes: 'Peça de tier 4pc.' },
    { slot: 'Pescoço', itemPt: 'Feixe de Presas Protetoras (341)', source: 'M+ Altar das Presas', notes: 'Melhor colar de secundários fora de raide.' },
    { slot: 'Ombros', itemPt: 'Plumagem do Velassonhos Enigmático (334)', source: 'Matrix Catalyst', notes: 'Peça de tier 4pc.' },
    { slot: 'Costas', itemPt: 'Mortalha do Inferninho (334)', source: 'M+ Travessa dos Assassinos', notes: 'Crítico 66 / Maestria 47.' },
    { slot: 'Torso', itemPt: 'Traje Lunar do Velassonhos Enigmático (334)', source: 'Great Vault / Catalyst', notes: 'Peça central do tier 4pc.' },
    { slot: 'Pulsos', itemPt: 'Defletores do Agente de Luaprata (331)', source: 'Craft Couraria', notes: 'Com Forro de Arcanotrama + Missiva Ace/Mae.' },
    { slot: 'Mãos', itemPt: 'Manoplas do Velassonhos Enigmático (334)', source: 'Matrix Catalyst', notes: 'Peça de tier 4pc.' },
    { slot: 'Cinto', itemPt: 'Cinto do Pisa-piras (321) / Drop M+ (334)', source: 'Wah\'du (Delve) / Masmorras M+', notes: 'Secundários equilibrados.' },
    { slot: 'Pernas', itemPt: 'Perneiras do Velassonhos Enigmático (334)', source: 'Great Vault / Catalyst', notes: 'Peça de tier 4pc.' },
    { slot: 'Pés', itemPt: 'Calçados do Agente de Luaprata (331)', source: 'Craft Couraria', notes: 'Missiva Aceleração + Maestria.' },
    { slot: 'Anel 1', itemPt: 'Elo de Arenito Carregado (334)', source: 'M+ Templo de Sethraliss', notes: 'Crí 232 / Mae 174.' },
    { slot: 'Anel 2', itemPt: 'Elo Sin\'dorei Magistral (331)', source: 'Craft Joalheria', notes: 'Engaste prismático garantido.' },
    { slot: 'Berloque 1', itemPt: 'Ampola Torpe de Peçonha Volátil (341)', source: 'M+ Altar das Presas', notes: 'On-use +992 de secundário por 15 s.' },
    { slot: 'Berloque 2', itemPt: 'Rocha Marinha do Clamaondas (341)', source: 'M+ Costa das Ondas', notes: 'Passivo Aceleração e Intelecto.' },
    { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido (341)', source: 'M+ Altar das Presas', notes: 'Permite uso conjunto com Lanterna de Aln\'hara.' },
    { slot: 'Mão Secundária', itemPt: 'Lanterna de Aln\'hara (331)', source: 'Craft Escrivania', notes: 'Segundo embelezamento + Missiva Febre Ardente (Ace/Mae).' }
  ],
  delveStrategy: {
    roomsFocus: 'Com a Runa C29 (Reflexos de Lince + Aceleração Ardente + Energia Residual 5B), mantenha Chuva Estelar cobrindo todo o recinto enquanto se move entre colunas em Forma de Luniscante. Aproveite a velocidade extra de corrida.',
    bossFocus: 'Em Kindo\'jan Tier 11, use a Runa C24 (Autorrecomposição 2B + Guerreiro Versátil 4D + Ecos 5C). Alinhe Alinhamento Celestial e Surto Estelar nos momentos de quebra de escudo.',
    recommendedPet: 'Bran Barba de Bronze em modo DPS/Suporte com relíquias de cura para complementar a Renovação.',
    survivalTips: [
      'Pele de Árvore (Barkskin) a cada 60 s para mitigar picos de dano físico e mágico.',
      'Renovação (Renewal) cura 30% instantânea em situações de perigo iminente.',
      'Trocar para Forma de Urso com Frenesi Regenerativo em emergências críticas.',
      'Tufão e Vórtice de Ursol para desacelerar packs perigosos e evitar dano corpo a corpo.'
    ]
  }
};

export const SHADOW_PRIEST: SpecProfile = {
  id: 'shadow',
  namePt: 'Sacerdote das Sombras',
  nameEn: 'Shadow Priest',
  role: 'DPS',
  heroTalents: ['Tecelão do Vazio (Voidweaver)', 'Arconte (Archon)'],
  recommendedHero: 'Tecelão do Vazio (Voidweaver) para M+ explosivo e Delves; Arconte para dano sustentado',
  talentImportString: 'CIQAAAAAAAAAAAAAAAAAAAAAAAYDAAAAAAAAALzgZZmxMLzMsNzMjZMmZmFjttNDDzMjGz2MbzMDAAAAAGDmxMzMbgZZmZmZYmBA',
  statPriority: ['Aceleração (Haste)', 'Maestria (Mastery)', 'Acerto Crítico (Crit)', 'Versatilidade (Versatility)'],
  statWeightsDescription: 'Aceleração reduz o tempo de recarga de Impacto Mental e acelera ticks de Praga Devoradora e Toque Vampírico. Maestria aumenta o dano por cada DoT ativo na vítima. Crítico potencializa Aparições Sombrias.',
  tierSet: {
    id: 2063,
    namePt: 'Fatiota do Penitente Cósmico',
    nameEn: "Cosmic Penitent's Raiment",
    twoPiece: 'Praga Devoradora tem 10% de chance de não consumir Insanidade. Aparições Sombrias geram 2 de Insanidade ao acertar.',
    fourPiece: 'Praga Devoradora aumenta o dano de Impacto Mental e Impacto do Vazio em 20% durante a duração. Aparições Sombrias causam 10% a mais de dano.'
  },
  recommendedEmbellishments: [
    '2× Forro de Arcanotrama (240167 / 244588) nos Braceletes do Mártir (331) e Banda do Mártir (331) com missiva Aceleração + Crítico.',
    'Alternativa: 1× Forro de Arcanotrama + 1× Lanterna de Aln\'hara (331) com Signo de Negraluna: Sangue (245872).'
  ],
  noRaidBiS: [
    { slot: 'Cabeça', itemPt: 'Visão Verdadeira do Penitente Cósmico (334)', source: 'Great Vault / Catalyst', notes: 'Peça de tier 4pc.' },
    { slot: 'Pescoço', itemPt: 'Feixe de Presas Protetoras (341)', source: 'M+ Altar das Presas', notes: 'Substitui o Relicário Aqiricida fora de raide.' },
    { slot: 'Ombros', itemPt: 'Dragonas da Ascensão Cerimonial (334)', source: 'M+ Descanso do Rei', notes: 'Ombros BiS de M+ — peça fora do tier (não usar tier nos ombros).' },
    { slot: 'Costas', itemPt: 'Mortalha do Inferninho (334)', source: 'M+ Travessa dos Assassinos', notes: 'Crítico 66 / Maestria 47.' },
    { slot: 'Torso', itemPt: 'Vestes Eclipsantes do Penitente Cósmico (334)', source: 'Great Vault / Catalyst', notes: 'Peça de tier 4pc.' },
    { slot: 'Pulsos', itemPt: 'Braceletes do Mártir (331)', source: 'Craft Alfaiataria', notes: 'Com Forro de Arcanotrama + Missiva Ace/Crí.' },
    { slot: 'Mãos', itemPt: 'Guantes Celestiais do Penitente Cósmico (334)', source: 'Great Vault / Catalyst', notes: 'Peça de tier 4pc.' },
    { slot: 'Cinto', itemPt: 'Banda do Mártir (331)', source: 'Craft Alfaiataria', notes: 'Embelezamento 2 ou Missiva Ace/Crí.' },
    { slot: 'Pernas', itemPt: 'Culotes Envolventes do Penitente Cósmico (334)', source: 'Great Vault / Catalyst', notes: 'Peça de tier 4pc (fecha o 4pc com Cabeça, Peitoral e Mãos).' },
    { slot: 'Pés', itemPt: 'Sapatilhas do Mártir (331) / Alpargatas do Pisa-piras (321)', source: 'Craft Alfaiataria / Wah\'du (Delve)', notes: 'Aceleração prioritária.' },
    { slot: 'Anel 1', itemPt: 'Elo do Senhor da Guerra Amani (341)', source: 'M+ Altar das Presas', notes: 'Anel de alta Aceleração.' },
    { slot: 'Anel 2', itemPt: 'Elo Sin\'dorei Magistral (331)', source: 'Craft Joalheria', notes: 'Engaste prismático + Missiva Ace/Crí.' },
    { slot: 'Berloque 1', itemPt: 'Ampola Torpe de Peçonha Volátil (341)', source: 'M+ Altar das Presas', notes: 'On-use +992 de secundário por 15 s.' },
    { slot: 'Berloque 2', itemPt: 'Rocha Marinha do Clamaondas (341)', source: 'M+ Costa das Ondas', notes: 'Passivo Aceleração e Intelecto constante.' },
    { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido (341)', source: 'M+ Altar das Presas', notes: 'Melhor arma 1M fora de raide.' },
    { slot: 'Mão Secundária', itemPt: 'Lanterna de Aln\'hara (331)', source: 'Craft Escrivania', notes: 'Substitui a Espinha do Abismo fora de raide.' }
  ],
  delveStrategy: {
    roomsFocus: 'Com a Runa C29 (Reflexos de Lince + Aceleração Ardente + Energia Residual 5B), abra a Fenda Entrópica com Tecelão do Vazio e canalize Torrente do Vazio. O colapso da fenda e as Aparições limpam grupos inteiros rapidamente.',
    bossFocus: 'Em Kindo\'jan Tier 11, troque para a Runa C24 (Autorrecomposição 2B + Guerreiro Versátil 4D + Ecos 5C). Mantenha Abraço Vampírico alinhado com dano de pico e Dispersão para feitiços letais do chefe.',
    recommendedPet: 'Bran Barba de Bronze com relíquias de mitigação e potes de vida.',
    survivalTips: [
      'Dispersão (Dispersion) reduz dano recebido em 75% e pode ser usada em situações de emergência.',
      'Prece Desesperada (Desperate Prayer) aumenta vida máxima em 25% instantaneamente.',
      'Abraço Vampírico converte 50% do dano de alvo único em cura direta.',
      'Grito Psíquico (Psychic Scream) para interromper canais perigosos em área.'
    ]
  }
};

export const SPEC_PROFILES: Record<ActiveSpec, SpecProfile> = {
  demonology: DEMONOLOGY_WARLOCK,
  affliction: AFFLICTION_WARLOCK,
  destruction: DESTRUCTION_WARLOCK,
  balance: BALANCE_DRUID,
  shadow: SHADOW_PRIEST
};

export const getSpecProfile = (spec: ActiveSpec): SpecProfile => {
  return SPEC_PROFILES[spec] || DEMONOLOGY_WARLOCK;
};
