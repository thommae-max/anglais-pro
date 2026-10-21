/* Anglais pro : entraînement à l'oral (s'enregistrer, se réécouter, comparer) */
(function () {
  'use strict';
  const AP = window.AP, U = AP.UI, E = U.E, I = U.I, A = U.A;

  const SCOPES = [['metier', 'Mon métier'], ['entreprise', 'Entreprise au quotidien'], ['quotidien', 'Quotidien et oral'], ['expressions', 'Expressions'], ['seen', 'Ce que j’ai vu']];
  const MODES = [['see', 'Je lis l’anglais à voix haute'], ['say', 'Je dis la phrase depuis le français']];
  const st = { scope: 'metier', mode: 'see', n: 8, run: null };
  const rc = { stream: null, rec: null, chunks: [], recording: false, t0: 0, timer: null, audio: null };
  const supported = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

  function pool() {
    let items = AP.ITEMS.filter((i) => i.en.length <= 90);
    if (st.scope === 'seen') items = items.filter((i) => !AP.unseen(i));
    else if (st.scope === 'expressions') items = items.filter((i) => i.kind === 'expression');
    else items = items.filter((i) => i.theme === st.scope && i.kind !== 'word' && i.en.split(' ').length >= 3);
    return items;
  }

  function view() {
    if (st.run) return viewRun();
    const items = pool();
    let h = '<button class="back" data-act="go" data-to="parler">' + I.back + 'Parler</button><div class="h1">À l’oral</div>';
    h += '<div class="card"><b>Comment ça marche</b><p class="sub" style="font-size:14px;margin-top:4px">Écoutez le modèle, enregistrez-vous, réécoutez-vous et comparez. Vous notez vous-même votre prononciation. Les enregistrements restent sur votre téléphone et disparaissent quand vous fermez l’app.</p></div>';
    if (!supported()) h += '<div class="note" style="margin-top:12px"><b>Micro indisponible</b>Ce navigateur ne permet pas l’enregistrement. Ouvrez l’app depuis l’icône de l’écran d’accueil sur iPhone (iOS 16.4 ou plus récent).</div>';
    h += '<div class="h2">Quoi dire ?</div><div class="chips wrap">' + SCOPES.map((s) => '<button class="chip' + (st.scope === s[0] ? ' on' : '') + '" data-act="oset" data-k="scope" data-v="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>';
    h += '<div class="h2">Comment ?</div><div class="chips wrap">' + MODES.map((s) => '<button class="chip' + (st.mode === s[0] ? ' on' : '') + '" data-act="oset" data-k="mode" data-v="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>';
    h += '<p class="help" style="margin-top:0">' + (st.mode === 'see' ? 'Niveau accessible : vous travaillez la prononciation et le rythme.' : 'Niveau plus difficile : vous retrouvez la phrase de mémoire avant de voir la réponse.') + '</p>';
    h += '<div class="h2">Nombre de phrases</div><div class="chips wrap">' + [5, 8, 12].map((n) => '<button class="chip' + (st.n === n ? ' on' : '') + '" data-act="oset" data-k="n" data-v="' + n + '">' + n + '</button>').join('') + '</div>';
    h += '<div style="margin-top:20px"><button class="btn accent" data-act="ostart"' + (items.length >= 3 && supported() ? '' : ' disabled') + '>Commencer</button><p class="help" style="text-align:center">' + (items.length >= 3 ? items.length + ' phrases disponibles' : 'Pas assez de phrases pour ce choix : faites d’abord quelques sessions.') + '</p></div>';
    U.mount(h);
  }

  function start() {
    let items = pool();
    items = AP.shuffle(items).slice(0, st.n);
    st.run = { ids: items.map((i) => i.id), i: 0, urls: {}, rated: {}, shown: false, ok: 0, mid: 0, ko: 0, done: false, err: '' };
    viewRun();
  }

  function stopTracks() { if (rc.stream) { rc.stream.getTracks().forEach((t) => t.stop()); rc.stream = null; } }
  function stopRec(discard) {
    clearInterval(rc.timer);
    if (rc.recording && rc.rec) { rc.discard = !!discard; try { rc.rec.stop(); } catch (e) { stopTracks(); } }
    rc.recording = false;
  }
  async function startRec() {
    const r = st.run;
    AP.stopSpeech();
    if (rc.audio) { try { rc.audio.pause(); } catch (e) { /* ignore */ } }
    try {
      rc.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) { r.err = 'Micro refusé. Autorisez-le dans Réglages iPhone > Safari (ou Anglais pro) > Micro, puis réessayez.'; viewRun(); return; }
    const mime = window.MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '');
    rc.chunks = [];
    try { rc.rec = mime ? new MediaRecorder(rc.stream, { mimeType: mime }) : new MediaRecorder(rc.stream); }
    catch (e) { stopTracks(); r.err = 'Enregistrement impossible sur cet appareil.'; viewRun(); return; }
    const idx = r.i;
    rc.rec.ondataavailable = (ev) => { if (ev.data && ev.data.size) rc.chunks.push(ev.data); };
    rc.rec.onstop = () => {
      stopTracks();
      if (!rc.discard && rc.chunks.length && st.run) {
        const blob = new Blob(rc.chunks, { type: rc.rec.mimeType || mime || 'audio/mp4' });
        if (st.run.urls[idx]) URL.revokeObjectURL(st.run.urls[idx]);
        st.run.urls[idx] = URL.createObjectURL(blob);
      }
      rc.discard = false;
      if (st.run && location.hash === '#/oral') { U.rerenderNoAnim(); viewRun(); }
    };
    r.err = '';
    rc.rec.start();
    rc.recording = true; rc.t0 = Date.now();
    U.rerenderNoAnim(); viewRun();
    rc.timer = setInterval(() => {
      const s = Math.round((Date.now() - rc.t0) / 1000);
      const el = document.getElementById('rtime'); if (el) el.textContent = s + ' s';
      if (s >= 30) stopRec();
    }, 500);
  }

  function viewRun() {
    const r = st.run;
    if (r.done) return viewEnd();
    const it = AP.BY[r.ids[r.i]];
    const url = r.urls[r.i];
    const say = st.mode === 'say';
    const reveal = !say || r.shown || !!url;
    let h = '<div class="sbar"><button class="close" data-act="oquit" aria-label="Quitter">' + I.x + '</button><div class="bar"><i style="width:' + (r.i / r.ids.length * 100) + '%"></i></div><div class="cnt">' + (r.i + 1) + '/' + r.ids.length + '</div></div>';
    h += '<div class="phase"><span class="ph learn">' + (say ? 'Dites-le de mémoire' : 'Lisez à voix haute') + '</span></div><div class="stage">';
    h += '<div class="flash">' + (say ? '<div class="fr" style="font-size:24px;margin-top:0">' + E(it.fr) + '</div>' : '<div class="' + U.enCls(it.en) + '">' + E(it.en) + '</div><div class="fr muted" style="font-size:17px">' + E(it.fr) + '</div>');
    if (say && reveal) h += '<div class="ex" style="border-top:1px dashed var(--line)"><span class="' + U.enCls(it.en) + '" style="font-size:21px">' + E(it.en) + '</span></div>';
    h += '<div class="center" style="gap:12px;margin-top:14px">' + (reveal ? '<button class="btn sm alt" data-act="omodel" data-s="' + E(it.en) + '">' + I.spk.replace('<svg', '<svg style="width:18px;height:18px"') + 'Modèle</button><button class="btn sm alt" data-act="omodelslow" data-s="' + E(it.en) + '">' + I.slow.replace('<svg', '<svg style="width:18px;height:18px"') + 'Lent</button>' : '<button class="btn sm alt" data-act="oshow">Voir la phrase</button>') + '</div></div>';
    if (r.err) h += '<div class="fb ko">' + E(r.err) + '</div>';
    if (rc.recording) h += '<div class="rec"><span class="dotrec"></span><b>Enregistrement</b> <span id="rtime">0 s</span></div>';
    else if (url) h += '<div class="center" style="gap:12px"><button class="btn sm" data-act="oplay">' + I.play.replace('<svg', '<svg style="width:18px;height:18px"') + 'Me réécouter</button><button class="btn sm ghost" data-act="orec">Refaire</button></div>';
    h += '</div><div class="dock">';
    if (rc.recording) h += '<button class="btn" style="background:var(--ko);color:#fff" data-act="ostop">Arrêter</button>';
    else if (!url) h += '<button class="btn accent" data-act="orec">' + (supported() ? 'Enregistrer' : 'Micro indisponible') + '</button><button class="btn ghost sm" style="align-self:center" data-act="onext" data-r="">Passer</button>';
    else h += '<p class="help" style="text-align:center;margin:0">Comparez avec le modèle, puis notez-vous honnêtement.</p><div class="grades"><button class="grade ko" data-act="orate" data-r="ko">À retravailler</button><button class="grade mid" data-act="orate" data-r="mid">Correct</button><button class="grade ok" data-act="orate" data-r="ok">Très bien</button></div>';
    h += '</div>';
    U.mount(h, true);
  }

  function viewEnd() {
    const r = st.run; const n = r.ok + r.mid + r.ko;
    const weak = r.ids.filter((id, i) => r.rated[i] === 'ko');
    let h = '<div class="sbar"><span></span></div><div class="stage"><div class="flash"><span class="lab ok">Séance terminée</span><div class="score">' + n + '<small> phrases</small></div><div class="fr muted" style="margin-top:6px">' + r.ok + ' très bien · ' + r.mid + ' correct · ' + r.ko + ' à retravailler</div>';
    if (weak.length) h += '<div class="missed"><div class="h2" style="margin:8px 0">À retravailler</div>' + weak.map((id) => U.rowHTML(AP.BY[id], { plain: true })).join('') + '</div>';
    h += '</div></div><div class="dock"><button class="btn accent" data-act="oagain">Une autre série</button><button class="btn alt" data-act="oend">Terminer</button></div>';
    U.mount(h, true);
  }

  function cleanup() { stopRec(true); if (st.run) Object.keys(st.run.urls).forEach((k) => URL.revokeObjectURL(st.run.urls[k])); }

  A.oset = (el) => { const k = el.dataset.k; st[k] = k === 'n' ? Number(el.dataset.v) : el.dataset.v; view(); };
  A.ostart = () => start();
  A.oshow = () => { st.run.shown = true; U.rerenderNoAnim(); viewRun(); };
  A.omodel = (el) => U.say(el.dataset.s);
  A.omodelslow = (el) => U.say(el.dataset.s, 0.6);
  A.orec = () => { startRec(); };
  A.ostop = () => { stopRec(); };
  A.oplay = () => {
    const r = st.run; const url = r.urls[r.i]; if (!url) return;
    AP.stopSpeech();
    try { if (rc.audio) rc.audio.pause(); rc.audio = new Audio(url); rc.audio.play().catch(() => U.toast('Lecture impossible')); } catch (e) { U.toast('Lecture impossible'); }
  };
  function advance() {
    const r = st.run;
    if (rc.audio) { try { rc.audio.pause(); } catch (e) { /* ignore */ } }
    r.i += 1; r.shown = false; r.err = '';
    if (r.i >= r.ids.length) r.done = true;
    viewRun();
  }
  A.onext = () => advance();
  A.orate = (el) => {
    const r = st.run; const g = el.dataset.r; const id = r.ids[r.i];
    r.rated[r.i] = g; r[g] += 1;
    AP.grade(id, g);
    advance();
  };
  A.oquit = () => { cleanup(); st.run = null; U.nav('#/parler'); };
  A.oend = () => { cleanup(); st.run = null; U.nav('#/parler'); };
  A.oagain = () => { cleanup(); start(); };
  window.addEventListener('hashchange', () => { if (rc.recording) stopRec(true); });

  function hub() {
    let h = '<div class="h1">S’entraîner</div>' + U.trainSeg('parler');
    h += '<p class="sub" style="margin:12px 0">Travaillez l’oral : seule avec l’app, ou avec quelqu’un qui vous fait réviser.</p>';
    const tile = (act, extra, t, d) => '<button class="tile" data-act="' + act + '" ' + extra + '><div class="tt"><span>' + t + '</span><span>›</span></div><div class="td" style="margin:2px 0 0">' + d + '</div></button>';
    h += tile('go', 'data-to="oral"', 'M’enregistrer', 'Dites une phrase, réécoutez-vous et comparez avec le modèle.');
    h += tile('pgoto', 'data-v="role"', 'Jeux de rôle métier', 'Dix situations : comité de direction, négociation, entretien, appel…');
    h += tile('pgoto', 'data-v="qa"', 'Me faire réviser par quelqu’un', 'Vous donnez le téléphone : la personne lit les questions, vous répondez à l’oral.');
    U.mount(h);
  }
  U.addRoute('parler', 'quiz', hub);
  U.addRoute('oral', 'quiz', view);
})();
