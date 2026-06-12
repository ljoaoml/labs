
  // ── Search functions — CAS, reagent, quick-search ────────────────────────

  function performCasSearch() {
    const rawQ = document.getElementById('casSearchInput').value.trim();
    const container = document.getElementById('casResults');

    if (!rawQ) { container.innerHTML = ''; return; }

    const q = normalizeCas(rawQ);
    const qNoSpace = q.replace(/\s+/g, '');

    const matches = CAS_DB.filter(item => {
      const nameN    = normalizeCas(item.name);
      const formulaN = normalizeCas(item.formula).replace(/\s/g, '');
      const casN     = item.cas.replace(/-/g, '');
      const qCas     = rawQ.replace(/-/g, '');
      if (nameN.includes(q) || qNoSpace === formulaN || item.cas.includes(rawQ) || casN.includes(qCas)) return true;
      return item.aliases.some(a => {
        const an = normalizeCas(a).replace(/\s+/g,'');
        return an.includes(qNoSpace) || qNoSpace.includes(an) || normalizeCas(a).includes(q);
      });
    });

    if (matches.length === 0) {
      container.innerHTML = '<div class="search-empty"><span class="se-icon">🔬</span><span>Nenhuma substância encontrada.</span><span class="se-hint">Tente outro nome, fórmula química (ex: C₂H₅OH) ou número CAS.</span></div>';
      return;
    }

    const grid = matches.slice(0, 40).map(m => {
      const panelId = 'casp-' + m.cas.replace(/-/g, '');
      return `
      <div class="cas-card">
        <div class="cas-card-top">
          <span class="cas-card-name">${m.name}</span>
          <span class="cas-card-formula">${m.formula}</span>
        </div>
        <div class="cas-card-bottom">
          <span class="cas-number">🔢 ${m.cas}</span>
          <div class="cas-card-actions">
            <button class="cas-copy-btn" onclick="navigator.clipboard.writeText('${m.cas}').then(()=>{this.textContent='✓ Copiado!';setTimeout(()=>this.textContent='Copiar CAS',1500)})">Copiar CAS</button>
            <button class="cas-pubchem-btn" id="btn-${panelId}" onclick="toggleCasPubChem('${m.cas}','${panelId}',this)">📊 PubChem</button>
          </div>
        </div>
        <div class="cas-pc-panel" id="${panelId}" style="display:none"></div>
      </div>`;
    }).join('');

    const countNote = matches.length > 40 ? `<div class="cas-count-note">Mostrando 40 de ${matches.length} resultados. Refine a busca para ver mais.</div>` : '';
    container.innerHTML = `<div class="cas-grid">${grid}</div>${countNote}`;
  }

  function performReagentSearch() {
    const rawQ = document.getElementById('reagentSearchInput').value.trim();
    const container = document.getElementById('searchResultWrapper');

    if (!rawQ) { container.style.display = 'none'; container.innerHTML = ''; return; }

    container.innerHTML = '';
    let matches = [];

    const codeQuery = rawQ.toUpperCase();
    const isCodeLike = /^[ABETLBRF]\d*$/i.test(rawQ.trim());

    if (typeof CODES_DB !== 'undefined' && isCodeLike) {
      for (let code in CODES_DB) {
        if (code.toUpperCase().startsWith(codeQuery)) {
          const entry = CODES_DB[code];
          const shelfKey = entry.shelf;
          const shelf = SHELF_DATA[shelfKey];
          if (!shelf) continue;
          const wallChar = shelfKey.charAt(0);
          const wallInfo = WALLS[wallChar] || { name: entry.wall, color: '#7a8499' };
          const reagentObj = shelf.reagents
            ? shelf.reagents.find(rg => rg && (typeof rg === 'object') && rg.code === code)
            : null;
          matches.push({
            name: entry.name, code, codeMatch: true,
            ctrl: reagentObj ? reagentObj.ctrl : null,
            ctrlLabel: reagentObj ? reagentObj.ctrlLabel : null,
            carc: reagentObj ? !!reagentObj.carc : false,
            shelfKey, shelfTitle: shelf.title,
            wallName: wallInfo.name, wallChar,
            level: shelfKey.charAt(1), icon: shelf.icon || '🧪', color: wallInfo.color,
          });
        }
      }
    }

    const q = normalizeStr(rawQ);
    const terms = [q];
    if (q.length >= 2) {
      const qNoSpace = q.replace(/\s+/g, '');
      for (let f in FORMULAS) {
        if (f.includes(qNoSpace) || qNoSpace.includes(f)) terms.push(normalizeStr(FORMULAS[f]));
      }
    }

    for (let key in SHELF_DATA) {
      const shelf = SHELF_DATA[key];
      if (!shelf || !shelf.reagents) continue;
      const wallChar = key.charAt(0);
      const levelNum = key.charAt(1);
      const wallInfo = WALLS[wallChar] || { name: 'Desconhecida', color: '#7a8499' };

      shelf.reagents.forEach(reagent => {
        if (!reagent) return;
        const rName = typeof reagent === 'string' ? reagent : reagent.name;
        const rCode = (typeof reagent === 'object' && reagent.code) ? reagent.code : null;
        const nName = normalizeStr(rName);
        if (rCode && matches.some(m => m.code === rCode)) return;
        if (rName && terms.some(t => t && nName.includes(t))) {
          matches.push({
            name: rName, code: rCode, codeMatch: false,
            ctrl: reagent.ctrl || null, ctrlLabel: reagent.ctrlLabel || null,
            carc: !!reagent.carc,
            shelfKey: key, shelfTitle: shelf.title,
            wallName: wallInfo.name, wallChar, level: levelNum,
            icon: shelf.icon || '🧪', color: wallInfo.color, ruleText: shelf.rule || ''
          });
        }
      });
    }

    if (matches.length === 0) {
      container.style.display = 'flex';
      const noResult = document.createElement('div');
      noResult.className = 'search-empty-block';
      noResult.innerHTML = '<span class="se-icon">🔍</span>'
        + `<span>Nenhum reagente encontrado para <strong>"${rawQ}"</strong>.</span>`
        + '<span class="se-hint">Tente nome, fórmula (ex: H₂SO₄) ou código interno (ex: A12, T6, B25).</span>';
      container.appendChild(noResult);
      return;
    }

    container.style.display = 'flex';

    matches.forEach(m => {
      const item = document.createElement('div');
      item.className = 'search-item';

      const ctrlBadgeHtml = m.ctrl ? `<span class="search-item-ctrl">${m.ctrlLabel || '🔒 ' + m.ctrl}</span>` : '';
      const carcBadgeHtml = m.carc ? '<span class="search-item-carc">⚠️ CARC</span>' : '';
      const codeBadgeHtml = m.code ? `<span class="code-chip code-chip-${m.wallChar}${m.codeMatch ? ' code-match' : ''}">${m.code}</span>` : '';

      item.innerHTML = `
        <div class="search-item-title">${m.icon} ${m.name} ${codeBadgeHtml}${ctrlBadgeHtml}${carcBadgeHtml}</div>
        <div class="search-item-meta">
          <span class="search-item-wall" style="color:${m.color};">Parede: ${m.wallName.split('/')[0]}</span>
          <span>Prateleira: P${m.level}</span>
          <span>(${m.shelfTitle.replace(/ 🪜$/,'')})</span>
          ${getCasForReagent(m.name) ? `<span class="search-item-cas">CAS: ${getCasForReagent(m.name)}</span>` : ''}
        </div>
      `;

      item.onclick = () => {
        const tabsContainer = document.querySelectorAll('.tab');
        if (tabsContainer && tabsContainer[2]) showTab('almoxarifado', tabsContainer[2]);
        else showTab('almoxarifado', null);
        selectWall(m.wallChar);
        setTimeout(() => {
          showShelf(m.shelfKey);
          const targetRow = document.querySelector(`.shelf-row[data-key="${m.shelfKey}"]`);
          if (targetRow) {
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetRow.style.background = m.color + '33';
            setTimeout(() => { targetRow.style.background = ''; }, 1500);
          }
        }, 150);
      };

      container.appendChild(item);
    });
  }

  // ── Quick-search (emergências/descarte) ──────────────────────────────────

  function reagentSearch(input, section) {
    const val = input.value.trim();
    const clearBtn  = document.getElementById(section + 'SearchClear');
    const dropdown  = document.getElementById(section + 'SearchDropdown');
    const panel     = document.getElementById(section + 'QRef');

    if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
    if (panel)    panel.style.display = 'none';

    if (!val || val.length < 2) { if (dropdown) dropdown.style.display = 'none'; return; }

    const q = normalizeQSearch(val);
    const matches = (typeof REAGENT_QUICK_REF !== 'undefined' ? REAGENT_QUICK_REF : [])
      .filter(r => r.keys.some(k => normalizeQSearch(k).includes(q)) || normalizeQSearch(r.label).includes(q))
      .slice(0, 8);

    if (!matches.length) {
      dropdown.innerHTML = '<div class="qsearch-opt" style="cursor:default;text-align:center;padding:12px 8px;"><span style="font-size:1.2rem">🔍</span><br><span style="color:var(--muted);font-size:0.76rem;">Sem resultados — tente nome completo ou fórmula.</span></div>';
      dropdown.style.display = 'block';
      return;
    }

    dropdown.innerHTML = matches.map(r =>
      `<div class="qsearch-opt ${r.alert}"
            onclick="showQRef('${encodeURIComponent(r.label)}','${section}')">
         <span class="qsearch-opt-name">${r.label}</span>
         <span class="qsearch-opt-class">${r.class_label}</span>
       </div>`
    ).join('');
    dropdown.style.display = 'block';
  }

  function showQRef(encodedLabel, section) {
    const label = decodeURIComponent(encodedLabel);
    const ref = (typeof REAGENT_QUICK_REF !== 'undefined' ? REAGENT_QUICK_REF : [])
      .find(r => r.label === label);
    if (!ref) return;

    const tabId = section === 'emerg' ? 'emergencias' : 'descarte';
    history.replaceState(null, '', '#' + tabId + '?q=' + encodedLabel + '&s=' + section);

    const dropdown = document.getElementById(section + 'SearchDropdown');
    const panel    = document.getElementById(section + 'QRef');
    if (dropdown) dropdown.style.display = 'none';
    if (!panel) return;

    let alertBadge = '';
    if (ref.alert === 'danger') alertBadge = '<span class="qref-badge danger">ALTA PERICULOSIDADE</span>';
    else if (ref.alert === 'warn') alertBadge = '<span class="qref-badge warn">ATENÇÃO</span>';

    const noteHTML = ref.note ? `<div class="qref-note ${ref.alert}">${ref.note}</div>` : '';

    let bodyHTML = '';
    if (section === 'emerg') {
      const steps = (ref.emerg || []).map((s, i) => `<li><span class="qref-step-num">${i+1}</span><span>${s}</span></li>`).join('');
      bodyHTML = `<div class="qref-steps-title">⚡ Ações Imediatas — Primeiros Socorros</div><ul class="qref-steps">${steps}</ul>`;
    } else {
      bodyHTML = `<div class="qref-steps-title">♻️ Método de Descarte</div>
        <ul class="qref-steps"><li><span class="qref-step-num">▸</span><span>${ref.descarte || 'Consultar protocolo da classe.'}</span></li></ul>`;
    }

    const targetId  = section === 'emerg' ? ref.ec : ref.dc;
    const btnLabel  = section === 'emerg' ? 'Ver protocolo completo →' : 'Ver método completo →';

    let epiHTML = '';
    if (ref.epi && ref.epi.length) {
      const items = ref.epi.map(e => `<li class="qref-epi-item">${e}</li>`).join('');
      epiHTML = `<div class="qref-steps-title">🦺 EPI para Contenção de Vazamento</div><ul class="qref-epi-list">${items}</ul>`;
    }

    const pcId = 'pc-' + section + '-' + Date.now();
    panel.className = `qref-panel ${ref.alert}`;
    panel.innerHTML = `
      <div class="qref-header">
        <div>
          <span class="qref-label">${ref.label}</span>
          <div class="qref-badges">${alertBadge}<span class="qref-badge class">${ref.class_label}</span></div>
        </div>
        <button class="qref-close" onclick="closeQRef('${section}')" title="Fechar">✕</button>
      </div>
      ${noteHTML}${bodyHTML}${epiHTML}
      <div class="qref-footer">
        <button class="qref-scroll-btn" onclick="scrollToCard('${targetId}')">${btnLabel}</button>
      </div>
      <div class="qref-pc-wrap" id="${pcId}">
        <div class="qref-pc-skeleton">
          <div class="qref-pc-skel-line" style="width:55%"></div>
          <div class="qref-pc-skel-line" style="width:88%"></div>
          <div class="qref-pc-skel-line" style="width:72%"></div>
          <div class="qref-pc-skel-line" style="width:80%"></div>
        </div>
      </div>`;
    panel.style.display = 'block';
    fetchPubChem(ref.keys, pcId, true);
  }

  function closeQRef(section) {
    const panel = document.getElementById(section + 'QRef');
    if (panel) panel.style.display = 'none';
    const tabId = section === 'emerg' ? 'emergencias' : 'descarte';
    history.replaceState(null, '', '#' + tabId);
  }

  function clearReagentSearch(section) {
    const input    = document.getElementById(section + 'SearchInput');
    const dropdown = document.getElementById(section + 'SearchDropdown');
    const panel    = document.getElementById(section + 'QRef');
    const clearBtn = document.getElementById(section + 'SearchClear');
    if (input)    input.value = '';
    if (dropdown) dropdown.style.display = 'none';
    if (panel)    panel.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';
    if (input)    input.focus();
  }

  function scrollToCard(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'DETAILS' && !el.open) el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('qref-highlight');
    void el.offsetWidth;
    el.classList.add('qref-highlight');
    setTimeout(() => el.classList.remove('qref-highlight'), 2000);
  }

  window.searchChip = function(name, section) {
    const input = document.getElementById(section + 'SearchInput');
    if (!input) return;
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.value = name;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    setTimeout(() => {
      const dropdown = document.getElementById(section + 'SearchDropdown');
      if (!dropdown) return;
      const first = dropdown.querySelector('.qsearch-opt');
      if (first) first.click();
    }, 80);
  };

  // ── Keyboard navigation for quick-search dropdowns ───────────────────────

  function initQSearchKeyboard(section) {
    const input    = document.getElementById(section + 'SearchInput');
    const dropdown = document.getElementById(section + 'SearchDropdown');
    if (!input || !dropdown) return;

    input.addEventListener('keydown', e => {
      if (dropdown.style.display === 'none') return;
      const opts = [...dropdown.querySelectorAll('.qsearch-opt[onclick]')];
      if (!opts.length) return;
      const focused = dropdown.querySelector('.qsearch-opt.kb-focus');
      const idx     = focused ? opts.indexOf(focused) : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (focused) focused.classList.remove('kb-focus');
        opts[Math.min(idx + 1, opts.length - 1)].classList.add('kb-focus');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (focused) focused.classList.remove('kb-focus');
        if (idx > 0) opts[idx - 1].classList.add('kb-focus');
      } else if (e.key === 'Enter') {
        if (focused)   { e.preventDefault(); focused.click(); }
        else if (opts[0]) { e.preventDefault(); opts[0].click(); }
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none'; input.blur();
      }
    });

    dropdown.addEventListener('mouseenter', () => {
      dropdown.querySelectorAll('.qsearch-opt.kb-focus').forEach(o => o.classList.remove('kb-focus'));
    });
  }

  initQSearchKeyboard('emerg');
  initQSearchKeyboard('descarte');

  // Fechar dropdown ao clicar fora
  document.addEventListener('click', e => {
    ['emerg','descarte'].forEach(section => {
      const dropdown = document.getElementById(section + 'SearchDropdown');
      const input    = document.getElementById(section + 'SearchInput');
      if (dropdown && input && !dropdown.contains(e.target) && e.target !== input) {
        dropdown.style.display = 'none';
      }
    });
  });
