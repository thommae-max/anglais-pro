/* Anglais pro : entraînement avec un partenaire + jeux de rôle */
(function () {
  'use strict';
  const AP = window.AP, U = AP.UI, E = U.E, I = U.I, A = U.A;

  const SCOPES = [['seen', 'Ce que j’ai vu'], ['due', 'À revoir'], ['hard', 'Mes difficiles'], ['fav', 'Favoris'], ['all', 'Tout']];
  const DIRS = [['fr', 'Il lit le français'], ['en', 'Il lit l’anglais'], ['mix', 'Mélangé']];
  const st = { tab: 'qa', scope: 'seen', dir: 'fr', n: 10, count: false, run: null, role: null, checks: {} };

  const ROLES = [
    { id: 'comex', t: 'Présenter les chiffres annuels au comité de direction', ctx: 'Vous présentez les résultats de l’année (ARR, rétention, écart au budget) et le plan de l’an prochain.', who: 'Directeur général ou directeur financier : il veut des chiffres nets, des causes et une décision.',
      qs: ['Walk us through the key figures for the year.', 'How did net revenue retention evolve compared with last year?', 'What explains the gap between budget and actual?', 'Which risks could affect next year’s plan?', 'What do you need from the committee to execute the plan?'],
      voc: ['ARR grew 28% year over year.', 'Net revenue retention stands at 108%.', 'The variance is mainly driven by two large renewals.', 'I would like to highlight three points.', 'Our priorities are retention and expansion.', 'We are asking the committee to approve the plan.'] },
    { id: 'discovery', t: 'Appel de découverte avec un prospect en santé numérique', ctx: 'Premier appel avec la direction d’un établissement de santé. Vous qualifiez le besoin et rassurez sur les données.', who: 'Directeur d’hôpital : prudent, sensible à la sécurité des données et au calendrier des marchés publics.',
      qs: ['Can you tell us a bit about your company?', 'How is your solution different from what we use today?', 'How do you handle patient data and GDPR?', 'What does implementation look like?', 'What is your pricing model?'],
      voc: ['What does success look like for you?', 'Who else needs to be involved in this decision?', 'Patient data never leaves the secured environment.', 'Our solution is hosted on a certified health data platform.', 'Public procurement cycles can take six to twelve months.', 'Can we agree on next steps before we hang up?'] },
    { id: 'negociation', t: 'Négocier une remise en fin de trimestre', ctx: 'Le client veut baisser le prix. Vous protégez la valeur et cherchez une contrepartie.', who: 'Responsable achats : dur en négociation, demande toujours un geste supplémentaire.',
      qs: ['Your price is 15% above our budget. Can you do better?', 'We would prefer a three-year deal at a lower price. What can you offer?', 'Why should we sign before the end of the quarter?', 'Our legal team has some redlines on the liability clause.', 'What happens if we are not satisfied after six months?'],
      voc: ['I can offer a discount in exchange for a longer commitment.', 'Let me check with my leadership.', 'What would you need to sign this month?', 'We can sign by the end of the month if legal approves.', 'The payment terms are thirty days.', 'I’ll send you a revised proposal by Friday.'] },
    { id: 'pipeline', t: 'Revue de pipeline avec le CEO', ctx: 'Vous défendez vos prévisions du trimestre et expliquez où sont les risques.', who: 'CEO : veut de la franchise sur les affaires à risque et sur la couverture du trimestre suivant.',
      qs: ['Where are we against the quarterly target?', 'Which deals are most at risk?', 'How confident are you in the commit?', 'What is your pipeline coverage for next quarter?', 'What help do you need from me?'],
      voc: ['We are tracking at 92% of target.', 'We have three times pipeline coverage for the quarter.', 'This deal has stalled because we are single-threaded.', 'I am confident we will land this deal this quarter.', 'We need to focus on the deals most likely to close.', 'I would like your help with an executive introduction.'] },
    { id: 'entretien', t: 'Entretien de recrutement (poste de direction commerciale)', ctx: 'Entretien en anglais pour un poste de direction commerciale. Phrases modèles à adapter à votre vrai parcours.', who: 'Recruteur ou futur manager : cherche des faits, des résultats chiffrés et une méthode.',
      qs: ['Tell me about yourself and your background.', 'What was your biggest achievement in your last role?', 'How do you build and coach a sales team?', 'Tell me about a deal you lost and what you learned.', 'Why do you want to join us?'],
      voc: ['I have led commercial teams in B2B SaaS.', 'I scaled revenue by focusing on retention and expansion.', 'My approach is to set clear targets and coach weekly.', 'What I learned from that deal is to involve the decision-maker earlier.', 'I am looking for a role with more ownership.', 'Let me give you a concrete example.'] },
    { id: 'equipe', t: 'Présenter le plan commercial à l’équipe', ctx: 'Vous annoncez les objectifs, les territoires et la rémunération variable de l’année.', who: 'Commercial de l’équipe : pose des questions directes sur les quotas et la rémunération.',
      qs: ['How will the new territories be assigned?', 'What changes in the compensation plan?', 'What are the top priorities for the first quarter?', 'How will you measure our progress?'],
      voc: ['The new quota is based on last year’s attainment.', 'The accelerator starts above one hundred percent.', 'Our top priority is to build pipeline early in the quarter.', 'We will review progress in our weekly one-to-ones.', 'Please let me know if anything is unclear.'] },
    { id: 'renouvellement', t: 'Renouvellement avec un client à risque', ctx: 'Un client hésite à renouveler. Vous écoutez, reformulez et proposez un plan d’action.', who: 'Directeur client : mécontent de l’adoption, tenté par un concurrent moins cher.',
      qs: ['We are not sure we are getting enough value from the product.', 'Adoption has been low in two departments.', 'A competitor has offered us a lower price.', 'What would you do differently over the next year?'],
      voc: ['I would like to understand your priorities.', 'Let me summarize what I heard.', 'Our goal is to shorten the time to value.', 'I suggest a joint action plan for the next ninety days.', 'We would like to make this renewal a success for both sides.'] },
    { id: 'partenaire', t: 'Réunion avec un partenaire de distribution', ctx: 'Vous discutez de la collaboration, des marges et du soutien commercial.', who: 'Responsable partenariats : veut de bonnes marges, de la formation et des leads.',
      qs: ['How do you see our partnership evolving?', 'What margin do you offer your resellers?', 'How will you support our sales team?', 'What does a successful first year look like?'],
      voc: ['We would like to build a joint go-to-market plan.', 'We can provide training and sales material.', 'Let’s agree on shared targets for the first year.', 'We will refer qualified leads to you.', 'How do you want to handle deal registration?'] },
    { id: 'reseau', t: 'Se présenter lors d’un événement professionnel', ctx: 'Conversation courte et naturelle avec quelqu’un que vous rencontrez pour la première fois.', who: 'Participant à un salon : curieux, pose des questions simples et rebondit sur vos réponses.',
      qs: ['What do you do?', 'How long have you been in sales?', 'What are you working on at the moment?', 'What brings you to this event?'],
      voc: ['I lead commercial teams in B2B SaaS.', 'I mostly work with enterprise customers.', 'I am currently exploring new opportunities.', 'It was great meeting you.', 'Let’s keep in touch. Here is my contact.'] },
    { id: 'telephone', t: 'Au téléphone : déplacer un rendez-vous, gérer un imprévu', ctx: 'Appel professionnel où vous devez reporter une réunion et demander des précisions.', who: 'Interlocuteur occupé : parle vite, donne peu de détails, vous fait répéter.',
      qs: ['I’m afraid I can’t make Thursday. Could we move it?', 'Could you send me the agenda beforehand?', 'Sorry, the line is bad. Could you repeat that?', 'Shall we say Monday at ten?'],
      voc: ['Could we reschedule for early next week?', 'I’ll send you a calendar invite.', 'Let me double-check my calendar.', 'Could you spell that, please?', 'Sorry, I didn’t catch that.'] }
  ];
  const CHECKS = ['Réponses structurées : idée, raison, exemple', 'Au moins 5 expressions de la liste utilisées', 'Chiffres et noms dits clairement', 'Sait demander de répéter ou relancer sans bloquer', 'Prononciation claire des mots clés'];

  const lvl = (s) => s;
  function pool() { return U.poolFor(st.scope); }

  function shareText(items) {
    const lines = ['ENTRAÎNEMENT D’ANGLAIS : liste de questions', 'Consigne : lisez chaque question à voix haute, Maëva répond à l’oral. Les réponses attendues sont en fin de document.', ''];
    items.forEach((it, i) => {
      const fromFr = st.dir === 'fr' || (st.dir === 'mix' && i % 2 === 0);
      lines.push((i + 1) + '. ' + (fromFr ? 'Dites en anglais : ' + it.fr : 'Traduisez en français : ' + it.en));
    });
    lines.push('', 'RÉPONSES ATTENDUES');
    items.forEach((it, i) => {
      const fromFr = st.dir === 'fr' || (st.dir === 'mix' && i % 2 === 0);
      lines.push((i + 1) + '. ' + (fromFr ? it.en : it.fr) + (it.ex ? '   (ex. : ' + it.ex + ')' : ''));
    });
    return lines.join('\n');
  }
  function shareOrCopy(text, title) {
    if (navigator.share) { navigator.share({ title: title, text: text }).catch(() => {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => U.toast('Texte copié'), () => prompt('Copiez ce texte :', text));
    else prompt('Copiez ce texte :', text);
  }
  function pickItems() {
    let items = pool();
    items = items.map((i) => ({ i: i, s: (AP.S.cards[i.id] ? AP.S.cards[i.id].b : 2.5) + Math.random() * 3 - (AP.isHard(i.id) ? 1.5 : 0) })).sort((a, b) => a.s - b.s).map((x) => x.i);
    return items.slice(0, st.n);
  }

  /* ---------- Écran de réglage ---------- */
  function view() {
    if (st.run) return viewRun();
    let h = '<button class="back" data-act="go" data-to="parler">' + I.back + 'Parler</button><div class="h1">Avec un partenaire</div>';
    h += '<div class="seg"><button class="' + (st.tab === 'qa' ? 'on' : '') + '" data-act="ptab" data-v="qa">Questions à l’oral</button><button class="' + (st.tab === 'role' ? 'on' : '') + '" data-act="ptab" data-v="role">Jeux de rôle</button></div>';
    if (st.tab === 'role') return U.mount(h + rolesList());
    const items = pool();
    h += '<div class="card"><b>Comment ça marche</b><p class="sub" style="font-size:14px;margin-top:4px">Donnez le téléphone à la personne qui vous fait réviser. Elle lit la question à voix haute, vous répondez à l’oral, puis elle affiche la bonne réponse et note votre réponse. Aucune connaissance de l’anglais n’est nécessaire pour noter.</p></div>';
    h += '<div class="h2">Sur quoi ?</div><div class="chips wrap">' + SCOPES.map((s) => '<button class="chip' + (st.scope === s[0] ? ' on' : '') + '" data-act="pset" data-k="scope" data-v="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>';
    h += '<div class="chips wrap">' + AP.THEMES.map((t) => '<button class="chip' + (st.scope === 'th:' + t.id ? ' on' : '') + '" data-act="pset" data-k="scope" data-v="th:' + t.id + '">' + E(t.name) + '</button>').join('') + '</div>';
    h += '<div class="h2">Que lit le partenaire ?</div><div class="chips wrap">' + DIRS.map((s) => '<button class="chip' + (st.dir === s[0] ? ' on' : '') + '" data-act="pset" data-k="dir" data-v="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>';
    h += '<div class="h2">Nombre de questions</div><div class="chips wrap">' + [10, 20, 30].map((n) => '<button class="chip' + (st.n === n ? ' on' : '') + '" data-act="pset" data-k="n" data-v="' + n + '">' + n + '</button>').join('') + '</div>';
    h += '<div class="list" style="margin-top:14px"><div class="set"><div class="l"><b>Compter dans ma progression</b><span>Les résultats mettent à jour mes révisions</span></div><button class="sw ' + (st.count ? 'on' : '') + '" data-act="pcount" role="switch" aria-checked="' + st.count + '" aria-label="Compter dans ma progression"></button></div></div>';
    h += '<div style="margin-top:20px" class="stack"><button class="btn accent" data-act="pstart"' + (items.length >= 3 ? '' : ' disabled') + '>Commencer</button><button class="btn alt" data-act="pshare"' + (items.length >= 3 ? '' : ' disabled') + '>Partager la liste de questions</button>' +
      '<p class="help" style="text-align:center">' + (items.length >= 3 ? items.length + ' cartes disponibles. « Partager » envoie une feuille questions et réponses (message, e-mail, impression).' : 'Pas assez de cartes pour ce choix : faites d’abord une session ou choisissez « Tout ».') + '</p></div>';
    U.mount(h);
  }

  function rolesList() {
    let h = '<p class="sub" style="margin-bottom:10px">Dix situations de votre métier. Le partenaire joue l’interlocuteur et pose les questions ; vous pouvez aussi vous entraîner seule avec la voix de l’app.</p>';
    ROLES.forEach((r) => { h += '<button class="tile" data-act="prole" data-id="' + r.id + '"><div class="tt"><span>' + E(r.t) + '</span><span>›</span></div><div class="td" style="margin:2px 0 0">' + E(r.ctx) + '</div></button>'; });
    return h;
  }

  function viewRole(id) {
    const r = ROLES.find((x) => x.id === id);
    if (!r) { st.role = null; return view(); }
    st.role = id;
    const ck = st.checks[id] || (st.checks[id] = {});
    let h = '<button class="back" data-act="prole" data-id="">' + I.back + 'Jeux de rôle</button><div class="h1" style="font-size:24px">' + E(r.t) + '</div>';
    h += '<div class="card"><b>Situation</b><p class="sub" style="font-size:14px;margin-top:4px">' + E(r.ctx) + '</p><p class="sub" style="font-size:14px;margin-top:8px"><b style="display:inline;color:var(--ink)">Rôle du partenaire :</b> ' + E(r.who) + '</p></div>';
    h += '<div class="h2">Questions du partenaire</div><div class="list">' + r.qs.map((q, i) => '<div class="row"><span class="dot" style="background:var(--accent)"></span><div class="rt"><b style="font-family:var(--sans);font-size:16px">' + (i + 1) + '. ' + E(q) + '</b></div>' + U.spk(q, 'sm') + '</div>').join('') + '</div>';
    h += '<p class="help">Le partenaire pose les questions dans l’ordre, relance si la réponse est courte, et coupe parfois pour demander un exemple ou un chiffre. Seule : touchez le haut-parleur pour entendre la question.</p>';
    h += '<div class="h2">Expressions à placer</div><div class="list">' + r.voc.map((q) => '<div class="row"><div class="rt"><b style="font-family:var(--sans);font-size:16px">' + E(q) + '</b></div>' + U.spk(q, 'sm') + '</div>').join('') + '</div>';
    h += '<div class="h2">Grille du partenaire</div><div class="list">' + CHECKS.map((c, i) => '<div class="set"><div class="l"><b style="font-size:15px">' + E(c) + '</b></div><button class="sw ' + (ck[i] ? 'on' : '') + '" data-act="pcheck" data-id="' + id + '" data-i="' + i + '" role="switch" aria-checked="' + !!ck[i] + '" aria-label="' + E(c) + '"></button></div>').join('') + '</div>';
    h += '<p class="help" style="text-align:center">' + Object.keys(ck).filter((k) => ck[k]).length + ' / ' + CHECKS.length + ' critères réussis</p>';
    h += '<div style="margin-top:14px" class="stack"><button class="btn alt" data-act="proleshare" data-id="' + id + '">Partager la fiche au partenaire</button><button class="btn ghost" data-act="pcheckreset" data-id="' + id + '">Recommencer la grille</button></div>';
    U.mount(h);
  }

  /* ---------- Séance questions/réponses ---------- */
  function startRun() {
    const items = pickItems();
    if (items.length < 3) { U.toast('Pas assez de cartes'); return; }
    st.run = { items: items.map((i) => i.id), i: 0, shown: false, score: 0, ok: 0, mid: 0, ko: 0, missed: [], done: false };
    viewRun();
  }
  function fromFr(i) { return st.dir === 'fr' || (st.dir === 'mix' && i % 2 === 0); }

  function viewRun() {
    const r = st.run;
    if (r.done) return viewResult();
    const it = AP.BY[r.items[r.i]];
    const ff = fromFr(r.i);
    let h = '<div class="sbar"><button class="close" data-act="pquit" aria-label="Quitter">' + I.x + '</button><div class="bar"><i style="width:' + (r.i / r.items.length * 100) + '%"></i></div><div class="cnt">' + (r.i + 1) + '/' + r.items.length + '</div></div>';
    h += '<div class="phase"><span class="ph quiz">Partenaire : lisez à voix haute</span></div><div class="stage">';
    h += '<div class="flash"><span class="lab">' + (ff ? 'Dites en anglais' : 'Traduisez en français') + '</span>' + (ff ? '<div class="fr" style="font-size:26px;margin-top:0">' + E(it.fr) + '</div>' : '<div class="' + U.enCls(it.en) + '">' + E(it.en) + '</div>') + '</div>';
    if (r.shown) {
      h += '<div class="flash" style="border-color:var(--accent)"><span class="lab ok">Réponse attendue</span>' + (ff ? '<div class="' + U.enCls(it.en) + '">' + E(it.en) + '</div><div class="center">' + U.spk(it.en) + '</div>' : '<div class="fr" style="font-size:24px;margin-top:0">' + E(it.fr) + '</div>') +
        (it.ex ? '<div class="ex">' + E(it.ex) + '<em>' + E(it.exfr || '') + '</em></div>' : '') + '</div>';
    }
    h += '</div><div class="dock">';
    if (!r.shown) h += '<button class="btn" data-act="pshow">Afficher la réponse</button>';
    else h += '<div class="grades"><button class="grade ko" data-act="pgrade" data-r="ko">À revoir</button><button class="grade mid" data-act="pgrade" data-r="mid">Presque</button><button class="grade ok" data-act="pgrade" data-r="ok">Juste</button></div>';
    h += '</div>';
    U.mount(h, true);
  }

  function viewResult() {
    const r = st.run; const n = r.items.length;
    const pct = r.score / n;
    let h = '<div class="sbar"><span></span></div><div class="stage"><div class="flash"><span class="lab ok">Séance terminée</span><div class="score">' + (Math.round(r.score * 2) / 2) + '<small>/' + n + '</small></div><div class="fr muted" style="margin-top:6px">' + r.ok + ' justes · ' + r.mid + ' presque · ' + r.ko + ' à revoir</div><div class="fr" style="font-size:17px;margin-top:10px">' + (pct >= .85 ? 'Très solide.' : pct >= .65 ? 'Bonne base, à consolider.' : 'À retravailler : ces cartes reviendront dans vos révisions.') + '</div>';
    if (r.missed.length) h += '<div class="missed"><div class="h2" style="margin:8px 0">À retenir</div>' + r.missed.map((id) => U.rowHTML(AP.BY[id], { plain: true })).join('') + '</div>';
    h += '</div></div><div class="dock">' + (r.missed.length ? '<button class="btn accent" data-act="predo">Refaire les ratés</button>' : '') + '<button class="btn alt" data-act="pshareres">Partager le résultat</button><button class="btn alt" data-act="pend">Terminer</button></div>';
    U.mount(h, true);
  }

  /* ---------- Actions ---------- */
  A.ptab = (el) => { st.tab = el.dataset.v; st.role = null; view(); };
  A.pset = (el) => { const k = el.dataset.k; st[k] = k === 'n' ? Number(el.dataset.v) : el.dataset.v; view(); };
  A.pcount = () => { st.count = !st.count; view(); };
  A.pstart = () => startRun();
  A.pshare = () => { const items = pickItems(); shareOrCopy(shareText(items), 'Questions d’anglais'); };
  A.pquit = () => { st.run = null; view(); };
  A.pend = () => { st.run = null; view(); };
  A.pshow = () => { st.run.shown = true; U.rerenderNoAnim(); viewRun(); };
  A.pgrade = (el) => {
    const r = st.run; const id = r.items[r.i]; const g = el.dataset.r;
    if (g === 'ok') { r.score += 1; r.ok += 1; } else if (g === 'mid') { r.score += 0.5; r.mid += 1; } else { r.ko += 1; }
    if (g !== 'ok' && r.missed.indexOf(id) < 0) r.missed.push(id);
    if (st.count) AP.grade(id, g);
    r.i += 1; r.shown = false;
    if (r.i >= r.items.length) r.done = true;
    viewRun();
  };
  A.predo = () => { const ids = st.run.missed.slice(); st.run = { items: AP.shuffle(ids), i: 0, shown: false, score: 0, ok: 0, mid: 0, ko: 0, missed: [], done: false }; viewRun(); };
  A.pshareres = () => {
    const r = st.run;
    const t = 'Séance d’entraînement : ' + (Math.round(r.score * 2) / 2) + ' / ' + r.items.length + '\nÀ revoir :\n' + r.missed.map((id) => '- ' + AP.BY[id].en + ' = ' + AP.BY[id].fr).join('\n');
    shareOrCopy(t, 'Résultat d’entraînement');
  };
  A.prole = (el) => { if (!el.dataset.id) { st.role = null; st.tab = 'role'; view(); } else viewRole(el.dataset.id); };
  A.pcheck = (el) => { const ck = st.checks[el.dataset.id] || (st.checks[el.dataset.id] = {}); ck[el.dataset.i] = !ck[el.dataset.i]; U.rerenderNoAnim(); viewRole(el.dataset.id); };
  A.pcheckreset = (el) => { st.checks[el.dataset.id] = {}; viewRole(el.dataset.id); };
  A.proleshare = (el) => {
    const r = ROLES.find((x) => x.id === el.dataset.id);
    const t = 'JEU DE RÔLE : ' + r.t + '\n\nSituation : ' + r.ctx + '\nVotre rôle (partenaire) : ' + r.who + '\n\nQuestions à poser dans l’ordre :\n' + r.qs.map((q, i) => (i + 1) + '. ' + q).join('\n') + '\n\nExpressions que Maëva doit placer :\n' + r.voc.map((q) => '- ' + q).join('\n') + '\n\nGrille d’évaluation :\n' + CHECKS.map((c) => '[ ] ' + c).join('\n');
    shareOrCopy(t, r.t);
  };

  A.pgoto = (el) => { st.tab = el.dataset.v; U.nav('#/partner'); };
  U.addRoute('partner', 'quiz', view);
})();
