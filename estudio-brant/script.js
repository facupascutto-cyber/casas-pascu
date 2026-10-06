const sinMov = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
if (sinMov) document.documentElement.classList.add('sin-mov');

// Rayos del sello (el logo): 48 líneas alternando largo y corto. También en el sello de la portada.
document.querySelectorAll('#sello .sello-rayos, .hero-sello .hs-rayos').forEach((rayos) => {
  const ns = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const r2 = i % 2 ? 80 : 92;
    const l = document.createElementNS(ns, 'line');
    l.setAttribute('x1', (100 + Math.cos(a) * 68).toFixed(2));
    l.setAttribute('y1', (100 + Math.sin(a) * 68).toFixed(2));
    l.setAttribute('x2', (100 + Math.cos(a) * r2).toFixed(2));
    l.setAttribute('y2', (100 + Math.sin(a) * r2).toFixed(2));
    rayos.appendChild(l);
  }
});

// Nav: se esconde al bajar y vuelve al subir, como en Brant.
const nav = document.getElementById('nav');
let ultimoY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const abierto = burger.getAttribute('aria-expanded') === 'true';
  nav.classList.toggle('oculta', !abierto && y > ultimoY && y > 200);
  nav.classList.toggle('con-fondo', abierto || y > window.innerHeight - 80);
  ultimoY = y;
}, { passive: true });

// Menú en celular
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu-movil');
const cerrarMenu = () => {
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Abrir menú');
  menu.classList.remove('abierto');
  setTimeout(() => { if (!menu.classList.contains('abierto')) menu.hidden = true; }, 500);
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

// Avance (0 a 1) de una sección alta con su contenido fijo.
const avance = (el) => {
  const r = el.getBoundingClientRect();
  return Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
};

// Texto que se enciende palabra por palabra sobre la foto fija.
const seccionEnciende = document.querySelector('.enciende-seccion');
const enciende = document.querySelector('.enciende');
if (enciende && !sinMov) {
  const texto = enciende.textContent.trim().split(/\s+/);
  enciende.textContent = '';
  texto.forEach((w, j) => {
    const s = document.createElement('span');
    s.className = 'palabra';
    s.textContent = w;
    enciende.append(s, j < texto.length - 1 ? ' ' : '');
  });
  const palabras = enciende.querySelectorAll('.palabra');
  const pintar = () => {
    const k = Math.round(Math.min(1, avance(seccionEnciende) * 1.25) * palabras.length);
    palabras.forEach((w, j) => w.classList.toggle('on', j < k));
  };
  window.addEventListener('scroll', pintar, { passive: true });
  pintar();
}

// Lenis, GSAP y SplitType vienen de CDN: si no cargan, la página anda igual sin animaciones.
// Todos los valores salen de la configuración de interacciones de Brant (brant-paints.webflow.io).
if (!sinMov && window.Lenis && window.gsap && window.ScrollTrigger && window.SplitType) {
  gsap.registerPlugin(ScrollTrigger);

  // Scroll suave: la misma configuración que Brant
  const lenis = new Lenis({ duration: 1.2, smoothTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const destino = document.querySelector(a.getAttribute('href'));
      if (!destino) return;
      e.preventDefault();
      lenis.scrollTo(destino, { force: true });
    });
  });
  new MutationObserver(() => (menu.classList.contains('abierto') ? lenis.stop() : lenis.start()))
    .observe(menu, { attributes: true, attributeFilter: ['class'] });

  // Webflow mide el "scroll en vista" desde que el elemento asoma abajo hasta que se va arriba,
  // y suaviza el avance (smoothing 80-88): acá eso es scrub 0.8.
  const enVista = (trigger) => ({ trigger, start: 'top bottom', end: 'bottom top', scrub: 0.8 });

  // Línea de tiempo por porcentajes, como los keyframes de Webflow: [[%, valores], ...]
  const claves = (el, pasos, scrollTrigger) => {
    const tl = gsap.timeline({ scrollTrigger });
    tl.set(el, pasos[0][1]);
    let antes = 0;
    pasos.forEach(([pct, vals]) => { tl.to(el, { ...vals, duration: pct - antes, ease: 'none' }); antes = pct; });
    if (antes < 100) tl.to({}, { duration: 100 - antes });
    return tl;
  };

  document.fonts.ready.then(() => {
    // [words-rotate-in]: cada palabra gira desde -90° en X; se reinicia al volver arriba
    document.querySelectorAll('.gira').forEach((t) => {
      const { words } = new SplitType(t, { types: 'words', tagName: 'span' });
      const tl = gsap.timeline({ paused: true });
      tl.set(words, { transformPerspective: 1000 });
      tl.from(words, { rotationX: -90, duration: 0.6, ease: 'power2.out', stagger: { amount: 0.6 } });
      ScrollTrigger.create({ trigger: t, start: 'top bottom', onLeaveBack: () => { tl.progress(0); tl.pause(); } });
      ScrollTrigger.create({
        trigger: t, start: 'top 80%',
        onEnter: () => tl.play(),
        // tras un salto (link del menú, recarga a mitad de página) el título ya quedó arriba: se muestra igual
        onRefresh: (st) => { if (st.progress > 0) tl.progress(1); },
        onUpdate: (st) => { if (st.progress > 0 && tl.progress() === 0 && !tl.isActive()) tl.play(); },
      });
    });
    ScrollTrigger.refresh();
  });

  // ---------- Portada: el sello se dibuja, la casa aparece adentro y al bajar el iris se abre ----------
  document.documentElement.classList.add('anima');
  ScrollTrigger.refresh();
  {
    const pin = document.querySelector('.hero-pin');
    const foto = document.querySelector('.hero-foto');
    const img = foto.querySelector('img');
    const sello = document.querySelector('.hero-sello');
    const radioSello = () => sello.getBoundingClientRect().width * 0.285;
    const cy = () => parseFloat(getComputedStyle(pin).getPropertyValue('--cy')) / 100;
    // Final: la foto al medio, fundida en el verde hacia los bordes (como el primer boceto)
    const radioFinal = () => Math.max(pin.clientWidth * 0.36, pin.clientHeight * 0.5);
    const estado = { carga: 0, iris: 0 };
    const pintar = () => {
      const r = estado.iris > 0
        ? radioSello() + (radioFinal() - radioSello()) * estado.iris
        : radioSello() * estado.carga;
      // el borde pasa de nítido (círculo del sello) a un degradé del 62 % del radio
      const nitido = r * (1 - 0.62 * estado.iris) - 1;
      const centro = `50% ${(cy() * 100).toFixed(2)}%`;
      const mascara = `radial-gradient(circle ${r.toFixed(1)}px at ${centro}, #000 ${Math.max(0, nitido).toFixed(1)}px, transparent ${r.toFixed(1)}px)`;
      foto.style.webkitMaskImage = mascara;
      foto.style.maskImage = mascara;
      // La foto arranca chica (la casa entera entra en el círculo) y crece con el iris, siempre
      // lo justo para cubrir el círculo
      const mx = pin.clientWidth / 2, my = pin.clientHeight * Math.min(cy(), 1 - cy());
      const escala = Math.min(1, Math.max(0.42, Math.min(r, mx) / mx, Math.min(r, my) / my));
      img.style.transform = `scale(${escala.toFixed(4)})`;
    };
    pintar();
    window.addEventListener('resize', pintar);

    // Entrada (una sola vez, al cargar)
    const anillos = sello.querySelectorAll('.hs-anillo');
    anillos.forEach((c) => { const l = c.getTotalLength(); gsap.set(c, { strokeDasharray: l, strokeDashoffset: l }); });
    const entrada = gsap.timeline({ defaults: { ease: 'power3.out' } });
    entrada
      .from(sello.querySelectorAll('.hs-rayos line'), { opacity: 0, scale: 0, transformOrigin: '100px 100px', duration: 0.5, stagger: 0.012, ease: 'power2.out' }, 0)
      .to(anillos, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: 0.15 }, 0.1)
      .fromTo('.hs-arbol', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7 }, 0.6)
      .from('.hero-nombre', { y: 40, opacity: 0, duration: 1.3 }, 0.5)
      .to('.hs-arbol', { opacity: 0, duration: 0.5, ease: 'power2.in' }, 1.7)
      .to(estado, { carga: 1, duration: 1.2, ease: 'power3.inOut', onUpdate: pintar }, 1.75)
      .from(['.hero-intro', '.hero-scroll'], { opacity: 0, y: 14, duration: 0.9, stagger: 0.1 }, 2.2);

    // Al bajar: el iris se abre y se difumina, el nombre sube y se va, aparece el título
    const salida = gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
      defaults: { ease: 'none' },
    });
    salida
      .to(estado, { iris: 1, duration: 0.6, ease: 'power2.inOut', onUpdate: pintar,
        onStart: () => { entrada.progress(1); } }, 0)
      .to(sello, { scale: 3.2, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0)
      .to('.hero-nombre', { y: -60, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
      .to(['.hero-intro', '.hero-scroll'], { opacity: 0, duration: 0.12 }, 0)
      .to('.hero-velo', { opacity: 1, duration: 0.25 }, 0.45)
      .fromTo('.hero-final', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, 0.58)
      .set('.hero-final', { pointerEvents: 'auto' }, 0.7)
      .to({}, { duration: 0.17 }, 0.83);
  }

  // Image Parallax: cada foto va de -5 % a 5 % mientras su marco cruza la pantalla


  // Lista de la overview: cada fila entra cuando llega
  document.querySelectorAll('.ov-lista li').forEach((li) => {
    gsap.from(li, { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 88%' } });
  });

  // Espacios = Card Scroll (Solutions): 0.7 al 5 %, 1 del 20 al 80 %, 0.5 al 90 %.
  // Y la foto de fondo con el mismo parallax de -5 % a 5 %.
  document.querySelectorAll('.sol-paso').forEach((paso) => {
    claves(paso.querySelector('.sol-tarjeta'), [[0, { scale: 0.7 }], [5, { scale: 0.7 }], [20, { scale: 1 }], [80, { scale: 1 }], [90, { scale: 0.5 }]], enVista(paso));
    gsap.fromTo(paso.querySelector('.sol-fondo img'), { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: enVista(paso) });
  });

  // Product cards: la segunda empieza más abajo y sube hasta alinearse.
  // Brant anima margin-top (35 %); acá se usa transform con la misma distancia, porque el margen
  // cambia el alto de la página mientras scrolleás y descalibra todas las animaciones de abajo.
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': () => {
      const segunda = document.querySelector('.casa:nth-child(2)');
      const grilla = segunda.parentElement;
      gsap.fromTo(segunda, { y: () => grilla.offsetWidth * 0.35 }, {
        y: 0, ease: 'none',
        scrollTrigger: { trigger: grilla, start: 'top bottom', end: 'top center', scrub: true, invalidateOnRefresh: true },
      });
    },
  });

  // Scroll Animation (sticky_background): del 5 al 35 % pasa de 0.9 a 1 y de invisible a visible
  claves('.enciende-foto', [[0, { scale: 0.9, opacity: 0.25 }], [5, { scale: 0.9, opacity: 0.25 }], [35, { scale: 1, opacity: 1 }]], enVista('.enciende-seccion'));

  // Cierre: la foto con el mismo parallax de Brant
  gsap.fromTo('.cierre-foto', { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: enVista('.cierre-foto-marco') });
}
