/* Anglais pro : lecture TOEIC (partie 7), textes chronométrés */
(function () {
  'use strict';
  const AP = window.AP, U = AP.UI, E = U.E, I = U.I, A = U.A;
  const P = (window.TOEIC && window.TOEIC.p7) || [];
  let run = null, timer = null;
  const mmss = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const L = ['A', 'B', 'C', 'D'];

  function start(n, quiet) {
    const order = AP.shuffle(P).slice(0, n).map((p) => ({ p: p, qs: AP.shuffle(p.qs.slice()).map((q) => Object.assign({}, q, { opts: AP.shuffle([q.a].concat(q.w)), picked: null })) }));
    run = { list: order, i: 0, ok: 0, total: 0, miss: [], t0: Date.now(), pt0: Date.now(), done: false, saved: false };
    order.forEach((x) => { run.total += x.qs.length; });
    if (!quiet) viewText();
  }
  function qHTML(q, qi) {
    const ans = q.picked !== null;
    let h = '<div class="card" id="lq' + qi + '" style="margin-top:12px"><div class="qlab">' + E(q.cat) + '</div><div style="font-weight:600;margin:6px 0 10px">' + (qi + 1) + '. ' + E(q.q) + '</div><div class="opts' + (ans ? ' locked' : '') + '">';
    h += q.opts.map((o, i) => {
      let c = 'opt en';
      if (ans) { if (o === q.a) c += ' right'; else if (i === q.picked) c += ' wrong'; else c += ' dim'; }
      return '<button class="' + c + '" data-act="lpick" data-q="' + qi + '" data-i="' + i + '"><b style="font-family:var(--sans);min-width:26px;display:inline-block;color:var(--accent)">' + L[i] + '</b>' + E(o) + '</button>';
    }).join('') + '</div>';
    if (ans) { const ok = q.opts[q.picked] === q.a; h += '<div class="fb ' + (ok ? 'ok' : 'ko') + '" style="margin-top:10px"><b>' + (ok ? 'Correct' : 'Incorrect') + '</b><div class="ans" style="font-size:14px">' + E(q.e) + '</div></div>'; }
    return h + '</div>';
  }
  function viewText() {
    clearInterval(timer);
    const cur = run.list[run.i];
    run.pt0 = Date.now();
    const target = cur.qs.length * 60;
    let h = '<div class="sbar" style="position:static"><button class="close" data-act="lquit" aria-label="Quitter">' + I.x + '</button><div class="bar"><i style="width:' + (run.i / run.list.length * 100) + '%"></i></div><div class="cnt">' + (run.i + 1) + '/' + run.list.length + '</div></div>';
    h += '<div class="phase" style="margin-top:8px"><span class="ph quiz">Partie 7 · ' + E(cur.p.kind) + ' · <span id="ltm">0:00</span> / ' + mmss(target) + ' conseillé</span></div>';
    h += '<div class="card" style="margin-top:10px"><div class="h2" style="margin:0 0 8px">' + E(cur.p.title) + '</div><div class="en" style="font-family:var(--sans);font-size:15px;font-weight:400;line-height:1.5;white-space:pre-line">' + E(cur.p.text) + '</div></div>';
    h += '<p class="help">Lisez d’abord les questions, puis cherchez chaque réponse dans le texte.</p>';
    h += '<div id="lqs">' + cur.qs.map(qHTML).join('') + '</div>';
    h += '<div style="margin:16px 0 90px" id="lnxt"></div>';
    U.mount(h);
    timer = setInterval(() => { const el = document.getElementById('ltm'); if (!el) { clearInterval(timer); return; } el.textContent = mmss(Math.round((Date.now() - run.pt0) / 1000)); }, 500);
  }
  function viewEnd() {
    clearInterval(timer);
    const secs = Math.round((Date.now() - run.t0) / 1000);
    const per = Math.round(secs / run.total);
    const pct = run.ok / run.total;
    let h = '<div class="sbar"><span></span></div><div class="stage"><div class="flash"><span class="lab ok">Lecture terminée</span><div class="score">' + run.ok + '<small>/' + run.total + '</small></div>' +
      '<div class="fr muted" style="margin-top:6px">' + mmss(secs) + ' au total, ' + per + ' s par question' + (per <= 70 ? ' : bon rythme' : ' : visez environ 60 s') + '</div>' +
      '<div class="fr" style="font-size:17px;margin-top:10px">' + (pct >= .85 ? 'Très solide, continuez.' : pct >= .65 ? 'Bonne base : relisez les explications.' : 'Ces points reviendront en priorité.') + '</div>';
    if (run.miss.length) h += '<div class="missed"><div class="h2" style="margin:8px 0">À retenir</div>' + run.miss.map((q) => '<div class="row"><div class="rt"><b style="font-family:var(--sans);font-size:15px">' + E(q.q) + '</b><span>' + E(q.a) + ' : ' + E(q.e) + '</span></div></div>').join('') + '</div>';
    h += '</div></div><div class="dock"><button class="btn accent" data-act="lagain">Une autre série</button><button class="btn alt" data-act="lend">Terminer</button></div>';
    U.mount(h, true);
  }

  A.lstart = (el) => start(Number(el.dataset.n));
  A.lquit = () => { clearInterval(timer); run = null; U.nav('#/toeic'); };
  A.lend = () => { run = null; U.nav('#/toeic'); };
  A.lagain = () => start(run.list.length);
  A.lpick = (el) => {
    const cur = run.list[run.i]; const qi = Number(el.dataset.q); const q = cur.qs[qi];
    if (q.picked !== null) return;
    q.picked = Number(el.dataset.i);
    const good = q.opts[q.picked] === q.a;
    if (good) run.ok += 1; else run.miss.push(q);
    if (AP.toeicRecord) AP.toeicRecord('Lecture : ' + q.cat.charAt(0).toLowerCase() + q.cat.slice(1), good);
    const box = document.getElementById('lq' + qi);
    if (box) box.outerHTML = qHTML(q, qi);
    if (cur.qs.every((x) => x.picked !== null)) {
      const last = run.i === run.list.length - 1;
      const n = document.getElementById('lnxt');
      if (n) n.innerHTML = '<button class="btn" data-act="lnext">' + (last ? 'Voir le résultat' : 'Texte suivant') + '</button>';
    }
  };
  A.lnext = () => { run.i += 1; if (run.i >= run.list.length) viewEnd(); else { viewText(); window.scrollTo(0, 0); const a = document.getElementById('app'); if (a) a.scrollTop = 0; } };

  U.addRoute('lecture', 'toeic', () => { if (run && !run.done) return viewText(); U.nav('#/toeic'); });
  A.lgo = (el) => { start(Number(el.dataset.n), true); U.nav('#/lecture'); };
})();
