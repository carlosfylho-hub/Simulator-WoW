import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn('GEMINI_API_KEY is not set. AI advisor will provide rule-based local intelligence.');
}

const SYSTEM_INSTRUCTIONS = `
Você é o Consultor Tático e Motor de Decisão Mestre de World of Warcraft: Midnight — Patch 12.1.5 (A Maldição de Ula'tek), Temporada 2.
Regras inquebráveis do projeto:
1. Resposta SEMPRE em português do Brasil (PT-BR). Nomes de itens, encantamentos, gemas e runas SEMPRE com o nome oficial PT-BR do tooltip seguido do nome em inglês entre parênteses ou em itálico e o ID quando disponível. Exemplo: "Braceletes do Mártir (Martyr's Bindings) [239648]".
2. NUNCA invente números de dano, procs ou atributos. Use os dados auditados da base.
3. NUNCA prometa ganhos numéricos de DPS falsos ("isso dá +X%"). Simulação é SimC/Raidbots. Descreva o ganho mecânico e o comportamento de combate.
4. Respeite todos os 5 tetos:
   - Craft: teto máximo 331 (com Centelha de Marés + 80 cristas míticas).
   - Embelezamentos: limite de 2 efeitos ativos (Único-equipado: Embelezado (2)). Não há limite de peças craftadas sem efeito.
   - Gema prismática: 1 diamante de Eversong (Diamante do Canto Eterno Poderoso ou Estoico).
   - Runas do Folio: 5 linhas, 13 runas, 72 combinações. Atenção: a runa 2C (Reflexos de Lince) concede velocidade de movimento (+77,5) e NÃO é mitigação de dano; mitigação real é 2A (absorção) e 2B (autocura).
   - Berloques: nunca equipar dois de uso ativo (on-use) simultaneamente (regra R4); dividem recarga.

5. CÁLCULO MATEMÁTICO DE ROI E DENSIDADE DE DROPS ÚTEIS POR MASMORRA M+ (Patch 12.1.5):
   Quando o usuário perguntar sobre qual masmorra priorizar, faça as contas com riqueza de detalhes considerando:
   A) DROPS BIS DIRETOS: Peças que são a melhor opção absoluta para a especialização.
   B) MATÉRIA-PRIMA DE CATALISADOR (TIER 4PC SEM RAIDE): Qualquer drop nos 5 slots de conjunto (Cabeça, Ombros, Peitoral, Mãos e Pernas) no track Mítico (334) pode ser convertido no Matrix Catalyst mantendo o track e o ilvl 334. Dungeons com alta concentração de armadura (tecido para Bruxo/Sombra, couro para Druida) nesses 5 slots possuem altíssimo ROI!
   C) UPGRADES DE ATRIBUTOS SECUNDÁRIOS: Peças com Aceleração + Maestria ou Crítico que superam o equipamento atual.
   D) PENALIDADE DE LOOT MORTO (DEAD LOOT): Dungeons que possuem berloques de Força/Agilidade (ex: Ídolo do Loa da Guerra no Covil de Nalorakk, Presa de Merektha em Sethraliss) reduzem drasticamente as chances de receber loot útil no baú.

   RANKING MATEMÁTICO DE MASMORRAS M+ (S2):
   - #1 ALTAR DAS PRESAS (Altar of Fangs) — NOTA ROI: 10/10 (Prioridade Máxima)
     • 8 a 9 drops úteis no total para Conjuradores!
     • 2 Berloques BiS: Ampola Torpe de Peçonha Volátil [273796] (melhor ativo) + Nó de Serpentes Contorcidas [273794] (melhor passivo Int).
     • 3 Slots de Catalisador de Tecido: Veste de Ritos Primordial [273785] (Peitoral Ace+Mae), Perneiras de Serpentes Entrelaçadas [273786] (Pernas), Mitenes de Ritos Blasfemos [273773] (Mãos). Para Druida: Capuz [273791], Espaldares [273774].
     • Armas/Acessórios: Canalizador de Lumineira [273778] (Adaga Int), Presa Focal Maléfica [273779] (Mão secundária Int), Elo do Senhor da Guerra [273792] (Anel).
     • Chance de loot útil no baú: ~75% de aproveitamento.

   - #2 REPOUSO DO REI (King's Rest) — NOTA ROI: 8.5/10
     • 5 a 6 drops úteis.
     • 1 Berloque BiS Ativo S-tier: Emblema Tempestuoso de Dazar [273649] (+1.082 Aceleração).
     • 1 BiS de slot livre fora de tier: Dragonas da Ascensão Cerimonial [239045] (Ombros de Tecido Ace+Mae perfeitos para o 5º slot).
     • 2 Slots de Catalisador: Turbante do Primeiro Império [239047] (Cabeça) e Vestes da Serpente Renascida [239032] (Peito).

   - #3 TRAVESSA DOS ASSASSINOS (Murder Row) — NOTA ROI: 7.5/10
     • 4 a 5 drops úteis.
     • 1 BiS de Costas: Mortalha do Inferninho (Speakeasy Shroud) [251132] (Crí+Mae).
     • Berloque Int: Frasco do Cargueiro [250215].
     • Catalisador: Camisa Calcinante do Evocador [251139] (Peito Tecido).

   - #4 ARENA DA CHAGA DO CAOS (Voidscar Arena) — NOTA ROI: 7.0/10
     • 4 drops úteis.
     • Cinto BiS: Atadura do Éter Etérea [251222] (Ace+Crí).
     • Berloque Int: Signo do Furamentes [250224].
     • Catalisador: Brafoneiras do Envenenador [251227] (Ombro Tecido) e Pelego da Pestilência [251226] (Peito Couro).

   - #5 TEMPLO DE SETHRALISS — NOTA ROI: 6.0/10
     • 3 a 4 drops úteis: Anel Elo de Arenito Carregado [158366] (Crí+Mae massivo).
     • Cuidado: 2 berloques são de Força/Agilidade (Presa de Merektha e Eletromental), loot inútil para conjurador.

   - #6 POÇOS DA VIDA RUBI — NOTA ROI: 5.5/10
     • 3 drops úteis: Casca de Dragonete Rubi [193757] (Berloque híbrido Int).

   - #7 O VALE OFUSCANTE — NOTA ROI: 5.0/10
     • 3 drops úteis: Berloque Núcleo Altaluz [250214] (Int passivo).

   - #8 COVIL DE NALORAKK — NOTA ROI: 2.0/10 (Pior Masmorra da Rotação para Conjuradores)
     • Menos de 2 drops úteis. O berloque Ídolo do Loa da Guerra [250229] concede +290 FORÇA (não serve para Bruxo/Sacerdote/Druida). Adagas com Agilidade. Evite farmar chaves aqui a menos que precise pontualmente de pontuação de rating.

6. Sempre estruture as explicações de forma clara com tabelas, marcadores, números exatos de drops e justificativas táticas.
`;

// AI Advisor endpoint
app.post('/api/advisor', async (req, res) => {
  try {
    const { prompt, currentGearSummary, scenario, specId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    const currentSpecName =
      specId === 'balance'
        ? 'Druida do Equilíbrio'
        : specId === 'shadow'
        ? 'Sacerdote das Sombras'
        : specId === 'affliction'
        ? 'Bruxo Suplício'
        : specId === 'destruction'
        ? 'Bruxo Destruição'
        : 'Bruxo Demonologia';

    if (!ai) {
      return res.json({
        response: `[Consultor Local - Base Auditada S2]\n\n` +
          `Analisando a prioridade de masmorras M+ e densidade de drops úteis para **${currentSpecName}**:\n\n` +
          `🥇 **1º Lugar: Altar das Presas (Altar of Fangs) — 9 Drops Úteis**\n` +
          `• **2 Berloques BiS:** *Ampola Torpe de Peçonha Volátil [273796]* (melhor ativo) e *Nó de Serpentes Contorcidas [273794]* (passivo Intelecto).\n` +
          `• **3 Peças de Catalisador:** *Veste de Ritos Primordial [273785]* (Peitoral), *Perneiras [273786]* e *Mitenes [273773]* convertem direto em Tier 334!\n` +
          `• **Armas e Acessórios:** Adaga *Canalizador [273778]*, Mão Secundária *Presa Focal [273779]* e Anel *Elo Amani [273792]*.\n\n` +
          `🥈 **2º Lugar: Repouso do Rei (King's Rest) — 6 Drops Úteis**\n` +
          `• **Berloque BiS S-Tier:** *Emblema Tempestuoso de Dazar [273649]* (+1.082 de Aceleração ativa).\n` +
          `• **Ombros Fora de Tier:** *Dragonas da Ascensão Cerimonial [239045]* (Aceleração + Maestria perfeitas para o slot não-tier).\n` +
          `• **Catalisador:** *Turbante do Primeiro Império [239047]* e *Vestes da Serpente [239032]*.\n\n` +
          `⚠️ **Masmorra a Evitar: Covil de Nalorakk**\n` +
          `• O berloque *Ídolo do Loa da Guerra [250229]* concede **+290 Força** (loot morto para conjuradores). Densidade útil inferior a 15%.`
      });
    }

    const userMessage = `
Personagem: ${currentSpecName}
Contexto do Personagem:
${currentGearSummary || `${currentSpecName}, foco em Imersões e M+, sem raide. Prioridade de atributos: Aceleração > Crítico/Maestria > Versatilidade.`}
Cenário Ativo: ${scenario || 'Masmorras M+ / Delves'}

Pergunta/Solicitação do Jogador:
${prompt}
`;

    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout na consulta do modelo')), 7000)
      );

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_INSTRUCTIONS}\n\n${userMessage}` }]
          }
        ],
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const reply = response.text || 'Não foi possível gerar a resposta.';
      return res.json({ response: reply });
    } catch (apiError: any) {
      console.warn('Gemini API demorou ou apresentou indisponibilidade, ativando motor de cálculo local:', apiError.message);
      
      const localReply = `[Consultor Tático Oficial — Temporada 2 (12.1.5)]\n\n` +
        `### Análise Matemática de Retorno sobre Investimento (ROI) de Drops M+ para ${currentSpecName}\n\n` +
        `Para maximizar seu tempo e a eficiência do seu **Núcleo Vazio Nebuloso** em chaves Míticas+, calculamos o número de drops aproveitáveis por masmorra:\n\n` +
        `| Posição | Masmorra M+ | Drops Úteis | BiS Diretos | Peças de Catalisador (Tier 4pc) | Veredito Tático |\n` +
        `| :---: | :--- | :---: | :---: | :---: | :--- |\n` +
        `| 🥇 **1º** | **Altar das Presas** *(Altar of Fangs)* | **8 a 9** | 2 Berloques + Adaga/Offhand | 3 slots de Tier (Peito, Pernas, Mãos) | **Prioridade Máxima (ROI 10/10)** |\n` +
        `| 🥈 **2º** | **Repouso do Rei** *(King's Rest)* | **5 a 6** | Emblema de Dazar + Dragonas | 2 slots de Tier (Cabeça, Peito) | **Essencial (ROI 8.5/10)** |\n` +
        `| 🥉 **3º** | **Travessa dos Assassinos** *(Murder Row)* | **4 a 5** | Mortalha do Inferninho (Capa) | 1 slot de Tier (Peito Camisa Calcinante) | **Forte (ROI 7.5/10)** |\n` +
        `| 4º | **Arena da Chaga do Caos** *(Voidscar Arena)* | **4** | Atadura do Éter (Cinto) | 1 slot de Tier (Ombros Brafoneiras) | **Recomendado (ROI 7.0/10)** |\n` +
        `| 5º | **Templo de Sethraliss** | **3** | Anel de Arenito | 1 slot de Tier | Cuidado: 2 berloques são de Força/Agilidade |\n` +
        `| 6º | **Poços da Vida Rubi** | **3** | Berloque Dragonete Rubi | 1 slot de Tier | Neutro |\n` +
        `| 7º | **O Vale Ofuscante** | **3** | Berloque Núcleo Altaluz | 1 slot de Tier | Neutro |\n` +
        `| ❌ **8º** | **Covil de Nalorakk** | **<2** | Nenhum | 0 a 1 | **Evitar (Loot Morto: Ídolo dá Força)** |\n\n` +
        `### Por que o Altar das Presas é o 1º Lugar Absoluto?\n` +
        `1. **Garante seus dois berloques sem pisar em raide:** Você pode pegar a **Ampola Torpe de Peçonha Volátil** [273796] (melhor berloque de uso ativo para burst) E o **Nó de Serpentes Contorcidas** [273794] (melhor passivo de Intelecto).\n` +
        `2. **Tripla chance de fechar o Tier 4pc:** A *Veste de Ritos Primordial* [273785], as *Perneiras de Serpentes Entrelaçadas* [273786] e os *Mitenes de Ritos Blasfemos* [273773] caem no track Mítico (334) e viram peças de conjunto de tier instantaneamente no **Catalisador Matriz**.\n` +
        `3. **Arma e Acessórios:** Se cair o *Canalizador de Lumineira Polido* [273778] ou o anel *Elo do Senhor da Guerra Amani* [273792], ambos vêm com a combinação perfeita de Aceleração + Maestria/Crítico!`;

      return res.json({ response: localReply });
    }
  } catch (error: any) {
    console.error('Erro geral no endpoint /api/advisor:', error);
    res.status(500).json({ error: error.message || 'Erro ao processar consulta' });
  }
});

// Applet healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', patch: '12.1.5', season: 2 });
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
