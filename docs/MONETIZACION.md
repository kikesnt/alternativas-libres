# Plan de monetización

Este documento es la hoja de ruta económica del directorio. El orden importa:
primero se monta lo que no necesita tráfico, después lo que necesita
volumen.

## 1. Fuentes de ingreso y su orden de activación

| Orden | Fuente | Requiere tráfico | Cuánto paga | Cuándo se activa |
|---|---|---|---|---|
| 1 | Afiliación (hosting, correo, dominios) | 50-100 visitas/mes | 20-90 €/conversión | Mes 3-4 |
| 2 | Patrocinios de proyectos open source | 1.000 visitas/mes | 50-300 €/mes | Mes 6-8 |
| 3 | Google AdSense (display) | 10.000+ páginas/mes | RPM 4-9 € | Mes 8-12 |
| 4 | Boletín (newsletter) | 500-2.000 suscriptores | 100-500 €/envío | Mes 12+ |
| 5 | API / licencia de datos | 5.000+ visitas/mes | 99-499 €/mes | Mes 18+ |

La razón de este orden: **una conversión de afiliación paga lo mismo que
2.000-4.000 impresiones de AdSense**. Los programas de afiliación suelen exigir
50-100 visitas al mes como mínimo, y eso se llega antes que las 10.000 páginas
mensuales que AdSense necesita para Approval. Empezar por AdSense es la forma
más común de perder los primeros seis meses.

## 2. Google AdSense

### 2.1 Requisitos previos (checklist)

- [ ] Dominio propio con HTTPS y redirección de `www` a `apex` o al revés.
- [ ] Páginas legales: `/privacidad`, `/cookies`, `/terminos`, `/contacto`,
      `/acerca-de` (ya incluidas).
- [ ] Al menos 25-30 páginas con contenido original y útil (el directorio ya genera 124).
- [ ] Sin contenido generado en masa ni copiado.
- [ ] `adsense.txt` servido con el client ID correcto (ya incluido en
      `src/app/adsense.txt/route.ts`).
- [ ] Navegación, buscador y filtros funcionales.
- [ ] Core Web Vitals en verde en PageSpeed Insights.
- [ ] Search Console configurado y sitemap enviado (ya incluido).

### 2.2 Placement de anuncios

Reglas del programa que se respetan en el código:

- Cada bloque está etiquetado como **"Publicidad"**. Nunca como "Enlaces
  útiles" o "Recursos": eso está prohibido explícitamente.
- No hay lenguaje que incite al clic ("apoya el sitio haciendo clic").
- Los anuncios **no** van dentro de las listings ni entre tarjetas de
  resultados. Solo en páginas con texto suficiente.
- No hay pop-ups ni interstitials. Solo el aviso de cookies, que es
  imprescindible.
- No hay ads en páginas detrás de login (no hay login) ni en el footer
  repetido de todas las páginas.

Slots implementados (`src/components/ad-slot.tsx`):

| Variable de entorno | Dónde aparece |
|---|---|
| `NEXT_PUBLIC_ADSENSE_SLOT_LISTADO` | Home, `/alternativas`, `/categorias/*`, `/acerca-de` |
| `NEXT_PUBLIC_ADSENSE_SLOT_ARTICULO` | Fichas de producto, fichas de herramienta, comparativas |

Dentro de las comparativas hay **dos** insertions: uno tras la entradilla y
otro a mitad de lectura. Es la página con más dwell time del sitio y donde el
RPM se dispara.

Los slots se rellenan con un placeholder si `NEXT_PUBLIC_ADSENSE_CLIENT` no
está definido, así que puedes desarrollar sin anuncios reales.

### 2.3 Consentimiento en la UE

El código implementa Consent Mode v2:

- `src/app/layout.tsx` inyecta el `consent: default` con todo en `denied`
  antes de que cargue nada.
- `src/components/consent-provider.tsx` aplica el `consent: update` según la
  elección del usuario y solo carga `adsbygoogle.js` si se ha aceptado
  publicidad.
- Tres opciones: **Aceptar todo** (personalizados), **Solo anuncios**
  (no personalizados) y **Rechazar** (no se carga nada).

**Para producción, activa el CMP de Google (Funding Choices)** en el panel de
AdSense: es gratuito, ya viene con AdSense y sustituye al banner local. El
banner local queda como fallback y como referencia de la señal que se envía.
Si mantienes el banner local, revisa en la documentación vigente de Google el
mecanismo de `ads_data_mode` para el modo de anuncios limitados, porque es la
parte que más se ha movido.

## 3. Afiliación

### 3.1 Programas que encajan con este nicho

| Programa | Comisión típica | Por qué encaja |
|---|---|---|
| Hetzner | 20 €/cliente (o 10%) | Alojamiento en Europa, foco en self-hosting |
| DigitalOcean | 25 $/cliente | droplet de 1 GB, tutoriales de VPS |
| Vultr | 20-40 $/cliente | planes GPU y de CPU |
| Cloudflare | 20-40 $/plan | dominios, tunneling, Pages |
| Proton | 20-40 % | correo cifrado, alternativa a Gmail |
| Fastmail | 15-20 % | correo y calendario, alternativa a Workspace |
| Plesk/cPanel affiliates | 20-40 % | hosting tradicional |

Reglas de implementación:

- Los enlaces de afiliado pasan por `/go/[slug]`, que redirige con
  parámetros `utm_source`, `utm_medium` y `utm_campaign`. Ya está montado en
  `src/app/go/[slug]/route.ts`.
- `rel="sponsored nofollow"` obligatorio. Implementado en
  `src/components/affiliate-link.tsx`.
- La ficha declara `afiliado: { etiqueta, url, comision }`. Hoy ninguna
  entrada lo tiene: se rellena cuando se cierre el acuerdo.
- Un enlace de afiliado **no puede cambiar el orden** de las fichas ni
  eliminar las contras. Esto está declarado en `/anuncios` y es la línea que
  no se cruza.

### 3.2 Cuántas conversiones hacen falta

A 100 visitas/mes y un 1,5 % de conversión a través de un enlace de
afiliado, son 1,5 conversiones/mes. Con una comisión media de 30 € son **45
€/mes con 100 visitas**. Eso es más que el AdSense de esa misma página.

## 4. Patrocinios

Los proyectos open source que aparecen en el directorio son el objetivo
natural del patrocinio: ya están listados, ya tienen tráfico y necesitan
visibilidad.

- Formato: bloque "Patrocinado" en una categoría concreta + mención en el
  boletín. 50-300 €/mes.
- Regla: el patrocinio no compra una valoración positiva. La ficha mantiene
  sus contras y su fecha de revisión.
- El primer patrocinio no debería llegar antes del mes 6, cuando el
  directorio tenga tráfico suficiente para que el anunciante pueda medirlo.

## 5. Boletín

Un correo cada dos semanas con una migración real (qué se sustituye, por qué,
cuánto cuesta). Es el activo más valioso, porque convierte tráfico en una audiencia que te pertenece, y es lo que convierte un directorio en un negocio vendible.

Criterio de activación: cuando el directorio tenga 25-30 páginas publicadas y
un ritmo constante de publicación (una ficha nueva cada semana), no antes.

## 6. Números objetivo a 12 meses

Escenario conservador, español, 12 meses de trabajo a 10-12 h/semana:

| Mes | Páginas indexadas | Visitas/mes | Ingresos/mes |
|---|---|---|---|
| 3 | 20 | 400 | 0 € |
| 6 | 55 | 1.500 | 50-100 € (afiliación) |
| 9 | 100 | 6.000 | 200-400 € (afiliación + algún patrocinio) |
| 12 | 150 | 20.000 | 600-1.200 € (afiliación + display) |
| 18 | 280 | 60.000 | 2.000-3.500 € |

Adsense por sí solo a 20.000 visitas/mes y RPM de 5 € son unos 100 €/mes. Por
eso la monetización no puede depender solo de AdSense: los números de la
tabla salen de la suma de las cuatro fuentes.

## 7. Calendario de tareas de monetización

- **Mes 1**: abrir cuenta de AdSense (se puede pedir el Approval antes de tener
  tráfico), activar Funding Choices, registrar el dominio en Search Console.
- **Mes 2**: solicitud de los 4-5 programas de afiliación más compatibles con el
  nicho. Rellenar `afiliado` en las fichas de hosting y correo.
- **Mes 3**: publicar comparativas largas (las que mejor posicionan y las que
  más dwell time generan). El directorio ya incluye 10 comparativas de
  referencia como plantilla de estilo y de profundidad.
- **Mes 4**: solicitud de Approval de AdSense con 30+ páginas listas. Si se rechaza,
  revisar "contenido de poco valor" y añadir páginas comparativas.
- **Mes 6**: primer contacto con 10 proyectos open source para patrocinio.
- **Mes 9**: lanzar el boletín con el primer número.
- **Mes 12**: evaluar si tiene sentido abrir la API de datos del directorio.

## 8. Lo que no hay que hacer

- No comprar enlaces ni pagar por directorios. Rompe la estrategia de backlinks
  y el valor del directorio.
- No meter ads en las páginas de listado mientras no tengan texto: hunde el CTR
  y es la causa más común de rechazo.
- No publicar masivamente fichas generadas con IA: es la vía más rápida a un
  rechazo de AdSense y a no posicionar.
- No cambiar la valoración de una herramienta por un acuerdo comercial. En un
  directorio, la credibilidad es el producto.
- No depender de un solo anunciante ni de un solo programa de afiliado.
