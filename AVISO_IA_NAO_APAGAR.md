# ⚠️ AVISO IMPORTANTE PARA AGENTES DE IA: NÃO APAGAR OU MOVER ESTE DIRETÓRIO

> **STATUS:** REPOSITÓRIO OFICIAL E ATIVO DO PROJETO  
> **ORIGEM:** https://github.com/carlosfylho-hub/Simulator-WoW  
> **DATA DE ADIÇÃO:** Novembro de 2026  
> **SOLICITANTE:** Usuário (`carlo`)  

---

## 📌 Contexto e Justificativa

Este diretório (`Simulator-WoW`) foi adicionado a esta pasta (`C:\Users\carlo\Desktop\Simulador WoW`) por **solicitação direta e explícita do usuário**, integrando a suíte de ferramentas de simulação para **World of Warcraft: Midnight (Patch 12.1.5)**.

A pasta principal (`Simulador WoW`) é composta por:
1. `simc-midnight`: Código-fonte / builds do SimulationCraft adaptados para o Midnight.
2. `wow-sim`: Scripts de automação, pipelines de scraping e dados de suporte.
3. `Simulator-WoW`: **Interface web completa e motor de decisão estratégica** (WoW Midnight Decision Engine - S2), exportado do Google AI Studio e hospedado no GitHub.

---

## 🛠️ O que contém o `Simulator-WoW`

- **Frontend interativo**: Desenvolvido em React 19, TypeScript, Vite e TailwindCSS.
- **Motores de Cálculo e Decisão**:
  - Protocolo de substituição de equipamentos (G0 a G8).
  - Inspetor, comparador e exportador de perfis do SimulationCraft (`simcParser.ts`, `simcExporter.ts`).
  - Simulador de builds e seleção de cenários de combate.
  - Gestão de Imersões (Delves - Kindo'jan), Folio Ômnico e Runas da Season 2.
  - Roadmap estratégico para progressão sem raide (No-Raid).
- **Backend & Integração IA**:
  - Servidor Express (`server.ts`) com integração Gemini API (`@google/genai`) para o consultor estratégico em tempo real (`AiConsultantDrawer.tsx`).
- **Base de Conhecimento e Auditorias**:
  - Acervo de documentação em Markdown com tabelas de drops M+, itens e regras de auditoria em `public/assets/aistudio/`.

---

## 🚫 Regra Mandatória para IAs / Assistentes de Código

1. **NÃO EXCLUA** esta pasta nem seus subdiretórios ou arquivos.
2. **NÃO TRATE** este repositório como lixo temporário, cache ou arquivo residual de teste.
3. **MANTENHA** o vínculo com o repositório remoto Git para atualizações futuras (`git pull` / `git push`).
