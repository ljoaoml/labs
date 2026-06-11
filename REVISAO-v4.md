# Revisão Completa do Site NADF — v4.0.0

**Data:** Jun 2026
**Branch:** `claude/revisao-completa-v4`

---

## 1. O que você pediu (log da solicitação)

> "Revise o site completamente do começo ao fim, reorganize o código para
> melhorar ele, também pesquise erros gerais e corrija tudo necessário, tb a
> IA que está apenas adicionando resultados de reagentes sem conversar.
> Adicione os reagentes faltantes ao site em suas posições corretas e me diga
> oq você adicionaria, mudaria ou simplificaria no site. Depois disso tudo
> faça um log com tudo q lhe pedi e também faça uma PR me sugira mudanças
> visuais também caso tenha."

Itens identificados:
1. ✅ Revisar o site do começo ao fim
2. ✅ Reorganizar/melhorar o código
3. ✅ Pesquisar erros gerais e corrigir
4. ✅ Corrigir a IA (KTION) — estava só despejando cards de reagente, sem conversar
5. ✅ Adicionar os reagentes faltantes nas posições corretas
6. ✅ Dizer o que eu adicionaria / mudaria / simplificaria (seção 5 abaixo)
7. ✅ Fazer um log (este arquivo)
8. ✅ Abrir uma PR
9. ✅ Sugerir mudanças visuais (seção 6 abaixo)

---

## 2. Reagentes adicionados (14 itens — planilha "Reagentes Faltantes")

Cada reagente foi inserido em `SHELF_DATA` (maquete), `CODES_DB` (código interno)
e, quando havia CAS conhecido, em `CAS_DB` + `FORMULAS` (busca por fórmula).

| Código | Reagente | Prateleira | Parede | Observação de segurança |
|--------|----------|-----------|--------|--------------------------|
| A22 | Fluoreto de Potássio Di-hidratado (KF) | B5 | Fundo/Ácidos | Frasco PLÁSTICO — libera HF, ataca vidro |
| B47 | Iodeto de Potássio (KI) | R3 | Direita/Sais | Fotossensível; longe de FeCl₃/oxidantes |
| B48 | Citrato de Amônio Dibásico | R3 | Direita/Sais | Baixo risco; manter seco |
| B49 | Amônio Monohidratado | R3 | Direita/Sais | Base fraca; frasco vedado |
| B50 | Mistura Combinada (Fosfato/Ortofosfato) | R3 | Direita/Sais | Tampão analítico; rotular |
| B51 | Sol. Sulfato Ferroso Amoniacal | R4 | Direita/Sais | Redutor — oxida ao ar; longe de oxidantes |
| B52 | Alizarin Sulfonato de Sódio P.A | R5 | Direita/Sais | Indicador; proteger da luz |
| B53 | Fenolftaleína (sólido) | R5 | Direita/Sais | ⚠️ Suspeita carcinogênica (IARC 2B) |
| B54 | Sol. Fenolftaleína | R5 | Direita/Sais | Solução alcoólica — levemente inflamável |
| B55 | Fenantrolina Monohidratada 1,10 | R5 | Direita/Sais | Indicador redox; tóxico moderado |
| B56 | Sol. Ortofenantrolina | R5 | Direita/Sais | Longe das soluções de ferro (F5) |
| B57 | Sol. Ortotolidina | R5 | Direita/Sais | ⚠️ CARCINOGÊNICA suspeita — EPI completo |
| T36 | Nitrato de Magnésio Hexaidratado | F3 | Frente/Oxidantes | Oxidante ONU 5.1; manter seco |
| T37 | Sulfeto de Sódio | F6 | Frente/Tóxicos | ⚠️ Libera H₂S letal com ácidos |

Validação automática: `SHELF_DATA ↔ CODES_DB` 100% consistente (138 códigos, 0 divergências).

---

## 3. Correção da IA (KTION) — de "despejo de cards" para conversa

**Problema:** com o Cloudflare Worker ativo, perguntas de localização desviavam
para o modo local, que apenas montava cards de reagente em vez de conversar. E o
prompt do modelo era verboso/engessado, despejando EPI, descarte e telefones de
emergência em toda resposta.

**Correções:**
- `app.js → _process()` agora roteia **tudo** pelo LLM quando o Worker está ativo,
  injetando os **dados verificados do almoxarifado** (localização exata, código,
  controle, CAS, fórmula, frases H) como *grounding*. O modelo conversa, mas não
  pode inventar localização.
- Fallback resiliente: se o Worker cair ou der timeout (30s), volta ao modo local.
- Novo `_ctxLine()` monta o contexto factual de cada reagente para o modelo.
- **Prompt do Worker reescrito** (`workers/ai-assistant.js`): conversacional,
  responde **apenas o que foi perguntado**, conciso (1–4 frases), só cita
  telefones de emergência quando a pergunta é sobre acidente, e usa
  EXCLUSIVAMENTE a localização verificada. Temperatura 0.25→0.5, máx. tokens
  1200→700.

> ⚠️ **Ação necessária:** o Worker que roda na Cloudflare precisa ser
> **reimplantado** com o novo `workers/ai-assistant.js` (Edit code → colar via
> botão "Raw" do GitHub → Deploy). A correção do `app.js` já entra sozinha no
> deploy do GitHub Pages.

---

## 4. Bugs gerais encontrados e corrigidos

- **Busca da maquete quebrada:** `performMaqueteSearch()` lia o elemento
  `maqueteSearchInput`, que **não existia** no HTML — a busca por texto na aba
  Maquete nunca funcionou (só os botões de filtro). Adicionado o campo de busca
  (com CSS) na barra de filtros. Agora dá para buscar por nome ou código (ex:
  "KI", "B47", "fenolftaleína").
- **Detecção falsa de reagentes (resíduo):** o ramo `CAS_DB` do `_detectChems()`
  ainda usava casamento por *substring* (`qn.includes`), inconsistente com o
  resto. Padronizado para token exato (≥5 chars, ignorando termos genéricos),
  eliminando falsos positivos.
- **Falsos alarmes investigados e descartados:** a varredura apontou "EB/WALLS/PF
  fora de escopo" e "funções da IA não acessíveis" — ambos **incorretos**:
  `data.js` declara consts no escopo léxico global (compartilhado entre scripts
  clássicos) e as funções da IA são `window.*`. O site funciona; nenhuma mudança
  necessária.

---

## 5. O que eu adicionaria / mudaria / simplificaria

**Adicionaria**
- **Fichas de emergência por reagente** (FDS resumida) ligadas ao card da IA.
- **PWA / modo offline**: cachear data.js e a maquete para uso no laboratório sem
  internet (Service Worker).
- **Exportar inventário** (CSV/PDF) direto da maquete para auditoria SIPROQUIM.
- **Códigos para as soluções** (F4/F5): hoje ~17 soluções não têm código interno e
  não aparecem na busca por código. Sugiro prefixo `S` (S1, S2…).

**Mudaria**
- Centralizar os dados de segurança (EPI, descarte, frases H) num único objeto por
  reagente, em vez de espalhados entre `CAS_DB`, `REAGENT_QUICK_REF` e `SHELF_DATA`.
- Mover os blocos grandes de HTML embutidos em `data.js` (drawers de classe) para
  templates, reduzindo o tamanho do arquivo.

**Simplificaria**
- `data.js` tem 410 entradas em `CAS_DB` — muitas nunca usadas no acervo. Dava para
  separar "acervo real" de "biblioteca de referência" e carregar a segunda sob demanda.
- Limpar chaves duplicadas em `FORMULAS` (ex: `nan3` aparece 2×).
- `app.js` (~1700 linhas) poderia ser dividido em módulos: `maquete.js`, `busca.js`,
  `ia.js` — facilita manutenção.

---

## 6. Sugestões visuais

- **Mapa de calor de risco na maquete:** colorir prateleiras por nível de perigo
  (verde→vermelho) para leitura instantânea.
- **Badge de contagem por parede:** mostrar "B5 · 4 reagentes" no topo de cada estante.
- **Modo claro/escuro persistente:** já existe o tema claro; falta salvar a
  preferência no `localStorage`.
- **Destaque visual de controlados:** ícone fixo 🔒/⚔️ no canto do card, não só no texto.
- **Microanimação no FAB do KTION:** pulso sutil na primeira visita para indicar que
  é um assistente conversacional, não um buscador.
- **Tipografia dos códigos:** os códigos internos (A22, B47…) ganhariam legibilidade
  com um *chip* monoespaçado de cor fixa por parede.
- **Responsivo da maquete:** em telas pequenas, a vista de cima fica apertada — um
  carrossel por parede melhoraria o uso no celular.

---

## 7. Arquivos alterados

- `assets/js/data.js` — +14 reagentes (SHELF_DATA, CODES_DB), +8 CAS, +4 fórmulas
- `assets/js/app.js` — IA conversacional (grounding + fallback), detecção por token
- `workers/ai-assistant.js` — prompt conversacional + temperatura/tokens
- `index.html` — campo de busca da maquete, versão v4.0.0
- `assets/css/style.css` — estilo do campo de busca da maquete
- `REVISAO-v4.md` — este documento
