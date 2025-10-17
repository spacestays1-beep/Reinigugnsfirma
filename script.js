// Smooth Scroll für interne Links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Kein preventDefault() mehr – das Formular darf jetzt normal absenden!
// Slideshow automatisch durchwechseln
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

if (slides.length > 0) {
  slides[currentSlide].classList.add('active');
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 2500); // alle 2,5 Sekunden wechseln
}
// === Slideshow-Autoplay ===
document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  if (!slides.length) return;

  let i = slides.findIndex(s => s.classList.contains('active'));
  if (i < 0) { i = 0; slides[0].classList.add('active'); }

  setInterval(() => {
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, 2500);
});
