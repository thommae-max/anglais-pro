// Envoie la notification quotidienne (appelé par GitHub Actions)
const webpush = require('web-push');
const THEMES = { 0: 'Grammaire, temps et phrases', 1: 'Quotidien et oral', 2: 'Entreprise au quotidien', 3: 'Mon métier', 4: 'Verbes, adjectifs et connecteurs', 5: 'Expressions idiomatiques', 6: 'Mon métier' };
const parts = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
const get = (t) => parts.find((p) => p.type === t).value;
const h = Number(get('hour')) % 24, m = Number(get('minute'));
const minutes = h * 60 + m;
const forced = process.env.FORCE === 'true';
if (!forced && (minutes < 12 * 60 + 15 || minutes > 13 * 60 + 15)) { console.log('Hors fenêtre (' + h + ':' + m + ' Paris), rien à envoyer.'); process.exit(0); }
const wd = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' })).getDay();
const sub = JSON.parse(process.env.PUSH_SUB);
webpush.setVapidDetails('mailto:' + (process.env.VAPID_CONTACT || 'thommae@gmail.com'), process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
const payload = JSON.stringify({ title: 'Anglais pro', body: 'Votre session de 5 minutes vous attend : ' + THEMES[wd] + '.', url: './' });
webpush.sendNotification(sub, payload).then(() => console.log('Notification envoyée')).catch((e) => { console.error('Échec', e.statusCode, e.body); process.exit(1); });
