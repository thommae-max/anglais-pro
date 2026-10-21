// Envoie la notification quotidienne (appelé par GitHub Actions)
const webpush = require('web-push');
const THEMES = { 0: 'Grammaire, temps et phrases', 1: 'Quotidien et oral', 2: 'Entreprise au quotidien', 3: 'Mon métier', 4: 'Verbes, adjectifs et connecteurs', 5: 'Expressions idiomatiques', 6: 'Mon métier' };
const parts = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
const get = (t) => parts.find((p) => p.type === t).value;
const h = Number(get('hour')) % 24, m = Number(get('minute'));
const minutes = h * 60 + m;
const forced = process.env.FORCE === 'true';
const bilan = process.env.MODE === 'bilan';
const wd = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' })).getDay();
const lo = bilan ? 7 * 60 + 45 : 12 * 60 + 15, hi = bilan ? 9 * 60 + 30 : 13 * 60 + 15;
if (!forced && (minutes < lo || minutes > hi || (bilan && wd !== 1))) { console.log('Hors fenêtre (' + h + ':' + m + ' Paris), rien à envoyer.'); process.exit(0); }
const sub = JSON.parse(process.env.PUSH_SUB);
webpush.setVapidDetails('mailto:' + (process.env.VAPID_CONTACT || 'thommae@gmail.com'), process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
const payload = JSON.stringify(bilan
  ? { title: 'Bilan de la semaine', body: 'Votre point du lundi vous attend : jours travaillés, cartes acquises, TOEIC. Deux minutes pour fixer la semaine.', url: './#/bilan', tag: 'anglais-pro-bilan' }
  : { title: 'Anglais pro', body: 'Votre session de 5 minutes vous attend : ' + THEMES[wd] + '.', url: './' });
webpush.sendNotification(sub, payload).then(() => console.log('Notification envoyée')).catch((e) => { console.error('Échec', e.statusCode, e.body); process.exit(1); });
