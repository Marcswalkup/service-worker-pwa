// Registro del Service Worker con ruta relativa a este archivo,
// así funciona desde index.html, pages/*.html y en GitHub Pages (subcarpeta del repo).
if ('serviceWorker' in navigator) {
  const swUrl = new URL('../sw.js', document.currentScript.src);
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl)
      .then(reg => console.log('SW registrado. Scope:', reg.scope))
      .catch(err => console.error('Error al registrar SW:', err));
  });
}
