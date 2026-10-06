# Pendientes

## Datos
- [ ] Número de WhatsApp de reservas (`src/data/sitio.ts`).
- [ ] Links iCal de Airbnb de Casa 1 y Casa 2.
- [ ] Nombres de las casas: por ahora "Casa 1" y "Casa 2".
- [ ] Dominio definitivo (`astro.config.mjs`).

## Confirmar con Analía (el copy lo afirma y los datos no lo dicen)
- [ ] 15:00 dice "La pileta es solo de ustedes": la Casa 2 figura con *pileta privada*, la Casa 1 solo con *pileta*. ¿La de la Casa 1 también es privada?
- [ ] 07:30 "Mate en la galería": ¿las dos casas tienen galería?
- [ ] 20:00 "Parrilla y mesa larga": la parrilla no figura en las comodidades. ¿Hay parrilla en las dos?
- [ ] Reglas de cada casa (horarios, mascotas, fumar, fiestas) para las páginas de casa.
- [ ] Distribución exacta de camas (cuántas matrimoniales y simples por dormitorio).

## Fotos (todas pendientes: las carpetas están vacías)
- [ ] Hero, mitad que ruge: Cataratas, agua cayendo (`fotos/iguazu`).
- [ ] Hero, mitad quieta: pileta con la superficie quieta (`fotos/casa-1` o `casa-2`).
- [ ] 07:30: galería o exterior con verde, luz de mañana.
- [ ] 09:00: Cataratas de cerca, con caudal y bruma.
- [ ] 15:00: pileta a la tarde.
- [ ] 20:00: parrilla o mesa puesta, atardecer o noche.
- [ ] 23:00: casa de noche con luces, o dormitorio en penumbra.
- [ ] Una foto principal de cada casa para "Las dos casas" y Open Graph.

## Diseño
- [ ] La paleta es provisoria: hay que sacarla de las fotos reales.

## Etapas siguientes
- [ ] Páginas de casa (`/es/casas/casa-1/` y `/es/casas/casa-2/`): hoy los links dan 404.
- [ ] Función de Netlify para el iCal, calendario y consulta por WhatsApp.
- [ ] Portugués e inglés: el selector ya está, pero `/pt/` y `/en/` dan 404.
- [ ] Datos estructurados VacationRental, sitemap, imagen de Open Graph.

## Imágenes de stock (autorizadas por el cliente el 2026-10-05)
- [x] El estudio ya no usa stock (2026-10-06): todo son fotos propias. El stock quedó en `estudio-dos-aguas/fuentes/stock-retirado/`.

## Fotos recibidas el 2026-10-05 (en `fotos/por-clasificar/`)
- [ ] Son capturas de 425 a 806 px: pedir los originales en alta (3000 px o más). En la animación se ven borrosas.
- [ ] Indicar de qué casa es cada una (por el escritorio y los dos baños, parecen de la Casa 1).
- [ ] Hay un baño con hidromasaje que no figura en las comodidades: confirmar en qué casa está.
- [ ] Faltan: parrilla o mesa de noche (20:00), casa de noche (23:00), cocinas, cualquier foto segura de la Casa 2.

## Estudio de animación
- [x] Primer plano (bananeros) y borde derecho (follaje) con fotos de stock, el 2026-10-06. Créditos en `estudio-dos-aguas/CREDITOS.md`.
- [ ] La capa de bruma sigue siendo un resplandor genérico (`capas/bruma.svg`): reemplazar por vapor real si conviene.
- [x] Tarjetas 07:30, 15:00, 20:00 y 23:00 con fotos de Analía (2026-10-06). `pin-1.svg` y `pin-2.svg` ya no se usan.
- [ ] Criterio: la casa y las Cataratas nunca se muestran en la misma imagen, para no sugerir una vista que no existe.

## Fotos recibidas el 2026-10-06 (23, en `fotos/por-clasificar/2026-10-06/`, con nombre)
- [x] Usadas en el estudio: tarjetas del día, sección "La casa por dentro" (living, cocina, galería, dos dormitorios, baño) y cierre con la pileta de noche.
- [ ] Son todas de una sola casa. Por las camas (matrimonial + cucheta + simple = 5) parece la Casa 1: confirmar con Analía.
- [ ] En `pileta-noche-casa.jpg` se ve una parrilla de material a la derecha: confirmar que es de esta casa (respalda la tarjeta de las 20:00).
- [ ] Siguen faltando fotos de la Casa 2 y del baño con hidromasaje.
- [ ] Llegaron por WhatsApp (máximo 1600 px): pedir los originales sigue siendo lo ideal.
- [ ] PRUEBA (2026-10-06): en el sitio de Astro las fotos están repartidas al azar entre `fotos/casa-1` y `fotos/casa-2`, sin saber de qué casa es cada una. Reordenar cuando se confirme.
- [ ] Sin fotos propias de las Cataratas, el estudio no las muestra: el texto ("la que ruge", 09:00) las nombra igual. Si Analía tiene una propia, va en la escena de "Las dos" o en la tarjeta de las 09:00.
