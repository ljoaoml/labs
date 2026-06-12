
  // ── Shared string helpers (loaded before all other modules) ──────────────

  function normalizeStr(s) {
    if (!s) return '';
    const subs = { '₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9' };
    return String(s)
      .replace(/[₀-₉]/g, c => subs[c] || c)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[´`^~¨]/g, '')
      .toLowerCase()
      .trim();
  }

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

  function normalizeCas(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, d => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(d)])
      .replace(/\s+/g, ' ').trim();
  }

  // Returns the CSS class suffix for a code chip based on its wall
  function codeChipClass(code) {
    if (!code || typeof CODES_DB === 'undefined') return 'default';
    const entry = CODES_DB[code.toUpperCase()];
    if (!entry || !entry.shelf) return 'default';
    return entry.shelf[0]; // L, B, R, or F
  }
