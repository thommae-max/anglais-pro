/* Anglais pro : génération des questions de quiz */
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
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
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

  /* Résultat de saisie : 'ok' | 'typo' | 'ko' */
  Q.checkTyped = function (input, it) {
    const x = AP.norm(input);
    if (!x) return 'ko';
    const vs = variants(it.en);
    let best = 99;
    vs.forEach((v) => {
      const d = lev(x, v);
      const tol = v.length <= 4 ? 0 : v.length <= 8 ? 1 : v.length <= 20 ? 2 : 3;
      if (d === 0) best = 0; else if (d <= tol && best > 0) best = Math.min(best, d);
    });
    return best === 0 ? 'ok' : best < 99 ? 'typo' : 'ko';
  };

  function wordsOf(s) { return s.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean); }

  function distractors(it, field, n) {
    const ref = AP.norm(it[field]);
    const L = it[field].length;
    const pool = AP.ITEMS.filter((o) => o.id !== it.id && o.kind === it.kind && AP.norm(o[field]) !== ref && o[field].length < 90);
    const scored = pool.map((o) => ({
      o: o,
      s: (o.cat === it.cat ? 0 : o.theme === it.theme ? 18 : 40) + Math.abs(o[field].length - L) * 0.6 + Math.random() * 16
    })).sort((a, b) => a.s - b.s);
    const out = []; const seen = {};
    seen[ref] = 1;
    for (let i = 0; i < scored.length && out.length < n; i++) {
      const k = AP.norm(scored[i].o[field]);
      if (seen[k]) continue;
      seen[k] = 1; out.push(scored[i].o);
    }
    return out;
  }

  function clozeInfo(it) {
    if (!it.ex) return null;
    const core = it.en.replace(/\([^)]*\)/g, '').replace(/\.\.\./g, '').replace(/\s+/g, ' ').trim();
    if (core.length < 3) return null;
    const esc = core.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(esc, 'i');
    if (!re.test(it.ex)) return null;
    return { text: it.ex.replace(re, '\u0000'), exfr: it.exfr };
  }

  /* Types éligibles pour un item */
  Q.types = function (it) {
    const t = ['mcp-en', 'mcp-fr'];
    if (AP.hasSpeech && it.en.length <= 70) t.push('listen');
    if (it.en.length <= 38 && it.en.indexOf('...') < 0 && it.kind !== 'phrase') t.push('type');
    if (it.kind === 'phrase' && it.en.length <= 38) t.push('type');
    const sent = it.kind === 'phrase' ? it.en : it.ex;
    if (sent) { const w = wordsOf(sent).length; if (w >= 4 && w <= 12) t.push('order'); }
    if (clozeInfo(it)) t.push('cloze');
    return t;
  };

  Q.make = function (id, want) {
    const it = AP.BY[id];
    let types = Q.types(it);
    let type;
    if (want && want !== 'mix' && types.indexOf(want) >= 0) type = want;
    else if (want && want !== 'mix' && want === 'mcp') type = Math.random() < 0.5 ? 'mcp-en' : 'mcp-fr';
    else {
      const wl = { 'mcp-en': 5, 'mcp-fr': 5, listen: 2, type: 3, order: 3, cloze: 4 };
      const bag = [];
      types.forEach((k) => { for (let i = 0; i < wl[k]; i++) bag.push(k); });
      type = bag[Math.floor(Math.random() * bag.length)];
    }
    const q = { id: id, type: type };
    if (type === 'mcp-en' || type === 'mcp-fr') {
      // mcp-en : on voit l'anglais, on choisit le français ; mcp-fr : l'inverse
      const fromEn = type === 'mcp-en';
      const ansField = fromEn ? 'fr' : 'en';
      const ds = distractors(it, ansField, 3);
      q.prompt = fromEn ? it.en : it.fr;
      q.promptLang = fromEn ? 'en' : 'fr';
      q.label = fromEn ? 'Que signifie ?' : 'Comment dit-on en anglais ?';
      q.optLang = ansField;
      q.opts = AP.shuffle([it].concat(ds)).map((o) => ({ id: o.id, text: o[ansField] }));
      q.correct = it.id;
    } else if (type === 'listen') {
      const ds = distractors(it, 'en', 3);
      q.label = 'Écoutez, puis choisissez ce que vous entendez';
      q.optLang = 'en';
      q.opts = AP.shuffle([it].concat(ds)).map((o) => ({ id: o.id, text: o.en }));
      q.correct = it.id;
    } else if (type === 'type') {
      q.label = 'Écrivez en anglais';
      q.prompt = it.fr; q.promptLang = 'fr';
    } else if (type === 'order') {
      const sent = it.kind === 'phrase' ? it.en : it.ex;
      q.label = 'Remettez les mots dans l’ordre';
      q.prompt = it.kind === 'phrase' ? it.fr : it.exfr; q.promptLang = 'fr';
      q.sentence = sent;
      q.tokens = wordsOf(sent);
      let sh = AP.shuffle(q.tokens.map((w, i) => ({ w: w, i: i })));
      if (sh.map((x) => x.w).join(' ') === q.tokens.join(' ')) sh = sh.reverse();
      q.pool = sh;
    } else if (type === 'cloze') {
      const c = clozeInfo(it);
      const ds = distractors(it, 'en', 3);
      q.label = 'Complétez la phrase';
      q.text = c.text; q.prompt = c.exfr; q.promptLang = 'fr';
      q.optLang = 'en';
      q.opts = AP.shuffle([it].concat(ds)).map((o) => ({ id: o.id, text: o.en }));
      q.correct = it.id;
    }
    return q;
  };
})();
