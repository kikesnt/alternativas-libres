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
3. No hay que apuntar el dominio a ninguna IP: el sitio se publica en Cloudflare
   Pages y Cloudflare crea solo los registros del dominio personalizado.

**Cómo sabes que está bien:** el dominio abre tu página.

---

## Paso 2 — Publicar en Cloudflare Pages (~5 min, plan gratuito)

El sitio es estático: la build genera todas las páginas en `out/` y Pages las
sirve como archivos. No hay Worker ni runtime de servidor.

> **Por qué se cambió.** Hasta ahora el sitio era un Worker de OpenNext y eso
> lo tumbó: las páginas que necesitan render de Next.js pasaban por el Worker,
> que se pasó del límite de CPU de Cloudflare (error 1102) y devolvió error en
> 94 de las 179 URL. Con exportación estática no hay CPU que reventar, y además
> el sitio cuesta cero.

**La primera vez**, en Cloudflare → Workers & Pages → Create → Pages → Connect
to Git:

| Ajuste | Valor |
|---|---|
| Nombre del proyecto | `alternativas-libres` |
| Rama de producción | `main` |
| Framework preset | *None* |
| Build command | `pnpm build` |
| Build output directory | `out` |
| Variable de entorno | `NODE_VERSION` = `22` |

**Cada vez que cambies código:** se fusiona a `main` y Cloudflare compila y
publica solo. Si prefieres que lo haga GitHub Actions en vez de Cloudflare,
el workflow `Deploy` de `.github/workflows/deploy.yml` hace exactamente lo
mismo (build, puerta de AdSense, analizador y `wrangler pages deploy`), y
falla el job sin publicar nada si la build o los verificadores fallan.

**Probar en local antes de subir**, con el mismo comportamiento que Pages
(URLs limpias, `_redirects` y `_headers`):

```bash
pnpm build
node scripts/servir-out.mjs      # http://127.0.0.1:8787
```

`pnpm dev` sigue funcionando para el día a día.

### La vía corta: un token y un comando

Lo de arriba son unos diez clics en el panel. Si prefieres que el trabajo lo
haga la máquina, el trabajo se reduce a **crear un token de API y guardarlo como
secreto de GitHub**. A partir de ahí, el despliegue y la mudanza del dominio se
hacen solos.

**1. Crear el token** (2 min, en Cloudflare → *Mi perfil* → *Tokens de API* →
*Crear token* → *Token personalizado*):

| Permiso | Acceso |
|---|---|
| Account → Cloudflare Pages | Edit |
| Account → Settings | Read |
| Account → Workers Scripts | Edit |
| Zone → DNS | Edit |

> Es el mismo token que ya sirve para `dalilqiyada`: son de **cuenta**, así que
> valen para todos los sitios de la cuenta.

**2. Guardarlo como secreto** (no queda en el historial ni en el disco):

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo kikesnt/alternativas-libres
```

El `gh` lo pide por pantalla: pegas el token y pulsas Intro.

Las dos variables que faltan ya están puestas en el repo:
`CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_PROJECT_NAME`.

**3. Publicar y mover el dominio.** Con el token en el secreto, el workflow
`Deploy` publica en cada `push` a `main`, y el script mueve el dominio del
Worker al proyecto de Pages:

```bash
pnpm migrate:pages                    # solo informa de lo que hay y lo que falta
node scripts/migrar-a-pages.mjs --aplicar   # suelta el dominio del Worker y lo pasa a Pages
```

El script avisa de cada paso: si el dominio sigue con un CNAME a `workers.dev`,
lo dice, porque ese registro hay que cambiarlo a `<proyecto>.pages.dev`.

**Qué queda configurado en la zona** (no está en el repo, se hace una vez):

| Ajuste | Valor |
|---|---|
| Dominio personalizado | `alternativas-libres.com` y `www.alternativas-libres.com` |
| Redirect Rule | `www` → `https://alternativas-libres.com` (301) |
| SSL/TLS → Always Use HTTPS | Activado |
| SSL/TLS → HSTS | `max-age=31536000; includeSubDomains` |
| TLS mínimo | 1.2 |

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
| `NEXT_PUBLIC_ADSENSE_CMP` | `google` si usas el CMP de Google (recomendado) |

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
   banner local. Después pon `NEXT_PUBLIC_ADSENSE_CMP=google` y el banner
   propio se retira solo: dos avisos seguidos obligan a decidir dos veces.
5. Crea dos bloques de anuncio (Anuncios → Nuevo bloque):
   - Display → **"Banner responsivo"** → te da un ID. Apúntalo como
     `SLOT_LISTADO`.
   - Otro igual → `SLOT_ARTICULO`.
6. Pega los IDs en el `.env.local`.

Mientras no haya ID de bloque, los huecos de anuncio no se pintan: no queda
espacio vacío ni errores en la consola. Si tampoco hay `ADSENSE_CLIENT`, el
sitio funciona igual y en desarrollo se ven cajas de muestra.

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

## Paso 7.5 — Formulario de contacto (10 min)

> **El boletín automático se ha quitado del sitio.** Se han eliminado la
> página `/boletin`, las rutas `/api/boletin` y `/api/suscripcion` y el cron
> que las disparaba. El motivo no es técnico: un boletín que no se escribe no
> se envía, y un boletín automático sin revisar es correo basura con la
> reputación del dominio. Si algún día se retoma, el sitio ya tiene la
> estructura: lo que hace falta es un envío que alguien revise.

**Formulario de contacto:** `/contacto` usa `/api/contacto`, que ahora es una
Pages Function (`functions/api/contacto.ts`), y tiene dos caminos, por orden:

1. `CONTACT_WEBHOOK_URL`, si existe (Discord, Slack, Formspree, Zapier…). Es
   la vía recomendada: no depende de nada de Cloudflare.
2. El binding `EMAIL` de Email Routing, si el proyecto lo tiene. El correo
   sale de `web@alternativas-libres.com` y llega al buzón indicado en
   `CONTACT_EMAIL_TO`, que **tiene que ser un destino verificado** en Email
   Routing.

Si no hay ninguna de las dos, el formulario responde con un aviso para que la
persona escriba directamente a `hola@alternativas-libres.com`: es preferible a
perder el mensaje sin avisar.

En Cloudflare Pages, las variables se ponen en *Settings → Environment
variables* (no hay `wrangler secret put`): el nombre de la variable y el valor
en dos campos.

Sin webhook ni binding, el formulario responde 503 con un aviso honesto en vez
de fingir que ha enviado.

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
- Sitemap, RSS, `ads.txt`, canonicals, JSON-LD, 301s
- 0 enlaces internos rotos (comprobado con `scripts/check-links.mjs`)
- 58 fichas revisadas contra la fuente oficial, con fecha en cada una
- Scripts de mantenimiento: `fetch-logos`, `check-repos`, `check-links`,
  `check-enlaces`, `revisar-fichas`, `verificar-docker`, `fetch-actividad`,
  `check-consola`
- Formulario de contacto con una Pages Function propia
- Verificación de enlaces externos (`scripts/check-enlaces.mjs`)
- Actividad de cada proyecto (último commit) en cada ficha
- Plan de monetización detallado en `docs/MONETIZACION.md`
