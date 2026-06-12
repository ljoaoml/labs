
  // ── PubChem API — fetch, parse, render ───────────────────────────────────

  const _pcCache = new Map();

  function _pcFindSection(sections, heading) {
    if (!Array.isArray(sections)) return null;
    for (const s of sections) {
      if (s.TOCHeading === heading) return s;
      const found = _pcFindSection(s.Section, heading);
      if (found) return found;
    }
    return null;
  }

  function _pcExtractValue(section) {
    const raw = section?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String;
    if (!raw) return null;
    return raw.split('\n')[0].replace(/\s*\([^)]*\)\s*$/, '').trim() || null;
  }

  async function fetchPubChem(keys, containerId, picsOnly = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cacheKey = Array.isArray(keys) ? keys[0] : keys;
    const keyList  = Array.isArray(keys) ? keys : [keys];

    function _fetchTimeout(url, ms = 10000) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ms);
      return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
    }

    function _showRetry(msg) {
      if (!document.getElementById(containerId)) return;
      const div = document.createElement('div');
      div.className = 'qref-pc-error';
      div.textContent = msg;
      const retryBtn = document.createElement('button');
      retryBtn.className = 'qref-pc-retry';
      retryBtn.textContent = '↩ Tentar novamente';
      retryBtn.addEventListener('click', () => fetchPubChem(keys, containerId, picsOnly));
      div.appendChild(retryBtn);
      container.innerHTML = '';
      container.appendChild(div);
    }

    if (_pcCache.has(cacheKey)) {
      renderPubChemData(container, _pcCache.get(cacheKey), picsOnly);
      return;
    }

    container.innerHTML = `<div class="qref-pc-skeleton">
      <div class="qref-pc-skel-line" style="width:55%"></div>
      <div class="qref-pc-skel-line" style="width:88%"></div>
      <div class="qref-pc-skel-line" style="width:70%"></div>
      <div class="qref-pc-skel-line" style="width:82%"></div>
    </div>`;

    let cid = null;
    for (const key of keyList) {
      try {
        const res = await _fetchTimeout(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(key)}/cids/JSON`
        );
        if (!res.ok) continue;
        const json = await res.json();
        cid = json.IdentifierList?.CID?.[0];
        if (cid) break;
      } catch (_) { continue; }
    }

    if (!cid) { _showRetry('⚠️ Reagente não encontrado no PubChem.'); return; }

    try {
      const deadline = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 12000));

      const [propRes, ghsRes, expRes] = await Promise.race([
        Promise.all([
          _fetchTimeout(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula/JSON`),
          _fetchTimeout(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=Chemical+Safety`),
          _fetchTimeout(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=Experimental+Properties`)
        ]),
        deadline
      ]);

      const propJson = propRes.ok ? await propRes.json() : null;
      let ghsJson = ghsRes.ok ? await ghsRes.json() : null;
      if (!ghsJson?.Record) {
        try {
          const fb = await _fetchTimeout(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=GHS+Classification`);
          if (fb.ok) { const j = await fb.json(); if (j?.Record) ghsJson = j; }
        } catch (_) {}
      }
      const expJson = expRes.ok ? await expRes.json() : null;

      const formula = propJson?.PropertyTable?.Properties?.[0]?.MolecularFormula ?? null;
      const ghs     = parsePubChemGHS(ghsJson);
      const exp     = parsePubChemExp(expJson);

      const result = { cid, formula, ...ghs, ...exp };
      _pcCache.set(cacheKey, result);
      renderPubChemData(container, result, picsOnly);

    } catch (e) {
      if (e.message === 'timeout') _showRetry('⏱️ PubChem não respondeu a tempo.');
      else _showRetry('⚠️ Erro ao carregar dados PubChem.');
    }
  }

  function parsePubChemGHS(data) {
    const result = { pictograms: [], hPhrases: [] };
    if (!data?.Record) return result;

    const root = data.Record.Section ?? [];
    const seenPic = new Set();
    const seenH   = new Set();

    function _extractPic(swm) {
      let foundViaMarkup = false;
      for (const mk of swm.Markup ?? []) {
        const um = mk.URL?.match(/\/ghs\/(GHS(\d+))\.svg/i);
        if (!um) continue;
        const code = 'GHS' + String(um[2]).padStart(2, '0');
        if (seenPic.has(code)) { foundViaMarkup = true; continue; }
        seenPic.add(code);
        result.pictograms.push({ code, imgUrl: mk.URL });
        foundViaMarkup = true;
      }
      if (!foundViaMarkup) {
        const sm = swm.String?.match(/GHS(\d+)/i);
        if (sm) {
          const code = 'GHS' + String(sm[1]).padStart(2, '0');
          if (!seenPic.has(code)) {
            seenPic.add(code);
            result.pictograms.push({ code, imgUrl: `https://pubchem.ncbi.nlm.nih.gov/images/ghs/${code}.svg` });
          }
        }
      }
    }

    function _walk(sections) {
      for (const s of sections ?? []) {
        for (const info of s.Information ?? []) {
          for (const swm of info.Value?.StringWithMarkup ?? []) {
            if (swm.Markup?.some(mk => mk.URL?.includes('/images/ghs/'))) _extractPic(swm);
            const hm = swm.String?.match(/\bH\d{3}\b/);
            if (hm && !seenH.has(hm[0])) { seenH.add(hm[0]); result.hPhrases.push(hm[0]); }
          }
        }
        _walk(s.Section);
      }
    }

    try { _walk(root); } catch (_) {}
    return result;
  }

  function parsePubChemExp(data) {
    const result = { flashPoint: null, boilingPoint: null, vaporPressure: null, solubility: null };
    if (!data) return result;
    try {
      const root = data.Record?.Section ?? [];
      result.flashPoint    = _pcExtractValue(_pcFindSection(root, 'Flash Point'));
      result.boilingPoint  = _pcExtractValue(_pcFindSection(root, 'Boiling Point'));
      result.vaporPressure = _pcExtractValue(_pcFindSection(root, 'Vapor Pressure'));
      result.solubility    = _pcExtractValue(_pcFindSection(root, 'Solubility'));
    } catch (_) {}
    return result;
  }

  function _buildPicsHTML(data) {
    return data.pictograms?.length
      ? data.pictograms.map(pic => {
          const code = typeof pic === 'string' ? pic : pic.code;
          const imgUrl = (typeof pic === 'object' && pic.imgUrl)
            || `https://pubchem.ncbi.nlm.nih.gov/images/ghs/${code}.svg`;
          const p = (typeof GHS_PICTOGRAMS !== 'undefined' && GHS_PICTOGRAMS[code]) || { label: code };
          return `<div class="qref-pc-pic-wrap">
            <img class="qref-pc-pic-img" src="${imgUrl}" alt="${p.label}" title="${p.label}" loading="lazy" onerror="this.style.display='none'">
            <span class="qref-pc-pic-label">${p.label}</span>
          </div>`;
        }).join('')
      : '<span class="qref-pc-na">—</span>';
  }

  function renderPubChemData(container, data, picsOnly = false) {
    if (!container) return;
    if (!data) {
      container.innerHTML = '<div class="qref-pc-error">⚠️ Dados PubChem não disponíveis.</div>';
      return;
    }

    const cidLink = `<a class="qref-pc-link" href="https://pubchem.ncbi.nlm.nih.gov/compound/${data.cid}" target="_blank" rel="noopener">CID ${data.cid} ↗</a>`;
    const picsHTML = _buildPicsHTML(data);

    if (picsOnly) {
      container.innerHTML = `
        <div class="qref-pc-header"><span>Perigos GHS · PubChem</span>${cidLink}</div>
        <div class="qref-pc-pics">${picsHTML}</div>`;
      return;
    }

    const physProps = [
      { label: '🔥 Ponto de Fulgor',   val: data.flashPoint },
      { label: '♨️ Ponto de Ebulição', val: data.boilingPoint },
      { label: '💨 Pressão de Vapor',  val: data.vaporPressure },
      { label: '💧 Solubilidade',       val: data.solubility },
      { label: '⚗️ Fórmula',            val: data.formula },
    ].filter(p => p.val);

    const propsHTML = physProps.length
      ? `<div class="qref-pc-props">${physProps.map(p => `<span class="qref-pc-prop"><span class="qref-pc-prop-label">${p.label}</span><span class="qref-pc-prop-value">${p.val}</span></span>`).join('')}</div>`
      : '';

    const hHTML = [...new Set(data.hPhrases ?? [])].map(code => {
      const text = (typeof H_PHRASES !== 'undefined' && H_PHRASES[code]) || code;
      return `<div class="qref-pc-hphrase"><span class="qref-pc-hcode">${code}</span><span class="qref-pc-htext">${text}</span></div>`;
    }).join('');

    container.innerHTML = `
      <div class="qref-pc-header"><span>📊 PubChem · NIH</span>${cidLink}</div>
      ${propsHTML}
      <div class="qref-pc-section-label">Pictogramas GHS</div>
      <div class="qref-pc-pics">${picsHTML}</div>
      ${hHTML ? `<div class="qref-pc-section-label">Frases H — Declarações de perigo (pt-BR)</div><div class="qref-pc-hphrases">${hHTML}</div>` : ''}
    `;
  }

  window.toggleCasPubChem = function(cas, panelId, btn) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    if (panel.style.display !== 'none') {
      panel.style.display = 'none';
      btn.textContent = '📊 PubChem';
      btn.classList.remove('active');
      return;
    }

    panel.style.display = 'block';
    btn.textContent = '✕ Fechar';
    btn.classList.add('active');
    panel.innerHTML = `<div class="qref-pc-skeleton cas-pc-skeleton">
      <div class="qref-pc-skel-line" style="width:55%"></div>
      <div class="qref-pc-skel-line" style="width:88%"></div>
      <div class="qref-pc-skel-line" style="width:70%"></div>
      <div class="qref-pc-skel-line" style="width:82%"></div>
    </div>`;
    fetchPubChem([cas], panelId, false);
  };
