const sinMov = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
if (sinMov) document.documentElement.classList.add('sin-mov');

// Rayos del sello: 48 líneas alrededor del círculo, alternando largo y corto.
const rayos = document.querySelector('#sello .sello-rayos');
if (rayos) {
  const ns = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r1 = 68;
    const r2 = i % 2 ? 80 : 92;
    const l = document.createElementNS(ns, 'line');
    l.setAttribute('x1', (100 + Math.cos(a) * r1).toFixed(2));
    l.setAttribute('y1', (100 + Math.sin(a) * r1).toFixed(2));
    l.setAttribute('x2', (100 + Math.cos(a) * r2).toFixed(2));
    l.setAttribute('y2', (100 + Math.sin(a) * r2).toFixed(2));
    rayos.appendChild(l);
  }
}

// Encabezado: borde suave cuando se deja el hero.
const cabecera = document.getElementById('top');
const marcar = () => cabecera.classList.toggle('con-borde', window.scrollY > 10);
marcar();
window.addEventListener('scroll', marcar, { passive: true });

// Menú
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
const cerrarMenu = () => {
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Abrir menú');
  menu.classList.remove('abierto');
  setTimeout(() => { if (!menu.classList.contains('abierto')) menu.hidden = true; }, 550);
};
burger.addEventListener('click', () => {
  if (burger.getAttribute('aria-expanded') === 'true') return cerrarMenu();
  menu.hidden = false;
  requestAnimationFrame(() => menu.classList.add('abierto'));
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Cerrar menú');
});
menu.addEventListener('click', (e) => { if (e.target.closest('a')) cerrarMenu(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { cerrarMenu(); burger.focus(); }
});

// Revelado al entrar en pantalla.
const io = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
  }
}, { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.revela, .revela-sube').forEach((el) => io.observe(el));

// ---------- Efectos tomados de Brant ----------

// Un día: la escena queda fija y el scroll avanza de paso en paso.
const escena = document.querySelector('.escena');
if (escena && !sinMov) {
  const fotos = escena.querySelectorAll('.escena-marco img');
  const pasos = escena.querySelectorAll('.escena-pasos li');
  const numero = escena.querySelector('.escena-n');
  const barra = escena.querySelector('.escena-barra span');
  let actual = 0;
  const mover = () => {
    const r = escena.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
    const i = Math.min(pasos.length - 1, Math.floor(p * pasos.length));
    barra.style.transform = `scaleX(${Math.max(p, 1 / pasos.length)})`;
    if (i === actual) return;
    fotos[actual].classList.remove('activa');
    pasos[actual].classList.remove('activo');
    fotos[i].classList.add('activa');
    pasos[i].classList.add('activo');
    numero.textContent = i + 1;
    actual = i;
  };
  mover();
  window.addEventListener('scroll', mover, { passive: true });
  window.addEventListener('resize', mover);
}

// Reservá directo: las palabras se encienden a medida que el párrafo cruza la pantalla.
const enciende = document.querySelector('.enciende');
if (enciende && !sinMov) {
  enciende.innerHTML = enciende.textContent.trim().split(/\s+/)
    .map((w) => `<span class="palabra">${w}</span>`).join(' ');
  const palabras = enciende.querySelectorAll('.palabra');
  const pintar = () => {
    const r = enciende.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
    const n = Math.round(p * palabras.length);
    palabras.forEach((w, k) => w.classList.toggle('on', k < n));
  };
  pintar();
  window.addEventListener('scroll', pintar, { passive: true });
}

// Lenis, GSAP y SplitType vienen de CDN: si no cargan, la página sigue andando sin ellos.
const hayLibs = !sinMov && window.Lenis && window.gsap && window.ScrollTrigger && window.SplitType;
if (hayLibs) {
  document.documentElement.classList.add('libs');
  gsap.registerPlugin(ScrollTrigger);

  // Scroll suave
  const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const destino = document.querySelector(a.getAttribute('href'));
      if (!destino) return;
      e.preventDefault();
      lenis.scrollTo(destino, { force: true, offset: -parseInt(getComputedStyle(document.documentElement).getPropertyValue('--alto-top')) });
    });
  });
  // Con el menú abierto no se scrollea la página de atrás.
  new MutationObserver(() => (menu.classList.contains('abierto') ? lenis.stop() : lenis.start()))
    .observe(menu, { attributes: true, attributeFilter: ['class'] });

  // Títulos que suben línea por línea
  document.fonts.ready.then(() => {
    document.querySelectorAll('.lineas').forEach((t) => {
      const partes = new SplitType(t, { types: 'lines, words' });
      const enHero = t.closest('.hero');
      gsap.from(partes.words, {
        yPercent: 110,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.04,
        delay: enHero ? 0.35 : 0,
        scrollTrigger: enHero ? undefined : { trigger: t, start: 'top 88%' },
      });
    });
    gsap.from('.hero-kicker', { opacity: 0, y: 14, duration: 1, delay: 0.2, ease: 'power3.out' });
    ScrollTrigger.refresh();
  });

  // Fotos de la casa desfasadas: las columnas pares suben más rápido.
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': () => {
      document.querySelectorAll('.dentro-grilla .foto:nth-child(even)').forEach((f) => {
        gsap.fromTo(f, { y: 70 }, {
          y: -70, ease: 'none',
          scrollTrigger: { trigger: '.dentro-grilla', start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    },
  });

  // El hero se aleja suave al bajar.
  gsap.to('.hero-fotos', {
    yPercent: 18, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}
