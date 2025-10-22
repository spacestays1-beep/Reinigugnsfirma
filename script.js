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

  /* ===== Slideshow ===== */
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
