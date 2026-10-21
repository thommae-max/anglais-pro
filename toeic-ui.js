/* Anglais pro : entraînement TOEIC (objectif 750 → 850) */
(function () {
  'use strict';
  const AP = window.AP, U = AP.UI, E = U.E, I = U.I, A = U.A;
  const T = window.TOEIC;
  const P5_CATS = Array.from(new Set(T.p5.map((q) => q.cat)));
  let run = null;
  let timer = null;

  function stat(cat) { const c = AP.S.toeic.cats[cat]; return c || { ok: 0, n: 0 }; }
  function record(cat, good) {
    const c = AP.S.toeic.cats[cat] || (AP.S.toeic.cats[cat] = { ok: 0, n: 0 });
    c.n += 1; if (good) c.ok += 1;
    AP.S.stats.days[AP.today()] = (AP.S.stats.days[AP.today()] || 0) + 1;
    AP.save();
  }
  const acc = (c) => (c.n ? Math.round(c.ok / c.n * 100) : null);
  const mmss = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

  /* Choix des questions : les catégories les moins réussies passent en premier */
  function pickP5(n, cat) {
    let pool = T.p5.filter((q) => !cat || q.cat === cat);
    pool = pool.map((q) => { const c = stat(q.cat); const rate = c.n ? c.ok / c.n : 0.5; return { q: q, s: rate + Math.random() * 0.8 }; }).sort((a, b) => a.s - b.s).map((x) => x.q);
    return AP.shuffle(pool.slice(0, n));
  }
  function pickList(list, n) { return AP.shuffle(list).slice(0, n); }

  /* ---------- Tableau de bord ---------- */
  function view() {
    clearInterval(timer);
    const tests = AP.S.toeic.tests.slice(-5).reverse();
    let h = '<div class="h1">TOEIC</div><p class="sub">Objectif : passer de 750 à 850. Chaque séance ci-dessous reprend le format de l’examen, avec explications.</p>';
    h += '<div class="h2">S’entraîner</div>';
    h += '<button class="tile" data-act="tstart" data-part="p5" data-n="10"><div class="tt"><span>Grammaire et vocabulaire (partie 5)</span><span class="pill">10 questions</span></div><div class="td" style="margin:2px 0 0">Phrases à compléter. Les catégories où vous réussissez le moins reviennent en priorité.</div></button>';
    h += '<button class="tile" data-act="tstart" data-part="p2" data-n="10"><div class="tt"><span>Écoute : question et réponse (partie 2)</span><span class="pill">10 questions</span></div><div class="td" style="margin:2px 0 0">Vous entendez une question et trois réponses, sans les voir. Choisissez A, B ou C.</div></button>';
    h += '<button class="tile" data-act="tstart" data-part="p4" data-n="6"><div class="tt"><span>Écoute : annonces (partie 4)</span><span class="pill">6 questions</span></div><div class="td" style="margin:2px 0 0">Une courte annonce, une question. Comprendre l’essentiel du premier coup.</div></button>';
    h += '<button class="tile" data-act="tstart" data-part="timed" data-n="15"><div class="tt"><span>Mini-test chronométré</span><span class="pill acc">15 questions</span></div><div class="td" style="margin:2px 0 0">Partie 5 en conditions réelles : visez 25 secondes par question maximum.</div></button>';
    h += '<div class="h2">Ma progression par catégorie</div><div class="list">';
    P5_CATS.concat(['Question en Wh-', 'Demande et proposition', 'Question oui/non et tags', 'Réponses indirectes', 'Annonces et messages']).forEach((c) => {
      const s = stat(c); const a = acc(s);
      const p5 = P5_CATS.indexOf(c) >= 0;
      h += '<div class="set"' + (p5 ? ' ' : ' ') + '><div class="l" style="flex:1"><b style="font-size:15px">' + E(c) + '</b><span>' + (s.n ? s.ok + ' / ' + s.n + ' réussies' : 'Pas encore essayé') + '</span></div>' +
        (p5 ? '<button class="btn sm alt" data-act="tstart" data-part="p5" data-n="8" data-cat="' + E(c) + '">Travailler</button>' : '') + (a !== null ? '<span class="pill ' + (a >= 80 ? 'acc' : '') + '" style="margin-left:8px">' + a + ' %</span>' : '') + '</div>';
    });
    h += '</div>';
    if (tests.length) h += '<div class="h2">Derniers mini-tests</div><div class="list">' + tests.map((x) => '<div class="set"><div class="l"><b>' + x.ok + ' / ' + x.n + '</b><span>' + E(x.d) + ' · ' + mmss(x.secs) + ' au total, ' + x.avg + ' s par question</span></div><span class="pill ' + (x.avg <= 25 && x.ok / x.n >= .8 ? 'acc' : '') + '">' + Math.round(x.ok / x.n * 100) + ' %</span></div>').join('') + '</div>';
    h += '<div class="h2">Méthode pour gagner 100 points</div><div class="card"><div class="stack" style="font-size:14px">' +
      '<div><b style="display:inline">1. Régularité.</b> 20 minutes par jour, 5 jours par semaine, valent mieux qu’une longue séance le week-end. Le gain dépend de votre point de départ : comptez plusieurs mois et ne visez pas un score garanti.</div>' +
      '<div><b style="display:inline">2. Partie 5 et 6 en priorité.</b> Ce sont les points les plus rapides à gagner : formes des mots, prépositions, connecteurs, temps. Apprenez la règle derrière chaque erreur, pas seulement la réponse.</div>' +
      '<div><b style="display:inline">3. Écoute active.</b> Après chaque audio, réécoutez en lisant puis faites des dictées (quiz, type « Dictée »). Entraînez l’oreille aux accents britanniques et américains en alternant dans Réglages.</div>' +
      '<div><b style="display:inline">4. Lecture chronométrée.</b> En partie 7, repérez d’abord la question, puis cherchez la réponse dans le texte. Lisez chaque jour un article professionnel en anglais.</div>' +
      '<div><b style="display:inline">5. Un vrai test blanc.</b> Toutes les 3 ou 4 semaines, passez un test officiel complet (documents publiés par ETS) pour mesurer votre vrai niveau. Cette app prépare, elle ne remplace pas un test officiel.</div></div></div>';
    U.mount(h);
  }

  /* ---------- Séance ---------- */
  function start(part, n, cat) {
    let list;
    if (part === 'p5') list = pickP5(n, cat);
    else if (part === 'timed') list = pickP5(n);
    else if (part === 'p2') list = pickList(T.p2, n);
    else list = pickList(T.p4, n);
    run = { part: part, list: list.map((q) => Object.assign({}, q)), i: 0, ok: 0, miss: [], start: Date.now(), qstart: Date.now(), times: [], done: false };
    nextQ();
  }
  function prep(q) {
    if (q.opts) return;
    if (q.part === 'p5' || q.part === 'p4') q.opts = AP.shuffle([q.a].concat(q.w));
    else q.opts = AP.shuffle([q.a].concat(q.w));
    q.picked = null; q.answered = false;
  }
  function nextQ() {
    if (run.i >= run.list.length) { run.done = true; return viewEnd(); }
    prep(run.list[run.i]);
    run.qstart = Date.now();
    viewQ();
  }

  function listen(q) {
    if (!AP.hasSpeech) { U.toast('Audio indisponible sur cet appareil'); return; }
    if (q.part === 'p2') AP.speakSeq([q.q, 'A. ' + q.opts[0], 'B. ' + q.opts[1], 'C. ' + q.opts[2]], 900);
    else AP.speakSeq([q.talk], 400);
  }

  function viewQ() {
    clearInterval(timer);
    const q = run.list[run.i];
    const timed = run.part === 'timed';
    let h = '<div class="sbar"><button class="close" data-act="tquit" aria-label="Quitter">' + I.x + '</button><div class="bar"><i style="width:' + (run.i / run.list.length * 100) + '%"></i></div><div class="cnt">' + (run.i + 1) + '/' + run.list.length + '</div></div>';
    h += '<div class="phase"><span class="ph quiz">' + ({ p5: 'Partie 5', p2: 'Partie 2 · écoute', p4: 'Partie 4 · écoute' }[q.part]) + (timed ? ' · <span id="tmr">0:00</span>' : '') + '</span></div><div class="stage">';
    if (q.part === 'p5') {
      h += '<div><div class="qlab">' + E(q.cat) + '</div><div class="flash"><div class="en long" style="font-size:22px;font-weight:600">' + E(q.q).replace('___', '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>') + '</div></div></div>';
    } else if (q.part === 'p2') {
      h += '<div><div class="qlab">Écoutez la question et les trois réponses</div><div class="flash" style="padding:18px"><div class="center" style="margin:0;gap:14px"><button class="spk" style="width:76px;height:76px" data-act="tlisten" aria-label="Écouter">' + I.spk.replace('<svg', '<svg style="width:36px;height:36px"') + '</button></div>' + (q.answered ? '<div class="en long" style="font-size:19px;margin-top:12px">' + E(q.q) + '</div>' : '') + '</div></div>';
    } else {
      h += '<div><div class="qlab">Écoutez l’annonce</div><div class="flash" style="padding:18px"><div class="center" style="margin:0"><button class="spk" style="width:76px;height:76px" data-act="tlisten" aria-label="Écouter">' + I.spk.replace('<svg', '<svg style="width:36px;height:36px"') + '</button></div><div class="fr" style="font-size:18px;margin-top:12px;font-weight:600">' + E(q.q) + '</div>' + (q.answered ? '<div class="ex" style="font-size:14px">' + E(q.talk) + '</div>' : '') + '</div></div>';
    }
    const letters = ['A', 'B', 'C', 'D'];
    h += '<div class="opts' + (q.answered ? ' locked' : '') + '">' + q.opts.map((o, i) => {
      let c = 'opt en';
      if (q.answered) { if (o === q.a) c += ' right'; else if (i === q.picked) c += ' wrong'; else c += ' dim'; }
      const hidden = q.part === 'p2' && !q.answered;
      return '<button class="' + c + '" data-act="tpick" data-i="' + i + '"><b style="font-family:var(--sans);min-width:26px;display:inline-block;color:var(--accent)">' + letters[i] + '</b>' + (hidden ? '<span style="color:var(--muted);font-family:var(--sans);font-weight:500">Réponse ' + letters[i] + '</span>' : E(o)) + '</button>';
    }).join('') + '</div>';
    if (q.answered) {
      const ok = q.opts[q.picked] === q.a;
      h += '<div class="fb ' + (ok ? 'ok' : 'ko') + '"><b>' + (ok ? 'Correct' : 'Incorrect') + '</b><div class="ans">Bonne réponse : <b style="display:inline">' + E(q.a) + '</b></div>' + (q.e ? '<div class="ans" style="font-size:14px;margin-top:6px">' + E(q.e) + '</div>' : '') + '</div>';
    }
    h += '</div><div class="dock">' + (q.answered ? '<button class="btn" data-act="tnext">' + (run.i === run.list.length - 1 ? 'Voir le résultat' : 'Suivant') + '</button>' : (q.part === 'p5' ? '' : '<button class="btn ghost sm" style="align-self:center" data-act="tlisten">Réécouter</button>')) + '</div>';
    U.mount(h, true);
    if (timed && !q.answered) timer = setInterval(() => { const el = document.getElementById('tmr'); if (!el) { clearInterval(timer); return; } el.textContent = mmss(Math.round((Date.now() - run.qstart) / 1000)); }, 500);
    if (!q.answered && q.part !== 'p5') setTimeout(() => listen(q), 300);
  }

  function viewEnd() {
    clearInterval(timer);
    const n = run.list.length;
    const secs = Math.round((Date.now() - run.start) / 1000);
    const avg = Math.round(secs / n);
    if (run.part === 'timed' && !run.saved) {
      run.saved = true;
      AP.S.toeic.tests.push({ d: AP.today(), ok: run.ok, n: n, secs: secs, avg: avg });
      AP.S.toeic.tests = AP.S.toeic.tests.slice(-20);
      AP.save();
    }
    const pct = run.ok / n;
    let h = '<div class="sbar"><span></span></div><div class="stage"><div class="flash"><span class="lab ok">Séance terminée</span><div class="score">' + run.ok + '<small>/' + n + '</small></div>';
    if (run.part === 'timed' || run.part === 'p5') h += '<div class="fr muted" style="margin-top:6px">' + mmss(secs) + ' au total, ' + avg + ' s par question' + (run.part === 'timed' ? (avg <= 25 ? ' : bon rythme' : ' : visez 25 s maximum') : '') + '</div>';
    h += '<div class="fr" style="font-size:17px;margin-top:10px">' + (pct >= .85 ? 'Très solide, continuez.' : pct >= .65 ? 'Bonne base : relisez les explications.' : 'Ces points reviendront en priorité.') + '</div>';
    if (run.miss.length) h += '<div class="missed"><div class="h2" style="margin:8px 0">À retenir</div>' + run.miss.map((q) => '<div class="row"><div class="rt"><b style="font-family:var(--sans);font-size:15px">' + E(q.part === 'p5' ? q.q.replace('___', q.a) : q.part === 'p2' ? q.q + ' → ' + q.a : q.q + ' → ' + q.a) + '</b>' + (q.e ? '<span style="font-size:13px">' + E(q.e) + '</span>' : '') + '</div>' + (q.part === 'p5' ? U.spk(q.q.replace('___', q.a), 'sm') : '') + '</div>').join('') + '</div>';
    h += '</div></div><div class="dock"><button class="btn accent" data-act="tagain">Une autre série</button><button class="btn alt" data-act="tend">Terminer</button></div>';
    U.mount(h, true);
  }

  A.tstart = (el) => start(el.dataset.part, Number(el.dataset.n), el.dataset.cat || null);
  A.tquit = () => { clearInterval(timer); AP.stopSpeech(); run = null; U.nav('#/toeic'); };
  A.tend = () => { run = null; U.nav('#/toeic'); };
  A.tagain = () => { const p = run.part; const n = run.list.length; start(p, n); };
  A.tlisten = () => { listen(run.list[run.i]); };
  A.tnext = () => { run.i += 1; nextQ(); };
  A.tpick = (el) => {
    const q = run.list[run.i]; if (q.answered) return;
    AP.stopSpeech();
    q.picked = Number(el.dataset.i); q.answered = true;
    const good = q.opts[q.picked] === q.a;
    if (good) run.ok += 1; else run.miss.push(q);
    record(q.cat, good);
    U.rerenderNoAnim();
    viewQ();
  };

  U.addRoute('toeic', 'toeic', view);
})();
