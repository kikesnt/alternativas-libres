# Primeros pasos, en orden

Guía para deixar el sitio en marcha. Cada paso depende del anterior.

---

## Paso 1 — Dominio (30 min, ~10-15 €/año)

**Por qué es el primero:** AdSense, Search Console y el sitemap necesitan una
dirección web real. Nada de esto funciona con `localhost`.

**Qué hacer:**

1. Elige un nombre de dominio que sea corto y del sector. Ejemplos del estilo
   que encaja con el contenido: `alternativaslibres.es`, `autohospedado.es`,
   `stacket.es`.
2. Comprueba que está libre y regístralo. Proveedores con panel de DNS
   intuitivo: Cloudflare (registro + DNS + proxy gratis), Porkbun, Namecheap.
3. Apunta el dominio a la IP del servidor donde vas a publicar (paso 2).

**Cómo sabes que está bien:** el dominio abre tu página.

---

## Paso 2 — Hosting y publicación (1 h, 5-10 €/mes)

**Qué hacer:**

1. Contrata una VPS (un servidor con Linux y una IP). Para empezar: 2 vCPU y
   4 GB de RAM bastan de sobra. Proveedores: Hetzner (Europa, más barato),
   DigitalOcean, Vultr, Contabo.
2. Instala Node.js 20+ y Nginx (proxy) + un certificado HTTPS gratuito con
   Let's Encrypt o Caddy.
3. Sube el proyecto y publícalo:

```bash
# en el servidor
git clone <tu-repo> /var/www/alternativas
cd /var/www/alternativas
pnpm install
pnpm build
pnpm start        # o con systemd/pm2 para que arranque solo
```

4. Nginx hace de proxy inverso hacia el puerto 3000 y renewal del
   certificado. Con Caddy es automático:

```
alternativaslibres.es {
    reverse_proxy localhost:3000
}
```

**Alternativa si no quieres tocar servidores:** Vercel Hobby (gratis) o
Netlify. Sube el repo, conecta el dominio y listo. El único límite es que
AdSense a veces tarda más en aprobar dominios alojados ahí.

**Cómo sabes que está bien:** `https://tudominio.es` abre el sitio con el
certificado verde.

---

## Paso 3 — Rellena `.env.local` (5 min)

El fichero `.env.local` ya está creado en la raíz del proyecto. Rellena:

| Variable | Dónde la sacas |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Tu dominio, sin `https://` |
| `NEXT_PUBLIC_CONTACTO_EMAIL` | El tuyo |
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
3. Envía el sitemap: ya está en `https://tudominio.es/sitemap.xml`.
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
NEWSLETTER_API_URL=https://boletin.tudominio.es
NEWSLETTER_API_TOKEN=el-token-que-te-dio-listmonk
NEWSLETTER_LIST_ID=1
NEWSLETTER_FROM_EMAIL=boletin@tudominio.es
CRON_SECRET=una-cadena-larga-y-aleatoria
```

4. Prueba el envío manual:

```bash
curl -X POST https://tudominio.es/api/boletin -H "Authorization: Bearer TU_CRON_SECRET"
```

5. Para ver el HTML antes de enviarlo (útil para revisar el diseño):

```
https://tudominio.es/api/boletin?preview=1
```

6. El envío automático está configurado en `vercel.json`: un cron los lunes a
   las 9:00 UTC. Si no usas Vercel, cronea la misma ruta desde tu servidor.

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
- Scripts de mantenimiento: `fetch-logos`, `check-repos`, `check-links`
- Boletín automático con preview, cron semanal y alta vía listmonk
- Formularios de suscripción y contacto con endpoints propios
- Verificación de enlaces externos (`scripts/check-enlaces.mjs`)
- Actividad de cada proyecto (último commit) en cada ficha
- Plan de monetización detallado en `docs/MONETIZACION.md`
