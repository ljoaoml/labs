
  // Guard: verifica se data.js foi carregado corretamente
  if (typeof CLASS_DRAWER_DATA === 'undefined' || typeof SHELF_DATA === 'undefined') {
    document.body.innerHTML = '<div style="padding:40px;text-align:center;font-family:sans-serif;color:#ff7070;">' +
      '<h2>⚠️ Erro ao carregar dados</h2>' +
      '<p style="margin-top:12px;color:#aaa;">Não foi possível carregar <code>data.js</code>. Verifique a conexão ou recarregue a página.</p>' +
      '</div>';
    throw new Error('data.js não carregado — execução interrompida.');
  }

  function openClassDrawer(id, ev) {
    const d = CLASS_DRAWER_DATA[id];
    if (!d) return;
    document.getElementById('drawerEmoji').textContent = d.emoji;
    document.getElementById('drawerTitle').textContent = d.title;
    document.getElementById('drawerBadge').style.color = d.color;
    document.getElementById('drawerBadge').textContent = d.badge;
    document.getElementById('drawerAccentBar').style.background = d.color;
    document.getElementById('drawerBody').innerHTML = d.body;
    // Mark active card
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('expanded'));
    if (ev && ev.currentTarget) ev.currentTarget.classList.add('expanded');
    // Open
    const overlay = document.getElementById('classDrawerOverlay');
    const drawer = document.getElementById('classDrawer');
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeClassDrawer() {
    document.getElementById('classDrawerOverlay').classList.remove('open');
    document.getElementById('classDrawer').classList.remove('open');
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('expanded'));
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeClassDrawer(); });

  // ===== MICRO-FEEDBACK NOS CHIPS DE REAGENTES =====
  function addChipTooltip(chip, reagentName) {
    const cas = getCasForReagent(reagentName);
    if (!cas) return;
    chip.style.position = 'relative';
    chip.title = '';
    const tip = document.createElement('div');
    tip.style.cssText = 'display:none;position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#0d0f14;border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:0.65rem;font-family:"Space Mono",monospace;color:var(--accent);white-space:nowrap;z-index:50;box-shadow:0 4px 14px rgba(0,0,0,0.4);pointer-events:none;';
    tip.textContent = 'CAS: ' + cas;
    // small arrow
    const arrow = document.createElement('div');
    arrow.style.cssText = 'position:absolute;top:100%;left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:#0d0f14;';
    tip.appendChild(arrow);
    chip.appendChild(tip);
    chip.addEventListener('mouseenter', () => { tip.style.display = 'block'; });
    chip.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  }

  function detectClass(val) {
    const n = normalizeStr(val);
    for (const entry of REAGENT_CLASS_MAP) {
      if (entry.keys.some(k => n.includes(normalizeStr(k)))) return entry.cls;
    }
    return null;
  }

  function incompAutoComplete(input, listId) {
    const list = document.getElementById(listId);
    const val = input.value.trim();
    if (val.length < 2) { list.style.display = 'none'; return; }
    const n = normalizeStr(val);
    const matches = INCOMP_REAGENTS.filter(r => normalizeStr(r).includes(n)).slice(0, 8);
    if (!matches.length) { list.style.display = 'none'; return; }
    list.innerHTML = matches.map(m => `<div class="incomp-opt" onclick="this.parentElement.previousElementSibling.value='${m}';this.parentElement.style.display='none';">${m}</div>`).join('');
    list.style.display = 'block';
  }

  document.addEventListener('click', e => {
    ['incomp1List','incomp2List'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.contains(e.target) && e.target.id !== (id === 'incomp1List' ? 'incomp1' : 'incomp2')) el.style.display = 'none';
    });
  });

  function checkIncompat() {
    const v1 = document.getElementById('incomp1').value.trim();
    const v2 = document.getElementById('incomp2').value.trim();
    const result = document.getElementById('incompResult');
    if (!v1 || !v2) {
      result.style.display = 'block';
      result.innerHTML = '<div class="ir-info">ℹ️ Preencha os dois campos para verificar.</div>';
      return;
    }
    const c1 = detectClass(v1);
    const c2 = detectClass(v2);
    if (!c1 || !c2) {
      const unknown = !c1 ? v1 : v2;
      result.style.display = 'block';
      result.innerHTML = `<div class="ir-unknown">⚠️ Não foi possível classificar <strong>"${unknown}"</strong>. Verifique a ortografia ou consulte a FDS do reagente.</div>`;
      return;
    }
    const key = c1 + '-' + c2;
    const status = INCOMPAT_MAP[key] || (c1 === c2 ? 'warn' : 'ok');
    const mInfo = MATRIX_INFO[key] || MATRIX_INFO[c2+'-'+c1];
    let html = '';
    if (status === 'no') {
      html = `<div class="ir-incompativel">
        <div class="ir-header ir-header-incomp">❌ INCOMPATÍVEIS — NUNCA armazenar juntos</div>
        <div class="ir-classes"><strong>${v1}</strong> → Classe: ${c1} &nbsp;|&nbsp; <strong>${v2}</strong> → Classe: ${c2}</div>
        ${mInfo ? `<div class="ir-body ir-body-incomp">${mInfo.body}</div>` : ''}
      </div>`;
    } else if (status === 'warn') {
      html = `<div class="ir-cautela">
        <div class="ir-header ir-header-warn">⚠️ CAUTELA — Segregar com bandeja de contenção</div>
        <div class="ir-classes"><strong>${v1}</strong> → Classe: ${c1} &nbsp;|&nbsp; <strong>${v2}</strong> → Classe: ${c2}</div>
        ${mInfo ? `<div class="ir-body ir-body-warn">${mInfo.body}</div>` : '<div class="ir-body ir-body-warn">Manter em bandejas separadas. Consulte as FDS individuais.</div>'}
      </div>`;
    } else {
      html = `<div class="ir-ok">
        <div class="ir-header ir-header-ok">✓ Compatíveis — podem ser armazenados no mesmo armário</div>
        <div class="ir-classes"><strong>${v1}</strong> → Classe: ${c1} &nbsp;|&nbsp; <strong>${v2}</strong> → Classe: ${c2}</div>
      </div>`;
    }
    result.style.display = 'block';
    result.innerHTML = html;
  }

  function getCasForReagent(name) {
    if (typeof CAS_DB === 'undefined') return null;
    const n = normalizeStr(name);
    const found = CAS_DB.find(entry => normalizeStr(entry.name) === n || (entry.aliases && entry.aliases.some(a => normalizeStr(a) === n)));
    return found ? found.cas : null;
  }

  // ===== BUSCA INLINE COM FILTROS NA MAQUETE =====
  let maqueteActiveFilter = 'all';

  function setMaqueteFilter(filter, btn) {
    const container = document.getElementById('maqueteSearchResults');

    // Toggle: clicar no filtro já ativo fecha os resultados
    if (maqueteActiveFilter === filter && filter !== 'all') {
      maqueteActiveFilter = 'all';
      document.querySelectorAll('.mfilter').forEach(b => b.classList.remove('active'));
      document.querySelector('.mfilter[data-filter="all"]').classList.add('active');
      container.classList.remove('filter-reveal');
      container.classList.add('filter-hide');
      setTimeout(() => {
        container.style.display = 'none';
        container.classList.remove('filter-hide');
      }, 320);
      return;
    }

    maqueteActiveFilter = filter;
    document.querySelectorAll('.mfilter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    performMaqueteSearch();
    // Animação de abertura
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

    if (!q && maqueteActiveFilter === 'all') {
      container.style.display = 'none';
      return;
    }

    let matches = [];
    for (let key in SHELF_DATA) {
      const shelf = SHELF_DATA[key];
      if (!shelf || !shelf.reagents) continue;
      const wallChar = key.charAt(0);
      const levelNum = key.charAt(1);
      const wallInfo = WALLS[wallChar] || { name:'Desconhecida', color:'#7a8499' };

      // Filtro por parede
      if (maqueteActiveFilter !== 'all' && maqueteActiveFilter !== 'pf' && wallChar !== maqueteActiveFilter) continue;

      shelf.reagents.forEach(reagent => {
        if (!reagent) return;
        const rName = typeof reagent === 'string' ? reagent : reagent.name;
        const rCtrl = typeof reagent === 'object' ? reagent.ctrl : null;
        const nName = normalizeStr(rName);

        // Filtro PF
        if (maqueteActiveFilter === 'pf' && rCtrl !== 'PF') return;

        // Filtro de texto
        if (q) {
          const terms = [q];
          if (q.length >= 2) {
            const qNoSpace = q.replace(/\s+/g,'');
            for (let f in FORMULAS) {
              if (f.includes(qNoSpace) || qNoSpace.includes(f)) terms.push(normalizeStr(FORMULAS[f]));
            }
          }
          if (!rName || !terms.some(t => t && nName.includes(t))) return;
        }

        matches.push({ name: rName, ctrl: rCtrl, ctrlLabel: reagent.ctrlLabel || null, shelfKey: key, shelfTitle: shelf.title, wallName: wallInfo.name, wallChar, level: levelNum, icon: shelf.icon || '🧪', color: wallInfo.color });
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
      return `<div class="mresult-item" onclick="goToShelf('${m.wallChar}','${m.shelfKey}')">
        <span>${m.icon}</span>
        <span class="mresult-name">${m.name} ${ctrlHtml}</span>
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
        row.scrollIntoView({ behavior:'smooth', block:'center' });
        const wi = WALLS[wall];
        row.style.background = wi.color + '33';
        setTimeout(() => { row.style.background = ''; }, 1500);
      }
    }, 150);
  }

  // ===== Helpers de busca: normalização de acentos e subscritos + fórmulas químicas =====
  function normalizeStr(s) {
    if (!s) return '';
    const subs = { '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9' };
    return String(s)
      .replace(/[₀-₉]/g, c => subs[c] || c)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[´`^~¨]/g, '')
      .toLowerCase()
      .trim();
  }

  function showTab(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const target = document.getElementById(id);
    // Re-trigger animation by forcing reflow
    target.style.animation = 'none';
    target.offsetHeight;
    target.style.animation = '';
    target.classList.add('active');
    if (btn) {
      btn.classList.add('active');
      // Garante que a aba ativa fique visível na barra de scroll (mobile)
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // Fecha dropdown da busca do header
    document.getElementById('searchResultWrapper').style.display = 'none';
    // Atualiza URL hash para deep linking (compartilhar / favoritar seção)
    history.replaceState(null, '', '#' + id);
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
      row.innerHTML =
        '<div class="shelf-tag">P'+n+'</div>'
        + '<div class="shelf-row-body">'
        +   '<div class="shelf-row-title">'+d.icon+' '+d.title.replace(/ 🪜$/,'').replace(' · PF','').replace(' · Exército','')
        +     (hasCtrl || ebBadge ? ' '+ctrlBadge+ebBadge : '')+'</div>'
        +   '<div class="shelf-row-sub">'+d.short+'</div>'
        + '</div>'
        + accessBadge
        + '<div class="shelf-bottles">'+bottles+'</div>';
      rows.appendChild(row);
    });
    document.getElementById('shelfPanel').style.display = 'none';
    
    // Smooth scroll down to the loaded section
    setTimeout(() => {
      stack.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
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
    const acc = document.getElementById('pAccess');
    acc.textContent = '';
    document.getElementById('pDesc').textContent = d.desc;
    const rd = document.getElementById('pReagents');
    rd.innerHTML = '';
    d.reagents.forEach(reagent => {
      const name = typeof reagent === 'string' ? reagent : reagent.name;
      const ctrl = typeof reagent === 'object' ? reagent.ctrl : null;

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

      rd.appendChild(wrapper);
    });
    const rv = document.getElementById('pRule');
    rv.textContent = d.rule;
    rv.style.background = d.rc;
    rv.style.color = d.rt;
    rv.style.border = '1px solid '+d.rt+'44';
    
    // Smooth scroll down to the details panel
    setTimeout(() => {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  function normalizeCas(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, d => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(d)])
      .replace(/\s+/g, ' ').trim();
  }

  function performCasSearch() {
    const rawQ = document.getElementById('casSearchInput').value.trim();
    const container = document.getElementById('casResults');

    if (!rawQ) { container.innerHTML = ''; return; }

    const q = normalizeCas(rawQ);
    const qNoSpace = q.replace(/\s+/g, '');

    const matches = CAS_DB.filter(item => {
      const nameN = normalizeCas(item.name);
      const formulaN = normalizeCas(item.formula).replace(/\s/g, '');
      const casN = item.cas.replace(/-/g, '');
      const qCas = rawQ.replace(/-/g, '');
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
    
    if (!rawQ) {
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    container.innerHTML = '';
    let matches = [];

    // Normaliza a busca (sem acentos / subscritos) e expande para nomes químicos via fórmulas
    const q = normalizeStr(rawQ);
    const terms = [q];
    if (q.length >= 2) {
      const qNoSpace = q.replace(/\s+/g, '');
      for (let f in FORMULAS) {
        if (f.includes(qNoSpace) || qNoSpace.includes(f)) terms.push(normalizeStr(FORMULAS[f]));
      }
    }

    // Procura correspondências dentro da base de dados SHELF_DATA de forma segura
    for (let key in SHELF_DATA) {
      const shelf = SHELF_DATA[key];
      if (!shelf || !shelf.reagents) continue;
      
      const wallChar = key.charAt(0);
      const levelNum = key.charAt(1);
      const wallInfo = WALLS[wallChar] || { name: 'Desconhecida', color: '#7a8499' };
      
      shelf.reagents.forEach(reagent => {
        if (!reagent) return;
        const rName = typeof reagent === 'string' ? reagent : reagent.name;
        const nName = normalizeStr(rName);
        if (rName && terms.some(t => t && nName.includes(t))) {
          matches.push({
            name: rName,
            ctrl: reagent.ctrl || null,
            ctrlLabel: reagent.ctrlLabel || null,
            shelfKey: key,
            shelfTitle: shelf.title,
            wallName: wallInfo.name,
            wallChar: wallChar,
            level: levelNum,
            icon: shelf.icon || '🧪',
            color: wallInfo.color,
            ruleText: shelf.rule || ''
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
        + '<span class="se-hint">Tente um nome alternativo, fórmula (ex: H₂SO₄) ou abreviação.</span>';
      container.appendChild(noResult);
      return;
    }

    container.style.display = 'flex';
    
    matches.forEach(m => {
      const item = document.createElement('div');
      item.className = 'search-item';
      
      const ctrlBadgeHtml = m.ctrl ? `<span class="search-item-ctrl">${m.ctrlLabel || '🔒 ' + m.ctrl}</span>` : '';

      item.innerHTML = `
        <div class="search-item-title">${m.icon} ${m.name} ${ctrlBadgeHtml}</div>
        <div class="search-item-meta">
          <span class="search-item-wall" style="color:${m.color};">Parede: ${m.wallName.split(' — ')[0]}</span>
          <span>Prateleira: P${m.level}</span>
          <span>(${m.shelfTitle.replace(/ 🪜$/,'')})</span>
          ${getCasForReagent(m.name) ? `<span class="search-item-cas">CAS: ${getCasForReagent(m.name)}</span>` : ''}
        </div>
      `;

      // Redireciona e destaca visualmente a prateleira ao clicar
      item.onclick = () => {
        // Altera para a aba do almoxarifado (a quinta aba / índice 4)
        const tabsContainer = document.querySelectorAll('.tab');
        if(tabsContainer && tabsContainer[4]) {
          showTab('maquete', tabsContainer[4]);
        } else {
          showTab('maquete', null);
        }
        
        // Seleciona a parede correspondente
        selectWall(m.wallChar);
        
        // Timeout para garantir que a renderização da maquete ocorreu antes de exibir a prateleira
        setTimeout(() => {
          showShelf(m.shelfKey);
          const targetRow = document.querySelector(`.shelf-row[data-key="${m.shelfKey}"]`);
          if (targetRow) {
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Efeito visual de piscar a cor da prateleira selecionada
            targetRow.style.background = m.color + '33';
            setTimeout(() => { targetRow.style.background = ''; }, 1500);
          }
        }, 150);
      };

      container.appendChild(item);
    });
  }

  (function initMatrixTooltips() {
    const tt = document.getElementById('matrixTooltip');
    document.querySelectorAll('table.matrix td.no, table.matrix td.warn, table.matrix td.ok').forEach(cell => {
      const tr = cell.parentElement;
      const colIdx = Array.from(cell.parentElement.cells).indexOf(cell);
      // \p{L} (Unicode letters) preserva acentos como Á, ó, á que \w ignora
      const rowLabel = tr.cells[0].textContent.replace(/[^\p{L}\s]/gu,'').trim().split(/\s+/).pop();
      const colLabel = (document.querySelectorAll('table.matrix thead th')[colIdx]?.textContent || '').replace(/[^\p{L}\s]/gu,'').trim().split(/\s+/).pop();
      const key1 = rowLabel + '-' + colLabel;
      const key2 = colLabel + '-' + rowLabel;
      const info = MATRIX_INFO[key1] || MATRIX_INFO[key2];
      if (!info) return;

      cell.addEventListener('mousemove', e => {
        document.getElementById('ttTitle').textContent = info.title;
        document.getElementById('ttBody').textContent  = info.body;
        tt.classList.add('visible');
        const x = e.clientX + 14, y = e.clientY + 14;
        tt.style.left = Math.min(x, window.innerWidth  - 300) + 'px';
        tt.style.top  = Math.min(y, window.innerHeight - 120) + 'px';
      });
      cell.addEventListener('mouseleave', () => tt.classList.remove('visible'));
    });
  })();

  // Fecha busca do header ao clicar fora
  document.addEventListener('click', e => {
    const wrapper = document.getElementById('searchResultWrapper');
    if (!wrapper) return;
    if (!wrapper.closest('.header-search').contains(e.target)) {
      wrapper.style.display = 'none';
    }
  });
  document.getElementById('reagentSearchInput')?.addEventListener('focus', () => {
    const w = document.getElementById('searchResultWrapper');
    if (w && w.innerHTML.trim()) w.style.display = 'flex';
  });

  // ── Deep linking: abre aba + restaura reagente pesquisado a partir da URL ──
  // Formato: #emergencias?q=Acetona&s=emerg  |  #descarte?q=Etanol&s=descarte
  (function() {
    const VALID_TABS = ['classes','incompatibilidade','maquete','cas','regras','normas','emergencias','descarte'];
    const full  = location.hash.slice(1);           // ex: "emergencias?q=Acetona&s=emerg"
    const [tabId, qs] = full.split('?');

    if (tabId && VALID_TABS.includes(tabId)) {
      const btn = Array.from(document.querySelectorAll('.tab'))
        .find(b => (b.getAttribute('onclick') || '').includes("'" + tabId + "'"));
      showTab(tabId, btn || null);
    }

    // Restaurar reagente se houver query string
    if (qs) {
      const params = new URLSearchParams(qs);
      const q = params.get('q');
      const s = params.get('s');
      if (q && s && (s === 'emerg' || s === 'descarte')) {
        setTimeout(() => {
          const input = document.getElementById(s + 'SearchInput');
          if (!input) return;
          input.value = q;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          // Aguarda dropdown renderizar e seleciona match exato ou primeiro resultado
          setTimeout(() => {
            const dd = document.getElementById(s + 'SearchDropdown');
            if (!dd) return;
            const exact = [...dd.querySelectorAll('.qsearch-opt')]
              .find(o => o.querySelector('.qsearch-opt-name')?.textContent === q);
            (exact || dd.querySelector('.qsearch-opt'))?.click();
          }, 120);
        }, 200);
      }
    }
  })();

  // ── Gradient de overflow nas abas (indica "mais abas →" no mobile) ────────
  (function() {
    const wrap = document.getElementById('tabsWrap');
    const bar  = document.getElementById('tabsBar');
    if (!wrap || !bar) return;
    function checkOverflow() {
      wrap.classList.toggle('has-overflow', bar.scrollWidth > bar.clientWidth);
    }
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    // Esconde o gradient quando o usuário rola até o fim
    bar.addEventListener('scroll', () => {
      const atEnd = bar.scrollLeft + bar.clientWidth >= bar.scrollWidth - 4;
      wrap.classList.toggle('has-overflow', !atEnd);
    });
  })();

  // ── QUICK-SEARCH — busca de reagentes nas abas Emergências e Descarte ────

  // Normaliza strings para comparação: sem acento, minúsculas, sem símbolos químicos problemáticos
  function normalizeQSearch(s) {
    const subs = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
    return String(s || '')
      .replace(/[₀-₉]/g, c => subs[c] || c)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function reagentSearch(input, section) {
    const val = input.value.trim();
    const clearBtn = document.getElementById(section + 'SearchClear');
    const dropdown = document.getElementById(section + 'SearchDropdown');
    const panel    = document.getElementById(section + 'QRef');

    if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';

    // Reset panel if user is typing again
    if (panel) panel.style.display = 'none';

    if (!val || val.length < 2) {
      if (dropdown) dropdown.style.display = 'none';
      return;
    }

    const q = normalizeQSearch(val);
    const matches = (typeof REAGENT_QUICK_REF !== 'undefined' ? REAGENT_QUICK_REF : [])
      .filter(r => r.keys.some(k => normalizeQSearch(k).includes(q)) ||
                   normalizeQSearch(r.label).includes(q))
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

    // Atualizar URL para deep link compartilhável
    const tabId = section === 'emerg' ? 'emergencias' : 'descarte';
    history.replaceState(null, '', '#' + tabId + '?q=' + encodedLabel + '&s=' + section);

    const dropdown = document.getElementById(section + 'SearchDropdown');
    const panel    = document.getElementById(section + 'QRef');
    if (dropdown) dropdown.style.display = 'none';
    if (!panel) return;

    // Badge de alerta
    let alertBadge = '';
    if (ref.alert === 'danger') alertBadge = '<span class="qref-badge danger">ALTA PERICULOSIDADE</span>';
    else if (ref.alert === 'warn') alertBadge = '<span class="qref-badge warn">ATENÇÃO</span>';

    // Nota crítica
    const noteHTML = ref.note
      ? `<div class="qref-note ${ref.alert}">${ref.note}</div>`
      : '';

    // Conteúdo por seção
    let bodyHTML = '';
    if (section === 'emerg') {
      const steps = (ref.emerg || []).map((s, i) =>
        `<li><span class="qref-step-num">${i+1}</span><span>${s}</span></li>`
      ).join('');
      bodyHTML = `
        <div class="qref-steps-title">⚡ Ações Imediatas — Primeiros Socorros</div>
        <ul class="qref-steps">${steps}</ul>`;
    } else {
      bodyHTML = `
        <div class="qref-steps-title">♻️ Método de Descarte</div>
        <ul class="qref-steps">
          <li><span class="qref-step-num">▸</span><span>${ref.descarte || 'Consultar protocolo da classe.'}</span></li>
        </ul>`;
    }

    const targetId = section === 'emerg' ? ref.ec : ref.dc;
    const btnLabel = section === 'emerg' ? 'Ver protocolo completo →' : 'Ver método completo →';

    // EPI section
    let epiHTML = '';
    if (ref.epi && ref.epi.length) {
      const items = ref.epi.map(e => `<li class="qref-epi-item">${e}</li>`).join('');
      epiHTML = `<div class="qref-steps-title">🦺 EPI para Contenção de Vazamento</div>
        <ul class="qref-epi-list">${items}</ul>`;
    }

    // ID único para o container PubChem
    const pcId = 'pc-' + section + '-' + Date.now();

    panel.className = `qref-panel ${ref.alert}`;
    panel.innerHTML = `
      <div class="qref-header">
        <div>
          <span class="qref-label">${ref.label}</span>
          <div class="qref-badges">
            ${alertBadge}
            <span class="qref-badge class">${ref.class_label}</span>
          </div>
        </div>
        <button class="qref-close" onclick="closeQRef('${section}')" title="Fechar">✕</button>
      </div>
      ${noteHTML}
      ${bodyHTML}
      ${epiHTML}
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

    // Apenas pictogramas GHS no painel de emergência/descarte
    fetchPubChem(ref.keys, pcId, true);
  }

  // ── PubChem API ────────────────────────────────────────────────

  // Cache simples: evita chamadas repetidas para o mesmo reagente
  const _pcCache = new Map();

  // Busca recursiva por TOCHeading dentro de Section[] — usada em múltiplos parsers
  function _pcFindSection(sections, heading) {
    if (!Array.isArray(sections)) return null;
    for (const s of sections) {
      if (s.TOCHeading === heading) return s;
      const found = _pcFindSection(s.Section, heading);
      if (found) return found;
    }
    return null;
  }

  // Extrai o primeiro valor legível de uma seção pug_view
  function _pcExtractValue(section) {
    const raw = section?.Information?.[0]?.Value?.StringWithMarkup?.[0]?.String;
    if (!raw) return null;
    // Remove fonte entre parênteses no final e pega só a primeira linha
    return raw.split('\n')[0].replace(/\s*\([^)]*\)\s*$/, '').trim() || null;
  }

  async function fetchPubChem(keys, containerId, picsOnly = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cacheKey = Array.isArray(keys) ? keys[0] : keys;
    const keyList  = Array.isArray(keys) ? keys : [keys];

    // Helper: wraps fetch com timeout individual
    function _fetchTimeout(url, ms = 10000) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ms);
      return fetch(url, { signal: ctrl.signal })
        .finally(() => clearTimeout(timer));
    }

    // Mostra erro com botão de retry
    function _showRetry(msg) {
      if (!document.getElementById(containerId)) return;
      container.innerHTML = `<div class="qref-pc-error">${msg}
        <button class="qref-pc-retry" onclick="fetchPubChem(${JSON.stringify(keys)},'${containerId}')">↩ Tentar novamente</button>
      </div>`;
    }

    // Verificar cache
    if (_pcCache.has(cacheKey)) {
      renderPubChemData(container, _pcCache.get(cacheKey), picsOnly);
      return;
    }

    // 1. Tentar cada key em sequência até obter um CID válido (timeout 10s por tentativa)
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

    if (!cid) {
      _showRetry('⚠️ Reagente não encontrado no PubChem.');
      return;
    }

    try {
      // 2. Três chamadas em paralelo com timeout de 12s total
      const deadline = new Promise((_, rej) =>
        setTimeout(() => rej(new Error('timeout')), 12000)
      );

      const [propRes, ghsRes, expRes] = await Promise.race([
        Promise.all([
          _fetchTimeout(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula/JSON`),
          _fetchTimeout(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=Chemical+Safety`),
          _fetchTimeout(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=Experimental+Properties`)
        ]),
        deadline
      ]);

      const propJson = propRes.ok ? await propRes.json() : null;
      // Se "Chemical Safety" falhou, tentar "GHS Classification" como fallback
      let ghsJson = ghsRes.ok ? await ghsRes.json() : null;
      if (!ghsJson?.Record) {
        try {
          const fb = await _fetchTimeout(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=GHS+Classification`);
          if (fb.ok) { const j = await fb.json(); if (j?.Record) ghsJson = j; }
        } catch(_) {}
      }
      const expJson = expRes.ok ? await expRes.json() : null;

      const formula = propJson?.PropertyTable?.Properties?.[0]?.MolecularFormula ?? null;
      const ghs     = parsePubChemGHS(ghsJson);
      const exp     = parsePubChemExp(expJson);

      const result = { cid, formula, ...ghs, ...exp };
      _pcCache.set(cacheKey, result);
      renderPubChemData(container, result, picsOnly);

    } catch (e) {
      if (e.message === 'timeout') {
        _showRetry('⏱️ PubChem não respondeu a tempo.');
      } else {
        _showRetry('⚠️ Erro ao carregar dados PubChem.');
      }
    }
  }

  function parsePubChemGHS(data) {
    const result = { pictograms: [], hPhrases: [] };
    if (!data?.Record) return result;

    const root = data.Record.Section ?? [];
    const seenPic = new Set();
    const seenH   = new Set();

    // Extrai TODOS os pictogramas de um StringWithMarkup.
    // O PubChem pode ter vários pictogramas num único Markup[] (ex: GHS02 + GHS07 + GHS09
    // como entradas separadas do mesmo array) — por isso iteramos todos sem break.
    // Fallback: quando o Markup[] não tem URL ghs, tenta extrair do campo String.
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
      // Fallback: extrair do texto String quando Markup não tem URLs ghs
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

    // Varredura recursiva completa da árvore de seções:
    // independe do nome das seções (varia por fonte: ECHA, EPA, Japan ChemSafety…)
    function _walk(sections) {
      for (const s of sections ?? []) {
        for (const info of s.Information ?? []) {
          for (const swm of info.Value?.StringWithMarkup ?? []) {
            // Pictograma: qualquer swm que tenha URL de imagem ghs no Markup
            if (swm.Markup?.some(mk => mk.URL?.includes('/images/ghs/'))) {
              _extractPic(swm);
            }
            // Frases H (H200–H420 etc.)
            const hm = swm.String?.match(/\bH\d{3}\b/);
            if (hm && !seenH.has(hm[0])) {
              seenH.add(hm[0]);
              result.hPhrases.push(hm[0]);
            }
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

  // Monta HTML dos pictogramas GHS (compartilhado entre os dois modos de render)
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

  // picsOnly=true → só pictogramas (painel emergência/descarte)
  // picsOnly=false → dados completos (aba CAS)
  function renderPubChemData(container, data, picsOnly = false) {
    if (!container) return;
    if (!data) {
      container.innerHTML = '<div class="qref-pc-error">⚠️ Dados PubChem não disponíveis.</div>';
      return;
    }

    const cidLink = `<a class="qref-pc-link" href="https://pubchem.ncbi.nlm.nih.gov/compound/${data.cid}" target="_blank" rel="noopener">CID ${data.cid} ↗</a>`;
    const picsHTML = _buildPicsHTML(data);

    // ── Modo compacto: apenas pictogramas (emergência/descarte) ──────────────
    if (picsOnly) {
      container.innerHTML = `
        <div class="qref-pc-header">
          <span>Perigos GHS · PubChem</span>
          ${cidLink}
        </div>
        <div class="qref-pc-pics">${picsHTML}</div>`;
      return;
    }

    // ── Modo completo: propriedades + pictogramas + frases H (aba CAS) ───────
    const physProps = [
      { label: '🔥 Ponto de Fulgor',   val: data.flashPoint },
      { label: '♨️ Ponto de Ebulição', val: data.boilingPoint },
      { label: '💨 Pressão de Vapor',  val: data.vaporPressure },
      { label: '💧 Solubilidade',       val: data.solubility },
      { label: '⚗️ Fórmula',            val: data.formula },
    ].filter(p => p.val);

    const propsHTML = physProps.length
      ? `<div class="qref-pc-props">${
          physProps.map(p =>
            `<span class="qref-pc-prop">
              <span class="qref-pc-prop-label">${p.label}</span>
              <span class="qref-pc-prop-value">${p.val}</span>
            </span>`
          ).join('')
        }</div>`
      : '';

    const hHTML = [...new Set(data.hPhrases ?? [])].map(code => {
      const text = (typeof H_PHRASES !== 'undefined' && H_PHRASES[code]) || code;
      return `<div class="qref-pc-hphrase">
        <span class="qref-pc-hcode">${code}</span>
        <span class="qref-pc-htext">${text}</span>
      </div>`;
    }).join('');

    container.innerHTML = `
      <div class="qref-pc-header">
        <span>📊 PubChem · NIH</span>
        ${cidLink}
      </div>
      ${propsHTML}
      <div class="qref-pc-section-label">Pictogramas GHS</div>
      <div class="qref-pc-pics">${picsHTML}</div>
      ${hHTML ? `<div class="qref-pc-section-label">Frases H — Declarações de perigo (pt-BR)</div>
      <div class="qref-pc-hphrases">${hHTML}</div>` : ''}
    `;
  }

  function closeQRef(section) {
    const panel = document.getElementById(section + 'QRef');
    if (panel) panel.style.display = 'none';
    // Limpar query string da URL mas preservar o hash da aba
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

  // ── Navegação por teclado no dropdown de busca (↑↓ Enter Escape) ────────
  function initQSearchKeyboard(section) {
    const input = document.getElementById(section + 'SearchInput');
    const dropdown = document.getElementById(section + 'SearchDropdown');
    if (!input || !dropdown) return;

    input.addEventListener('keydown', e => {
      if (dropdown.style.display === 'none') return;
      const opts = [...dropdown.querySelectorAll('.qsearch-opt[onclick]')];
      if (!opts.length) return;

      const focused = dropdown.querySelector('.qsearch-opt.kb-focus');
      const idx = focused ? opts.indexOf(focused) : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (focused) focused.classList.remove('kb-focus');
        opts[Math.min(idx + 1, opts.length - 1)].classList.add('kb-focus');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (focused) focused.classList.remove('kb-focus');
        if (idx > 0) opts[idx - 1].classList.add('kb-focus');
      } else if (e.key === 'Enter') {
        if (focused) { e.preventDefault(); focused.click(); }
        else if (opts[0]) { e.preventDefault(); opts[0].click(); }
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none';
        input.blur();
      }
    });

    // Limpar kb-focus quando o mouse entra em qualquer opção
    dropdown.addEventListener('mouseenter', () => {
      dropdown.querySelectorAll('.qsearch-opt.kb-focus')
        .forEach(o => o.classList.remove('kb-focus'));
    });
  }

  // Inicializar teclado para as duas seções após DOM pronto
  initQSearchKeyboard('emerg');
  initQSearchKeyboard('descarte');

  // ── Accordion exclusivo: fecha sub-tópicos irmãos ao abrir um novo ─────────
  document.querySelectorAll('.emerg-class-card').forEach(card => {
    card.addEventListener('toggle', e => {
      if (!e.target.open || !e.target.classList.contains('emerg-scenario')) return;
      card.querySelectorAll('details.emerg-scenario').forEach(d => {
        if (d !== e.target) d.removeAttribute('open');
      });
    }, true);
  });

  // ── Accordion exclusivo: fecha cards de classe irmãos ao abrir um novo ─────
  const emergSection = document.getElementById('emergencias');
  if (emergSection) {
    emergSection.addEventListener('toggle', e => {
      if (!e.target.open || !e.target.classList.contains('emerg-class-card')) return;
      emergSection.querySelectorAll('details.emerg-class-card').forEach(d => {
        if (d !== e.target) d.removeAttribute('open');
      });
    }, true);
  }

  // ── Select-all ao clicar num campo de busca com texto ─────────────────────
  ['reagentSearchInput', 'emergSearchInput', 'descarteSearchInput', 'casSearchInput', 'maqueteSearchInput']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => { if (el.value) el.select(); });
    });

  window.searchChip = function(name, section) {
    const input = document.getElementById(section + 'SearchInput');
    if (!input) return;
    // Rolar até a barra de busca e preencher
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.value = name;
    // Disparar a busca
    input.dispatchEvent(new Event('input', { bubbles: true }));
    // Após renderizar o dropdown, auto-selecionar o primeiro resultado
    setTimeout(() => {
      const dropdown = document.getElementById(section + 'SearchDropdown');
      if (!dropdown) return;
      const first = dropdown.querySelector('.qsearch-opt');
      if (first) first.click();
    }, 80);
  };

  // Abre/fecha bloco PubChem completo dentro de um card CAS
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

    // Skeleton enquanto carrega
    panel.innerHTML = `<div class="qref-pc-skeleton cas-pc-skeleton">
      <div class="qref-pc-skel-line" style="width:55%"></div>
      <div class="qref-pc-skel-line" style="width:88%"></div>
      <div class="qref-pc-skel-line" style="width:70%"></div>
      <div class="qref-pc-skel-line" style="width:82%"></div>
    </div>`;

    // CAS é aceito como nome pelo PubChem (ex: "64-17-5")
    fetchPubChem([cas], panelId, false);
  };

  function scrollToCard(id) {
    const el = document.getElementById(id);
    if (!el) return;
    // Se for um <details> colapsado, abrir antes de rolar
    if (el.tagName === 'DETAILS' && !el.open) el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('qref-highlight');
    void el.offsetWidth;
    el.classList.add('qref-highlight');
    setTimeout(() => el.classList.remove('qref-highlight'), 2000);
  }

  // Fechar dropdown de busca ao clicar fora
  document.addEventListener('click', e => {
    ['emerg','descarte'].forEach(section => {
      const dropdown = document.getElementById(section + 'SearchDropdown');
      const input    = document.getElementById(section + 'SearchInput');
      if (dropdown && input && !dropdown.contains(e.target) && e.target !== input) {
        dropdown.style.display = 'none';
      }
    });
  });

  // Botão voltar ao topo
  (function() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 320);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  })();

  // Tornar chips de reagentes clicáveis — redireciona para busca rápida
  document.addEventListener('DOMContentLoaded', () => {
    // Chips de emergência
    document.querySelectorAll('#emergencias .emerg-reagent-chip').forEach(chip => {
      chip.classList.add('is-searchable');
      chip.style.cursor = 'pointer';
      chip.addEventListener('click', () => searchChip(chip.textContent.trim(), 'emerg'));
    });
    // Chips de descarte
    document.querySelectorAll('#descarte .emerg-reagent-chip, #descarte .descarte-chip').forEach(chip => {
      chip.classList.add('is-searchable');
      chip.style.cursor = 'pointer';
      chip.addEventListener('click', () => searchChip(chip.textContent.trim(), 'descarte'));
    });

    // ── ARIA labels — remove emoji do nome acessível dos accordions ───────────
    // Cards de classe (ex: "🔥 Inflamáveis e Combustíveis" → "Inflamáveis e Combustíveis")
    document.querySelectorAll('.emerg-class-card > summary').forEach(s => {
      const title = s.querySelector('.emerg-class-header-title');
      if (title) s.setAttribute('aria-label', title.textContent.trim());
    });
    // Sub-tópicos de cenário (ex: "🩹 Contato com a pele" → "Contato com a pele")
    document.querySelectorAll('.emerg-scenario > summary').forEach(s => {
      const clean = s.textContent.replace(/\p{Emoji_Presentation}/gu, '').trim();
      if (clean) s.setAttribute('aria-label', clean);
    });
    // Cards de descarte
    document.querySelectorAll('.descarte-card > summary').forEach(s => {
      const clean = s.textContent.replace(/\p{Emoji_Presentation}/gu, '').trim();
      if (clean) s.setAttribute('aria-label', clean);
    });
  });
