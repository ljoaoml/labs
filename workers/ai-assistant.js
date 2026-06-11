/**
 * NADF/UNIFENAS — Assistente de Segurança Química
 * Cloudflare Worker: recebe perguntas do frontend, consulta PubChem,
 * injeta contexto e chama o modelo LLM via Cloudflare Workers AI.
 *
 * Deploy:
 *   1. npm install -g wrangler
 *   2. wrangler login
 *   3. wrangler deploy   (a partir da pasta workers/)
 *
 * No dashboard Cloudflare → Workers → seu worker → Settings → Bindings
 *   Adicionar binding AI (tipo: Workers AI)
 */

const SYSTEM_PROMPT = `Você é o KTION, assistente de segurança química do NADF/UNIFENAS (Alfenas-MG). Converse de forma natural e direta, como um colega técnico experiente — não use respostas pré-formatadas nem despeje informação que ninguém pediu.

COMO RESPONDER:
- Responda APENAS o que foi perguntado. Se perguntarem "onde fica X", diga onde fica — não adicione EPIs, descarte ou normas a menos que peçam.
- Seja CONCISO: 1 a 4 frases na maioria dos casos. Sem introduções genéricas ("Claro!", "Com certeza!").
- Quando o usuário pedir, aí sim aprofunde (riscos, EPI, descarte, normas).
- Tom conversacional em português do Brasil. Pode fazer perguntas de volta se a dúvida for ambígua.
- Quando perguntarem seu nome ou quem é você: responda que é o KTION.

REGRA CRÍTICA DE LOCALIZAÇÃO:
- Se a mensagem trouxer um bloco "[Dados verificados do almoxarifado NADF]", use EXCLUSIVAMENTE esses valores para localização, código e controle. NUNCA invente prateleira, parede ou nível.
- Se não houver dados verificados e perguntarem localização, diga que não tem o registro daquele item e sugira conferir na aba Maquete.

CONHECIMENTO DE APOIO (use só quando for pertinente à pergunta):
- Layout: parede Esquerda=Inflamáveis · Fundo=Ácidos · Direita=Sais/Bases · Frente=Tóxicos/Oxidantes. P1-P3 fácil, P4-P6 com escada. Cofre para cianetos/Hg/azida.
- Normas: ABNT NBR 14725:2023 (GHS/FDS), NBR 17160:2024 (labs), NR-26, NR-20, CONAMA 358/2005 (descarte), Lei 10.357/2001 + SIPROQUIM 2 (PF), SisFPC/Exército (ácido nítrico).
- Emergências (cite os números SOMENTE se a pergunta for sobre acidente/intoxicação/derramamento): CIATOX 0800 722 6001 · SAMU 192 · Bombeiros 193.
- Se não souber com segurança, diga isso e recomende a FDS — não invente dados.`;

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método não permitido' }), { status: 405, headers: cors });
    }

    let body;
    try { body = await request.json(); }
    catch { return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400, headers: cors }); }

    const { question = '', history = [] } = body;
    if (!question.trim()) {
      return new Response(JSON.stringify({ error: 'Pergunta não fornecida' }), { status: 400, headers: cors });
    }

    // Buscar dados PubChem para reagentes detectados
    const chemicals = _extractChemicals(question);
    let pubchemCtx = '';
    for (const chem of chemicals.slice(0, 2)) {
      try {
        const pc = await _fetchPubChem(chem);
        if (pc) pubchemCtx += `\n\n[PubChem — ${chem}]\n${_fmtPubChem(pc)}`;
      } catch (_) {}
    }

    const userContent = pubchemCtx
      ? `${question}\n\n--- Dados PubChem relevantes: ---${pubchemCtx}`
      : question;

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-6),
      { role: 'user', content: userContent },
    ];

    try {
      const ai = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages,
        max_tokens: 700,
        temperature: 0.5,
      });
      return new Response(JSON.stringify({
        answer: ai.response || ai.result?.response || 'Sem resposta do modelo.',
        sources: chemicals.length ? ['PubChem (NIH)'] : [],
      }), { headers: cors });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Erro ao chamar modelo IA', detail: String(err) }), { status: 500, headers: cors });
    }
  },
};

function _extractChemicals(text) {
  const found = new Set();
  const patterns = [
    // Fórmulas simples (H2SO4, NaOH, HCl, KMnO4…)
    /\b(?:H\d*(?:SO\d|NO\d|PO\d|CO\d|ClO\d|Cl|F|Br|I)|Na(?:OH|Cl|HCO3|NO3|N3|AsO2)|K(?:OH|CN|MnO4|BrO3|IO3|Cr2O7|2CrO4)|Ca(?:OH|Cl)2?|(?:HgCl|HgO|HgI|HgSO)[\d]*|NH4(?:OH|Cl)|Fe(?:SO4|Cl)[\d]*|CuSO4|ZnSO4|MnSO4|AgNO3|SnCl2)\b/gi,
    // Padrão genérico de fórmula
    /\b[A-Z][a-z]?(?:\d*[A-Z][a-z]?\d*){1,6}\b/g,
    // Nomes comuns
    /(?:ácido|acido)\s+\w+(?:\s+\w+)?/gi,
    /(?:hidróxido|hidroxido|hidrato|cloreto|sulfato|nitrato|carbonato|fosfato|cianeto|arsenito|bromato|iodato|dicromato|cromato|persulfato|oxalato|tiossulfato)\s+de\s+\w+(?:\s+\w+)?/gi,
    /(?:etanol|metanol|acetona|clorofórmio|cloroformio|benzeno|hexano|fenol|acetato)\b/gi,
  ];
  for (const pat of patterns) {
    (text.match(pat) || []).forEach(m => {
      const c = m.trim();
      if (c.length >= 3 && !/^(?:Para|Como|Onde|Qual|Que|Por|Em|De|Do|Da|Um|Uma|Os|As|O|A|É|Se|Na|No)$/i.test(c)) {
        found.add(c);
      }
    });
  }
  return [...found].slice(0, 3);
}

async function _fetchPubChem(name) {
  const enc = encodeURIComponent(name);
  const cidRes = await fetch(
    `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${enc}/cids/JSON`,
    { signal: AbortSignal.timeout(6000) }
  );
  if (!cidRes.ok) return null;
  const cidJson = await cidRes.json();
  const cid = cidJson.IdentifierList?.CID?.[0];
  if (!cid) return null;

  const [propRes, ghsRes] = await Promise.allSettled([
    fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`, { signal: AbortSignal.timeout(6000) }),
    fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=Chemical+Safety`, { signal: AbortSignal.timeout(6000) }),
  ]);

  const props = propRes.status === 'fulfilled' && propRes.value.ok ? await propRes.value.json() : null;
  const ghs   = ghsRes.status === 'fulfilled'  && ghsRes.value.ok  ? await ghsRes.value.json()  : null;

  const p = props?.PropertyTable?.Properties?.[0];
  const hPhrases = _extractHPhrases(ghs);
  const pics     = _extractPictograms(ghs);

  return { cid, formula: p?.MolecularFormula, iupac: p?.IUPACName, weight: p?.MolecularWeight, hPhrases, pictograms: pics };
}

function _fmtPubChem(d) {
  const parts = [`CID: ${d.cid}`];
  if (d.formula) parts.push(`Fórmula: ${d.formula}`);
  if (d.iupac)   parts.push(`IUPAC: ${d.iupac}`);
  if (d.weight)  parts.push(`PM: ${d.weight} g/mol`);
  if (d.pictograms?.length) parts.push(`Pictogramas GHS: ${d.pictograms.join(', ')}`);
  if (d.hPhrases?.length)   parts.push(`Frases H: ${d.hPhrases.slice(0,5).join(', ')}`);
  return parts.join(' | ');
}

function _extractHPhrases(data) {
  const found = new Set();
  function walk(sections) {
    for (const s of sections ?? []) {
      for (const info of s.Information ?? []) {
        for (const swm of info.Value?.StringWithMarkup ?? []) {
          const m = swm.String?.match(/\bH\d{3}\b/);
          if (m) found.add(m[0]);
        }
      }
      walk(s.Section);
    }
  }
  walk(data?.Record?.Section ?? []);
  return [...found];
}

function _extractPictograms(data) {
  const found = new Set();
  function walk(sections) {
    for (const s of sections ?? []) {
      for (const info of s.Information ?? []) {
        for (const swm of info.Value?.StringWithMarkup ?? []) {
          for (const mk of swm.Markup ?? []) {
            const m = mk.URL?.match(/\/ghs\/(GHS\d+)\.svg/i);
            if (m) found.add(m[1]);
          }
          const sm = swm.String?.match(/GHS\d+/i);
          if (sm) found.add(sm[0].toUpperCase());
        }
      }
      walk(s.Section);
    }
  }
  walk(data?.Record?.Section ?? []);
  return [...found];
}
