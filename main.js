/* Anglais pro : démarrage */
(function () {
  'use strict';
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  if ('serviceWorker' in navigator) {
    var had = !!navigator.serviceWorker.controller, done = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!had || done) return;
      var d = window.AP._dbg ? window.AP._dbg() : {};
      if (d.ses || d.qz) return;   // ne pas couper une séance en cours
      done = true; location.reload();
    });
  }
  window.AP.UI.route();
})();
