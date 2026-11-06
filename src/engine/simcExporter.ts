import { ParsedSimcProfile, ItemSlot, ActiveSpec } from '../types/wow';
import { SPEC_PROFILES } from '../data/specs';
import { getItemById } from '../data/items';

const ORDERED_SLOTS: { slot: ItemSlot; label: string }[] = [
  { slot: 'head', label: 'head' },
  { slot: 'neck', label: 'neck' },
  { slot: 'shoulders', label: 'shoulders' },
  { slot: 'back', label: 'back' },
  { slot: 'chest', label: 'chest' },
  { slot: 'wrists', label: 'wrists' },
  { slot: 'hands', label: 'hands' },
  { slot: 'waist', label: 'waist' },
  { slot: 'legs', label: 'legs' },
  { slot: 'feet', label: 'feet' },
  { slot: 'finger1', label: 'finger1' },
  { slot: 'finger2', label: 'finger2' },
  { slot: 'trinket1', label: 'trinket1' },
  { slot: 'trinket2', label: 'trinket2' },
  { slot: 'main_hand', label: 'main_hand' },
  { slot: 'off_hand', label: 'off_hand' }
];

export function serializeSimcProfile(profile: ParsedSimcProfile, activeSpec?: ActiveSpec): string {
  const lines: string[] = [];

  // Determine spec key
  let specKey: ActiveSpec = activeSpec || 'demonology';
  const specLower = (profile.spec || '').toLowerCase();
  if (specLower.includes('afflic') || specLower.includes('suplí') || specLower.includes('supli')) specKey = 'affliction';
  else if (specLower.includes('destro')) specKey = 'destruction';
  else if (specLower.includes('demo')) specKey = 'demonology';
  else if (specLower.includes('balan') || specLower.includes('equil')) specKey = 'balance';
  else if (specLower.includes('shad') || specLower.includes('somb')) specKey = 'shadow';

  const specProfile = SPEC_PROFILES[specKey];

  // Header
  const charName = profile.characterName && profile.characterName !== 'Desconhecido' ? profile.characterName : 'Campeão';
  const charClass = profile.characterClass || (specKey === 'balance' ? 'Druid' : (specKey === 'shadow' ? 'Priest' : 'Warlock'));
  const charRace = profile.race || 'blood_elf';
  const dateStr = new Date().toISOString().split('T')[0];

  lines.push(`# ${charName} - ${specProfile?.nameEn || profile.spec} - ${charClass} - ${dateStr}`);
  lines.push(`level=${profile.level || 80}`);
  lines.push(`race=${charRace}`);
  lines.push(`role=spell`);

  if (profile.professions && profile.professions.length > 0) {
    lines.push(`professions=${profile.professions.join('/')}`);
  } else {
    lines.push('professions=tailoring=100/inscription=100');
  }

  lines.push(`spec=${specKey}`);

  // Talents
  if (specProfile?.talentImportString) {
    lines.push(`talents=${specProfile.talentImportString}`);
  }

  lines.push(''); // blank line before equipment

  // Equipment slots
  ORDERED_SLOTS.forEach(({ slot }) => {
    const equippedItem = profile.equipped[slot];
    if (!equippedItem) return;

    const dbItem = getItemById(equippedItem.id);
    let itemLine = `${slot}=,id=${equippedItem.id}`;

    // Item level if present or from DB
    const ilvl = equippedItem.ilvl || dbItem?.ilvl;
    if (ilvl) {
      itemLine += `,drop_level=${ilvl}`;
    }

    // Enchant
    if (equippedItem.enchantId) {
      itemLine += `,enchant_id=${equippedItem.enchantId}`;
    }

    // Gem
    if (equippedItem.gemId) {
      itemLine += `,gem_id=${equippedItem.gemId}`;
    }

    // Bonus IDs
    if (equippedItem.bonusIds && equippedItem.bonusIds.length > 0) {
      itemLine += `,bonus_id=${equippedItem.bonusIds.join('/')}`;
    }

    // Crafted stats (Missives)
    if (equippedItem.craftedStats && equippedItem.craftedStats.length > 0) {
      itemLine += `,crafted_stats=${equippedItem.craftedStats.join('/')}`;
    }

    // Crafting quality
    if (equippedItem.craftingQuality) {
      itemLine += `,crafting_quality=${equippedItem.craftingQuality}`;
    }

    lines.push(itemLine);
  });

  // Checksum
  lines.push('');
  const checksum = profile.checksum || Math.random().toString(16).substring(2, 10);
  lines.push(`# Checksum: ${checksum}`);

  return lines.join('\n');
}
