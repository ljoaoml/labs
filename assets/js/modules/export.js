
  // ── Inventory Export — PDF (jsPDF) + Excel (SheetJS) ─────────────────────────
  // Libraries are lazy-loaded on first click to avoid slowing down page load.

  const _CDN_JSPDF     = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  const _CDN_AUTOTABLE = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js';
  const _CDN_XLSX      = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

  function _loadScript(url) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = url; s.onload = resolve;
      s.onerror = () => reject(new Error('Falha ao carregar biblioteca: ' + url));
      document.head.appendChild(s);
    });
  }

  // ── Wall metadata ─────────────────────────────────────────────────────────────

  const _WALLS_EXP = {
    L: { name: 'PAREDE ESQ — Inflamáveis',    short: 'Esq-Inflamáveis',    rgb: [255,136,80]  },
    B: { name: 'PAREDE FUNDO — Ácidos',       short: 'Fundo-Ácidos',       rgb: [212,176,42]  },
    R: { name: 'PAREDE DIR — Sais / Bases',   short: 'Dir-Sais',           rgb: [112,184,255] },
    F: { name: 'PAREDE FRENTE — Tóxicos/Ox.', short: 'Frente-Tóxicos',    rgb: [208,128,255] },
  };

  function _sortByCode(rows) {
    return [...rows].sort((a, b) => {
      const parse = c => {
        if (!c) return { p: '\xFF', n: 9999 };
        const m = c.match(/^([A-Za-z]+)(\d+)$/);
        return m ? { p: m[1].toUpperCase(), n: parseInt(m[2]) } : { p: c.toUpperCase(), n: 0 };
      };
      const pa = parse(a.code), pb = parse(b.code);
      if (pa.p !== pb.p) return pa.p < pb.p ? -1 : 1;
      return pa.n - pb.n;
    });
  }

  function _cleanStr(str) {
    if (!str) return '';
    return str.replace(/\p{Emoji_Presentation}/gu, '').replace(/\s+/g, ' ').trim();
  }

  // ── Shared data builder ───────────────────────────────────────────────────────

  function _ctrlLabel(ctrl) {
    if (!ctrl) return '';
    if (ctrl === COFRE || (ctrl && ctrl.label && ctrl.label.includes('COFRE'))) return 'COFRE';
    if (ctrl === EB) return 'EB';
    if (typeof ctrl === 'object' && ctrl.label) return 'PF';
    return '';
  }

  function _shelfCtrlLabel(ctrlArr) {
    if (!ctrlArr || !ctrlArr.length) return '';
    if (ctrlArr.some(c => c === COFRE)) return 'COFRE';
    if (ctrlArr.some(c => c === EB)) return 'EB';
    if (ctrlArr.some(c => c && typeof c === 'object' && c.label)) return 'PF';
    return '';
  }

  function _getCas(name) {
    if (typeof getCasForReagent === 'function') return getCasForReagent(name) || '';
    if (typeof CAS_DB === 'undefined') return '';
    const n = typeof normalizeStr === 'function' ? normalizeStr(name) : name.toLowerCase().trim();
    const entry = CAS_DB.find(e => {
      const en = typeof normalizeStr === 'function' ? normalizeStr(e.name) : e.name.toLowerCase().trim();
      return en === n || (e.aliases && e.aliases.some(a => {
        const an = typeof normalizeStr === 'function' ? normalizeStr(a) : a.toLowerCase().trim();
        return an === n;
      }));
    });
    return entry ? entry.cas : '';
  }

  // Returns flat rows used by both exporters
  function _buildRows() {
    const rows = [];
    for (const wall of ['L','B','R','F']) {
      const wi = _WALLS_EXP[wall];
      for (let n = 1; n <= 6; n++) {
        const key  = wall + n;
        const d    = SHELF_DATA[key];
        if (!d || !d.reagents) continue;
        const access     = n <= 3 ? 'Fácil' : 'Escada';
        const shelfCtrl  = _shelfCtrlLabel(d.ctrl);
        d.reagents.forEach(r => {
          if (!r) return;
          const name     = typeof r === 'string' ? r : r.name;
          const code     = (typeof r === 'object' && r.code) ? r.code : '';
          const carc     = (typeof r === 'object' && !!r.carc);
          const reagCtrl = typeof r === 'object' ? _ctrlLabel(r.ctrl) : '';
          const ctrl     = reagCtrl || shelfCtrl;
          const cas      = _getCas(name);
          rows.push({ wall, wallName: wi.name, wallRgb: wi.rgb, shelf: key, level: n,
            access, shelfTitle: d.title, shelfShort: d.short || '', shelfDesc: d.desc || '',
            code, name, ctrl, carc, cas });
        });
      }
    }
    return rows;
  }

  // ── PDF export ────────────────────────────────────────────────────────────────

  async function exportInventoryPDF() {
    const btn = document.getElementById('exportPdfBtn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ PDF…'; }
    try {
      await _loadScript(_CDN_JSPDF);
      await _loadScript(_CDN_AUTOTABLE);
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const now = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });
      const allRows = _buildRows();

      // ── Capa ──────────────────────────────────────────────────────────────────
      doc.setFillColor(13,15,20);
      doc.rect(0,0,210,297,'F');

      // Barra colorida topo
      doc.setFillColor(0,200,150);
      doc.rect(0,0,210,3,'F');

      doc.setFont('helvetica','bold'); doc.setFontSize(24);
      doc.setTextColor(0,200,150);
      doc.text('NADF · UNIFENAS', 105, 72, { align:'center' });

      doc.setFont('helvetica','normal'); doc.setFontSize(14);
      doc.setTextColor(232,236,244);
      doc.text('Inventário de Reagentes Químicos', 105, 84, { align:'center' });

      doc.setDrawColor(42,48,64);
      doc.line(30,91,180,91);

      doc.setFontSize(9); doc.setTextColor(122,132,153);
      doc.text('Almoxarifado — UNIFENAS Alfenas', 105, 98,  { align:'center' });
      doc.text(now, 105, 105, { align:'center' });

      // Estatísticas
      doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.setTextColor(232,236,244);
      doc.text(`${allRows.length} reagentes catalogados`, 105, 122, { align:'center' });

      // Legenda paredes
      let ly = 142;
      doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(122,132,153);
      doc.text('ORGANIZAÇÃO POR PAREDE:', 30, ly); ly += 7;
      for (const [w, wi] of Object.entries(_WALLS_EXP)) {
        doc.setFillColor(...wi.rgb);
        doc.roundedRect(30, ly-3.5, 5, 4.5, 1, 1, 'F');
        doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(232,236,244);
        const cnt = allRows.filter(r => r.wall === w).length;
        doc.text(`${wi.name}  (${cnt} reagentes)`, 38, ly);
        ly += 8;
      }

      // Legenda acesso
      ly += 4;
      doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(122,132,153);
      doc.text('PRATELEIRAS:', 30, ly); ly += 7;
      doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(232,236,244);
      doc.text('P1 – P3: Acesso fácil (sem escada)', 30, ly); ly += 6;
      doc.text('P4 – P6: Requer escada', 30, ly); ly += 10;

      // Nota
      doc.setFont('helvetica','italic'); doc.setFontSize(7); doc.setTextColor(80,90,110);
      doc.text('Documento gerado automaticamente pelo sistema NADF. Os reagentes listados são exemplos representativos', 105, 275, { align:'center' });
      doc.text('para fins acadêmicos e não correspondem necessariamente ao estoque real do almoxarifado.', 105, 280, { align:'center' });

      // ── Uma página por parede, prateleiras como seções ────────────────────────
      for (const wall of ['L','B','R','F']) {
        const wi = _WALLS_EXP[wall];
        const dark = wi.rgb.map(c => Math.max(0, Math.round(c * 0.18)));
        const mid  = wi.rgb.map(c => Math.max(0, Math.round(c * 0.35)));

        doc.addPage();

        // Header da parede
        doc.setFillColor(...dark);
        doc.rect(0, 0, 210, 20, 'F');
        doc.setFillColor(...wi.rgb);
        doc.rect(0, 0, 5, 20, 'F');

        doc.setFont('helvetica','bold'); doc.setFontSize(13); doc.setTextColor(...wi.rgb);
        doc.text(wi.name, 12, 9);
        doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(180,190,210);
        const wallTotal = allRows.filter(r => r.wall === wall).length;
        doc.text(`${wallTotal} reagentes`, 12, 15);
        doc.text(now, 198, 9, { align:'right' });

        let yPos = 26;

        for (let n = 1; n <= 6; n++) {
          const key = wall + n;
          const d   = SHELF_DATA[key];
          if (!d || !d.reagents) continue;
          const shelfRows = _sortByCode(allRows.filter(r => r.shelf === key));
          if (!shelfRows.length) continue;

          // Verifica se cabe na página; se não, nova página com header menor
          if (yPos > 240) {
            doc.addPage();
            doc.setFillColor(...dark);
            doc.rect(0,0,210,12,'F');
            doc.setFillColor(...wi.rgb); doc.rect(0,0,4,12,'F');
            doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.setTextColor(...wi.rgb);
            doc.text(wi.name + ' (cont.)', 10, 8);
            yPos = 18;
          }

          // Sub-header da prateleira
          doc.setFillColor(...mid);
          doc.rect(10, yPos-4, 190, 7, 'F');
          doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(...wi.rgb);
          doc.text(`P${n}`, 13, yPos);
          doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(220,224,236);
          doc.text(_cleanStr(d.title), 24, yPos);
          // Acesso e ctrl
          const access = n <= 3 ? 'Fácil' : 'Escada';
          const ctrl   = _shelfCtrlLabel(d.ctrl);
          const metaRight = [ctrl, access].filter(Boolean).join(' · ');
          doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor(...wi.rgb);
          doc.text(metaRight, 198, yPos, { align:'right' });
          yPos += 3;

          // Tabela de reagentes
          const tableBody = shelfRows.map(r => [
            r.code || '—',
            r.name,
            r.ctrl || '—',
            r.carc ? 'CARC' : '',
            r.cas  || '—',
          ]);

          doc.autoTable({
            startY: yPos,
            head: [['Código','Reagente','Controle','Carc.','CAS']],
            body: tableBody,
            styles: {
              fontSize: 7.5, cellPadding: 1.8,
              font: 'helvetica', textColor: [210,215,230],
              fillColor: [16,20,28], lineColor: [38,46,60], lineWidth: 0.18,
            },
            headStyles: {
              fillColor: mid, textColor: wi.rgb,
              fontStyle:'bold', fontSize: 8,
            },
            alternateRowStyles: { fillColor: [13,16,22] },
            columnStyles: {
              0: { cellWidth: 16, fontStyle:'bold', textColor: wi.rgb },
              1: { cellWidth: 90 },
              2: { cellWidth: 28 },
              3: { cellWidth: 16, halign:'center' },
              4: { cellWidth: 38, font:'courier' },
            },
            margin: { left: 10, right: 10 },
            theme: 'grid',
            didParseCell(data) {
              if (data.column.index === 3 && data.cell.raw === 'CARC') {
                data.cell.styles.textColor = [212,184,0];
                data.cell.styles.fontStyle = 'bold';
              }
              if (data.column.index === 2 && data.cell.raw === 'COFRE') {
                data.cell.styles.textColor = [255,87,87];
                data.cell.styles.fontStyle = 'bold';
              }
            },
          });

          yPos = doc.lastAutoTable.finalY + 6;
        }
      }

      doc.save(`NADF_Inventario_${new Date().toISOString().slice(0,10)}.pdf`);

    } catch (e) {
      alert('Erro ao gerar PDF: ' + e.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '⬇ PDF'; }
    }
  }

  // ── Excel export ──────────────────────────────────────────────────────────────

  async function exportInventoryExcel() {
    const btn = document.getElementById('exportXlsBtn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Excel…'; }
    try {
      await _loadScript(_CDN_XLSX);
      const XLSX     = window.XLSX;
      const wb       = XLSX.utils.book_new();
      const allRows  = _sortByCode(_buildRows());
      const codedCnt = allRows.filter(r => r.code).length;

      // ── Aba Resumo ──────────────────────────────────────────────────────────
      const resumoData = [
        ['NADF · UNIFENAS — Inventário de Reagentes Químicos'],
        [`Exportado em: ${new Date().toLocaleDateString('pt-BR')}`],
        [`Total de entradas: ${allRows.length}   |   Com código: ${codedCnt}`],
        [],
        ['Parede','Reagentes'],
        ...Object.entries(_WALLS_EXP).map(([w, wi]) => [wi.name, allRows.filter(r => r.wall === w).length]),
        [],
        ['Nota: reagentes exemplificativos para fins acadêmicos.'],
      ];
      const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
      wsResumo['!cols'] = [{ wch: 55 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

      // ── Aba por parede (ordem por código) ───────────────────────────────────
      for (const wall of ['L','B','R','F']) {
        const wi       = _WALLS_EXP[wall];
        const wallRows = allRows.filter(r => r.wall === wall);
        const wsData   = [[
          'Código', 'Reagente', 'Prateleira', 'Título da Prateleira',
          'Acesso', 'Controle', 'Carcinogênico', 'CAS',
        ]];
        wallRows.forEach(r => {
          wsData.push([
            r.code || '',
            r.name,
            `P${r.level}`,
            _cleanStr(r.shelfTitle),
            r.access,
            r.ctrl,
            r.carc ? 'Sim' : '',
            r.cas,
          ]);
        });
        wsData.push([]);
        wsData.push([`Total: ${wallRows.length} entradas`]);
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!cols'] = [
          { wch: 8 }, { wch: 44 }, { wch: 5 }, { wch: 38 },
          { wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 14 },
        ];
        XLSX.utils.book_append_sheet(wb, ws, wi.short);
      }

      // ── Aba Todos (ordem global por código) ─────────────────────────────────
      const allData = [[
        'Código', 'Reagente', 'Parede', 'Prateleira', 'Título da Prateleira',
        'Acesso', 'Controle', 'Carcinogênico', 'CAS',
      ]];
      allRows.forEach(r => {
        allData.push([
          r.code || '', r.name, r.wallName, `P${r.level}`,
          _cleanStr(r.shelfTitle), r.access, r.ctrl, r.carc ? 'Sim' : '', r.cas,
        ]);
      });
      allData.push([]);
      allData.push([`Total: ${allRows.length} entradas cadastradas   |   Com código: ${codedCnt}`]);
      const wsAll = XLSX.utils.aoa_to_sheet(allData);
      wsAll['!cols'] = [
        { wch: 8 }, { wch: 44 }, { wch: 32 }, { wch: 5 }, { wch: 38 },
        { wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 14 },
      ];
      XLSX.utils.book_append_sheet(wb, wsAll, 'Todos');

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob  = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement('a');
      a.href = url;
      a.download = `NADF_Inventario_${new Date().toISOString().slice(0,10)}.xlsx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (e) {
      alert('Erro ao gerar Excel: ' + e.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '⬇ Excel'; }
    }
  }
