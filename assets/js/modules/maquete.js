
  // ── Maquete / almoxarifado navigation & shelf rendering ──────────────────

  let maqueteActiveFilter = 'all';

  // ── Risk scoring ──────────────────────────────────────────────────────────

  function _shelfRiskScore(key) {
    const d = SHELF_DATA[key];
    if (!d) return 0;
    const wall = key[0];

    // Base score per wall type
    let score = { L: 3, B: 3, F: 4, R: 1 }[wall] || 1;

    if (!d.ctrl) return score;

    // COFRE = extreme (short-circuit)
    if (d.ctrl.some(c => c === COFRE)) return 10;

    // EB = +2
    if (d.ctrl.some(c => c === EB)) score += 2;

    // PF = +1
    if (d.ctrl.some(c => c && typeof c === 'object' && c !== EB && c !== COFRE && c.label)) score += 1;

    // Carcinogenic reagents = +2
    if (d.reagents && d.reagents.some(r => r && r.carc)) score += 2;

    // Reagent count adds minor weight (max +2)
    score += Math.min(2, Math.floor((d.reagents ? d.reagents.length : 0) / 5));

    return score;
  }

  function _riskLevel(score) {
    if (score >= 10) return { level: 'extreme', color: '#ff4444', label: '⚡ EXTREMO', pct: 100, blink: true };
    if (score >= 7)  return { level: 'high',    color: '#ff7744', label: '🔴 ALTO',    pct: 78,  blink: false };
    if (score >= 5)  return { level: 'medium',  color: '#ffb84a', label: '🟡 MÉDIO',   pct: 55,  blink: false };
    if (score >= 3)  return { level: 'low',     color: '#5de89a', label: '🟢 BAIXO',   pct: 30,  blink: false };
    return               { level: 'minimal',  color: '#5ab4ff', label: '🔵 MÍNIMO',  pct: 14,  blink: false };
  }

  function _riskMiniHTML(key) {
    const score = _shelfRiskScore(key);
    const risk  = _riskLevel(score);
    const blinkClass = risk.blink ? ' risk-blink' : '';
    return `<div class="shelf-risk-mini" title="Risco estimado: ${risk.label}">
      <span class="shelf-risk-label">Risco</span>
      <div class="shelf-risk-track">
        <div class="shelf-risk-fill${blinkClass}" style="width:${risk.pct}%;background:${risk.color}"></div>
      </div>
    </div>`;
  }

  // ── Maquete filter & search ───────────────────────────────────────────────

  function setMaqueteFilter(filter, btn) {
    const container = document.getElementById('maqueteSearchResults');

    if (maqueteActiveFilter === filter && filter !== 'all') {
      maqueteActiveFilter = 'all';
      document.querySelectorAll('.mfilter').forEach(b => b.classList.remove('active'));
      document.querySelector('.mfilter[data-filter="all"]').classList.add('active');
      container.classList.remove('filter-reveal');
      container.classList.add('filter-hide');
      setTimeout(() => { container.style.display = 'none'; container.classList.remove('filter-hide'); }, 320);
      return;
    }

    maqueteActiveFilter = filter;
    document.querySelectorAll('.mfilter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    performMaqueteSearch();
    container.classList.remove('filter-reveal', 'filter-hide');
    void container.offsetWidth;
    container.classList.add('filter-reveal');
  }

  function goToIncompat() {
    const btn = Array.from(document.querySelectorAll('.tab'))
      .find(t => (t.getAttribute('onclick') || '').includes('incompatibilidade'));
    showTab('incompatibilidade', btn || null);
  }

  function performMaqueteSearch() {
    const inputEl = document.getElementById('maqueteSearchInput');
    const q = normalizeStr(inputEl ? inputEl.value.trim() : '');
    const container = document.getElementById('maqueteSearchResults');

    if (!q && maqueteActiveFilter === 'all') { container.style.display = 'none'; return; }

    let matches = [];
    for (let key in SHELF_DATA) {
      const shelf = SHELF_DATA[key];
      if (!shelf || !shelf.reagents) continue;
      const wallChar = key.charAt(0);
      const levelNum = key.charAt(1);
      const wallInfo = WALLS[wallChar] || { name: 'Desconhecida', color: '#7a8499' };

      if (maqueteActiveFilter !== 'all' && maqueteActiveFilter !== 'pf' && maqueteActiveFilter !== 'carc' && wallChar !== maqueteActiveFilter) continue;

      shelf.reagents.forEach(reagent => {
        if (!reagent) return;
        const rName = typeof reagent === 'string' ? reagent : reagent.name;
        const rCtrl = typeof reagent === 'object' ? reagent.ctrl : null;
        const rCode = (typeof reagent === 'object' && reagent.code) ? reagent.code : null;
        const rCarc = typeof reagent === 'object' ? !!reagent.carc : false;
        const nName = normalizeStr(rName);

        if (maqueteActiveFilter === 'pf' && rCtrl !== 'PF') return;
        if (maqueteActiveFilter === 'carc' && !rCarc) return;

        if (q) {
          const codeMatch = rCode && normalizeStr(rCode) === q.replace(/\s+/g,'');
          const terms = [q];
          if (q.length >= 2) {
            const qNoSpace = q.replace(/\s+/g,'');
            for (let f in FORMULAS) {
              if (f.includes(qNoSpace) || qNoSpace.includes(f)) terms.push(normalizeStr(FORMULAS[f]));
            }
          }
          if (!codeMatch && (!rName || !terms.some(t => t && nName.includes(t)))) return;
        }

        matches.push({ name: rName, ctrl: rCtrl, ctrlLabel: reagent.ctrlLabel || null, code: rCode, carc: rCarc,
          shelfKey: key, shelfTitle: shelf.title, wallName: wallInfo.name, wallChar, level: levelNum,
          icon: shelf.icon || '🧪', color: wallInfo.color });
      });
    }

    container.style.display = 'block';
    if (!matches.length) {
      container.innerHTML = '<div class="search-empty"><span class="se-icon">📦</span><span>Nenhum reagente encontrado.</span><span class="se-hint">Tente outra parede ou limpe os filtros.</span></div>';
      return;
    }

    const shown = matches.slice(0, 50);
    container.innerHTML = shown.map(m => {
      const ctrlHtml = m.ctrl === 'PF' ? `<span class="ctrl-tag-pf">${m.ctrlLabel || '🔒 PF'}</span>` :
                       m.ctrl === 'EB' ? '<span class="ctrl-tag-eb">⚔️ EB</span>' : '';
      const carcHtml = m.carc ? '<span class="ctrl-tag-carc">⚠️ CARC</span>' : '';
      const codeHtml = m.code ? `<span class="code-chip code-chip-${m.wallChar}">${m.code}</span>` : '';
      return `<div class="mresult-item" onclick="goToShelf('${m.wallChar}','${m.shelfKey}')">
        <span>${m.icon}</span>
        <span class="mresult-name">${m.name} ${ctrlHtml}${carcHtml}</span>
        ${codeHtml}
        <span class="mresult-loc" style="color:${m.color};">P${m.level} · ${m.wallName.split(' — ')[0]}</span>
      </div>`;
    }).join('') + (matches.length > 50 ? `<div class="mresult-count">Mostrando 50 de ${matches.length}. Refine a busca.</div>` : '');
  }

  function goToShelf(wall, key) {
    selectWall(wall);
    setTimeout(() => {
      showShelf(key);
      const row = document.querySelector(`.shelf-row[data-key="${key}"]`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const wi = WALLS[wall];
        row.style.background = wi.color + '33';
        setTimeout(() => { row.style.background = ''; }, 1500);
      }
    }, 150);
  }

  function selectWall(wall) {
    document.querySelectorAll('.wallbtn').forEach(b => b.classList.toggle('active', b.dataset.wall === wall));
    const wi = WALLS[wall];
    document.getElementById('wallCaption').innerHTML = wi.icon + ' <strong style="color:'+wi.color+'">' + wi.name + '</strong>';

    const stack = document.getElementById('shelfStack');
    stack.classList.remove('fade-in-up');
    void stack.offsetWidth;
    stack.style.display = 'block';
    stack.classList.add('fade-in-up');

    document.getElementById('stackIcon').textContent = wi.icon;
    const st = document.getElementById('stackTitle');
    st.textContent = wi.name; st.style.color = wi.color;
    document.getElementById('stackNote').textContent = wi.note;
    const rows = document.getElementById('shelfRows');
    rows.innerHTML = '';

    [6,5,4,3,2,1].forEach(n => {
      const key = wall + n;
      const d = SHELF_DATA[key];
      if (!d) return;

      const easy = n <= 3;
      const hasCtrl = d.ctrl && d.ctrl.length > 0;
      const row = document.createElement('div');
      row.className = 'shelf-row';
      row.style.setProperty('--sc', wi.color);
      row.dataset.key = key;
      row.onclick = () => showShelf(key);

      const bottles = BOTTLE_H[n].map(h => `<i style="width:${4+Math.round(h/4)}px;height:${h}px;"></i>`).join('');
      const accessBadge = easy
        ? '<span class="access-tag access-easy">✓ fácil</span>'
        : '<span class="access-tag access-ladder">🪜 escada</span>';

      const ctrlBadge = hasCtrl
        ? (() => {
            if (d.ctrl.some(c => c === COFRE)) return '<span class="access-tag access-cofre">🔐 COFRE</span>';
            const pfCtrls = d.ctrl.filter(c => c && typeof c === 'object' && c !== EB && c.label);
            if (pfCtrls.length > 0) {
              const labels = [...new Set(pfCtrls.map(c => c.label.replace('🔒 PF · ','').replace('🔒 ','').trim()))];
              return labels.map(l => `<span class="access-tag access-pf">🔒 PF ${l}</span>`).join(' ');
            }
            return '<span class="access-tag access-pf">🔒 PF</span>';
          })()
        : '';

      const ebBadge = d.ctrl && d.ctrl.some(c => c === EB)
        ? '<span class="access-tag access-eb">⚔️ EB</span>'
        : '';

      // Risk mini bar
      const riskMini = _riskMiniHTML(key);

      // Sheets badge if applicable
      const sheetsOverride = (typeof _sheetsData !== 'undefined' && _sheetsData) ? _sheetsVerifiedCount(key) : 0;
      const sheetsBadge = sheetsOverride > 0 ? `<span class="sheets-badge" title="${sheetsOverride} item(s) verificados via Planilha Google">📊 ${sheetsOverride}</span>` : '';

      row.innerHTML =
        '<div class="shelf-tag">P'+n+'</div>'
        + '<div class="shelf-row-body">'
        +   '<div class="shelf-row-title">'+d.icon+' '+d.title.replace(/ 🪜$/,'').replace(' · PF','').replace(' · Exército','')
        +     (hasCtrl || ebBadge ? ' '+ctrlBadge+ebBadge : '')+sheetsBadge+'</div>'
        +   '<div class="shelf-row-sub">'+d.short+'</div>'
        + '</div>'
        + '<div class="shelf-right-meta">'
        +   accessBadge
        +   riskMini
        + '</div>'
        + '<div class="shelf-bottles">'+bottles+'</div>';

      rows.appendChild(row);
    });

    document.getElementById('shelfPanel').style.display = 'none';
    setTimeout(() => { stack.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  }

  function showShelf(key) {
    document.querySelectorAll('.shelf-row').forEach(r => r.classList.toggle('active', r.dataset.key === key));
    const d = SHELF_DATA[key];
    if (!d) return;
    const wall = key[0];
    const wi = WALLS[wall];
    const num = parseInt(key.slice(1));
    const easy = num <= 3;
    const panel = document.getElementById('shelfPanel');

    panel.classList.remove('fade-in-up');
    void panel.offsetWidth;
    panel.style.display = 'block';
    panel.classList.add('fade-in-up');

    document.getElementById('pIcon').textContent = d.icon;
    document.getElementById('pWall').textContent = wi.name + ' · P' + num;
    document.getElementById('pTitle').textContent = d.title.replace(/ 🪜$/,'');
    const b = document.getElementById('pBadge');
    b.textContent = easy ? '✓ ACESSO FÁCIL' : '🪜 REQUER ESCADA';
    b.className = 'pbadge ' + (easy ? 'pbadge-easy' : 'pbadge-ladder');

    const pCtrl = document.getElementById('pCtrl');
    pCtrl.innerHTML = '';
    if (d.ctrl && d.ctrl.length) {
      d.ctrl.forEach(c => {
        const s = document.createElement('span');
        s.className = 'ctrl-badge';
        s.textContent = c.label;
        s.style.background = c.bg;
        s.style.color = c.color;
        pCtrl.appendChild(s);
      });
      pCtrl.style.display = 'flex';
    } else {
      pCtrl.style.display = 'none';
    }

    document.getElementById('pAccess').textContent = '';
    document.getElementById('pDesc').textContent = d.desc;

    const rd = document.getElementById('pReagents');
    rd.innerHTML = '';

    d.reagents.forEach(reagent => {
      const name = typeof reagent === 'string' ? reagent : reagent.name;
      const ctrl = typeof reagent === 'object' ? reagent.ctrl : null;
      const code = typeof reagent === 'object' ? reagent.code : null;
      const carc = typeof reagent === 'object' ? !!reagent.carc : false;

      // Sheets-verified overlay
      const sheetsItem = (typeof _sheetsData !== 'undefined' && _sheetsData && code) ? _sheetsData[code.toUpperCase()] : null;

      const wrapper = document.createElement('div');
      wrapper.className = 'chip-wrapper';

      const chip = document.createElement('span');
      chip.className = 'reagent-chip';
      chip.textContent = name;
      addChipTooltip(chip, name);

      if (ctrl === 'PF') {
        chip.classList.add('chip-pf');
        const badge = document.createElement('span');
        badge.className = 'chip-ctrl-badge chip-ctrl-badge-pf';
        badge.textContent = '🔒 PF';
        badge.title = 'Controlado PF — SIPROQUIM 2 (Portaria MJSP 204/2022)';
        wrapper.appendChild(chip);
        wrapper.appendChild(badge);
      } else if (ctrl && typeof ctrl === 'object' && ctrl !== EB && ctrl.label) {
        chip.classList.add('chip-pf');
        const badge = document.createElement('span');
        badge.className = 'chip-ctrl-badge chip-ctrl-badge-pf';
        badge.textContent = ctrl.label;
        badge.title = 'Controlado PF — SIPROQUIM 2 (Portaria MJSP 204/2022)';
        wrapper.appendChild(chip);
        wrapper.appendChild(badge);
      } else if (ctrl === 'EB') {
        chip.classList.add('chip-eb');
        const badge = document.createElement('span');
        badge.className = 'chip-ctrl-badge chip-ctrl-badge-eb';
        badge.textContent = '⚔️ EB';
        badge.title = 'Controlado pelo Exército Brasileiro — SisFPC';
        wrapper.appendChild(chip);
        wrapper.appendChild(badge);
      } else {
        chip.style.cssText = 'background:'+wi.bg+';color:'+wi.color+';border:1px solid '+wi.color+'55;';
        wrapper.appendChild(chip);
      }

      // Carcinogen badge
      if (carc) {
        const carcBadge = document.createElement('span');
        carcBadge.className = 'chip-ctrl-badge chip-ctrl-badge-carc';
        carcBadge.textContent = '⚠️ CARC';
        carcBadge.title = 'Suspeita carcinogênica (IARC) — EPI completo obrigatório';
        wrapper.appendChild(carcBadge);
      }

      // Code chip
      if (code) {
        const codeChip = document.createElement('span');
        codeChip.className = `code-chip code-chip-${wall}`;
        codeChip.textContent = code;
        codeChip.title = 'Código interno: ' + code;
        wrapper.appendChild(codeChip);
      }

      // Sheets-verified badge
      if (sheetsItem) {
        const shBadge = document.createElement('span');
        shBadge.className = 'chip-ctrl-badge chip-sheets-badge';
        shBadge.textContent = '📊';
        shBadge.title = 'Verificado via Planilha Google' + (sheetsItem.notes ? ': ' + sheetsItem.notes : '');
        wrapper.appendChild(shBadge);
      }

      rd.appendChild(wrapper);
    });

    const rv = document.getElementById('pRule');
    rv.textContent = d.rule;
    rv.style.background = d.rc;
    rv.style.color = d.rt;
    rv.style.border = '1px solid '+d.rt+'44';

    setTimeout(() => { panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 50);
  }

  // Helper used by selectWall badge
  function _sheetsVerifiedCount(key) {
    if (typeof _sheetsData === 'undefined' || !_sheetsData) return 0;
    const d = SHELF_DATA[key];
    if (!d || !d.reagents) return 0;
    return d.reagents.filter(r => r && r.code && _sheetsData[r.code.toUpperCase()]).length;
  }
