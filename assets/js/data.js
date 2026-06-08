 // ===== DRAWER DE CLASSES DE RISCO =====
  const CLASS_DRAWER_DATA = {
    inflamavel: {
      emoji:'🔥', title:'Inflamáveis e Combustíveis', badge:'CLASSE 3 — GHS/ONU · GHS02',
      color:'var(--inflamavel)', bg:'rgba(255,107,43,0.08)',
      body:`<p style="font-size:0.84rem;color:var(--muted);line-height:1.8;margin-bottom:16px;">Substâncias com ponto de fulgor ≤ 60 °C — liberam vapores inflamáveis mesmo em temperatura ambiente. O perigo real não é o líquido, mas o vapor: uma faísca pode iniciar incêndio a distância.</p>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px;">
        <div style="font-size:0.6rem;font-family:'Space Mono',monospace;color:var(--muted);letter-spacing:0.1em;margin-bottom:8px;">SUBCLASSES ONU</div>
        <div style="font-size:0.78rem;line-height:2;color:var(--text);">
          🌡️ <strong>Classe 3a</strong> — ponto de fulgor &lt; −18 °C (éter etílico, pentano)<br>
          🌡️ <strong>Classe 3b</strong> — −18 °C a +23 °C (acetona, metanol, etanol abs.)<br>
          🌡️ <strong>Classe 3c</strong> — +23 °C a +60 °C (etanol 70%, ácido acético glacial)
        </div>
      </div>
      <div style="font-size:0.78rem;line-height:1.9;color:var(--muted);">
        ⚡ Armário antichama com ventilação obrigatório<br>
        ⚡ Nunca próximo a oxidantes, fontes de calor ou ignição<br>
        ⚡ Frascos fechados quando não em uso<br>
        ⚡ Nunca em geladeira doméstica — risco de explosão<br>
        ⚡ Controlados PF Lista II: Benzeno, Tolueno, Clorofórmio
      </div>`
    },
    corrosivo: {
      emoji:'⚗️', title:'Corrosivos', badge:'CLASSE 8 — GHS/ONU · GHS05',
      color:'var(--corrosivo)', bg:'rgba(232,184,0,0.08)',
      body:`<p style="font-size:0.84rem;color:var(--muted);line-height:1.8;margin-bottom:16px;">Causam destruição irreversível de tecidos vivos (pele, mucosas, olhos) por ação química direta. O dano ocorre em segundos com ácidos concentrados.</p>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px;">
        <div style="font-size:0.6rem;font-family:'Space Mono',monospace;color:var(--muted);letter-spacing:0.1em;margin-bottom:8px;">CRITÉRIO GHS</div>
        <div style="font-size:0.78rem;line-height:1.9;color:var(--text);">
          Causa necrose visível na pele em até <strong>4 horas</strong> de exposição<br>
          — ou —<br>
          Taxa de corrosão em aço ≥ <strong>6,25 mm/ano</strong>
        </div>
      </div>
      <div style="font-size:0.78rem;line-height:1.9;color:var(--muted);">
        🪣 Bandejas de contenção ≥ 10% do volume armazenado<br>
        🪣 Ácidos concentrados e bases fortes em prateleiras separadas<br>
        🪣 H₂SO₄, HCl e HNO₃ nunca no alto — risco de queda e respingo<br>
        🪣 EPI: avental, óculos e luvas de nitrila<br>
        🪣 HNO₃: controlado pelo Exército Brasileiro (SisFPC)
      </div>`
    },
    oxidante: {
      emoji:'💥', title:'Oxidantes', badge:'CLASSE 5.1 — GHS/ONU · GHS03',
      color:'var(--oxidante)', bg:'rgba(255,145,0,0.08)',
      body:`<p style="font-size:0.84rem;color:var(--muted);line-height:1.8;margin-bottom:16px;">Oxidantes não são necessariamente inflamáveis — o perigo é que fornecem oxigênio para outros materiais queimarem mais intensamente, mesmo na ausência de ar.</p>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px;">
        <div style="font-size:0.6rem;font-family:'Space Mono',monospace;color:var(--muted);letter-spacing:0.1em;margin-bottom:8px;">MECANISMO</div>
        <div style="font-size:0.78rem;line-height:1.9;color:var(--text);">
          Ao decompor-se (calor, atrito ou contato) liberam <strong>O₂ molecular</strong><br>
          Ex: KMnO₄ + glicerina → ignição espontânea<br>
          Inclui Classe 5.2 — peróxidos orgânicos (H₂O₂ ≥ 30%)
        </div>
      </div>
      <div style="font-size:0.78rem;line-height:1.9;color:var(--muted);">
        🔴 Nunca armazenar com inflamáveis ou orgânicos<br>
        🔴 KMnO₄, K₂Cr₂O₇ e H₂O₂ em prateleira exclusiva<br>
        🔴 Frascos íntegros e herméticos — atrito inicia decomposição<br>
        🔴 K₂Cr₂O₇: controlado PF Lista IV
      </div>`
    },
    toxico: {
      emoji:'☠️', title:'Tóxicos e Venenosos', badge:'CLASSE 6.1 — GHS/ONU · GHS06',
      color:'var(--toxico)', bg:'rgba(192,96,255,0.08)',
      body:`<p style="font-size:0.84rem;color:var(--muted);line-height:1.8;margin-bottom:16px;">Causam dano grave à saúde ou morte por dose relativamente pequena — por ingestão, inalação ou absorção cutânea. A DL₅₀ é o critério técnico de enquadramento.</p>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px;">
        <div style="font-size:0.6rem;font-family:'Space Mono',monospace;color:var(--muted);letter-spacing:0.1em;margin-bottom:8px;">CATEGORIAS GHS (DL₅₀ ORAL)</div>
        <div style="font-size:0.78rem;line-height:1.9;color:var(--text);">
          Cat. 1–2: ≤ 50 mg/kg — <span style="color:var(--danger);">cianetos, compostos de mercúrio</span><br>
          Cat. 3: ≤ 300 mg/kg — cloreto de bário, arsenito<br>
          Cat. 4: ≤ 2000 mg/kg — formol, o-toluidina
        </div>
      </div>
      <div style="font-size:0.78rem;line-height:1.9;color:var(--muted);">
        🔐 Cat. 1–2: COFRE com chave + registro individual a cada uso<br>
        🔐 Controlados PF Listas II, IV, VI — SIPROQUIM 2 obrigatório<br>
        🔐 EPI: luvas nitrila dupla, óculos, máscara filtro P100/OV<br>
        🔐 Cianetos: JAMAIS próximos de ácidos (liberação de HCN)
      </div>`
    },
    acido: {
      emoji:'🧫', title:'Ácidos (não corrosivos)', badge:'ÁCIDO / pH < 7',
      color:'var(--acido)', bg:'rgba(255,74,122,0.08)',
      body:`<p style="font-size:0.84rem;color:var(--muted);line-height:1.8;margin-bottom:16px;">Não atingem o limiar de corrosividade da Classe 8, mas ainda reagem com bases (neutralização exotérmica) e podem danificar mucosas em exposição prolongada.</p>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px;">
        <div style="font-size:0.6rem;font-family:'Space Mono',monospace;color:var(--muted);letter-spacing:0.1em;margin-bottom:8px;">EXEMPLOS NO LABORATÓRIO</div>
        <div style="font-size:0.78rem;line-height:1.9;color:var(--text);">
          H₃BO₃ — bacteriostático, pH ~5 · <strong>PF Lista IV</strong><br>
          Ácido cítrico — pH ~2 em solução concentrada<br>
          Ácido acético ≤ 10% — vinagre comercial<br>
          H₃PO₄ diluído — tampão, menos agressivo que puro
        </div>
      </div>
      <div style="font-size:0.78rem;line-height:1.9;color:var(--muted);">
        ⚗️ Bandejas separadas — mesma prateleira não é problema<br>
        ⚗️ Nunca misturar com bases (calor intenso)<br>
        ⚗️ Nunca misturar com metais (liberação de H₂)
      </div>`
    },
    base: {
      emoji:'🔵', title:'Bases / Álcalis', badge:'BASE / pH > 7',
      color:'var(--base)', bg:'rgba(74,158,255,0.08)',
      body:`<p style="font-size:0.84rem;color:var(--muted);line-height:1.8;margin-bottom:16px;">Bases fracas têm pH moderado e risco menor. Bases fortes (NaOH, KOH) são também Classe 8 — pH pode ultrapassar 13, causando saponificação e queimaduras graves.</p>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px;">
        <div style="font-size:0.6rem;font-family:'Space Mono',monospace;color:var(--muted);letter-spacing:0.1em;margin-bottom:8px;">POR QUE SEPARAR DOS ÁCIDOS?</div>
        <div style="font-size:0.78rem;line-height:1.9;color:var(--text);">
          Ácido + base → neutralização com <strong>liberação intensa de calor</strong><br>
          Em recipientes fechados: pressurização e ruptura<br>
          No estoque: separação evita contato em caso de vazamento
        </div>
      </div>
      <div style="font-size:0.78rem;line-height:1.9;color:var(--muted);">
        🔵 NaOH e KOH são higroscópicos — absorvem umidade do ar<br>
        🔵 NH₄OH libera amônia gasosa — usar em capela, frasco hermético<br>
        🔵 NH₄OH: controlado PF Lista V<br>
        🔵 Nunca misturar com sais de amônio (libera NH₃)
      </div>`
    },
    bio: {
      emoji:'🦠', title:'Biológicos / Radioativos', badge:'CLASSE 6.2 — GHS/ONU',
      color:'var(--bio)', bg:'rgba(0,200,150,0.08)',
      body:`<p style="font-size:0.84rem;color:var(--muted);line-height:1.8;margin-bottom:16px;">Contêm agentes biológicos (vírus, bactérias, fungos, parasitas) ou toxinas capazes de causar doença em humanos ou animais.</p>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px;">
        <div style="font-size:0.6rem;font-family:'Space Mono',monospace;color:var(--muted);letter-spacing:0.1em;margin-bottom:8px;">CATEGORIAS ONU</div>
        <div style="font-size:0.78rem;line-height:1.9;color:var(--text);">
          <span style="color:var(--danger);">Cat. A (UN 2814/2900)</span> — risco fatal ou incapacidade permanente<br>
          Cat. B (UN 3373) — baixo risco, amostras clínicas de rotina
        </div>
      </div>
      <div style="font-size:0.78rem;line-height:1.9;color:var(--muted);">
        🦠 No lab ambiental: coliformes e fungos → Categoria B<br>
        🦠 Descarte: saco branco leitoso + autoclavagem + registro<br>
        🦠 Conforme RDC ANVISA 222/2018
      </div>`
    },
    inerte: {
      emoji:'🧂', title:'Sólidos Inertes', badge:'BAIXO RISCO — Sem classificação GHS',
      color:'var(--inerte)', bg:'rgba(122,132,153,0.08)',
      body:`<p style="font-size:0.84rem;color:var(--muted);line-height:1.8;margin-bottom:16px;">"Inerte" não significa "sem cuidado". Não há risco de inflamabilidade ou toxicidade aguda, mas ainda há exigências de organização, identificação e descarte correto.</p>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:14px;">
        <div style="font-size:0.6rem;font-family:'Space Mono',monospace;color:var(--muted);letter-spacing:0.1em;margin-bottom:8px;">RISCOS INDIRETOS</div>
        <div style="font-size:0.78rem;line-height:1.9;color:var(--text);">
          Contaminação cruzada → análises invalidadas<br>
          Higroscopicidade (NaCl, Na₂SO₄) → aglomeram e entopem<br>
          CuSO₄ anidro → irritante ocular mesmo sem ser Classe 8
        </div>
      </div>
      <div style="font-size:0.78rem;line-height:1.9;color:var(--muted);">
        🧂 Prateleira R — frasco hermético, identificado com lote e data<br>
        🧂 Descarte requer neutralização e registro (NR-26)<br>
        🧂 Não jogar no lixo comum
      </div>`
    }
  };

  // ===== VERIFICADOR DE INCOMPATIBILIDADE =====
  // Mapa de classes por palavras-chave de reagentes
  const REAGENT_CLASS_MAP = [
    { keys:['acetona','etanol','metanol','alcool','éter','eter','hexano','tolueno','benzeno','cloroformio','clorofórmio','isopropanol','diclorometano','acetato de etila','éter de petróleo','solvente','ciclohexano','n-hexano'], cls:'Inflamável' },
    { keys:['acido sulfurico','ácido sulfúrico','h2so4','acido cloridrico','ácido clorídrico','hcl','acido nitrico','ácido nítrico','hno3','acido fosforico','ácido fosfórico','acido acetico','ácido acético','acido formico','ácido fórmico','naoh','hidroxido de sodio','hidróxido de sódio','koh','hidroxido de potassio','hidróxido de potássio'], cls:'Corrosivo' },
    { keys:['permanganato','kmno4','dicromato','cromato','perclorato','clorato','peroxido','peróxido','persulfato','nitrato de amonio','nitrato de amônio','bromato','iodato','hipoclorito'], cls:'Oxidante' },
    { keys:['cloreto de mercurio','cloreto de mercúrio','cianeto','arsenito','azida','nitroprussiato','toluidina','o-toluidina','ditizona','formaldei','formaldeído','acrilamida','chumbo','cadmio','cádmio'], cls:'Tóxico' },
    { keys:['acido borico','ácido bórico','acido citrico','ácido cítrico','acido oxalico','ácido oxálico','acido ascorbico','ácido ascórbico','acido salicilico','ácido salicílico','acido tartarico','ácido tartárico','acido acetico diluido','acido sulfonico'], cls:'Ácido' },
    { keys:['carbonato de sodio','carbonato de sódio','bicarbonato','hidroxido de amonio','hidróxido de amônio','amonia','amônia','nh4oh','bórax','borato','carbonato de potassio','carbonato de potássio'], cls:'Base' },
    { keys:['cloreto de sodio','cloreto de sódio','nacl','sulfato de sodio','sulfato de sódio','edta','amido','sacarose','glicose','calcario','calcário','caco3','sulfato de calcio','sulfato de cálcio','sal comum','inerte','silica','sílica'], cls:'Inerte' },
  ];

  const INCOMPAT_MAP = {
    'Inflamável-Corrosivo':'no','Corrosivo-Inflamável':'no',
    'Inflamável-Oxidante':'no','Oxidante-Inflamável':'no',
    'Inflamável-Ácido':'no','Ácido-Inflamável':'no',
    'Corrosivo-Oxidante':'no','Oxidante-Corrosivo':'no',
    'Corrosivo-Ácido':'no','Ácido-Corrosivo':'no',
    'Corrosivo-Base':'no','Base-Corrosivo':'no',
    'Oxidante-Ácido':'no','Ácido-Oxidante':'no',
    'Oxidante-Base':'no','Base-Oxidante':'no',
    'Ácido-Base':'no','Base-Ácido':'no',
    'Inflamável-Inflamável':'warn',
    'Corrosivo-Tóxico':'warn','Tóxico-Corrosivo':'warn',
    'Oxidante-Tóxico':'warn','Tóxico-Oxidante':'warn',
    'Inflamável-Tóxico':'warn','Tóxico-Inflamável':'warn',
    'Ácido-Tóxico':'warn','Tóxico-Ácido':'warn',
    'Base-Tóxico':'warn','Tóxico-Base':'warn',
    'Corrosivo-Inerte':'warn','Inerte-Corrosivo':'warn',
    'Tóxico-Tóxico':'warn','Ácido-Ácido':'warn',
    'Base-Inflamável':'warn','Inflamável-Base':'warn',
  };

  // Lista de reagentes para autocomplete do verificador
  const INCOMP_REAGENTS = [
    'Acetona','Etanol','Metanol','Álcool isopropílico','Hexano','Tolueno','Benzeno','Clorofórmio','Éter etílico','Acetato de etila','Diclorometano','Ciclohexano',
    'Ácido sulfúrico','Ácido clorídrico','Ácido nítrico','Ácido fosfórico','Ácido acético','Ácido fórmico','Ácido oxálico','Ácido bórico','Ácido cítrico',
    'Hidróxido de sódio','Hidróxido de potássio','Hidróxido de amônio','Carbonato de sódio','Bicarbonato de sódio','Amônia',
    'Permanganato de potássio','Dicromato de potássio','Peróxido de hidrogênio','Perclorato de potássio','Nitrato de amônio','Hipoclorito de sódio',
    'Cloreto de mercúrio II','Cianeto de potássio','Arsenito de sódio','Azida de sódio','O-Toluidina','Formol/Formaldeído','Acrilamida',
    'Cloreto de sódio','EDTA','Amido','Sacarose','Sulfato de sódio','Sulfato de cálcio','Sílica gel',
  ];

  const FORMULAS = {
    'h2so4': 'acido sulfurico', 'hcl': 'acido cloridrico', 'hno3': 'acido nitrico',
    'h3po4': 'acido fosforico', 'ch3cooh': 'acido acetico', 'c2h4o2': 'acido acetico',
    'hf': 'acido fluoridrico', 'hbr': 'acido bromidrico', 'h2co3': 'acido carbonico',
    'h2o2': 'peroxido de hidrogenio', 'h2o': 'agua', 'naoh': 'hidroxido de sodio',
    'koh': 'hidroxido de potassio', 'nh4oh': 'hidroxido de amonio', 'nh3': 'amonia',
    'caoh2': 'hidroxido de calcio', 'ca(oh)2': 'hidroxido de calcio',
    'mgoh2': 'hidroxido de magnesio', 'nacl': 'cloreto de sodio', 'kcl': 'cloreto de potassio',
    'cacl2': 'cloreto de calcio', 'nahco3': 'bicarbonato de sodio',
    'na2co3': 'carbonato de sodio', 'caco3': 'carbonato de calcio',
    'na2so4': 'sulfato de sodio', 'cuso4': 'sulfato de cobre', 'feso4': 'sulfato de ferro',
    'mgso4': 'sulfato de magnesio', 'znso4': 'sulfato de zinco', 'kno3': 'nitrato de potassio',
    'nano3': 'nitrato de sodio', 'agno3': 'nitrato de prata', 'kmno4': 'permanganato de potassio',
    'k2cr2o7': 'dicromato de potassio', 'na2cr2o7': 'dicromato de sodio',
    'ch3oh': 'metanol', 'ch4o': 'metanol', 'c2h5oh': 'etanol', 'c2h6o': 'etanol',
    'c3h8o': 'isopropanol', 'c3h6o': 'acetona', 'ch3cocH3': 'acetona',
    'chcl3': 'cloroformio', 'ccl4': 'tetracloreto de carbono', 'ch2cl2': 'diclorometano',
    'c6h6': 'benzeno', 'c7h8': 'tolueno', 'c6h12': 'ciclohexano', 'c6h14': 'hexano',
    'c2h6o2': 'etilenoglicol', 'c3h8o3': 'glicerol', 'hcho': 'formaldeido',
    'ch2o': 'formaldeido', 'c4h8o2': 'acetato de etila', 'c4h10o': 'eter etilico',
    'co2': 'dioxido de carbono', 'co': 'monoxido de carbono', 'so2': 'dioxido de enxofre',
    'nh4cl': 'cloreto de amonio', 'na2s2o3': 'tiossulfato de sodio',
    'edta': 'acido etilenodiaminotetraacetico', 'naclo': 'hipoclorito de sodio'
  };

  const WALLS = {
    L:{ name:'Esquerda — Inflamáveis & Solventes', icon:'🔥', color:'#ff8850', bg:'rgba(255,107,43,0.15)',
        note:'⚠️ Armário antichama obrigatório' },
    B:{ name:'Fundo — Ácidos',                     icon:'⚗️', color:'#f0c830', bg:'rgba(232,184,0,0.15)',
        note:'⚠️ Bandejas de contenção em P1–P3' },
    R:{ name:'Direita — Sais, Bases & Inertes',    icon:'🧂', color:'#70b8ff', bg:'rgba(74,158,255,0.15)',
        note:'✓ Menor risco geral' },
    F:{ name:'Frente — Tóxicos, Oxidantes & Sol.', icon:'☠️', color:'#d080ff', bg:'rgba(192,96,255,0.15)',
        note:'🔒 P1 com armário trancado' },
  };

  const PF  = { label:'🔒 PF · SIPROQUIM 2', color:'#ff7070', bg:'rgba(255,80,80,0.14)' };
  const PF2 = { label:'🔒 PF · Lista II', color:'#ff7070', bg:'rgba(255,80,80,0.14)' };
  const PF4 = { label:'🔒 PF · Lista IV', color:'#ff7070', bg:'rgba(255,80,80,0.14)' };
  const PF5 = { label:'🔒 PF · Lista V', color:'#ff7070', bg:'rgba(255,80,80,0.14)' };
  const PF6 = { label:'🔒 PF · Lista VI', color:'#ff7070', bg:'rgba(255,80,80,0.14)' };
  const EB  = { label:'⚔️ Exército · SisFPC', color:'#ff9900', bg:'rgba(255,153,0,0.14)' };
  const COFRE = { label:'🔐 COFRE OBRIGATÓRIO', color:'#ff5555', bg:'rgba(255,50,50,0.18)' };

  function r(name, ctrl) {
    if (!ctrl) return { name, ctrl: null, ctrlLabel: null };
    if (ctrl === 'EB') return { name, ctrl: 'EB', ctrlLabel: '⚔️ EB · SisFPC' };
    // ctrl é uma constante PF com label
    if (typeof ctrl === 'object') return { name, ctrl: 'PF', ctrlLabel: ctrl.label };
    return { name, ctrl, ctrlLabel: null };
  }

  const SHELF_DATA = {
    L1:{ icon:'🔥', title:'Solventes pesados — estoque', short:'Benzeno · Tolueno · grandes volumes',
         desc:'Recipientes maiores (1L+) na base para minimizar risco de queda. Benzeno e Tolueno são controlados PF Lista II.',
         reagents:[r('Benzeno',PF2), r('Tolueno',PF2), r('Ciclohexano'), r('Ciclohexanona'), r('Éter de petróleo (estoque)')],
         ctrl:[PF2],
         rule:'⚡ Armário antichama. Tolueno e Benzeno: registro mensal SIPROQUIM 2 (Lista II).', rc:'rgba(255,107,43,0.12)', rt:'#ff8850' },
    L2:{ icon:'🔥', title:'Solventes halogenados & especiais', short:'Clorofórmio · Acetato de etila · N,N-dimetilformamida',
         desc:'Clorofórmio e Acetato de etila são controlados PF Lista II. Usar apenas em capela.',
         reagents:[r('Clorofórmio',PF2), r('Acetato de etila',PF2), r('N,N-Dimetilformamida'), r('Ciclohexanona')],
         ctrl:[PF2],
         rule:'⚡ Clorofórmio e Acetato de etila: PF Lista II — SIPROQUIM 2. Somente em capela.', rc:'rgba(255,107,43,0.12)', rt:'#ff8850' },
    L3:{ icon:'🔥', title:'Álcoois e acetona (uso diário)', short:'Etanol · Metanol · Acetona · Isopropanol',
         desc:'Acetona é controlada PF Lista II. Álcoois são Lista VII (sem controle interno, mas monitorar quantidades).',
         reagents:[r('Acetona',PF2), r('Etanol absoluto/P.A'), r('Álcool metílico'), r('Álcool isopropílico'), r('Álcool 70%')],
         ctrl:[PF2],
         rule:'⚡ Acetona: PF Lista II — SIPROQUIM 2 obrigatório. Frascos bem vedados. Voláteis.', rc:'rgba(255,107,43,0.12)', rt:'#ff8850' },
    L4:{ icon:'🔥', title:'Solventes leves — reserva 🪜', short:'Éter de petróleo · N-hexano · álcool tartárico',
         desc:'Recipientes leves de reserva. Sem controle obrigatório interno (Lista VII). Acesso por escada.',
         reagents:[r('N-Hexano'), r('Éter de petróleo (reserva)'), r('Álcool tartárico P.A')],
         ctrl:[],
         rule:'🪜 Escada. Lista VII — sem controle interno. Apenas frascos leves.', rc:'rgba(255,184,74,0.12)', rt:'#ffb84a' },
    L5:{ icon:'🔥', title:'Auxiliares 🪜', short:'Glicerina · vaselina · silicone · algodão',
         desc:'Materiais auxiliares e consumíveis de baixo risco. Itens leves.',
         reagents:[r('Glicerina/Glicerol'), r('Vaselina líquida/sólida'), r('Silicone líquido'), r('Graxa de silicone'), r('Algodão de vidro')],
         ctrl:[],
         rule:'🪜 Escada. Baixo risco. Itens leves.', rc:'rgba(255,184,74,0.12)', rt:'#ffb84a' },
    L6:{ icon:'🔥', title:'Topo — reserva / frascos vazios 🪜', short:'Estoque leve de reserva',
         desc:'Apenas estoque de reserva em frascos pequenos e frascos vazios limpos.',
         reagents:[r('Frascos vazios limpos'), r('Estoque mínimo de reserva')],
         ctrl:[],
         rule:'🪜 Topo. Nada pesado ou perigoso aqui.', rc:'rgba(255,184,74,0.12)', rt:'#ffb84a' },

    B1:{ icon:'⚔️', title:'Ácido nítrico — ISOLADO · Exército', short:'HNO₃ concentrado / fumegante',
         desc:'Controlado pelo Exército Brasileiro (SisFPC). ISOLADO em bandeja exclusiva. Jamais perto de orgânicos, HCl ou inflamáveis.',
         reagents:[r('Ácido nítrico concentrado','EB'), r('Ácido nítrico fumegante','EB')],
         ctrl:[EB],
         rule:'⚔️ Registro obrigatório SisFPC/Exército. Bandeja exclusiva. NUNCA com orgânicos.', rc:'rgba(255,153,0,0.14)', rt:'#ff9900' },
    B2:{ icon:'⚗️', title:'Ácidos inorgânicos concentrados · PF', short:'H₂SO₄ · HCl concentrados',
         desc:'Ácidos fortes concentrados. Controlados PF Lista IV. Bandejas de contenção ≥10% volume. NUNCA no alto.',
         reagents:[r('Ácido sulfúrico concentrado',PF4), r('Ácido clorídrico concentrado',PF4), r('Ácido sulfúrico + molibdato de amônio',PF4), r('Ácido fosfórico (H₃PO₄)',PF4)],
         ctrl:[PF4],
         rule:'⚗️ PF Lista IV. NUNCA no alto. Bandeja dupla. EPI completo.', rc:'rgba(232,184,0,0.12)', rt:'#f0c830' },
    B3:{ icon:'⚗️', title:'Ácidos orgânicos concentrados · PF', short:'Ác. acético · fórmico · HCl diluído',
         desc:'Acético e fórmico são controlados PF Lista IV (≥10%). Odor intenso — usar sempre em capela.',
         reagents:[r('Ácido acético glacial',PF4), r('Ácido acético',PF4), r('Ácido fórmico',PF4), r('Ácido clorídrico 9,25%',PF4)],
         ctrl:[PF4],
         rule:'⚗️ PF Lista IV. Usar em capela. Bandeja de contenção obrigatória.', rc:'rgba(232,184,0,0.12)', rt:'#f0c830' },
    B4:{ icon:'⚗️', title:'Ácidos fracos / sólidos 🪜', short:'Bórico · benzóico · ascórbico · cítrico',
         desc:'Ácido bórico e benzóico são controlados PF Lista IV. Demais têm menor risco. Frascos leves.',
         reagents:[r('Ácido bórico',PF4), r('Ácido benzóico',PF4), r('Ácido cítrico'), r('Ácido ascórbico'), r('Ácido salicílico'), r('Ácido oxálico')],
         ctrl:[PF4],
         rule:'🪜 Escada. Bórico e benzóico: PF Lista IV. Pós bem vedados.', rc:'rgba(255,184,74,0.12)', rt:'#ffb84a' },
    B5:{ icon:'⚗️', title:'Ácidos especiais 🪜', short:'Ác. sulfanílico · náftol-sulfônico · fenol',
         desc:'Reagentes ácidos especiais. Fenol é tóxico. Frascos pequenos leves.',
         reagents:[r('Ácido sulfanílico'), r('Ácido 1-amino-2-naftol-4-sulfônico'), r('Fenol/Ácido fênico (tóxico)'), r('Ácido tartárico')],
         ctrl:[],
         rule:'🪜 Escada. Fenol é tóxico — EPI. Frascos pequenos.', rc:'rgba(255,184,74,0.12)', rt:'#ffb84a' },
    B6:{ icon:'⚗️', title:'Topo — reserva / tampões ácidos 🪜', short:'Tampões padrão de pH · reserva',
         desc:'Tampões de pH e reserva de ácidos diluídos em frascos pequenos.',
         reagents:[r('Tampão pH 4'), r('Tampão pH 7'), r('Tampão pH 10'), r('Estoque reserva ácidos diluídos')],
         ctrl:[],
         rule:'🪜 Topo. Apenas frascos leves e diluídos.', rc:'rgba(255,184,74,0.12)', rt:'#ffb84a' },

    R1:{ icon:'🔵', title:'Bases sólidas pesadas', short:'NaOH · KOH · Ca(OH)₂ · Cal',
         desc:'Hidróxidos sólidos pesados e higroscópicos. Lista VII (sem controle interno). Frascos herméticos obrigatórios.',
         reagents:[r('Hidróxido de sódio'), r('Hidróxido de potássio'), r('Hidróxido de cálcio'), r('Óxido de cálcio (cal)'), r('Suspensão Al(OH)₃')],
         ctrl:[],
         rule:'🔵 NUNCA com ácidos. Frascos herméticos — fortemente higroscópicos.', rc:'rgba(74,158,255,0.12)', rt:'#70b8ff' },
    R2:{ icon:'🧂', title:'Sais inorgânicos — embalagens grandes', short:'Sulfatos · fosfatos · carbonatos (1kg)',
         desc:'Sais inorgânicos em embalagens 500g–1kg. Carbonato de sódio e potássio são Lista VII.',
         reagents:[r('Sulfato de ferro'), r('Sulfato de magnésio'), r('Sulfato de manganês'), r('Sulfato de alumínio'), r('Carbonato de sódio'), r('Carbonato de potássio'), r('Fosfatos de sódio/potássio'), r('Cloreto de ferro'), r('Cloreto de cálcio/magnésio'), r('Iodeto de sódio (NaI)')],
         ctrl:[],
         rule:'🧂 Baixo risco. Secos e vedados. Lista VII — sem controle interno.', rc:'rgba(0,200,150,0.10)', rt:'#40d8a0' },
    R3:{ icon:'🧂', title:'Sais de uso diário + NH₄OH · PF', short:'NaCl · acetatos · oxalatos · NH₄OH',
         desc:'Sais de uso frequente. Hidróxido de amônio é controlado PF Lista V (≥10%).',
         reagents:[r('Hidróxido de amônio',PF5), r('Cloreto de sódio'), r('Acetato de sódio'), r('Acetato de amônio'), r('Oxalato de sódio'), r('Oxalato de amônio'), r('Brometo de potássio'), r('Nitrito de sódio'), r('Amido solúvel'), r('Caulim'), r('Fosfato monopotássio (KH₂PO₄)'), r('Fosfato dipotássico (K₂HPO₄)')],
         ctrl:[PF5],
         rule:'⚗️ NH₄OH: PF Lista V — SIPROQUIM 2. Usar em capela.', rc:'rgba(74,158,255,0.12)', rt:'#70b8ff' },
    R4:{ icon:'🧂', title:'Sais analíticos especiais · PF 🪜', short:'Tiossulfato · EDTA · hidroxilamina · cloreto de amônio',
         desc:'Hidroxilamina e cloridrato são controlados PF Lista VI. Cloreto de amônio é controlado PF Lista VI.',
         reagents:[r('Tiossulfato de sódio'), r('Sal dissódico EDTA'), r('Hidroxilamina',PF6), r('Hidroxilamina cloridrato',PF6), r('Cloreto de amônio',PF6), r('Sulfato de cobre II'), r('Sulfato de prata')],
         ctrl:[PF6],
         rule:'🪜 Escada. Hidroxilamina + Cloreto de amônio: PF Lista VI.', rc:'rgba(255,184,74,0.12)', rt:'#ffb84a' },
    R5:{ icon:'🧂', title:'Indicadores & corantes 🪜', short:'Murexida · negro eriocromo · azul metileno',
         desc:'Indicadores em pó e corantes em frascos pequenos. Baixo risco. Ao abrigo de luz.',
         reagents:[r('Murexida'), r('Negro de eriocromo T'), r('Azul de metileno'), r('Verde de bromocresol'), r('Vermelho de metila'), r('Alaranjado de metila'), r('Azul de timol'), r('Cristal violeta'), r('Safranina'), r('Ditizona')],
         ctrl:[],
         rule:'🪜 Escada. Itens leves. Proteger da luz — frascos âmbar.', rc:'rgba(0,200,150,0.10)', rt:'#40d8a0' },
    R6:{ icon:'🧂', title:'Topo — reserva de sais · PF 🪜', short:'Bórax · bicarbonato K · sulfito',
         desc:'Reserva de sais em frascos leves. Bicarbonato de potássio é controlado PF Lista V.',
         reagents:[r('Tetraborato de sódio/Bórax'), r('Borato de sódio anidro'), r('Bicarbonato de potássio',PF5), r('Bissulfato de sódio'), r('Sulfito de sódio'), r('Sulfato de sódio')],
         ctrl:[PF5],
         rule:'🪜 Topo. Bicarbonato de K: PF Lista V. Apenas frascos leves.', rc:'rgba(255,184,74,0.12)', rt:'#ffb84a' },

    F1:{ icon:'🔐', title:'Muito tóxicos — COFRE TRANCADO', short:'Hg · cianetos · arsenito · azida',
         desc:'Substâncias extremamente tóxicas. COFRE com chave. Registro de entrada/saída com assinatura a cada uso.',
         reagents:[r('Cloreto de mercúrio II',PF6), r('Sulfato de mercúrio II'), r('Óxido de mercúrio II'), r('Iodeto de mercúrio II'), r('Cianeto de potássio'), r('Meta-arsenito de sódio'), r('Azida sódica'), r('Nitroprussiato de sódio')],
         ctrl:[PF6, COFRE],
         rule:'🔐 COFRE COM CHAVE. Cloreto Hg II: PF Lista VI. Cianeto JAMAIS perto de ácido.', rc:'rgba(255,50,50,0.12)', rt:'#ff5555' },
    F2:{ icon:'☠️', title:'Tóxicos metais pesados — acesso restrito', short:'AgNO₃ · paládio · cobalto · estanho · zircônio',
         desc:'Sais tóxicos de metais pesados. Armário fechado com chave. Frascos âmbar para fotossensíveis.',
         reagents:[r('Nitrato de prata'), r('Sulfato de prata'), r('Nitrato de paládio'), r('Cloreto de cobalto II'), r('Cloreto estanhoso'), r('Oxicloreto de zircônio'), r('Antimônio padrão (AAS)')],
         ctrl:[],
         rule:'🔒 Acesso restrito. Frascos âmbar (fotossensíveis). EPI. Registro de uso.', rc:'rgba(192,96,255,0.12)', rt:'#d080ff' },
    F3:{ icon:'💥', title:'Oxidantes · PF — longe dos inflamáveis', short:'KMnO₄ · dicromato · persulfatos · H₂O₂',
         desc:'Agentes oxidantes fortes. Permanganato, Cromato e Dicromatos são controlados PF Lista VI. NUNCA com orgânicos.',
         reagents:[r('Permanganato de potássio',PF6), r('Dicromato de potássio',PF6), r('Cromato de potássio',PF6), r('Bicromato de potássio',PF6), r('Persulfato de amônio'), r('Persulfato de potássio'), r('Bromato de potássio'), r('Iodato de potássio'), r('Peróxido de hidrogênio'), r('Hipoclorito de cálcio'), r('Água oxigenada')],
         ctrl:[PF6],
         rule:'💥 KMnO₄, Cromatos, Dicromatos: PF Lista VI — SIPROQUIM 2. NUNCA com orgânicos.', rc:'rgba(255,145,0,0.13)', rt:'#ffaa44' },
    F4:{ icon:'🧪', title:'SOLUÇÕES — aguarda descarte', short:'Sol. ácidas · básicas · EDTA · padrões…',
         desc:'Área temporária para todas as soluções prontas (Sol.). NÃO descartar antes de pesquisar o método correto. Priorizar soluções com mercúrio.',
         reagents:[r('Sol. H₂SO₄ (várias)'), r('Sol. HCl'), r('Sol. NaOH'), r('Sol. EDTA'), r('Sol. AgNO₃'), r('Sol. tampão (várias)'), r('Sol. iodo/lugol'), r('Sol. permanganato'), r('Sol. tiossulfato'), r('Sol. indicadores')],
         ctrl:[],
         rule:'🗑️ Rotular "AGUARDA DESCARTE". Pesquisar método individual. Sol. com Hg: descarte especial urgente.', rc:'rgba(120,140,160,0.16)', rt:'#aab8c8' },
    F5:{ icon:'🧪', title:'SOLUÇÕES-estoque — aguarda descarte 🪜', short:'Estoques 1000ppm · padrões AAS/ICP',
         desc:'Soluções-estoque de metais (Zn, Ni, Mn, Fe, Cu) e padrões AAS/ICP. Metais pesados exigem descarte especial.',
         reagents:[r('Sol. estoque Zn 1000ppm'), r('Sol. estoque Ni 1000ppm'), r('Sol. estoque Mn 1000ppm'), r('Sol. estoque Fe'), r('Sol. estoque Cu'), r('Sol. estoque cloro-mercúrio'), r('Sol. padrão NaCl'), r('Sol. padrão fosfato')],
         ctrl:[],
         rule:'🗑️🪜 Metais pesados (Hg, Ni, Cu): descarte especial prioritário. Não lançar na pia.', rc:'rgba(120,140,160,0.16)', rt:'#aab8c8' },
    F6:{ icon:'☠️', title:'Tóxicos leves & não identificados 🪜', short:'O-toluidina · dietilditiocarbamato · a identificar',
         desc:'Tóxicos de menor risco e reagentes com nome em alemão ou não identificados. Manter segregado até identificação.',
         reagents:[r('O-toluidina'), r('Dietilditiocarbamato de sódio'), r('Ditizona'), r('Indigo Blue padrão'), r('Formiato de sódio (Natriumformiat)'), r('Kristall Violett'), r('Reagentes a identificar')],
         ctrl:[],
         rule:'🪜🔒 Não identificados: NÃO usar até identificação. Etiquetar "A IDENTIFICAR".', rc:'rgba(192,96,255,0.12)', rt:'#d080ff' },
  };

  const BOTTLE_H = { 6:[9,12,10], 5:[11,9,12], 4:[12,14,11], 3:[14,11,15], 2:[16,13,18], 1:[19,16,21] };

  // ===================== BASE DE DADOS CAS =====================
  const CAS_DB = [
    // Água e solventes comuns
    { cas:'7732-18-5', name:'Água', formula:'H₂O', aliases:['agua','water','h2o','oxido de hidrogenio','óxido de hidrogênio'] },
    { cas:'64-17-5', name:'Etanol', formula:'C₂H₅OH', aliases:['etanol','alcool etilico','álcool etílico','ethanol','alcool','álcool','c2h5oh','ch3ch2oh'] },
    { cas:'67-56-1', name:'Metanol', formula:'CH₃OH', aliases:['metanol','alcool metilico','álcool metílico','methanol','alcool de madeira','ch3oh'] },
    { cas:'67-64-1', name:'Acetona', formula:'C₃H₆O', aliases:['acetona','propanona','2-propanona','dimetilcetona','c3h6o'] },
    { cas:'141-78-6', name:'Acetato de etila', formula:'C₄H₈O₂', aliases:['acetato de etila','etil acetato','ethyl acetate','c4h8o2'] },
    { cas:'110-54-3', name:'Hexano', formula:'C₆H₁₄', aliases:['hexano','n-hexano','hexane','c6h14'] },
    { cas:'108-88-3', name:'Tolueno', formula:'C₇H₈', aliases:['tolueno','metilbenzeno','toluene','c7h8'] },
    { cas:'1330-20-7', name:'Xileno', formula:'C₈H₁₀', aliases:['xileno','xylene','dimetilbenzeno','c8h10'] },
    { cas:'71-43-2', name:'Benzeno', formula:'C₆H₆', aliases:['benzeno','benzene','c6h6'] },
    { cas:'60-29-7', name:'Éter etílico', formula:'C₄H₁₀O', aliases:['eter etilico','éter etílico','dietil eter','diethyl ether','eter','éter','c4h10o'] },
    { cas:'109-99-9', name:'Tetrahidrofurano', formula:'C₄H₈O', aliases:['tetrahidrofurano','thf','tetrahydrofuran','c4h8o'] },
    { cas:'75-09-2', name:'Diclorometano', formula:'CH₂Cl₂', aliases:['diclorometano','cloreto de metileno','methylene chloride','ch2cl2','dcm'] },
    { cas:'67-66-3', name:'Clorofórmio', formula:'CHCl₃', aliases:['cloroformio','clorofórmio','triclorometano','chloroform','chcl3'] },
    { cas:'71-55-6', name:'1,1,1-Tricloroetano', formula:'C₂H₃Cl₃', aliases:['1,1,1-tricloroetano','tricloroetano','c2h3cl3'] },
    { cas:'79-01-6', name:'Tricloroetileno', formula:'C₂HCl₃', aliases:['tricloroetileno','tricloroetileno','tce','c2hcl3'] },
    { cas:'127-19-5', name:'Dimetilformamida', formula:'C₃H₇NO', aliases:['dimetilformamida','dmf','dimethylformamide','c3h7no'] },
    { cas:'67-68-5', name:'Dimetilsulfóxido', formula:'C₂H₆OS', aliases:['dimetilsulfoxido','dimetilsulfóxido','dmso','dimethylsulfoxide','c2h6os'] },
    { cas:'872-50-4', name:'N-Metil-2-pirrolidona', formula:'C₅H₉NO', aliases:['nmp','n-metil-2-pirrolidona','n-methyl-2-pyrrolidone','c5h9no'] },
    { cas:'75-05-8', name:'Acetonitrila', formula:'CH₃CN', aliases:['acetonitrila','acetonitrile','metilcianeto','ch3cn','acn'] },

    // Ácidos
    { cas:'7664-93-9', name:'Ácido Sulfúrico', formula:'H₂SO₄', aliases:['acido sulfurico','ácido sulfúrico','sulfuric acid','h2so4','oleum'] },
    { cas:'7647-01-0', name:'Ácido Clorídrico', formula:'HCl', aliases:['acido cloridrico','ácido clorídrico','hydrochloric acid','hcl','acido muriatico','ácido muriático'] },
    { cas:'7697-37-2', name:'Ácido Nítrico', formula:'HNO₃', aliases:['acido nitrico','ácido nítrico','nitric acid','hno3','agua regia'] },
    { cas:'7664-38-2', name:'Ácido Fosfórico', formula:'H₃PO₄', aliases:['acido fosforico','ácido fosfórico','phosphoric acid','h3po4'] },
    { cas:'64-19-7', name:'Ácido Acético', formula:'CH₃COOH', aliases:['acido acetico','ácido acético','acetic acid','ch3cooh','acido acetico glacial','ácido acético glacial','vinagre'] },
    { cas:'144-62-7', name:'Ácido Oxálico', formula:'C₂H₂O₄', aliases:['acido oxalico','ácido oxálico','oxalic acid','c2h2o4'] },
    { cas:'79-14-1', name:'Ácido Glicólico', formula:'C₂H₄O₃', aliases:['acido glicolico','ácido glicólico','glycolic acid','c2h4o3'] },
    { cas:'77-92-9', name:'Ácido Cítrico', formula:'C₆H₈O₇', aliases:['acido citrico','ácido cítrico','citric acid','c6h8o7'] },
    { cas:'50-21-5', name:'Ácido Láctico', formula:'C₃H₆O₃', aliases:['acido latico','ácido láctico','lactic acid','c3h6o3'] },
    { cas:'107-92-6', name:'Ácido Butírico', formula:'C₄H₈O₂', aliases:['acido butilico','ácido butírico','butyric acid','c4h8o2'] },
    { cas:'76-05-1', name:'Ácido Trifluoroacético', formula:'CF₃COOH', aliases:['acido trifluoroacetico','ácido trifluoroacético','trifluoroacetic acid','tfa','cf3cooh'] },
    { cas:'10035-10-6', name:'Ácido Bromídrico', formula:'HBr', aliases:['acido bromidrico','ácido bromídrico','hydrobromic acid','hbr'] },
    { cas:'10034-85-2', name:'Ácido Iodídrico', formula:'HI', aliases:['acido iodidrico','ácido iodídrico','hydroiodic acid','hi'] },
    { cas:'74-90-8', name:'Ácido Cianídrico', formula:'HCN', aliases:['acido cianidrico','ácido cianídrico','prussic acid','cianeto de hidrogenio','cianeto de hidrogênio','hcn'] },
    { cas:'7789-20-0', name:'Água Deuterada', formula:'D₂O', aliases:['agua deuterada','agua pesada','água deuterada','água pesada','heavy water','d2o'] },
    { cas:'1310-58-3', name:'Hidróxido de Potássio', formula:'KOH', aliases:['hidroxido de potassio','hidróxido de potássio','potassium hydroxide','potassa caustica','koh'] },

    // Bases
    { cas:'1310-73-2', name:'Hidróxido de Sódio', formula:'NaOH', aliases:['hidroxido de sodio','hidróxido de sódio','sodium hydroxide','soda caustica','soda cáustica','naoh'] },
    { cas:'1336-21-6', name:'Hidróxido de Amônio', formula:'NH₄OH', aliases:['hidroxido de amonio','hidróxido de amônio','ammonium hydroxide','amonia','amônia','amoniaco','amoniaco aquoso','amônia aquosa','nh4oh'] },
    { cas:'1305-78-8', name:'Hidróxido de Cálcio', formula:'Ca(OH)₂', aliases:['hidroxido de calcio','hidróxido de cálcio','calcium hydroxide','cal hidratada','cal apagada','ca(oh)2'] },
    { cas:'1120-46-3', name:'Carbonato de Sódio', formula:'Na₂CO₃', aliases:['carbonato de sodio','carbonato de sódio','sodium carbonate','barrilha','barrilha leve','na2co3','soda ash'] },
    { cas:'144-55-8', name:'Bicarbonato de Sódio', formula:'NaHCO₃', aliases:['bicarbonato de sodio','bicarbonato de sódio','sodium bicarbonate','bicarbonato','nahco3'] },
    { cas:'584-08-7', name:'Carbonato de Potássio', formula:'K₂CO₃', aliases:['carbonato de potassio','carbonato de potássio','potassium carbonate','potassa','k2co3'] },
    { cas:'7664-41-7', name:'Amônia', formula:'NH₃', aliases:['amonia','amônia','amoniaco','amôniaco','ammonia','nh3'] },

    // Sais comuns
    { cas:'7647-14-5', name:'Cloreto de Sódio', formula:'NaCl', aliases:['cloreto de sodio','cloreto de sódio','sodium chloride','sal','sal comum','sal de cozinha','nacl'] },
    { cas:'7681-11-0', name:'Iodeto de Potássio', formula:'KI', aliases:['iodeto de potassio','iodeto de potássio','potassium iodide','ki'] },
    { cas:'7681-82-5', name:'Iodeto de Sódio', formula:'NaI', aliases:['iodeto de sodio','iodeto de sódio','sodium iodide','nai','natriumjodid'] },
    { cas:'7778-77-0', name:'Fosfato Monopotássico', formula:'KH₂PO₄', aliases:['fosfato monopotassico','fosfato monopotássico','potassium phosphate monobasic','kh2po4','dihidrogenofosfato de potassio','dihídrogenofosfato de potássio','fosfato monobasico de potassio','fosfato monobásico de potássio','kh2po4'] },
    { cas:'7447-40-7', name:'Cloreto de Potássio', formula:'KCl', aliases:['cloreto de potassio','cloreto de potássio','potassium chloride','kcl'] },
    { cas:'10043-52-4', name:'Cloreto de Cálcio', formula:'CaCl₂', aliases:['cloreto de calcio','cloreto de cálcio','calcium chloride','cacl2'] },
    { cas:'7791-18-6', name:'Cloreto de Magnésio', formula:'MgCl₂', aliases:['cloreto de magnesio','cloreto de magnésio','magnesium chloride','mgcl2'] },
    { cas:'7758-19-2', name:'Clorito de Sódio', formula:'NaClO₂', aliases:['clorito de sodio','clorito de sódio','sodium chlorite','naclo2'] },
    { cas:'7681-52-9', name:'Hipoclorito de Sódio', formula:'NaClO', aliases:['hipoclorito de sodio','hipoclorito de sódio','sodium hypochlorite','agua sanitaria','água sanitária','naclo'] },
    { cas:'7757-82-6', name:'Sulfato de Sódio', formula:'Na₂SO₄', aliases:['sulfato de sodio','sulfato de sódio','sodium sulfate','sal de glauber','na2so4'] },
    { cas:'7778-80-5', name:'Sulfato de Potássio', formula:'K₂SO₄', aliases:['sulfato de potassio','sulfato de potássio','potassium sulfate','k2so4'] },
    { cas:'7487-88-9', name:'Sulfato de Magnésio', formula:'MgSO₄', aliases:['sulfato de magnesio','sulfato de magnésio','magnesium sulfate','sal amargo','sal inglês','mgso4','sal de epsom'] },
    { cas:'7778-18-9', name:'Sulfato de Cálcio', formula:'CaSO₄', aliases:['sulfato de calcio','sulfato de cálcio','calcium sulfate','gesso','caso4'] },
    { cas:'7727-54-0', name:'Persulfato de Amônio', formula:'(NH₄)₂S₂O₈', aliases:['persulfato de amonio','persulfato de amônio','ammonium persulfate','(nh4)2s2o8'] },
    { cas:'7727-21-1', name:'Persulfato de Potássio', formula:'K₂S₂O₈', aliases:['persulfato de potassio','persulfato de potássio','potassium persulfate','k2s2o8'] },
    { cas:'7722-76-1', name:'Fosfato de Amônio Monobásico', formula:'NH₄H₂PO₄', aliases:['fosfato de amonio','fosfato de amônio','ammonium phosphate','nh4h2po4'] },
    { cas:'7558-79-4', name:'Fosfato de Sódio Dibásico', formula:'Na₂HPO₄', aliases:['fosfato de sodio','fosfato de sódio dibasico','dibasic sodium phosphate','na2hpo4'] },
    { cas:'7601-54-9', name:'Fosfato de Sódio Tribásico', formula:'Na₃PO₄', aliases:['fosfato tribasico de sodio','fosfato tribásico de sódio','trisodium phosphate','na3po4'] },
    { cas:'7440-23-5', name:'Sódio metálico', formula:'Na', aliases:['sodio metalico','sódio metálico','sodium metal','na'] },
    { cas:'7440-09-7', name:'Potássio metálico', formula:'K', aliases:['potassio metalico','potássio metálico','potassium metal','k'] },

    // Oxidantes e compostos de interesse
    { cas:'7722-64-7', name:'Permanganato de Potássio', formula:'KMnO₄', aliases:['permanganato de potassio','permanganato de potássio','potassium permanganate','kmno4'] },
    { cas:'7778-74-7', name:'Perclorato de Potássio', formula:'KClO₄', aliases:['perclorato de potassio','perclorato de potássio','potassium perchlorate','kclo4'] },
    { cas:'7791-03-9', name:'Perclorato de Lítio', formula:'LiClO₄', aliases:['perclorato de litio','perclorato de lítio','lithium perchlorate','liclo4'] },
    { cas:'7775-09-9', name:'Clorato de Sódio', formula:'NaClO₃', aliases:['clorato de sodio','clorato de sódio','sodium chlorate','naclo3'] },
    { cas:'3811-04-9', name:'Clorato de Potássio', formula:'KClO₃', aliases:['clorato de potassio','clorato de potássio','potassium chlorate','kclo3'] },
    { cas:'7722-84-1', name:'Peróxido de Hidrogênio', formula:'H₂O₂', aliases:['peroxido de hidrogenio','peróxido de hidrogênio','hydrogen peroxide','agua oxigenada','água oxigenada','h2o2'] },
    { cas:'7775-27-1', name:'Persulfato de Sódio', formula:'Na₂S₂O₈', aliases:['persulfato de sodio','persulfato de sódio','sodium persulfate','na2s2o8'] },
    { cas:'7789-00-6', name:'Cromato de Potássio', formula:'K₂CrO₄', aliases:['cromato de potassio','cromato de potássio','potassium chromate','k2cro4'] },
    { cas:'7778-50-9', name:'Dicromato de Potássio', formula:'K₂Cr₂O₇', aliases:['dicromato de potassio','dicromato de potássio','potassium dichromate','k2cr2o7'] },
    { cas:'10588-01-9', name:'Dicromato de Sódio', formula:'Na₂Cr₂O₇', aliases:['dicromato de sodio','dicromato de sódio','sodium dichromate','na2cr2o7'] },
    { cas:'7789-09-5', name:'Dicromato de Amônio', formula:'(NH₄)₂Cr₂O₇', aliases:['dicromato de amonio','dicromato de amônio','ammonium dichromate','(nh4)2cr2o7'] },
    { cas:'7601-90-3', name:'Ácido Perclórico', formula:'HClO₄', aliases:['acido perclorico','ácido perclórico','perchloric acid','hclo4'] },

    // Metais e sais de metais
    { cas:'7440-22-4', name:'Prata', formula:'Ag', aliases:['prata','silver','ag'] },
    { cas:'7761-88-8', name:'Nitrato de Prata', formula:'AgNO₃', aliases:['nitrato de prata','silver nitrate','agno3'] },
    { cas:'7783-89-3', name:'Nitrato de Prata Amoniacal', formula:'AgNO₃/NH₃', aliases:['nitrato de prata amoniacal','licor de tollens','reagente de tollens'] },
    { cas:'7440-57-5', name:'Ouro', formula:'Au', aliases:['ouro','gold','au'] },
    { cas:'7440-47-3', name:'Cromo', formula:'Cr', aliases:['cromo','chromium','cr'] },
    { cas:'7440-43-9', name:'Cádmio', formula:'Cd', aliases:['cadmio','cádmio','cadmium','cd'] },
    { cas:'7440-50-8', name:'Cobre', formula:'Cu', aliases:['cobre','copper','cu'] },
    { cas:'7758-98-7', name:'Sulfato de Cobre II', formula:'CuSO₄', aliases:['sulfato de cobre','sulfato cuprico','sulfato cúprico','copper sulfate','cuso4','vitriolo azul','pedra hume'] },
    { cas:'7440-66-6', name:'Zinco', formula:'Zn', aliases:['zinco','zinc','zn'] },
    { cas:'7733-02-0', name:'Sulfato de Zinco', formula:'ZnSO₄', aliases:['sulfato de zinco','zinc sulfate','znso4'] },
    { cas:'7646-85-7', name:'Cloreto de Zinco', formula:'ZnCl₂', aliases:['cloreto de zinco','zinc chloride','zncl2'] },
    { cas:'7440-02-0', name:'Níquel', formula:'Ni', aliases:['niquel','níquel','nickel','ni'] },
    { cas:'7440-44-0', name:'Carbono', formula:'C', aliases:['carbono','carbon','c','carvao ativo','carvão ativo','grafite'] },
    { cas:'7782-44-7', name:'Oxigênio', formula:'O₂', aliases:['oxigenio','oxigênio','oxygen','o2'] },
    { cas:'7727-37-9', name:'Nitrogênio', formula:'N₂', aliases:['nitrogenio','nitrogênio','nitrogen','n2'] },
    { cas:'7440-37-1', name:'Argônio', formula:'Ar', aliases:['argonio','argônio','argon','ar'] },
    { cas:'7440-59-7', name:'Hélio', formula:'He', aliases:['helio','hélio','helium','he'] },
    { cas:'7782-50-5', name:'Cloro', formula:'Cl₂', aliases:['cloro','chlorine','cl2'] },
    { cas:'7726-95-6', name:'Bromo', formula:'Br₂', aliases:['bromo','bromine','br2'] },
    { cas:'7553-56-2', name:'Iodo', formula:'I₂', aliases:['iodo','iodine','i2'] },
    { cas:'7783-06-4', name:'Sulfeto de Hidrogênio', formula:'H₂S', aliases:['sulfeto de hidrogenio','sulfeto de hidrogênio','hydrogen sulfide','gas sulfidrico','gás sulfídrico','h2s'] },
    { cas:'7782-42-5', name:'Grafite', formula:'C', aliases:['grafite','graphite','carbono grafite'] },
    { cas:'7440-21-3', name:'Silício', formula:'Si', aliases:['silicio','silício','silicon','si'] },
    { cas:'7440-32-6', name:'Titânio', formula:'Ti', aliases:['titanio','titânio','titanium','ti'] },
    { cas:'7440-38-2', name:'Arsênio', formula:'As', aliases:['arsenio','arsênio','arsenic','as'] },
    { cas:'7782-49-2', name:'Selênio', formula:'Se', aliases:['selenio','selênio','selenium','se'] },

    // Compostos de mercúrio e tóxicos
    { cas:'7487-94-7', name:'Cloreto de Mercúrio II', formula:'HgCl₂', aliases:['cloreto de mercurio','cloreto de mercúrio','mercuric chloride','hgcl2','bicloreto de mercurio'] },
    { cas:'21908-53-2', name:'Óxido de Mercúrio II', formula:'HgO', aliases:['oxido de mercurio','óxido de mercúrio','mercuric oxide','hgo'] },
    { cas:'7783-35-9', name:'Sulfato de Mercúrio II', formula:'HgSO₄', aliases:['sulfato de mercurio','sulfato de mercúrio','mercuric sulfate','hgso4'] },
    { cas:'7774-29-0', name:'Iodeto de Mercúrio II', formula:'HgI₂', aliases:['iodeto de mercurio','iodeto de mercúrio','mercuric iodide','hgi2'] },
    { cas:'151-50-8', name:'Cianeto de Potássio', formula:'KCN', aliases:['cianeto de potassio','cianeto de potássio','potassium cyanide','kcn'] },
    { cas:'143-33-9', name:'Cianeto de Sódio', formula:'NaCN', aliases:['cianeto de sodio','cianeto de sódio','sodium cyanide','nacn'] },
    { cas:'26628-22-8', name:'Azida de Sódio', formula:'NaN₃', aliases:['azida de sodio','azida de sódio','sodium azide','nan3'] },
    { cas:'13746-66-2', name:'Nitroprussiato de Sódio', formula:'Na₂[Fe(CN)₅NO]', aliases:['nitroprussiato de sodio','nitroprussiato de sódio','sodium nitroprusside','na2fe(cn)5no'] },

    // Indicadores e corantes
    { cas:'66-56-8', name:'Fenolftaleína', formula:'C₂₀H₁₄O₄', aliases:['fenolftaleina','fenolftaleína','phenolphthalein','c20h14o4'] },
    { cas:'547-58-0', name:'Alaranjado de Metila', formula:'C₁₄H₁₄N₃NaO₃S', aliases:['alaranjado de metila','laranja de metila','methyl orange','mo'] },
    { cas:'1461-15-0', name:'Azul de Bromotimol', formula:'C₂₇H₂₈Br₂O₅S', aliases:['azul de bromotimol','bromothymol blue','btb'] },
    { cas:'5765-44-6', name:'Azul de Bromofenol', formula:'C₁₉H₁₀Br₄O₅S', aliases:['azul de bromofenol','bromophenol blue','bpb'] },
    { cas:'553-26-4', name:'Violeta de Cristal', formula:'C₂₅H₃₀ClN₃', aliases:['violeta de cristal','crystal violet','gentian violet','cristal violett','kristall violett'] },
    { cas:'1934-21-0', name:'Amarelo de Tartrazina', formula:'C₁₆H₉N₄Na₃O₉S₂', aliases:['tartrazina','tartrazine','amarelo tartrazina','e102'] },
    { cas:'3844-45-9', name:'Azul Indigotina', formula:'C₁₆H₈N₂Na₂O₈S₂', aliases:['indigotina','indigo blue','azul indigotina','e132'] },
    { cas:'860-22-0', name:'Azul Índigo', formula:'C₁₆H₁₀N₂O₂', aliases:['azul indigo','indigo','indigo blue','c16h10n2o2'] },

    // Reagentes bioquímicos
    { cas:'60-00-4', name:'EDTA', formula:'C₁₀H₁₆N₂O₈', aliases:['edta','acido etilenediaminoacetico','ácido etilenodiaminotetracético','ethylenediaminetetraacetic acid','c10h16n2o8'] },
    { cas:'6381-92-6', name:'EDTA Dissódico', formula:'C₁₀H₁₄N₂Na₂O₈', aliases:['edta dissodico','edta dissódico','disodium edta','na2edta'] },
    { cas:'57-13-6', name:'Ureia', formula:'CH₄N₂O', aliases:['ureia','urea','carbamida','ch4n2o'] },
    { cas:'56-40-6', name:'Glicina', formula:'C₂H₅NO₂', aliases:['glicina','glycine','aminoacido glicina','c2h5no2'] },
    { cas:'57-50-1', name:'Sacarose', formula:'C₁₂H₂₂O₁₁', aliases:['sacarose','sucrose','acucar','açúcar','c12h22o11'] },
    { cas:'50-99-7', name:'Glicose', formula:'C₆H₁₂O₆', aliases:['glicose','glucose','dextrose','c6h12o6'] },
    { cas:'57-48-7', name:'Frutose', formula:'C₆H₁₂O₆', aliases:['frutose','fructose','levulose','c6h12o6'] },
    { cas:'9005-25-8', name:'Amido', formula:'(C₆H₁₀O₅)n', aliases:['amido','starch','fecula','fécula'] },
    { cas:'9000-11-7', name:'Carboximetilcelulose', formula:'CMC', aliases:['carboximetilcelulose','cmc','carboxymethylcellulose'] },
    { cas:'9000-30-0', name:'Goma Guar', formula:'-', aliases:['goma guar','guar gum','guarana gum'] },
    { cas:'7783-20-2', name:'Sulfato de Amônio', formula:'(NH₄)₂SO₄', aliases:['sulfato de amonio','sulfato de amônio','ammonium sulfate','(nh4)2so4'] },
    { cas:'12125-02-9', name:'Cloreto de Amônio', formula:'NH₄Cl', aliases:['cloreto de amonio','cloreto de amônio','ammonium chloride','sal amoniaco','sal amoníaco','nh4cl'] },
    { cas:'10045-89-3', name:'Sulfato Ferroso de Amônio', formula:'(NH₄)₂Fe(SO₄)₂', aliases:['sulfato ferroso de amonio','sulfato ferroso de amônio','sal de mohr','sal de möhr','ammonium iron sulfate'] },

    // Compostos de ferro
    { cas:'7720-78-7', name:'Sulfato Ferroso', formula:'FeSO₄', aliases:['sulfato ferroso','ferrous sulfate','sulfato de ferro ii','feso4','vitriolo verde'] },
    { cas:'10028-22-5', name:'Sulfato Férrico', formula:'Fe₂(SO₄)₃', aliases:['sulfato ferrico','sulfato férrico','ferric sulfate','sulfato de ferro iii','fe2(so4)3'] },
    { cas:'7705-08-0', name:'Cloreto Férrico', formula:'FeCl₃', aliases:['cloreto ferrico','cloreto férrico','ferric chloride','cloreto de ferro iii','fecl3'] },
    { cas:'7758-94-3', name:'Cloreto Ferroso', formula:'FeCl₂', aliases:['cloreto ferroso','ferrous chloride','cloreto de ferro ii','fecl2'] },
    { cas:'1309-37-1', name:'Óxido de Ferro III', formula:'Fe₂O₃', aliases:['oxido de ferro','óxido de ferro','iron oxide','ferrugem','hematita','fe2o3'] },
    { cas:'1317-61-9', name:'Óxido de Ferro II,III', formula:'Fe₃O₄', aliases:['magnetita','magnetite','oxido de ferro magnetico','óxido de ferro magnético','fe3o4'] },

    // Compostos de alumínio e cálcio
    { cas:'7784-18-1', name:'Fluoreto de Alumínio', formula:'AlF₃', aliases:['fluoreto de aluminio','fluoreto de alumínio','aluminum fluoride','alf3'] },
    { cas:'7429-90-5', name:'Alumínio', formula:'Al', aliases:['aluminio','alumínio','aluminum','al'] },
    { cas:'7446-70-0', name:'Cloreto de Alumínio', formula:'AlCl₃', aliases:['cloreto de aluminio','cloreto de alumínio','aluminum chloride','alcl3'] },
    { cas:'10043-01-3', name:'Sulfato de Alumínio', formula:'Al₂(SO₄)₃', aliases:['sulfato de aluminio','sulfato de alumínio','aluminum sulfate','al2(so4)3','alumem'] },
    { cas:'7789-78-8', name:'Hidreto de Cálcio', formula:'CaH₂', aliases:['hidreto de calcio','hidreto de cálcio','calcium hydride','cah2'] },
    { cas:'1305-62-0', name:'Hidróxido de Cálcio', formula:'Ca(OH)₂', aliases:['hidroxido de calcio','hidróxido de cálcio','calcium hydroxide','cal hidratada','ca(oh)2'] },
    { cas:'1317-65-3', name:'Carbonato de Cálcio', formula:'CaCO₃', aliases:['carbonato de calcio','carbonato de cálcio','calcium carbonate','calcario','calcário','marmore','mármore','caco3'] },
    { cas:'1592-23-0', name:'Estearato de Cálcio', formula:'Ca(C₁₇H₃₅COO)₂', aliases:['estearato de calcio','estearato de cálcio','calcium stearate'] },

    // Nitratos
    { cas:'6484-52-2', name:'Nitrato de Amônio', formula:'NH₄NO₃', aliases:['nitrato de amonio','nitrato de amônio','ammonium nitrate','nh4no3'] },
    { cas:'7757-79-1', name:'Nitrato de Potássio', formula:'KNO₃', aliases:['nitrato de potassio','nitrato de potássio','potassium nitrate','salitre','saltpeter','kno3'] },
    { cas:'7631-99-4', name:'Nitrato de Sódio', formula:'NaNO₃', aliases:['nitrato de sodio','nitrato de sódio','sodium nitrate','niter','nano3'] },
    { cas:'10124-37-5', name:'Nitrato de Cálcio', formula:'Ca(NO₃)₂', aliases:['nitrato de calcio','nitrato de cálcio','calcium nitrate','ca(no3)2'] },

    // Outros reagentes comuns
    { cas:'7558-80-7', name:'Fosfato Monossódico', formula:'NaH₂PO₄', aliases:['fosfato monossodico','fosfato monossódico','monosodium phosphate','nah2po4'] },
    { cas:'7758-02-3', name:'Brometo de Potássio', formula:'KBr', aliases:['brometo de potassio','brometo de potássio','potassium bromide','kbr'] },
    { cas:'7789-23-3', name:'Fluoreto de Potássio', formula:'KF', aliases:['fluoreto de potassio','fluoreto de potássio','potassium fluoride','kf'] },
    { cas:'7681-49-4', name:'Fluoreto de Sódio', formula:'NaF', aliases:['fluoreto de sodio','fluoreto de sódio','sodium fluoride','naf'] },
    { cas:'7784-46-5', name:'Arsenito de Sódio', formula:'NaAsO₂', aliases:['arsenito de sodio','arsenito de sódio','meta-arsenito de sodio','meta-arsenito de sódio','sodium arsenite','nasao2'] },
    { cas:'10022-31-8', name:'Nitrato de Bário', formula:'Ba(NO₃)₂', aliases:['nitrato de bario','nitrato de bário','barium nitrate'] },
    { cas:'513-77-9', name:'Carbonato de Bário', formula:'BaCO₃', aliases:['carbonato de bario','carbonato de bário','barium carbonate','baco3'] },
    { cas:'7727-43-7', name:'Sulfato de Bário', formula:'BaSO₄', aliases:['sulfato de bario','sulfato de bário','barium sulfate','baso4'] },
    { cas:'10361-37-2', name:'Cloreto de Bário', formula:'BaCl₂', aliases:['cloreto de bario','cloreto de bário','barium chloride','bacl2'] },
    { cas:'68-11-1', name:'Ácido Tioglicólico', formula:'HSCH₂COOH', aliases:['acido tioglicolico','ácido tioglicólico','thioglycolic acid'] },
    { cas:'79-06-1', name:'Acrilamida', formula:'C₃H₅NO', aliases:['acrilamida','acrylamide','c3h5no'] },
    { cas:'9003-05-8', name:'Poliacrilamida', formula:'(C₃H₅NO)n', aliases:['poliacrilamida','polyacrylamide','paa'] },
    { cas:'7631-86-9', name:'Sílica Gel', formula:'SiO₂', aliases:['silica gel','silica','dioxido de silicio','dióxido de silício','sio2'] },
    { cas:'1344-28-1', name:'Óxido de Alumínio', formula:'Al₂O₃', aliases:['oxido de aluminio','óxido de alumínio','alumina','aluminum oxide','al2o3'] },
    { cas:'1332-37-2', name:'Óxido de Ferro', formula:'FeO·Fe₂O₃', aliases:['oxido de ferro misturado','iron oxide mixed'] },
    { cas:'7440-74-6', name:'Índio', formula:'In', aliases:['indio','índio','indium','in'] },
    { cas:'7446-09-5', name:'Dióxido de Enxofre', formula:'SO₂', aliases:['dioxido de enxofre','dióxido de enxofre','sulfur dioxide','so2','anidride sulfurosa'] },
    { cas:'7446-11-9', name:'Trióxido de Enxofre', formula:'SO₃', aliases:['trioxido de enxofre','trióxido de enxofre','sulfur trioxide','so3'] },
    { cas:'7782-77-6', name:'Ácido Nitroso', formula:'HNO₂', aliases:['acido nitroso','ácido nitroso','nitrous acid','hno2'] },
    { cas:'630-08-0', name:'Monóxido de Carbono', formula:'CO', aliases:['monoxido de carbono','monóxido de carbono','carbon monoxide','co'] },
    { cas:'124-38-9', name:'Dióxido de Carbono', formula:'CO₂', aliases:['dioxido de carbono','dióxido de carbono','carbon dioxide','co2','gelo seco','gas carbonico','gás carbônico'] },
    { cas:'74-82-8', name:'Metano', formula:'CH₄', aliases:['metano','methane','gas natural','gás natural','ch4'] },
    { cas:'74-84-0', name:'Etano', formula:'C₂H₆', aliases:['etano','ethane','c2h6'] },
    { cas:'74-98-6', name:'Propano', formula:'C₃H₈', aliases:['propano','propane','gas lp','c3h8'] },
    { cas:'106-97-8', name:'Butano', formula:'C₄H₁₀', aliases:['butano','butane','c4h10'] },
    { cas:'74-85-1', name:'Etileno', formula:'C₂H₄', aliases:['etileno','ethylene','eteno','c2h4'] },
    { cas:'115-07-1', name:'Propileno', formula:'C₃H₆', aliases:['propileno','propylene','propeno','c3h6'] },
    { cas:'50-00-0', name:'Formaldeído', formula:'CH₂O', aliases:['formaldeido','formaldeído','formaldehyde','formol','metanal','ch2o'] },
    { cas:'75-07-0', name:'Acetaldeído', formula:'CH₃CHO', aliases:['acetaldeido','acetaldeído','acetaldehyde','etanal','ch3cho'] },
    { cas:'110-43-0', name:'Heptanona', formula:'C₇H₁₄O', aliases:['heptanona','heptanone','metil-n-amil-cetona','c7h14o'] },
    { cas:'98-86-2', name:'Acetofenona', formula:'C₈H₈O', aliases:['acetofenona','acetophenone','c8h8o'] },
    { cas:'108-94-1', name:'Ciclohexanona', formula:'C₆H₁₀O', aliases:['ciclohexanona','cyclohexanone','c6h10o'] },
    { cas:'110-82-7', name:'Ciclohexano', aliases:['ciclohexano','cyclohexane','c6h12'], formula:'C₆H₁₂' },
    { cas:'103-65-1', name:'n-Propilbenzeno', formula:'C₉H₁₂', aliases:['propilbenzeno','propylbenzene','c9h12'] },
    { cas:'91-20-3', name:'Naftaleno', formula:'C₁₀H₈', aliases:['naftaleno','naphthalene','naftalina','c10h8'] },
    { cas:'95-47-6', name:'o-Xileno', formula:'C₈H₁₀', aliases:['o-xileno','ortho-xylene','1,2-dimetilbenzeno','c8h10'] },
    { cas:'100-41-4', name:'Etilbenzeno', formula:'C₈H₁₀', aliases:['etilbenzeno','ethylbenzene','c8h10'] },
    { cas:'100-42-5', name:'Estireno', formula:'C₈H₈', aliases:['estireno','styrene','vinilbenzeno','c8h8'] },
    { cas:'108-95-2', name:'Fenol', formula:'C₆H₅OH', aliases:['fenol','phenol','acido fenico','ácido fênico','c6h5oh'] },
    { cas:'90-05-1', name:'Guaiacol', formula:'C₇H₈O₂', aliases:['guaiacol','2-metoxifenol','methoxyphenol','c7h8o2'] },
    { cas:'120-80-9', name:'Catecol', formula:'C₆H₆O₂', aliases:['catecol','catechol','1,2-dihidroxibenzeno','c6h6o2'] },
    { cas:'123-31-9', name:'Hidroquinona', formula:'C₆H₆O₂', aliases:['hidroquinona','hydroquinone','quinol','1,4-dihidroxibenzeno','c6h6o2'] },
    { cas:'110-86-1', name:'Piridina', formula:'C₅H₅N', aliases:['piridina','pyridine','c5h5n'] },
    { cas:'110-89-4', name:'Piperidina', formula:'C₅H₁₁N', aliases:['piperidina','piperidine','c5h11n'] },
    { cas:'75-50-3', name:'Trimetilamina', formula:'(CH₃)₃N', aliases:['trimetilamina','trimethylamine','(ch3)3n'] },
    { cas:'121-44-8', name:'Trietilamina', formula:'(C₂H₅)₃N', aliases:['trietilamina','triethylamine','(c2h5)3n','tea'] },
    { cas:'100-61-8', name:'N-Metilanilina', formula:'C₇H₉N', aliases:['n-metilanilina','n-methylaniline','c7h9n'] },
    { cas:'62-53-3', name:'Anilina', formula:'C₆H₅NH₂', aliases:['anilina','aniline','aminobenzeno','c6h5nh2'] },
    { cas:'95-53-4', name:'O-Toluidina', formula:'C₇H₉N', aliases:['o-toluidina','o-toluidine','2-metilanilina','ortho-toluidine','c7h9n'] },
    { cas:'106-49-0', name:'p-Toluidina', formula:'C₇H₉N', aliases:['p-toluidina','p-toluidine','4-metilanilina','para-toluidine','c7h9n'] },
    { cas:'8001-54-5', name:'Cloreto de Benzalcônio', formula:'-', aliases:['cloreto de benzalconio','cloreto de benzalcônio','benzalkonium chloride','bac'] },
    { cas:'7440-48-4', name:'Cobalto', formula:'Co', aliases:['cobalto','cobalt','co'] },
    { cas:'7791-13-1', name:'Cloreto de Cobalto II', formula:'CoCl₂', aliases:['cloreto de cobalto','cobalt chloride','cocl2'] },
    { cas:'10026-24-1', name:'Sulfato de Cobalto II', formula:'CoSO₄', aliases:['sulfato de cobalto','cobalt sulfate','coso4'] },
    { cas:'7440-31-5', name:'Estanho', formula:'Sn', aliases:['estanho','tin','sn'] },
    { cas:'7772-99-8', name:'Cloreto Estanhoso', formula:'SnCl₂', aliases:['cloreto estanhoso','cloreto de estanho ii','stannous chloride','tin chloride','sncl2'] },
    { cas:'7440-67-7', name:'Zircônio', formula:'Zr', aliases:['zirconio','zircônio','zirconium','zr'] },
    { cas:'7699-43-6', name:'Oxicloreto de Zircônio', formula:'ZrOCl₂', aliases:['oxicloreto de zirconio','oxicloreto de zircônio','zirconyl chloride','zrocl2'] },
    { cas:'7440-36-0', name:'Antimônio', formula:'Sb', aliases:['antimonio','antimônio','antimony','sb'] },
    { cas:'10025-91-9', name:'Tricloreto de Antimônio', formula:'SbCl₃', aliases:['tricloreto de antimonio','tricloreto de antimônio','antimony trichloride','sbcl3'] },
    { cas:'7440-33-7', name:'Tungstênio', formula:'W', aliases:['tungstenio','tungstênio','wolfram','tungsten','w'] },
    { cas:'10213-10-2', name:'Tungstato de Sódio', formula:'Na₂WO₄', aliases:['tungstato de sodio','tungstato de sódio','sodium tungstate','na2wo4'] },
    { cas:'7440-55-3', name:'Gálio', formula:'Ga', aliases:['galio','gálio','gallium','ga'] },
    { cas:'7440-56-4', name:'Germânio', formula:'Ge', aliases:['germanio','germânio','germanium','ge'] },
    { cas:'7440-61-1', name:'Urânio', formula:'U', aliases:['uranio','urânio','uranium','u'] },
    { cas:'7440-69-9', name:'Bismuto', formula:'Bi', aliases:['bismuto','bismuth','bi'] },
    { cas:'7440-70-2', name:'Cálcio', formula:'Ca', aliases:['calcio','cálcio','calcium','ca'] },
    { cas:'7439-95-4', name:'Magnésio', formula:'Mg', aliases:['magnesio','magnésio','magnesium','mg'] },
    { cas:'7439-93-2', name:'Lítio', formula:'Li', aliases:['litio','lítio','lithium','li'] },
    { cas:'7440-28-0', name:'Tálio', formula:'Tl', aliases:['talio','tálio','thallium','tl'] },
    { cas:'7440-62-2', name:'Vanádio', formula:'V', aliases:['vanadio','vanádio','vanadium','v'] },
    { cas:'7439-96-5', name:'Manganês', formula:'Mn', aliases:['manganes','manganês','manganese','mn'] },
    { cas:'7440-25-7', name:'Tântalo', formula:'Ta', aliases:['tantalo','tântalo','tantalum','ta'] },
    { cas:'7440-16-6', name:'Ródio', formula:'Rh', aliases:['rodio','ródio','rhodium','rh'] },
    { cas:'7440-05-3', name:'Paládio', formula:'Pd', aliases:['paladio','paládio','palladium','pd'] },
    { cas:'7440-06-4', name:'Platina', formula:'Pt', aliases:['platina','platinum','pt'] },
    { cas:'7440-26-8', name:'Promécio', formula:'Pm', aliases:['promecio','promécio','promethium','pm'] },
    { cas:'7440-65-5', name:'Ítrio', formula:'Y', aliases:['itrio','ítrio','yttrium','y'] },
    { cas:'7440-64-4', name:'Itérbio', formula:'Yb', aliases:['iterbio','itérbio','ytterbium','yb'] },
    { cas:'7439-90-9', name:'Criptônio', formula:'Kr', aliases:['criptonio','criptônio','krypton','kr'] },
    { cas:'7440-01-9', name:'Neônio', formula:'Ne', aliases:['neonio','neônio','neon','ne'] },
    { cas:'7440-63-3', name:'Xenônio', formula:'Xe', aliases:['xenonio','xenônio','xenon','xe'] },
    { cas:'7782-41-4', name:'Flúor', formula:'F₂', aliases:['fluor','flúor','fluorine','f2'] },
    { cas:'7553-56-2', name:'Iodo', formula:'I₂', aliases:['iodo','iodine','i2'] },

    // Reagentes tiossulfato e outros analíticos
    { cas:'10102-17-7', name:'Tiossulfato de Sódio', formula:'Na₂S₂O₃', aliases:['tiossulfato de sodio','tiossulfato de sódio','sodium thiosulfate','na2s2o3','hipossulfito de sodio'] },
    { cas:'6834-92-0', name:'Metassilicato de Sódio', formula:'Na₂SiO₃', aliases:['metassilicato de sodio','metassilicato de sódio','sodium metasilicate','silicato de sodio','vidro solúvel','na2sio3'] },
    { cas:'10102-44-0', name:'Dióxido de Nitrogênio', formula:'NO₂', aliases:['dioxido de nitrogenio','dióxido de nitrogênio','nitrogen dioxide','no2'] },
    { cas:'10024-97-2', name:'Óxido Nitroso', formula:'N₂O', aliases:['oxido nitroso','óxido nitroso','nitrous oxide','gas hilariante','gás hilariante','n2o'] },
    { cas:'137-16-6', name:'Sarcosinato de Laurila', formula:'-', aliases:['sarcosinato de laurila','sodium lauroyl sarcosinate','lauril sarcosina'] },
    { cas:'151-21-3', name:'Lauril Sulfato de Sódio', formula:'C₁₂H₂₅SO₄Na', aliases:['lauril sulfato de sodio','lauril sulfato de sódio','sls','sds','sodium lauryl sulfate','sodium dodecyl sulfate'] },
    { cas:'9004-81-3', name:'Polietileno Glicol', formula:'HO(CH₂CH₂O)nH', aliases:['polietileno glicol','peg','polyethylene glycol','polietilenoglicol'] },
    { cas:'57-55-6', name:'Propilenoglicol', formula:'C₃H₈O₂', aliases:['propilenoglicol','propylene glycol','1,2-propanediol','c3h8o2'] },
    { cas:'56-81-5', name:'Glicerol', formula:'C₃H₈O₃', aliases:['glicerol','glycerol','glicerina','glycerin','c3h8o3'] },
    { cas:'107-21-1', name:'Etilenoglicol', formula:'C₂H₆O₂', aliases:['etilenoglicol','ethylene glycol','1,2-etanodiol','anticongelante','c2h6o2'] },
    { cas:'9016-45-9', name:'Nonilfenol Etoxilado', formula:'-', aliases:['nonilfenol etoxilado','nonylphenol ethoxylate','np9','npe'] },
    { cas:'577-11-7', name:'Docusato de Sódio', formula:'C₂₀H₃₇NaO₇S', aliases:['docusato de sodio','docusato de sódio','dioctyl sulfosuccinate','aot','aerosol-ot'] },
    { cas:'25322-68-3', name:'Polietilenoglicol 400', formula:'-', aliases:['peg 400','polietilenoglicol 400','polyethylene glycol 400'] },
    { cas:'7783-40-6', name:'Fluoreto de Magnésio', formula:'MgF₂', aliases:['fluoreto de magnesio','fluoreto de magnésio','magnesium fluoride','mgf2'] },
    { cas:'10043-35-3', name:'Ácido Bórico', formula:'H₃BO₃', aliases:['acido borico','ácido bórico','boric acid','h3bo3'] },
    { cas:'1303-96-4', name:'Tetraborato de Sódio', formula:'Na₂B₄O₇', aliases:['tetraborato de sodio','tetraborato de sódio','borax','bórax','sodium tetraborate','na2b4o7'] },
    { cas:'7758-11-4', name:'Fosfato Dipotássico', formula:'K₂HPO₄', aliases:['fosfato dibasico de potassio','fosfato dipotassico','fosfato dipotássico','dipotassium phosphate','k2hpo4'] },

    // ===== REAGENTES DO INVENTÁRIO DO LABORATÓRIO =====
    { cas:'141-78-6', name:'Acetato de Etila', formula:'C₄H₈O₂', aliases:['acetato de etila','ethyl acetate','c4h8o2'] },
    { cas:'127-09-3', name:'Acetato de Sódio Anidro', formula:'CH₃COONa', aliases:['acetato de sodio anidro','acetato de sódio anidro','sodium acetate anhydrous','ch3coona'] },
    { cas:'67-64-1', name:'Acetona P.A.', formula:'C₃H₆O', aliases:['acetona pa','propanona','2-propanona'] },
    { cas:'116-63-2', name:'Ácido 1-Amino-2-Naftol-4-Sulfônico', formula:'C₁₀H₉NO₄S', aliases:['acido 1-amino-2-naftol-4-sulfonico','ácido 1-amino-2-naftol-4-sulfônico','1-amino-2-naphthol-4-sulfonic acid','c10h9no4s'] },
    { cas:'64-19-7', name:'Ácido Acético', formula:'CH₃COOH', aliases:['acido acetico','ácido acético','acetic acid','ch3cooh'] },
    { cas:'64-19-7', name:'Ácido Acético Glacial', formula:'CH₃COOH', aliases:['acido acetico glacial','ácido acético glacial','glacial acetic acid'] },
    { cas:'50-81-7', name:'Ácido Ascórbico', formula:'C₆H₈O₆', aliases:['acido ascorbico','ácido ascórbico','ascorbic acid','vitamina c','c6h8o6'] },
    { cas:'10043-35-3', name:'Ácido Bórico P.A.', formula:'H₃BO₃', aliases:['acido borico pa','ácido bórico pa','boric acid','h3bo3'] },
    { cas:'65-85-0', name:'Ácido Benzóico', formula:'C₇H₆O₂', aliases:['acido benzoico','ácido benzóico','benzoic acid','c7h6o2'] },
    { cas:'77-92-9', name:'Ácido Cítrico', formula:'C₆H₈O₇', aliases:['acido citrico','ácido cítrico','citric acid','c6h8o7'] },
    { cas:'7664-93-9', name:'Ácido Sulfúrico Concentrado', formula:'H₂SO₄', aliases:['acido sulfurico concentrado','ácido sulfúrico concentrado','h2so4'] },
    { cas:'108-95-2', name:'Ácido Fênico', formula:'C₆H₅OH', aliases:['acido fenico','ácido fênico','fenol','phenol','carbolic acid'] },
    { cas:'64-18-6', name:'Ácido Fórmico', formula:'HCOOH', aliases:['acido formico','ácido fórmico','formic acid','hcooh'] },
    { cas:'7664-38-2', name:'Ácido Fosfórico', formula:'H₃PO₄', aliases:['acido fosforico','ácido fosfórico','phosphoric acid','h3po4'] },
    { cas:'69-72-7', name:'Ácido Salicílico', formula:'C₇H₆O₃', aliases:['acido salicilico','ácido salicílico','salicylic acid','c7h6o3'] },
    { cas:'121-57-3', name:'Ácido Sulfanílico P.A.', formula:'C₆H₇NO₃S', aliases:['acido sulfanilico','ácido sulfanílico','sulfanilic acid','c6h7no3s'] },
    { cas:'7722-84-1', name:'Água Oxigenada / Peróxido de Hidrogênio', formula:'H₂O₂', aliases:['agua oxigenada','água oxigenada','peroxido de hidrogenio','peróxido de hidrogênio','hydrogen peroxide','h2o2'] },
    { cas:'547-58-0', name:'Alaranjado de Metila', formula:'C₁₄H₁₄N₃NaO₃S', aliases:['alaranjado de metila','methyl orange','orange III','c14h14n3nao3s'] },
    { cas:'9005-25-8', name:'Amido Solúvel', formula:'-', aliases:['amido solúvel','amido soluvel','soluble starch','amidon'] },
    { cas:'631-61-8', name:'Amônio Acetato P.A.', formula:'CH₃COONH₄', aliases:['amonio acetato','amônio acetato','ammonium acetate','ch3coonh4'] },
    { cas:'3012-65-5', name:'Amônio Citrato Bibásico', formula:'(NH₄)₂HC₆H₅O₇', aliases:['amonio citrato dibasico','amônio citrato bibásico','diammonium hydrogen citrate'] },
    { cas:'12125-02-9', name:'Cloreto de Amônio', formula:'NH₄Cl', aliases:['amonio cloreto','cloreto de amônio','ammonium chloride','nh4cl'] },
    { cas:'7803-55-6', name:'Amônio Metavanadato', formula:'NH₄VO₃', aliases:['amonio metavanadato','amônio metavanadato','ammonium metavanadate','nh4vo3'] },
    { cas:'13106-76-8', name:'Amônio Molibdato', formula:'(NH₄)₆Mo₇O₂₄', aliases:['amonio molibdato','amônio molibdato','ammonium molybdate'] },
    { cas:'26628-22-8', name:'Azida Sódica', formula:'NaN₃', aliases:['azida sodica','azida sódica','sodium azide','nan3'] },
    { cas:'61-73-4', name:'Azul de Metileno', formula:'C₁₆H₁₈ClN₃S', aliases:['azul de metileno','methylene blue','c16h18cln3s'] },
    { cas:'71-43-2', name:'Benzeno P.A.', formula:'C₆H₆', aliases:['benzeno pa','benzene pa'] },
    { cas:'298-14-6', name:'Bicarbonato de Potássio', formula:'KHCO₃', aliases:['bicarbonato de potassio','bicarbonato de potássio','potassium bicarbonate','khco3'] },
    { cas:'7789-23-3', name:'Fluoreto de Potássio Dihidratado', formula:'KF·2H₂O', aliases:['potassio fluoreto di-hidratado','fluoreto de potassio','potassium fluoride dihydrate','kf'] },
    { cas:'7778-50-9', name:'Bicromato de Potássio', formula:'K₂Cr₂O₇', aliases:['bicromato potassio','bicromato de potassio','potassium dichromate','k2cr2o7','dicromato de potassio'] },
    { cas:'7631-90-5', name:'Bissulfato de Sódio', formula:'NaHSO₄', aliases:['bissulfato de sodio','bissulfato de sódio','sodium bisulfate','nahso4','hidrogenossulfato de sodio'] },
    { cas:'12179-04-3', name:'Borato de Sódio / Bórax Anidro', formula:'Na₂B₄O₇', aliases:['borato de sodio anidro','borax anidro','sodium borate anhydrous','na2b4o7'] },
    { cas:'7758-02-3', name:'Brometo de Potássio', formula:'KBr', aliases:['brometo de potassio','brometo de potássio','potassium bromide','kbr'] },
    { cas:'10043-52-4', name:'Cloreto de Cálcio', formula:'CaCl₂', aliases:['calcio cloreto','cloreto de calcio','cloreto de cálcio','calcium chloride','cacl2'] },
    { cas:'10035-04-8', name:'Cloreto de Cálcio Dihidratado', formula:'CaCl₂·2H₂O', aliases:['calcio cloreto di-hidratado','cloreto de calcio di-hidratado','calcium chloride dihydrate'] },
    { cas:'7757-93-9', name:'Cálcio Hidrogênio Fosfato', formula:'CaHPO₄', aliases:['calcio hidrogenio fosfato','calcium hydrogen phosphate','cahpo4'] },
    { cas:'584-08-7', name:'Carbonato de Potássio Anidro', formula:'K₂CO₃', aliases:['carbonato de potassio anidro','potassium carbonate anhydrous','k2co3'] },
    { cas:'497-19-8', name:'Carbonato de Sódio', formula:'Na₂CO₃', aliases:['carbonato de sodio','carbonato de sódio','soda ash','soda calcio','na2co3'] },
    { cas:'7789-78-8', name:'Hidreto de Cálcio', formula:'CaH₂', aliases:['hidreto de calcio','calcium hydride','cah2'] },
    { cas:'110-82-7', name:'Ciclohexano', formula:'C₆H₁₂', aliases:['ciclohexano','cyclohexane','c6h12'] },
    { cas:'108-94-1', name:'Ciclohexanona', formula:'C₆H₁₀O', aliases:['ciclohexanona','cyclohexanone','c6h10o'] },
    { cas:'3012-65-5', name:'Citrato de Amônio Dibásico', formula:'(NH₄)₂HC₆H₅O₇', aliases:['citrato de amonio dibasico','citrato de amônio dibásico','diammonium citrate'] },
    { cas:'7646-79-9', name:'Cloreto de Cobalto II', formula:'CoCl₂', aliases:['cloreto de cobalto ii','cobalt chloride ii','cocl2'] },
    { cas:'7705-08-0', name:'Cloreto de Ferro III', formula:'FeCl₃', aliases:['cloreto de ferro','iron chloride','cloreto ferrico','fecl3'] },
    { cas:'7786-30-3', name:'Cloreto de Magnésio', formula:'MgCl₂', aliases:['cloreto de magnesio','cloreto de magnésio','magnesium chloride','mgcl2'] },
    { cas:'7487-94-7', name:'Cloreto de Mercúrio II', formula:'HgCl₂', aliases:['cloreto de mercurio','cloreto de mercúrio','mercury chloride','cloreto mercurico','hgcl2'] },
    { cas:'7647-14-5', name:'Cloreto de Sódio', formula:'NaCl', aliases:['cloreto de sodio','cloreto de sódio','sodium chloride','sal','nacl'] },
    { cas:'10025-77-1', name:'Cloreto Estanhoso', formula:'SnCl₂', aliases:['cloreto estanhoso','stannous chloride','sncl2'] },
    { cas:'7778-74-7', name:'Perclorato de Potássio', formula:'KClO₄', aliases:['perclorato de potassio','potassium perchlorate','kclo4'] },
    { cas:'13765-19-0', name:'Cromato de Cálcio', formula:'CaCrO₄', aliases:['cromato de calcio','calcium chromate'] },
    { cas:'7789-00-6', name:'Cromato de Potássio', formula:'K₂CrO₄', aliases:['cromato de potassio','cromato de potássio','potassium chromate','k2cro4'] },
    { cas:'7778-77-0', name:'Di-hidrogenofosfato de Potássio', formula:'KH₂PO₄', aliases:['di-hidrogenofosfato de potassio','monopotassium phosphate','kh2po4'] },
    { cas:'148-18-5', name:'Dietilditiocarbamato de Sódio Tri-hidratado', formula:'C₅H₁₀NNaS₂·3H₂O', aliases:['dietilditiocarbamato de sodio','sodium diethyldithiocarbamate','ddtc','c5h10nnas2'] },
    { cas:'1306-23-6', name:'Dithizon / Ditizona', formula:'C₁₃H₁₂N₄S', aliases:['dithizon','ditizona','dithizone','c13h12n4s'] },
    { cas:'8032-32-4', name:'Éter de Petróleo', formula:'-', aliases:['eter de petroleo','éter de petróleo','petroleum ether','ligroin'] },
    { cas:'5144-89-8', name:'Fenantrolina Monohidratada 1,10', formula:'C₁₂H₈N₂·H₂O', aliases:['fenantrolina monohidratada','1,10-phenanthroline','ortofenantrolina','o-fenantrolina','c12h8n2'] },
    { cas:'77-09-8', name:'Fenolftaleína', formula:'C₂₀H₁₄O₄', aliases:['fenolftaleina','fenolftaleína','phenolphthalein','c20h14o4'] },
    { cas:'7720-78-7', name:'Sulfato Ferroso', formula:'FeSO₄', aliases:['ferro sulfato oso','sulfato ferroso','ferrous sulfate','feso4','sulfato de ferro ii'] },
    { cas:'13746-66-2', name:'Ferrocianeto de Potássio', formula:'K₃[Fe(CN)₆]', aliases:['ferrocianeto de potassio','potassium ferrocyanide','ferricyanide','k3fe(cn)6','ferricianeto'] },
    { cas:'7558-79-4', name:'Fosfato de Sódio Dibásico Anidro', formula:'Na₂HPO₄', aliases:['fosfato de sodio dibasico anidro','disodium phosphate anhydrous','na2hpo4'] },
    { cas:'10039-32-4', name:'Fosfato de Sódio Dibásico Heptahidratado', formula:'Na₂HPO₄·7H₂O', aliases:['fosfato de sodio dibasico pa','disodium phosphate','na2hpo4 7h2o'] },
    { cas:'7758-11-4', name:'Fosfato Dipotássico Anidro', formula:'K₂HPO₄', aliases:['fosfato dipotassico anidro','dipotassium phosphate anhydrous','k2hpo4'] },
    { cas:'7558-80-7', name:'Fosfato Monossódico 1-Hidrato', formula:'NaH₂PO₄·H₂O', aliases:['fosfato monossodico 1-hidrato','monosodium phosphate monohydrate','nah2po4'] },
    { cas:'56-81-5', name:'Glicerina / Glicerol P.A.', formula:'C₃H₈O₃', aliases:['glicerina bi-destilada','glicerol pa','glycerol','glycerin','c3h8o3'] },
    { cas:'16949-65-8', name:'Hidrogenofosfato Dipotássico Tri-Hidratado', formula:'K₂HPO₄·3H₂O', aliases:['hidrogenofosfato dipotassio tri-hidratado','dipotassium phosphate trihydrate','k2hpo4 3h2o'] },
    { cas:'1310-73-2', name:'Hidróxido de Sódio', formula:'NaOH', aliases:['hidroxido de sodio','hidróxido de sódio','sodium hydroxide','naoh','soda caustica'] },
    { cas:'1310-58-3', name:'Hidróxido de Potássio', formula:'KOH', aliases:['hidroxido de potassio','hidróxido de potássio','potassium hydroxide','koh'] },
    { cas:'1305-62-0', name:'Hidróxido de Cálcio', formula:'Ca(OH)₂', aliases:['hidroxido de calcio','hidróxido de cálcio','calcium hydroxide','ca(oh)2'] },
    { cas:'5470-11-1', name:'Hidroxilamina Cloridrato', formula:'NH₂OH·HCl', aliases:['hidroxilamina cloridrato','hydroxylamine hydrochloride','nh2oh hcl'] },
    { cas:'7778-54-3', name:'Hipoclorito de Cálcio', formula:'Ca(ClO)₂', aliases:['hipoclorito de calcio','calcium hypochlorite','ca(clo)2','cal clorada'] },
    { cas:'860-22-0', name:'Indigo Blue / Índigo', formula:'C₁₆H₁₀N₂O₂', aliases:['indigo blue','indigo','indigotine','c16h10n2o2'] },
    { cas:'7774-29-0', name:'Iodeto de Mercúrio II Vermelho', formula:'HgI₂', aliases:['iodeto de mercurio ii','mercuric iodide','hgi2'] },
    { cas:'7553-56-2', name:'Iodo Farmacêutico', formula:'I₂', aliases:['iodo farmaceutico','iodo farmacêutico','iodine','i2'] },
    { cas:'7722-64-7', name:'Permanganato de Potássio', formula:'KMnO₄', aliases:['permanganato de potassio','permanganato de potássio','kalium permanganato','potassium permanganate','kmno4'] },
    { cas:'10043-52-4', name:'Cálcio Cloreto', formula:'CaCl₂', aliases:['calcio cloreto anidro','calcium chloride anhydrous'] },
    { cas:'13453-71-9', name:'Nitrato de Magnésio Hexahidratado', formula:'Mg(NO₃)₂·6H₂O', aliases:['magnésio nitrato hexaidratado','magnesio nitrato','magnesium nitrate hexahydrate','mg(no3)2'] },
    { cas:'7783-36-0', name:'Sulfato de Mercúrio II', formula:'HgSO₄', aliases:['mercurio sulfato ico','sulfato de mercurio ii','mercuric sulfate','hgso4'] },
    { cas:'7784-46-5', name:'Meta-Arsenito de Sódio', formula:'NaAsO₂', aliases:['meta-arsenito de sodio','meta-arsenito de sódio','sodium arsenite','nasao2'] },
    { cas:'67-56-1', name:'Metanol P.A.', formula:'CH₃OH', aliases:['metanol pa','methanol pa'] },
    { cas:'13106-76-8', name:'Molibdato de Amônio', formula:'(NH₄)₆Mo₇O₂₄', aliases:['molibdato de amonio','molibdato de amônio','ammonium molybdate'] },
    { cas:'10102-40-6', name:'Mono-hidrogenofosfato de Di-Sódio 12-Hidrato', formula:'Na₂HPO₄·12H₂O', aliases:['mono-hidrogenofosfato de di-sodio','disodium phosphate 12-hydrate','na2hpo4 12h2o'] },
    { cas:'3051-09-0', name:'Murexida', formula:'C₈H₅N₅O₆·NH₄', aliases:['murexida','murexide','ammonium purpurate'] },
    { cas:'110-54-3', name:'N-Hexano 97%', formula:'C₆H₁₄', aliases:['n-hexano 97','n-hexano 99','hexano pa','hexane','c6h14'] },
    { cas:'68-12-2', name:'N,N-Dimetilformamida', formula:'C₃H₇NO', aliases:['n,n-dimetilformamida','dimetilformamida','dmf','dimethylformamide','c3h7no'] },
    { cas:'7631-99-4', name:'Nitrato de Sódio', formula:'NaNO₃', aliases:['nitrato de sodio','sodium nitrate','nano3'] },
    { cas:'10099-74-8', name:'Nitrato de Chumbo', formula:'Pb(NO₃)₂', aliases:['nitrato de chumbo','lead nitrate','pb(no3)2'] },
    { cas:'13138-45-9', name:'Nitrato de Paládio', formula:'Pd(NO₃)₂', aliases:['nitrato de paladio','nitrato de paládio','palladium nitrate','pd(no3)2'] },
    { cas:'7761-88-8', name:'Nitrato de Prata', formula:'AgNO₃', aliases:['nitrato de prata','silver nitrate','agno3'] },
    { cas:'7632-00-0', name:'Nitrito de Sódio', formula:'NaNO₂', aliases:['nitrito de sodio','nitrito de sódio','sodium nitrite','nano2'] },
    { cas:'13755-29-8', name:'Nitroprussiato de Sódio', formula:'Na₂[Fe(CN)₅NO]·2H₂O', aliases:['nitroprussiato de sodio','nitroprussiato de sódio','sodium nitroprusside','na2fe(cn)5no'] },
    { cas:'95-53-4', name:'O-Toluidina P.A.', formula:'C₇H₉N', aliases:['o-toluidina pa','ortho-toluidine','2-metilanilina','c7h9n'] },
    { cas:'5972-73-6', name:'Oxalato de Amônio', formula:'(NH₄)₂C₂O₄', aliases:['oxalato de amonio','ammonium oxalate','(nh4)2c2o4'] },
    { cas:'62-76-0', name:'Oxalato de Sódio', formula:'Na₂C₂O₄', aliases:['oxalato de sodio','oxalato de sódio','sodium oxalate','na2c2o4'] },
    { cas:'7699-43-6', name:'Oxicloreto de Zircônio IV Octahidratado', formula:'ZrOCl₂·8H₂O', aliases:['oxicloreto de zirconio iv','zirconyl chloride octahydrate','zrocl2 8h2o'] },
    { cas:'1305-78-8', name:'Óxido de Cálcio / Cal Virgem', formula:'CaO', aliases:['oxido de calcio','óxido de cálcio','calcium oxide','cal caustica','cao'] },
    { cas:'21908-53-2', name:'Óxido de Mercúrio II', formula:'HgO', aliases:['oxido de mercurio ii','mercuric oxide','hgo','oxido de mercurio vermelho'] },
    { cas:'10034-85-2', name:'Ácido Periódico', formula:'HIO₄', aliases:['acido periodico','periodic acid','hio4'] },
    { cas:'7727-18-6', name:'Persulfato de Amônio', formula:'(NH₄)₂S₂O₈', aliases:['persulfato de amonio','ammonium persulfate','(nh4)2s2o8'] },
    { cas:'7727-21-1', name:'Persulfato de Potássio', formula:'K₂S₂O₈', aliases:['persulfato de potassio','potassium persulfate','k2s2o8'] },
    { cas:'7783-93-9', name:'Perclorato de Prata', formula:'AgClO₄', aliases:['perclorato de prata','silver perchlorate','agclo4'] },
    { cas:'10102-17-7', name:'Sódio Tiossulfato / Tiossulfato de Sódio', formula:'Na₂S₂O₃', aliases:['sodio tiossulfato','tiossulfato de sodio','sodium thiosulfate','na2s2o3'] },
    { cas:'14808-79-8', name:'Sulfato', formula:'SO₄²⁻', aliases:['sulfato','sulfate','so4'] },
    { cas:'10043-01-3', name:'Sulfato de Alumínio Anidro', formula:'Al₂(SO₄)₃', aliases:['sulfato de aluminio anidro','aluminium sulfate','al2(so4)3','sulfato de aluminio'] },
    { cas:'10043-01-3', name:'Sulfato de Alumínio Cristalino', formula:'Al₂(SO₄)₃', aliases:['sulfato de aluminio cristalino','aluminium sulfate crystalline'] },
    { cas:'7784-24-9', name:'Sulfato de Alumínio e Potássio', formula:'KAl(SO₄)₂', aliases:['sulfato de aluminio potassio','alum','alúmen de potassio','potassium alum','kal(so4)2'] },
    { cas:'7758-98-7', name:'Sulfato de Cobre II', formula:'CuSO₄', aliases:['sulfato de cobre ii','copper sulfate','cuso4'] },
    { cas:'7720-78-7', name:'Sulfato de Ferro II', formula:'FeSO₄', aliases:['sulfato de ferro','ferrous sulfate','sulfato ferroso','feso4'] },
    { cas:'10028-22-5', name:'Sulfato de Ferro III', formula:'Fe₂(SO₄)₃', aliases:['sulfato de ferro iii','ferric sulfate','fe2(so4)3'] },
    { cas:'7487-88-9', name:'Sulfato de Magnésio', formula:'MgSO₄', aliases:['sulfato de magnesio','sulfato de magnésio','magnesium sulfate','mgso4'] },
    { cas:'10034-96-5', name:'Sulfato de Manganês Monohidratado', formula:'MnSO₄·H₂O', aliases:['sulfato de manganes','sulfato de manganês','manganese sulfate','mnso4'] },
    { cas:'10101-97-0', name:'Sulfato de Níquel', formula:'NiSO₄', aliases:['sulfato de niquel','nickel sulfate','niso4'] },
    { cas:'10031-25-1', name:'Sulfato de Mercúrio II', formula:'HgSO₄', aliases:['sulfato de mercurio ii','mercuric sulfate','hgso4'] },
    { cas:'10294-26-5', name:'Sulfato de Prata', formula:'Ag₂SO₄', aliases:['sulfato de prata','silver sulfate','ag2so4'] },
    { cas:'7757-82-6', name:'Sulfato de Sódio', formula:'Na₂SO₄', aliases:['sulfato de sodio','sulfato de sódio','sodium sulfate','na2so4'] },
    { cas:'1313-82-2', name:'Sulfeto de Sódio', formula:'Na₂S', aliases:['sulfeto de sodio','sulfeto de sódio','sodium sulfide','na2s'] },
    { cas:'7757-83-7', name:'Sulfito de Sódio Anidro', formula:'Na₂SO₃', aliases:['sulfito de sodio anidro','sodium sulfite anhydrous','na2so3'] },
    { cas:'21645-51-2', name:'Hidróxido de Alumínio', formula:'Al(OH)₃', aliases:['hidroxido de aluminio','suspensao de hidroxido de aluminio','aluminium hydroxide','al(oh)3'] },
    { cas:'1303-96-4', name:'Tampão Borato / Tetraborato de Sódio', formula:'Na₂B₄O₇·10H₂O', aliases:['tampao borato','tampon borato','sodium tetraborate decahydrate','borax','na2b4o7 10h2o'] },
    { cas:'76-60-8', name:'Verde de Bromocresol', formula:'C₂₁H₁₄Br₄O₅S', aliases:['verde de bromocresol','bromocresol green','bcg','c21h14br4o5s'] },
    { cas:'493-52-7', name:'Vermelho de Metila', formula:'C₁₅H₁₅N₃O₂', aliases:['vermelho de metila','methyl red','c15h15n3o2'] },
    { cas:'1305-99-3', name:'Fosfato de Cálcio Tribásico', formula:'Ca₃(PO₄)₂', aliases:['fosfato de calcio','tricalcium phosphate','ca3(po4)2'] },
    { cas:'5949-29-1', name:'Ácido Cítrico Monohidratado', formula:'C₆H₈O₇·H₂O', aliases:['acido citrico mono','citric acid monohydrate'] },
    { cas:'6132-04-3', name:'Citrato de Sódio Dihidratado', formula:'Na₃C₆H₅O₇·2H₂O', aliases:['sal dissodico','citrato de sodio','sodium citrate','trisodium citrate'] },
    { cas:'7601-90-3', name:'Ácido Perclórico', formula:'HClO₄', aliases:['acido perclorico','perchloric acid','hclo4'] },
    { cas:'10022-70-5', name:'Hipoclorito de Sódio', formula:'NaClO', aliases:['hipoclorito de sodio','sodium hypochlorite','naclo','água sanitária'] },
    { cas:'9000-01-5', name:'Goma Arábica / Acácia', formula:'-', aliases:['goma arabica','acacia gum','arabic gum'] },
    { cas:'7646-93-7', name:'Bissulfato de Potássio', formula:'KHSO₄', aliases:['bissulfato de potassio','potassium bisulfate','khso4'] },
    { cas:'79-33-4', name:'Ácido Láctico', formula:'C₃H₆O₃', aliases:['acido lactico','lactic acid','c3h6o3'] },
    { cas:'7758-99-8', name:'Sulfato de Cobre Pentahidratado', formula:'CuSO₄·5H₂O', aliases:['sulfato de cobre pentahidratado','copper sulfate pentahydrate','vitríolo azul','cuso4 5h2o'] },
    { cas:'7439-97-6', name:'Mercúrio Metálico', formula:'Hg', aliases:['mercurio','mercury','hg'] },
    { cas:'108-88-3', name:'Tolueno P.A.', formula:'C₇H₈', aliases:['tolueno pa','toluene pa'] },
    { cas:'8009-03-8', name:'Vaselina', formula:'-', aliases:['vaselina liquida','vaselina solida','petrolatum','petroleum jelly','vaseline'] },
    { cas:'630-08-0', name:'Monóxido de Carbono', formula:'CO', aliases:['monoxido de carbono','carbon monoxide','co'] },
    { cas:'7487-94-7', name:'Cloreto Mercúrico', formula:'HgCl₂', aliases:['cloreto mercurico','chloreto de mercurio ii','bichloride of mercury','hgcl2'] },
    { cas:'7447-41-8', name:'Cloreto de Lítio', formula:'LiCl', aliases:['cloreto de litio','lithium chloride','licl'] },
    { cas:'7791-13-1', name:'Cloreto de Cobalto II Hexahidratado', formula:'CoCl₂·6H₂O', aliases:['cloreto de cobalto ii hexahidratado','cobalt chloride hexahydrate','cocl2 6h2o'] },
    { cas:'1302-78-9', name:'Bentonita', formula:'-', aliases:['bentonita','bentonite','caulim','caulin','caolin'] },
    { cas:'15571-58-1', name:'Preto de Ericromo T', formula:'C₂₀H₁₂N₃NaO₇S', aliases:['preto de ericromo t','eriochrome black t','ebt','negro de ericromo t','c20h12n3nao7s'] },
    { cas:'5413-75-2', name:'Safranina', formula:'C₂₀H₁₉ClN₄', aliases:['safranina','safranine','safranine o','c20h19cln4'] },
    { cas:'8004-87-3', name:'Reagente de Nessler', formula:'-', aliases:['reagente nessler','nessler reagent'] },
    { cas:'7632-51-1', name:'Tetracloreto de Vanádio', formula:'VCl₄', aliases:['tetracloreto de vanadio','vanadium tetrachloride','vcl4'] },
    { cas:'2609-46-3', name:'Alizarin Sulfonate Natrium', formula:'C₁₄H₇NaO₇S', aliases:['alizarin sulfonate natrium','alizarinsulfonat natrium','alizarin red s sodium','c14h7nao7s'] },
    { cas:'100-02-7', name:'p-Nitrofenol', formula:'C₆H₅NO₃', aliases:['p-nitrofenol','para-nitrophenol','4-nitrophenol','c6h5no3'] },
    { cas:'7773-06-0', name:'Sulfamato de Amônio', formula:'NH₄SO₃NH₂', aliases:['sulfamato de amonio','ammonium sulfamate'] },
    { cas:'63-74-1', name:'Sulfanilamida', formula:'C₆H₈N₂O₂S', aliases:['sulfanilamida','sulfanilamide','fb','c6h8n2o2s'] },
    { cas:'7440-22-4', name:'Prata Metálica', formula:'Ag', aliases:['prata','silver','ag'] },
    { cas:'10045-94-0', name:'Nitrato de Mercúrio II', formula:'Hg(NO₃)₂', aliases:['nitrato de mercurio','mercuric nitrate','hg(no3)2'] },
    { cas:'151-50-8', name:'Cianeto de Potássio', formula:'KCN', aliases:['potassio cianeto','cianeto de potassio','potassium cyanide','kcn'] },
    { cas:'7681-11-0', name:'Iodeto de Potássio', formula:'KI', aliases:['potassio iodeto','iodeto de potassio','potassium iodide','ki'] },
    { cas:'7758-05-6', name:'Iodato de Potássio', formula:'KIO₃', aliases:['potassio iodato','iodato de potassio','potassium iodate','kio3'] },
    { cas:'7440-44-0', name:'Carbono / Carvão Ativo', formula:'C', aliases:['carbono','carbon','carvao ativo','carvão ativo','activated carbon','c'] },
    { cas:'7439-89-6', name:'Ferro em Pó', formula:'Fe', aliases:['ferro','iron','fe','aluminio','aluminum','al'] },
  ];

  // ===== MATRIX TOOLTIP =====
  const MATRIX_INFO = {
    'Inflamável-Corrosivo': { title:'❌ Inflamável + Corrosivo', body:'Ácidos e bases corrosivas podem atacar recipientes de solventes e liberar vapores inflamáveis, criando risco de incêndio ou explosão.' },
    'Inflamável-Oxidante':  { title:'❌ Inflamável + Oxidante',  body:'Oxidantes como KMnO₄ ou H₂O₂ podem causar ignição espontânea em contato com solventes orgânicos como etanol ou acetona.' },
    'Inflamável-Ácido':     { title:'❌ Inflamável + Ácido',     body:'Ácidos voláteis (HCl, HNO₃) geram vapores que, junto de solventes inflamáveis, formam misturas explosivas.' },
    'Corrosivo-Oxidante':   { title:'❌ Corrosivo + Oxidante',   body:'HNO₃ concentrado é simultaneamente corrosivo e oxidante. Misturar oxidantes com ácidos como HCl libera Cl₂, gás tóxico.' },
    'Corrosivo-Ácido':      { title:'❌ Corrosivo + Ácido',      body:'Bases fortes (NaOH) e ácidos fortes reagem exotermicamente. O calor pode quebrar recipientes e liberar respingos corrosivos.' },
    'Corrosivo-Base':       { title:'❌ Corrosivo + Base',        body:'Ácidos corrosivos e bases fortes são incompatíveis diretos. Reação de neutralização violenta com liberação de calor intenso.' },
    'Oxidante-Ácido':       { title:'❌ Oxidante + Ácido',       body:'Oxidantes sólidos em contato com ácidos podem liberar gases oxidantes (NO₂, Cl₂) e gerar reações descontroladas.' },
    'Oxidante-Base':        { title:'❌ Oxidante + Base',        body:'Peróxidos em meio alcalino se decompõem rapidamente, liberando O₂ e calor. Risco de ignição de materiais próximos.' },
    'Ácido-Base':           { title:'❌ Ácido + Base',           body:'Neutralização exotérmica violenta. HCl + NaOH: liberação rápida de calor pode causar ebulição, respingos e quebra de frascos.' },
    'Inflamável-Inflamável':{ title:'⚠️ Inflamável + Inflamável', body:'Solventes diferentes podem reagir ou ter pontos de fulgor compatíveis. Manter separados por tipo e volumetria. Ventilação obrigatória.' },
    'Corrosivo-Tóxico':     { title:'⚠️ Corrosivo + Tóxico',    body:'Combinação requer cuidado: ácidos podem liberar formas gasosas de compostos tóxicos (ex: HCN de cianetos).' },
    'Oxidante-Tóxico':      { title:'⚠️ Oxidante + Tóxico',     body:'Oxidantes podem oxidar compostos tóxicos gerando subprodutos ainda mais perigosos. Segregar em bandejas separadas.' },
    'Inflamável-Tóxico':    { title:'⚠️ Inflamável + Tóxico',   body:'Vapores de solventes inflamáveis aumentam a dispersão de compostos tóxicos no ar. Usar em áreas ventiladas separadas.' },
    'Ácido-Tóxico':         { title:'⚠️ Ácido + Tóxico',        body:'Ácidos podem converter sais de metais pesados em formas mais solúveis e biodisponíveis. Separar com bandeja de contenção.' },
    'Base-Tóxico':          { title:'⚠️ Base + Tóxico',         body:'Bases fortes podem decompor compostos orgânicos tóxicos em subprodutos desconhecidos. Manter segregados.' },
    'Corrosivo-Inerte':     { title:'⚠️ Corrosivo + Inerte',    body:'Sais inertes podem ser contaminados por vapores corrosivos (HCl, HNO₃). Usar tampas vedadas e separar por bandeja.' },
    'Tóxico-Tóxico':        { title:'⚠️ Tóxico + Tóxico',      body:'Compostos tóxicos diferentes podem reagir entre si. Manter cada classe em local identificado. Acesso restrito e registro obrigatório.' },
    'Ácido-Ácido':          { title:'⚠️ Ácido + Ácido',         body:'Ácidos podem ter incompatibilidades específicas (HNO₃ com HCl = água régia). Verificar FISPQ individual de cada reagente.' },
    'Base-Inflamável':      { title:'⚠️ Base + Inflamável',     body:'Bases fortes como NaOH podem catalisar reações de solventes. Separar por bandeja; nunca no mesmo armário.' },
  };

