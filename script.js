// Quillino landing — interazioni minime, nessuna dipendenza esterna.

// Anno corrente nel footer
document.getElementById('year').textContent = new Date().getFullYear();

// ── Tema chiaro/scuro globale ──────────────────────────────────────────────
// Il tema è già impostato su <html data-theme> dallo script inline in <head>.
// Qui scambiamo le foto (che hanno data-light/data-dark) e gestiamo il toggle.
const root = document.documentElement;
const resolvedTheme = () => (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

function applyShots(theme) {
  document.querySelectorAll('img.shot').forEach(img => {
    const src = theme === 'dark' ? img.dataset.dark : img.dataset.light;
    if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
  });
}

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem('quillino-theme', theme); } catch (e) {}
  applyShots(theme);
}

applyShots(resolvedTheme());
// Sia il toggle nel nav (desktop) sia il FAB (mobile) usano la stessa logica.
document.querySelectorAll('.theme-toggle').forEach(btn =>
  btn.addEventListener('click', () => setTheme(resolvedTheme() === 'dark' ? 'light' : 'dark'))
);

// Bordo nav all'inizio dello scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobile
const toggle = document.getElementById('navToggle');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('menu-open');
  toggle.setAttribute('aria-expanded', String(open));
});
// Chiudi il menu quando si tocca un link
nav.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('menu-open'))
);

// ── Carosello dispositivi (tab + swipe + tastiera + auto-avanzamento) ──────
(function () {
  const car = document.getElementById('deviceCarousel');
  if (!car) return;
  const tabs   = Array.from(car.querySelectorAll('.ctab'));
  const slides = Array.from(car.querySelectorAll('.cslide'));
  const order  = tabs.map(t => t.dataset.device);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let idx = 0;

  function show(i, { focus } = {}) {
    idx = (i + order.length) % order.length;
    const dev = order[idx];
    tabs.forEach(t => {
      const on = t.dataset.device === dev;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    slides.forEach(s => s.classList.toggle('is-active', s.dataset.device === dev));
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => { show(i); resetAutoplay(); }));

  // Frecce ←/→ per navigare tra le tab (pattern ARIA tablist standard)
  car.querySelector('.carousel-tabs').addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    show(idx + (e.key === 'ArrowRight' ? 1 : -1), { focus: true });
    resetAutoplay();
  });

  // Swipe orizzontale su mobile
  const stage = car.querySelector('.carousel-stage');
  let x0 = null;
  stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) { show(idx + (dx < 0 ? 1 : -1)); resetAutoplay(); }
  }, { passive: true });

  // Auto-avanzamento: scorre le card da sola ogni 4.5s, in pausa su hover/
  // focus/interazione o se l'utente preferisce animazioni ridotte.
  let timer = null;
  function startAutoplay() {
    if (reduceMotion) return;
    timer = setInterval(() => show(idx + 1), 4500);
  }
  function stopAutoplay() { clearInterval(timer); timer = null; }
  function resetAutoplay() { stopAutoplay(); startAutoplay(); }

  car.addEventListener('mouseenter', stopAutoplay);
  car.addEventListener('mouseleave', startAutoplay);
  car.addEventListener('focusin', stopAutoplay);
  car.addEventListener('focusout', startAutoplay);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay(); else startAutoplay();
  });

  startAutoplay();
})();

// Reveal in scroll (rispetta prefers-reduced-motion via CSS)
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
