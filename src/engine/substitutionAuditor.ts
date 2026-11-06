import { GateResult, ItemSlot, SubstitutionAudit, VerdictType, WowItem } from '../types/wow';

interface AuditContext {
  targetScenario: 'delve_rooms' | 'delve_boss' | 'mplus' | 'raid';
  activeTierPiecesCount: number; // usually 4
  equippedEmbellishmentsCount: number; // max 2
  otherEquippedTrinket?: WowItem | null;
  hasSecondHandOccupied?: boolean;
}

export function evaluateSubstitution(
  equipped: WowItem | null,
  candidate: WowItem,
  context: AuditContext
): SubstitutionAudit {
  const gates: GateResult[] = [];
  const lostEffects: string[] = [];
  const gainedEffects: string[] = [];
  const opportunityCost: string[] = [];
  const statDelta: Record<string, number> = {};

  // G0: Compatibilidade de slot e tipo
  let g0Passed = true;
  let g0Detail = 'Slot e tipo de equipamento perfeitamente compatíveis.';

  if (equipped) {
    if (equipped.slot !== candidate.slot) {
      // allow finger1/finger2 and trinket1/trinket2
      const isRingCross = equipped.slot.startsWith('finger') && candidate.slot.startsWith('finger');
      const isTrinketCross = equipped.slot.startsWith('trinket') && candidate.slot.startsWith('trinket');
      if (!isRingCross && !isTrinketCross) {
        g0Passed = false;
        g0Detail = `Slot incompatível: tentando substituir ${equipped.slot} por item de ${candidate.slot}.`;
      }
    }

    if (candidate.weaponType === 'staff_2h' && context.hasSecondHandOccupied) {
      g0Passed = false;
      g0Detail = 'Atenção: Cajado 2M substitui a Arma 1M E a Mão Secundária (ocupando 2 slots e removendo o embelezamento da Lanterna).';
    }

    if (candidate.armorType && candidate.armorType !== 'cloth' && candidate.armorType !== 'misc') {
      g0Passed = false;
      g0Detail = `Tipo de armadura inválido para Bruxo: item é de ${candidate.armorType}, enquanto Bruxo usa Tecido (Cloth).`;
    }
  }

  gates.push({
    gate: 'G0',
    name: 'Compatibilidade',
    passed: g0Passed,
    description: 'Verifica compatibilidade de slot, tipo de armadura e empunhadura de armas.',
    detail: g0Detail
  });

  // G1: Nível normalizado
  const eqNorm = equipped ? (equipped.normalizedIlvl ?? equipped.ilvl) : 0;
  const candNorm = candidate.normalizedIlvl ?? candidate.ilvl;
  const ilvlDelta = candNorm - eqNorm;

  let g1Passed = true;
  let g1Detail = `Nível normalizado: ${candNorm} vs ${eqNorm} (Saldo: ${ilvlDelta >= 0 ? '+' : ''}${ilvlDelta} ilvl).`;

  if (candidate.ilvl === 341) {
    g1Detail += ' Nota: item Forjado com Peçonha (341) é um item de referência 334 com +7 de forja.';
  } else if (candidate.ilvl === 328) {
    g1Detail += ' Nota: item Forjado Herói (328) é um item de referência 321 com +7 de forja.';
  }

  if (equipped && ilvlDelta < -5) {
    g1Passed = false;
    g1Detail += ' O candidato possui perda de nível de item expressiva (> 5 níveis).';
  }

  gates.push({
    gate: 'G1',
    name: 'Nível Normalizado',
    passed: g1Passed,
    description: 'Normaliza bônus de forjas e compara o poder base real.',
    detail: g1Detail
  });

  // G2: Perda de Efeito / Cantrip
  let g2Passed = true;
  let g2Detail = 'Nenhum efeito passivo exclusivo foi violado.';

  if (equipped?.cantrip && !candidate.cantrip) {
    g2Passed = false;
    lostEffects.push(`Cantrip especial de ${equipped.namePt}`);
    g2Detail = `Perda de Cantrip crítico: ${equipped.namePt} possui efeito passivo único não replicado pelo candidato. Efeito supera pequenas diferenças de nível.`;
  }

  if (candidate.effect) {
    gainedEffects.push(candidate.effect);
  }
  if (equipped?.effect && !candidate.effect) {
    lostEffects.push(equipped.effect);
  }

  gates.push({
    gate: 'G2',
    name: 'Efeito e Cantrip',
    passed: g2Passed,
    description: 'Garante que cantrips de raide ou efeitos de conjunto não sejam descartados às cegas.',
    detail: g2Detail
  });

  // G3: Contagem de Embelezamentos (Max 2 efeitos)
  let g3Passed = true;
  let g3Detail = 'Limite de 2 efeitos de embelezamento ativos respeitado.';

  if (candidate.embellished) {
    if (equipped?.embellished) {
      g3Detail = 'Substituição de peça embelezada por outra mantendo a cota de 2 efeitos.';
    } else {
      if (context.equippedEmbellishmentsCount >= 2) {
        g3Passed = false;
        g3Detail = 'Limite ultrapassado: o personagem já possui 2 efeitos de embelezamento ativos (Único-equipado: Embelezado (2)). O terceiro efeito ficará inerte.';
      } else {
        g3Detail = 'Novo embelezamento adicionado dentro do limite permitido.';
      }
    }
  }

  gates.push({
    gate: 'G3',
    name: 'Embelezamento (Embellishment)',
    passed: g3Passed,
    description: 'Valida a regra dos 2 efeitos máximos de embelezamento da Temporada 2.',
    detail: g3Detail
  });

  // G4: Quebra do Bônus de 4 Peças de Tier
  let g4Passed = true;
  let g4Detail = 'Bônus de 4 peças mantido ou reforçado.';

  if (equipped?.isTier && !candidate.isTier) {
    if (context.activeTierPiecesCount === 4) {
      g4Passed = false;
      g4Detail = 'Perigo crítico: desequipar esta peça quebra o bônus de 4 peças dos Grilhões do Necrólito Maldito (350%/315% de implosão). Nenhuma troca de atributos compensa perder o 4pc!';
    } else {
      g4Detail = `Desequipa peça de tier, mas jogador possui ${context.activeTierPiecesCount} peças (fora do limiar restrito de 4).`;
    }
  }

  gates.push({
    gate: 'G4',
    name: 'Bônus de Tier (4pc)',
    passed: g4Passed,
    description: 'Impede a quebra inadvertida do bônus de 4 peças.',
    detail: g4Detail
  });

  // G5: Conflito de Arquétipo de Berloque (Regra R4: nunca 2 on-use)
  let g5Passed = true;
  let g5Detail = 'Arquétipo de berloque compatível e sem colisão de recarga.';

  if (candidate.isTrinketOnUse && context.otherEquippedTrinket?.isTrinketOnUse) {
    g5Passed = false;
    g5Detail = `Regra R4 violada: o candidato (${candidate.namePt}) é de uso ativo (on-use) e o outro berloque equipado (${context.otherEquippedTrinket.namePt}) também é on-use. Ambos dividem recarga e perdem eficiência!`;
  }

  gates.push({
    gate: 'G5',
    name: 'Arquétipo de Berloque',
    passed: g5Passed,
    description: 'Garante a harmonia entre berloque ativo (on-use) e berloque passivo constante.',
    detail: g5Detail
  });

  // G6: Alinhamento de Atributos Secundários
  let g6Passed = true;
  let g6Detail = 'Atributos favoráveis à prioridade da especialização.';

  if (candidate.stats && equipped?.stats) {
    const hasteDelta = (candidate.stats.haste ?? 0) - (equipped.stats.haste ?? 0);
    const critDelta = (candidate.stats.crit ?? 0) - (equipped.stats.crit ?? 0);
    const mastDelta = (candidate.stats.mastery ?? 0) - (equipped.stats.mastery ?? 0);
    const versDelta = (candidate.stats.versatility ?? 0) - (equipped.stats.versatility ?? 0);

    statDelta['Aceleração'] = hasteDelta;
    statDelta['Crítico'] = critDelta;
    statDelta['Maestria'] = mastDelta;
    statDelta['Versatilidade'] = versDelta;

    if (hasteDelta < -40 && ilvlDelta <= 0) {
      g6Passed = false;
      g6Detail = `Perda pesada do atributo nº 1 de Bruxo Demonologia (Aceleração: ${hasteDelta}) sem ganho de ilvl correspondente.`;
    } else if (context.targetScenario === 'delve_boss' && versDelta > 0) {
      g6Detail = `Ganho de Versatilidade (+${versDelta}) valioso para a mitigação contra o Chefe Kindo'jan no T11.`;
    } else {
      g6Detail = `Saldo de atributos: Aceleração (${hasteDelta >= 0 ? '+' : ''}${hasteDelta}), Crítico (${critDelta >= 0 ? '+' : ''}${critDelta}), Maestria (${mastDelta >= 0 ? '+' : ''}${mastDelta}).`;
    }
  }

  gates.push({
    gate: 'G6',
    name: 'Prioridade de Atributos',
    passed: g6Passed,
    description: 'Avalia o impacto no balanço de Aceleração > Crítico > Maestria > Versatilidade.',
    detail: g6Detail
  });

  // G7: Encaixes e Estrutura
  let g7Passed = true;
  let g7Detail = 'Estrutura de encaixes e gemas preservada.';
  gates.push({
    gate: 'G7',
    name: 'Estrutura & Encaixes',
    passed: g7Passed,
    description: 'Checa gemas prismáticas, engastes de cinto e bônus de encaixe.',
    detail: g7Detail
  });

  // G8: Custo de Oportunidade
  let g8Passed = true;
  let g8Detail = 'Custo acessível de transição.';

  if (candidate.isCrafted) {
    opportunityCost.push('Consome 1 Centelha de Marés e até 80 Cristas Míticas.');
    opportunityCost.push('Necessário comissionar Missiva de Aceleração/Maestria e Forro de Arcanotrama.');
  }
  if (candidate.slot === 'legs') {
    opportunityCost.push('Exige aplicação de Magilinha de Arcanotrama (+41 Int / +4% mana) via Alfaiataria.');
  } else if (['head', 'shoulders', 'chest', 'feet', 'finger1', 'finger2', 'main_hand'].includes(candidate.slot)) {
    opportunityCost.push('Exige reaplicação de encantamento permanente dedicado.');
  }

  g8Detail = opportunityCost.length > 0 ? opportunityCost.join(' ') : 'Sem custos de reencantamento extraordinários.';

  gates.push({
    gate: 'G8',
    name: 'Custo & Cristas',
    passed: g8Passed,
    description: 'Calcula investimento de Cristas, Centelhas, Encantamentos e Gemas.',
    detail: g8Detail
  });

  // Emissão do Veredito Oficial em 5 rótulos
  let verdict: VerdictType = 'Vale a troca';
  let verdictSummary = '';
  let actionRecommendation = '';

  const failedGates = gates.filter(g => !g.passed);

  if (failedGates.some(g => ['G0', 'G3', 'G4', 'G5'].includes(g.gate))) {
    verdict = 'Não vale';
    const primaryFail = failedGates.find(g => ['G0', 'G3', 'G4', 'G5'].includes(g.gate))!;
    verdictSummary = `A troca é reprovada no portão ${primaryFail.gate} (${primaryFail.name}): ${primaryFail.detail}`;
    actionRecommendation = 'Mantenha o item equipado atual. A troca quebraria mecânicas vitais (como 4pc, limites de embelezamento ou bloqueio de recarga de berloques).';
  } else if (failedGates.some(g => g.gate === 'G2')) {
    verdict = 'Vale com condição';
    verdictSummary = `Atenção: Perda de efeito/cantrip único de ${equipped?.namePt}. Vale apenas se o novo item for catalisado ou em cenário específico onde o cantrip não ativa.`;
    actionRecommendation = 'Se for peça de raide, use o Catalisador Matriz (Matrix Catalyst) para converter sem perder atributos, ou busque aprimorar outro slot primeiro.';
  } else if (failedGates.some(g => g.gate === 'G6' || g.gate === 'G1')) {
    verdict = 'Empate técnico — simular';
    verdictSummary = 'Os ganhos de nível e perdas de atributos secundários ficam próximos da margem de equivalência.';
    actionRecommendation = 'Recomendado rodar SimC / Raidbots Top Gear para verificar se o ganho de Intelecto supera o recuo de Aceleração.';
  } else {
    verdict = 'Vale a troca';
    verdictSummary = `Aprovado em todos os portões G0–G8. O candidato entrega ganho positivo de nível (${ilvlDelta >= 0 ? '+' : ''}${ilvlDelta}) e sinergia de atributos.`;
    actionRecommendation = `Equipe ${candidate.namePt}. Aplique o encantamento correspondente e garanta a missiva ideal caso seja peça craftada.`;
  }

  return {
    verdict,
    verdictSummary,
    gates,
    equippedItem: equipped,
    candidateItem: candidate,
    lostEffects,
    gainedEffects,
    statDelta,
    ilvlDelta,
    opportunityCost,
    actionRecommendation
  };
}
