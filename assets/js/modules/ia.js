
  // ══════════════════════════════════════════════════════════════════
  // AI ASSISTANT — NADF Segurança Química
  // Assistente local com PubChem + Cloudflare Worker opcional (LLM).
  // Para ativar LLM real: window.AI_WORKER_URL = 'https://seu.workers.dev'
  // ══════════════════════════════════════════════════════════════════
  (function() {

  const AI_WORKER_URL = (typeof window !== 'undefined' && window.AI_WORKER_URL) || null;
  let _aiOpen = false, _aiHistory = [], _aiBusy = false;

  window.toggleAIChat = function() {
    _aiOpen = !_aiOpen;
    const panel = document.getElementById('aiPanel');
    const fab   = document.getElementById('aiFab');
    if (_aiOpen) {
      panel.style.display = 'flex';
      fab.classList.add('hidden');
      setTimeout(() => document.getElementById('aiInput')?.focus(), 120);
    } else {
      panel.style.display = 'none';
      fab.classList.remove('hidden');
    }
  };

  window.sendAIQuestion = function(text) {
    if (!_aiOpen) window.toggleAIChat();
    const inp = document.getElementById('aiInput');
    if (inp) inp.value = text;
    window.sendAIMessage();
  };

  window.sendAIMessage = function() {
    if (_aiBusy) return;
    const inp = document.getElementById('aiInput');
    const q = inp?.value?.trim();
    if (!q) return;
    inp.value = '';
    const sugg = document.getElementById('aiSuggestions');
    if (sugg) sugg.style.display = 'none';
    _appendMsg('user', q, _esc(q));
    _aiHistory.push({ role: 'user', content: q });
    const typing = _showTyping();
    _aiBusy = true;
    document.getElementById('aiSendBtn').disabled = true;
    _process(q)
      .then(({ answer, html }) => { typing.remove(); _appendMsg('bot', answer, html); _aiHistory.push({ role: 'assistant', content: answer }); })
      .catch(() => { typing.remove(); const m = 'Erro ao processar. Tente novamente.'; _appendMsg('bot', m, `<span style="color:var(--warn)">${m}</span>`); })
      .finally(() => { _aiBusy = false; document.getElementById('aiSendBtn').disabled = false; });
  };

  async function _process(q) {
    if (!AI_WORKER_URL) return _local(q);
    try {
      const qn = normalizeStr(q);
      const isInventory = /almoxarifado|estoque|inventari[oa]|o que tem|quais reagentes|temos\b|lista.*reagentes/i.test(q);
      const chems = _detectChems(q, qn);
      // Inventory overview (no specific reagent) → answer locally from SHELF_DATA
      if (isInventory && !chems.length) return _local(q);
      let localCtx = '';
      if (chems.length) {
        const results = (await Promise.all(chems.slice(0,2).map(_gather))).filter(Boolean);
        localCtx = results.map(_ctxLine).filter(Boolean).join('\n');
      }
      return await _workerCall(q, localCtx, isInventory);
    } catch (_) {
      return _local(q);
    }
  }

  function _ctxLine(d) {
    const parts = [`Reagente: ${d.name}`];
    if (d.shelfLocs.length) {
      const l = d.shelfLocs[0];
      parts.push(`Localização EXATA: Prateleira ${l.key} (nível P${l.level}, parede ${l.wallName})`);
    } else {
      parts.push('Localização: NÃO catalogado no almoxarifado');
    }
    if (d.code) parts.push(`Código interno: ${d.code}`);
    if (d.cas)  parts.push(`CAS: ${d.cas}`);
    if (d.formula || d.pubchem?.formula) parts.push(`Fórmula: ${d.formula || d.pubchem.formula}`);
    if (d.ctrl === 'EB') parts.push('Controle: Exército Brasileiro (SisFPC)');
    else if (d.ctrl) parts.push(`Controle: Polícia Federal (${d.ctrlLabel || 'SIPROQUIM 2'})`);
    if (d.pubchem?.hPhrases?.length) parts.push(`Frases H (PubChem): ${[...new Set(d.pubchem.hPhrases)].slice(0,5).join(', ')}`);
    if (d.classLabel) parts.push(`Classe de risco: ${d.classLabel}`);
    return parts.join(' | ');
  }

  async function _workerCall(q, localCtx = '', isInventory = false) {
    const invNote = isInventory
      ? '[Contexto: "almoxarifado" e "estoque" referem-se ao inventário físico do NADF — reagentes catalogados neste site, organizados em 4 paredes (Esquerda/Inflamáveis, Fundo/Ácidos, Direita/Sais+Bases, Frente/Tóxicos+Oxidantes) com 6 prateleiras cada.]\n'
      : '';
    const enrichedQ = localCtx
      ? `${invNote}${q}\n\n[Dados verificados do almoxarifado NADF — use estes valores, NÃO invente localização]\n${localCtx}`
      : `${invNote}${q}`;
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 30000);
    try {
      const r = await fetch(AI_WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: enrichedQ, history: _aiHistory.slice(-6).map(m => ({ role: m.role, content: m.content })) }),
        signal: ctrl.signal
      });
      if (!r.ok) throw new Error('worker http ' + r.status);
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      return { answer: d.answer, html: _md(d.answer) };
    } finally {
      clearTimeout(to);
    }
  }

  async function _local(question) {
    const qn = normalizeStr(question);
    const I = {
      location : /onde|fica|localiz|prateleira/i.test(question),
      disposal : /descartar|descarte|res[ií]duo|lixo/i.test(question),
      storage  : /armazenar|armazenamento|guardar|compat[ií]vel|incompat/i.test(question),
      emergency: /emerg[êe]ncia|acidente|derramou|derram|intoxic|socorro/i.test(question),
      safety   : /perigo|risco|ghs|epi|seguran[çc]a|t[óo]xico|inflamavel|corrosivo/i.test(question),
      properties:/f[óo]rmula|propriedade|peso\s+mol|ponto.*ebul|fulgor|solubilidade|\bcas\b/i.test(question),
      normas   : /norma|legisla|lei\b|abnt|nr-?\d+|conama|anvisa|siproquim/i.test(question),
      inventory: /almoxarifado|estoque|inventari[oa]|o que tem|quais reagentes|temos\b|lista.*reagentes/i.test(question),
    };
    const chems = _detectChems(question, qn);
    if (!chems.length) return _generic(I, question);
    const results = (await Promise.all(chems.slice(0,2).map(_gather))).filter(Boolean);
    if (!results.length) return _generic(I, question);
    return { answer: results.map(d => d.name).join(', '), html: results.map(d => _fmt(d, I)).join('<hr style="border:none;border-top:1px solid var(--border);margin:8px 0">') };
  }

  function _detectChems(question, qn) {
    const found = [];
    const add = n => { if (n && !found.find(f => normalizeStr(f) === normalizeStr(n))) found.push(n); };
    const tokens = qn.split(/[\s,;:.!?()\[\]{}'"\\/\-]+/).filter(t => t.length >= 1);
    const qns = qn.replace(/\s+/g, '');

    if (typeof FORMULAS !== 'undefined') {
      for (const f in FORMULAS) {
        if (f.length <= 3) { if (tokens.includes(f)) add(FORMULAS[f]); }
        else { if (qns.includes(f) || qn.includes(f)) add(FORMULAS[f]); }
      }
    }

    if (typeof CODES_DB !== 'undefined') {
      (question.match(/\b([ABETLBRF]\d+|Ind\d+)\b/gi) || []).forEach(c => {
        const e = CODES_DB[c.toUpperCase()]; if (e) add(e.name);
      });
    }

    const SKIP_WORDS = new Set(['acido','base','solucao','alcool','agua','oxido','sal','sais']);
    if (typeof SHELF_DATA !== 'undefined' && found.length < 3) {
      outer: for (const k in SHELF_DATA) {
        const s = SHELF_DATA[k]; if (!s?.reagents) continue;
        for (const r of s.reagents) {
          const rn = normalizeStr(typeof r === 'string' ? r : r?.name || '');
          const words = rn.split(/\s+/).filter(w => w.length >= 5 && !SKIP_WORDS.has(w));
          if (!words.length) continue;
          const needed = Math.min(2, words.length);
          if (words.filter(w => tokens.includes(w)).length >= needed) {
            add(typeof r === 'string' ? r : r?.name);
            if (found.length >= 3) break outer;
          }
        }
      }
    }

    if (found.length < 3 && typeof CAS_DB !== 'undefined') {
      for (const e of CAS_DB) {
        const words = normalizeStr(e.name).split(/\s+/).filter(w => w.length >= 5 && !SKIP_WORDS.has(w));
        if (words.length && words.some(w => tokens.includes(w))) { add(e.name); if (found.length >= 3) break; }
      }
    }

    return found.slice(0, 3);
  }

  async function _gather(chemName) {
    const nn = normalizeStr(chemName);
    const d = { name: chemName, shelfLocs: [], ctrl: null, ctrlLabel: null, code: null, cas: null, formula: null, pubchem: null, emergInfo: null, descarteInfo: null, classLabel: null };

    if (typeof SHELF_DATA !== 'undefined') {
      for (const k in SHELF_DATA) {
        const s = SHELF_DATA[k]; if (!s?.reagents) continue;
        for (const r of s.reagents) {
          const rn = normalizeStr(typeof r === 'string' ? r : r?.name || '');
          if (rn.includes(nn) || nn.includes(rn)) {
            const wc = k[0], wi = (typeof WALLS !== 'undefined' && WALLS[wc]) || {};
            d.shelfLocs.push({ key: k, wallChar: wc, wallName: wi.name || '', level: k[1], color: wi.color || '#7a8499' });
            if (r.ctrl && !d.ctrl) { d.ctrl = r.ctrl; d.ctrlLabel = r.ctrlLabel; }
            if (r.code && !d.code) d.code = r.code;
            if (!d.name || d.name.length < (r.name || r).length) d.name = r.name || r;
          }
        }
      }
    }

    if (!d.code && typeof CODES_DB !== 'undefined') {
      for (const c in CODES_DB) {
        const e = CODES_DB[c];
        if (normalizeStr(e.name).includes(nn) || nn.includes(normalizeStr(e.name))) { d.code = c; break; }
      }
    }

    if (typeof CAS_DB !== 'undefined') {
      const e = CAS_DB.find(e => {
        const en = normalizeStr(e.name);
        return en.includes(nn) || nn.includes(en) || (e.aliases || []).some(a => { const an = normalizeStr(a); return an.includes(nn) || nn.includes(an); });
      });
      if (e) { d.cas = e.cas; d.formula = e.formula; if (!d.name || d.name.length < e.name.length) d.name = e.name; }
    }

    if (typeof REAGENT_QUICK_REF !== 'undefined') {
      const ref = REAGENT_QUICK_REF.find(r =>
        r.keys?.some(k => { const kn = normalizeStr(k); return kn.includes(nn) || nn.includes(kn); }) ||
        normalizeStr(r.label).includes(nn)
      );
      if (ref) { d.emergInfo = ref.emerg; d.descarteInfo = ref.descarte; d.classLabel = ref.class_label; }
    }

    try {
      const ck = d.cas || d.formula || d.name;
      if (_pcCache && _pcCache.has(ck)) {
        d.pubchem = _pcCache.get(ck);
      } else {
        let cid = null;
        for (const k of [d.cas, d.formula, d.name].filter(Boolean)) {
          try {
            const r = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(k)}/cids/JSON`);
            if (r.ok) { const j = await r.json(); cid = j.IdentifierList?.CID?.[0]; if (cid) break; }
          } catch (_) {}
        }
        if (cid) {
          const pc = { cid };
          try { const r = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=Chemical+Safety`); if (r.ok) Object.assign(pc, parsePubChemGHS(await r.json())); } catch (_) {}
          try { const r = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight/JSON`); if (r.ok) { const p = (await r.json())?.PropertyTable?.Properties?.[0]; if (p) { pc.formula = pc.formula || p.MolecularFormula; pc.weight = p.MolecularWeight; } } } catch (_) {}
          d.pubchem = pc; if (_pcCache) _pcCache.set(ck, pc);
        }
      }
    } catch (_) {}

    return d;
  }

  function _fmt(d, I) {
    const parts = [];
    const fm = d.formula || d.pubchem?.formula || '';
    const fs = fm ? ` <span style="font-family:'Space Mono',monospace;font-size:0.75em;color:var(--muted)">(${fm})</span>` : '';
    parts.push(`<div class="ai-chem-header"><strong>${_esc(d.name)}</strong>${fs}</div>`);
    if (d.shelfLocs.length) {
      const l = d.shelfLocs[0];
      const ct = d.code ? ` <span class="code-chip code-chip-${l.wallChar}">${d.code}</span>` : '';
      parts.push(`<div class="ai-chem-loc">📍 P${l.level} · <span style="color:${l.color}">${_esc(l.wallName.split(' — ')[0])}</span>${ct}</div>`);
      if (d.ctrl === 'PF' || (d.ctrl && typeof d.ctrl === 'object')) parts.push(`<div style="color:var(--danger);font-size:0.75em">🔒 Controlado PF — SIPROQUIM 2</div>`);
      else if (d.ctrl === 'EB') parts.push(`<div style="color:#ff9900;font-size:0.75em">⚔️ Controlado Exército — SisFPC</div>`);
    } else if (I.location) {
      parts.push(`<div style="color:var(--warn);font-size:0.79em">⚠️ Não localizado nas prateleiras catalogadas.</div>`);
    }
    if (d.cas) parts.push(`<div class="ai-chem-cas">🔢 CAS: <span style="font-family:'Space Mono',monospace">${d.cas}</span></div>`);
    if (d.pubchem?.weight) parts.push(`<div style="font-size:0.76em;color:var(--muted)">⚗️ PM: ${d.pubchem.weight} g/mol</div>`);
    if (d.pubchem?.pictograms?.length) {
      const pics = d.pubchem.pictograms.slice(0,5).map(p => {
        const code  = typeof p === 'string' ? p : p.code;
        const label = (typeof GHS_PICTOGRAMS !== 'undefined' && GHS_PICTOGRAMS[code]?.label) || code;
        const url   = (typeof p === 'object' && p.imgUrl) || `https://pubchem.ncbi.nlm.nih.gov/images/ghs/${code}.svg`;
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;flex-shrink:0"><img src="${url}" style="width:30px;height:30px" alt="${_esc(label)}" loading="lazy" onerror="this.style.display='none'"><span style="font-size:0.57em;color:var(--muted);text-align:center;max-width:42px;line-height:1.2">${_esc(label)}</span></div>`;
      }).join('');
      parts.push(`<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;align-items:flex-start">${pics}</div>`);
    }
    if (d.pubchem?.hPhrases?.length) {
      const hl = [...new Set(d.pubchem.hPhrases)].slice(0,3).map(c => {
        const t = (typeof H_PHRASES !== 'undefined' && H_PHRASES[c]) || '';
        return `<span style="font-size:0.74em"><strong style="font-family:'Space Mono',monospace">${c}</strong>${t ? ' — ' + _esc(t) : ''}</span>`;
      }).join('<br>');
      parts.push(`<div style="margin-top:4px;display:flex;flex-direction:column;gap:1px">${hl}</div>`);
    }
    if (d.classLabel) parts.push(`<div style="color:var(--muted);font-size:0.75em;margin-top:3px">Classe: ${_esc(d.classLabel)}</div>`);
    if (I.emergency && d.emergInfo?.length) {
      const steps = d.emergInfo.slice(0,3).map(s => `<li style="margin-bottom:2px">${_esc(s)}</li>`).join('');
      parts.push(`<div style="margin-top:7px"><strong style="color:var(--danger);font-size:0.81em">⚡ Ação imediata:</strong><ol style="padding-left:16px;font-size:0.77em;margin-top:3px">${steps}</ol></div>`);
    }
    if (I.disposal && d.descarteInfo) {
      parts.push(`<div style="margin-top:6px"><strong style="color:var(--accent);font-size:0.79em">♻️ Descarte:</strong><br><span style="font-size:0.77em">${_esc(d.descarteInfo)}</span></div>`);
    }
    if (d.pubchem?.cid) parts.push(`<div style="margin-top:7px;font-size:0.7em"><a href="https://pubchem.ncbi.nlm.nih.gov/compound/${d.pubchem.cid}" target="_blank" rel="noopener" style="color:var(--accent2);text-decoration:none">📊 Ver no PubChem (CID ${d.pubchem.cid}) ↗</a></div>`);
    return `<div class="ai-chem-card">${parts.join('')}</div>`;
  }

  function _generic(I, question) {
    if (I.emergency) return { answer: 'Contatos de emergência', html: `<div>⚡ <strong>Emergências:</strong><ul class="ai-help-list" style="margin-top:6px"><li>🆘 CIATOX: <strong>0800 722 6001</strong> (24h)</li><li>🚑 SAMU: <strong>192</strong></li><li>🔥 Bombeiros: <strong>193</strong></li></ul><div style="margin-top:8px;font-size:0.79em">Consulte a aba <strong>🚨 Emergências</strong> para procedimentos por classe.</div></div>` };
    if (I.disposal)  return { answer: 'Descarte', html: `<div>♻️ Princípios (CONAMA 358/2005):<ul class="ai-help-list" style="margin-top:6px"><li>Resíduos Classe I → empresa licenciada IBAMA</li><li>Nunca descartar no esgoto sem tratamento</li><li>Segregar: halogenados vs. não-halogenados</li><li>Verificar pH 5–9 antes de lançamento</li></ul><div style="margin-top:8px;font-size:0.79em">Consulte a aba <strong>♻️ Descarte</strong> ou mencione o reagente específico.</div></div>` };
    if (I.normas)    return { answer: 'Normas brasileiras', html: `<div>📋 Normas aplicáveis:<ul class="ai-help-list" style="margin-top:6px"><li><strong>ABNT NBR 14725:2023</strong> — GHS, FDS</li><li><strong>ABNT NBR 17160:2024</strong> — Segurança em labs</li><li><strong>NR-26</strong> — Sinalização</li><li><strong>NR-20</strong> — Inflamáveis</li><li><strong>CONAMA 358/2005</strong> — Descarte</li><li><strong>Lei 10.357/2001</strong> — Precursores PF</li></ul><div style="margin-top:8px;font-size:0.79em">Aba <strong>Normas Brasileiras</strong> para detalhes completos.</div></div>` };
    if (I.storage)   return { answer: 'Armazenamento', html: `<div>🗄️ Regras gerais:<ul class="ai-help-list" style="margin-top:6px"><li>Ácidos nunca com bases</li><li>Inflamáveis segregados de oxidantes</li><li>Bandejas de contenção para líquidos perigosos</li><li>Cianetos e tóxicos em cofre trancado</li></ul><div style="margin-top:8px;font-size:0.79em">Use o <strong>Verificador de Incompatibilidade</strong> para checar dois reagentes.</div></div>` };
    if (I.inventory) {
      const WALL_META = { L:{name:'Esquerda / Inflamáveis',color:'#ff8850',icon:'🔥'}, B:{name:'Fundo / Ácidos',color:'#ffb850',icon:'⚗️'}, R:{name:'Direita / Sais+Bases',color:'#5599dd',icon:'🧂'}, F:{name:'Frente / Tóxicos+Oxidantes',color:'#c080ff',icon:'☠️'} };
      let html = '<div><div style="font-weight:700;margin-bottom:8px">🗄️ Inventário do Almoxarifado NADF</div>';
      if (typeof SHELF_DATA !== 'undefined') {
        let total = 0; const carcList = [], ctrlList = [];
        for (const w of ['L','B','R','F']) {
          let count = 0;
          for (let i = 1; i <= 6; i++) {
            const s = SHELF_DATA[w+i]; if (!s?.reagents) continue;
            count += s.reagents.length;
            for (const re of s.reagents) {
              if (re?.carc) carcList.push(_esc(re.name || re));
              if (re?.ctrl && ctrlList.length < 8) ctrlList.push(_esc(re.name || re));
            }
          }
          total += count;
          const wi = WALL_META[w];
          html += `<div style="margin-bottom:3px"><span style="color:${wi.color}">${wi.icon} ${wi.name}</span>: <strong>${count}</strong> itens</div>`;
        }
        html += `<div style="margin-top:6px;font-size:0.8em;color:var(--muted)">Total: ${total} itens catalogados</div>`;
        if (carcList.length) html += `<div style="margin-top:8px;font-size:0.79em"><strong style="color:#d4b800">⚠️ Carcinogênicos (${carcList.length}):</strong> ${carcList.slice(0,6).join(', ')}${carcList.length > 6 ? ' e outros...' : ''}</div>`;
        if (ctrlList.length) html += `<div style="margin-top:4px;font-size:0.79em"><strong style="color:var(--danger)">🔒 Controlados PF/EB:</strong> ${ctrlList.slice(0,5).join(', ')}${ctrlList.length > 5 ? ' e outros...' : ''}</div>`;
      } else {
        html += '<div>Dados não disponíveis.</div>';
      }
      html += '<div style="margin-top:10px;font-size:0.79em">Ver localização detalhada na aba <strong>Almoxarifado</strong>.</div></div>';
      return { answer: 'Inventário do Almoxarifado NADF', html };
    }
    return { answer: 'Pergunta não reconhecida', html: `<div>Tente mencionar o reagente pelo nome, fórmula ou código interno:<ul class="ai-help-list" style="margin-top:6px"><li>Nome: <em>"ácido clorídrico"</em>, <em>"etanol"</em></li><li>Fórmula: <em>"HCl"</em>, <em>"NaOH"</em></li><li>Código: <em>"A12"</em>, <em>"T6"</em></li></ul></div>` };
  }

  function _appendMsg(role, text, html) {
    const msgs = document.getElementById('aiMessages'); if (!msgs) return;
    const div  = document.createElement('div'); div.className = `ai-msg ai-msg-${role}`;
    div.innerHTML = `<div class="ai-msg-bubble">${html || _esc(text)}</div>`;
    msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
  }

  function _showTyping() {
    const msgs = document.getElementById('aiMessages');
    const div  = document.createElement('div'); div.className = 'ai-msg ai-msg-bot';
    div.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
    msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight; return div;
  }

  function _esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function _md(md) {
    return String(md || '')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^### (.+)$/gm, '<div style="font-weight:700;color:var(--accent2);margin-top:8px">$1</div>')
      .replace(/^## (.+)$/gm, '<div style="font-weight:700;font-size:.95em;margin-top:10px">$1</div>')
      .replace(/^- (.+)$/gm, '<li>$1</li>').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
  }

  if (AI_WORKER_URL) {
    const el = document.getElementById('aiWorkerStatus');
    if (el) el.innerHTML = '<span class="ai-worker-dot online"></span>LLM ativo';
  }

  })(); // fim IIFE assistente IA
