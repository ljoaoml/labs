
  // Guard: verifica se data.js foi carregado corretamente
  if (typeof CLASS_DRAWER_DATA === 'undefined' || typeof SHELF_DATA === 'undefined') {
    document.body.innerHTML = '<div style="padding:40px;text-align:center;font-family:sans-serif;color:#ff7070;">' +
      '<h2>⚠️ Erro ao carregar dados</h2>' +
      '<p style="margin-top:12px;color:#aaa;">Não foi possível carregar <code>data.js</code>. Verifique a conexão ou recarregue a página.</p>' +
      '</div>';
    throw new Error('data.js não carregado — execução interrompida.');
  }

  function toggleCard(card) {
    const isExpanded = card.classList.contains('expanded');
    document.querySelectorAll('.class-card.expanded').forEach(c => {
      c.classList.remove('expanded');
      const hint = c.querySelector('.expand-hint');
      if (hint) hint.textContent = '▼ clique para expandir';
    });
    if (!isExpanded) {
      card.classList.add('expanded');
      const hint = card.querySelector('.expand-hint');
      if (hint) hint.textContent = '▲ clique para retrair';
    }
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
      container.innerHTML = '<div class="search-empty">Nenhum reagente encontrado.</div>';
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
    
    // UX REWRITE: Remove and trigger CSS transition class cleanly
    stack.classList.remove('fade-in-up');
    void stack.offsetWidth; // Force CSS reflow
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
    
    // UX REWRITE: Trigger clean transition on the details panel
    panel.classList.remove('fade-in-up');
    void panel.offsetWidth; // Force CSS reflow
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
      container.innerHTML = '<div class="search-empty">Nenhuma substância encontrada. Tente outro nome ou fórmula.</div>';
      return;
    }

    const grid = matches.slice(0, 40).map(m => `
      <div class="cas-card">
        <div class="cas-card-top">
          <span class="cas-card-name">${m.name}</span>
          <span class="cas-card-formula">${m.formula}</span>
        </div>
        <div class="cas-card-bottom">
          <span class="cas-number">🔢 ${m.cas}</span>
          <button class="cas-copy-btn" onclick="navigator.clipboard.writeText('${m.cas}').then(()=>{this.textContent='✓ Copiado!';setTimeout(()=>this.textContent='Copiar CAS',1500)})">Copiar CAS</button>
        </div>
      </div>
    `).join('');

    const countNote = matches.length > 40 ? `<div class="cas-count-note">Mostrando 40 de ${matches.length} resultados. Refine a busca para ver mais.</div>` : '';
    container.innerHTML = `<div class="cas-grid">${grid}</div>${countNote}`;
  }

  // SEARCH ENGINE CORE LOGIC - ROBUST AND ABSOLUTELY INDEPENDENT
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
      noResult.textContent = 'Nenhum reagente encontrado com esse termo.';
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
    const rows = ['Inflamável','Corrosivo','Oxidante','Tóxico','Ácido','Base','Inerte'];
    document.querySelectorAll('table.matrix td.no, table.matrix td.warn').forEach(cell => {
      const tr = cell.parentElement;
      const colIdx = Array.from(cell.parentElement.cells).indexOf(cell);
      const rowLabel = tr.cells[0].textContent.replace(/[^\w\s]/gu,'').trim().split(' ').pop();
      const colLabel = document.querySelectorAll('table.matrix thead th')[colIdx]?.textContent.replace(/[^\w\s]/gu,'').trim().split(' ').pop() || '';
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

  // ── Deep linking: abre a aba correta a partir do hash da URL ──────────────
  (function() {
    const VALID_TABS = ['classes','incompatibilidade','maquete','cas','regras','normas'];
    const hash = location.hash.slice(1);
    if (hash && VALID_TABS.includes(hash)) {
      const btn = Array.from(document.querySelectorAll('.tab'))
        .find(b => (b.getAttribute('onclick') || '').includes("'" + hash + "'"));
      showTab(hash, btn || null);
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
