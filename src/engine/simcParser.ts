import { ItemSlot, ParsedSimcItem, ParsedSimcProfile } from '../types/wow';
import { SIMC_ENCHANT_MAP } from '../data/enchantsGems';
import { GEM_CATALOG } from '../data/enchantsGems';

const SLOT_MAP: Record<string, ItemSlot> = {
  head: 'head',
  helm: 'head',
  helmet: 'head',
  neck: 'neck',
  necklace: 'neck',
  shoulder: 'shoulders',
  shoulders: 'shoulders',
  spaulders: 'shoulders',
  back: 'back',
  cloak: 'back',
  cape: 'back',
  chest: 'chest',
  robe: 'chest',
  shirt: 'chest',
  wrist: 'wrists',
  wrists: 'wrists',
  bracer: 'wrists',
  bracers: 'wrists',
  hand: 'hands',
  hands: 'hands',
  gloves: 'hands',
  waist: 'waist',
  belt: 'waist',
  leg: 'legs',
  legs: 'legs',
  pants: 'legs',
  foot: 'feet',
  feet: 'feet',
  boot: 'feet',
  boots: 'feet',
  finger1: 'finger1',
  ring1: 'finger1',
  finger2: 'finger2',
  ring2: 'finger2',
  trinket1: 'trinket1',
  trinket2: 'trinket2',
  main_hand: 'main_hand',
  mainhand: 'main_hand',
  two_hand: 'main_hand',
  twohand: 'main_hand',
  weapon: 'main_hand',
  off_hand: 'off_hand',
  offhand: 'off_hand',
  shield: 'off_hand'
};

export function parseSimcString(simcText: string): ParsedSimcProfile {
  const lines = simcText.split('\n');
  let characterName = 'Desconhecido';
  let spec = 'Demonologia';
  let characterClass = 'Bruxo';
  let level = 80;
  let race = 'Elfo Sangrento';
  const professions: string[] = [];
  const equipped: Partial<Record<ItemSlot, ParsedSimcItem>> = {};
  let checksum: string | undefined;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Header: # PlayerName - Spec - Class
    if (line.startsWith('#') && line.includes('-') && !line.includes('Gear from Bags')) {
      const parts = line.replace('#', '').split('-').map(s => s.trim());
      if (parts.length >= 3) {
        characterName = parts[0];
        spec = parts[1];
        characterClass = parts[2];
      } else if (line.toLowerCase().includes('checksum')) {
        checksum = line.split(':')[1]?.trim();
      }
      continue;
    }

    if (line.startsWith('level=')) {
      const match = line.match(/level=(\d+)/);
      if (match) level = parseInt(match[1], 10);
      continue;
    }

    if (line.startsWith('race=')) {
      race = line.replace('race=', '').trim();
      continue;
    }

    if (line.startsWith('spec=')) {
      spec = line.replace('spec=', '').trim();
      continue;
    }

    if (line.startsWith('professions=')) {
      const profs = line.replace('professions=', '').split('/');
      professions.push(...profs.map(p => p.trim()));
      continue;
    }

    // Equipment line: slot=,id=123,... or slot=item_name,id=123,...
    const slotMatch = line.match(/^([a-z0-9_]+)=/i);
    if (!slotMatch) continue;

    const rawSlot = slotMatch[1].toLowerCase();
    const mappedSlot = SLOT_MAP[rawSlot];
    if (!mappedSlot) continue;

    // Specifically extract item id: id=(\d+) ensuring it is NOT enchant_id, gem_id, or bonus_id!
    const idMatch = line.match(/(?:^|[=,])id=(\d+)/i);
    if (!idMatch) continue;

    const itemId = parseInt(idMatch[1], 10);

    // Extract item name slug if present: slot=slug,id=...
    const nameMatch = line.match(/^[a-z0-9_]+=([^,]+)/i);
    let parsedName = nameMatch && nameMatch[1] && !nameMatch[1].startsWith('id=') ? nameMatch[1].replace(/["']/g, '').trim() : undefined;
    if (parsedName) {
      parsedName = parsedName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Extract item level if specified (ilvl=, ilevel=, drop_level=)
    const ilvlMatch = line.match(/(?:ilvl|ilevel|drop_level)=(\d+)/i);
    const parsedIlvl = ilvlMatch ? parseInt(ilvlMatch[1], 10) : undefined;

    // Extract enchant_id
    const enchantMatch = line.match(/enchant_id=(\d+)/);
    const enchantId = enchantMatch ? parseInt(enchantMatch[1], 10) : undefined;
    const enchantObj = enchantId ? SIMC_ENCHANT_MAP[enchantId] : undefined;
    const enchantName = enchantObj ? enchantObj.namePt : (enchantId ? `Enchant ID ${enchantId}` : undefined);

    // Extract gem_id
    const gemMatch = line.match(/gem_id=(\d+)/);
    const gemId = gemMatch ? parseInt(gemMatch[1], 10) : undefined;
    const gemObj = gemId ? GEM_CATALOG.find(g => g.id === gemId) : undefined;
    const gemName = gemObj ? gemObj.namePt : (gemId ? `Gema ID ${gemId}` : undefined);

    // Extract bonus_id
    const bonusMatch = line.match(/bonus_id=([0-9/]+)/);
    const bonusIds = bonusMatch ? bonusMatch[1].split('/').map(n => parseInt(n, 10)) : undefined;

    // Extract crafted_stats (missives)
    const craftedStatsMatch = line.match(/crafted_stats=([0-9/]+)/);
    const craftedStats = craftedStatsMatch ? craftedStatsMatch[1].split('/').map(n => parseInt(n, 10)) : undefined;

    // Extract crafting quality
    const qualityMatch = line.match(/crafting_quality=(\d+)/);
    const craftingQuality = qualityMatch ? parseInt(qualityMatch[1], 10) : undefined;

    equipped[mappedSlot] = {
      slot: mappedSlot,
      id: itemId,
      name: parsedName,
      ilvl: parsedIlvl,
      enchantId,
      enchantName,
      gemId,
      gemName,
      bonusIds,
      craftedStats,
      craftingQuality,
      rawString: line
    };
  }

  return {
    characterName,
    spec,
    characterClass,
    level,
    race,
    professions,
    equipped,
    equippedCount: Object.keys(equipped).length,
    checksum
  };
}

export const SAMPLE_SIMC_STRING = `# DemonologyWarlock - Demonology - Warlock - 2026-11-06
level=80
race=blood_elf
role=spell
professions=tailoring=100/inscription=100
spec=demonology

head=,id=271546,enchant_id=8675
neck=,id=272229
shoulders=,id=271544,enchant_id=8670
back=,id=251132
chest=,id=271549,enchant_id=8650
wrists=,id=239648,crafted_stats=36/49,crafting_quality=5
hands=,id=271547
waist=,id=251222
legs=,id=271545
feet=,id=272232,enchant_id=8680
finger1=,id=158366,enchant_id=8660
finger2=,id=272147,enchant_id=8660
trinket1=,id=273649
trinket2=,id=273794
main_hand=,id=272266,enchant_id=8689
off_hand=,id=245769,crafted_stats=36/49,crafting_quality=5

# Checksum: 9a7b4f2c1d
`;
