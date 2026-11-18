self.addEventListener('install',evento=>{
    console.log("SW: INSTALANDO SERVICE WORKER");
   
    const instalacion=new Promise((resolve,reject)=>{

   setTimeout(()=>{
    console.log("SW: Instalacion terminada")
    self.skipWaiting();
    resolve();
},5000)
})
evento.waitUntil(instalacion);
})

self.addEventListener('activate',evento=>{
    console.log("SW: ACTIVADO Y LISTO PARA CONTROLAR LA APP");
})