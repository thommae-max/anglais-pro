/* Anglais pro : interface (accueil, session, quiz, référence, réglages) */
(function () {
  'use strict';
  const AP = window.AP;
  const E = AP.esc;
  const app = document.getElementById('app');
  const tabbar = document.getElementById('tabbar');

  /* ---------- Icônes ---------- */
  const I = {
    spk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    slow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 3h6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    flame: '<svg class="flame" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 3.2-1.6 4.9-3 6.8C7.6 10.6 7 12 7 13.5A5 5 0 0 0 12 19a5 5 0 0 0 5-5.5c0-2-1-3.5-2-4.8-.3 1.3-1 2-1.8 2.3C13.6 8 13 4.5 12 2zM12 22c-3.9 0-7-2.7-7-6.5 0-.9.2-1.7.5-2.4.6 1.5 1.5 2.3 2.5 2.7C8 15 9.5 17 12 17s4-1.5 4-3.5c1.2-.4 2-1.2 2.5-2.4.3.7.5 1.5.5 2.4 0 3.8-3.1 6.5-7 6.5z" opacity=".95"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5zM4 5.5v16M8 7h8"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>'
  };

  /* ---------- Outils UI ---------- */
  const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const dateFr = () => { const d = new Date(); const t = DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; return t.charAt(0).toUpperCase() + t.slice(1); };
  const standalone = () => (window.navigator.standalone === true) || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  let toastT;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400);
  }
  const enCls = (s) => 'en' + (s.length > 38 ? ' long' : '');
  const spk = (text, cls) => '<button class="spk ' + (cls || '') + '" data-act="say" data-say="' + E(text) + '" aria-label="Écouter">' + I.spk + '</button>';
  const star = (id) => '<button class="star ' + (AP.isFav(id) ? 'on' : '') + '" data-act="fav" data-id="' + id + '" aria-label="Favori">' + I.star + '</button>';
  function say(text, rate) {
    if (!AP.hasSpeech) { toast('Audio indisponible sur cet appareil'); return; }
    AP.speak(text, rate);
  }

  function setFocus(on) {
    app.classList.toggle('focus', on);
    tabbar.classList.toggle('hide', on);
  }
  let noAnim = false;
  function mount(html, focus) {
    setFocus(!!focus);
    const an = noAnim ? '' : 'fade'; noAnim = false;
    app.innerHTML = '<div class="' + an + '"' + (focus ? ' style="display:flex;flex-direction:column;flex:1"' : '') + '>' + html + '</div>';
    if (!focus && an) window.scrollTo(0, 0);
  }
  const TABS = [['', 'Ma séance', I.home], ['ref', 'Apprendre', I.book], ['quiz', 'S’entraîner', I.quiz], ['toeic', 'TOEIC', I.target], ['progress', 'Mon suivi', I.chart]];
  function buildTabs(active) {
    tabbar.innerHTML = TABS.map((t) => '<a href="#/' + t[0] + '" class="' + (active === t[0] ? 'on' : '') + '">' + t[2] + '<span>' + t[1] + '</span></a>').join('');
  }
  function bars(known, learning, total) {
    return '<div class="bar"><i class="a" style="width:' + (known / total * 100) + '%"></i><i class="b" style="width:' + (learning / total * 100) + '%"></i></div>';
  }

  /* ---------- Routeur ---------- */
  let ses = null;   // session en cours
  let qz = null;    // quiz en cours
  const refState = { q: '', f: 'all', th: 'all', tab: 'search', lim: 60 };
  const qSetup = { scope: 'seen', mode: 'mix', n: 10, practice: false };
  const extra = {};
  function nav(h) { if (location.hash === h) route(); else location.hash = h; }

  function route() {
    AP.stopSpeech();
    const h = (location.hash || '#/').replace(/^#\/?/, '');
    const parts = h.split('/');
    const r = parts[0] || '';
    if (extra[r]) { buildTabs(extra[r].tab); return extra[r].fn(parts); }
    if (r === '') { buildTabs(''); return viewHome(); }
    if (r === 'session') return viewSession();
    if (r === 'quiz') { buildTabs('quiz'); return parts[1] === 'run' ? viewQuizRun() : viewQuizSetup(); }
    if (r === 'ref') { buildTabs('ref'); return viewRef(); }
    if (r === 'fiche') { buildTabs('ref'); return viewFiche(parts[1]); }
    if (r === 'theme') { buildTabs(''); return viewTheme(parts[1]); }
    if (r === 'settings') { buildTabs('settings'); return viewSettings(); }
    buildTabs(''); return viewHome();
  }
  window.addEventListener('hashchange', route);

  /* =====================================================
     ACCUEIL
     ===================================================== */
  function plan(theme, only, strict) {
    const goal = AP.S.settings.goal;
    const due = AP.dueIds(strict ? (theme || null) : null).slice(0, only === 'rev' ? Math.max(goal, 20) : goal);
    let nw = [];
    if (only !== 'rev') nw = AP.newIds(theme || null, Math.max(3, Math.min(8, goal - due.length)));
    return { due: due, nw: nw };
  }

  function viewHome() {
    const th = AP.dayTheme();
    const p = plan(th);
    const dueAll = AP.dueIds().length;
    const goal = AP.S.settings.goal;
    const done = AP.doneToday();
    const pct = Math.min(1, done / goal);
    const C = 2 * Math.PI * 18;
    const tot = AP.totals();
    const streak = AP.streak();
    const hard = AP.ITEMS.filter((i) => AP.isHard(i.id)).length;
    const thObj = th ? AP.TH[th] : null;
    let h = '<div class="top"><div><div class="hello">Bonjour Maëva</div><div class="date">' + dateFr() + '</div></div><button class="gearbtn" data-act="go" data-to="settings" aria-label="Réglages">' + I.gear + '</button></div>';
    h += '<div class="statrow">' +
      '<div class="stat"><svg class="ring" viewBox="0 0 46 46"><circle class="bg" cx="23" cy="23" r="18"/><circle class="fg" cx="23" cy="23" r="18" stroke-dasharray="' + (pct * C).toFixed(1) + ' ' + C.toFixed(1) + '"/></svg><div><b>' + done + '/' + goal + '</b><span>aujourd’hui</span></div></div>' +
      '<div class="stat">' + I.flame + '<div><b>' + streak + '</b><span>' + (streak > 1 ? 'jours d’affilée' : 'jour d’affilée') + '</span></div></div></div>';
    const nothing = !p.due.length && !p.nw.length;
    h += '<div class="hero"><div class="k">Session du jour · 5 à 8 min</div><div class="t">' + (nothing ? 'Tout est à jour' : (thObj ? E(thObj.name) : 'Toutes thématiques')) + '</div>' +
      '<div class="d">' + (nothing ? 'Rien à réviser pour l’instant.' : 'Révision (' + p.due.length + ') · Leçon (' + p.nw.length + ') · Quiz de la leçon') + '</div>' +
      (nothing ? '<button class="btn" data-act="go" data-to="quiz">Faire un quiz</button>' : '<button class="btn" data-act="start" data-th="' + (th || '') + '">' + I.play + (done > 0 ? 'Continuer' : 'Commencer') + '</button>') + '</div>';
    if (done >= goal) h += '<p class="sub" style="margin-top:10px;text-align:center">Objectif du jour atteint, bravo ! Vous pouvez continuer.</p>';
    if (AP.Prog) h += AP.Prog.summary();
    h += '<div class="btnrow" style="margin-top:12px"><button class="btn alt" data-act="revonly"' + (dueAll ? '' : ' disabled') + '>Réviser' + (dueAll ? ' (' + dueAll + ')' : '') + '</button>' +
      '<button class="btn alt" data-act="quickquiz">Quiz éclair</button></div>';
    h += '<div class="btnrow" style="margin-top:10px"><button class="btn alt" data-act="go" data-to="parler">Parler</button>' +
      '<button class="btn alt" data-act="hardquiz"' + (hard ? '' : ' disabled') + '>Mes difficiles' + (hard ? ' (' + hard + ')' : '') + '</button></div>';
    if (!standalone() && !AP.S.settings.bannerHidden) {
      h += '<div class="note" style="margin-top:14px"><button class="x" data-act="hidebanner" aria-label="Fermer">×</button><b>Installer l’app sur l’iPhone</b>Dans Safari : bouton Partager, puis « Sur l’écran d’accueil ». C’est nécessaire pour les rappels.</div>';
    }
    h += '<div class="h2">Mes thèmes</div>';
    AP.THEMES.forEach((t) => {
      const s = AP.themeStats(t.id);
      h += '<button class="tile" data-act="go" data-to="theme/' + t.id + '"><div class="tt"><span>' + E(t.name) + '</span><span>' +
        (t.id === th ? '<span class="pill acc">Aujourd’hui</span> ' : '') + (s.due ? '<span class="pill">' + s.due + ' à revoir</span>' : '') + '</span></div>' +
        '<div class="td">' + E(t.desc) + '</div>' + bars(s.known, s.learning, s.total) +
        '<div class="td" style="margin:6px 0 0">' + s.known + ' connus · ' + s.learning + ' en cours · ' + s.fresh + ' à découvrir</div></button>';
    });
    h += '<p class="sub" style="margin:16px 4px 0;text-align:center;font-size:13px">' + tot.known + ' acquis sur ' + tot.total + ' mots, phrases et expressions.</p>';
    mount(h);
  }

  /* =====================================================
     SESSION : révision, leçon, puis quiz
     ===================================================== */
  const PHASE = { rev: 'Révision', learn: 'Leçon', quiz: 'Quiz de la leçon' };

  function buildSteps(p) {
    const steps = [];
    p.due.forEach((id) => {
      const quizzy = AP.hash(id + AP.today()) % 3 === 0;
      steps.push({ t: quizzy ? 'quiz' : 'review', id: id, phase: 'rev' });
    });
    p.nw.forEach((id) => steps.push({ t: 'learn', id: id, phase: 'learn' }));
    AP.shuffle(p.nw).forEach((id) => steps.push({ t: 'quiz', id: id, phase: 'quiz' }));
    return steps;
  }

  function startSession(theme, only, strict) {
    const p = plan(theme, only, strict);
    const steps = buildSteps(p);
    if (!steps.length) { toast(only === 'rev' ? 'Rien à réviser, bravo !' : 'Rien à faire pour l’instant'); return; }
    ses = { steps: steps, i: 0, ok: 0, ko: 0, missed: [], theme: theme, only: only, strict: !!strict, shown: false, q: null, inter: null, done: false, newIds: p.nw };
    AP.S.stats.sessions += 1; AP.save();
    nav('#/session');
  }

  function stepEn(it) {
    const dir = AP.S.settings.direction;
    return dir === 'en2fr' || (dir === 'mix' && AP.hash(it.id + AP.today()) % 2 === 0);
  }

  function viewSession() {
    if (!ses) { nav('#/'); return; }
    buildTabs('');
    if (ses.done) return sessionEnd();
    if (ses.inter) return sessionInter();
    const st = ses.steps[ses.i];
    const it = AP.BY[st.id];
    const total = ses.steps.length;
    let h = '<div class="sbar"><button class="close" data-act="quit" aria-label="Quitter">' + I.x + '</button><div class="bar"><i style="width:' + (ses.i / total * 100) + '%"></i></div><div class="cnt">' + (ses.i + 1) + '/' + total + '</div></div>';
    h += '<div class="phase"><span class="ph ' + st.phase + '">' + PHASE[st.phase] + (st.retry ? ' · seconde chance' : '') + '</span></div><div class="stage">';
    let dock = '';
    if (st.t === 'learn') {
      h += '<div class="flash"><span class="lab">Nouveau · ' + AP.KIND[it.kind] + '</span><div class="' + enCls(it.en) + '">' + E(it.en) + '</div><div class="center">' + spk(it.en) + '</div><div class="fr">' + E(it.fr) + '</div>' +
        (it.ex ? '<div class="ex">' + E(it.ex) + '<em>' + E(it.exfr || '') + '</em></div>' : '') + '<div class="cat">' + E(it.cat) + '</div></div>';
      dock = '<button class="btn" data-act="learned">Compris, suivant</button>';
    } else if (st.t === 'review') {
      const fromEn = stepEn(it);
      if (!ses.shown) {
        h += '<div class="flash"><span class="lab">À retrouver</span>' + (fromEn ? '<div class="' + enCls(it.en) + '">' + E(it.en) + '</div><div class="center">' + spk(it.en) + '</div>' : '<div class="fr" style="font-size:24px;margin-top:0">' + E(it.fr) + '</div>') +
          '<div class="reveal">' + (fromEn ? 'Que veut dire cette expression ?' : 'Comment le dit-on en anglais ?') + '</div></div>';
        dock = '<button class="btn" data-act="reveal">Voir la réponse</button>';
      } else {
        h += '<div class="flash"><span class="lab">Réponse</span><div class="' + enCls(it.en) + '">' + E(it.en) + '</div><div class="center">' + spk(it.en) + '</div><div class="fr">' + E(it.fr) + '</div>' +
          (it.ex ? '<div class="ex">' + E(it.ex) + '<em>' + E(it.exfr || '') + '</em></div>' : '') + '</div>';
        dock = '<div class="grades">' +
          '<button class="grade ko" data-act="grade" data-r="ko">À revoir<small>' + AP.nextLabel(it.id, 'ko') + '</small></button>' +
          '<button class="grade mid" data-act="grade" data-r="mid">Hésitant<small>' + AP.nextLabel(it.id, 'mid') + '</small></button>' +
          '<button class="grade ok" data-act="grade" data-r="ok">Je savais<small>' + AP.nextLabel(it.id, 'ok') + '</small></button></div>';
      }
    } else {
      if (!ses.q) ses.q = AP.Q.make(st.id, 'mix');
      const r = questionHTML(ses.q);
      h += r.stage; dock = r.dock;
    }
    h += '</div><div class="dock">' + dock + '</div>';
    mount(h, true);
    const s = AP.S.settings;
    if (st.t === 'learn' && s.autoplay) setTimeout(() => AP.speak(it.en), 200);
    if (st.t === 'review' && !ses.shown && s.autoplay && stepEn(it)) setTimeout(() => AP.speak(it.en), 200);
    if (st.t === 'quiz' && ses.q && (ses.q.type === 'listen' || ses.q.type === 'dictee') && !ses.q.answered) setTimeout(() => AP.speak(AP.BY[ses.q.id].en), 250);
  }

  function sessionInter() {
    const k = ses.inter;
    let h = '<div class="sbar"><button class="close" data-act="quit" aria-label="Quitter">' + I.x + '</button><div class="bar"><i style="width:' + (ses.i / ses.steps.length * 100) + '%"></i></div><div class="cnt">' + (ses.i + 1) + '/' + ses.steps.length + '</div></div><div class="stage"><div class="flash">';
    if (k === 'learn') {
      h += '<span class="lab ok">Révision terminée</span><div class="en" style="font-size:24px">Place à la leçon</div><div class="fr muted" style="font-size:17px">' + ses.newIds.length + ' nouvelles cartes à découvrir, écoutez-les et répétez à voix haute.</div>';
    } else {
      h += '<span class="lab ok">Leçon terminée</span><div class="en" style="font-size:24px">Place au quiz</div><div class="fr muted" style="font-size:17px;margin-bottom:6px">Dernier coup d’œil avant le test.</div><div class="missed">' +
        ses.newIds.map((id) => rowHTML(AP.BY[id], { plain: true })).join('') + '</div>';
    }
    h += '</div></div><div class="dock"><button class="btn" data-act="goon">' + (k === 'learn' ? 'Commencer la leçon' : 'Commencer le quiz') + '</button></div>';
    mount(h, true);
  }

  function nextStep() {
    const cur = ses.steps[ses.i];
    ses.i += 1; ses.shown = false; ses.q = null;
    if (ses.i >= ses.steps.length) { ses.done = true; }
    else {
      const nx = ses.steps[ses.i];
      if (nx.phase !== cur.phase && (nx.phase === 'learn' || nx.phase === 'quiz')) ses.inter = nx.phase;
    }
    viewSession();
  }

  function sessionEnd() {
    const tot = ses.ok + ses.ko;
    const t = AP.totals();
    let h = '<div class="sbar"><span></span></div><div class="stage"><div class="flash"><span class="lab ok">Session terminée</span>' +
      (tot ? '<div class="score">' + ses.ok + '<small>/' + tot + '</small></div><div class="fr muted" style="margin-top:6px">bonnes réponses</div>' : '<div class="en">Bravo !</div>') +
      '<div class="fr" style="font-size:17px;margin-top:14px">' + (AP.streak() > 1 ? AP.streak() + ' jours d’affilée. ' : '') + t.known + ' acquis sur ' + t.total + '.</div>';
    if (ses.missed.length) {
      h += '<div class="missed"><div class="h2" style="margin:8px 0">À revoir bientôt</div>' + ses.missed.slice(0, 8).map((id) => rowHTML(AP.BY[id], { plain: true })).join('') + '</div>';
    }
    h += '</div></div><div class="dock"><button class="btn" data-act="more">Continuer avec d’autres cartes</button><button class="btn alt" data-act="finish">Terminer</button></div>';
    mount(h, true);
  }

  /* =====================================================
     QUESTIONS (partagé session / quiz)
     ===================================================== */
  const isInput = (q) => q.type === 'type' || q.type === 'dictee' || q.input;

  function questionHTML(q) {
    const it = AP.BY[q.id];
    let stage = '', dock = '';
    const ans = q.answered;
    const fb = ans ? feedbackHTML(q, it) : '';
    const lvl = '<span class="lvl ' + q.level + '">' + ({ normal: 'Normal', hard: 'Difficile', expert: 'Expert' }[q.level] || '') + '</span>';
    if (q.opts) {
      stage += '<div><div class="qlab">' + E(q.label) + ' ' + lvl + '</div>';
      if (q.type === 'listen') {
        stage += '<div class="flash" style="padding:18px"><div class="center" style="margin:0;gap:14px"><button class="spk" style="width:76px;height:76px" data-act="say" data-say="' + E(it.en) + '" aria-label="Écouter">' + I.spk.replace('<svg', '<svg style="width:36px;height:36px"') + '</button><button class="spk" style="width:76px;height:76px" data-act="sayslow" data-say="' + E(it.en) + '" aria-label="Écouter lentement">' + I.slow.replace('<svg', '<svg style="width:34px;height:34px"') + '</button></div></div>';
      } else if (q.type === 'cloze' || q.type === 'gap') {
        stage += '<div class="flash"><div class="en long" style="font-size:22px">' + E(q.text).replace('\u0000', '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>') + '</div><div class="fr muted" style="font-size:16px">' + E(q.prompt || '') + '</div></div>';
      } else {
        stage += '<div class="flash">' + (q.promptLang === 'en' ? '<div class="' + enCls(q.prompt) + '">' + E(q.prompt) + '</div><div class="center">' + spk(q.prompt) + '</div>' : '<div class="fr" style="font-size:24px;margin-top:0">' + E(q.prompt) + '</div>') + '</div>';
      }
      stage += '</div><div class="opts' + (ans ? ' locked' : '') + '">' + q.opts.map((o) => {
        let c = 'opt ' + (q.optLang === 'en' ? 'en' : '');
        if (ans) { if (o.id === q.correct) c += ' right'; else if (o.id === q.picked) c += ' wrong'; else c += ' dim'; }
        return '<button class="' + c + '" data-act="pick" data-id="' + E(o.id) + '">' + E(o.text) + '</button>';
      }).join('') + '</div>' + fb;
    } else if (isInput(q)) {
      let top;
      if (q.type === 'dictee') top = '<div class="flash" style="padding:18px"><div class="center" style="margin:0;gap:14px"><button class="spk" style="width:76px;height:76px" data-act="say" data-say="' + E(it.en) + '" aria-label="Écouter">' + I.spk.replace('<svg', '<svg style="width:36px;height:36px"') + '</button><button class="spk" style="width:76px;height:76px" data-act="sayslow" data-say="' + E(it.en) + '" aria-label="Écouter lentement">' + I.slow.replace('<svg', '<svg style="width:34px;height:34px"') + '</button></div></div>';
      else if (q.text) top = '<div class="flash"><div class="en long" style="font-size:22px">' + E(q.text).replace('\u0000', '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>') + '</div><div class="fr muted" style="font-size:16px">' + E(q.prompt || '') + '</div></div>';
      else top = '<div class="flash"><div class="fr" style="font-size:24px;margin-top:0">' + E(q.prompt) + '</div></div>';
      stage += '<div><div class="qlab">' + E(q.label) + ' ' + lvl + '</div>' + top + '</div>' +
        '<input class="inp" id="typed" type="text" inputmode="text" enterkeyhint="done" autocapitalize="none" autocorrect="off" spellcheck="false" autocomplete="off" placeholder="Votre réponse en anglais"' + (ans ? ' disabled value="' + E(q.typed) + '"' : '') + '>' + fb;
    } else if (q.type === 'order') {
      q.placed = q.placed || [];
      stage += '<div><div class="qlab">' + E(q.label) + ' ' + lvl + '</div><div class="flash"><div class="fr" style="font-size:20px;margin-top:0">' + E(q.prompt || '') + '</div></div></div>' +
        '<div class="tray ans" id="tray">' + q.placed.map((k) => '<button class="tok" data-act="unplace" data-k="' + k + '">' + E(q.tokens[k]) + '</button>').join('') + '</div>' +
        '<div class="tray">' + q.pool.map((x) => '<button class="tok' + (q.placed.indexOf(x.i) >= 0 ? ' used' : '') + '" data-act="place" data-k="' + x.i + '">' + E(x.w) + '</button>').join('') + '</div>' + fb;
    }
    if (ans) {
      dock = '<button class="btn" data-act="qnext">' + (q.last ? 'Voir le résultat' : 'Suivant') + '</button>';
    } else if (isInput(q)) {
      dock = '<button class="btn" data-act="check">Valider</button><button class="btn ghost sm" style="align-self:center" data-act="skip">Je ne sais pas</button>';
    } else if (q.type === 'order') {
      dock = '<button class="btn" data-act="check"' + (q.placed.length === q.tokens.length ? '' : ' disabled') + '>Valider</button><button class="btn ghost sm" style="align-self:center" data-act="skip">Je ne sais pas</button>';
    } else {
      dock = '<button class="btn ghost sm" style="align-self:center" data-act="skip">Je ne sais pas</button>';
    }
    return { stage: stage, dock: dock };
  }

  function feedbackHTML(q, it) {
    const ok = q.result === 'ok' || q.result === 'typo';
    let s = '<div class="fb ' + (ok ? 'ok' : 'ko') + '"><b>' + (q.result === 'typo' ? 'Correct, attention à l’orthographe' : ok ? 'Bien joué !' : 'Pas tout à fait') + '</b>';
    s += '<div class="ans" style="display:flex;gap:10px;align-items:flex-start"><div style="flex:1"><span class="en" style="font-size:19px">' + E(it.en) + '</span><br>' + E(it.fr) + '</div>' + spk(it.en, 'sm') + '</div>';
    if (q.sentence && q.type !== 'order') s += '<div class="ans" style="font-size:14px;margin-top:6px">' + E(q.sentence) + '</div>';
    else if (q.type === 'order') s += '<div class="ans" style="font-size:14px;margin-top:6px">' + E(q.sentence) + '</div>';
    else if (it.ex) s += '<div class="ans" style="font-size:14px;margin-top:6px">' + E(it.ex) + '</div>';
    if ((q.type === 'gap' || q.type === 'cloze') && q.answerText && !ok) s += '<div class="ans" style="font-size:14px;margin-top:6px">Mot attendu : <b style="display:inline">' + E(q.answerText) + '</b></div>';
    return s + '</div>';
  }

  /* Enregistre la réponse (session ou quiz) */
  function answer(ctx, q, result) {
    if (q.answered) return;
    q.answered = true; q.result = result;
    const good = result === 'ok' || result === 'typo';
    if (!ctx.practice) AP.grade(q.id, good ? 'ok' : 'ko');
    if (good) ctx.ok += 1; else { ctx.ko += 1; if (ctx.missed.indexOf(q.id) < 0) ctx.missed.push(q.id); }
    rerender();
    if (!good && AP.S.settings.autoplay) AP.speak(AP.BY[q.id].en);
  }
  const inSession = () => location.hash.indexOf('#/session') === 0;
  function rerender() { noAnim = true; if (inSession()) viewSession(); else viewQuizRun(); }
  function cur() { return inSession() ? { ctx: ses, q: ses && ses.q } : { ctx: qz, q: qz && qz.q }; }

  /* =====================================================
     QUIZ
     ===================================================== */
  const SCOPES = [['seen', 'Ce que j’ai vu'], ['due', 'À revoir'], ['hard', 'Mes difficiles'], ['fav', 'Favoris'], ['all', 'Tout']];
  const MODES = [['mix', 'Varié'], ['mcp', 'Choix'], ['listen', 'Écoute'], ['dictee', 'Dictée'], ['type', 'Saisie'], ['order', 'Ordre'], ['context', 'Contexte']];
  const LEVELS = [['normal', 'Normal'], ['hard', 'Difficile'], ['expert', 'Expert']];

  function poolFor(scope) {
    let items;
    if (scope === 'seen') items = AP.ITEMS.filter((i) => !AP.unseen(i));
    else if (scope === 'due') items = AP.dueIds().map((id) => AP.BY[id]);
    else if (scope === 'hard') items = AP.ITEMS.filter((i) => AP.isHard(i.id));
    else if (scope === 'fav') items = AP.ITEMS.filter((i) => AP.isFav(i.id));
    else if (scope.indexOf('th:') === 0) items = AP.ITEMS.filter((i) => i.theme === scope.slice(3));
    else items = AP.ITEMS.slice();
    return items;
  }
  const GR = { mcp: ['mcp-en', 'mcp-fr'], context: ['cloze', 'gap'], listen: ['listen'], dictee: ['dictee'], type: ['type'], order: ['order'] };
  function eligible(items, mode) {
    if (mode === 'mix' || mode === 'mcp') return items;
    const lvl = AP.S.settings.level;
    return items.filter((i) => AP.Q.types(i, lvl).some((t) => GR[mode].indexOf(t) >= 0));
  }

  function trainSeg(on) {
    return '<div class="seg" style="margin-top:12px"><button class="' + (on === 'quiz' ? 'on' : '') + '" data-act="go" data-to="quiz">Quiz</button><button class="' + (on === 'parler' ? 'on' : '') + '" data-act="go" data-to="parler">Parler</button></div>';
  }

  function viewQuizSetup() {
    const pool = eligible(poolFor(qSetup.scope), qSetup.mode);
    const enough = pool.length >= 4;
    let h = '<div class="h1">S’entraîner</div><p class="sub">Quiz : testez ce qui est vraiment acquis. Les erreurs reviennent dans vos révisions.</p>';
    h += trainSeg('quiz');
    h += '<div class="h2">Niveau de difficulté</div><div class="chips wrap">' + LEVELS.map((s) => '<button class="chip' + (AP.S.settings.level === s[0] ? ' on' : '') + '" data-act="qlevel" data-v="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>';
    h += '<p class="help" style="margin-top:0">' + ({ normal: 'Choix multiples surtout.', hard: 'Plus de saisie, de dictées et de phrases à compléter, avec des pièges proches.', expert: 'Aucun choix multiple : vous écrivez toutes vos réponses.' }[AP.S.settings.level]) + '</p>';
    h += '<div class="h2">Sur quoi ?</div><div class="chips wrap">' + SCOPES.map((s) => '<button class="chip' + (qSetup.scope === s[0] ? ' on' : '') + '" data-act="qs" data-k="scope" data-v="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>';
    h += '<div class="chips wrap">' + AP.THEMES.map((t) => '<button class="chip' + (qSetup.scope === 'th:' + t.id ? ' on' : '') + '" data-act="qs" data-k="scope" data-v="th:' + t.id + '">' + E(t.name) + '</button>').join('') + '</div>';
    h += '<div class="h2">Type de questions</div><div class="chips wrap">' + MODES.map((s) => '<button class="chip' + (qSetup.mode === s[0] ? ' on' : '') + '" data-act="qs" data-k="mode" data-v="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>';
    h += '<div class="h2">Nombre de questions</div><div class="chips wrap">' + [5, 10, 20].map((n) => '<button class="chip' + (qSetup.n === n ? ' on' : '') + '" data-act="qs" data-k="n" data-v="' + n + '">' + n + '</button>').join('') + '</div>';
    h += '<div class="list" style="margin-top:14px"><div class="set"><div class="l"><b>Mode entraînement</b><span>Pour s’exercer sans toucher à ma progression</span></div><button class="sw ' + (qSetup.practice ? 'on' : '') + '" data-act="qpractice" role="switch" aria-checked="' + qSetup.practice + '" aria-label="Mode entraînement"></button></div></div>';
    h += '<div style="margin-top:20px"><button class="btn accent" data-act="qstart"' + (enough ? '' : ' disabled') + '>Lancer le quiz</button>' +
      '<p class="help" style="text-align:center">' + (enough ? pool.length + ' cartes disponibles' : 'Pas assez de cartes pour ce choix. Faites une session ou choisissez « Tout ».') + '</p></div>';
    const hist = AP.S.stats.quizzes.slice(-5).reverse();
    if (hist.length) {
      h += '<div class="h2">Derniers quiz</div><div class="list">' + hist.map((x) => '<div class="set"><div class="l"><b>' + x.ok + ' / ' + x.n + '</b><span>' + E(x.d) + ' · ' + E(x.label) + '</span></div><span class="pill ' + (x.ok / x.n >= .8 ? 'acc' : '') + '">' + Math.round(x.ok / x.n * 100) + ' %</span></div>').join('') + '</div>';
    }
    mount(h);
  }

  function startQuiz(scope, mode, n, practice) {
    let items = eligible(poolFor(scope), mode);
    if (items.length < 4) { toast('Pas assez de cartes pour ce quiz'); return false; }
    items = items.map((i) => ({ i: i, s: (AP.S.cards[i.id] ? AP.S.cards[i.id].b : 2.5) + Math.random() * 2.5 - (AP.isHard(i.id) ? 1.5 : 0) })).sort((a, b) => a.s - b.s).map((x) => x.i);
    const ids = AP.shuffle(items.slice(0, n).map((i) => i.id));
    qz = { ids: ids, i: 0, ok: 0, ko: 0, missed: [], mode: mode, scope: scope, practice: !!practice, q: null, done: false };
    qz.q = makeQ();
    nav('#/quiz/run');
    return true;
  }
  function makeQ() {
    const q = AP.Q.make(qz.ids[qz.i], qz.mode);
    q.last = qz.i === qz.ids.length - 1;
    return q;
  }
  function scopeLabel(scope) {
    const s = SCOPES.find((x) => x[0] === scope);
    if (s) return s[1];
    if (scope.indexOf('th:') === 0) return AP.TH[scope.slice(3)].name;
    return scope;
  }

  function viewQuizRun() {
    if (!qz) { nav('#/quiz'); return; }
    if (qz.done) return quizEnd();
    const total = qz.ids.length;
    const r = questionHTML(qz.q);
    let h = '<div class="sbar"><button class="close" data-act="qquit" aria-label="Quitter">' + I.x + '</button><div class="bar"><i style="width:' + (qz.i / total * 100) + '%"></i></div><div class="cnt">' + (qz.i + 1) + '/' + total + '</div></div>';
    if (qz.practice) h += '<div class="phase"><span class="ph rev">Entraînement</span></div>';
    h += '<div class="stage">' + r.stage + '</div><div class="dock">' + r.dock + '</div>';
    mount(h, true);
    if ((qz.q.type === 'listen' || qz.q.type === 'dictee') && !qz.q.answered) setTimeout(() => AP.speak(AP.BY[qz.q.id].en), 250);
  }

  function quizEnd() {
    const n = qz.ids.length;
    if (!qz.saved && !qz.practice) {
      qz.saved = true;
      AP.S.stats.quizzes.push({ d: AP.today(), ok: qz.ok, n: n, label: scopeLabel(qz.scope) });
      AP.S.stats.quizzes = AP.S.stats.quizzes.slice(-30);
      AP.save();
    }
    const pct = qz.ok / n;
    const msg = pct >= .9 ? 'Excellent, c’est acquis.' : pct >= .7 ? 'Très bien, quelques points à consolider.' : pct >= .5 ? 'C’est en bonne voie, les erreurs reviendront bientôt.' : 'Pas de souci : ce sont ces erreurs qui font progresser.';
    let h = '<div class="sbar"><span></span></div><div class="stage"><div class="flash"><span class="lab ok">' + (qz.practice ? 'Entraînement terminé' : 'Quiz terminé') + '</span><div class="score">' + qz.ok + '<small>/' + n + '</small></div><div class="fr" style="font-size:17px;margin-top:10px">' + msg + '</div>';
    if (qz.missed.length) h += '<div class="missed"><div class="h2" style="margin:8px 0">À retenir</div>' + qz.missed.map((id) => rowHTML(AP.BY[id], { plain: true })).join('') + '</div>';
    h += '</div></div><div class="dock">' + (qz.missed.length ? '<button class="btn accent" data-act="redo">Refaire les ratés</button>' : '') + '<button class="btn alt" data-act="qfinish">Terminer</button></div>';
    mount(h, true);
  }

  /* =====================================================
     RÉFÉRENCE (recherche + fiches)
     ===================================================== */
  let searchIndex = null;
  function buildIndex() {
    if (searchIndex) return searchIndex;
    const seen = {};
    searchIndex = [];
    AP.ITEMS.forEach((it) => {
      seen[AP.norm(it.en)] = 1;
      searchIndex.push({ it: it, en: AP.norm(it.en), fr: AP.norm(it.fr), ex: AP.norm((it.ex || '') + ' ' + (it.exfr || '')) });
    });
    AP.FICHES.forEach((f) => {
      (f.blocks || []).forEach((b) => (b.rows || []).forEach((r) => {
        const k = AP.norm(r[0]);
        if (!k || seen[k] || r[0].length > 160) return;
        seen[k] = 1;
        const it = { id: 'f:' + f.id + ':' + k.slice(0, 20), kind: 'fiche', en: r[0], fr: r[1] || '', cat: f.title, theme: '', fiche: f.id };
        searchIndex.push({ it: it, en: k, fr: AP.norm(r[1] || ''), ex: '' });
      }));
    });
    return searchIndex;
  }
  function search(q) {
    const idx = buildIndex();
    const nq = AP.norm(q);
    const toks = nq.split(' ').filter(Boolean);
    const out = [];
    idx.forEach((x) => {
      const it = x.it;
      if (refState.f === 'word' && it.kind !== 'word') return;
      if (refState.f === 'phrase' && it.kind !== 'phrase' && it.kind !== 'fiche') return;
      if (refState.f === 'expression' && it.kind !== 'expression') return;
      if (refState.f === 'fav' && !AP.isFav(it.id)) return;
      if (refState.th !== 'all' && it.theme !== refState.th) return;
      let s = 0;
      if (!toks.length) { s = 1; }
      else {
        if (x.en === nq) s = 100;
        else if (x.en.indexOf(nq) === 0) s = 80;
        else if (x.en.indexOf(' ' + nq) >= 0) s = 65;
        else if (x.fr.indexOf(nq) === 0) s = 60;
        else if (x.en.indexOf(nq) >= 0) s = 50;
        else if (x.fr.indexOf(nq) >= 0) s = 45;
        else if (toks.every((t) => x.en.indexOf(t) >= 0 || x.fr.indexOf(t) >= 0)) s = 30;
        else if (toks.every((t) => x.en.indexOf(t) >= 0 || x.fr.indexOf(t) >= 0 || x.ex.indexOf(t) >= 0)) s = 15;
        if (s) s -= Math.min(10, x.en.length / 20);
      }
      if (s) out.push({ s: s, it: it });
    });
    if (toks.length) out.sort((a, b) => b.s - a.s);
    return out.map((o) => o.it);
  }

  function rowHTML(it, o) {
    o = o || {};
    const meta = it.kind === 'fiche' ? '<span>Fiche</span><span>' + E(it.cat) + '</span>' : '<span>' + AP.KIND[it.kind] + '</span><span>' + E(it.cat) + '</span>' + (it.src ? '<span>Cours</span>' : '');
    const more = '<div class="more">' + (it.ex ? E(it.ex) + '<em>' + E(it.exfr || '') + '</em>' : '') + '<div class="meta">' + meta + '</div>' +
      (it.kind === 'fiche' ? '<button class="btn sm alt" style="margin-top:8px" data-act="go" data-to="fiche/' + it.fiche + '">Ouvrir la fiche</button>' : '') + '</div>';
    return '<div class="row" data-rid="' + E(it.id) + '">' + (o.plain ? '' : (it.kind === 'fiche' ? '<span class="dot"></span>' : '<span class="dot ' + AP.status(it.id) + '"></span>')) +
      '<div class="rt" data-act="rowopen"><b>' + E(it.en) + '</b><span>' + E(it.fr) + '</span>' + more + '</div>' +
      spk(it.en, 'sm') + (it.kind === 'fiche' ? '' : star(it.id)) + '</div>';
  }

  function viewRef() {
    let h = '<div class="h1">Apprendre</div>';
    h += '<div class="seg"><button class="' + (refState.tab === 'search' ? 'on' : '') + '" data-act="reftab" data-v="search">Rechercher</button><button class="' + (refState.tab === 'fiches' ? 'on' : '') + '" data-act="reftab" data-v="fiches">Fiches de cours</button></div>';
    if (refState.tab === 'fiches') {
      AP.GROUPS.forEach((g) => {
        h += '<div class="h2">' + E(g.g) + '</div>';
        g.t.forEach((id) => {
          const f = AP.FICHES.find((x) => x.id === id);
          if (!f) return;
          const n = AP.FICHES.indexOf(f) + 1;
          const rows = (f.blocks || []).reduce((a, b) => a + (b.rows || []).length, 0);
          h += '<button class="tile fiche" data-act="go" data-to="fiche/' + f.id + '"><span class="n">' + n + '</span><div><div class="tt" style="display:block">' + E(f.title.replace(/^Fiche \d+ · /, '')) + '</div><div class="td" style="margin:2px 0 0">' + rows + ' lignes</div></div></button>';
        });
      });
      return mount(h);
    }
    h += '<div class="search">' + I.search + '<input id="q" type="search" placeholder="Un mot, une phrase, en anglais ou en français" value="' + E(refState.q) + '" autocomplete="off" autocapitalize="none" autocorrect="off" enterkeyhint="search"></div>';
    h += '<div class="chips">' + [['all', 'Tout'], ['word', 'Mots'], ['phrase', 'Phrases'], ['expression', 'Expressions'], ['fav', 'Favoris']].map((c) => '<button class="chip' + (refState.f === c[0] ? ' on' : '') + '" data-act="reff" data-v="' + c[0] + '">' + c[1] + '</button>').join('') + '</div>';
    h += '<div class="chips"><button class="chip' + (refState.th === 'all' ? ' on' : '') + '" data-act="refth" data-v="all">Tous thèmes</button>' + AP.THEMES.map((t) => '<button class="chip' + (refState.th === t.id ? ' on' : '') + '" data-act="refth" data-v="' + t.id + '">' + E(t.name) + '</button>').join('') + '</div>';
    h += '<div id="results"></div>';
    mount(h);
    fillResults();
  }

  function fillResults() {
    const box = document.getElementById('results');
    if (!box) return;
    const res = search(refState.q);
    const shown = res.slice(0, refState.lim);
    let h = '<div class="sub" style="font-size:13px;margin:4px 2px 8px">' + res.length + ' résultat' + (res.length > 1 ? 's' : '') + '</div>';
    if (!res.length) h += '<div class="empty">Rien trouvé. Essayez un autre mot, avec ou sans accent.</div>';
    else h += '<div class="list">' + shown.map((it) => rowHTML(it)).join('') + '</div>';
    if (res.length > shown.length) h += '<div style="margin-top:12px"><button class="btn alt" data-act="morerefs">Afficher la suite (' + (res.length - shown.length) + ')</button></div>';
    box.innerHTML = h;
  }

  function viewFiche(id) {
    const f = AP.FICHES.find((x) => x.id === id);
    if (!f) { nav('#/ref'); return; }
    let h = '<button class="back" data-act="go" data-to="ref">' + I.back + 'Apprendre</button>';
    h += '<div class="h1" style="font-size:25px">' + E(f.title) + '</div><p class="sub">' + E(f.intro || '') + '</p>';
    (f.blocks || []).forEach((b) => {
      h += '<div class="fiche-block"><h3>' + E(b.h || '') + '</h3>' + (b.sub ? '<div class="sub" style="font-size:14px">' + E(b.sub) + '</div>' : '') + (b.tip ? '<div class="tip">' + E(b.tip) + '</div>' : '');
      if (b.rows && b.rows.length) {
        h += '<div class="list">' + b.rows.map((r) => '<div class="row"><div class="rt"><b>' + E(r[0]) + '</b><span>' + E(r[1] || '') + '</span></div>' + spk(r[0], 'sm') + '</div>').join('') + '</div>';
      }
      h += '</div>';
    });
    if (f.sources) h += '<p class="help" style="margin-top:20px">Source : ' + E(f.sources) + '</p>';
    mount(h);
  }

  /* =====================================================
     THÈME
     ===================================================== */
  function viewTheme(id) {
    const t = AP.TH[id];
    if (!t) { nav('#/'); return; }
    const s = AP.themeStats(id);
    const items = AP.ITEMS.filter((i) => i.theme === id);
    const cats = {};
    items.forEach((i) => { (cats[i.cat] = cats[i.cat] || []).push(i); });
    let h = '<button class="back" data-act="go" data-to="">' + I.back + 'Ma séance</button><div class="h1">' + E(t.name) + '</div><p class="sub">' + E(t.desc) + '</p>';
    h += '<div style="margin:14px 0"><div class="bar big"><i class="a" style="width:' + (s.known / s.total * 100) + '%"></i><i class="b" style="width:' + (s.learning / s.total * 100) + '%"></i></div>' +
      '<div class="td sub" style="font-size:13px;margin-top:6px">' + s.known + ' connus · ' + s.learning + ' en cours · ' + s.fresh + ' à découvrir · ' + s.due + ' à revoir</div></div>';
    h += '<div class="btnrow"><button class="btn" data-act="start" data-strict="1" data-th="' + id + '">Session</button><button class="btn alt" data-act="themequiz" data-th="' + id + '">Quiz</button></div>';
    h += '<div class="h2">Contenu</div>';
    Object.keys(cats).forEach((c) => {
      h += '<details class="cats"><summary><span>' + E(c) + '</span><small>' + cats[c].length + '</small></summary><div class="list">' + cats[c].map((i) => rowHTML(i)).join('') + '</div></details>';
    });
    mount(h);
  }

  /* =====================================================
     RÉGLAGES
     ===================================================== */
  function opt(list, c) { return list.map((o) => '<option value="' + o[0] + '"' + (String(c) === String(o[0]) ? ' selected' : '') + '>' + o[1] + '</option>').join(''); }
  function viewSettings() {
    const s = AP.S.settings;
    const push = pushState();
    let h = '<div class="h1">Réglages</div>';
    h += '<div class="h2">Audio</div><div class="list">' +
      '<div class="set"><div class="l"><b>Accent</b><span>Voix de l’iPhone</span></div><select data-set="accent">' + opt([['en-GB', 'Britannique'], ['en-US', 'Américain']], s.accent) + '</select></div>' +
      '<div class="set"><div class="l"><b>Vitesse</b></div><select data-set="rate">' + opt([[0.7, 'Lente'], [0.85, 'Posée'], [1, 'Normale']], s.rate) + '</select></div>' +
      '<div class="set"><div class="l"><b>Lecture automatique</b><span>Prononce chaque nouvelle carte</span></div><button class="sw ' + (s.autoplay ? 'on' : '') + '" data-act="toggleauto" role="switch" aria-checked="' + !!s.autoplay + '" aria-label="Lecture automatique"></button></div>' +
      '<div class="set"><div class="l"><b>Tester la voix</b></div><button class="btn sm alt" data-act="say" data-say="Nice to meet you. Let me walk you through the key figures.">' + I.spk.replace('<svg', '<svg style="width:18px;height:18px"') + 'Écouter</button></div>' +
      '<div class="set"><div class="l"><b>Plus de son ?</b><span>Vérifiez le volume et le mode silencieux, puis réparez</span></div><button class="btn sm alt" data-act="repair">Réparer</button></div></div>';
    h += '<div class="h2">Apprentissage</div><div class="list">' +
      '<div class="set"><div class="l"><b>Objectif du jour</b><span>Cartes par session</span></div><select data-set="goal">' + opt([[8, '8 (≈ 4 min)'], [12, '12 (≈ 6 min)'], [20, '20 (≈ 10 min)'], [30, '30 (≈ 15 min)']], s.goal) + '</select></div>' +
      '<div class="set"><div class="l"><b>Difficulté des quiz</b></div><select data-set="level">' + opt([['normal', 'Normal'], ['hard', 'Difficile'], ['expert', 'Expert']], s.level) + '</select></div>' +
      '<div class="set"><div class="l"><b>Sens des révisions</b></div><select data-set="direction">' + opt([['mix', 'Mélangé'], ['en2fr', 'Anglais → français'], ['fr2en', 'Français → anglais']], s.direction) + '</select></div>' +
      '<div class="set"><div class="l"><b>Thème du jour</b><span>Un thème par jour, ou le même</span></div><select data-set="theme">' + opt([['auto', 'Automatique'], ['all', 'Tous mélangés']].concat(AP.THEMES.map((t) => [t.id, t.name])), s.theme) + '</select></div></div>';
    h += '<div class="h2">Rappel quotidien</div><div class="card">' + pushHTML(push) + '</div>';
    h += '<div class="h2">Sauvegarde</div><div class="card"><p class="sub" style="font-size:14px">Votre progression est enregistrée sur ce téléphone. Gardez un code de secours pour la retrouver si besoin.</p><div class="btnrow" style="margin-top:10px"><button class="btn alt sm" data-act="export">Copier mon code</button><button class="btn alt sm" data-act="importtoggle">Restaurer</button></div><div id="imp" style="display:none;margin-top:10px"><textarea class="code" id="impcode" placeholder="Collez ici votre code de secours"></textarea><button class="btn sm" style="margin-top:8px" data-act="import">Restaurer ma progression</button></div></div>';
    h += '<div class="h2">Autres</div><div class="list">' +
      '<div class="set"><div class="l"><b>Mots difficiles</b><span>Retirer les marques de difficulté</span></div><button class="btn sm alt" data-act="cleanhard">Réinitialiser</button></div>' +
      '<div class="set"><div class="l"><b>Tout effacer</b><span>Repartir de zéro</span></div><button class="btn sm ghost" style="color:var(--ko)" data-act="reset">Effacer</button></div></div>';
    h += '<p class="help" style="text-align:center;margin-top:20px">Anglais pro · version ' + E((window.APCONF || {}).version || '') + ' · ' + AP.ITEMS.length + ' cartes</p>';
    mount(h);
  }

  /* ---- Notifications ---- */
  function pushState() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return 'unsupported';
    if (!standalone()) return 'install';
    if (Notification.permission === 'denied') return 'denied';
    if (Notification.permission === 'granted' && AP.S.settings.pushSub) return 'on';
    return 'off';
  }
  function pushHTML(st) {
    if (st === 'unsupported') return '<p class="sub" style="font-size:14px">Les rappels ne sont pas disponibles dans ce navigateur. Ouvrez l’app depuis l’écran d’accueil de l’iPhone (iOS 16.4 ou plus récent).</p>';
    if (st === 'install') return '<p class="sub" style="font-size:14px"><b>Installez d’abord l’app</b> : dans Safari, bouton Partager, puis « Sur l’écran d’accueil ». Ouvrez ensuite l’app depuis cette icône pour activer le rappel de 12 h 30.</p>';
    if (st === 'denied') return '<p class="sub" style="font-size:14px">Les notifications sont refusées. Réglages iPhone > Notifications > Anglais pro pour les autoriser.</p>';
    if (st === 'on') return '<p style="font-weight:700;color:var(--ok)">Rappel activé</p><p class="sub" style="font-size:14px;margin-top:4px">Une notification chaque jour vers 12 h 30 avec le thème du jour.</p><div class="btnrow" style="margin-top:10px"><button class="btn alt sm" data-act="testpush">Tester maintenant</button><button class="btn ghost sm" data-act="offpush">Désactiver</button></div><button class="btn alt sm" style="margin-top:10px;width:100%" data-act="copysub">Copier le code de mon téléphone</button>';
    return '<p class="sub" style="font-size:14px">Recevez une notification chaque jour vers 12 h 30 avec le thème du jour.</p><button class="btn accent" style="margin-top:10px" data-act="onpush">Activer le rappel</button>';
  }
  function b64ToU8(b) {
    const p = '='.repeat((4 - (b.length % 4)) % 4);
    const raw = atob((b + p).replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(raw, (c) => c.charCodeAt(0));
  }
  async function enablePush() {
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') { toast('Notifications refusées'); return viewSettings(); }
      const reg = await navigator.serviceWorker.ready;
      const key = (window.APCONF || {}).vapidPublicKey;
      let sub = await reg.pushManager.getSubscription();
      if (!sub && key) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(key) });
      AP.S.settings.pushSub = sub ? JSON.stringify(sub) : 'local';
      AP.save();
      toast('Rappel activé');
    } catch (e) { toast('Impossible d’activer le rappel'); }
    viewSettings();
  }
  async function testPush() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const th = AP.dayTheme();
      await reg.showNotification('Anglais pro', { body: 'Votre session de 5 minutes vous attend' + (th ? ' : ' + AP.TH[th].name : '') + '.', icon: 'icon-192.png', badge: 'icon-192.png', tag: 'anglais-pro-daily' });
    } catch (e) { toast('Test impossible'); }
  }

  /* =====================================================
     ÉVÉNEMENTS
     ===================================================== */
  const A = {
    go(el) { nav('#/' + (el.dataset.to || '')); },
    say(el) { say(el.dataset.say); },
    sayslow(el) { say(el.dataset.say, 0.6); },
    fav(el, ev) {
      ev.stopPropagation();
      const on = AP.toggleFav(el.dataset.id);
      document.querySelectorAll('.star[data-id="' + el.dataset.id + '"]').forEach((b) => b.classList.toggle('on', on));
      toast(on ? 'Ajouté aux favoris' : 'Retiré des favoris');
    },
    rowopen(el) { const r = el.closest('.row'); if (r) r.classList.toggle('open'); },
    hidebanner() { AP.S.settings.bannerHidden = true; AP.save(); viewHome(); },
    start(el) { startSession(el.dataset.th || null, null, !!el.dataset.strict); },
    revonly() { startSession(null, 'rev'); },
    quickquiz() { qSetup.scope = AP.ITEMS.some((i) => !AP.unseen(i)) ? 'seen' : 'all'; startQuiz(qSetup.scope, 'mix', 5, false); },
    hardquiz() { startQuiz('hard', 'mix', 10, false); },
    themequiz(el) { startQuiz('th:' + el.dataset.th, 'mix', 10, false); },
    quit() { if (confirm('Quitter la session ? Votre progression est conservée.')) { ses = null; nav('#/'); } },
    goon() { ses.inter = null; viewSession(); },
    learned() { AP.introduce(ses.steps[ses.i].id); nextStep(); },
    reveal() { ses.shown = true; viewSession(); if (AP.S.settings.autoplay) AP.speak(AP.BY[ses.steps[ses.i].id].en); },
    grade(el) {
      const id = ses.steps[ses.i].id; const r = el.dataset.r;
      AP.grade(id, r);
      if (r === 'ok') ses.ok += 1; else { ses.ko += 1; if (r === 'ko' && ses.missed.indexOf(id) < 0) ses.missed.push(id); }
      nextStep();
    },
    more() { const th = ses.theme; const only = ses.only; const strict = ses.strict; ses = null; startSession(th, only, strict); },
    finish() { ses = null; nav('#/'); },
    pick(el) {
      const c = cur(); const q = c.q; if (!q || q.answered) return;
      q.picked = el.dataset.id;
      answer(c.ctx, q, q.picked === q.correct ? 'ok' : 'ko');
    },
    skip() { const c = cur(); if (c.q && !c.q.answered) { c.q.picked = null; c.q.typed = ''; answer(c.ctx, c.q, 'ko'); } },
    check() {
      const c = cur(); const q = c.q; if (!q || q.answered) return;
      if (isInput(q)) {
        const v = (document.getElementById('typed') || {}).value || '';
        if (!v.trim()) { toast('Écrivez une réponse'); return; }
        q.typed = v;
        answer(c.ctx, q, AP.Q.checkAgainst(v, q.answerText || AP.BY[q.id].en));
      } else if (q.type === 'order') {
        const got = q.placed.map((k) => q.tokens[k]).join(' ');
        answer(c.ctx, q, AP.norm(got) === AP.norm(q.sentence) ? 'ok' : 'ko');
      }
    },
    place(el) {
      const c = cur(); const q = c.q; if (!q || q.answered) return;
      const k = Number(el.dataset.k);
      if (q.placed.indexOf(k) < 0) q.placed.push(k);
      rerender();
    },
    unplace(el) {
      const c = cur(); const q = c.q; if (!q || q.answered) return;
      q.placed = q.placed.filter((k) => k !== Number(el.dataset.k));
      rerender();
    },
    qnext() {
      if (inSession()) {
        const c = cur();
        const st = ses.steps[ses.i];
        if (c.q && c.q.result === 'ko' && st.phase === 'quiz' && !st.retry) ses.steps.push({ t: 'quiz', id: st.id, phase: 'quiz', retry: true });
        nextStep(); return;
      }
      qz.i += 1;
      if (qz.i >= qz.ids.length) qz.done = true; else qz.q = makeQ();
      viewQuizRun();
    },
    qs(el) {
      const k = el.dataset.k; const v = el.dataset.v;
      qSetup[k] = k === 'n' ? Number(v) : v;
      viewQuizSetup();
    },
    qlevel(el) { AP.S.settings.level = el.dataset.v; AP.save(); viewQuizSetup(); },
    qpractice() { qSetup.practice = !qSetup.practice; viewQuizSetup(); },
    qstart() { startQuiz(qSetup.scope, qSetup.mode, qSetup.n, qSetup.practice); },
    qquit() { qz = null; nav('#/quiz'); },
    qfinish() { qz = null; nav('#/quiz'); },
    redo() {
      const ids = qz.missed.slice(); const keep = { mode: qz.mode, scope: qz.scope, practice: qz.practice };
      qz = { ids: AP.shuffle(ids), i: 0, ok: 0, ko: 0, missed: [], mode: keep.mode, scope: keep.scope, practice: keep.practice, q: null, done: false };
      qz.q = makeQ(); viewQuizRun();
    },
    reftab(el) { refState.tab = el.dataset.v; viewRef(); },
    reff(el) { refState.f = el.dataset.v; refState.lim = 60; viewRef(); },
    refth(el) { refState.th = el.dataset.v; refState.lim = 60; viewRef(); },
    morerefs() { refState.lim += 100; fillResults(); },
    toggleauto() { AP.S.settings.autoplay = !AP.S.settings.autoplay; AP.save(); viewSettings(); },
    repair() { if (AP.repairAudio()) toast('Son réinitialisé : écoutez le test'); else toast('Audio indisponible sur cet appareil'); },
    export() {
      const code = AP.exportCode();
      const done = () => toast('Code copié. Collez-le dans une note pour le garder.');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(done, () => { prompt('Copiez ce code :', code); });
      else prompt('Copiez ce code :', code);
    },
    importtoggle() { const b = document.getElementById('imp'); b.style.display = b.style.display === 'none' ? 'block' : 'none'; },
    import() {
      try { AP.importCode(document.getElementById('impcode').value); toast('Progression restaurée'); viewSettings(); }
      catch (e) { toast('Code invalide'); }
    },
    cleanhard() { Object.keys(AP.S.cards).forEach((id) => { AP.S.cards[id].ko = 0; }); AP.save(); toast('Fait'); },
    reset() {
      if (confirm('Effacer toute votre progression ?')) { AP.replaceState({}); toast('Progression effacée'); nav('#/'); }
    },
    onpush() { enablePush(); },
    testpush() { testPush(); },
    copysub() {
      const code = AP.S.settings.pushSub;
      if (!code || code === 'local') { toast('Réactivez le rappel'); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(() => toast('Code copié'), () => prompt('Copiez ce code :', code));
      else prompt('Copiez ce code :', code);
    },
    offpush() {
      navigator.serviceWorker.ready.then((r) => r.pushManager.getSubscription()).then((s) => s && s.unsubscribe()).catch(() => {}).then(() => { AP.S.settings.pushSub = ''; AP.save(); viewSettings(); });
    }
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const f = A[el.dataset.act];
    if (f) f(el, e);
  });
  document.addEventListener('change', (e) => {
    const el = e.target.closest('[data-set]');
    if (!el) return;
    const k = el.dataset.set; let v = el.value;
    if (k === 'rate' || k === 'goal') v = Number(v);
    AP.S.settings[k] = v; AP.save();
    if (k === 'accent' || k === 'rate') AP.speak('Nice to meet you. Let me walk you through the key figures.');
  });
  document.addEventListener('input', (e) => {
    if (e.target && e.target.id === 'q') { refState.q = e.target.value; refState.lim = 60; fillResults(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (e.target && e.target.id === 'typed') { e.preventDefault(); A.check(); }
    if (e.target && e.target.id === 'q') e.target.blur();
  });

  /* ---------- Interface partagée avec les autres modules ---------- */
  AP.UI = {
    trainSeg: trainSeg,
    E: E, I: I, spk: spk, star: star, toast: toast, mount: mount, nav: nav, say: say, enCls: enCls, rowHTML: rowHTML,
    poolFor: poolFor, A: A, bars: bars,
    addRoute: function (name, tab, fn) { extra[name] = { tab: tab, fn: fn }; },
    route: route,
    rerenderNoAnim: function () { noAnim = true; }
  };
  AP._dbg = () => ({ ses: ses, qz: qz });
})();
