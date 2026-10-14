/* Service worker del Ads Board. Versión: 352d6ca97a
   Estrategia: la página y el código se piden siempre primero a internet, así cada
   alumno recibe la versión nueva apenas la subes a GitHub. Si no hay conexión,
   se usa la última copia guardada. Las llamadas a Meta nunca se guardan. */
var CACHE = "adsboard-/*VER*/";
var SHELL = ["./", "./index.html", "./adsboard.js?v=/*VER*/", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL).catch(function () {}); }));
});
self.addEventListener("message", function (e) { if (e.data === "skipWaiting") self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf("adsboard-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin || url.pathname.indexOf("/marketools/adsboard/") !== 0) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) { return hit || caches.match("./index.html"); });
  }));
});
