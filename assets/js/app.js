
  // Guard: verifica se data.js foi carregado corretamente
  if (typeof CLASS_DRAWER_DATA === 'undefined' || typeof SHELF_DATA === 'undefined') {
    document.body.innerHTML = '<div style="padding:40px;text-align:center;font-family:sans-serif;color:#ff7070;">' +
      '<h2>⚠️ Erro ao carregar dados</h2>' +
      '<p style="margin-top:12px;color:#aaa;">Não foi possível carregar <code>data.js</code>. Verifique a conexão ou recarregue a página.</p>' +
      '</div>';
    throw new Error('data.js não carregado — execução interrompida.');
  }

  // ── Class risk drawer ──────────────────────────────────────────────────────

  function openClassDrawer(id, ev) {
    const d = CLASS_DRAWER_DATA[id];
    if (!d) return;
    document.getElementById('drawerEmoji').textContent    = d.emoji;
    document.getElementById('drawerTitle').textContent    = d.title;
    document.getElementById('drawerBadge').style.color    = d.color;
    document.getElementById('drawerBadge').textContent    = d.badge;
    document.getElementById('drawerAccentBar').style.background = d.color;
    document.getElementById('drawerBody').innerHTML       = d.body;
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('expanded'));
    if (ev && ev.currentTarget) ev.currentTarget.classList.add('expanded');
    document.getElementById('classDrawerOverlay').classList.add('open');
    document.getElementById('classDrawer').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeClassDrawer() {
    document.getElementById('classDrawerOverlay').classList.remove('open');
    document.getElementById('classDrawer').classList.remove('open');
    document.querySelectorAll('.class-card').forEach(c => c.classList.remove('expanded'));
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeClassDrawer(); });

  // ── Reagent chip CAS tooltip ───────────────────────────────────────────────

  function addChipTooltip(chip, reagentName) {
    const cas = getCasForReagent(reagentName);
    if (!cas) return;
    chip.style.position = 'relative';
    chip.title = '';
    const tip = document.createElement('div');
    tip.style.cssText = 'display:none;position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#0d0f14;border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:0.65rem;font-family:"Space Mono",monospace;color:var(--accent);white-space:nowrap;z-index:50;box-shadow:0 4px 14px rgba(0,0,0,0.4);pointer-events:none;';
    tip.textContent = 'CAS: ' + cas;
    const arrow = document.createElement('div');
    arrow.style.cssText = 'position:absolute;top:100%;left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:#0d0f14;';
    tip.appendChild(arrow);
    chip.appendChild(tip);
    chip.addEventListener('mouseenter', () => { tip.style.display = 'block'; });
    chip.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  }

  // ── Incompatibility checker ────────────────────────────────────────────────

  function detectClass(val) {
    const n = normalizeStr(val);
    for (const entry of REAGENT_CLASS_MAP) {
      if (entry.keys.some(k => n.includes(normalizeStr(k)))) return entry.cls;
    }
    return null;
  }

  function incompAutoComplete(input, listId) {
    const list = document.getElementById(listId);
    const val  = input.value.trim();
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
    const c1 = detectClass(v1), c2 = detectClass(v2);
    if (!c1 || !c2) {
      const unknown = !c1 ? v1 : v2;
      result.style.display = 'block';
      result.innerHTML = `<div class="ir-unknown">⚠️ Não foi possível classificar <strong>"${unknown}"</strong>. Verifique a ortografia ou consulte a FDS do reagente.</div>`;
      return;
    }
    const key    = c1 + '-' + c2;
    const status = INCOMPAT_MAP[key] || (c1 === c2 ? 'warn' : 'ok');
    const mInfo  = MATRIX_INFO[key] || MATRIX_INFO[c2+'-'+c1];
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

  // ── Tab navigation ─────────────────────────────────────────────────────────

  function showTab(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const target = document.getElementById(id);
    target.style.animation = 'none';
    target.offsetHeight;
    target.style.animation = '';
    target.classList.add('active');
    if (btn) {
      btn.classList.add('active');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    document.getElementById('searchResultWrapper').style.display = 'none';
    history.replaceState(null, '', '#' + id);
  }

  // ── Matrix incompatibility tooltips ────────────────────────────────────────

  (function initMatrixTooltips() {
    const tt = document.getElementById('matrixTooltip');
    document.querySelectorAll('table.matrix td.no, table.matrix td.warn, table.matrix td.ok').forEach(cell => {
      const tr = cell.parentElement;
      const colIdx = Array.from(cell.parentElement.cells).indexOf(cell);
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

  // ── Header search click-outside & focus restore ────────────────────────────

  document.addEventListener('click', e => {
    const wrapper = document.getElementById('searchResultWrapper');
    if (!wrapper) return;
    if (!wrapper.closest('.header-search').contains(e.target)) wrapper.style.display = 'none';
  });
  document.getElementById('reagentSearchInput')?.addEventListener('focus', () => {
    const w = document.getElementById('searchResultWrapper');
    if (w && w.innerHTML.trim()) w.style.display = 'flex';
  });

  // ── Deep linking: restore tab + reagent from URL hash ─────────────────────

  (function() {
    const VALID_TABS = ['classes','incompatibilidade','almoxarifado','cas','regras','normas','emergencias','descarte'];
    const full  = location.hash.slice(1);
    const [tabId, qs] = full.split('?');

    if (tabId && VALID_TABS.includes(tabId)) {
      const btn = Array.from(document.querySelectorAll('.tab'))
        .find(b => (b.getAttribute('onclick') || '').includes("'" + tabId + "'"));
      showTab(tabId, btn || null);
    }

    if (qs) {
      const params = new URLSearchParams(qs);
      const q = params.get('q'), s = params.get('s');
      if (q && s && (s === 'emerg' || s === 'descarte')) {
        setTimeout(() => {
          const input = document.getElementById(s + 'SearchInput');
          if (!input) return;
          input.value = q;
          input.dispatchEvent(new Event('input', { bubbles: true }));
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

  // ── Tab bar overflow gradient ──────────────────────────────────────────────

  (function() {
    const wrap = document.getElementById('tabsWrap');
    const bar  = document.getElementById('tabsBar');
    if (!wrap || !bar) return;
    function checkOverflow() { wrap.classList.toggle('has-overflow', bar.scrollWidth > bar.clientWidth); }
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    bar.addEventListener('scroll', () => {
      const atEnd = bar.scrollLeft + bar.clientWidth >= bar.scrollWidth - 4;
      wrap.classList.toggle('has-overflow', !atEnd);
    });
  })();

  // ── Back to top button ─────────────────────────────────────────────────────

  (function() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => { btn.classList.toggle('visible', window.scrollY > 320); }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  })();

  // ── Accordion: close sibling scenarios on open ────────────────────────────

  document.querySelectorAll('.emerg-class-card').forEach(card => {
    card.addEventListener('toggle', e => {
      if (!e.target.open || !e.target.classList.contains('emerg-scenario')) return;
      card.querySelectorAll('details.emerg-scenario').forEach(d => { if (d !== e.target) d.removeAttribute('open'); });
    }, true);
  });

  const emergSection = document.getElementById('emergencias');
  if (emergSection) {
    emergSection.addEventListener('toggle', e => {
      if (!e.target.open || !e.target.classList.contains('emerg-class-card')) return;
      emergSection.querySelectorAll('details.emerg-class-card').forEach(d => { if (d !== e.target) d.removeAttribute('open'); });
    }, true);
  }

  // ── Select-all on input focus ─────────────────────────────────────────────

  ['reagentSearchInput','emergSearchInput','descarteSearchInput','casSearchInput','maqueteSearchInput']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => { if (el.value) el.select(); });
    });

  // ── Fichas de Risco Rápido ────────────────────────────────────────────────

  function renderFichasRisco() {
    const container = document.getElementById('fichasRiscoContainer');
    if (!container || typeof FICHAS_RISCO === 'undefined') return;
    FICHAS_RISCO.forEach(f => {
      const el = document.createElement('details');
      el.className = 'fiche-card';
      const carcBadge = f.carc ? '<span class="fiche-carc-badge">IARC</span>' : '';
      const ghsTags = (f.ghs || []).map(g => `<span class="fiche-ghs-tag">${g}</span>`).join('');
      const hItems = (f.hphrases || []).map(h => `<li>${h}</li>`).join('');
      const epiItems = (f.epi || []).map(e => `<span class="fiche-epi">${e}</span>`).join('');
      const incompItems = (f.incomp_sala || []).map(i => `<li class="fiche-incomp-item">${i}</li>`).join('');
      const emergItems = (f.emergencia || []).map(e => `<li>${e}</li>`).join('');
      el.innerHTML = `
        <summary class="fiche-summary">
          <span class="fiche-code">${f.code}</span>
          <span class="fiche-name">${f.name}${carcBadge}</span>
          <span class="fiche-formula">${f.formula || ''}</span>
          <span class="fiche-loc">📍 ${f.wall_loc}</span>
          <div class="fiche-ghs-row">${ghsTags}</div>
        </summary>
        <div class="fiche-body">
          <div class="fiche-cols">
            <div class="fiche-section">
              <div class="fiche-section-title">⚠️ Frases H</div>
              <ul>${hItems}</ul>
            </div>
            <div class="fiche-section">
              <div class="fiche-section-title">🧤 EPI mínimo</div>
              <div class="fiche-epi-row">${epiItems}</div>
            </div>
          </div>
          <div class="fiche-section">
            <div class="fiche-section-title">🚫 Incompatíveis na mesma sala</div>
            <ul>${incompItems}</ul>
          </div>
          <div class="fiche-section">
            <div class="fiche-section-title">🆘 Emergência</div>
            <ul>${emergItems}</ul>
          </div>
          <div class="fiche-section fiche-descarte">
            <div class="fiche-section-title">🗑️ Descarte</div>
            <p>${f.descarte}</p>
          </div>
        </div>`;
      container.appendChild(el);
    });
  }

  // ── DOMContentLoaded — chips + theme toggle + ARIA ────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    renderFichasRisco();
    document.querySelectorAll('#emergencias .emerg-reagent-chip').forEach(chip => {
      chip.classList.add('is-searchable');
      chip.style.cursor = 'pointer';
      chip.addEventListener('click', () => searchChip(chip.textContent.trim(), 'emerg'));
    });
    document.querySelectorAll('#descarte .emerg-reagent-chip, #descarte .descarte-chip').forEach(chip => {
      chip.classList.add('is-searchable');
      chip.style.cursor = 'pointer';
      chip.addEventListener('click', () => searchChip(chip.textContent.trim(), 'descarte'));
    });

    document.querySelectorAll('.emerg-class-card > summary').forEach(s => {
      const title = s.querySelector('.emerg-class-header-title');
      if (title) s.setAttribute('aria-label', title.textContent.trim());
    });
    document.querySelectorAll('.emerg-scenario > summary').forEach(s => {
      const clean = s.textContent.replace(/\p{Emoji_Presentation}/gu, '').trim();
      if (clean) s.setAttribute('aria-label', clean);
    });
    document.querySelectorAll('.descarte-card > summary').forEach(s => {
      const clean = s.textContent.replace(/\p{Emoji_Presentation}/gu, '').trim();
      if (clean) s.setAttribute('aria-label', clean);
    });

    // Theme toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      const syncBtn = () => {
        const t = document.documentElement.getAttribute('data-theme');
        themeBtn.textContent = t === 'light' ? '🌙' : '☀️';
        themeBtn.setAttribute('aria-label', t === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro');
      };
      syncBtn();
      themeBtn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('nadf-theme', next);
        syncBtn();
      });
    }

    // Pre-fill sheets URL input from localStorage
    const sheetsInput = document.getElementById('sheetsUrlInput');
    if (sheetsInput) {
      const saved = localStorage.getItem('nadf-sheets-url');
      if (saved) sheetsInput.value = saved;
    }
  });
