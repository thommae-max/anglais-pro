/* Anglais pro : noyau (données, progression, répétition espacée, audio) */
(function () {
  'use strict';
  const AP = (window.AP = {});
  const C = window.CONTENT;
  AP.ITEMS = C.items;
  AP.THEMES = C.themes;
  AP.FICHES = C.fiches;
  AP.GROUPS = C.groups;
  AP.BY = {};
  AP.ITEMS.forEach((i) => { AP.BY[i.id] = i; });
  AP.TH = {};
  AP.THEMES.forEach((t) => { AP.TH[t.id] = t; });
  AP.KIND = { word: 'Mot', expression: 'Expression', phrase: 'Phrase' };

  /* ---------- Utilitaires ---------- */
  AP.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  AP.norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const z = (n) => String(n).padStart(2, '0');
  AP.ymd = (d) => d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  AP.today = () => AP.ymd(new Date());
  AP.addDays = (s, n) => { const p = s.split('-').map(Number); return AP.ymd(new Date(p[0], p[1] - 1, p[2] + n)); };
  AP.hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return Math.abs(h); };
  AP.shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = r[i]; r[i] = r[j]; r[j] = t; } return r; };
  AP.plural = (n, one, many) => n + ' ' + (n > 1 ? many : one);

  /* ---------- Stockage ---------- */
  const KEY = 'anglaisPro.v1';
  function defaults() {
    return {
      v: 1,
      cards: {},
      settings: { accent: 'en-GB', rate: 1, goal: 12, direction: 'mix', autoplay: true, theme: 'auto', bannerHidden: false, pushSub: '', level: 'hard' },
      stats: { days: {}, quizzes: [], sessions: 0 },
      toeic: { cats: {}, tests: [] }
    };
  }
  AP.load = function () {
    const d = defaults();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const o = JSON.parse(raw);
        d.cards = o.cards || {};
        Object.assign(d.settings, o.settings || {});
        d.stats.days = (o.stats && o.stats.days) || {};
        d.stats.quizzes = (o.stats && o.stats.quizzes) || [];
        d.stats.sessions = (o.stats && o.stats.sessions) || 0;
        if (o.toeic) d.toeic = { cats: o.toeic.cats || {}, tests: o.toeic.tests || [] };
      }
    } catch (e) { /* stockage indisponible */ }
    return d;
  };
  AP.S = AP.load();
  AP.save = function () { try { localStorage.setItem(KEY, JSON.stringify(AP.S)); } catch (e) { /* ignore */ } };
  AP.replaceState = function (o) {
    const d = defaults();
    d.cards = o.cards || {};
    Object.assign(d.settings, o.settings || {});
    d.stats.days = (o.stats && o.stats.days) || {};
    d.stats.quizzes = (o.stats && o.stats.quizzes) || [];
    d.stats.sessions = (o.stats && o.stats.sessions) || 0;
    if (o.toeic) d.toeic = { cats: o.toeic.cats || {}, tests: o.toeic.tests || [] };
    AP.S = d;
    AP.save();
  };

  /* ---------- Répétition espacée (boîtes de Leitner) ---------- */
  AP.INTERVALS = [0, 1, 3, 7, 14, 30];
  AP.card = (id) => AP.S.cards[id] || null;
  AP.status = function (id) {
    const c = AP.S.cards[id];
    if (!c) return 'new';
    if (c.b >= 5) return 'mastered';
    if (c.b >= 3) return 'known';
    return 'learning';
  };
  AP.STATUS_LABEL = { new: 'Nouveau', learning: 'En cours', known: 'Connu', mastered: 'Maîtrisé' };
  AP.touch = function (id) {
    if (!AP.S.cards[id]) AP.S.cards[id] = { b: 0, due: AP.today(), n: 0, ok: 0, ko: 0, fav: false, t: AP.today() };
    return AP.S.cards[id];
  };
  AP.introduce = function (id) {
    const c = AP.touch(id);
    c.n = Math.max(c.n, 1);
    AP.save();
  };
  AP.grade = function (id, res) {
    const c = AP.touch(id);
    const t = AP.today();
    c.n += 1; c.t = t;
    if (res === 'ko') { c.b = 0; c.due = t; c.ko += 1; }
    else if (res === 'mid') { c.b = Math.max(c.b, 1); c.due = AP.addDays(t, 1); c.ok += 0; }
    else { c.b = Math.min(5, c.b + 1); c.due = AP.addDays(t, AP.INTERVALS[c.b]); c.ok += 1; }
    AP.S.stats.days[t] = (AP.S.stats.days[t] || 0) + 1;
    AP.save();
  };
  AP.nextLabel = function (id, res) {
    const c = AP.S.cards[id];
    const b = c ? c.b : 0;
    let d;
    if (res === 'ko') return 'aujourd’hui';
    if (res === 'mid') d = 1; else d = AP.INTERVALS[Math.min(5, b + 1)];
    return d <= 1 ? 'demain' : 'dans ' + d + ' jours';
  };
  AP.toggleFav = function (id) {
    const c = AP.touch(id);
    c.fav = !c.fav;
    if (c.n === 0) { c.due = '2999-01-01'; }
    AP.save();
    return c.fav;
  };
  AP.isFav = (id) => !!(AP.S.cards[id] && AP.S.cards[id].fav);
  AP.isHard = function (id) {
    const c = AP.S.cards[id];
    return !!(c && c.n > 0 && c.ko > 0 && c.b < 3);
  };
  AP.dueIds = function (theme) {
    const t = AP.today();
    return Object.keys(AP.S.cards).filter((id) => {
      const c = AP.S.cards[id]; const it = AP.BY[id];
      return it && c.n > 0 && c.due <= t && (!theme || it.theme === theme);
    }).sort((a, b) => AP.S.cards[a].b - AP.S.cards[b].b || AP.S.cards[a].due.localeCompare(AP.S.cards[b].due));
  };
  AP.unseen = (it) => !AP.S.cards[it.id] || AP.S.cards[it.id].n === 0;
  AP.newIds = function (theme, n) {
    const pick = (th) => AP.ITEMS.filter((i) => i.theme === th && AP.unseen(i));
    let pool = theme ? pick(theme) : [];
    if (pool.length < n) {
      AP.THEMES.forEach((t) => { if (t.id !== theme && pool.length < n * 3) pool = pool.concat(pick(t.id)); });
    }
    const words = pool.filter((i) => i.kind !== 'phrase');
    const phrases = pool.filter((i) => i.kind === 'phrase');
    const out = [];
    let w = 0, p = 0;
    while (out.length < n && (w < words.length || p < phrases.length)) {
      for (let k = 0; k < 3 && out.length < n; k++) {
        if (k < 2 && w < words.length) out.push(words[w++].id);
        else if (k === 2 && p < phrases.length) out.push(phrases[p++].id);
        else if (w < words.length) out.push(words[w++].id);
        else if (p < phrases.length) out.push(phrases[p++].id);
      }
    }
    return out;
  };

  /* ---------- Statistiques ---------- */
  AP.themeStats = function (id) {
    let total = 0, known = 0, learning = 0, fresh = 0;
    AP.ITEMS.forEach((i) => {
      if (i.theme !== id) return;
      total++;
      const s = AP.status(i.id);
      if (s === 'new') fresh++; else if (s === 'learning') learning++; else known++;
    });
    return { total: total, known: known, learning: learning, fresh: fresh, due: AP.dueIds(id).length };
  };
  AP.totals = function () {
    let known = 0, learning = 0;
    AP.ITEMS.forEach((i) => { const s = AP.status(i.id); if (s === 'known' || s === 'mastered') known++; else if (s === 'learning') learning++; });
    return { total: AP.ITEMS.length, known: known, learning: learning };
  };
  AP.doneToday = () => AP.S.stats.days[AP.today()] || 0;
  AP.streak = function () {
    const days = AP.S.stats.days;
    let d = AP.today();
    if (!days[d]) d = AP.addDays(d, -1);
    let n = 0;
    while (days[d]) { n++; d = AP.addDays(d, -1); }
    return n;
  };
  AP.dayTheme = function () {
    const m = AP.S.settings.theme;
    if (m === 'all') return null;
    if (m !== 'auto' && AP.TH[m]) return m;
    const wd = new Date().getDay();
    const t = AP.THEMES.find((x) => x.day === wd);
    return t ? t.id : 'metier';
  };

  /* ---------- Audio (voix du téléphone) ---------- */
  AP.hasSpeech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let voices = [];
  let keep = null;           // référence gardée : évite que iOS coupe la voix
  let seqId = 0;
  function loadVoices() { try { voices = window.speechSynthesis.getVoices() || []; } catch (e) { voices = []; } }
  if (AP.hasSpeech) { loadVoices(); try { window.speechSynthesis.onvoiceschanged = loadVoices; } catch (e) { /* ignore */ } }
  function voiceScore(v) { return (/premium|enhanced|siri/i.test(v.name) ? 2 : 0) + (v.localService ? 1 : 0); }
  function pickVoice() {
    if (!voices.length) loadVoices();
    const lang = AP.S.settings.accent.toLowerCase();
    const same = (v) => (v.lang || '').replace('_', '-').toLowerCase();
    let c = voices.filter((v) => same(v) === lang);
    if (!c.length) c = voices.filter((v) => same(v).indexOf('en') === 0);
    c.sort((a, b) => voiceScore(b) - voiceScore(a));
    return c[0] || null;
  }
  AP.speakText = (en) => String(en).replace(/___/g, 'blank').replace(/\s\/\s/g, ', ').replace(/\s+—\s+/g, '. ').replace(/\s+/g, ' ').trim();
  function utter(text, rate, onend) {
    const u = new SpeechSynthesisUtterance(AP.speakText(text));
    u.lang = AP.S.settings.accent;
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = rate || AP.S.settings.rate;
    u.onend = function () { if (onend) onend(); };
    u.onerror = function () { if (onend) onend(); };
    keep = u;
    return u;
  }
  function fire(u) {
    const ss = window.speechSynthesis;
    try { ss.resume(); } catch (e) { /* ignore */ }
    ss.speak(u);
  }
  /* Lit un texte. Retourne false si l'audio n'existe pas sur l'appareil. */
  AP.speak = function (text, rate) {
    if (!AP.hasSpeech) return false;
    seqId++;
    try {
      const ss = window.speechSynthesis;
      const busy = ss.speaking || ss.pending;
      if (busy) ss.cancel();
      const u = utter(text, rate);
      if (busy) setTimeout(() => fire(u), 140); else fire(u);
      return true;
    } catch (e) { return false; }
  };
  /* Lit plusieurs textes à la suite (écoute TOEIC) ; gap en millisecondes */
  AP.speakSeq = function (list, gap, done) {
    if (!AP.hasSpeech) return false;
    const my = ++seqId;
    try {
      const ss = window.speechSynthesis;
      const busy = ss.speaking || ss.pending;
      if (busy) ss.cancel();
      let i = 0;
      const next = () => {
        if (my !== seqId) return;
        if (i >= list.length) { if (done) done(); return; }
        const item = list[i++];
        const u = utter(item, 0.95, () => setTimeout(next, gap || 700));
        fire(u);
      };
      if (busy) setTimeout(next, 140); else next();
      return true;
    } catch (e) { return false; }
  };
  AP.stopSpeech = function () { seqId++; try { if (AP.hasSpeech) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } };
  /* Réparation du son : vide la file et recharge les voix */
  AP.repairAudio = function () {
    if (!AP.hasSpeech) return false;
    seqId++;
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    keep = null; voices = [];
    loadVoices();
    setTimeout(() => { loadVoices(); AP.speak('Audio check. Can you hear me clearly?'); }, 300);
    return true;
  };

  /* ---------- Sauvegarde ---------- */
  AP.exportCode = () => btoa(unescape(encodeURIComponent(JSON.stringify({ cards: AP.S.cards, settings: AP.S.settings, stats: AP.S.stats, toeic: AP.S.toeic }))));
  AP.importCode = function (code) {
    const o = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (!o || typeof o.cards !== 'object') throw new Error('format');
    AP.replaceState(o);
  };
})();
