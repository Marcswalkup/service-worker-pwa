self.addEventListener('install', evento=>{
    /*Promesa que crea el proceso de creación del espacio 
    en cache y agrega los archivos necesarios para cargar nuestra
    aplicación*/
    const promesa =caches.open('cache-1')
        .then(cache=>{
            return cache.addAll([
                './',
                './index.html',
                './css/style.css',
                './img/main.jpg',
                './js/app.js',
                './img/no-img.jpeg',
            ]);
        });

        //Indicamos que la instalación espere hasta que la promesa se cumpla
        evento.waitUntil(promesa);
});

