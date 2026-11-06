# Banco de Dados de Loot M+ — Season 2

> Todos os drops de Mítico+ relevantes para Bruxo Demonologia, Sacerdote Sombra e Druida Equilíbrio. Organizado por tipo de armadura e por slot.
>
> **Origem:** [`mplus_loot_database.json`](mplus_loot_database.json:1) · **Patch:** 12.1.5 · **Atualizado:** 2026-11-05

---

## 1. Como ler este documento

- **Nível de item:** todos os registros estão no **nível máximo do próprio item**, vindo do tooltip oficial. Comparar dois itens exige normalizar o nível.
- **Atributos:** escritos como `Crítico + Maestria`, na ordem em que aparecem no item.
- **Conjurador:** os três specs deste projeto usam **Intelecto**. Itens marcados com Força ou Agilidade estão listados por completude, mas **não servem**.

### Regra de ouro

> **+13 de nível de item** geralmente compensa uma combinação de atributos secundários subótima. Abaixo disso, a combinação certa ganha.

---

## 2. Nível de item por chave

| Chave | Nível do drop | Track | Brasão |
| :-: | :-: | :--- | :--- |
| 2 | 295 | Campeão 2/6 | Brumoso do Campeão |
| 3 | 298 | Campeão 3/6 | Brumoso do Campeão |
| 4 | 301 | Campeão 4/6 | Brumoso do Campeão |
| 5 | 304 | Campeão 5/6 | Brumoso do Campeão |
| 6 | 307 | Campeão 6/6 | Brumoso do Campeão |
| 7 | 311 | Herói 1/6 | Nebuloso do Herói |
| 8 | 314 | Herói 2/6 | Nebuloso do Herói |
| 9 | 317 | Herói 3/6 | Nebuloso do Herói |
| 10 | 320 | Herói 4/6 | Nebuloso do Herói |
| 11 | 323 | Herói 5/6 | Nebuloso do Herói |
| 12 | 326 | Herói 6/6 | Nebuloso do Herói |

> 💡 **Great Vault** de M+ pode oferecer nível **Mítico** mesmo com chaves mais baixas.

### Forjado com Peçonha

Pescoço, berloque e arma com o rótulo **Ascendente Forjado com Peçonha** ganham **+7** de nível sobre o teto do track: **328** no Herói e **341** no Mítico. Detalhes em [`season2_context.md`](season2_context.md:1), seção 8.

---

## 3. Acessórios

### Pescoço

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Feixe de Presas Protetoras** | 273781 | Crítico + Aceleração |
| **Pingente da Fúria Maléfica** | 251142 | Aceleração + Maestria |
| **Enxerto dos Domanaar** | 251234 | Crítico + Maestria |
| **Jugo do Urso Atacante** | 251173 | Aceleração + Crítico |

### Anéis

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Elo do Senhor da Guerra Amani** | 273792 | Aceleração + Crítico |
| **Sinete da Servidão Sibilante** | 251136 | Crítico + Maestria |
| **Vínculo do Guardião da Luz** | 251194 | Maestria + Versatilidade |
| **Sinete Doentio de Atroxus** | 252258 | Aceleração + Maestria |
| **Elo Precioso Surrupiado** | 251148 | Crítico + Versatilidade |
| **Elo Ofídico de Jade** | 162544 | Maestria + Versatilidade |
| **Elo de Arenito Carregado** | 158366 | Crítico + Maestria |
| **Anel do Vinculador Ritual** | 159459 | Aceleração + Versatilidade |

### Costas

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Mortalha do Inferninho** *Speakeasy Shroud* | 251132 | Crítico + Maestria |
| **Burnous do Espinho Sangrento** | 251190 | Aceleração + Maestria |
| **Clâmide à Prova de Fogo** | 193763 | Aceleração + Crítico |
| **Manto das Tribos Irrequietas** | 159288 | Maestria + Versatilidade |

---

## 4. Berloques

### Por masmorra

| Masmorra | Item | ID | Concede | Tipo |
| :--- | :--- | :-: | :--- | :--- |
| **Altar das Presas** | **Ampola Torpe de Peçonha Volátil** | 273796 | Intelecto | Ativo |
| | **Nó de Serpentes Contorcidas** | 273794 | Intelecto | **Passivo** |
| | Estandarte de Guerra Amani Esfarrapado | 273797 | ❌ **Agilidade ou Força** | Ativo |
| | Pedra-presa Retorcida | 273795 | ❌ **Força** | Ativo |
| **Travessa dos Assassinos** | **Frasco do Cargueiro** | 250215 | Intelecto | Ativo |
| | Pedra-fole Ressonante | 250228 | ❌ **Agilidade ou Força** | Passivo |
| **O Vale Ofuscante** | **Núcleo Altaluz** | 250214 | Intelecto | Passivo |
| | Semente da Natureza Voraz | 250238 | ❌ **Força** | Ativo |
| **Arena da Chaga do Caos** | **Signo do Furamentes** | 250224 | Intelecto | Passivo |
| | Mandato de Execução do Caos | 250225 | ❌ **Agilidade** | Ativo |
| **Covil de Nalorakk** | Ídolo do Loa da Guerra | 250229 | ❌ **Força** | Passivo |
| **Poços da Vida Rubi** | **Casca de Dragonete Rubi** | 193757 | Intelecto | Híbrido |
| | Casco de Ataflamas | 193762 | ❌ Força no efeito | Ativo |
| **Templo de Sethraliss** | Eletromental Pequeno no Pote | 158374 | ❌ **Agilidade** | Passivo |
| | Presa de Merektha | 158367 | ❌ **Força** | Ativo |
| **Repouso do Rei** | **Emblema Tempestuoso de Dazar** | 273649 | Intelecto | Ativo |
| | Plumagem Dourada Lustrosa | 159617 | ❌ **Agilidade** | Ativo |

> ⚠️ **Dez berloques de M+ não servem a conjurador.** Todos estão marcados com `usavel_por_conjurador: false` no JSON, e o script [`tools/conferir_primario_berloques.js`](tools/conferir_primario_berloques.js:1) reconfere os 19 berloques do banco contra o tooltip oficial a cada execução. O caso mais grave foi o **Ídolo do Loa da Guerra**, que chegou a constar como BiS de M+ do Bruxo: o tooltip oficial confirma **290 de Força** por 15 s.
>
> Na revisão de 2026-11-05 dois itens foram **reclassificados**: **Estandarte de Guerra Amani Esfarrapado** (`273797`) e **Pedra-fole Ressonante** (`250228`) estavam listados como "Intelecto", quando o tooltip mostra **+191 [Agilidade ou Força]**.

### Ranking de conjurador

| Tier | Itens |
| :--- | :--- |
| **S** | Emblema Tempestuoso de Dazar (Repouso do Rei) — melhor sem raide |
| **A** | Ampola Torpe de Peçonha Volátil (Altar das Presas) · Nó de Serpentes Contorcidas (Altar das Presas, passivo) |
| **B** | Frasco do Cargueiro · Signo do Furamentes |
| **Excluídos** | Os dez marcados com ❌ acima |

### O Catalisador muda o ranking de masmorras

Uma masmorra não é só uma lista de itens: ela também pode ser uma **fonte de tier**. Todo drop em **Cabeça, Ombros, Peitoral, Mãos e Pernas** no track **Mítico** é matéria-prima de tier, porque o Matrix Catalyst converte a peça no tier do spec **mantendo o track e o ilvl**.

| Regra | Efeito |
| :--- | :--- |
| Peça **Mítica 6/6** catalisada | vira **tier Mítico 6/6 — ilvl 334** |
| Peça **Heroica 6/6** catalisada | vira **tier Heroico 6/6 — ilvl 321** |
| Slot **sem tier** (capa, pulso, cintura, pés, pescoço, anel, berloque, arma) | O Catalyst **não resolve**: só o drop em si serve |

Na hora de escolher onde gastar o **Núcleo Vazio Nebuloso**, some esse valor ao valor de BiS: um drop de slot de tier no Mítico continua valendo mesmo com secundários fora do BiS. A ordem completa está em [`season2_context.md`](season2_context.md:24) e em `catalisador_na_comparacao` no JSON.

---

## 5. Armadura de tecido

Serve a **Bruxo Demonologia** e **Sacerdote Sombra**.

> A coluna **Atributos** mostra só o *combo* de secundários. Os **valores reais de jogo** de cada peça estão em `stats_oficiais` no JSON (Intelecto, Vigor, Crítico, Aceleração, Maestria, Versatilidade e ilvl), conferidos contra o tooltip oficial. O campo antigo `stats_secundarios` usa uma escala relativa de 0 a 10 e **não** são números do jogo.

### Cabeça

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Copa da Raiz-Mundo** | 251199 | Crítico + Maestria |
| **Diadema do Feitor** | 251232 | Aceleração + Maestria |
| **Turbante do Primeiro Império** | 239047 | Crítico + Versatilidade |

### Ombros

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Brafoneiras do Envenenador** | 251227 | Maestria + Versatilidade |
| **Sobreveste do Purificador da Ninhada** | 239031 | Crítico + Aceleração |
| **Dragonas da Ascensão Cerimonial** | 239045 | Aceleração + Maestria |

### Peitoral

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Veste de Ritos Primordial** | 273785 | Aceleração + Maestria |
| **Camisa Calcinante do Evocador** | 251139 | Aceleração + Crítico |
| **Mantelete da Colheita Acumulado** | 251147 | Maestria + Versatilidade |
| **Vestes da Serpente Renascida** | 239032 | Crítico + Maestria |

### Pulsos

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Embraces Mordisqueiros** | 251127 | Aceleração + Crítico |
| **Braçadeiras do Abraço do Inverno** | 251154 | Crítico + Maestria |
| **Braceletes da Correnteza Serpeante** | 159263 | Crítico + Versatilidade |

### Mãos

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Mitenes de Ritos Blasfemos** | 273773 | Crítico + Maestria |
| **Amarras Adulteradas** | 251129 | Maestria + Versatilidade |
| **Mitenes da Polaridade Oscilante** | 159247 | Crítico + Aceleração |

### Cinto

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Cilha Botão de Luz** | 251185 | Aceleração + Maestria |
| **Atadura do Éter Etérea** | 251222 | Aceleração + Crítico |
| **Cordão Sela Celeste** | 193691 | Aceleração + Maestria |
| **Faixa Ouroborial** | 159255 | Maestria + Versatilidade |

### Pernas

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Perneiras de Serpentes Entrelaçadas** | 273786 | Crítico + Aceleração |
| **Guarda-pernas do Sonho Florestal** | 251160 | Aceleração + Crítico |
| **Calções do Dispara-vento** | 193750 | Crítico + Maestria |
| **Calções Forrados de Penugem** | 159234 | Crítico + Maestria |

### Botas

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Sandálias Tempestuosas** | 251137 | Aceleração + Maestria |
| **Sandálias de Areeiro** | 159259 | Crítico + Aceleração |
| **Sandálias do Vodu Sábio** | 159243 | Aceleração + Versatilidade |

---

## 6. Armadura de couro

Serve ao **Druida Equilíbrio**.

### Cabeça

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Capuz do Porta-voz Sobressalente** | 273791 | Aceleração + Crítico |
| **Socapa do Diabo Vil** | 251140 | Aceleração + Maestria |
| **Coroa das Tempestades Estrondosas** | 193751 | Crítico + Versatilidade |
| **Capuz do Loa Serpenteante** | 239033 | Crítico + Aceleração |

### Ombros

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Espaldares de Couro de Cobra** | 273774 | Crítico + Versatilidade |
| **Espaldares Lúgubres** | 251223 | Crítico + Aceleração |
| **Espaldares do Catador** | 251146 | Crítico + Versatilidade |

### Peitoral

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Pelego da Pestilência** | 251226 | Crítico + Versatilidade |
| **Vestimenta da Provação de Guerra** | 251159 | Aceleração + Maestria |
| **Couraça da Tempestade de Fogo do Invasor** | 193764 | Maestria + Versatilidade |
| **Colete da Adoração Reverente** | 239048 | Crítico + Maestria |

### Pulsos

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Vírias Furiadornadas** | 251135 | Aceleração + Crítico |
| **Munhequeiras de Guardirraiz** | 251183 | Crítico + Maestria |
| **Munhequeiras Carniceiras de Kula** | 159300 | Crítico + Versatilidade |

### Mãos

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Manoplas da Defesa Febril** | 251124 | Crítico + Aceleração |
| **Garras Congelantes do Subjugante** | 193758 | Crítico + Versatilidade |
| **Guantes da Defesa Eletrizada** | 159337 | Maestria + Versatilidade |
| **Luvas Abençoadas do Dissecador** | 159312 | Crítico + Maestria |

### Cinto

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Arnês do Andarraiz** | 251189 | Crítico + Versatilidade |
| **Cinturão Gravítico** | 251235 | Maestria + Versatilidade |
| **Faixa do Dervixe Giratório** | 159317 | Aceleração + Maestria |
| **Cinto do Dinomante Primevo** | 159301 | Crítico + Aceleração |

### Pernas

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Calções do Acordo Célere** | 251130 | Crítico + Maestria |
| **Perneiras de Esporo Luminoso** | 251198 | Maestria + Versatilidade |
| **Perneiras da Víbora Borrascante** | 159329 | Maestria + Versatilidade |
| **Calções do Salão Sagrado** | 159313 | Aceleração + Versatilidade |

### Botas

| Item | ID | Atributos |
| :--- | :-: | :--- |
| **Culotes do Explorador Ártico** | 251153 | Aceleração + Crítico |
| **Sandálias de Couro de Cobra Polido com Areia** | 159327 | Crítico + Maestria |
| **Botas Plumáurea** | 159304 | Maestria + Versatilidade |

---

## 7. Armas

### Adagas

| Item | ID | Primário | Secundários |
| :--- | :-: | :--- | :--- |
| **Canalizador de Lumineira Polido** | 273778 | ✅ Intelecto | Aceleração + Maestria |
| **Presa do Contágio** | 251225 | ✅ Intelecto | Maestria + Versatilidade |
| **Dente de Serpente Folheado** | 159137 | ✅ Intelecto | Aceleração + Versatilidade |
| Navalha de Lumineira Afiada | 275070 | ❌ Agilidade | Crítico + Aceleração |
| Laminúrio | 251128 | ❌ Agilidade | Crítico + Maestria |
| Lâmina Espinhosa | 251180 | ❌ Agilidade | Aceleração + Maestria |
| Rondel Céu-ferno | 193756 | ❌ Agilidade | Aceleração + Versatilidade |
| Adaga Ornamentada da Subjugação | 159136 | ❌ Agilidade | Aceleração + Maestria |

> ⚠️ **Cinco das oito adagas são de Agilidade.** Para conjurador, só as três primeiras servem.

### Mãos secundárias

Todas de **Intelecto** — todas servem.

| Item | ID | Secundários |
| :--- | :-: | :--- |
| **Presa Focal Maléfica** | 273779 | Crítico + Aceleração |
| **Broto Luminescente** | 251191 | Aceleração + Maestria |
| **Patuá Atagelo Perene** | 271681 | Crítico + Maestria |
| **Bastão da Combustão de Kokia** | 193766 | Crítico + Versatilidade |
| **Receptáculo dos Últimos Ritos** | 159667 | Aceleração + Versatilidade |

---

## 8. Conjuntos de Delve

### Tecido — Pisa-piras

| Peça | ID |
| :--- | :-: |
| Perponte do Pisa-piras | 272231 |
| Mitra do Pisa-piras | 272234 |
| Dragonas do Pisa-piras | 272236 |
| Obi do Pisa-piras | 272237 |
| Luvas do Pisa-piras | 272233 |
| Botinas do Pisa-piras | 272235 |
| Cingidouro do Pisa-piras | 272238 |
| Alpargatas do Pisa-piras | 272232 |

### Couro — Espreitador das Brumas

| Peça | ID |
| :--- | :-: |
| Brigandina do Espreitador das Brumas | 272239 |
| Chapins do Espreitador das Brumas | 272240 |
| Guantes do Espreitador das Brumas | 272241 |
| Capucho do Espreitador das Brumas | 272242 |
| Cuísses do Espreitador das Brumas | 272243 |
| Espaldares do Espreitador das Brumas | 272244 |
| Cilha do Espreitador das Brumas | 272245 |
| Pulseiras do Espreitador das Brumas | 272246 |

> Os conjuntos de Delve estão detalhados em [`delve_loot_kindojan.md`](delve_loot_kindojan.md:1).

---

## 9. Errata aplicada em 2026-11-05

| Correção | Detalhe |
| :--- | :--- |
| **Capa de Murder Row** | "Clâmide de Vodu Sedosa" **não existe**. A capa é **Mortalha do Inferninho** (`251132`), cujo nome oficial em inglês é *Speakeasy Shroud* |
| **Berloque de Covil de Nalorakk** | Não é o Ídolo do Loa da Guerra. Ele concede **Força** e foi excluído |
| **Dragonas da Ascensão Cerimonial** | Confirmado: ombros de tecido, de Repouso do Rei, `239045` |
| **Arma do Druida** | Equilíbrio usa **1H + mão secundária**, não cajado: Jan'thrazet + Lanterna de Aln'hara |
| **Track de Delve** | Fragmento de Alma Mítica gera **Mítico 2/6** (nível 321), não Mítico 1/6 (318) |
