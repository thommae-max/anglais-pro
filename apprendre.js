/* Anglais pro : onglet Apprendre (Cours, Vocabulaire, Dictionnaire, détail d'une carte) */
(function () {
  'use strict';
  const AP = window.AP, U = AP.UI, E = U.E, I = U.I, A = U.A;
  const pct = (a, b) => (b ? Math.round(a / b * 100) : 0);
  const favCount = () => Object.keys(AP.S.cards).filter((id) => AP.S.cards[id].fav && AP.BY[id]).length;
  const nl = (n, s, p) => n + ' ' + (n > 1 ? p : s);
  const tile = (act, extra, title, desc, right) => '<button class="tile" data-act="' + act + '" ' + extra + '><div class="tt"><span>' + title + '</span><span' + (right ? ' class="pill"' : '') + '>' + (right || '›') + '</span></div>' + (desc ? '<div class="td" style="margin:2px 0 0">' + desc + '</div>' : '') + '</button>';

  /* ---------- Accueil de l'onglet ---------- */
  function hub() {
    const t = AP.totals();
    const th = AP.TH[AP.dayTheme && AP.dayTheme()] || AP.TH.metier;
    const nF = AP.FICHES.length;
    let h = '<div class="h1">Apprendre</div><p class="sub">Trois façons de travailler : suivre un cours, parcourir le vocabulaire par thème, ou chercher un mot.</p>';
    h += '<div class="card" style="margin-top:12px"><div class="td" style="margin:0 0 4px">Par où commencer ?</div><b>' + E(th.name) + '</b><div class="td" style="margin:2px 0 10px">Thème du jour. ' + t.known + ' cartes acquises sur ' + AP.ITEMS.length + '.</div><button class="btn sm" data-act="go" data-to="theme/' + th.id + '">Ouvrir ce thème</button></div>';
    h += '<div class="h2">Explorer</div>';
    h += tile('go', 'data-to="cours"', 'Cours', nl(nF, 'fiche', 'fiches') + ' : grammaire, bureau, téléphone, restaurant…');
    h += tile('go', 'data-to="vocab"', 'Vocabulaire', nl(AP.THEMES.length, 'thème', 'thèmes') + ', ' + AP.ITEMS.length + ' cartes classées par catégorie');
    h += tile('dicogo', '', 'Dictionnaire', 'Chercher un mot ou une phrase, en anglais ou en français');
    h += '<div class="h2">Mes listes</div>';
    h += tile('favs', '', 'Mes favoris', 'Les cartes marquées d’une étoile', String(favCount()));
    h += tile('weak', '', 'À revoir', 'Cartes que vous avez ratées récemment', String(Object.keys(AP.S.cards).filter((id) => AP.BY[id] && AP.S.cards[id].ko > 0 && AP.S.cards[id].b < 3).length));
    U.mount(h);
  }

  /* ---------- Cours ---------- */
  function cours() {
    let h = '<button class="back" data-act="go" data-to="ref">' + I.back + 'Apprendre</button><div class="h1">Cours</div><p class="sub">Les fiches du cours, dans l’ordre. Touchez une ligne pour l’écouter.</p>';
    AP.GROUPS.forEach((g) => {
      h += '<div class="h2">' + E(g.g) + '</div>';
      g.t.forEach((id) => {
        const f = AP.FICHES.find((x) => x.id === id); if (!f) return;
        const n = AP.FICHES.indexOf(f) + 1;
        const rows = (f.blocks || []).reduce((a, b) => a + (b.rows || []).length, 0);
        h += '<button class="tile fiche" data-act="go" data-to="fiche/' + f.id + '"><span class="n">' + n + '</span><div><div class="tt" style="display:block">' + E(f.title.replace(/^Fiche \d+ · /, '')) + '</div><div class="td" style="margin:2px 0 0">' + rows + ' lignes</div></div></button>';
      });
    });
    U.mount(h);
  }

  /* ---------- Vocabulaire : thèmes ---------- */
  function vocab() {
    let h = '<button class="back" data-act="go" data-to="ref">' + I.back + 'Apprendre</button><div class="h1">Vocabulaire</div><p class="sub">Choisissez un thème. La barre montre ce que vous avez déjà acquis.</p>';
    AP.THEMES.forEach((t) => {
      const s = AP.themeStats(t.id);
      h += '<button class="tile" data-act="go" data-to="theme/' + t.id + '"><div class="tt"><span>' + E(t.name) + '</span><span>›</span></div><div class="td" style="margin:2px 0 8px">' + E(t.desc) + '</div>' +
        '<div class="bar"><i class="a" style="width:' + pct(s.known, s.total) + '%"></i></div><div class="td" style="margin:6px 0 0;font-size:13px">' + s.known + ' acquises sur ' + s.total + (s.due ? ' · ' + s.due + ' à revoir' : '') + '</div></button>';
    });
    U.mount(h);
  }

  /* ---------- Détail d'une carte ---------- */
  function carte(parts) {
    const it = AP.BY[parts[1]];
    if (!it) { U.nav('#/dico'); return; }
    const c = AP.S.cards[it.id];
    const st = AP.status(it.id);
    const inRev = c && c.n > 0;
    const th = AP.TH[it.theme];
    let h = '<button class="back" data-act="histback">' + I.back + 'Retour</button>';
    h += '<div class="card" style="text-align:center;padding:22px 16px"><span class="lab">' + AP.KIND[it.kind] + (it.src ? ' · Cours' : '') + '</span><div class="' + U.enCls(it.en) + '" style="margin-top:8px">' + E(it.en) + '</div><div class="fr" style="margin-top:8px">' + E(it.fr) + '</div>' +
      '<div class="center" style="gap:12px;margin-top:14px"><button class="btn sm alt" data-act="say" data-say="' + E(it.en) + '">' + I.spk.replace('<svg', '<svg style="width:18px;height:18px"') + 'Écouter</button><button class="btn sm alt" data-act="sayslow" data-say="' + E(it.en) + '">' + I.slow.replace('<svg', '<svg style="width:18px;height:18px"') + 'Lent</button>' + U.star(it.id) + '</div></div>';
    if (it.ex) h += '<div class="h2">Exemple</div><div class="card"><div class="en" style="font-size:18px">' + E(it.ex) + '</div><div class="td" style="margin:6px 0 0">' + E(it.exfr || '') + '</div></div>';
    h += '<div class="h2">Où il se trouve</div><div class="card"><div class="td" style="margin:0"><b style="display:inline">' + E(it.cat) + '</b>' + (th ? ' · ' + E(th.name) : '') + '</div></div>';
    h += '<div class="h2">Mon apprentissage</div><div class="card"><div class="td" style="margin:0">' + AP.STATUS_LABEL[st] + (inRev ? ' · prochaine révision : ' + (c.due > '2900' ? 'à planifier' : c.due) : ' · pas encore dans vos révisions') + '</div>' +
      (inRev ? '' : '<button class="btn sm" style="margin-top:10px" data-act="addrev" data-id="' + it.id + '">Ajouter à mes révisions</button>') + '</div>';
    if (th) h += '<div style="margin-top:14px">' + tile('go', 'data-to="theme/' + th.id + '"', 'Voir tout le thème « ' + E(th.name) + ' »') + '</div>';
    U.mount(h);
  }

  A.addrev = (el) => { const c = AP.touch(el.dataset.id); c.n = Math.max(c.n, 1); c.due = AP.today(); AP.save(); U.toast('Ajoutée à vos révisions'); carte(['carte', el.dataset.id]); };
  A.favs = () => { const r = U.refState; r.q = ''; r.f = 'fav'; r.th = 'all'; r.lim = 60; U.nav('#/dico'); };
  A.weak = () => { U.nav('#/faibles'); };
  function faibles() {
    const rows = Object.keys(AP.S.cards).filter((id) => AP.BY[id] && AP.S.cards[id].ko > 0 && AP.S.cards[id].b < 3).sort((a, b) => AP.S.cards[b].ko - AP.S.cards[a].ko).map((id) => AP.BY[id]);
    let h = '<button class="back" data-act="go" data-to="ref">' + I.back + 'Apprendre</button><div class="h1">À revoir</div><p class="sub">Cartes ratées et pas encore acquises.</p>';
    h += rows.length ? '<div class="list">' + rows.slice(0, 80).map((i) => U.rowHTML(i)).join('') + '</div><div style="margin-top:14px"><button class="btn" data-act="hardquiz">Les retravailler en quiz</button></div>' : '<div class="empty">Aucune carte à revoir pour l’instant.</div>';
    U.mount(h);
  }

  /* Le dictionnaire repart sans filtre quand on y entre depuis l'accueil */
  A.dicogo = () => { A.dicoreset(); U.nav('#/dico'); };
  A.dicoreset = () => { const r = U.refState; r.q = ''; r.f = 'all'; r.th = 'all'; r.lim = 60; };
  U.addRoute('ref', 'ref', hub);
  U.addRoute('cours', 'ref', cours);
  U.addRoute('vocab', 'ref', vocab);
  U.addRoute('dico', 'ref', () => U.dico());
  U.addRoute('carte', 'ref', carte);
  U.addRoute('faibles', 'ref', faibles);
})();
