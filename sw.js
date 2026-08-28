// 서비스 워커: 앱 설치(PWA)와 오프라인 실행을 위해 파일을 캐시한다.
// 항상 네트워크를 먼저 시도하므로 새 버전이 나오면 바로 반영되고,
// 인터넷이 없을 때만 저장해 둔 캐시로 실행된다.
const CACHE = "mp3editor-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./", "./index.html", "./lame.min.js", "./manifest.json", "./icon-192.png", "./icon-512.png"])));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
