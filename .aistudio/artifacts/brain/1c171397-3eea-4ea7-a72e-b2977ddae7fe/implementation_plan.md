# Exportador de Perfil SimulationCraft (`/simc`)

Implementação de uma suíte completa de exportação do conjunto de equipamentos ativo e dados do personagem no formato padrão do SimulationCraft (`/simc`) para a área de transferência do usuário, com modal de pré-visualização formatado e cópia em um clique.

## Decisões Confirmadas com o Usuário

> [!IMPORTANT]
> As seguintes escolhas de arquitetura e UX foram alinhadas e confirmadas na Fase 1:

- **Estrutura do Texto Exportado**: Perfil completo canônico com cabeçalho (`# Nome - Spec - Classe`), nível, raça, especialização, código de talentos correspondente e cada um dos 16 slots equipados (`id=`, `enchant_id=`, `gem_id=`, `crafted_stats=`, `crafting_quality=`).
- **Posicionamento & UX**: Botão de ação dedicado "Exportar SimC" na barra superior do importador SimC, abrindo um modal escuro de alta legibilidade com pré-visualização em bloco de código monoespaçado, contagem de linhas/itens e botão "Copiar para a Área de Transferência" com feedback animado de sucesso.

---

## 1. Visão Geral & Conceito Central

- **O que faz**: Converte o estado atual do perfil inspecionado (incluindo substituições feitas na auditoria ou customizações de equipamento) de volta para uma string válida e limpa de `/simc`, pronta para ser colada diretamente no Raidbots, no simulador desktop do SimulationCraft ou compartilhada com outros jogadores.
- **Público-alvo**: Jogadores de WoW Midnight (Patch 12.1.5) que otimizam suas builds em Masmorras M+ e Delves e precisam rodar simulações comparativas (*Gear Compare* / *Top Gear*) sem precisar remontar as peças manualmente no jogo.
- **Valor Principal**: Ciclo fechado bidirecional: importa via `/simc` $\rightarrow$ audita substituições e tetos G0–G8 $\rightarrow$ exporta o novo conjunto otimizado com 1 clique para colar no Raidbots.

---

## 2. Experiência do Usuário & Design Visual

### Fluxo de Uso
1. **Acionamento**: Na aba *SimC Inspector*, ao lado do botão "Carregar Exemplo" e "Processar Export", o usuário clica no novo botão **"Exportar Perfil SimC"** (ícone `Share2` / `Copy`).
2. **Modal de Pré-Visualização**: Abre um modal flutuante com fundo escuro (`zinc-950`), borda sutil (`zinc-800`), exibindo:
   - Título com nome do personagem, especialização ativa e nível médio de item.
   - Bloco de código monoespaçado (`JetBrains Mono` / `font-mono tabular-nums`) com rolagem suave e numeração de linhas.
   - Resumo rápido das tags incluídas (16 slots, talentos, encantamentos e gemas).
3. **Cópia Instantânea**: O usuário clica no botão principal **"Copiar para Área de Transferência"**.
   - O botão transiciona imediatamente para estado verde com ícone de `Check` ("Copiado com Sucesso!").
   - Utiliza a API `navigator.clipboard.writeText` com fallback resiliente para `document.execCommand('copy')` em caso de restrições de permissão no iframe.
4. **Fechamento**: Botão "Fechar" ou tecla `Esc` descarta o modal sem alterar o estado do simulador.

### Padrões Visuais (Tailwind CSS)
- **Modal Backdrop**: `bg-black/80 backdrop-blur-sm` com transição suave.
- **Área de Código**: `bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 selection:bg-purple-600`.
- **Acentos e Botões**: Botão primário de cópia em amarelo/âmbar (`bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold`) e transição para verde esmeralda (`bg-emerald-600 text-white`) ao confirmar a cópia.

---

## 3. Decisões de Produto & Arquitetura de Dados

- **Mecanismo de Serialização (`serializeSimcProfile`)**:
  - Criar função utilitária pura em `src/engine/simcExporter.ts` que recebe `ParsedSimcProfile` e `ActiveSpec`.
  - Reconstrói as linhas no formato canônico da Blizzard:
    ```ini
    # Personagem - Especializacao - Classe - 12.1.5
    level=80
    race=blood_elf
    role=spell
    professions=tailoring=100/inscription=100
    spec=demonology
    talents=CoQA4DPb6v5x8sU9O9+6jT/5DAAAAAAAAAAAAAAAAAAAAAYmZGzMzMDzYGzMmZbmZMzMzMMMzAAAAAAYbYMjFjhZmBzMmtB

    head=,id=271546,enchant_id=8675
    neck=,id=272229
    shoulders=,id=271544,enchant_id=8670
    ...
    ```
  - Preserva os atributos essenciais: `enchant_id`, `gem_id`, `crafted_stats` e `crafting_quality`.
- **Sincronização com o Talento da Spec**:
  - Quando a spec ativa tiver um código de talentos configurado no `SPEC_PROFILES`, ele é injetado como a linha `talents=...`, permitindo simulação imediata no Raidbots sem necessidade de recolar a árvore de talentos.

---

## 4. Arquitetura Técnica & Diagrama de Componentes

```
┌────────────────────────────────────────────────────────┐
│                   SimcInspectorTab                     │
│                                                        │
│  ┌──────────────────────────────┐  ┌────────────────┐  │
│  │ SimcPerformanceSummaryCard   │  │ Export Button  │  │
│  └──────────────────────────────┘  └───────┬────────┘  │
└────────────────────────────────────────────┼───────────┘
                                             │ triggers modal
                                             ▼
┌────────────────────────────────────────────────────────┐
│                 SimcExportModal                        │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Header: Character / Spec / ilvl / Slot count     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Code View: serializeSimcProfile(profile, spec)   │  │
│  │ (Mono font, syntax highlights, line numbers)     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Actions: [Copiar para Clipboard] [Fechar]        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Arquivos Envolvidos
1. `src/engine/simcExporter.ts` *(Novo)*: Motor de serialização `serializeSimcProfile(profile, specId?)`.
2. `src/components/SimcExportModal.tsx` *(Novo)*: Modal de visualização do código formatado com cópia para clipboard e tratamento de erros.
3. `src/components/SimcInspectorTab.tsx`: Adição do botão "Exportar Perfil SimC" e controle de estado do modal (`isExportModalOpen`).
