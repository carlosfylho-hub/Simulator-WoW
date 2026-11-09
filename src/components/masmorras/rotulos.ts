/** Rótulos curtos em PT-BR usados pela tela de Masmorras. */
export const SLOT_PT: Record<string, string> = {
    head: 'Cabeça', neck: 'Pescoço', shoulder: 'Ombros', shoulders: 'Ombros', back: 'Costas',
    chest: 'Peito', wrist: 'Pulsos', wrists: 'Pulsos', hands: 'Mãos', waist: 'Cintura',
    legs: 'Pernas', feet: 'Pés', finger: 'Anel', finger1: 'Anel 1', finger2: 'Anel 2',
    trinket: 'Berloque', trinket1: 'Berloque 1', trinket2: 'Berloque 2',
    main_hand: 'Mão principal', off_hand: 'Mão secundária',
};

export const slotPt = (slot: string) => SLOT_PT[slot] ?? slot;

export const nomeItem = (i: { nome_pt?: string | null; nome_en?: string | null; item_id?: number | null }) =>
    i.nome_pt || i.nome_en || (i.item_id != null ? `#${i.item_id}` : '—');
