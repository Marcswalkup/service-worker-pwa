if (navigator.serviceWorker) {
    navigator.serviceWorker.register(new URL('../sw.js', document.currentScript.src));
}

if (window.caches) {

    caches.open('practica').then(cache => {

        // 1. Agregar main2
        cache.add('./img/main2.jpg').then(() => {

            // 2. Agregar index.html y sw.js
            cache.addAll([
                './index.html',
                './sw.js'
            ]).then(() => {

                // 3. Eliminar main2
                cache.delete('./img/main2.jpg').then(resultado => {
                    console.log("Archivo eliminado:", resultado);

                    // 4. Modificar contenido de sw.js
                    cache.put('./sw.js', new Response(
                        'MIRIAM GUZMAN ROSILES, ANDREA GUADALUPE CAMPOS ESCAMILLA'
                    )).then(() => {

                        // 5. Buscar sw.js e imprimir contenido
                        cache.match('./sw.js').then(respuesta => {
                            respuesta.text().then(console.log);
                        });

                        // 6. Mostrar espacios de caché
                        caches.keys().then(console.log);

                    });
                });
            });
        });
    });
}