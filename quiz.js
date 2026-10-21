/* Anglais pro : génération des questions de quiz (niveaux normal, difficile, expert) */
(function () {
  'use strict';
  const AP = window.AP;
  const Q = (AP.Q = {});

  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = []; for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  Q.lev = lev;

  function variants(en) {
    const set = new Set();
    const bases = [en];
    en.split(/\s\/\s/).forEach((p) => bases.push(p));
    bases.forEach((b) => {
      const nop = b.replace(/\([^)]*\)/g, ' ');
      set.add(AP.norm(b)); set.add(AP.norm(nop)); set.add(AP.norm(nop.replace(/\.\.\./g, ' ')));
    });
    Array.from(set).forEach((v) => { if (v.indexOf('to ') === 0) set.add(v.slice(3)); });
    return Array.from(set).filter(Boolean);
  }
  Q.variants = variants;

  function tolFor(len) { return len <= 4 ? 0 : len <= 8 ? 1 : len <= 20 ? 2 : Math.max(3, Math.round(len * 0.1)); }

  /* Compare une saisie à une réponse anglaise : 'ok' | 'typo' | 'ko' */
  Q.checkAgainst = function (input, en) {
    const x = AP.norm(input);
    if (!x) return 'ko';
    let best = 99;
    variants(en).forEach((v) => {
      const d = lev(x, v);
      if (d === 0) best = 0; else if (d <= tolFor(v.length) && best > 0) best = Math.min(best, d);
    });
    return best === 0 ? 'ok' : best < 99 ? 'typo' : 'ko';
  };
  Q.checkTyped = (input, it) => Q.checkAgainst(input, it.en);

  function wordsOf(s) { return s.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean); }

  /* ---------- Distracteurs crédibles ---------- */
  function sim(a, b) {
    const A = AP.norm(a), B = AP.norm(b);
    const wa = new Set(A.split(' ')), wb = B.split(' ');
    let inter = 0; wb.forEach((w) => { if (wa.has(w)) inter++; });
    const jac = inter / (wa.size + wb.length - inter || 1);
    const l = 1 - lev(A.slice(0, 40), B.slice(0, 40)) / Math.max(A.length, B.length, 1);
    return Math.max(jac, l * 0.7);
  }
  function distractors(it, field, n) {
    const ref = AP.norm(it[field]);
    const L = it[field].length;
    const pool = AP.ITEMS.filter((o) => o.id !== it.id && o.kind === it.kind && AP.norm(o[field]) !== ref && o[field].length < 90);
    const scored = pool.map((o) => ({
      o: o,
      s: (o.cat === it.cat ? 0 : o.theme === it.theme ? 12 : 30) + Math.abs(o[field].length - L) * 0.5 - sim(it[field], o[field]) * 30 + Math.random() * 14
    })).sort((a, b) => a.s - b.s);
    const out = []; const seen = {}; seen[ref] = 1;
    for (let i = 0; i < scored.length && out.length < n; i++) {
      const k = AP.norm(scored[i].o[field]);
      if (seen[k]) continue;
      seen[k] = 1; out.push(scored[i].o);
    }
    return out;
  }

  /* ---------- Mots-clés pour les phrases à trous ---------- */
  const STOP = 'a an the to of in on at for and or is are was were be been i you we it my your our this that with from by as if do does did not can will would could should have has had me us them they he she his her its so but about there their what when how who which than then into out up please'.split(' ');
  let vocab = null;
  function buildVocab() {
    if (vocab) return vocab;
    const set = {};
    AP.ITEMS.forEach((it) => {
      const src = (it.kind === 'phrase' ? it.en : '') + ' ' + (it.ex || '');
      src.split(/[^A-Za-z'-]+/).forEach((w) => { const l = w.toLowerCase(); if (l.length >= 4 && STOP.indexOf(l) < 0) set[l] = 1; });
    });
    vocab = Object.keys(set);
    return vocab;
  }
  function gapInfo(sent) {
    const toks = wordsOf(sent);
    const cands = [];
    toks.forEach((t, i) => {
      const w = t.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
      if (w.length >= 4 && STOP.indexOf(w.toLowerCase()) < 0 && !/\d/.test(w)) cands.push({ i: i, w: w });
    });
    if (!cands.length) return null;
    cands.sort((a, b) => b.w.length - a.w.length + (Math.random() - 0.5) * 3);
    const c = cands[0];
    const t = toks[c.i];
    const lead = t.slice(0, t.indexOf(c.w)); const trail = t.slice(t.indexOf(c.w) + c.w.length);
    const out = toks.slice(); out[c.i] = lead + '\u0000' + trail;
    return { text: out.join(' '), target: c.w };
  }
  function wordDistractors(target, n) {
    const v = buildVocab(); const tl = target.toLowerCase();
    const suf = (w) => (/ing$/.test(w) ? 'ing' : /ed$/.test(w) ? 'ed' : /s$/.test(w) ? 's' : /ly$/.test(w) ? 'ly' : '');
    const sc = v.filter((w) => w !== tl).map((w) => ({ w: w, s: Math.abs(w.length - tl.length) * 2 + (suf(w) === suf(tl) ? 0 : 5) + (w[0] === tl[0] ? -2 : 0) + Math.random() * 6 })).sort((a, b) => a.s - b.s);
    return sc.slice(0, n).map((x) => (target[0] === target[0].toUpperCase() ? x.w[0].toUpperCase() + x.w.slice(1) : x.w));
  }

  function clozeInfo(it) {
    if (!it.ex) return null;
    const core = it.en.replace(/\([^)]*\)/g, '').replace(/\.\.\./g, '').replace(/\s+/g, ' ').trim();
    if (core.length < 3) return null;
    const re = new RegExp(core.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (!re.test(it.ex)) return null;
    return { text: it.ex.replace(re, '\u0000'), exfr: it.exfr, target: core };
  }
  function gapSentence(it) { return it.kind === 'phrase' ? it.en : it.ex; }

  /* ---------- Types possibles ---------- */
  Q.types = function (it, level) {
    level = level || 'hard';
    const t = ['mcp-en', 'mcp-fr'];
    const speak = AP.hasSpeech;
    if (speak && it.en.length <= 70) { t.push('listen'); t.push('dictee'); }
    if (it.en.length <= (level === 'normal' ? 38 : 64) && it.en.indexOf('...') < 0) t.push('type');
    const sent = gapSentence(it);
    if (sent) {
      const w = wordsOf(sent).length;
      if (w >= 4 && w <= 14) t.push('order');
      if (w >= 4 && gapInfo(sent)) t.push('gap');
    }
    if (clozeInfo(it)) t.push('cloze');
    return t;
  };

  const BAGS = {
    normal: { 'mcp-en': 5, 'mcp-fr': 5, listen: 2, type: 3, order: 3, cloze: 4, gap: 2, dictee: 1 },
    hard: { 'mcp-en': 1, 'mcp-fr': 2, listen: 2, type: 5, order: 3, cloze: 3, gap: 3, dictee: 3 },
    expert: { 'mcp-en': 0, 'mcp-fr': 1, listen: 0, type: 7, order: 3, cloze: 3, gap: 4, dictee: 4 }
  };
  const GROUPS = { mcp: ['mcp-en', 'mcp-fr'], context: ['cloze', 'gap'], listen: ['listen'], dictee: ['dictee'], type: ['type'], order: ['order'] };

  Q.make = function (id, want, level) {
    level = level || AP.S.settings.level || 'hard';
    const it = AP.BY[id];
    const types = Q.types(it, level);
    let pool = types;
    if (want && want !== 'mix' && GROUPS[want]) {
      const g = types.filter((k) => GROUPS[want].indexOf(k) >= 0);
      if (g.length) pool = g;
    }
    const bag = []; const w = BAGS[level] || BAGS.hard;
    pool.forEach((k) => { const n = want && want !== 'mix' ? 1 : (w[k] == null ? 1 : w[k]); for (let i = 0; i < n; i++) bag.push(k); });
    let type = bag.length ? bag[Math.floor(Math.random() * bag.length)] : (types.indexOf('mcp-fr') >= 0 ? 'mcp-fr' : types[0]);
    const nOpts = level === 'normal' ? 3 : 4;
    const q = { id: id, type: type, level: level };
    const opts = (field, target) => AP.shuffle([it].concat(distractors(it, field, nOpts))).map((o) => ({ id: o.id, text: o[field] }));

    if (type === 'mcp-en' || type === 'mcp-fr') {
      const fromEn = type === 'mcp-en';
      const ansField = fromEn ? 'fr' : 'en';
      q.prompt = fromEn ? it.en : it.fr;
      q.promptLang = fromEn ? 'en' : 'fr';
      q.label = fromEn ? 'Que signifie ?' : 'Comment dit-on en anglais ?';
      q.optLang = ansField; q.opts = opts(ansField); q.correct = it.id;
    } else if (type === 'listen') {
      q.label = 'Écoutez, puis choisissez ce que vous entendez';
      q.optLang = 'en'; q.opts = opts('en'); q.correct = it.id;
    } else if (type === 'dictee') {
      q.label = 'Dictée : écrivez ce que vous entendez';
      q.prompt = ''; q.input = true; q.answerText = it.en;
    } else if (type === 'type') {
      q.label = 'Écrivez en anglais'; q.prompt = it.fr; q.promptLang = 'fr'; q.answerText = it.en;
    } else if (type === 'order') {
      const sent = gapSentence(it);
      q.label = 'Remettez les mots dans l’ordre';
      q.prompt = it.kind === 'phrase' ? it.fr : it.exfr; q.promptLang = 'fr';
      q.sentence = sent; q.tokens = wordsOf(sent);
      let sh = AP.shuffle(q.tokens.map((x, i) => ({ w: x, i: i })));
      if (sh.map((x) => x.w).join(' ') === q.tokens.join(' ')) sh = sh.reverse();
      q.pool = sh;
    } else if (type === 'cloze') {
      const c = clozeInfo(it);
      q.label = 'Complétez avec l’expression'; q.text = c.text; q.prompt = c.exfr; q.promptLang = 'fr'; q.sentence = it.ex;
      if (level === 'expert') { q.input = true; q.answerText = c.target; }
      else { q.optLang = 'en'; q.opts = opts('en'); q.correct = it.id; }
    } else if (type === 'gap') {
      const sent = gapSentence(it);
      const g = gapInfo(sent);
      q.label = 'Complétez avec le mot manquant'; q.text = g.text; q.sentence = sent;
      q.prompt = it.kind === 'phrase' ? it.fr : it.exfr; q.promptLang = 'fr';
      if (level === 'expert') { q.input = true; q.answerText = g.target; }
      else {
        const o = AP.shuffle([g.target].concat(wordDistractors(g.target, nOpts))).map((x) => ({ id: 'w:' + x, text: x }));
        q.optLang = 'en'; q.opts = o; q.correct = 'w:' + g.target;
      }
    }
    return q;
  };
})();
