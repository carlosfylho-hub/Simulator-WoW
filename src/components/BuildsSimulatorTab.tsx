import React, { useState } from 'react';
import { Shield, Swords, Sparkles, Copy, Check, Layers, Zap, HeartPulse, MapPin, Eye } from 'lucide-react';
import { ActiveSpec } from '../types/wow';
import { useItemTooltip } from '../context/TooltipContext';

interface BuildsSimulatorProps {
  externalSpecId?: ActiveSpec;
  onSpecChange?: (spec: ActiveSpec) => void;
}

export interface GearDropInfo {
  slot: string;
  itemPt: string;
  itemEn: string;
  id: number;
  icon: string;
  heroIlvl: number;
  mythIlvl: number;
  sourceType: 'delve' | 'mplus' | 'craft' | 'catalyst' | 'raid';
  sourceLocation: string; // e.g. "Masmorra M+: Altar das Presas"
  roleTag: 'BiS Direto' | 'Matéria de Tier (Catalisador)' | 'Upgrade de Secundários' | 'Embelezamento Artesanal' | 'Acessório BiS' | 'Progressão M+';
  notes: string;
}

interface ScenarioBuild {
  id: string;
  name: string;
  heroTalent: string;
  talentCode: string;
  focus: string;
  statPriorities: string[];
  runeCode: string;
  runeCombo: string;
  runeReason: string;
  embellishmentsSlotDetail: {
    slot1: string;
    item1: string;
    effect1: string;
    slot2: string;
    item2: string;
    effect2: string;
  };
  consumablesOfficial: {
    flask: string;
    potion: string;
    food: string;
    oil: string;
    rune: string;
  };
  gearList: GearDropInfo[];
  ratings: {
    singleTarget: number;
    aoe: number;
    survivability: number;
    mobility: number;
    complexity: 'Baixa' | 'Média' | 'Alta';
  };
  keyRotationTip: string;
}

interface SpecData {
  specId: string;
  specName: string;
  className: string;
  situations: {
    delve: ScenarioBuild[];
    mplus: ScenarioBuild[];
    raid: ScenarioBuild[];
  };
}

const BUILDS_DATABASE: SpecData[] = [
  // --- 1. BRUXO DEMONOLOGIA ---
  {
    specId: 'demonology',
    specName: 'Bruxo Demonologia',
    className: 'Bruxo',
    situations: {
      delve: [
        {
          id: 'demo_delve_rooms',
          name: 'Salas do Labirinto (AoE, Kiting & Trash)',
          heroTalent: 'Diabolista (Diabolist)',
          talentCode: 'CoQAAAAAAAAAAAAAAAAAAAAAAYmhZGNbmx2MzYWGAAAAAAAwYGDLwAbj2ohFjZGLz2MzMmBAmZMmZmZAmZGmZDAAMmZmxwwyMGwA',
          focus: 'Velocidade de reposicionamento e explosão em área para limpar salas densas',
          statPriorities: ['Aceleração (32%+)', 'Crítico (20%+)', 'Maestria (42%+)', 'Versatilidade (8%)'],
          runeCode: 'C26',
          runeCombo: '1A - 2C - 3A - 4A - 5B',
          runeReason: 'Reflexos de Lince (2C) garante +77,5 de velocidade ao tomar dano para kiting entre colunas (lembre-se: 2C dá velocidade, não redução de dano!). Energia Residual (5B) dobra o dano periódico.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir [239648] (Alfaiataria)',
            effect1: 'Forro de Arcanotrama [240167] (Aumenta Intelecto com vida alta)',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769] (Escrivania)',
            effect2: 'Signo de Negraluna: Sangue [240170] (Autocura passiva contínua)'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Magísteres [241323] (+Intelecto)',
            potion: 'Poção de Vida de Luaprata Concentrada [271883]',
            food: 'Espetinhos Brilhantes [242281] (+65 Aceleração)',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Mitra do Pisa-piras', itemEn: "Pyretreader's Miter", id: 272234, icon: 'inv_helm_cloth_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'delve', sourceLocation: "Imersão Solo: Wah'du / Labirinto de Kindo'jan (Tier 8+)", roleTag: 'Matéria de Tier (Catalisador)', notes: 'Comprado com Fragmentos de Alma Mítica · Converte em Elmo de Tier' },
            { slot: 'Ombros', itemPt: 'Dragonas do Pisa-piras', itemEn: "Pyretreader's Pauldrons", id: 272236, icon: 'inv_shoulder_cloth_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'delve', sourceLocation: "Imersão Solo: Wah'du / Labirinto de Kindo'jan (Tier 8+)", roleTag: 'Matéria de Tier (Catalisador)', notes: 'Aceleração 87 · Versatilidade 56 · Converte em Ombros de Tier' },
            { slot: 'Peitoral', itemPt: 'Veste de Ritos Primordial', itemEn: 'Primordial Ritual Robes', id: 273785, icon: 'inv_robe_cloth_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Drop Mítico de M+ · Vira Peitoral 4pc no Catalisador Matriz' },
            { slot: 'Pulsos', itemPt: 'Braceletes do Mártir', itemEn: "Martyr's Bindings", id: 239648, icon: 'inv_bracer_cloth_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Alfaiataria (Centelha de Marés)', roleTag: 'Embelezamento Artesanal', notes: 'Embelezamento: Forro de Arcanotrama [240167] · Teto 331' },
            { slot: 'Mãos', itemPt: 'Mitenes de Ritos Blasfemos', itemEn: 'Blasphemous Ritual Mitts', id: 273773, icon: 'inv_glove_cloth_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Crítico + Maestria · Converte em Luvas de Tier 4pc' },
            { slot: 'Cinto', itemPt: 'Atadura do Éter Etérea', itemEn: 'Ethereal Netherwrap', id: 251222, icon: 'inv_belt_cloth_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Arena da Chaga do Caos (Voidscar Arena)', roleTag: 'BiS Direto', notes: 'BiS sem raide: Aceleração 95 · Crítico 56' },
            { slot: 'Pernas', itemPt: 'Perneiras de Serpentes Entrelaçadas', itemEn: 'Entwined Serpent Leggings', id: 273786, icon: 'inv_pant_cloth_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Crítico + Aceleração · Converte em Calças de Tier 4pc' },
            { slot: 'Costas', itemPt: 'Mortalha do Inferninho', itemEn: 'Speakeasy Shroud', id: 251132, icon: 'inv_cape_leather_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row)', roleTag: 'BiS Direto', notes: 'BiS Costas: Crítico + Maestria' },
            { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido', itemEn: 'Gleamline Channeller', id: 273778, icon: 'inv_knife_1h_zuljin_d_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Adaga de Intelecto · Aceleração + Maestria' },
            { slot: 'Mão Sec.', itemPt: 'Lanterna de Aln\'hara', itemEn: "Aln'hara Lantern", id: 245769, icon: 'inv_offhand_1h_raidtroll_d_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Escrivania (Centelha de Marés)', roleTag: 'Embelezamento Artesanal', notes: 'Embelezamento: Signo de Negraluna: Sangue [240170]' },
            { slot: 'Berloque 1', itemPt: 'Emblema Tempestuoso de Dazar', itemEn: 'Stormbound Emblem of Dazar', id: 273649, icon: 'inv_7_0raid_necklace_14a', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Repouso do Rei (King\'s Rest)', roleTag: 'BiS Direto', notes: 'Uso ativo: +1.082 de Aceleração por 20 s (Tier S absoluto)' },
            { slot: 'Berloque 2', itemPt: 'Nó de Serpentes Contorcidas', itemEn: 'Knot of Writhing Serpents', id: 273794, icon: 'inv_121_trinket_dungeon_ulatek_writhe', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Passivo constante de Intelecto (Regra R4: 1 ativo + 1 passivo)' }
          ],
          ratings: { singleTarget: 4, aoe: 5, survivability: 4, mobility: 4, complexity: 'Média' },
          keyRotationTip: 'Puxe grupos com Vilguarda em Machado Giratório e detone Implosão cíclica a cada 6 diabretes.'
        },
        {
          id: 'demo_delve_boss',
          name: 'Chefe Kindo\'jan (Tier 11 Solo)',
          heroTalent: 'Diabolista (Diabolist)',
          talentCode: 'CoQA4DPb6v5x8sU9O9+6jT/5DAAAAAAAAAAAAAAAAAAAAAYmZGzMzMDzYGzMmZbmZMzMzMMMzAAAAAAYbYMjFjhZmBzMmtB',
          focus: 'Dano sustentado em alvo único com autocura emergencial e mitigação de atrito',
          statPriorities: ['Aceleração (35%+)', 'Versatilidade (12%+ mitigação)', 'Crítico (19%)', 'Maestria (38%)'],
          runeCode: 'C24',
          runeCombo: '1A - 2B - 3A - 4D - 5C',
          runeReason: 'Autorrecomposição (2B) cura quando abaixo de 75% e Guerreiro Versátil (4D) mitiga o dano inevitável. Ecos (5C) replica 50% de dano após 10s.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir [239648] (Alfaiataria)',
            effect1: 'Forro de Arcanotrama [240167] (Aumenta Intelecto)',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769] (Escrivania)',
            effect2: 'Segundo Forro de Arcanotrama [240167] (2 efeitos ativos de dano máximo)'
          },
          consumablesOfficial: {
            flask: 'Frasco da Resistência Talassiana (Defensivo/Mitigação)',
            potion: 'Poção de Vida de Luaprata Concentrada [271883]',
            food: 'Filé Beijado pela Vileza [242286] (+65 stat)',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Turbante do Primeiro Império', itemEn: "First Empire's Turban", id: 239047, icon: 'inv_helm_cloth_zandalardungeon_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Repouso do Rei (King\'s Rest)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Converte no Catalisador Matriz em Elmo Tier 334' },
            { slot: 'Ombros', itemPt: 'Dragonas da Ascensão Cerimonial', itemEn: 'Mantle of Ceremonial Ascension', id: 239045, icon: 'inv_shoulder_cloth_zandalardungeon_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Repouso do Rei (King\'s Rest)', roleTag: 'BiS Direto', notes: 'BiS Slot Livre: Aceleração + Maestria no 5º slot fora do Tier' },
            { slot: 'Peitoral', itemPt: 'Grilhões do Necrólito Maldito', itemEn: "Damned Necrolyte's Shattered Restraints", id: 271549, icon: 'inv_cloth_raidwarlock_ab_01_chest', heroIlvl: 321, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Catalisador Matriz (Matrix Catalyst)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Conversão de peça Mítica de M+ no bônus 4pc de Tier 2066' },
            { slot: 'Pulsos', itemPt: 'Braceletes do Mártir', itemEn: "Martyr's Bindings", id: 239648, icon: 'inv_bracer_cloth_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Alfaiataria (Centelha de Marés)', roleTag: 'Embelezamento Artesanal', notes: 'Embelezado com Forro de Arcanotrama [240167]' },
            { slot: 'Cinto', itemPt: 'Atadura do Éter Etérea', itemEn: 'Ethereal Netherwrap', id: 251222, icon: 'inv_belt_cloth_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Arena da Chaga do Caos (Voidscar Arena)', roleTag: 'BiS Direto', notes: 'Crítico 56 · Aceleração 95' },
            { slot: 'Pernas', itemPt: 'Perneiras de Serpentes Entrelaçadas', itemEn: 'Entwined Serpent Leggings', id: 273786, icon: 'inv_pant_cloth_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Converte em Pernas de Tier no Catalisador' },
            { slot: 'Anel 1', itemPt: 'Elo de Arenito Carregado', itemEn: 'Charged Sandstone Band', id: 158366, icon: 'inv_ring_80_03d', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Templo de Sethraliss (Temple of Sethraliss)', roleTag: 'BiS Direto', notes: 'Crítico 232 · Maestria 174' },
            { slot: 'Anel 2', itemPt: 'Elo do Senhor da Guerra Amani', itemEn: 'Amani Warlord Band', id: 273792, icon: 'inv_121_jewelry_ring02_green', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Aceleração + Crítico' },
            { slot: 'Berloque 1', itemPt: 'Emblema Tempestuoso de Dazar', itemEn: 'Stormbound Emblem of Dazar', id: 273649, icon: 'inv_7_0raid_necklace_14a', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Repouso do Rei (King\'s Rest)', roleTag: 'BiS Direto', notes: 'Ative no burst do Tirano Diabólico (+1.082 Aceleração)' },
            { slot: 'Berloque 2', itemPt: 'Nó de Serpentes Contorcidas', itemEn: 'Knot of Writhing Serpents', id: 273794, icon: 'inv_121_trinket_dungeon_ulatek_writhe', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Passivo de Intelecto constante' }
          ],
          ratings: { singleTarget: 5, aoe: 3, survivability: 5, mobility: 3, complexity: 'Alta' },
          keyRotationTip: 'Ative o Pacto Sombrio antes das Chamas do Kindo\'jan e alinhe Dazar com o Tirano Diabólico.'
        }
      ],
      mplus: [
        {
          id: 'demo_mplus_mid',
          name: 'Chaves Médias (+2 a +9)',
          heroTalent: 'Diabolista (Diabolist)',
          talentCode: 'CoQAAAAAAAAAAAAAAAAAAAAAAYmhZGNbmx2MzYWGAAAAAAAwYGDLwAbj2ohFjZGLz2MzMmBAmZMmZmZAmZGmZDAAMmZmxwwyMGwA',
          focus: 'Throughput puro de dano em masmorras com pulls rápidos',
          statPriorities: ['Aceleração (35%+)', 'Crítico (22%+)', 'Maestria (40%+)', 'Versatilidade (5%)'],
          runeCode: 'C29',
          runeCombo: '1A - 2C - 3A - 4B - 5B',
          runeReason: 'Ímpeto Acelerado (4B) sobrepõe bônus massivo de Aceleração para o Bruxo invocar Diabretes mais rápido.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir [239648] (Alfaiataria)',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769] (Escrivania)',
            effect2: 'Segundo Forro de Arcanotrama [240167]'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Magísteres [241323] (+Intelecto)',
            potion: 'Poção da Imprudência [241289] (+1.725 secundário)',
            food: 'Espetinhos Brilhantes [242281] (+65 Aceleração)',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Berloque 1', itemPt: 'Emblema Tempestuoso de Dazar', itemEn: 'Stormbound Emblem of Dazar', id: 273649, icon: 'inv_7_0raid_necklace_14a', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Repouso do Rei (King\'s Rest)', roleTag: 'BiS Direto', notes: 'Ativo Tier S sem raide · +1.082 Aceleração' },
            { slot: 'Berloque 2', itemPt: 'Nó de Serpentes Contorcidas', itemEn: 'Knot of Writhing Serpents', id: 273794, icon: 'inv_121_trinket_dungeon_ulatek_writhe', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Passivo Intelecto' },
            { slot: 'Peitoral', itemPt: 'Veste de Ritos Primordial', itemEn: 'Primordial Ritual Robes', id: 273785, icon: 'inv_robe_cloth_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Converte em Peitoral Tier 4pc' },
            { slot: 'Cinto', itemPt: 'Atadura do Éter Etérea', itemEn: 'Ethereal Netherwrap', id: 251222, icon: 'inv_belt_cloth_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Arena da Chaga do Caos (Voidscar Arena)', roleTag: 'BiS Direto', notes: 'BiS Aceleração e Crítico' },
            { slot: 'Anel', itemPt: 'Elo de Arenito Carregado', itemEn: 'Charged Sandstone Band', id: 158366, icon: 'inv_ring_80_03d', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Templo de Sethraliss (Temple of Sethraliss)', roleTag: 'BiS Direto', notes: 'BiS Crítico e Maestria' }
          ],
          ratings: { singleTarget: 4, aoe: 5, survivability: 3, mobility: 4, complexity: 'Média' },
          keyRotationTip: 'Sempre guarde fragmentos para conjurar Mão de Gul\'dan antes de iniciar o próximo pull.'
        },
        {
          id: 'demo_mplus_high',
          name: 'Chaves Altas (+10 ou mais)',
          heroTalent: 'Diabolista (Diabolist)',
          talentCode: 'CoQAAAAAAAAAAAAAAAAAAAAAAYmhZGNbmx2MzYWGAAAAAAAwYGDLwAbj2ohFjZGLz2MzMmBAmZMmZmZAmZGmZDAAMmZmxwwyMGwA',
          focus: 'Alta mitigação de afixos rotativos de Xal\'atath e picos de Tirânico/Fortificado',
          statPriorities: ['Aceleração (32%+)', 'Versatilidade (14%+)', 'Crítico (18%)', 'Maestria (36%)'],
          runeCode: 'C30',
          runeCombo: '1A - 2C - 3A - 4D - 5B',
          runeReason: 'Guerreiro Versátil (4D) mitiga o dano de atrito severo; Sorver nos ombros e Evasão no elmo.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir [239648] (Alfaiataria)',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769] (Escrivania)',
            effect2: 'Signo de Negraluna: Sangue [240170]'
          },
          consumablesOfficial: {
            flask: 'Frasco da Resistência Talassiana (Sobrevivência)',
            potion: 'Poção de Vida de Luaprata Concentrada [271883]',
            food: 'Parada de Luaprata [255845]',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Pulsos', itemPt: 'Braceletes do Mártir', itemEn: "Martyr's Bindings", id: 239648, icon: 'inv_bracer_cloth_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Alfaiataria (Centelha de Marés)', roleTag: 'Embelezamento Artesanal', notes: 'Embelezado com Forro de Arcanotrama' },
            { slot: 'Mão Sec.', itemPt: 'Lanterna de Aln\'hara', itemEn: "Aln'hara Lantern", id: 245769, icon: 'inv_offhand_1h_raidtroll_d_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Escrivania (Centelha de Marés)', roleTag: 'Embelezamento Artesanal', notes: 'Signo de Sangue (Leech Passivo)' },
            { slot: 'Capa', itemPt: 'Mortalha do Inferninho', itemEn: 'Speakeasy Shroud', id: 251132, icon: 'inv_cape_leather_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row)', roleTag: 'BiS Direto', notes: 'BiS Capa da Temporada 2' }
          ],
          ratings: { singleTarget: 4, aoe: 4, survivability: 5, mobility: 4, complexity: 'Alta' },
          keyRotationTip: 'Morte zera o DPS em chaves altas: priorize não tomar dano de poças em vez de forçar um cast arriscado.'
        }
      ],
      raid: [
        {
          id: 'demo_raid_st',
          name: 'Alvo Único Puro (ST Boss)',
          heroTalent: 'Diabolista (Diabolist)',
          talentCode: 'CoQAAAAAAAAAAAAAAAAAAAAAAYmZMzoZjhZmxsMAAAAAAAgxMGWgB2GtQDLGjxysMzMjZAgZGzMzMzAMzMmZAAAGzMzMDDLzYAD',
          focus: 'Dano sustentado prolongado em lutas de chefe de 5 a 8 minutos',
          statPriorities: ['Aceleração (36%+)', 'Crítico (24%+)', 'Maestria (38%+)', 'Versatilidade (4%)'],
          runeCode: 'C13',
          runeCombo: '1A - 2B - 3A - 4A - 5A',
          runeReason: 'Sobrecarga Arcana (5A) dobra o dano da Runa Central com acúmulos contínuos de Crítico (4A).',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir [239648] (Alfaiataria)',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769] (Escrivania)',
            effect2: 'Segundo Forro de Arcanotrama [240167]'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Magísteres [241323] (+Intelecto)',
            potion: 'Grogue da Impulsividade Desenfreada [241293]',
            food: 'Espetinhos Brilhantes [242281] (+65 Aceleração)',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Arma 1M', itemPt: 'Jan\'thrazet, a Presa Anímica', itemEn: "Jan'thrazet, the Soul Fang", id: 271092, icon: 'inv_sword_1h_bloodelf_d_01', heroIlvl: 328, mythIlvl: 344, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Cantrip 344 (+71 Aceleração)' },
            { slot: 'Pescoço', itemPt: 'Relicário Aqiricida', itemEn: 'Aqirbane Reliquary', id: 268265, icon: 'inv_jewelry_necklace_12', heroIlvl: 328, mythIlvl: 344, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Engaste prismático + proc secundário' }
          ],
          ratings: { singleTarget: 5, aoe: 2, survivability: 3, mobility: 3, complexity: 'Alta' },
          keyRotationTip: 'Encaixe perfeitamente o ciclo de 3 rituais do Diabolista com a recarga do Tirano Demoníaco.'
        },
        {
          id: 'demo_raid_cleave',
          name: 'Lutas de Concílio & Cleave com Adds',
          heroTalent: 'Diabolista (Diabolist)',
          talentCode: 'CoQAAAAAAAAAAAAAAAAAAAAAAYmZMzoZjhZmxsMAAAAAAAgxMGWgB2GtQDLGjxysMzMjZAgZGzMzMzAMzMmZAAAGzMzMDDLzYAD',
          focus: 'Cleave constante em 2-3 alvos com ondas de lacaios',
          statPriorities: ['Aceleração (34%+)', 'Maestria (42%+)', 'Crítico (20%)', 'Versatilidade (4%)'],
          runeCode: 'C06',
          runeCombo: '1A - 2A - 3A - 4B - 5C',
          runeReason: 'Ecos do Folio (5C) replica o dano de área após 10s e Concha Maculada (2A) protege contra picos mecânicos.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir [239648] (Alfaiataria)',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769] (Escrivania)',
            effect2: 'Segundo Forro de Arcanotrama [240167]'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Magísteres [241323] (+Intelecto)',
            potion: 'Poção da Imprudência [241289]',
            food: 'Espetinhos Brilhantes [242281] (+65 Aceleração)',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Capucho Horrendo do Guardião da Peçonha', itemEn: "Venomkeeper's Horrific Cowl", id: 271874, icon: 'inv_helm_cloth_raid_ab_01', heroIlvl: 328, mythIlvl: 344, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Cantrip 344 passivo de Natureza' },
            { slot: 'Anel', itemPt: 'Elo do Chama-enxame', itemEn: 'Band of the Swarmcaller', id: 281029, icon: 'inv_jewelry_ring_70', heroIlvl: 321, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Kith\'ix)', roleTag: 'BiS Direto', notes: 'Proc em área de Natureza' }
          ],
          ratings: { singleTarget: 4, aoe: 5, survivability: 4, mobility: 3, complexity: 'Média' },
          keyRotationTip: 'Use Implosão quando os adds estiverem prestes a morrer para resetar e potencializar os próximos diabretes.'
        }
      ]
    }
  },

  // --- 2. BRUXO SUPLÍCIO (AFFLICTION WARLOCK) ---
  {
    specId: 'affliction',
    specName: 'Bruxo Suplício',
    className: 'Bruxo',
    situations: {
      delve: [
        {
          id: 'aff_delve_solo',
          name: 'Delves Solo T11 & Kindo\'jan (Ceifador de Almas)',
          heroTalent: 'Ceifador de Almas (Soul Harvester)',
          talentCode: 'CkQAAAAAAAAAAAAAAAAAAAAAAwMMzoZzMz2MzYWGAAwMmlZZmZWGDAM22GYATwMsFYYbAAAYAAAYmZmZMjNmxMzMzMMDzMzAAMgB',
          focus: 'Pressão contínua de DoTs com Ceifa Sombria alimentando Semente da Corrupção. Defesa incomparável via Pet Voidwalker e Soulburn + Pedra de Vida.',
          statPriorities: ['Aceleração (28%)', 'Acerto Crítico (27%)', 'Maestria (69%)', 'Versatilidade (4%)'],
          runeCode: 'C24',
          runeCombo: '1A - 2B - 3A - 4D - 5C',
          runeReason: 'Autorrecomposição (2B) cura abaixo de 75%, Guerreiro Versátil (4D) mitiga dano de atrito e Ecos de Poder (5C) replica 50% do dano acumulado após 10 s.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir (331)',
            effect1: 'Forro de Arcanotrama [240167] (+Intelecto ativo quando acima de 80% de vida)',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara (331)',
            effect2: 'Pedra Ritual do Caçador [273060] ou Signo de Negraluna: Sangue [245872] (autocura contínua)'
          },
          consumablesOfficial: {
            flask: 'Frasco da Resistência Talassiana (Defensivo T11) / Frasco dos Cavaleiros Sangrentos',
            potion: 'Poção de Agilidade/Intelecto Efervescente (5 min cd)',
            food: 'Costeletas Temperadas com Peçonha / Prato de Baiacu (+65 Aceleração)',
            oil: 'Óleo de Fênix Talassiano (Dano Sagrado/Fogo)',
            rune: 'Runa de Aprimoramento Cristalina'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Crânio do Necrólito Maldito', itemEn: 'Skull of the Damned Necrolyte', id: 271546, icon: 'inv_helm_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst / Great Vault', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc/5pc.' },
            { slot: 'Pescoço', itemPt: 'Feixe de Presas Protetoras', itemEn: 'Clasp of Protective Fangs', id: 273781, icon: 'inv_jewelry_necklace_73', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'Crí 240 · Ace 182: melhor pescoço fora de raide.' },
            { slot: 'Ombros', itemPt: 'Pináculos do Necrólito Maldito', itemEn: 'Spires of the Damned Necrolyte', id: 271544, icon: 'inv_shoulder_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Costas', itemPt: 'Mortalha Sedosa do Seguidor', itemEn: "Adherent's Silken Shroud", id: 239656, icon: 'inv_cape_cloth_raidpriestmythic_q_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Missiva Aceleração + Maestria.' },
            { slot: 'Torso', itemPt: 'Vestes Chacoalhantes do Necrólito Maldito', itemEn: "Damned Necrolyte's Rattling Robes", id: 271549, icon: 'inv_chest_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça central do tier 4pc.' },
            { slot: 'Pulsos', itemPt: 'Braceletes do Mártir', itemEn: "Martyr's Bindings", id: 239648, icon: 'inv_bracer_cloth_raidpriestmythic_q_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha + 80 Cristas Míticas)', roleTag: 'Embelezamento Artesanal', notes: 'Com Forro de Arcanotrama (240167).' },
            { slot: 'Mãos', itemPt: 'Agarres Calcinados do Necrólito Maldito', itemEn: "Damned Necrolyte's Charred Grasps", id: 271547, icon: 'inv_glove_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Cintura', itemPt: 'Banda do Mártir', itemEn: "Martyr's Waistwrap", id: 239649, icon: 'inv_cloth_raidpriestmythic_q_01_belt', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Maestria e Aceleração.' },
            { slot: 'Pernas', itemPt: 'Amarras de Perna do Necrólito Maldito', itemEn: "Damned Necrolyte's Leg Bindings", id: 271545, icon: 'inv_pant_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Pés', itemPt: 'Sapatilhas do Mártir', itemEn: "Martyr's Slippers", id: 239654, icon: 'inv_cloth_raidpriestmythic_q_01_boot', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Secundários perfeitos via Missiva.' },
            { slot: 'Anel 1', itemPt: 'Elo do Senhor da Guerra Amani', itemEn: "Amani Warlord's Band", id: 273792, icon: 'inv_jewelry_ring_71', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'Acessório BiS', notes: 'Teto forjado M+ 341.' },
            { slot: 'Anel 2', itemPt: 'Elo Sin\'dorei Magistral', itemEn: 'Masterwork Sin\'dorei Band', id: 240949, icon: 'inv_jewelry_ring_84', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Joalheria (Centelha)', roleTag: 'Acessório BiS', notes: 'Engaste prismático garantido.' },
            { slot: 'Berloque 1', itemPt: 'Ampola Torpe de Peçonha Volátil', itemEn: 'Vile Vial of Volatile Venom', id: 273796, icon: 'inv_potion_52', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'On-use +992 de secundário por 15 s.' },
            { slot: 'Berloque 2', itemPt: 'Rocha Marinha do Clamaondas', itemEn: "Wavecaller's Seastone", id: 270167, icon: 'inv_elemental_motes_water', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Costa das Ondas', roleTag: 'BiS Direto', notes: 'Passivo Aceleração e Intelecto acumulativo.' },
            { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido', itemEn: 'Polished Glowlight Channeler', id: 273778, icon: 'inv_wand_1h_arathor_d_01', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'Ace +58 / Mae +46; proc sagrado em área com amplificação por alvo.' },
            { slot: 'Mão Secundária', itemPt: 'Lanterna de Aln\'hara', itemEn: 'Aln\'hara Lantern', id: 245769, icon: 'inv_offhand_1h_arathor_d_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Escrivania (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Leva Pedra Ritual do Caçador (273060) ou Signo de Sangue.' }
          ],
          ratings: { singleTarget: 4, aoe: 5, survivability: 5, mobility: 3, complexity: 'Média' },
          keyRotationTip: 'Arme o Círculo Demoníaco antes do combate. Aplique Agonia e Corrupção, ative Ceifa Sombria e use Soulburn + Pedra de Vida antes do Pacto Sombrio para escudo máximo.'
        }
      ],
      mplus: [
        {
          id: 'aff_mplus_aoe',
          name: 'Míticas+ & AoE de Chave Alta (Ceifador de Almas)',
          heroTalent: 'Ceifador de Almas (Soul Harvester)',
          talentCode: 'CkQAAAAAAAAAAAAAAAAAAAAAAwMMzoZzMz2MzYWGAAwMmlZZmZWGDAM22GYATwMsFYYbAAAYAAAYmZmZMjNmxMzMzMMDzMzAAMgB',
          focus: 'Detonação contínua de Semente da Corrupção em pulls agrupados. O 4pc do tier 2066 aplica Agonia Instável com 20% de eficácia no alvo principal, matando o mob prioritário durante o AoE.',
          statPriorities: ['Aceleração (28%)', 'Acerto Crítico (27%)', 'Maestria (69%)', 'Versatilidade (4%)'],
          runeCode: 'C29',
          runeCombo: '1A - 2C - 3A - 4B - 5B',
          runeReason: 'Reflexos de Lince (2C) concede velocidade explosiva ao tomar dano e Energia Residual (5B) potencializa todo o dano periódico em área.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir (331)',
            effect1: 'Forro de Arcanotrama [240167] (+Intelecto ativo)',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara (331)',
            effect2: 'Pedra Ritual do Caçador [273060] (+101 secundário)'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Cavaleiros Sangrentos',
            potion: 'Poção de Intelecto Efervescente',
            food: 'Costeletas Temperadas com Peçonha (+65 Aceleração)',
            oil: 'Óleo de Fênix Talassiano',
            rune: 'Runa de Aprimoramento Cristalina'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Crânio do Necrólito Maldito', itemEn: 'Skull of the Damned Necrolyte', id: 271546, icon: 'inv_helm_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst / Great Vault', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Pescoço', itemPt: 'Feixe de Presas Protetoras', itemEn: 'Clasp of Protective Fangs', id: 273781, icon: 'inv_jewelry_necklace_73', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'Crí 240 · Ace 182.' },
            { slot: 'Ombros', itemPt: 'Pináculos do Necrólito Maldito', itemEn: 'Spires of the Damned Necrolyte', id: 271544, icon: 'inv_shoulder_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Costas', itemPt: 'Mortalha Sedosa do Seguidor', itemEn: "Adherent's Silken Shroud", id: 239656, icon: 'inv_cape_cloth_raidpriestmythic_q_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Missiva Aceleração + Maestria.' },
            { slot: 'Torso', itemPt: 'Vestes Chacoalhantes do Necrólito Maldito', itemEn: "Damned Necrolyte's Rattling Robes", id: 271549, icon: 'inv_chest_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça central do tier 4pc.' },
            { slot: 'Pulsos', itemPt: 'Braceletes do Mártir', itemEn: "Martyr's Bindings", id: 239648, icon: 'inv_bracer_cloth_raidpriestmythic_q_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha + 80 Cristas Míticas)', roleTag: 'Embelezamento Artesanal', notes: 'Com Forro de Arcanotrama (240167).' },
            { slot: 'Mãos', itemPt: 'Agarres Calcinados do Necrólito Maldito', itemEn: "Damned Necrolyte's Charred Grasps", id: 271547, icon: 'inv_glove_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Cintura', itemPt: 'Banda do Mártir', itemEn: "Martyr's Waistwrap", id: 239649, icon: 'inv_cloth_raidpriestmythic_q_01_belt', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Maestria e Aceleração.' },
            { slot: 'Pernas', itemPt: 'Amarras de Perna do Necrólito Maldito', itemEn: "Damned Necrolyte's Leg Bindings", id: 271545, icon: 'inv_pant_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Pés', itemPt: 'Sapatilhas do Mártir', itemEn: "Martyr's Slippers", id: 239654, icon: 'inv_cloth_raidpriestmythic_q_01_boot', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Secundários sob medida.' },
            { slot: 'Anel 1', itemPt: 'Elo do Senhor da Guerra Amani', itemEn: "Amani Warlord's Band", id: 273792, icon: 'inv_jewelry_ring_71', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'Acessório BiS', notes: 'Teto forjado M+ 341.' },
            { slot: 'Anel 2', itemPt: 'Elo Sin\'dorei Magistral', itemEn: 'Masterwork Sin\'dorei Band', id: 240949, icon: 'inv_jewelry_ring_84', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Joalheria (Centelha)', roleTag: 'Acessório BiS', notes: 'Engaste prismático.' },
            { slot: 'Berloque 1', itemPt: 'Ampola Torpe de Peçonha Volátil', itemEn: 'Vile Vial of Volatile Venom', id: 273796, icon: 'inv_potion_52', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'On-use de dano massivo.' },
            { slot: 'Berloque 2', itemPt: 'Rocha Marinha do Clamaondas', itemEn: "Wavecaller's Seastone", id: 270167, icon: 'inv_elemental_motes_water', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Costa das Ondas', roleTag: 'BiS Direto', notes: 'Passivo constante de Intelecto.' },
            { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido', itemEn: 'Polished Glowlight Channeler', id: 273778, icon: 'inv_wand_1h_arathor_d_01', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'Proc em área com amplificação por alvo adicional.' },
            { slot: 'Mão Secundária', itemPt: 'Lanterna de Aln\'hara', itemEn: 'Aln\'hara Lantern', id: 245769, icon: 'inv_offhand_1h_arathor_d_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Escrivania (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Leva Pedra Ritual do Caçador.' }
          ],
          ratings: { singleTarget: 4, aoe: 5, survivability: 4, mobility: 4, complexity: 'Média' },
          keyRotationTip: 'Mantenha Agonia em todos os alvos do pack para geração imparável de Estilhaços de Alma. Gaste em Semente da Corrupção e execute o alvo maior com Agonia Instável fortalecida.'
        }
      ],
      raid: [
        {
          id: 'aff_raid_hellcaller',
          name: 'Raide Alvo Único (Saqueador do Inferno)',
          heroTalent: 'Saqueador do Inferno (Hellcaller)',
          talentCode: 'CkQAAAAAAAAAAAAAAAAAAAAAAwMzMzoZhhZmZmlBAAYmZZWmZmlxAAWgBmFjGzAysAWGAAAmBAAmZAzMjxYGmZMzMGMzMzAAmBG',
          focus: 'Dano supremo sustentado de alvo único via Murchar (Wither) acumulando em alinhamento com Malevolência e Olhar Sombrio.',
          statPriorities: ['Aceleração (28%)', 'Acerto Crítico (27%)', 'Maestria (69%)', 'Versatilidade (4%)'],
          runeCode: 'C13',
          runeCombo: '1A - 2B - 3A - 4A - 5A',
          runeReason: 'Fogo Incontido (1A) + Autorrecomposição (2B) + Perenidade (3A) + Poder Crítico (4A) + Sobrecarga (5A). Configuração padrão de alvo único da classe.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir (331)',
            effect1: 'Forro de Arcanotrama [240167] (+Intelecto ativo)',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara (331)',
            effect2: 'Pedra Ritual do Caçador [273060] (+101 secundário)'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Cavaleiros Sangrentos',
            potion: 'Poção de Intelecto Efervescente',
            food: 'Costeletas Temperadas com Peçonha (+65 Aceleração)',
            oil: 'Óleo de Fênix Talassiano',
            rune: 'Runa Vantus [272195] (+162 Versatilidade na Raide)'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Crânio do Necrólito Maldito', itemEn: 'Skull of the Damned Necrolyte', id: 271546, icon: 'inv_helm_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Pescoço', itemPt: 'Relicário Aqiricida', itemEn: 'Aqirbane Reliquary', id: 268265, icon: 'inv_jewelry_necklace_73', heroIlvl: 328, mythIlvl: 344, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Ula\'tek)', roleTag: 'BiS Direto', notes: '107 em todos os 4 secundários + proc +434.' },
            { slot: 'Ombros', itemPt: 'Pináculos do Necrólito Maldito', itemEn: 'Spires of the Damned Necrolyte', id: 271544, icon: 'inv_shoulder_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Costas', itemPt: 'Mortalha Sedosa do Seguidor', itemEn: "Adherent's Silken Shroud", id: 239656, icon: 'inv_cape_cloth_raidpriestmythic_q_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Missiva Aceleração + Maestria.' },
            { slot: 'Torso', itemPt: 'Vestes Chacoalhantes do Necrólito Maldito', itemEn: "Damned Necrolyte's Rattling Robes", id: 271549, icon: 'inv_chest_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Peça central do tier 4pc.' },
            { slot: 'Pulsos', itemPt: 'Braceletes do Mártir', itemEn: "Martyr's Bindings", id: 239648, icon: 'inv_bracer_cloth_raidpriestmythic_q_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha + 80 Cristas Míticas)', roleTag: 'Embelezamento Artesanal', notes: 'Com Forro de Arcanotrama (240167).' },
            { slot: 'Mãos', itemPt: 'Agarres Calcinados do Necrólito Maldito', itemEn: "Damned Necrolyte's Charred Grasps", id: 271547, icon: 'inv_glove_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Cintura', itemPt: 'Banda do Mártir', itemEn: "Martyr's Waistwrap", id: 239649, icon: 'inv_cloth_raidpriestmythic_q_01_belt', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Maestria e Aceleração.' },
            { slot: 'Pernas', itemPt: 'Amarras de Perna do Necrólito Maldito', itemEn: "Damned Necrolyte's Leg Bindings", id: 271545, icon: 'inv_pant_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Pés', itemPt: 'Solas do Necrólito Maldito', itemEn: "Damned Necrolyte's Soles", id: 271548, icon: 'inv_cloth_raidpriestmythic_q_01_boot', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Aceleração 106 / Maestria 53.' },
            { slot: 'Anel 1', itemPt: 'Elo do Chama-enxame', itemEn: 'Band of the Swarmcaller', id: 281029, icon: 'inv_jewelry_ring_70', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Kith\'ix)', roleTag: 'BiS Direto', notes: 'Ace 110 · Mae 295.' },
            { slot: 'Anel 2', itemPt: 'Elo Sin\'dorei Magistral', itemEn: 'Masterwork Sin\'dorei Band', id: 240949, icon: 'inv_jewelry_ring_84', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Joalheria (Centelha)', roleTag: 'Acessório BiS', notes: 'Engaste prismático garantido.' },
            { slot: 'Berloque 1', itemPt: 'Tentáculo do Terror Pervertido', itemEn: "Twisted Horror's Tendril", id: 281215, icon: 'inv_misc_monsterspidercarapace_01', heroIlvl: 328, mythIlvl: 341, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Kith\'ix)', roleTag: 'BiS Direto', notes: 'Acumula Poder Devastador (+35 Crítico).' },
            { slot: 'Berloque 2', itemPt: 'Bolsa sem Fundo de Gebbo', itemEn: "Gebbo's Bottomless Bag", id: 270164, icon: 'inv_misc_bag_08', heroIlvl: 328, mythIlvl: 341, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Mor\'zahi)', roleTag: 'Acessório BiS', notes: 'Passivo de artefatos que aumentam secundários.' },
            { slot: 'Arma 1M', itemPt: 'Jan\'thrazet, a Presa Anímica', itemEn: 'Jan\'thrazet, the Soul Fang', id: 271092, icon: 'inv_sword_1h_troll_d_01', heroIlvl: 328, mythIlvl: 344, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Ula\'tek)', roleTag: 'BiS Direto', notes: 'Int 603 · Vig 2.192 · Ace 104 · proc +71 Ace.' },
            { slot: 'Mão Secundária', itemPt: 'Lanterna de Aln\'hara', itemEn: 'Aln\'hara Lantern', id: 245769, icon: 'inv_offhand_1h_arathor_d_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Escrivania (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Leva Pedra Ritual do Caçador.' }
          ],
          ratings: { singleTarget: 5, aoe: 3, survivability: 4, mobility: 3, complexity: 'Alta' },
          keyRotationTip: 'Mantenha Murchar ativo no alvo principal sem deixar cair. Alinhe Malevolência e o Olhar Sombrio com as janelas de poção e acúmulos da Bolsa de Gebbo.'
        }
      ]
    }
  },

  // --- 3. BRUXO DESTRUIÇÃO (DESTRUCTION WARLOCK) ---
  {
    specId: 'destruction',
    specName: 'Bruxo Destruição',
    className: 'Bruxo',
    situations: {
      delve: [
        {
          id: 'destro_delve_solo',
          name: 'Delves Solo & Kindo\'jan (Saqueador do Inferno)',
          heroTalent: 'Saqueador do Inferno (Hellcaller)',
          talentCode: 'CsQAAAAAAAAAAAAAAAAAAAAAAwMjZGNLmxmZGzysZGzsYYZZmBAAzMjZmZxCMwsY0YGAzG2YAAgxMAAAzMYMzMmNAAAzMzMAAMDD',
          focus: 'Dano explosivo em alvo único e sobrevivência via Voidwalker. O 2pc do Tier 2066 aumenta o dano de Incinerar em 25% com +10% de chance de evocar Eco de Sargeras.',
          statPriorities: ['Maestria (65%)', 'Aceleração (23%)', 'Acerto Crítico (27%)', 'Versatilidade (3%)'],
          runeCode: 'C24',
          runeCombo: '1A - 2B - 3A - 4D - 5C',
          runeReason: 'Autorrecomposição (2B) e Guerreiro Versátil (4D) mitigam dano fatal. Ecos de Poder (5C) duplica 50% de todo o dano acumulado na fase de burst.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir (331)',
            effect1: 'Forro de Arcanotrama [240167] (+Intelecto ativo)',
            slot2: 'Cintura',
            item2: 'Banda do Mártir (331)',
            effect2: 'Forro de Arcanotrama [244588] (Segundo efeito cumulativo de Intelecto)'
          },
          consumablesOfficial: {
            flask: 'Frasco da Resistência Talassiana / Frasco dos Cavaleiros Sangrentos',
            potion: 'Poção de Intelecto Efervescente',
            food: 'Costeletas Temperadas com Peçonha (+65 Maestria)',
            oil: 'Óleo de Fênix Talassiano',
            rune: 'Runa de Aprimoramento Cristalina'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Crânio do Necrólito Maldito', itemEn: 'Skull of the Damned Necrolyte', id: 271546, icon: 'inv_helm_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst semanal', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Pescoço', itemPt: 'Feixe de Presas Protetoras', itemEn: 'Clasp of Protective Fangs', id: 273781, icon: 'inv_jewelry_necklace_73', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'Teto forjado M+ 341; Crítico + Aceleração.' },
            { slot: 'Ombros', itemPt: 'Pináculos do Necrólito Maldito', itemEn: 'Spires of the Damned Necrolyte', id: 271544, icon: 'inv_shoulder_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst semanal', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Costas', itemPt: 'Mortalha do Inferninho', itemEn: 'Speakeasy Shroud', id: 251132, icon: 'inv_cape_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Travessa dos Assassinos', roleTag: 'BiS Direto', notes: 'Crítico 66 / Maestria 47.' },
            { slot: 'Torso', itemPt: 'Vestes Chacoalhantes do Necrólito Maldito', itemEn: "Damned Necrolyte's Rattling Robes", id: 271549, icon: 'inv_chest_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst semanal', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça central do conjunto 4pc.' },
            { slot: 'Pulsos', itemPt: 'Braceletes do Mártir', itemEn: "Martyr's Bindings", id: 239648, icon: 'inv_bracer_cloth_raidpriestmythic_q_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Embelezamento 1: Forro de Arcanotrama + Mae/Ace.' },
            { slot: 'Mãos', itemPt: 'Agarres Calcinados do Necrólito Maldito', itemEn: "Damned Necrolyte's Charred Grasps", id: 271547, icon: 'inv_glove_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst semanal', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Cintura', itemPt: 'Banda do Mártir', itemEn: "Martyr's Waistwrap", id: 239649, icon: 'inv_cloth_raidpriestmythic_q_01_belt', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Embelezamento 2: Forro de Arcanotrama + Mae/Ace.' },
            { slot: 'Pernas', itemPt: 'Amarras de Perna do Necrólito Maldito', itemEn: "Damned Necrolyte's Leg Bindings", id: 271545, icon: 'inv_pant_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst semanal', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Pés', itemPt: 'Sapatilhas do Mártir', itemEn: "Martyr's Slippers", id: 239654, icon: 'inv_cloth_raidpriestmythic_q_01_boot', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Maestria + Aceleração via missiva.' },
            { slot: 'Anel 1', itemPt: 'Elo Sin\'dorei Magistral', itemEn: 'Masterwork Sin\'dorei Band', id: 240949, icon: 'inv_jewelry_ring_84', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Joalheria (Centelha)', roleTag: 'Acessório BiS', notes: 'Engaste prismático + Mae/Ace.' },
            { slot: 'Anel 2', itemPt: 'Elo do Senhor da Guerra Amani', itemEn: "Amani Warlord's Band", id: 273792, icon: 'inv_jewelry_ring_71', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'Acessório BiS', notes: 'Teto forjado M+ 341.' },
            { slot: 'Berloque 1', itemPt: 'Emblema Tempestuoso de Dazar', itemEn: "Dazar's Tempestuous Crest", id: 273649, icon: 'inv_misc_ornament_02', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Descanso do Rei', roleTag: 'BiS Direto', notes: 'On-use +1.082 de Maestria por 20 s alinhado ao Infernão.' },
            { slot: 'Berloque 2', itemPt: 'Ampola Torpe de Peçonha Volátil', itemEn: 'Vile Vial of Volatile Venom', id: 273796, icon: 'inv_potion_52', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'On-use +992 de secundário aleatório por 15 s.' },
            { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido', itemEn: 'Polished Glowlight Channeler', id: 273778, icon: 'inv_wand_1h_arathor_d_01', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'Proc de dano sagrado em área; substitui Jan\'thrazet.' },
            { slot: 'Mão Secundária', itemPt: 'Lanterna de Aln\'hara', itemEn: 'Aln\'hara Lantern', id: 245769, icon: 'inv_offhand_1h_arathor_d_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Escrivania (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Atributos personalizáveis Maestria + Aceleração.' }
          ],
          ratings: { singleTarget: 5, aoe: 4, survivability: 4, mobility: 2, complexity: 'Baixa' },
          keyRotationTip: 'Ative Conflagrar para obter o buff de aceleração e lance Seta do Caos. Guarde o Infernão e o Emblema de Dazar para o escudo ou fase letal do chefe.'
        }
      ],
      mplus: [
        {
          id: 'destro_mplus_diabolist',
          name: 'Míticas+ & AoE Explosivo (Diabolista)',
          heroTalent: 'Diabolista (Diabolist)',
          talentCode: 'CsQAAAAAAAAAAAAAAAAAAAAAAwMjZGNLmxmZGzysNzYmFzYZZMAAYGjZmZBMmxwCMw2wCNWYAAgxMMsBgZGgxMjZ2AAAMzMzAAYMM',
          focus: 'Invocação contínua de Demônios Maiores com Chuva de Fogo cobrindo o recinto e Cataclismo aplicando Imolação instantânea.',
          statPriorities: ['Maestria (65%)', 'Aceleração (23%)', 'Acerto Crítico (27%)', 'Versatilidade (3%)'],
          runeCode: 'C02',
          runeCombo: '1A - 2A - 3A - 4A - 5B',
          runeReason: 'Concha Maculada (2A) para absorção ativa durante pulls perigosos e Energia Residual (5B) para derreter pacotes de monstros.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir (331)',
            effect1: 'Forro de Arcanotrama [240167] (+Intelecto ativo)',
            slot2: 'Cintura',
            item2: 'Banda do Mártir (331)',
            effect2: 'Forro de Arcanotrama [244588] (+Intelecto ativo)'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Cavaleiros Sangrentos',
            potion: 'Poção de Intelecto Efervescente',
            food: 'Costeletas Temperadas com Peçonha (+65 Maestria)',
            oil: 'Óleo de Fênix Talassiano',
            rune: 'Runa de Aprimoramento Cristalina'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Crânio do Necrólito Maldito', itemEn: 'Skull of the Damned Necrolyte', id: 271546, icon: 'inv_helm_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst semanal', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Pescoço', itemPt: 'Feixe de Presas Protetoras', itemEn: 'Clasp of Protective Fangs', id: 273781, icon: 'inv_jewelry_necklace_73', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'Crítico + Aceleração.' },
            { slot: 'Ombros', itemPt: 'Pináculos do Necrólito Maldito', itemEn: 'Spires of the Damned Necrolyte', id: 271544, icon: 'inv_shoulder_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst semanal', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Costas', itemPt: 'Mortalha do Inferninho', itemEn: 'Speakeasy Shroud', id: 251132, icon: 'inv_cape_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Travessa dos Assassinos', roleTag: 'BiS Direto', notes: 'Crítico 66 / Maestria 47.' },
            { slot: 'Torso', itemPt: 'Vestes Chacoalhantes do Necrólito Maldito', itemEn: "Damned Necrolyte's Rattling Robes", id: 271549, icon: 'inv_chest_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst semanal', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça central do conjunto 4pc.' },
            { slot: 'Pulsos', itemPt: 'Braceletes do Mártir', itemEn: "Martyr's Bindings", id: 239648, icon: 'inv_bracer_cloth_raidpriestmythic_q_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Forro de Arcanotrama + Mae/Ace.' },
            { slot: 'Mãos', itemPt: 'Agarres Calcinados do Necrólito Maldito', itemEn: "Damned Necrolyte's Charred Grasps", id: 271547, icon: 'inv_glove_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst semanal', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Cintura', itemPt: 'Banda do Mártir', itemEn: "Martyr's Waistwrap", id: 239649, icon: 'inv_cloth_raidpriestmythic_q_01_belt', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Forro de Arcanotrama + Mae/Ace.' },
            { slot: 'Pernas', itemPt: 'Amarras de Perna do Necrólito Maldito', itemEn: "Damned Necrolyte's Leg Bindings", id: 271545, icon: 'inv_pant_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Matrix Catalyst semanal', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Peça do conjunto 4pc.' },
            { slot: 'Pés', itemPt: 'Sapatilhas do Mártir', itemEn: "Martyr's Slippers", id: 239654, icon: 'inv_cloth_raidpriestmythic_q_01_boot', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Missiva Maestria + Aceleração.' },
            { slot: 'Anel 1', itemPt: 'Elo Sin\'dorei Magistral', itemEn: 'Masterwork Sin\'dorei Band', id: 240949, icon: 'inv_jewelry_ring_84', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Joalheria (Centelha)', roleTag: 'Acessório BiS', notes: 'Engaste prismático + Mae/Ace.' },
            { slot: 'Anel 2', itemPt: 'Elo do Senhor da Guerra Amani', itemEn: "Amani Warlord's Band", id: 273792, icon: 'inv_jewelry_ring_71', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'Acessório BiS', notes: 'Teto de masmorra M+ 341.' },
            { slot: 'Berloque 1', itemPt: 'Emblema Tempestuoso de Dazar', itemEn: "Dazar's Tempestuous Crest", id: 273649, icon: 'inv_misc_ornament_02', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Descanso do Rei', roleTag: 'BiS Direto', notes: 'On-use +1.082 Maestria.' },
            { slot: 'Berloque 2', itemPt: 'Ampola Torpe de Peçonha Volátil', itemEn: 'Vile Vial of Volatile Venom', id: 273796, icon: 'inv_potion_52', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'On-use +992 secundário aleatório.' },
            { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido', itemEn: 'Polished Glowlight Channeler', id: 273778, icon: 'inv_wand_1h_arathor_d_01', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas', roleTag: 'BiS Direto', notes: 'Dano sagrado em área.' },
            { slot: 'Mão Secundária', itemPt: 'Lanterna de Aln\'hara', itemEn: 'Aln\'hara Lantern', id: 245769, icon: 'inv_offhand_1h_arathor_d_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Escrivania (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Maestria + Aceleração.' }
          ],
          ratings: { singleTarget: 4, aoe: 5, survivability: 4, mobility: 3, complexity: 'Média' },
          keyRotationTip: 'Abra com Cataclismo para aplicar Imolação em massa. Gaste Fragmentos de Alma freneticamente em Chuvas de Fogo sobrepostas para procs de Diabolista em cadeia.'
        }
      ],
      raid: [
        {
          id: 'destro_raid_hellcaller',
          name: 'Raide Alvo Único (Saqueador do Inferno)',
          heroTalent: 'Saqueador do Inferno (Hellcaller)',
          talentCode: 'CsQAAAAAAAAAAAAAAAAAAAAAAwMmZGNLMzmZmZWmFzMzsYMWMDAAmZGzMziNYgZxoxMAmtYjBAAGDM2AAmZwYGzYDAAwMzMAAMGG',
          focus: 'Dano massivo de alvo único via Seta do Caos e Incinerar buffado pelo 2pc/4pc do tier 2066 (+6% de dano por 6 s após Eco de Sargeras).',
          statPriorities: ['Maestria (65%)', 'Aceleração (23%)', 'Acerto Crítico (27%)', 'Versatilidade (3%)'],
          runeCode: 'C13',
          runeCombo: '1A - 2B - 3A - 4A - 5A',
          runeReason: 'Fogo Incontido + Sobrecarga de dano puro.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir (331)',
            effect1: 'Forro de Arcanotrama [240167] (+Intelecto)',
            slot2: 'Cintura',
            item2: 'Banda do Mártir (331)',
            effect2: 'Forro de Arcanotrama [244588] (+Intelecto)'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Cavaleiros Sangrentos',
            potion: 'Poção de Intelecto Efervescente',
            food: 'Costeletas Temperadas com Peçonha (+65 Maestria)',
            oil: 'Óleo de Fênix Talassiano',
            rune: 'Runa Vantus [272195]'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Crânio do Necrólito Maldito', itemEn: 'Skull of the Damned Necrolyte', id: 271546, icon: 'inv_helm_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Peça de tier 4pc.' },
            { slot: 'Pescoço', itemPt: 'Relicário Aqiricida', itemEn: 'Aqirbane Reliquary', id: 268265, icon: 'inv_jewelry_necklace_73', heroIlvl: 328, mythIlvl: 344, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Ula\'tek)', roleTag: 'BiS Direto', notes: '107 em todos os quatro secundários.' },
            { slot: 'Ombros', itemPt: 'Pináculos do Necrólito Maldito', itemEn: 'Spires of the Damned Necrolyte', id: 271544, icon: 'inv_shoulder_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Peça de tier 4pc.' },
            { slot: 'Costas', itemPt: 'Mortalha Sedosa do Seguidor', itemEn: "Adherent's Silken Shroud", id: 239656, icon: 'inv_cape_cloth_raidpriestmythic_q_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Upgrade de Secundários', notes: 'Mae + Ace.' },
            { slot: 'Torso', itemPt: 'Vestes Chacoalhantes do Necrólito Maldito', itemEn: "Damned Necrolyte's Rattling Robes", id: 271549, icon: 'inv_chest_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Peça de tier 4pc.' },
            { slot: 'Pulsos', itemPt: 'Braceletes do Mártir', itemEn: "Martyr's Bindings", id: 239648, icon: 'inv_bracer_cloth_raidpriestmythic_q_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Forro de Arcanotrama.' },
            { slot: 'Mãos', itemPt: 'Agarres Calcinados do Necrólito Maldito', itemEn: "Damned Necrolyte's Charred Grasps", id: 271547, icon: 'inv_glove_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Peça de tier 4pc.' },
            { slot: 'Cintura', itemPt: 'Banda do Mártir', itemEn: "Martyr's Waistwrap", id: 239649, icon: 'inv_cloth_raidpriestmythic_q_01_belt', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Alfaiataria (Centelha)', roleTag: 'Embelezamento Artesanal', notes: 'Forro de Arcanotrama.' },
            { slot: 'Pernas', itemPt: 'Amarras de Perna do Necrólito Maldito', itemEn: "Damned Necrolyte's Leg Bindings", id: 271545, icon: 'inv_pant_cloth_raidpriestmythic_q_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Peça de tier 4pc.' },
            { slot: 'Pés', itemPt: 'Solas do Necrólito Maldito', itemEn: "Damned Necrolyte's Soles", id: 271548, icon: 'inv_cloth_raidpriestmythic_q_01_boot', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'Ace 106 / Mae 53.' },
            { slot: 'Anel 1', itemPt: 'Elo do Chama-enxame', itemEn: 'Band of the Swarmcaller', id: 281029, icon: 'inv_jewelry_ring_70', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Kith\'ix)', roleTag: 'BiS Direto', notes: 'Ace 110 · Mae 295.' },
            { slot: 'Anel 2', itemPt: 'Elo Sin\'dorei Magistral', itemEn: 'Masterwork Sin\'dorei Band', id: 240949, icon: 'inv_jewelry_ring_84', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Profissão: Joalheria (Centelha)', roleTag: 'Acessório BiS', notes: 'Engaste prismático.' },
            { slot: 'Berloque 1', itemPt: 'Bolsa sem Fundo de Gebbo', itemEn: "Gebbo's Bottomless Bag", id: 270164, icon: 'inv_misc_bag_08', heroIlvl: 328, mythIlvl: 341, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Mor\'zahi)', roleTag: 'Acessório BiS', notes: 'Passivo proc de artefatos.' },
            { slot: 'Berloque 2', itemPt: 'Tentáculo do Terror Pervertido', itemEn: "Twisted Horror's Tendril", id: 281215, icon: 'inv_misc_monsterspidercarapace_01', heroIlvl: 328, mythIlvl: 341, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Kith\'ix)', roleTag: 'BiS Direto', notes: 'Acumula Crítico.' },
            { slot: 'Arma 1M', itemPt: 'Jan\'thrazet, a Presa Anímica', itemEn: 'Jan\'thrazet, the Soul Fang', id: 271092, icon: 'inv_sword_1h_troll_d_01', heroIlvl: 328, mythIlvl: 344, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Ula\'tek)', roleTag: 'BiS Direto', notes: 'Int 603 · Vig 2.192 · Ace 104.' },
            { slot: 'Mão Secundária', itemPt: 'Espinha do Abismo Sibilante', itemEn: 'Spine of the Hissing Abyss', id: 268197, icon: 'inv_offhand_1h_troll_d_01', heroIlvl: 328, mythIlvl: 334, sourceType: 'raid', sourceLocation: 'Raide: Sentinelas Entombadas', roleTag: 'BiS Direto', notes: 'Int 289 · Ace 32 · Mae 68.' }
          ],
          ratings: { singleTarget: 5, aoe: 3, survivability: 4, mobility: 2, complexity: 'Média' },
          keyRotationTip: 'Aproveite o bônus de 6% de dano do 4pc após cada Eco de Sargeras para descarregar Setas do Caos consecutivas.'
        }
      ]
    }
  },

  // --- 4. DRUIDA DO EQUILÍBRIO (BALANCE DRUID) ---
  {
    specId: 'balance',
    specName: 'Druida do Equilíbrio',
    className: 'Druida',
    situations: {
      delve: [
        {
          id: 'balance_delve_solo',
          name: 'Delves Solo & Labirinto de Kindo\'jan',
          heroTalent: 'Guardião do Bosque (Keeper of the Grove)',
          talentCode: 'mB-LLPnNOUUWX04YZbpBUYEJpzbe972mqbYZssU-UWaDJfHNSmADJMMUww8yw8kTsYAixNB-AAAA-FGQYcgkUpBYQmF-',
          focus: 'Invocação rápida de Treants para absorver dano direto de elites, autocura em Forma de Urso e mobilidade contínua',
          statPriorities: ['Aceleração (30%+)', 'Maestria (42%+)', 'Versatilidade (10%+)', 'Crítico (16%)'],
          runeCode: 'C26',
          runeCombo: '1A - 2C - 3A - 4A - 5B',
          runeReason: 'Reflexos de Lince (2C) concede +77,5 de velocidade ao ser atingido para kiting entre colunas. Energia Residual (5B) potencializa Fogo Solar e Lunar.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Defletores do Agente de Luaprata [244576] (Couraria)',
            effect1: 'Forro de Arcanotrama [240167] (+Intelecto com vida alta)',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769] (Escrivania)',
            effect2: 'Signo de Negraluna: Sangue [240170] (Dano contínuo e drenagem de vida para sustentação solo)'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Magísteres [241323] (+Intelecto)',
            potion: 'Poção de Vida de Luaprata Concentrada [271883]',
            food: 'Espetinhos Brilhantes [242281] (+65 Aceleração)',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Capuz do Porta-voz Sobressalente', itemEn: 'Spare Speaker Hood', id: 273791, icon: 'inv_helm_leather_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Converte em Elmo de Tier 2057 no Catalisador Matriz' },
            { slot: 'Ombros', itemPt: 'Espaldares de Couro de Cobra', itemEn: 'Snakeskin Spaulders', id: 273774, icon: 'inv_shoulder_leather_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Converte em Ombros de Tier 2057 (2pc: +20% Surto Estelar)' },
            { slot: 'Peitoral', itemPt: 'Colete da Adoração Reverente', itemEn: 'Vest of Reverent Worship', id: 239048, icon: 'inv_chest_leather_zandalardungeon_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Repouso do Rei (King\'s Rest)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Converte em Peitoral 4pc (+10% dano em Eclipse)' },
            { slot: 'Pulsos', itemPt: 'Defletores do Agente de Luaprata', itemEn: "Silvermoon Agent's Deflectors", id: 244576, icon: 'inv_bracer_leather_dungeonharronir_c_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Couraria (Centelha de Marés)', roleTag: 'Embelezamento Artesanal', notes: 'Embelezamento 1: Forro de Arcanotrama [240167]' },
            { slot: 'Mãos', itemPt: 'Manoplas da Defesa Febril', itemEn: 'Fevered Defense Grips', id: 251124, icon: 'inv_glove_leather_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Converte em Luvas de Tier 2057' },
            { slot: 'Cinto', itemPt: 'Faixa do Dervixe Giratório', itemEn: 'Whirling Dervish Sash', id: 159317, icon: 'inv_belt_leather_zandalardungeon_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Templo de Sethraliss (Temple of Sethraliss)', roleTag: 'Upgrade de Secundários', notes: 'Aceleração + Maestria' },
            { slot: 'Pernas', itemPt: 'Calções do Acordo Célere', itemEn: 'Swift Accord Breeches', id: 251130, icon: 'inv_pant_leather_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Fecha o 4pc de Tier 2057 no Catalisador' },
            { slot: 'Botas', itemPt: 'Calçados do Agente de Luaprata', itemEn: "Silvermoon Agent's Sneakers", id: 244569, icon: 'inv_boot_leather_outdooramaniloa_c_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Couraria (Centelha de Marés)', roleTag: 'Upgrade de Secundários', notes: 'Missiva Febre Ardente (Aceleração + Maestria)' },
            { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido', itemEn: 'Gleamline Channeller', id: 273778, icon: 'inv_knife_1h_zuljin_d_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: '1H Intelecto para druida (1H + Lanterna é superior a cajado)' },
            { slot: 'Mão Sec.', itemPt: 'Lanterna de Aln\'hara', itemEn: "Aln'hara Lantern", id: 245769, icon: 'inv_offhand_1h_raidtroll_d_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Escrivania (Centelha de Marés)', roleTag: 'Embelezamento Artesanal', notes: 'Embelezamento 2: Signo de Negraluna: Sangue [240170]' },
            { slot: 'Berloque 1', itemPt: 'Ampola Torpe de Peçonha Volátil', itemEn: 'Vile Flask of Volatile Venom', id: 273796, icon: 'inv_121_trinket_dungeon_ulatek_vile', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Melhor berloque on-use de M+: +992 secundário por 15 s' },
            { slot: 'Berloque 2', itemPt: 'Nó de Serpentes Contorcidas', itemEn: 'Knot of Writhing Serpents', id: 273794, icon: 'inv_121_trinket_dungeon_ulatek_writhe', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Passivo BiS sem raide' }
          ],
          ratings: { singleTarget: 4, aoe: 5, survivability: 5, mobility: 5, complexity: 'Média' },
          keyRotationTip: 'Guarde a Forma de Urso + Regeneração Frenética para o Gás Asfixiante de Kindo\'jan e utilize Treants para aguentar o soco dos elites.'
        }
      ],
      mplus: [
        {
          id: 'balance_mplus_elune',
          name: 'Masmorras M+ (Escolhido de Eluna - Recomendada)',
          heroTalent: 'Escolhido de Eluna (Elune\'s Chosen)',
          talentCode: 'mB-LLPnNOUWX04EZZbpBUYEpzTdFWeeb7j7MyE-UWaBDHXfEKNSmwwADJZYww8grzrYhKj-AAAA-GKOik0AMggBDxC-',
          focus: 'Dano sustentado de alta densidade, canalizações arcanas e Cascata Estelar passiva',
          statPriorities: ['Aceleração (32%+)', 'Maestria (42%+)', 'Crítico (18%)', 'Versatilidade (8%)'],
          runeCode: 'C29',
          runeCombo: '1A - 2C - 3A - 4B - 5B',
          runeReason: 'Reflexos de Lince (2C) para mobilidade entre mecânicas e Maestria elevada para Surto/Chuva Estelar.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Defletores do Agente de Luaprata [244576] (Couraria)',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769] (Escrivania)',
            effect2: 'Segundo Forro de Arcanotrama [240167]'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Magísteres [241323]',
            potion: 'Poção da Imprudência [241289]',
            food: 'Espetinhos Brilhantes [242281]',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Capuz do Porta-voz Sobressalente', itemEn: 'Spare Speaker Hood', id: 273791, icon: 'inv_helm_leather_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Converte em Tier 2057' },
            { slot: 'Costas', itemPt: 'Mortalha do Inferninho', itemEn: 'Speakeasy Shroud', id: 251132, icon: 'inv_cape_leather_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row)', roleTag: 'BiS Direto', notes: 'BiS de M+ sem raide para Costas' },
            { slot: 'Botas', itemPt: 'Calçados do Agente de Luaprata', itemEn: "Silvermoon Agent's Sneakers", id: 244569, icon: 'inv_boot_leather_outdooramaniloa_c_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Couraria (Centelha de Marés)', roleTag: 'Upgrade de Secundários', notes: 'Missiva Febre Ardente (Mae/Ace)' },
            { slot: 'Berloque 1', itemPt: 'Ampola Torpe de Peçonha Volátil', itemEn: 'Vile Flask of Volatile Venom', id: 273796, icon: 'inv_121_trinket_dungeon_ulatek_vile', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Melhor berloque de M+' },
            { slot: 'Berloque 2', itemPt: 'Nó de Serpentes Contorcidas', itemEn: 'Knot of Writhing Serpents', id: 273794, icon: 'inv_121_trinket_dungeon_ulatek_writhe', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Passivo BiS de Intelecto' }
          ],
          ratings: { singleTarget: 4, aoe: 5, survivability: 4, mobility: 4, complexity: 'Média' },
          keyRotationTip: 'Mantenha Chuva Estelar ativa em todos os pulls de múltiplos alvos e use Alinhamento Celestial logo na abertura.'
        },
        {
          id: 'balance_mplus_grove',
          name: 'Masmorras M+ Burst Rápido (Guardião do Bosque)',
          heroTalent: 'Guardião do Bosque (Keeper of the Grove)',
          talentCode: 'mB-LLPnNOUWX04YZbpBUYEJpzTdFWeeb7jbsMK-UWaDJHI+IakMtBSywwBDzLDzjKcijFWA-AAAA-GKOik0AIogBDxC-',
          focus: 'Burst veloz em pulls de menor duração e geração acelerada de Força Cósmica',
          statPriorities: ['Aceleração (34%+)', 'Maestria (38%+)', 'Crítico (20%)', 'Versatilidade (8%)'],
          runeCode: 'C10',
          runeCombo: '1A - 2A - 3A - 4D - 5A',
          runeReason: 'Versatilidade (4D) garante mitigação constante em chaves altas (+10) com Concha Maculada.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Defletores do Agente de Luaprata [244576]',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769]',
            effect2: 'Signo de Negraluna: Sangue [240170]'
          },
          consumablesOfficial: {
            flask: 'Frasco da Resistência Talassiana',
            potion: 'Poção da Imprudência [241289]',
            food: 'Espetinhos Brilhantes [242281]',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Berloque 1', itemPt: 'Ampola Torpe de Peçonha Volátil', itemEn: 'Vile Flask of Volatile Venom', id: 273796, icon: 'inv_121_trinket_dungeon_ulatek_vile', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Rank 1 Murlok para Druida' },
            { slot: 'Berloque 2', itemPt: 'Nó de Serpentes Contorcidas', itemEn: 'Knot of Writhing Serpents', id: 273794, icon: 'inv_121_trinket_dungeon_ulatek_writhe', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Passivo BiS de Intelecto' }
          ],
          ratings: { singleTarget: 3, aoe: 5, survivability: 4, mobility: 4, complexity: 'Baixa' },
          keyRotationTip: 'Use Tufão e Vórtice de Ursol para interromper conjuradores fora do alcance do grupo.'
        }
      ],
      raid: [
        {
          id: 'balance_raid_elune',
          name: 'Raide Alvo Único (Escolhido de Eluna)',
          heroTalent: 'Escolhido de Eluna (Elune\'s Chosen)',
          talentCode: 'mB-LLPnNOUUWX04EZbpBUYEpzbebTd1NsMW2nU-UWaBDIS+ESo0IZCDbDM0wgh5BnHRgCj-AAAA-FGQYcgkQpBQQmF-',
          focus: 'Dano sustentado máximo com Surto Estelar e rotação de Eclipse otimizada',
          statPriorities: ['Maestria (44%+)', 'Aceleração (32%+)', 'Crítico (18%)', 'Versatilidade (6%)'],
          runeCode: 'C13',
          runeCombo: '1A - 2B - 3A - 4A - 5A',
          runeReason: 'Fogo Incontido + Autorrecomposição + Perenidade + Poder Crítico + Sobrecarga (Confirmado Icy Veins 12.1.5).',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Defletores do Agente de Luaprata [244576]',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769]',
            effect2: 'Segundo Forro de Arcanotrama [240167]'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Magísteres [241323]',
            potion: 'Poção da Imprudência [241289]',
            food: 'Espetinhos Brilhantes [242281]',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Arma 1M', itemPt: 'Jan\'thrazet, a Presa Anímica', itemEn: "Jan'thrazet, the Soul Fang", id: 271092, icon: 'inv_sword_1h_raidtroll_d_01', heroIlvl: 328, mythIlvl: 344, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: 'BiS Universal: Cantrip +71 Aceleração' },
            { slot: 'Berloque 1', itemPt: 'Tentáculo do Terror Pervertido', itemEn: "Twisted Horror's Tendril", id: 281215, icon: 'inv_misc_monsterspidercarapace_01', heroIlvl: 328, mythIlvl: 341, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Kith\'ix)', roleTag: 'BiS Direto', notes: 'Passivo BiS: +35 Crítico por 15s (acumula)' },
            { slot: 'Berloque 2', itemPt: 'Bolsa sem Fundo de Gebbo', itemEn: "Gebbo's Bottomless Bag", id: 270164, icon: 'inv_misc_bag_08', heroIlvl: 328, mythIlvl: 341, sourceType: 'raid', sourceLocation: 'Raide: Exploradores Perdidos', roleTag: 'BiS Direto', notes: 'Sorteio de atributos secundários' }
          ],
          ratings: { singleTarget: 5, aoe: 3, survivability: 4, mobility: 3, complexity: 'Média' },
          keyRotationTip: 'Aproveite o bônus de 4 peças: 10% a mais de dano no início e no final de cada Eclipse.'
        }
      ]
    }
  },

  // --- 3. SACERDOTE DAS SOMBRAS (SHADOW PRIEST) ---
  {
    specId: 'shadow',
    specName: 'Sacerdote das Sombras',
    className: 'Sacerdote',
    situations: {
      delve: [
        {
          id: 'shadow_delve_solo',
          name: 'Delves Solo (Tecelão do Vazio - Voidweaver)',
          heroTalent: 'Tecelão do Vazio (Voidweaver)',
          talentCode: 'CIQAAAAAAAAAAAAAAAAAAAAAAMMDDAAAAAAAAAAAAmZxMmZbmxMzyMzYmx2MYmZmZDZGLb0AMzMDAEgZb2WAzGDAMwMzMzMbMDmZ',
          focus: 'Burst rápido de Fenda Entrópica, controle solo e cura contínua via Abraço Vampírico',
          statPriorities: ['Aceleração (34%+)', 'Maestria (40%+)', 'Crítico (18%)', 'Versatilidade (8%)'],
          runeCode: 'C57',
          runeCombo: '1B - 2B - 3A - 4C - 5C',
          runeReason: 'Defesa com eco: proteção máxima para Delves Tier 11, mitigando o dano de mecânicas pesadas.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir [239648] (Alfaiataria)',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Mão Secundária / Cinto',
            item2: 'Lanterna de Aln\'hara [245769] ou Banda do Mártir [239649]',
            effect2: 'Signo de Negraluna: Sangue [240170] (Leech passivo)'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Magísteres [241323]',
            potion: 'Poção de Vida de Luaprata Concentrada [271883]',
            food: 'Espetinhos Brilhantes [242281]',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Cabeça', itemPt: 'Visão Verdadeira do Penitente Cósmico', itemEn: "Cosmic Penitent's Truesight", id: 271555, icon: 'inv_helm_cloth_zandalardungeon_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'catalyst', sourceLocation: 'Catalisador Matriz (Tier 2063)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Bônus 2pc: Praga Devoradora tem 10% de chance de custo zero' },
            { slot: 'Ombros', itemPt: 'Dragonas da Ascensão Cerimonial', itemEn: 'Mantle of Ceremonial Ascension', id: 239045, icon: 'inv_shoulder_cloth_zandalardungeon_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Repouso do Rei (King\'s Rest)', roleTag: 'BiS Direto', notes: 'BiS de M+ sem raide (ombros livres fora do tier · Aceleração + Maestria)' },
            { slot: 'Peitoral', itemPt: 'Veste de Ritos Primordial', itemEn: 'Primordial Ritual Robes', id: 273785, icon: 'inv_robe_cloth_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Converte em Vestes Eclipsantes [271558] no Catalisador' },
            { slot: 'Mãos', itemPt: 'Mitenes de Ritos Blasfemos', itemEn: 'Blasphemous Ritual Mitts', id: 273773, icon: 'inv_glove_cloth_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Converte em Guantes Celestiais [271556] no Catalisador' },
            { slot: 'Pernas', itemPt: 'Perneiras de Serpentes Entrelaçadas', itemEn: 'Entwined Serpent Leggings', id: 273786, icon: 'inv_pant_cloth_outdooramaniloa_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'Matéria de Tier (Catalisador)', notes: 'Fecha 4pc (+20% dano de Impacto Mental e Aparições +10%)' },
            { slot: 'Pulsos', itemPt: 'Braceletes do Mártir', itemEn: "Martyr's Bindings", id: 239648, icon: 'inv_bracer_cloth_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Alfaiataria (Centelha de Marés)', roleTag: 'Embelezamento Artesanal', notes: 'Forro de Arcanotrama [240167]' },
            { slot: 'Cinto', itemPt: 'Atadura do Éter Etérea', itemEn: 'Ethereal Netherwrap', id: 251222, icon: 'inv_belt_cloth_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Arena da Chaga do Caos (Voidscar Arena)', roleTag: 'BiS Direto', notes: 'BiS Aceleração 95 · Crítico 56' },
            { slot: 'Capa', itemPt: 'Mortalha do Inferninho', itemEn: 'Speakeasy Shroud', id: 251132, icon: 'inv_cape_leather_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row)', roleTag: 'BiS Direto', notes: 'BiS Capa da Temporada 2' },
            { slot: 'Arma 1M', itemPt: 'Canalizador de Lumineira Polido', itemEn: 'Gleamline Channeller', id: 273778, icon: 'inv_knife_1h_zuljin_d_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Adaga de Intelecto · Aceleração + Maestria' },
            { slot: 'Mão Sec.', itemPt: 'Lanterna de Aln\'hara', itemEn: "Aln'hara Lantern", id: 245769, icon: 'inv_offhand_1h_raidtroll_d_01', heroIlvl: 318, mythIlvl: 331, sourceType: 'craft', sourceLocation: 'Ordem de Criação: Escrivania (Centelha de Marés)', roleTag: 'Embelezamento Artesanal', notes: 'Signo de Negraluna: Sangue [240170]' },
            { slot: 'Berloque 1', itemPt: 'Ampola Torpe de Peçonha Volátil', itemEn: 'Vile Flask of Volatile Venom', id: 273796, icon: 'inv_121_trinket_dungeon_ulatek_vile', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Melhor berloque de burst ativo em M+' },
            { slot: 'Berloque 2', itemPt: 'Nó de Serpentes Contorcidas', itemEn: 'Knot of Writhing Serpents', id: 273794, icon: 'inv_121_trinket_dungeon_ulatek_writhe', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Passivo BiS constante de Intelecto' }
          ],
          ratings: { singleTarget: 4, aoe: 5, survivability: 4, mobility: 3, complexity: 'Média' },
          keyRotationTip: 'Ative Fenda Entrópica e conjure Impacto do Vazio para amplificar os acertos das Aparições Sombrias geradas.'
        }
      ],
      mplus: [
        {
          id: 'shadow_mplus_void',
          name: 'M+ Área & Burst Rápido (Tecelão do Vazio)',
          heroTalent: 'Tecelão do Vazio (Voidweaver)',
          talentCode: 'CIQAR03Gt7xPmcDNOjs2Zlb3yOMjZGAAAAAAAAAAAghZxMGbzMmZWmZYmx2MGzMzYDZGLmpBYmZGAIAz2stEMbMAwgxMzMmtxMYm',
          focus: 'Burst massivo em pacotes grandes onde os monstros morrem em menos de 25s',
          statPriorities: ['Aceleração (36%+)', 'Maestria (38%+)', 'Crítico (18%)', 'Versatilidade (8%)'],
          runeCode: 'C61',
          runeCombo: '1B - 2C - 3A - 4A - 5A',
          runeReason: 'Esferas + Reflexos de Lince para mobilidade ativa em masmorras.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir [239648]',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Cinto',
            item2: 'Banda do Mártir [239649]',
            effect2: 'Segundo Forro de Arcanotrama [240167]'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Magísteres [241323]',
            potion: 'Poção da Imprudência [241289]',
            food: 'Espetinhos Brilhantes [242281]',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Ombros', itemPt: 'Dragonas da Ascensão Cerimonial', itemEn: 'Mantle of Ceremonial Ascension', id: 239045, icon: 'inv_shoulder_cloth_zandalardungeon_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Repouso do Rei (King\'s Rest)', roleTag: 'BiS Direto', notes: 'BiS fora do tier' },
            { slot: 'Costas', itemPt: 'Mortalha do Inferninho', itemEn: 'Speakeasy Shroud', id: 251132, icon: 'inv_cape_leather_dungeonharronir_c_01', heroIlvl: 321, mythIlvl: 334, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Travessa dos Assassinos (Murder Row)', roleTag: 'BiS Direto', notes: 'BiS de M+' },
            { slot: 'Berloque 1', itemPt: 'Ampola Torpe de Peçonha Volátil', itemEn: 'Vile Flask of Volatile Venom', id: 273796, icon: 'inv_121_trinket_dungeon_ulatek_vile', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Melhor berloque ativo de dano' },
            { slot: 'Berloque 2', itemPt: 'Nó de Serpentes Contorcidas', itemEn: 'Knot of Writhing Serpents', id: 273794, icon: 'inv_121_trinket_dungeon_ulatek_writhe', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Passivo BiS sem raide' }
          ],
          ratings: { singleTarget: 4, aoe: 5, survivability: 3, mobility: 4, complexity: 'Média' },
          keyRotationTip: 'Abra com Fenda Entrópica, aplique Toque Vampírico em área com Explosão Mental e gere Aparições contínuas.'
        },
        {
          id: 'shadow_mplus_archon',
          name: 'M+ Dano Sustentado & Controle (Arconte)',
          heroTalent: 'Arconte (Archon)',
          talentCode: 'CIQAR03Gt7xPmcDNOjs2Zlb3yOMjZGAAAAAAAAAAAghZxMGbzMmZWmZYmx2MGzMzYDZGLmpBYGgZ2MjmNDAZMWAwMAjZmZMbjZ2W',
          focus: 'Dano sustentado prolongado, Halo empoderado e silenciamento em área estendido com Gritos Incessantes',
          statPriorities: ['Aceleração (34%+)', 'Maestria (42%+)', 'Crítico (18%)', 'Versatilidade (6%)'],
          runeCode: 'C46',
          runeCombo: '1B - 2A - 3A - 4D - 5A',
          runeReason: 'Versatilidade defensiva para suportar afixos e dano mágico de grupo.',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir [239648]',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Mão Secundária',
            item2: 'Lanterna de Aln\'hara [245769]',
            effect2: 'Signo de Negraluna: Sangue [240170]'
          },
          consumablesOfficial: {
            flask: 'Frasco da Resistência Talassiana',
            potion: 'Poção da Imprudência [241289]',
            food: 'Espetinhos Brilhantes [242281]',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Berloque 1', itemPt: 'Emblema Tempestuoso de Dazar', itemEn: 'Stormbound Emblem of Dazar', id: 273649, icon: 'inv_7_0raid_necklace_14a', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Repouso do Rei (King\'s Rest)', roleTag: 'BiS Direto', notes: 'Ativo Tier S sem raide' },
            { slot: 'Berloque 2', itemPt: 'Nó de Serpentes Contorcidas', itemEn: 'Knot of Writhing Serpents', id: 273794, icon: 'inv_121_trinket_dungeon_ulatek_writhe', heroIlvl: 328, mythIlvl: 341, sourceType: 'mplus', sourceLocation: 'Masmorra M+: Altar das Presas (Altar of Fangs)', roleTag: 'BiS Direto', notes: 'Passivo BiS de Intelecto' }
          ],
          ratings: { singleTarget: 5, aoe: 4, survivability: 4, mobility: 3, complexity: 'Alta' },
          keyRotationTip: 'Use Gritos Incessantes em pulls com múltiplos conjuradores para travar o cast inimigo.'
        }
      ],
      raid: [
        {
          id: 'shadow_raid_archon',
          name: 'Raide Alvo Único (Arconte - Archon Padrão)',
          heroTalent: 'Arconte (Archon)',
          talentCode: 'CIQAAAAAAAAAAAAAAAAAAAAAAMMDDAAAAAAAAAAAAmZxMmZbmxMzyMzYmx2MYmZmZDZGLb0AMzMDAEgZb2WAzGDAMwMzMzMbMDmZ',
          focus: 'Dano sustentado puro de alvo único, sincronizando Halo com a Forma do Vazio',
          statPriorities: ['Aceleração (34%+)', 'Maestria (44%+)', 'Crítico (18%)', 'Versatilidade (4%)'],
          runeCode: 'C13',
          runeCombo: '1A - 2B - 3A - 4A - 5A',
          runeReason: 'Poder Crítico (4A) combate os retornos decrescentes de Aceleração e Maestria no Patch 12.1.5 (Confirmado Icy Veins).',
          embellishmentsSlotDetail: {
            slot1: 'Pulsos',
            item1: 'Braceletes do Mártir [239648]',
            effect1: 'Forro de Arcanotrama [240167]',
            slot2: 'Cinto',
            item2: 'Banda do Mártir [239649]',
            effect2: 'Segundo Forro de Arcanotrama [240167]'
          },
          consumablesOfficial: {
            flask: 'Frasco dos Magísteres [241323]',
            potion: 'Poção da Imprudência [241289]',
            food: 'Espetinhos Brilhantes [242281]',
            oil: 'Óleo de Fênix Talassiano [243733]',
            rune: 'Runa de Aprimoramento Tocada pelo Caos [259085]'
          },
          gearList: [
            { slot: 'Pescoço', itemPt: 'Relicário Aqiricida', itemEn: 'Aqirbane Reliquary', id: 268265, icon: 'inv_jewelry_necklace_12', heroIlvl: 328, mythIlvl: 344, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: '50/50 jogadores no Murlok: 107 em todos os secundários' },
            { slot: 'Arma 1M', itemPt: 'Jan\'thrazet, a Presa Anímica', itemEn: "Jan'thrazet, the Soul Fang", id: 271092, icon: 'inv_sword_1h_raidtroll_d_01', heroIlvl: 328, mythIlvl: 344, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek', roleTag: 'BiS Direto', notes: '48/50 jogadores (Loot spec Sagrado)' },
            { slot: 'Berloque 1', itemPt: 'Tentáculo do Terror Pervertido', itemEn: "Twisted Horror's Tendril", id: 281215, icon: 'inv_misc_monsterspidercarapace_01', heroIlvl: 328, mythIlvl: 341, sourceType: 'raid', sourceLocation: 'Raide: A Maldição de Ula\'tek (Kith\'ix)', roleTag: 'BiS Direto', notes: '48/50 jogadores' }
          ],
          ratings: { singleTarget: 5, aoe: 3, survivability: 4, mobility: 3, complexity: 'Alta' },
          keyRotationTip: 'Alinhe Halo exatamente com o início da Forma do Vazio para maximizar os acúmulos de Açoite Mental: Insanidade.'
        }
      ]
    }
  }
];

export const BuildsSimulatorTab: React.FC<BuildsSimulatorProps> = ({ externalSpecId, onSpecChange }) => {
  const [selectedSituation, setSelectedSituation] = useState<'delve' | 'mplus' | 'raid'>('delve');
  const [internalSpecId, setInternalSpecId] = useState<string>('demonology');
  const [selectedTrack, setSelectedTrack] = useState<'hero' | 'myth'>('myth');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Global Real-time Tooltip Context (Raidbots UX)
  const { showTooltip, updateTooltipPosition, hideTooltip, pinTooltip } = useItemTooltip();

  const handleItemHover = (gear: GearDropInfo, e: React.MouseEvent) => {
    showTooltip(gear.id, e, {
      slot: gear.slot,
      itemPt: gear.itemPt,
      itemEn: gear.itemEn,
      icon: gear.icon,
      heroIlvl: gear.heroIlvl,
      mythIlvl: gear.mythIlvl,
      track: selectedTrack,
      sourceLocation: gear.sourceLocation,
      roleTag: gear.roleTag,
      notes: gear.notes
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateTooltipPosition(e);
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleItemClick = (gear: GearDropInfo) => {
    pinTooltip(gear.id, {
      slot: gear.slot,
      itemPt: gear.itemPt,
      itemEn: gear.itemEn,
      icon: gear.icon,
      heroIlvl: gear.heroIlvl,
      mythIlvl: gear.mythIlvl,
      track: selectedTrack,
      sourceLocation: gear.sourceLocation,
      roleTag: gear.roleTag,
      notes: gear.notes
    });
  };

  const handleEmbellishmentHover = (id: number, name: string, effect: string, slot: string, e: React.MouseEvent) => {
    showTooltip(id, e, {
      slot,
      itemPt: name,
      itemEn: name,
      track: selectedTrack,
      roleTag: 'Embelezamento Artesanal',
      notes: effect
    });
  };

  const selectedSpecId = externalSpecId || internalSpecId;

  const handleSelectSpec = (specId: string) => {
    setInternalSpecId(specId);
    if (onSpecChange) {
      onSpecChange(specId as ActiveSpec);
    }
  };

  const currentSpec = BUILDS_DATABASE.find(s => s.specId === selectedSpecId) ?? BUILDS_DATABASE[0];
  const builds = currentSpec.situations[selectedSituation];

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/90 via-zinc-900 to-indigo-950/50 border border-purple-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
          <Layers className="w-4 h-4" />
          <span>Simulador & Matriz de Builds por Situação · Temporada 2 (12.1.5)</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Otimizador Situacional: Delves, Mítico+ e Raide
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
          Complementando o que ferramentas pagas não oferecem: análise de custo-benefício completa, <strong>fontes de drop detalhadas de cada masmorra e delve</strong>, slots exatos para cada embelezamento e flexibilidade entre as trilhas <strong>Herói (321–328)</strong> e <strong>Mito (334–341)</strong>.
        </p>

        {/* Situation Selector Buttons */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { id: 'delve', label: 'Imersões (Delves Solo)', icon: Shield, color: 'border-amber-500 bg-amber-500/20 text-amber-300' },
            { id: 'mplus', label: 'Masmorras Mítico+ (M+)', icon: Zap, color: 'border-purple-500 bg-purple-500/20 text-purple-300' },
            { id: 'raid', label: 'Raide (A Maldição de Ula\'tek)', icon: Swords, color: 'border-indigo-500 bg-indigo-500/20 text-indigo-300' }
          ].map(sit => {
            const Icon = sit.icon;
            const isSelected = selectedSituation === sit.id;
            return (
              <button
                key={sit.id}
                onClick={() => setSelectedSituation(sit.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  isSelected
                    ? sit.color + ' shadow-md'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{sit.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Track & Spec Selector Controls */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Spec selector */}
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-zinc-400 font-semibold">Especialização:</span>
          {BUILDS_DATABASE.map(s => (
            <button
              key={s.specId}
              onClick={() => handleSelectSpec(s.specId)}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                selectedSpecId === s.specId
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-850'
              }`}
            >
              {s.specName}
            </button>
          ))}
        </div>

        {/* Hero vs Mythic Track Toggle (User Requested Flexibility for AoE!) */}
        <div className="flex items-center space-x-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
          <span className="text-zinc-400 text-[11px] font-semibold pl-1">Trilha de Ilvl:</span>
          <button
            onClick={() => setSelectedTrack('hero')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              selectedTrack === 'hero'
                ? 'bg-blue-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Trilha Herói (321–328, Craft 318): Muito mais rápida de farmar, recomendada para AoE e Delves!"
          >
            Trilha Herói (321–328)
          </button>
          <button
            onClick={() => setSelectedTrack('myth')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              selectedTrack === 'myth'
                ? 'bg-amber-500 text-zinc-950 font-black shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Trilha Mito (334–341, Craft 331): Teto absoluto da temporada (exige cristas míticas)."
          >
            Trilha Mito (334–341)
          </button>
        </div>
      </div>

      {/* Builds Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {builds.map(build => (
          <div
            key={build.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-zinc-700 transition"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      {build.heroTalent}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Complexidade: {build.ratings.complexity}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{build.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{build.focus}</p>
                </div>
              </div>

              {/* Performance Radar Metrics */}
              <div className="grid grid-cols-4 gap-2 mt-3 p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-center text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Alvo Único</span>
                  <div className="text-amber-400 font-bold mt-0.5">{'★'.repeat(build.ratings.singleTarget)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">AoE / Mobs</span>
                  <div className="text-purple-400 font-bold mt-0.5">{'★'.repeat(build.ratings.aoe)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Sobrevivência</span>
                  <div className="text-emerald-400 font-bold mt-0.5">{'★'.repeat(build.ratings.survivability)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Mobilidade</span>
                  <div className="text-cyan-400 font-bold mt-0.5">{'★'.repeat(build.ratings.mobility)}</div>
                </div>
              </div>

              {/* Talent String Copy Box */}
              <div className="mt-3.5 p-3 bg-zinc-950 rounded-xl border border-zinc-850">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-zinc-300">Código de Exportação de Talentos:</span>
                  <button
                    onClick={() => handleCopy(build.talentCode, build.id)}
                    className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 font-bold text-[11px] transition"
                  >
                    {copiedCodeId === build.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado para Área de Transferência!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-zinc-900 p-2 rounded font-mono text-[11px] text-zinc-400 truncate border border-zinc-800">
                  {build.talentCode}
                </div>
              </div>

              {/* Explicit Embellishment Slots Breakdown */}
              <div className="mt-3 p-3 bg-zinc-950 rounded-xl border border-amber-900/40 text-xs">
                <div className="font-bold text-amber-300 flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Onde Colocar Cada Embelezamento (Slots Oficiais):</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80 font-mono">Passe o cursor para tooltip</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div
                    onMouseEnter={(e) => handleEmbellishmentHover(239648, build.embellishmentsSlotDetail.item1, build.embellishmentsSlotDetail.effect1, build.embellishmentsSlotDetail.slot1, e)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-amber-500/60 hover:bg-zinc-850 cursor-pointer transition"
                  >
                    <span className="text-zinc-400 block font-semibold">{build.embellishmentsSlotDetail.slot1}:</span>
                    <span className="text-white font-bold">{build.embellishmentsSlotDetail.item1}</span>
                    <span className="text-purple-300 block mt-0.5 font-medium">↳ {build.embellishmentsSlotDetail.effect1}</span>
                  </div>
                  <div
                    onMouseEnter={(e) => handleEmbellishmentHover(245769, build.embellishmentsSlotDetail.item2, build.embellishmentsSlotDetail.effect2, build.embellishmentsSlotDetail.slot2, e)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-amber-500/60 hover:bg-zinc-850 cursor-pointer transition"
                  >
                    <span className="text-zinc-400 block font-semibold">{build.embellishmentsSlotDetail.slot2}:</span>
                    <span className="text-white font-bold">{build.embellishmentsSlotDetail.item2}</span>
                    <span className="text-amber-300 block mt-0.5 font-medium">↳ {build.embellishmentsSlotDetail.effect2}</span>
                  </div>
                </div>
              </div>

              {/* Official Consumables */}
              <div className="mt-3 p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-xs">
                <div className="font-bold text-emerald-400 flex items-center space-x-1.5 mb-2">
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Consumíveis Oficiais Auditados (Patch 12.1.5 Midnight):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-zinc-300">
                  <div><strong>Frasco:</strong> {build.consumablesOfficial.flask}</div>
                  <div><strong>Poção:</strong> {build.consumablesOfficial.potion}</div>
                  <div><strong>Comida:</strong> {build.consumablesOfficial.food}</div>
                  <div><strong>Óleo de Arma:</strong> {build.consumablesOfficial.oil}</div>
                  <div className="sm:col-span-2"><strong>Runa:</strong> {build.consumablesOfficial.rune}</div>
                </div>
              </div>

              {/* Gear List With Real-Time Tooltip Fetcher & Drop Sources (Raidbots UX) */}
              <div className="mt-3 p-3 bg-zinc-950 rounded-xl border border-zinc-850 text-xs">
                <div className="flex items-center justify-between font-bold text-zinc-200 mb-2">
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Equipamentos Recomendados & Fonte de Drop Auditada:</span>
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Trilha: {selectedTrack === 'hero' ? 'Herói (321–328)' : 'Mito (334–341)'}
                  </span>
                </div>

                {/* Raidbots UX Helper Banner */}
                <div className="flex items-center space-x-2 text-[10.5px] text-zinc-400 bg-zinc-900/80 px-2.5 py-1.5 rounded-lg border border-purple-900/40 mb-2.5">
                  <Eye className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>
                    <strong>UX Raidbots:</strong> Passe o cursor sobre qualquer peça para carregar o tooltip oficial da Blizzard com atributos, ícone e local exato de drop.
                  </span>
                </div>

                <div className="space-y-2.5">
                  {build.gearList.map((g, idx) => {
                    const ilvl = selectedTrack === 'hero' ? g.heroIlvl : g.mythIlvl;
                    return (
                      <div
                        key={idx}
                        onMouseEnter={(e) => handleItemHover(g, e)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleItemClick(g)}
                        className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-purple-500/70 hover:bg-zinc-850/80 transition flex flex-col space-y-1.5 shadow-sm cursor-pointer group relative"
                      >
                        {/* Line 1: Icon, Slot Badge, Item Name & Ilvl */}
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={`https://wow.zamimg.com/images/wow/icons/medium/${g.icon}.jpg`}
                            alt={g.itemPt}
                            className="w-9 h-9 rounded-lg border-2 border-purple-500/80 flex-shrink-0 shadow-md bg-zinc-950 group-hover:border-purple-400 group-hover:scale-105 transition"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <span className="text-[10px] uppercase font-mono font-bold bg-zinc-950 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800">
                                {g.slot}
                              </span>
                              <span className="font-bold text-white text-xs tracking-tight group-hover:text-purple-300 transition">
                                {g.itemPt}
                              </span>
                              <span className="text-[10px] text-zinc-400 italic">
                                ({g.itemEn})
                              </span>
                              <span className="text-[11px] font-mono font-bold text-purple-300 bg-purple-950/80 border border-purple-800/40 px-1.5 py-0.2 rounded ml-auto">
                                ilvl {ilvl}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Line 2 (Directly below item name): Prominent Drop Source & Role Badge */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5 pl-11">
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-indigo-950/90 border border-indigo-700/60 text-indigo-200">
                            <MapPin className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                            <span><strong>Fonte:</strong> {g.sourceLocation}</span>
                          </span>

                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            g.roleTag === 'BiS Direto'
                              ? 'bg-amber-950/90 text-amber-300 border border-amber-700/60'
                              : g.roleTag === 'Matéria de Tier (Catalisador)'
                              ? 'bg-purple-950/90 text-purple-300 border border-purple-700/60'
                              : g.roleTag === 'Embelezamento Artesanal'
                              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60'
                              : 'bg-cyan-950/90 text-cyan-300 border border-cyan-700/60'
                          }`}>
                            {g.roleTag}
                          </span>
                        </div>

                        {/* Line 3: Strategic Notes & Stat Breakdown */}
                        <div className="text-zinc-400 text-[10.5px] pl-11 leading-snug">
                          {g.notes}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Rotation Tip */}
            <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-300 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-white">Dica Chave de Execução:</strong> {build.keyRotationTip}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
