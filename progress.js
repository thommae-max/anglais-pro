/* Anglais pro : tableau de bord de progression et objectifs */
(function () {
  'use strict';
  const AP = window.AP, U = AP.UI, E = U.E, I = U.I, A = U.A;
  const Prog = (AP.Prog = {});
  const G = () => AP.S.settings.goals;
  const LET = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  /* ---------- Calculs ---------- */
  const dayN = (d) => AP.S.stats.days[d] || 0;
  function mondayOf(date) { const p = date.split('-').map(Number); const dt = new Date(p[0], p[1] - 1, p[2]); return AP.addDays(date, -((dt.getDay() + 6) % 7)); }
  function diffDays(a, b) { const pa = a.split('-').map(Number), pb = b.split('-').map(Number); return Math.round((new Date(pb[0], pb[1] - 1, pb[2]) - new Date(pa[0], pa[1] - 1, pa[2])) / 86400000); }
  function weekDays() {
    const mon = mondayOf(AP.today());
    return LET.map((l, i) => { const d = AP.addDays(mon, i); return { d: d, l: l, n: dayN(d), today: d === AP.today(), future: d > AP.today() }; });
  }
  function weekCount() { return weekDays().filter((x) => x.n > 0).length; }
  function bestStreak() {
    const ds = Object.keys(AP.S.stats.days).filter((d) => AP.S.stats.days[d] > 0).sort();
    let best = 0, run = 0, prev = null;
    ds.forEach((d) => { run = prev && diffDays(prev, d) === 1 ? run + 1 : 1; if (run > best) best = run; prev = d; });
    return best;
  }
  function acquired() { return AP.totals().known; }
  function acquiredSince(days) {
    const from = AP.addDays(AP.today(), -days); let n = 0;
    Object.keys(AP.S.cards).forEach((id) => { const c = AP.S.cards[id]; if (c.k && c.k > from && AP.BY[id]) n++; });
    return n;
  }
  function toeicLeft() { const g = G(); return g.toeicDate ? diffDays(AP.today(), g.toeicDate) : null; }
  function wordsLeft() { const g = G(); return g.wordsDate ? diffDays(AP.today(), g.wordsDate) : null; }
  const pct = (a, b) => (b ? Math.max(0, Math.min(100, Math.round(a / b * 100))) : 0);
  function fmtDate(d) { const p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }

  function weekDots() {
    return '<div class="wk">' + weekDays().map((x) => '<div class="wd' + (x.n > 0 ? ' on' : '') + (x.today ? ' today' : '') + (x.future ? ' fut' : '') + '"><i></i><span>' + x.l + '</span></div>').join('') + '</div>';
  }

  /* ---------- Résumé pour l'accueil ---------- */
  Prog.summary = function () {
    const g = G();
    const wc = weekCount();
    const acq = acquired();
    const tl = toeicLeft();
    let h = '<button class="tile" style="margin-top:12px" data-act="go" data-to="progress"><div class="tt"><span>Ma semaine</span><span class="pill' + (wc >= g.days ? ' acc' : '') + '">' + wc + ' / ' + g.days + ' jours</span></div>' + weekDots();
    h += '<div class="td" style="margin:10px 0 6px">' + acq + ' / ' + g.words + ' cartes acquises' + (g.wordsDate ? ' avant le ' + fmtDate(g.wordsDate) : '') + '</div>' +
      '<div class="bar"><i class="a" style="width:' + pct(acq, g.words) + '%"></i></div>';
    if (tl !== null) h += '<div class="td" style="margin:8px 0 0">TOEIC ' + g.toeic + ' : ' + (tl > 0 ? 'J-' + tl : tl === 0 ? 'c’est aujourd’hui' : 'échéance passée') + '</div>';
    h += '<div class="td" style="margin:8px 0 0;color:var(--accent);font-weight:600">Voir le détail ›</div></button>';
    return h;
  };

  /* ---------- Page Progrès ---------- */
  function calendar() {
    const mon = mondayOf(AP.today());
    const start = AP.addDays(mon, -28);
    let cells = '';
    for (let i = 0; i < 35; i++) {
      const d = AP.addDays(start, i); const n = dayN(d);
      const lvl = d > AP.today() ? 'f' : n === 0 ? '0' : n < 6 ? '1' : n < 16 ? '2' : '3';
      cells += '<i class="cl l' + lvl + (d === AP.today() ? ' today' : '') + '" title="' + fmtDate(d) + ' : ' + n + '"></i>';
    }
    return '<div class="cal">' + cells + '</div><div class="cl-leg"><span>5 semaines</span><span>plus foncé = plus de cartes</span></div>';
  }

  function quizChart() {
    const qs = AP.S.stats.quizzes.slice(-10);
    if (!qs.length) return '<p class="sub" style="font-size:14px">Aucun quiz pour l’instant. Lancez-en un depuis l’onglet Quiz.</p>';
    const avg = (a) => (a.length ? Math.round(a.reduce((s, x) => s + x.ok / x.n, 0) / a.length * 100) : null);
    const last5 = avg(qs.slice(-5)); const prev5 = qs.length > 5 ? avg(qs.slice(-10, -5)) : null;
    let h = '<div class="bars">' + qs.map((x) => { const p = Math.round(x.ok / x.n * 100); return '<div class="bv"><i style="height:' + Math.max(6, p) + '%" class="' + (p >= 80 ? 'g' : p >= 60 ? 'm' : 'r') + '"></i><span>' + p + '</span></div>'; }).join('') + '</div>';
    h += '<p class="sub" style="font-size:14px;margin-top:8px">Moyenne des 5 derniers : <b style="color:var(--ink)">' + last5 + ' %</b>' + (prev5 !== null ? ' (' + (last5 - prev5 >= 0 ? '+' : '') + (last5 - prev5) + ' points par rapport aux 5 précédents)' : '') + '</p>';
    return h;
  }

  function toeicBlock() {
    const cats = AP.S.toeic.cats; const keys = Object.keys(cats);
    let h = '';
    const sc = AP.S.toeic.scores.slice().sort((a, b) => a.d.localeCompare(b.d));
    const g = G();
    if (sc.length) {
      const last = sc[sc.length - 1];
      h += '<div class="td" style="margin:0 0 6px">Dernier score : <b style="color:var(--ink)">' + last.s + '</b> (' + E(last.t) + ', ' + fmtDate(last.d) + ') · objectif ' + g.toeic + '</div><div class="bar big"><i class="a" style="width:' + pct(last.s - 400, g.toeic - 400) + '%"></i></div>';
      if (sc.length > 1) h += '<div class="td" style="margin:6px 0 0">' + sc.slice(-6).map((x) => x.s).join(' → ') + '</div>';
    } else h += '<div class="td" style="margin:0 0 6px">Point de départ déclaré : ' + g.toeicNow + ' · objectif ' + g.toeic + '. Ajoutez vos scores de tests ci-dessous pour suivre la courbe.</div><div class="bar big"><i class="a" style="width:' + pct(g.toeicNow - 400, g.toeic - 400) + '%"></i></div>';
    h += '<div class="h2" style="margin-top:16px">Entraînement par catégorie</div>';
    if (!keys.length) return h + '<p class="sub" style="font-size:14px">Pas encore d’entraînement TOEIC. Lancez une série depuis l’onglet TOEIC.</p>';
    h += '<div class="list">' + keys.map((k) => ({ k: k, p: pct(cats[k].ok, cats[k].n), n: cats[k].n })).sort((a, b) => a.p - b.p).map((x) => '<div class="set"><div class="l" style="flex:1"><b style="font-size:15px">' + E(x.k) + '</b><span>' + x.n + ' questions</span></div><div style="width:90px"><div class="bar"><i class="' + (x.p >= 80 ? 'a' : 'b') + '" style="width:' + x.p + '%;background:' + (x.p >= 80 ? 'var(--ok)' : x.p >= 60 ? 'var(--mid)' : 'var(--ko)') + '"></i></div></div><span class="pill" style="margin-left:8px;min-width:46px;text-align:center">' + x.p + ' %</span></div>').join('') + '</div>';
    const tw = AP.S.toeic.tests.slice(-3);
    if (tw.length) h += '<p class="sub" style="font-size:14px;margin-top:8px">Mini-tests chronométrés : ' + tw.map((x) => x.ok + '/' + x.n + ' en ' + x.avg + ' s par question').join(' · ') + '</p>';
    return h;
  }

  function weakWords() {
    const rows = Object.keys(AP.S.cards).map((id) => ({ it: AP.BY[id], c: AP.S.cards[id] })).filter((x) => x.it && x.c.ko > 0)
      .sort((a, b) => b.c.ko - a.c.ko || a.c.b - b.c.b).slice(0, 10);
    if (!rows.length) return '<p class="sub" style="font-size:14px">Aucune erreur enregistrée pour l’instant. Les mots que vous ratez apparaîtront ici.</p>';
    return '<div class="list">' + rows.map((x) => '<div class="row"><div class="rt"><b>' + E(x.it.en) + '</b><span>' + E(x.it.fr) + '</span></div><span class="pill" style="margin-top:4px">' + x.c.ko + ' erreur' + (x.c.ko > 1 ? 's' : '') + '</span>' + U.spk(x.it.en, 'sm') + '</div>').join('') + '</div>' +
      '<div style="margin-top:10px"><button class="btn alt" data-act="hardquiz">Les retravailler en quiz</button></div>';
  }

  function weakToeic() {
    const cats = AP.S.toeic.cats;
    const w = Object.keys(cats).filter((k) => cats[k].n >= 3 && cats[k].ok / cats[k].n < 0.75).sort((a, b) => cats[a].ok / cats[a].n - cats[b].ok / cats[b].n).slice(0, 2);
    if (!w.length) return '';
    return '<div class="h2" style="margin-top:16px">Règles TOEIC à retravailler</div><div class="list">' + w.map((k) => '<div class="set"><div class="l" style="flex:1"><b style="font-size:15px">' + E(k) + '</b><span>' + pct(cats[k].ok, cats[k].n) + ' % de réussite</span></div><button class="btn sm alt" data-act="tstart" data-part="p5" data-n="8" data-cat="' + E(k) + '">Travailler</button></div>').join('') + '</div>';
  }

  function goalsBlock() {
    const g = G();
    const sel = (key, list, cur) => '<select data-goal="' + key + '">' + list.map((o) => '<option value="' + o[0] + '"' + (String(cur) === String(o[0]) ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select>';
    const wl = wordsLeft(); const tl = toeicLeft();
    let need = '';
    if (wl !== null && wl > 0) {
      const rest = Math.max(0, g.words - acquired());
      need = '<p class="help">Il reste ' + rest + ' cartes à acquérir en ' + wl + ' jours, soit environ ' + Math.max(0, Math.ceil(rest / wl * 7)) + ' par semaine. Votre rythme sur 14 jours : ' + Math.round(acquiredSince(14) / 2) + ' par semaine.</p>';
    }
    return '<div class="list"><div class="set"><div class="l"><b>Jours de travail par semaine</b></div>' + sel('days', [3, 4, 5, 6, 7].map((n) => [n, n + ' jours']), g.days) + '</div>' +
      '<div class="set"><div class="l"><b>Cartes à acquérir</b></div>' + sel('words', [200, 300, 500, 800, 1000, 1500].map((n) => [n, String(n)]), g.words) + '</div>' +
      '<div class="set"><div class="l"><b>… avant le</b></div><input class="dt" type="date" data-goal="wordsDate" value="' + E(g.wordsDate) + '"></div>' +
      '<div class="set"><div class="l"><b>Score TOEIC visé</b></div>' + sel('toeic', [800, 825, 850, 875, 900].map((n) => [n, String(n)]), g.toeic) + '</div>' +
      '<div class="set"><div class="l"><b>Score actuel</b><span>Votre dernier score connu</span></div>' + sel('toeicNow', [600, 650, 700, 725, 750, 775, 800, 825].map((n) => [n, String(n)]), g.toeicNow) + '</div>' +
      '<div class="set"><div class="l"><b>Date du TOEIC</b></div><input class="dt" type="date" data-goal="toeicDate" value="' + E(g.toeicDate) + '"></div></div>' + need +
      (tl !== null && tl > 0 ? '<p class="help">Il reste ' + tl + ' jours avant le TOEIC, soit ' + Math.ceil(tl / 7) + ' semaines.</p>' : '');
  }

  function view() {
    const g = G();
    const wc = weekCount(); const days = AP.S.stats.days;
    const total = Object.keys(days).filter((d) => days[d] > 0).length;
    const t = AP.totals();
    let h = '<div class="top"><div class="h1" style="margin:0">Progrès</div><button class="gearbtn" data-act="go" data-to="settings" aria-label="Réglages">' + I.gear + '</button></div>';
    h += '<div class="h2" style="margin-top:6px">Régularité</div><div class="card">' + weekDots() +
      '<div class="td" style="margin:10px 0 0">' + wc + ' jour' + (wc > 1 ? 's' : '') + ' travaillé' + (wc > 1 ? 's' : '') + ' cette semaine sur ' + g.days + ' visés' + (wc >= g.days ? ' : objectif atteint' : '') + '</div>' +
      '<div class="mstats"><div><b>' + AP.streak() + '</b><span>série en cours</span></div><div><b>' + bestStreak() + '</b><span>meilleure série</span></div><div><b>' + total + '</b><span>jours au total</span></div></div>' + calendar() + '</div>';
    h += '<div class="h2">Cartes acquises</div><div class="card"><div style="display:flex;align-items:baseline;gap:8px"><span class="score" style="font-size:40px">' + t.known + '</span><span class="sub">sur ' + t.total + ' · objectif ' + g.words + (g.wordsDate ? ' avant le ' + fmtDate(g.wordsDate) : '') + '</span></div><div class="bar big" style="margin-top:8px"><i class="a" style="width:' + pct(t.known, g.words) + '%"></i></div>';
    AP.THEMES.forEach((th) => { const s = AP.themeStats(th.id); h += '<div class="td" style="margin:12px 0 4px;display:flex;justify-content:space-between"><span>' + E(th.name) + '</span><span>' + s.known + ' / ' + s.total + '</span></div>' + U.bars(s.known, s.learning, s.total); });
    h += '</div>';
    h += '<div class="h2">Résultats aux quiz</div><div class="card">' + quizChart() + '</div>';
    h += '<div class="h2">TOEIC</div><div class="card">' + toeicBlock() + weakToeic() + '</div>';
    h += '<div class="card" style="margin-top:12px"><div class="h2" style="margin:0 0 8px">Ajouter un score de test</div><div class="btnrow"><select class="dt" id="scs">' + [600, 625, 650, 675, 700, 725, 750, 775, 800, 825, 850, 875, 900].map((n) => '<option value="' + n + '"' + (n === g.toeicNow ? ' selected' : '') + '>' + n + '</option>').join('') + '</select><select class="dt" id="sct"><option>Test blanc</option><option>Officiel</option></select></div><button class="btn sm alt" style="margin-top:8px;width:100%" data-act="addscore">Enregistrer ce score</button></div>';
    h += '<div class="h2">Mes points faibles</div><div class="card">' + weakWords() + '</div>';
    h += '<div class="h2">Mes objectifs</div>' + goalsBlock();
    U.mount(h);
  }

  A.addscore = () => {
    const s = Number(document.getElementById('scs').value); const t = document.getElementById('sct').value;
    AP.S.toeic.scores.push({ d: AP.today(), s: s, t: t });
    AP.S.settings.goals.toeicNow = s; AP.save(); U.toast('Score enregistré'); view();
  };
  document.addEventListener('change', (e) => {
    const el = e.target.closest && e.target.closest('[data-goal]');
    if (!el) return;
    const k = el.dataset.goal; const v = el.value;
    G()[k] = (k === 'wordsDate' || k === 'toeicDate') ? v : Number(v);
    AP.save(); U.rerenderNoAnim(); view();
  });

  U.addRoute('progress', 'progress', view);
})();
