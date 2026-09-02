// Imposta il tema PRIMA del paint (niente flash): preferenza salvata o sistema.
// File esterno (non inline) per poter usare una CSP senza 'unsafe-inline'.
(function () {
  try {
    var t = localStorage.getItem('quillino-theme');
    if (t !== 'light' && t !== 'dark') {
      t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
