/* Offline support. Works only when the site is served over http(s), not when opened as a file.
   Pages and scripts: use the network when online (so updates show), fall back to the saved copy offline.
   Card images: saved the first time they are shown, then loaded from the saved copy.
   Change VERSION when the list of files below changes. */
const VERSION = "conan-v1";
const CORE = [
  "./", "index.html", "board.html", "turn.html", "actions.html", "demo.html", "practice.html",
  "deck.html", "quiz.html", "words.html", "about.html",
  "assets/style.css", "assets/site.js", "assets/demo.js", "assets/deck.js",
  "assets/cards-data.js", "assets/cards-i18n.js", "assets/cards-translate.js", "assets/card-effects.js",
  "practice.js", "logo.jpeg", "manifest.webmanifest", "assets/icons/icon-192.png", "assets/icons/icon-512.png"
];
const IMAGES = VERSION + "-images", MAX_IMAGES = 400;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== IMAGES).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function trimImages() {
  const c = await caches.open(IMAGES), keys = await c.keys();
  for (let i = 0; i < keys.length - MAX_IMAGES; i++) await c.delete(keys[i]);
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (req.destination === "image" && url.origin !== location.origin) {
    e.respondWith(caches.open(IMAGES).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === "opaque") { c.put(req, res.clone()); trimImages(); }
      return res;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match("index.html"))));
});
