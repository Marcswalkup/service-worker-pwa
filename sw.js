/* ===========================================================
   SERVICE WORKER - PWA
   Estrategia: Cache con respaldo de red (cache, then network)
   + página offline + limpieza de cachés antiguos.
   Todas las rutas son RELATIVAS para funcionar en GitHub Pages
   (https://usuario.github.io/nombre-repo/).
   =========================================================== */

// CONSTANTES DE ALMACENAMIENTO CACHE
const CACHE            = 'cache-3';       // app shell (archivos base)
const CACHE_DINAMICO   = 'dinamico-1';    // archivos descargados al navegar
const CACHE_INMUTABLE  = 'inmutable-1';   // librerías que nunca cambian (Bootstrap)
const LIMITE_DINAMICO  = 30;

const BOOTSTRAP_CSS =
  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css';

/* ---------------------- INSTALACIÓN ----------------------
   Se guardan en caché los archivos necesarios para cargar
   la aplicación sin conexión. */
self.addEventListener('install', evento => {
  const cacheBase = caches.open(CACHE).then(cache =>
    cache.addAll([
      './',
      './index.html',
      './pages/pagina2.html',
      './pages/offline.html',
      './css/style.css',
      './js/app.js',
      './img/main.jpg',
      './img/main2.jpg',
      './img/no-img.jpeg',
      './img/icons/icon-192.png',
      './img/icons/icon-512.png',
      './manifest.json'
    ])
  );

  // Archivos que no se modificarán -> caché inmutable
  const cacheInmutable = caches.open(CACHE_INMUTABLE).then(cache =>
    cache.add(BOOTSTRAP_CSS).catch(() => {
      /* si no hay red al instalar, no se rompe la instalación */
    })
  );

  evento.waitUntil(Promise.all([cacheBase, cacheInmutable]));
  self.skipWaiting(); // activa la nueva versión sin esperar
});

/* ---------------------- ACTIVACIÓN ----------------------
   Borra cachés de versiones anteriores y toma control. */
self.addEventListener('activate', evento => {
  const vigentes = [CACHE, CACHE_DINAMICO, CACHE_INMUTABLE];

  const limpieza = caches.keys().then(keys =>
    Promise.all(
      keys
        .filter(key => !vigentes.includes(key))
        .map(key => caches.delete(key))
    )
  );

  evento.waitUntil(limpieza.then(() => self.clients.claim()));
});

/* ------------------ LIMPIEZA DE CACHÉ ------------------
   Mantiene un número limitado de archivos en el caché
   (elimina el más antiguo hasta cumplir el límite). */
function limpiarCache(nombreCache, numeroItems) {
  return caches.open(nombreCache).then(cache =>
    cache.keys().then(keys => {
      if (keys.length > numeroItems) {
        return cache
          .delete(keys[0])
          .then(() => limpiarCache(nombreCache, numeroItems));
      }
    })
  );
}

/* ------------- ESTRATEGIA: CACHE WITH NETWORK FALLBACK -------------
   1. Busca en caché. 2. Si no está, va a la red y guarda copia.
   3. Si la red falla, muestra la página offline (HTML) o una
      imagen de reemplazo (imágenes). */
self.addEventListener('fetch', evento => {
  const peticion = evento.request;

  // Solo se manejan peticiones GET (el caché no admite otras)
  if (peticion.method !== 'GET') return;

  const respuesta = caches.match(peticion).then(enCache => {
    if (enCache) return enCache;

    return fetch(peticion)
      .then(resWeb => {
        // Solo guardamos respuestas válidas (200) o de CDN opacas
        if (resWeb && (resWeb.ok || resWeb.type === 'opaque')) {
          const copia = resWeb.clone();
          caches.open(CACHE_DINAMICO).then(cache => {
            cache.put(peticion, copia).then(() =>
              limpiarCache(CACHE_DINAMICO, LIMITE_DINAMICO)
            );
          });
        }
        return resWeb;
      })
      .catch(() => {
        const acepta = peticion.headers.get('accept') || '';
        if (peticion.mode === 'navigate' || acepta.includes('text/html')) {
          return caches.match('./pages/offline.html');
        }
        if (acepta.includes('image')) {
          return caches.match('./img/no-img.jpeg');
        }
      });
  });

  evento.respondWith(respuesta);
});
