# Alternativas Libres

Directorio en español de alternativas autoalojadas a herramientas SaaS.

**Stack:** Next.js 16 (App Router, Turbopack) + React 19 + TypeScript +
Tailwind CSS v4. Sin base de datos: todo el contenido vive en ficheros
TypeScript versionados, lo que permite revisar cada cambio en un pull request.

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local
pnpm dev          # http://localhost:3000
```

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción: genera el sitio estático en `out/` |
| `pnpm start` | Sirve el build |
| `node scripts/servir-out.mjs` | Sirve `out/` como lo haría Cloudflare Pages (URLs limpias, `_redirects` y `_headers`) en `localhost:8787` |
| `pnpm check:adsense` | Puerta sobre el HTML construido: `ads.txt`, consentimiento, unidades de anuncio, sitemap y redirecciones |
| `pnpm lint` | ESLint |
| `node scripts/check-links.mjs http://localhost:3000` | Rastrea el sitio: enlaces rotos, canonicals y sitemap |
| `node scripts/fetch-logos.mjs` | Descarga los favicon oficiales y regenera `src/lib/data/logos.ts` |
| `node scripts/check-repos.mjs` | Detecta repositorios archivados o sin actividad (usa `GITHUB_TOKEN` para no agotar el límite de la API) |
| `node scripts/revisar-fichas.mjs` | Compara la licencia de cada ficha con la del repositorio y comprueba URL y Docker |
| `node scripts/verificar-docker.mjs` | Busca evidencia de imagen oficial en el README y en la web del proyecto |
| `node scripts/fetch-actividad.mjs` | Actualiza la fecha del último commit de cada proyecto |
| `node scripts/check-enlaces.mjs` | Comprueba que las URLs externas de las fichas siguen vivas |
| `node scripts/check-consola.mjs` | Captura los errores de consola del navegador con el protocolo de DevTools |

## Variables de entorno

Ver `.env.example`. Para trabajar sin una cuenta de AdSense basta con
`NEXT_PUBLIC_ADSENSE_CLIENT` vacío: los espacios publicitarios muestran un
placeholder y no se carga ningún script de terceros.

## Despliegue

El sitio es **estático** y se publica en **Cloudflare Pages**. La build
genera todas las páginas en `out/` y Pages las sirve como archivos.

Antes era un Worker de OpenNext, y eso es lo que lo tumbó: las páginas que
necesitan render de Next.js pasaban por el Worker, que se pasó del límite de
CPU de Cloudflare (error 1102) y devolvió error en 94 de las 179 URL. Con
exportación estática no hay CPU que reventar.

En Cloudflare Pages:

- **Build command:** `pnpm build`
- **Build output directory:** `out`
- **Node version:** 22 (variable `NODE_VERSION`)

Lo único que queda vivo es el formulario de contacto, una Pages Function en
`functions/api/contacto.ts`. Para que el mensaje llegue a algún sitio hay que
configurar `CONTACT_WEBHOOK_URL` (un webhook externo) o el binding `EMAIL`
de Email Routing, con `CONTACT_EMAIL_TO` como destino. Sin ninguna de las
dos, el formulario responde con un aviso para que la persona escriba
directamente por correo.

Las cabeceras de seguridad y las redirecciones están en `public/_headers` y
`public/_redirects`. Las redirecciones de `/go/<slug>` (los enlaces
salientes con UTM) las genera `scripts/generar-redirects.mjs` al final de
la build, a partir de los datos de las alternativas.

`NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_CONTACTO_EMAIL` se incrustan en el
build: si cambian, hay que volver a desplegar.

Detalle del paso a paso en `docs/PRIMEROS-PASOS.md`.

## Estructura

```
src/
  app/
    layout.tsx              Layout, Consent Mode v2, tema y analítica
    page.tsx                Portada
    alternativas/           Hub de producto + ficha de herramienta
    categorias/             Landings por categoría
    verticales/             Landings por tipo de equipo
    comparativas/           Guias largas (las páginas de mayor dwell time)
    novedades/              Registro de cambios y revisiones
    metodologia/             Cómo verificamos los datos (E-E-A-T)
    collaborates/            Añadir tu proyecto y patrocinio
    feed.xml/               RSS
    sitemap.ts, robots.ts   Indexación
  components/               UI (anuncios, consentimiento, tablas, logos)
  lib/
    data/                   Contenido: productos, alternativas, guías
    queries.ts              Selectores y etiquetas
    fechas.ts               Formato de fecha en español
    integrity.ts            Comprobaciones que rompen el build si los datos no cuadran
  scripts/                  Utilidades de mantenimiento
docs/
  MONETIZACION.md          Plan de monetización completo
```

## Modelo de datos

- `Product`: el SaaS que se quiere sustituir (precio, licencia, motivos y
  casos en los que **no** conviene migrar).
- `Alternative`: una herramienta autoalojada (licencia real, dificultad,
  recursos, Docker, coste, contras, verticales, fecha de revisión).
- `Guide`: comparativa larga con veredicto y FAQ.
- `Vertical`: tipo de equipo (agencias, developers, privacidad...).

`assertDataIntegrity()` se ejecuta en cada build: si una alternativa apunta a
un producto inexistente, o una ficha queda fuera de todos los hubs, el build
falla. Es la red de seguridad de un sitio generado con datos.

## Flujo editorial

1. Añade la entrada en `src/lib/data/alternatives/`.
2. `node scripts/fetch-logos.mjs` para el favicon.
3. `node scripts/check-repos.mjs` para confirmar licencia y actividad.
4. Marca `revisionPendiente: false` y actualiza `verificadoEn` cuando la
   ficha esté verificada contra la fuente oficial.
5. `pnpm build` y `node scripts/check-links.mjs`.

## Publicidad

Cuatro tipos de hueco, todos etiquetados como "Publicidad" y ninguno dentro de
las listings:

- `NEXT_PUBLIC_ADSENSE_SLOT_LISTADO` → home, directorio, categorías, sidebar
  de las comparativas.
- `NEXT_PUBLIC_ADSENSE_SLOT_ARTICULO` → fichas de producto, fichas de
  herramienta y comparativas (dos inserciones).

En la UE, el consentimiento se gestiona antes de cargar `adsbygoogle.js`.
Para producción, activa el CMP de Google (Funding Choices) desde el panel de
AdSense y desactiva el banner local.

## Licencia

Código del sitio: uso interno. Los logotipos de los proyectos pertenecen a
sus respectivos titulares y se usan únicamente para identificarlos.
