# Primeros pasos, en orden

Guía para dejar el sitio en marcha. Cada paso depende del anterior.

---

## Paso 1 — Dominio (30 min, ~10-15 €/año)

**Por qué es el primero:** AdSense, Search Console y el sitemap necesitan una
dirección web real. Nada de esto funciona con `localhost`.

**Qué hacer:**

1. El dominio elegido es `alternativas-libres.com`. Si más adelante quieres
   proteger la marca, registra `alternativas-libres.es` en un registrador
   español (Cloudflare no vende `.es`) y redirígelo al `.com`.
2. Está registrado en Cloudflare, con el DNS y el proxy incluidos gratis.
3. No hay que apuntar el dominio a ninguna IP: el sitio se publica como Worker
   y Cloudflare crea solo los registros del dominio personalizado.

**Cómo sabes que está bien:** el dominio abre tu página.

---

## Paso 2 — Publicar en Cloudflare Workers (~5 min, plan gratuito)

El sitio se despliega con `@opennextjs/cloudflare`, que adapta Next.js al
runtime de Workers (SSR, rutas de API, imagen Open Graph y redirecciones).
La configuración vive en el repo: `wrangler.jsonc`, `open-next.config.ts` y
`worker.ts`.

**La primera vez:**

```bash
pnpm install
pnpm exec wrangler login      # abre el navegador y autoriza la cuenta
pnpm deploy                   # build de Next + build de OpenNext + deploy
```

**Cada vez que cambies código:**

```bash
pnpm deploy
```

**Probar en local con el runtime real de Workers** (recomendado antes de subir):

```bash
pnpm preview                  # http://localhost:8787
```

`pnpm dev` sigue funcionando para el día a día, pero no reproduce el runtime de
Cloudflare.

**Qué queda configurado en la zona** (no está en el repo, se hace una vez):

| Ajuste | Valor |
|---|---|
| Dominio personalizado | `alternativas-libres.com` y `www.alternativas-libres.com` |
| Redirect Rule | `www` → `https://alternativas-libres.com` (301) |
| SSL/TLS → Always Use HTTPS | Activado |
| SSL/TLS → HSTS | `max-age=31536000; includeSubDomains` |
| TLS mínimo | 1.2 |
| Cron Trigger | `0 9 * * 1` → `/api/boletin` (solo actúa si existe `CRON_SECRET`) |

**Cómo sabes que está bien:** `https://alternativas-libres.com` abre el sitio,
`http://` y `www.` redirigen al dominio principal, y el certificado es válido.

> Ojo con los cambios de configuración: las Redirect Rules y los ajustes de
> SSL no se versionan en el repo. Si algún día migras de cuenta, hay que
> volver a crearlos.

---

## Paso 2b — Correo (15 min, gratis)

1. Cloudflare → Email → Email Routing → activar.
2. Añade tu buzón real como destino y verifícalo.
3. Crea `hola@alternativas-libres.com` (es la dirección que muestra la web).
4. Cloudflare crea los MX, el SPF y el DKIM. El DMARC ya está puesto en
   `p=none` para vigilar sin bloquear.

Email Routing solo recibe y reenvía. Para responder como `hola@` necesitas un
buzón real o configurar "Enviar como" en Gmail.

---

## Paso 3 — Rellena `.env.local` (5 min)

El fichero `.env.local` ya está creado en la raíz del proyecto. Rellena:

| Variable | Dónde la sacas |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Tu dominio completo, con `https://` y sin barra final |
| `NEXT_PUBLIC_CONTACTO_EMAIL` | `hola@alternativas-libres.com` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense → Configuración → Cuenta (empieza por `ca-pub-`) |
| `NEXT_PUBLIC_ADSENSE_SLOT_LISTADO` | ID del bloque de anuncio |
| `NEXT_PUBLIC_ADSENSE_SLOT_ARTICULO` | ID del segundo bloque |

Los pasos 4 y 5 te dan esos IDs. Mientras `NEXT_PUBLIC_ADSENSE_CLIENT` esté
vacío, el sitio funciona igual y los anuncios salen como cajas con la palabra
"Publicidad": puedes publicar sin tener la cuenta.

Después de cambiar el `.env.local`, reinicia el servidor (`pnpm build && pnpm start`).

---

## Paso 4 — Cuenta de AdSense (30 min)

1. Entra en `adsense.google.com` con un Gmail/Google Workspace.
2. "Añadir cuenta" → pon tu dominio.
3. AdSense te dará un fragmento de código. Solo necesitas el
   `ca-pub-XXXXXXXX` → va en `NEXT_PUBLIC_ADSENSE_CLIENT`.
4. Activa el CMP: **Privacidad y mensajería → Consentimiento gestionado →
   "Consentimiento gestionado por Google (CMP)"**. Es gratis y sustituye al
   banner local.
5. Crea dos bloques de anuncio (Anuncios → Nuevo bloque):
   - Display → **"Banner responsivo"** → te da un ID. Apúntalo como
     `SLOT_LISTADO`.
   - Otro igual → `SLOT_ARTICULO`.
6. Pega los IDs en el `.env.local`.

**Nota sobre el consentimiento:** con el CMP de Google activado, desactiva el
banner local (en `src/components/cookie-banner.tsx`, quita `<CookieBanner />`
del layout). Los dos juntos obligan al usuario a decidir dos veces y es mala práctica.

---

## Paso 5 — Search Console (15 min)

1. `search.google.com/search-console` → añadir propiedad de tipo dominio.
2. Verifica con DNS (te da un registro TXT).
3. Envía el sitemap: ya está en `https://tudominio.com/sitemap.xml`.
4. En unos días verás las páginas indexadas. En "Inspección de URL" puedes
   pedir que indexe las 10 comparativas, que son las que más te importan.

---

## Paso 6 — Revisa los datos antes de pedir el Approval

Esto es lo que más valor aporta y lo que AdSense mira.

Cada ficha tiene un campo `revisionPendiente`. Las que están a `true` aún no
las has contrastado con la fuente oficial.

**Para revisarlas:**

1. Abre `src/lib/data/alternatives/productividad.ts` (y los otros dos ficheros
   de la misma carpeta).
2. Para cada entrada con `revisionPendiente: true`, comprueba en su repositorio
   oficial: la licencia, si hay imagen de Docker y los requisitos.
3. Cuando lo hayas verificado, cambia a `revisionPendiente: false` y pon la
   fecha de hoy en `verificadoEn`.

Para que no se te escape ninguna:

```bash
node scripts/check-repos.mjs
```

Este script consulta la API de GitHub y te avisa de repositorios archivados,
inexistentes o sin actividad. Define `GITHUB_TOKEN` (gratis, en
github.com/settings/tokens) para que no se agote el límite de peticiones.

**Cuándo pedir el Approval:** cuando tengas 25-30 páginas publicadas y
revisadas. Ahora mismo ya tienes 124 páginas generadas, así que en cuanto
revises las fichas y apuntes el dominio, puedes pedirlo.

---

## Paso 7 — Enlaces de afiliado (2 h, el primer dinero)

Las fichas tienen un campo `afiliado` que ahora mismo está vacío. Cuando
te apuntes a los programas, rellénalo así:

```ts
afiliado: {
  etiqueta: "Contratar hosting",
  url: "https://www.hetzner.com/?referralcode=TU_CODIGO",
  comision: "20 € por cliente",
},
```

Y en la ficha, el enlace "Ir al sitio oficial" ya pasa por `/go/[slug]`, que
redirige añadiendo los parámetros UTM para que puedas medir las conversiones.

**Programas que encajan y a los que conviene apuntarse:** Hetzner, DigitalOcean,
Vultr, Cloudflare, Proton, Fastmail, Plesk.

**Importante:** el texto del enlace no puede prometer nada que no sea cierto
("consigue X gratis" solo si es verdad). Y un enlace de afiliado no cambia la
valoración de la herramienta.

---

## Paso 7.5 — Boletín automático (1 h)

El boletín ya está automatizado: no escribes el correo, se genera solo con las
comparativas y fichas nuevas de las últimas dos semanas.

**Puesta en marcha:**

1. Autoaloja **listmonk** (está en el propio directorio, `/alternativas/mailchimp`).
   Crea una lista y copia su ID desde la URL de la lista.
2. En la pestaña de Ajustes de listmonk, crea un token de API.
3. Rellena en `.env.local`:

```
NEWSLETTER_API_URL=https://boletin.tudominio.com
NEWSLETTER_API_TOKEN=el-token-que-te-dio-listmonk
NEWSLETTER_LIST_ID=1
NEWSLETTER_FROM_EMAIL=boletin@tudominio.com
CRON_SECRET=una-cadena-larga-y-aleatoria
```

4. Prueba el envío manual:

```bash
curl -X POST https://tudominio.com/api/boletin -H "Authorization: Bearer TU_CRON_SECRET"
```

5. Para ver el HTML antes de enviarlo (útil para revisar el diseño):

```
https://tudominio.com/api/boletin?preview=1
```

6. El envío automático está configurado como Cron Trigger de Cloudflare
   (`wrangler.jsonc`, lunes a las 9:00 UTC) y llama a esta ruta. Solo hace algo
   si `CRON_SECRET` está definido como secreto del Worker:

```bash
pnpm exec wrangler secret put CRON_SECRET
pnpm exec wrangler secret put NEWSLETTER_API_URL
pnpm exec wrangler secret put NEWSLETTER_API_TOKEN
pnpm exec wrangler secret put NEWSLETTER_LIST_ID
pnpm exec wrangler secret put NEWSLETTER_FROM_EMAIL
```

`NEXT_PUBLIC_*` no va por secretos: se incrusta en el build, así que vive en
`.env.local` (o en las variables del builder) y se aplica al desplegar.

**El formulario de alta** (en `/boletin` y en el pie) llama a
`/api/suscripcion`, que usa la misma API de listmonk. Si no está configurado,
responde con un mensaje claro en vez de romperse.

**Formulario de contacto:** `/contacto` usa `/api/contacto`, que envía a
`CONTACT_WEBHOOK_URL`. Sirve cualquier webhook (Discord, Slack, Formspree).

---

## Paso 8 — Contenido (continuo)

El único trabajo que no se acaba nunca. En orden de prioridad:

1. **Una comparativa larga por semana.** Es lo que posiciona y lo que más
   dwell time genera (y por tanto, más impresiones de AdSense). Usa como
   plantilla las 10 que ya están.
2. **Una ficha nueva por semana**, de un proyecto que aún no esté.
3. **Una revisión al mes** de las fichas existentes.

Cada comparativa nueva son 2 landings más: la comparativa en sí y la ficha de
cada alternativa que menciona.

---

## Paso 9 — Las primeras semanas

| Semana | Qué haces |
|---|---|
| 1 | Dominio + hosting + publicar + `.env.local` |
| 2 | Search Console + sitemap + pedir indexación de las 10 comparativas |
| 3 | Revisar las fichas con `revisionPendiente: true` |
| 4 | AdSense: cuenta, CMP, dos bloques, IDs en el `.env.local` |
| 5 | Pedir el Approval de AdSense |
| 6 | Darse de alta en los 5 programas de afiliación y rellenar `afiliado` |
| 7+ | Una comparativa y una ficha por semana |

**Expectativas realistas:** los primeros 3 meses no vas a facturar casi nada.
El Approval de AdSense suele tardar entre 1 y 8 semanas. El tráfico de un
directorio nuevo tarda 4-6 meses en despegar. A los 6 meses, si has sido
constante, deberías estar entre 50 y 200 €/mes. A los 12 meses, entre 600 y
1.200 €/mes si además tienes afiliación funcionando.

---

## Nota sobre redes sociales

No hace falta ninguna. Ni Twitter/X, ni Instagram, ni TikTok.

El crecimiento de un directorio viene de tres sitios, en este orden:

1. **Buscadores.** Es el canal principal, y por eso el trabajo de comparativas
   largas y de verificación de datos es lo que más rinde.
2. **Enlaces desde los propios proyectos.** La página `/colabora` está escrita
   para que los mantenedores de un open source te enlacen a su ficha. Es la
   vía más barata y la que menos se obvia.
3. **Comunidades donde ya está tu audiencia:** Reddit, HN, dev.to, foro de
   tu tecnología, grupos de Telegram de autoalojo.

Las redes sociales son opcionales y con un retorno bajo para un directorio
técnico en español. Si algún día quieres, lo razonable sería Bluesky o
Mastodon (sin algoritmo que premie el contenido de pelea) antes que X. Pero no
cuentes con ello para el plan.

---

## Resumen de lo que YA está hecho y no tienes que tocar

- 58 herramientas con fichas verificadas, 12 productos, 10 comparativas largas
- 124 páginas generadas estáticamente
- Modo noche, cookies con Consent Mode v2, menú móvil
- 67 logos oficiales
- Sitemap, RSS, `adsense.txt`, canonicals, JSON-LD, 301s
- 0 enlaces internos rotos (comprobado con `scripts/check-links.mjs`)
- 58 fichas revisadas contra la fuente oficial, con fecha en cada una
- Scripts de mantenimiento: `fetch-logos`, `check-repos`, `check-links`,
  `check-enlaces`, `revisar-fichas`, `verificar-docker`, `fetch-actividad`,
  `check-consola`
- Boletín automático con preview, cron semanal y alta vía listmonk
- Formularios de suscripción y contacto con endpoints propios
- Verificación de enlaces externos (`scripts/check-enlaces.mjs`)
- Actividad de cada proyecto (último commit) en cada ficha
- Plan de monetización detallado en `docs/MONETIZACION.md`
