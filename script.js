// script.js — clean version

document.addEventListener('DOMContentLoaded', () => {
  // Smooth Scroll für interne Links (nur wenn Ziel existiert)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Slideshow (einmalig, ohne Duplikate)
  const slides = Array.from(document.querySelectorAll('.slide'));
  if (slides.length) {
    let i = slides.findIndex(s => s.classList.contains('active'));
    if (i < 0) { i = 0; slides[0].classList.add('active'); }

    setInterval(() => {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
    }, 2500);
  }

  // Hinweis: Für das neue Akkordeon (details/summary) ist KEIN JS nötig.
});
