import { defineConfig } from 'astro/config';

// TODO (PENDIENTES.md): dominio definitivo.
export default defineConfig({
  site: 'https://palorosahouse.example',
  i18n: {
    locales: ['es', 'pt', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: true },
  },
});
