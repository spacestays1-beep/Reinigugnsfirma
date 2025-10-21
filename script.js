// script.js — optimized clean version

document.addEventListener('DOMContentLoaded', () => {
  // ===== Helpers =====
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const throttle = (fn, wait = 150) => {
    let last = 0, t;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(null, args);
      } else {
        clearTimeout(t);
        t = setTimeout(() => {
          last = Date.now();
          fn.apply(null, args);
        }, wait - (now - last));
      }
    };
  };

  // ===== Smooth Scroll für interne Links =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (prefersReduced) {
        el.scrollIntoView({ block: 'start' });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, { passive: true });
  });

  // ===== Slideshow (stabil + sparsam) =====
  const slides = Array.from(document.querySelectorAll('.slide'));
  if (slides.length) {
    let i = slides.findIndex(s => s.classList.contains('active'));
    if (i < 0) { i = 0; slides[0].classList.add('active'); }

    let timer = null;
    const step = () => {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
    };

    const start = () => {
      if (!timer && slides.length > 1) {
        timer = setInterval(step, 2500);
      }
    };
    const stop = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };

    // Pause bei Tab-Wechsel / Bildschirm aus
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    // Optional: pausieren wenn Slideshow nicht im Viewport (spart Akku/CPU)
    if ('IntersectionObserver' in window) {
      const hero = document.querySelector('.hero-slideshow') || slides[0].closest('.card') || slides[0];
      const io = new IntersectionObserver(entries => {
        const vis = entries.some(en => en.isIntersecting);
        vis ? start() : stop();
      }, { threshold: 0.15 });
      if (hero) io.observe(hero);
    } else {
      start();
    }
  }

  // ===== NRW-Karte mit Leaflet =====
  const mapEl = document.getElementById('nrw-map');
  if (mapEl && typeof window.L !== 'undefined') {
    // Karte initialisieren
    const map = L.map(mapEl, {
      scrollWheelZoom: false,
      dragging: true,
      zoomControl: true
    });

    // Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap-Mitwirkende',
      maxZoom: 18
    }).addTo(map);

    // Marker-Daten
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

    // Styles
    const baseStyle =  { radius: 8,  color: '#16a34a', weight: 2, fillColor: '#4ade80', fillOpacity: 0.9 };
    const mainStyle =  { radius: 10, color: '#166534', weight: 3, fillColor: '#22c55e', fillOpacity: 1.0 };

    const bounds = [];
    spots.forEach(s => {
      const style = s.primary ? mainStyle : baseStyle;
      const marker = L.circleMarker([s.lat, s.lng], style).addTo(map);
      marker.bindPopup(`<strong>${s.name}</strong><br>SpaceClean – zuverlässig in NRW`);
      bounds.push([s.lat, s.lng]);
    });

    // Auf alle Marker zoomen, aber nicht zu nah
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 9 });

    // Falls Container erst nachträglich sichtbar wird → Größe neu berechnen
    setTimeout(() => map.invalidateSize(), 150);

    // Bei Fenstergröße ändern nur Größe neu berechnen (kein aggressives Refit)
    window.addEventListener('resize', throttle(() => map.invalidateSize(), 200));
  }
});
