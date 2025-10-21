// script.js — optimized for SpaceClean

document.addEventListener('DOMContentLoaded', () => {
  // ===== Helpers =====
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const throttle = (fn, wait = 150) => {
    let last = 0, t;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now; fn.apply(null, args);
      } else {
        clearTimeout(t);
        t = setTimeout(() => { last = Date.now(); fn.apply(null, args); }, wait - (now - last));
      }
    };
  };

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }, { passive: true });
  });

  // ===== Slideshow =====
  const slides = Array.from(document.querySelectorAll('.slide'));
  if (slides.length) {
    let i = slides.findIndex(s => s.classList.contains('active'));
    if (i < 0) { i = 0; slides[0].classList.add('active'); }

    let timer;
    const step  = () => { slides[i].classList.remove('active'); i = (i + 1) % slides.length; slides[i].classList.add('active'); };
    const start = () => { if (!timer && slides.length > 1) timer = setInterval(step, 2500); };
    const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };

    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    if ('IntersectionObserver' in window) {
      const hero = document.querySelector('.hero-slideshow') || slides[0];
      new IntersectionObserver(es => (es[0]?.isIntersecting ? start() : stop()), { threshold: 0.15 }).observe(hero);
    } else { start(); }
  }

  // ===== NRW-Map (Leaflet) =====
  const mapEl = document.getElementById('nrw-map');
  if (mapEl && typeof window.L !== 'undefined') {
    const map = L.map(mapEl, {
      scrollWheelZoom: false,
      dragging: true,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap-Mitwirkende',
      maxZoom: 18
    }).addTo(map);

    const spots = [
      { name: 'Essen (Hauptstandort)', lat: 51.4556, lng: 7.0116, primary: true },
      { name: 'Duisburg',              lat: 51.4344, lng: 6.7623 },
      { name: 'Düsseldorf',            lat: 51.2277, lng: 6.7735 },
      { name: 'Gelsenkirchen',         lat: 51.5177, lng: 7.0857 },
      { name: 'Wuppertal',             lat: 51.2562, lng: 7.1508 },
      { name: 'Bochum',                lat: 51.4818, lng: 7.2197 },
      { name: 'Oberhausen',            lat: 51.4963, lng: 6.8638 },
      { name: 'Mülheim an der Ruhr',   lat: 51.4312, lng: 6.8846 }
    ];

    const baseStyle = { radius: 8,  color: '#16a34a', weight: 2, fillColor: '#4ade80', fillOpacity: 0.9 };
    const mainStyle = { radius: 10, color: '#166534', weight: 3, fillColor: '#22c55e', fillOpacity: 1 };

    const bounds = [];
    spots.forEach(s => {
      const style = s.primary ? mainStyle : baseStyle;
      const m = L.circleMarker([s.lat, s.lng], style).addTo(map);
      m.bindPopup(`<strong>${s.name}</strong><br>SpaceClean – zuverlässig in NRW`);
      bounds.push([s.lat, s.lng]);
    });

    // Auf alle Marker zoomen (nicht zu nah, v.a. Handy)
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 9 });

    // WICHTIG: nach Render (und bei Layout-Änderungen) neu rechnen
    setTimeout(() => map.invalidateSize(), 150);
    window.addEventListener('resize', throttle(() => map.invalidateSize(), 200));
  }
});
