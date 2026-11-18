self.addEventListener('fetch', evento =>{
    const respuestaOffline = new Response("Este Sitio Requiere Conexion a Internet.");
    const respuesta =fetch(evento.request)
    .catch(()=> respuestaOffline);
    evento.respondWith(respuesta);
});