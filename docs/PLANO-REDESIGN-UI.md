# Plano de redesign da interface — Simulator-WoW

> **Para quem for implementar (Claude ou outra IA):** este documento é o checklist.
> Antes de cada tarefa, marque `[~]`; ao terminar, `[x]` + hash do commit. Divergência
> entre o que está escrito aqui e o código real vai para §9 (Desvios). Não invente
> funcionalidade nova: o objetivo é **enxugar e reorganizar**, não acrescentar.
>
> Criado em 2026-11-08, depois da auditoria das entregas T1–T16
> (`wow-sim/docs/AUDITORIA-ENTREGAS-IA.md`). Repositório: `Simulator-WoW`.

---

## 1. Por que mudar

O sistema mudou de rumo (doc `wow-sim/docs/PLANO-CONTINUIDADE.md` §6.B): ele existe para
o que o AMR e o Raidbots **não** fazem — de qual masmorra rolar o bônus (Voidcore),
Grande Cofre, comparação por build e as strings do Pawn/AMR. A interface ainda é a do
Google AI Studio com camadas acrescentadas por cima:

| Problema de hoje | Onde | Efeito |
| :--- | :--- | :--- |
| 3 áreas × 9 sub-abas (Inspecionar, Builds, Top Gear, Droptimizer, Masmorras, Itens, Runas, Progressão, Delves) | `App.tsx` `SUBTABS` | A tela que importa (Masmorras) é a 5ª sub-aba da 1ª área |
| Top Gear e Droptimizer em destaque | `App.tsx` | Duplicam o Raidbots/AMR, que fazem melhor |
| Seletor de spec fixo (5 specs) e de cenário no cabeçalho | `Navbar.tsx` | A spec já vem do export; o cenário é por tela (e por build) |
| Cada tela tem as próprias caixas de colar /simc e AMR | `MasmorrasPanel`, `TopGearPanel`, `DroptimizerPanel` | O mesmo texto colado três vezes, tela comprida |
| Texto de 10–11 px (`text-[10px]`, `text-[11px]`) e cinza `zinc-500/600` sobre `zinc-950` | todos os painéis | Pouco legível; abaixo do contraste AA em vários pontos |
| Parágrafos explicativos fixos em toda tela | painéis | Poluição; a explicação cabe num ícone de ajuda |
| Cores de destaque diferentes por painel (sky, emerald, violet, amber) | painéis | Sem hierarquia; nada se destaca |

## 2. Decisões já tomadas com o usuário (2026-11-08)

1. **Top Gear e Droptimizer saem do menu principal** e vão para **"Avançado"**. O código
   fica, nada é apagado; dá para reativar sem retrabalho.
2. **Menu principal com 3 abas:** **Masmorras** · **Perfil** · **Histórico**.
3. **Telas herdadas do AI Studio** (Inspecionar, Builds antigo, Itens, Runas, Progressão,
   Delves) e o **Consultor IA** também vão para "Avançado".
4. **Tema escuro "azul-noite"** com destaque **dourado** (paleta em §4), contraste AA.
5. **Navegação por abas no topo**, conteúdo em largura confortável.

Decisões de implementação deste plano (podem ser revistas pelo usuário):
- O cenário sai do cabeçalho e fica dentro da tela de Masmorras (cada build já tem o seu).
- A spec sai do cabeçalho: vem do perfil importado e aparece como um "chip" informativo.
- Nenhuma mudança de backend é necessária (§7 lista os endpoints usados).

## 3. Princípios (regras de revisão)

1. **Uma ação principal por tela**, em dourado. Todo o resto é secundário (contorno) ou
   discreto (texto).
2. **Mostrar o resultado primeiro.** Depois de rodar, o topo da tela é a resposta
   ("Rolar o bônus em: X"), não o formulário.
3. **Nada de parágrafo fixo.** Explicação vira `InfoTip` (ícone ⓘ) ou rodapé de uma linha.
4. **Texto mínimo de 12 px**; corpo 14 px. Proibido `text-[10px]` e `text-[11px]` nas
   telas novas.
5. **Cor só com significado:** dourado = ação/seleção; verde = ganho real; vermelho =
   perda real; cinza = empate dentro do erro; âmbar = aviso. Nada de cor decorativa.
6. **Números em fonte monoespaçada tabular**, com sinal (`+1,82%`) e formato pt-BR.
7. **Opções avançadas recolhidas** ("Mais opções"): iterações, orçamento, base SimC/AMR.
8. **Nunca esconder o erro/limiar:** todo % mostra o empate (cinza) quando |Δ| ≤ limiar.
9. Ícones `lucide-react` 16 px, só quando carregam significado. Sem emoji.
10. Funciona em **≥ 900 px** de largura (janela do pywebview) sem rolagem horizontal; a
    matriz item × build pode rolar dentro do próprio cartão.

## 4. Sistema visual

### 4.1 Paleta (contraste medido — WCAG 2.1)

| Token | Hex | Uso | Contraste |
| :--- | :--- | :--- | :--- |
| `--c-fundo` | `#0B1220` | fundo da página | — |
| `--c-superficie` | `#121A2B` | cartões | — |
| `--c-superficie-2` | `#18233A` | cartão dentro de cartão, linha em hover, campos | — |
| `--c-borda` | `#22304A` | divisórias (decorativas) | 1,3:1 (só decorativa) |
| `--c-borda-campo` | `#56698F` | contorno de input/select/botão secundário | **3,2:1** (≥ 3:1 exigido p/ componente) |
| `--c-texto` | `#E6ECF7` | texto principal | **14,7:1** |
| `--c-texto-2` | `#9AA8C2` | rótulos, texto secundário | **7,2:1** |
| `--c-texto-3` | `#7D8BA6` | rodapés, dicas (mínimo permitido) | **5,1:1** |
| `--c-destaque` | `#F5C451` | botão principal, aba ativa, foco | 10,7:1 |
| `--c-destaque-hover` | `#FFD36B` | hover do botão principal | — |
| `--c-sobre-destaque` | `#0B1220` | texto em cima do dourado | **11,5:1** |
| `--c-ganho` | `#4ADE80` | Δ positivo acima do limiar | 10,0:1 |
| `--c-perda` | `#F87171` | Δ negativo abaixo do limiar | 6,3:1 |
| `--c-aviso` | `#FBBF24` | avisos, "para catalisar" | 10,4:1 |
| `--c-info` | `#7DB4FF` | links e informação neutra | 8,2:1 |

Contrastes calculados contra `--c-superficie` (pior caso entre fundo e superfície). Fazer
de novo com o script de §8 se mudar qualquer valor.

### 4.2 Implementação no Tailwind v4

O projeto usa Tailwind 4 (`@import "tailwindcss"` em `src/index.css`, plugin
`@tailwindcss/vite`). Os tokens entram em `@theme` e viram classes (`bg-fundo`,
`text-texto-2`, `border-borda-campo`, `bg-destaque` …):

```css
@import "tailwindcss";

@theme {
  --color-fundo: #0B1220;
  --color-superficie: #121A2B;
  --color-superficie-2: #18233A;
  --color-borda: #22304A;
  --color-borda-campo: #56698F;
  --color-texto: #E6ECF7;
  --color-texto-2: #9AA8C2;
  --color-texto-3: #7D8BA6;
  --color-destaque: #F5C451;
  --color-destaque-hover: #FFD36B;
  --color-sobre-destaque: #0B1220;
  --color-ganho: #4ADE80;
  --color-perda: #F87171;
  --color-aviso: #FBBF24;
  --color-info: #7DB4FF;

  --font-sans: "Inter", "Segoe UI", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Cascadia Mono", Consolas, monospace;

  /* Telas legadas (Avançado) usam zinc-*: remapeie para a paleta nova, assim
     elas herdam o tema sem reescrita. Conferir contraste do zinc-500/600. */
  --color-zinc-950: #0B1220;
  --color-zinc-900: #121A2B;
  --color-zinc-800: #22304A;
  --color-zinc-700: #56698F;
  --color-zinc-600: #7D8BA6;
  --color-zinc-500: #8E9BB5;
  --color-zinc-400: #9AA8C2;
  --color-zinc-300: #C4CEE0;
  --color-zinc-200: #DCE3EF;
  --color-zinc-100: #E6ECF7;
}

html, body { background: var(--color-fundo); color: var(--color-texto); }
body { font-size: 14px; -webkit-font-smoothing: antialiased; }
.num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
:focus-visible { outline: 2px solid var(--color-destaque); outline-offset: 2px; }
```

O app roda **offline** no pywebview: não carregar fonte do Google Fonts. As pilhas acima
caem em Segoe UI/Consolas no Windows, que já estão instaladas.

### 4.3 Tipografia e espaçamento

| Papel | Tamanho / peso | Classe |
| :--- | :--- | :--- |
| Título da tela | 20 px / 600 | `text-xl font-semibold` |
| Título de cartão | 15 px / 600 | `text-[15px] font-semibold` |
| Corpo | 14 px / 400 | `text-sm` |
| Rótulo, legenda | 12 px / 500 | `text-xs font-medium text-texto-2` |
| Números | 14 px mono | `num` |

Espaçamento em múltiplos de 4 (`gap-2/3/4/6`); raio 8 px (campos, botões) e 12 px (cartões);
largura útil `max-w-5xl` (1024 px), com `px-4` em telas estreitas.

### 4.4 Componentes base — `src/ui/`

Criar uma vez, usar em todas as telas novas. Cada um é pequeno (< 80 linhas) e sem lógica
de negócio.

| Componente | Props principais | Notas |
| :--- | :--- | :--- |
| `Botao` | `variante: 'principal'\|'secundario'\|'discreto'`, `carregando`, `icone` | principal = `bg-destaque text-sobre-destaque hover:bg-destaque-hover`; secundário = contorno `border-borda-campo` |
| `Cartao` | `titulo?`, `acao?` (nó à direita), `children` | `bg-superficie border border-borda rounded-xl p-4` |
| `Campo` | `rotulo`, `dica?` (vira InfoTip), `children` | rótulo 12 px acima do controle |
| `Selecao` / `Numero` | igual ao `<select>`/`<input type=number>` | `bg-superficie-2 border-borda-campo h-9 rounded-lg` |
| `Segmentado` | `opcoes`, `valor`, `onChange` | substitui pares de botões "Masmorras M+ / Grande Cofre" |
| `Recolhivel` | `titulo`, `aberto?` | "Mais opções", "Comparar builds" |
| `Delta` | `valor`, `limiar` | verde/vermelho/cinza + sinal + `num`; título com "empate abaixo de X%" |
| `Etiqueta` | `tipo: 'direto'\|'catalisar'\|'ambos'\|'nao_serve'` | chip 12 px; cores: verde, âmbar, verde+âmbar, cinza |
| `ItemIcone` | `item_id`, `icone`, `nome`, `tooltip` | reaproveita `useItemTooltip` e o ícone do zamimg |
| `CopiarTexto` | `texto` | **mover** de `MasmorrasBuilds.tsx` para cá (já tem o fallback de seleção) |
| `Aviso` | `tom: 'erro'\|'aviso'\|'info'` | uma linha, ícone à esquerda |
| `Progresso` | `estagio`, `iniciado`, `orcamento` | reaproveita `SimulationProgressBar`, só restilizar |
| `InfoTip` | já existe (`components/InfoTip.tsx`) | restilizar com os tokens |

## 5. Estrutura de telas

### 5.1 Casca do app (`App.tsx`, `Navbar.tsx`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ◆ Simulador WoW     [Masmorras] [Perfil] [Histórico]   Pyrogalth · Demo ▾ Avançado ▾ │
└──────────────────────────────────────────────────────────────────────────┘
```

- Esquerda: marca (texto + um ícone), sem subtítulo de patch (vai para o rodapé).
- Centro: 3 abas. Ativa = texto `texto` + sublinhado dourado de 2 px; inativas `texto-2`.
- Direita: **chip do perfil** (nome · spec, vindo de `validarCombinacao`; sem perfil →
  "Importar perfil", que leva à aba Perfil) e menu **Avançado ▾** com: Top Gear,
  Droptimizer, Inspecionar SimC, Builds (antigo), Itens, Runas, Progressão, Delves,
  Consultor IA.
- Telas do Avançado abrem no mesmo espaço, com uma faixa de uma linha no topo:
  "Ferramenta avançada — o Raidbots/AMR cobre isto; mantida sem novas funções."
- Remover os `<select>` de spec e de cenário do cabeçalho. O estado `currentSpec` continua
  existindo para as telas legadas que o recebem (passar `spec` do perfil quando houver).
- Rodapé: uma linha só — "Midnight 12.1.5 · S2 · números de DPS só do SimulationCraft".
- Aba inicial: **Masmorras** se houver perfil salvo; senão **Perfil**. Guardar a última
  aba em `usePersistedState('wowsim.aba', ...)`.

### 5.2 Aba **Perfil** (`components/PerfilTab.tsx`, nova)

O único lugar onde se cola texto.

```
Perfil
┌ SimC (obrigatório) ───────────────┐ ┌ AskMrRobot (opcional) ──────────┐
│ textarea 10 linhas                 │ │ textarea 10 linhas               │
└────────────────────────────────────┘ └──────────────────────────────────┘
Base: (•) SimC ( ) AMR                                     [ Validar e salvar ]
┌ Pyrogalth · Bruxo Demonologia · Humano · nível 90 ─────────────────────────┐
│ 16 itens · 42 na mochila · talentos ok · fontes: SimC + AMR                │
│ ⚠ avisos do merge (um por linha, só severidade ≠ info)                      │
└────────────────────────────────────────────────────────────────────────────┘
```

- Reusa `simcStorage`/`amrStorage` (local + remoto) e `validarCombinacao`.
- Validação automática 600 ms depois de parar de digitar (mesmo debounce de hoje); o botão
  só força.
- O resumo do perfil é a fonte do chip do cabeçalho (contexto React simples
  `PerfilContext` com `{ addon, amr, primario, resumo }`).
- Masmorras, Top Gear e Droptimizer passam a **ler** o perfil do contexto. Nas telas
  legadas, as caixas de texto atuais podem ficar (são "Avançado"), mas iniciam com o
  texto do contexto.

### 5.3 Aba **Masmorras** (refazer `MasmorrasPanel.tsx` dividido em partes)

Ordem de cima para baixo:

```
Masmorras                                  [Masmorras M+ | Grande Cofre]
┌ Configuração ─────────────────────────────────────────────────────────────┐
│ ilvl [341▾]   Cenário [Masmorra/Delve ▾]   Builds: 2 marcadas  (Editar)   │
│ ▸ Mais opções (iterações, orçamento, base SimC/AMR, escala do Pawn)       │
│                                   ~6 min estimados   [ ▶ Rodar ranking ]  │
└───────────────────────────────────────────────────────────────────────────┘
[ barra de progresso fina + "build 1/2: m+ icy" ]           [Cancelar]

┌ Rolar o bônus em ─────────────────────────────────────────────────────────┐
│ 1  Altar das Presas        3 de 7 servem · 43%      maior +1,82%   ▾      │
│ 2  Descanso do Rei         2 de 6 servem · 33%      maior +0,94%   ▾      │
│ …  (top 5; "ver todas" mostra o resto)    Ordenar: [Mais itens | Maior ganho] │
└───────────────────────────────────────────────────────────────────────────┘
   linha expandida:
   [ícone] Anel X        finger   +1,82%   cat —      [upgrade direto]
   [ícone] Elmo Y        head     +0,10%   cat +1,40% [para catalisar]

┌ Por build ──────────── (só com builds) ───────────────────────────────────┐
│ matriz item × build (Delta colorido, ⚠ divergente), média ponderada       │
│ cartões por build: conjunto montado +X% (empate < Y%), trocas             │
└───────────────────────────────────────────────────────────────────────────┘
┌ Levar para o jogo ────────────────────────────────────────────────────────┐
│ Pawn:  [m+ icy] [single] [Mistura]  → CopiarTexto                         │
│ AMR:   colar modelo BiB (Recolhível) → [Gerar] por build → CopiarTexto    │
│ (i) limites do Pawn · aviso do _bib_                                      │
└───────────────────────────────────────────────────────────────────────────┘
rodapé de 1 linha: premissa da chance (vem do backend, `premissa_chance`)
```

- **Sem caixas de texto** nesta tela: o perfil vem da aba Perfil. Sem perfil, o cartão de
  configuração vira um `Aviso` com o botão "Importar perfil".
- O seletor de builds (`SeletorBuilds`) abre num `Recolhivel` "Builds"; o resumo mostra só
  "2 marcadas".
- Estimativa automática (debounce) em vez de botão "Estimar": aparece ao lado do botão
  Rodar.
- Depois de terminar, rolar até "Rolar o bônus em" e recolher a configuração.
- "Levar para o jogo" junta o que hoje está espalhado nos cartões de build (Pawn por build,
  Mistura, gerar AMR). O cartão de cada build fica só com o resultado medido.
- Modo Grande Cofre: mesmo layout; o título do cartão de resultado vira "Opções do
  Grande Cofre", sem ordenação por masmorra.
- Divisão de arquivos sugerida (cada um < 250 linhas):
  `masmorras/ConfiguracaoRanking.tsx`, `masmorras/ResultadoRanking.tsx`,
  `masmorras/LinhaMasmorra.tsx`, `masmorras/PorBuild.tsx` (matriz + cartões),
  `masmorras/LevarParaOJogo.tsx`, e `MasmorrasPanel.tsx` só orquestrando estado e polling.
  O conteúdo atual de `MasmorrasBuilds.tsx` é distribuído entre `PorBuild` e
  `LevarParaOJogo`.

### 5.4 Aba **Histórico** (`components/HistoricoTab.tsx`, nova)

- Lista os jobs de `GET /api/masmorras` (já existe; sem o texto colado): data, modo
  (Masmorras/Cofre), builds, status, duração. Linha clicável → abre o resultado na aba
  Masmorras (`GET /api/masmorras/{id}/resultado`), em modo somente leitura com o selo
  "Resultado de dd/mm hh:mm".
- Status com cor semântica; jobs com erro mostram a mensagem numa linha.
- Sem paginação no começo (o endpoint devolve os 50 últimos).

### 5.5 Avançado (telas legadas)

- Nenhuma reescrita. Elas herdam a paleta pelo remapeamento do `zinc-*` (§4.2) e recebem a
  faixa de uma linha. Se alguma ficar ilegível depois do remapeamento, corrigir **só** as
  classes de cor daquele trecho e anotar em §9.

## 6. Tarefas (checklist)

| # | Tarefa | Status | Commit |
| :-: | :--- | :-: | :-- |
| U0 | Tokens em `index.css` + remapeamento `zinc-*` + base (`body`, foco, `.num`) | [ ] | |
| U1 | Componentes `src/ui/` (§4.4) + mover `CopiarTexto` | [ ] | |
| U2 | Casca: abas Masmorras/Perfil/Histórico, chip do perfil, menu Avançado, rodapé; tirar spec/cenário do cabeçalho | [ ] | |
| U3 | Aba Perfil + `PerfilContext` | [ ] | |
| U4 | Masmorras refeita (§5.3), dividida em arquivos | [ ] | |
| U5 | Histórico | [ ] | |
| U6 | Faixa "Ferramenta avançada" nas telas legadas + conferência visual | [ ] | |
| U7 | Verificação (§8) e capturas de tela antes/depois em `docs/redesign/` | [ ] | |

Uma tarefa = um commit (`feat(ui): ...`). Não misturar U4 com U2.

**Critérios de aceite gerais**
- `tsc --noEmit` limpo; `vite build` passa.
- Nenhum `text-[10px]`/`text-[11px]` nos arquivos novos
  (`grep -rn "text-\[1[01]px\]" src/ui src/components/masmorras src/components/PerfilTab.tsx src/components/HistoricoTab.tsx` vazio).
- Nenhuma cor `sky-`, `emerald-`, `violet-`, `rose-`, `amber-` nos arquivos novos — só tokens.
- Os contratos de API **não** mudam: o JSON enviado em `criarRanking` é o mesmo de hoje.
- Todas as funções da tela atual de Masmorras continuam acessíveis (modo cofre, builds,
  pesos, cenário por build, escala do Pawn, string do AMR, cancelar, ordenações).

## 7. Endpoints usados (sem mudança de backend)

| Tela | Endpoint |
| :--- | :--- |
| Perfil | `POST /api/import/combinar`, `GET/PUT /api/perfil/importacao` (via `simcStorage`/`amrStorage`) |
| Masmorras | `POST /api/masmorras`, `GET /api/masmorras/{id}`, `GET …/resultado`, `POST …/cancelar`, `GET /api/masmorras/estimativa`, `POST /api/masmorras/builds`, `POST /api/exportar/amr` |
| Histórico | `GET /api/masmorras` |
| Todas | `GET /api/catalog/items`, `GET /api/catalog/icones` (nomes e ícones) |

## 8. Como verificar

1. **Tipos e build:** `npx tsc --noEmit` e `npx vite build`.
2. **Contraste:** se mudar um token, rode e confira ≥ 4,5:1 para texto e ≥ 3:1 para borda
   de campo:
   ```python
   def L(h):
       c=[int(h[i:i+2],16)/255 for i in (1,3,5)]
       c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]
       return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
   def contraste(a,b):
       x,y=sorted([L(a),L(b)],reverse=True); return (x+0.05)/(y+0.05)
   print(contraste("#9AA8C2","#121A2B"))  # 7,24
   ```
3. **Visual:** com o backend de pé (`iniciar.bat`) e `vite`, capturar com Playwright as 3
   abas + Avançado aberto, em 1280×800 e 900×700, antes e depois; salvar em
   `docs/redesign/antes|depois/*.png`. Conferir: nada cortado, sem rolagem horizontal,
   aba ativa visível, foco visível navegando com Tab.
4. **Funcional:** rodar um ranking curto (triagem 50, refino 200) com e sem builds; abrir
   pelo Histórico; copiar uma string do Pawn.

## 9. Desvios encontrados

| Data | Tarefa | Documento dizia | Código real | O que foi feito |
| :--- | :-: | :--- | :--- | :--- |
| | | | | |
