
  // ── Google Sheets Inventory Sync ─────────────────────────────────────────
  // Carrega inventário de uma planilha Google publicada como CSV.
  // Formato esperado (cabeçalho obrigatório):
  //   Codigo,Nome,Prateleira,Controle,Observacao,Carcinogenico
  // Exemplo de URL:
  //   https://docs.google.com/spreadsheets/d/SEU_ID/export?format=csv&gid=0

  var _sheetsData   = null;   // { CODE: { name, shelf, control, notes, carc } }
  var _sheetsStatus = null;   // { ok, ts, count, error }

  function _loadSheetsFromStorage() {
    try {
      const url = localStorage.getItem('nadf-sheets-url');
      const raw = localStorage.getItem('nadf-sheets-cache');
      if (url && raw) {
        _sheetsData   = JSON.parse(raw);
        _sheetsStatus = { ok: true, ts: localStorage.getItem('nadf-sheets-ts'), count: Object.keys(_sheetsData).length };
      }
    } catch (_) {}
    _updateSheetsBadge();
  }

  async function syncFromSheets(urlOverride) {
    const url = urlOverride || localStorage.getItem('nadf-sheets-url') || '';
    if (!url.trim()) { _showSheetsError('URL não configurada.'); return; }

    const badge  = document.getElementById('sheetsSyncBadge');
    const btnEl  = document.getElementById('sheetsSyncBtn');
    if (badge) badge.innerHTML = '<span class="sheets-spin">⏳</span> Sincronizando…';
    if (btnEl) btnEl.disabled = true;

    try {
      const res = await fetch(url.trim(), { signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      const data = _parseSheetsCsv(text);
      const count = Object.keys(data).length;
      if (!count) throw new Error('Planilha vazia ou formato incorreto');

      _sheetsData = data;
      _sheetsStatus = { ok: true, ts: new Date().toLocaleString('pt-BR'), count };
      localStorage.setItem('nadf-sheets-url',   url.trim());
      localStorage.setItem('nadf-sheets-cache', JSON.stringify(data));
      localStorage.setItem('nadf-sheets-ts',    _sheetsStatus.ts);

      _updateSheetsBadge();
      _applySheetsOverlay();

    } catch (e) {
      _showSheetsError(e.message || 'Erro ao buscar planilha');
    } finally {
      if (btnEl) btnEl.disabled = false;
    }
  }

  function _parseSheetsCsv(text) {
    const lines  = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return {};
    const header = lines[0].split(',').map(h => h.trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, ''));

    const idxCode    = _csvIdx(header, ['codigo', 'code', 'cod']);
    const idxName    = _csvIdx(header, ['nome', 'name', 'reagente']);
    const idxShelf   = _csvIdx(header, ['prateleira', 'shelf', 'local']);
    const idxControl = _csvIdx(header, ['controle', 'control', 'ctrl']);
    const idxNotes   = _csvIdx(header, ['observacao', 'notas', 'notes', 'obs']);
    const idxCarc    = _csvIdx(header, ['carcinogenico', 'carc', 'carcinogen']);

    if (idxCode < 0) return {};

    const data = {};
    for (let i = 1; i < lines.length; i++) {
      const cols = _splitCsvLine(lines[i]);
      const code = (cols[idxCode] || '').trim().toUpperCase();
      if (!code) continue;
      data[code] = {
        name:    idxName    >= 0 ? (cols[idxName]    || '').trim() : '',
        shelf:   idxShelf   >= 0 ? (cols[idxShelf]   || '').trim() : '',
        control: idxControl >= 0 ? (cols[idxControl] || '').trim() : '',
        notes:   idxNotes   >= 0 ? (cols[idxNotes]   || '').trim() : '',
        carc:    idxCarc    >= 0 ? /true|sim|1|s/i.test(cols[idxCarc] || '') : false,
      };
    }
    return data;
  }

  function _csvIdx(header, candidates) {
    for (const c of candidates) {
      const i = header.indexOf(c);
      if (i >= 0) return i;
    }
    return -1;
  }

  function _splitCsvLine(line) {
    const result = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === ',' && !inQ) { result.push(cur); cur = ''; }
      else cur += ch;
    }
    result.push(cur);
    return result;
  }

  function _showSheetsError(msg) {
    _sheetsStatus = { ok: false, error: msg };
    const badge = document.getElementById('sheetsSyncBadge');
    if (badge) badge.innerHTML = `<span class="sheets-badge-err">⚠️ ${msg}</span>`;
  }

  function _updateSheetsBadge() {
    const badge = document.getElementById('sheetsSyncBadge');
    if (!badge) return;
    if (!_sheetsStatus) {
      badge.innerHTML = '<span class="sheets-badge-none">📊 Não sincronizado</span>';
      return;
    }
    if (_sheetsStatus.ok) {
      badge.innerHTML = `<span class="sheets-badge-ok">✅ ${_sheetsStatus.count} itens · ${_sheetsStatus.ts}</span>`;
    } else {
      badge.innerHTML = `<span class="sheets-badge-err">⚠️ ${_sheetsStatus.error}</span>`;
    }
  }

  function _applySheetsOverlay() {
    if (!_sheetsData) return;
    // Merge carc flags from sheet into SHELF_DATA for live display
    for (const code in _sheetsData) {
      const sItem = _sheetsData[code];
      if (!sItem.carc) continue;
      // Find reagent in SHELF_DATA and set carc flag
      for (const key in SHELF_DATA) {
        const shelf = SHELF_DATA[key];
        if (!shelf.reagents) continue;
        shelf.reagents.forEach(r => {
          if (r && typeof r === 'object' && r.code === code) r.carc = true;
        });
      }
    }
  }

  function toggleSheetsPanel() {
    const panel = document.getElementById('sheetsPanelBody');
    const arrow = document.getElementById('sheetsPanelArrow');
    if (!panel) return;
    const open = panel.style.display !== 'none';
    panel.style.display = open ? 'none' : 'block';
    if (arrow) arrow.textContent = open ? '▶' : '▼';
  }

  function saveSheetsUrl() {
    const input = document.getElementById('sheetsUrlInput');
    const url   = input ? input.value.trim() : '';
    if (!url) return;
    localStorage.setItem('nadf-sheets-url', url);
    syncFromSheets(url);
  }

  function clearSheetsSync() {
    localStorage.removeItem('nadf-sheets-url');
    localStorage.removeItem('nadf-sheets-cache');
    localStorage.removeItem('nadf-sheets-ts');
    _sheetsData   = null;
    _sheetsStatus = null;
    _updateSheetsBadge();
    const input = document.getElementById('sheetsUrlInput');
    if (input) input.value = '';
  }

  // Initialise on load
  _loadSheetsFromStorage();
  if (_sheetsData) _applySheetsOverlay();
