const CACHE="gabi-bec-v2";
const FILES=["./","./index.html","./manifest.json","./background.jpg","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).catch(()=>{}));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
// index.html: mereu din retea daca se poate (ca sa iei versiunea noua), restul din cache
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(u.pathname.endsWith("/")||u.pathname.endsWith("index.html")){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
