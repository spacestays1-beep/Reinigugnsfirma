// script.js — stabile Version (Smooth Scroll, Slideshow, Leaflet-Map)

document.addEventListener('DOMContentLoaded', () => {
  /* ===== Smooth Scroll ===== */
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

// === Slideshow (robust, mobile-freundlich) ===
(() => {
  const root = document.querySelector('.hero-slideshow');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.slide'));
  if (!slides.length) return;

  // Startindex bestimmen
  let i = slides.findIndex(s => s.classList.contains('active'));
  if (i < 0) i = 0;

  // NEU: Erste Folie SOFORT sichtbar machen (kein Warten auf .complete)
  slides.forEach(s => s.classList.remove('active'));
  slides[i].classList.add('active');

  // Rotation direkt starten (vermeidet Blackscreen auf Mobile)
  const rotate = () => {
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  };
  setInterval(rotate, 2500);

  // Optional: kleiner Reflow-Fix bei Resize (einige Mobile-Browser)
  const fixSize = () => { root.style.transform = 'translateZ(0)'; };
  window.addEventListener('resize', fixSize);
})();

  // Erst starten, wenn das erste Bild bereit ist (verhindert schwarzen Frame)
  const first = slides[i];
  if (first.complete) {
    run();
  } else {
    first.addEventListener('load', run, { once: true });
    first.addEventListener('error', run, { once: true }); // notfalls trotzdem rotieren
  }

  // Safety: bei Resize neu layouten (nur falls nötig)
  const fixSize = () => {
    // forciert ein Reflow für manche Mobile-Browser
    root.style.transform = 'translateZ(0)';
  };
  window.addEventListener('resize', fixSize);
})();

 
  // 1) MAP INITIALISIEREN
  const map = L.map(mapEl, {
    scrollWheelZoom: false,
    dragging: true,
    zoomControl: true
  });

  // 2) TILE-LAYER LADEN (OSM)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap-Mitwirkende'
  }).addTo(map);

  // 3) MARKER
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
    const marker = L.circleMarker([s.lat, s.lng], style).addTo(map);
    marker.bindPopup(`<strong>${s.name}</strong><br>SpaceClean – zuverlässig in NRW`);
    bounds.push([s.lat, s.lng]);
  });

  // 4) AUF ALLE MARKER ZOomen (Mobile nicht zu nah)
  map.fitBounds(bounds, { padding: [50, 50], maxZoom: 9 });

  // 5) RENDER-GLITCH FIXES
  const refresh = () => map.invalidateSize(true);
  refresh();
  setTimeout(refresh, 150);
  setTimeout(refresh, 500);
  window.addEventListener('load', refresh);
  try { new ResizeObserver(refresh).observe(mapEl); } catch (_) {}
  window.addEventListener('orientationchange', () => setTimeout(refresh, 150));
});
