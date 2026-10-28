/**
 * Puerta de la exportación estática.
 *
 * Comprueba lo que se sirve, no el código: es lo que lee el rastreador y lo
 * que ve la persona que entra. Si algo falla aquí, el sitio está roto o la
 * revisión de AdSense se cae.
 *
 * Lo que comprueba:
 *
 *  1. `ads.txt` autoriza al vendedor de la cuenta. El ID de editor
 *     (`ca-pub-`) NO es un vendedor: si aparece ahí, AdSense marca
 *     "ads.txt error".
 *  2. Cuando el sitio sirve anuncios, el Consent Mode v2 está declarado
 *     ANTES del script de Google.
 *  3. Toda unidad de anuncio (`<ins class="adsbygoogle">`) está dentro de un
 *     `<template>`: el HTML la lleva (el revisor la ve) y la librería de
 *     AdSense no la encuentra (no se pide nada sin consentimiento).
 *  4. Solo se monetizan las páginas de contenido. Las legales, la búsqueda
 *     y las de servicios quedan fuera.
 *  5. Los IDs de espacio salen del entorno: un ID inventado en el código
 *     produce "invalid ad slot" en cada página.
 *  6. `robots.txt`, `sitemap.xml`, `_headers` y `_redirects` existen.
 *  7. Cada URL del sitemap tiene su página en `out/`, y cada página tiene
 *     su entrada en el sitemap (salvo las que no deben indexarse).
 *  8. Las redirecciones de /go/ cubren todas las alternativas.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");

/** La build se hizo con anuncios (variables NEXT_PUBLIC_ADSENSE_*). */
const ADS_BUILD = Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);

/** Rutas que sí llevan publicidad. */
const CON_ANUNCIOS = [
  /^\/$/,
  /^\/alternativas$/,
  /^\/acerca-de$/,
  /^\/categorias\/[^/]+$/,
  /^\/alternativas\/[^/]+$/,
  /^\/alternativas\/[^/]+\/[^/]+$/,
  /^\/comparativas\/[^/]+$/,
];

/** Rutas que no llevan publicidad nunca. */
const SIN_ANUNCIOS = [
  /^\/privacidad$/,
  /^\/terminos$/,
  /^\/contacto$/,
  /^\/cookies$/,
  /^\/buscar$/,
  /^\/metodologia$/,
  /^\/anuncios$/,
  /^\/novedades$/,
  /^\/colabora$/,
  /^\/herramientas\/[^/]+$/,
  /^\/verticales\/[^/]+$/,
];

const errors = [];

function fail(mensaje) {
  errors.push(mensaje);
}

if (!existsSync(OUT)) {
  console.error("No existe out/: la puerta se ejecuta después de next build.");
  process.exit(1);
}

/* ---- 1. ads.txt -------------------------------------------------------- */
const adsTxtPath = join(OUT, "ads.txt");
if (!existsSync(adsTxtPath)) {
  fail("ads.txt no existe: AdSense lo marca como error y bloquea la revisión.");
} else {
  const lineas = readFileSync(adsTxtPath, "utf8")
    .split("\n")
    .map((linea) => linea.trim())
    .filter((linea) => linea && !linea.startsWith("#"));
  const google = lineas.filter((linea) => linea.startsWith("google.com,"));
  if (google.length === 0) {
    fail(`ads.txt no autoriza a Google como vendedor: ${JSON.stringify(lineas)}`);
  }
  for (const linea of google) {
    if (!/,\s*pub-\d+,\s*DIRECT,\s*[0-9a-f]+$/i.test(linea)) {
      fail(`la línea de ads.txt no lleva el ID de cuenta (pub-) ni el sello: ${linea}`);
    }
    if (linea.includes("ca-pub-")) {
      fail(`ads.txt lleva el ID de editor (ca-pub-): no es un vendedor. ${linea}`);
    }
  }
}

/* ---- 6. ficheros que Pages necesita ------------------------------------ */
for (const fichero of ["robots.txt", "sitemap.xml", "_headers", "_redirects", "404.html"]) {
  if (!existsSync(join(OUT, fichero))) {
    fail(`falta ${fichero} en out/`);
  }
}

/* ---- todas las páginas -------------------------------------------------- */
function htmlFiles(dir, out = []) {
  for (const entrada of readdirSync(dir)) {
    const completa = join(dir, entrada);
    if (statSync(completa).isDirectory()) {
      if (entrada === "_next") continue;
      htmlFiles(completa, out);
    } else if (entrada.endsWith(".html")) {
      out.push(completa);
    }
  }
  return out;
}

const paginas = htmlFiles(OUT);
const rutas = new Map();
for (const pagina of paginas) {
  const rel = relative(OUT, pagina).replace(/\\/g, "/");
  if (rel === "404.html" || rel === "_not-found.html") continue;
  const base = rel.replace(/\.html$/, "");
  // out/index.html es la portada: su ruta es "/", no "/index".
  const ruta = base === "index" ? "/" : "/" + base;
  rutas.set(ruta, pagina);
}

const slotsConfigurados = new Set(
  ["NEXT_PUBLIC_ADSENSE_SLOT_LISTADO", "NEXT_PUBLIC_ADSENSE_SLOT_ARTICULO"]
    .map((nombre) => process.env[nombre] ?? "")
    .filter(Boolean)
);

let conScript = 0;
let conUnidad = 0;

for (const [ruta, pagina] of rutas) {
  const html = readFileSync(pagina, "utf8");

  /* ---- 2. Consent Mode v2 antes del script ---- */
  const scriptAt = html.indexOf("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
  const consentAt = html.search(/gtag\(\s*['"]consent['"]\s*,\s*['"]default['"]/);
  if (scriptAt !== -1) {
    conScript += 1;
    if (consentAt === -1) {
      fail(`${ruta}: carga el script de AdSense sin declarar Consent Mode v2.`);
    } else if (consentAt > scriptAt) {
      fail(`${ruta}: el Consent Mode v2 se declara DESPUÉS del script de Google.`);
    }
  }

  /* ---- 3. las unidades dentro de un <template> ---- */
  const plantillas = [
    ...html.matchAll(/<template[^>]*data-ad-template[^>]*>([\s\S]*?)<\/template>/g),
  ];
  const unidadesEnPlantilla = plantillas.reduce(
    (n, t) => n + (t[1].match(/<ins[^>]*adsbygoogle/g) ?? []).length,
    0,
  );
  const totalUnidades = (html.match(/<ins[^>]*adsbygoogle/g) ?? []).length;
  if (totalUnidades > 0) conUnidad += 1;

  if (totalUnidades !== unidadesEnPlantilla) {
    fail(
      `${ruta}: hay ${totalUnidades - unidadesEnPlantilla} unidad(es) fuera de un <template>. ` +
        "Fuera del <template> la librería de AdSense las encuentra y se pide el anuncio sin consentimiento.",
    );
  }

  /* ---- 4. qué páginas se monetizan ---- */
  const debe = CON_ANUNCIOS.some((patron) => patron.test(ruta));
  const nunca = SIN_ANUNCIOS.some((patron) => patron.test(ruta));
  if (nunca && totalUnidades > 0) {
    fail(`${ruta}: lleva publicidad y es una página que no se monetiza.`);
  }
  if (debe && ADS_BUILD && totalUnidades === 0) {
    fail(`${ruta}: es una página de contenido y no lleva ninguna unidad de anuncio.`);
  }
  if (!debe && !nunca && totalUnidades > 0) {
    fail(`${ruta}: lleva publicidad y no está en la lista de páginas que se monetizan.`);
  }

  /* ---- 5. los IDs de espacio vienen del entorno ---- */
  for (const coincidencia of html.matchAll(/data-ad-slot="([^"]*)"/g)) {
    const id = coincidencia[1];
    if (id.length === 0) {
      fail(`${ruta}: hay una unidad de anuncio sin ID de espacio.`);
    } else if (!slotsConfigurados.has(id)) {
      fail(
        `${ruta}: usa el ID de espacio ${id}, que no viene del entorno ` +
          `(${[...slotsConfigurados].join(", ") || "sin configurar"}). No se inventan IDs de AdSense.`,
      );
    }
  }
}

/* ---- 7. sitemap y páginas ------------------------------------------------ */
const sitemapPath = join(OUT, "sitemap.xml");
if (existsSync(sitemapPath)) {
  const xml = readFileSync(sitemapPath, "utf8");
  const locs = [...xml.matchAll(/<loc>https:\/\/alternativas-libres\.com([^<]*)<\/loc>/g)].map(
    (m) => m[1] || "/",
  );
  for (const loc of locs) {
    const ruta = loc === "/" ? "/" : loc.replace(/\/$/, "");
    if (!rutas.has(ruta)) {
      fail(`el sitemap lista ${loc} pero no hay ninguna página con esa ruta en out/.`);
    }
  }
  for (const ruta of rutas.keys()) {
    if (ruta === "/buscar") continue; // noindex a propósito
    if (!locs.includes(ruta === "/" ? "/" : `${ruta}/`) && !locs.includes(ruta)) {
      fail(`${ruta} existe pero no está en el sitemap.`);
    }
  }
}

/* ---- 8. las redirecciones de /go/ cubren las alternativas ---------------- */
const redirectsPath = join(OUT, "_redirects");
if (existsSync(redirectsPath)) {
  const redirects = readFileSync(redirectsPath, "utf8");
  const go = [...redirects.matchAll(/^\/go\/([^\s]+)\s+(\S+)/gm)];
  if (go.length === 0) {
    fail("_redirects no tiene ninguna redirección /go/: los enlaces salientes se romperían.");
  }
  for (const [, slug, destino] of go) {
    if (!destino.includes("utm_source=alternativas_libres")) {
      fail(`/go/${slug}: la redirección no lleva los parámetros UTM.`);
    }
  }
  // Se comparan las rutas normalizadas: el fichero lleva tabulaciones y
  // espacios de alineación, que no significan nada.
  const rutasRedirect = new Set(
    redirects
      .split("\n")
      .map((linea) => linea.trim())
      .filter((linea) => linea && !linea.startsWith("#"))
      .map((linea) => linea.split(/\s+/).slice(0, 2).join(" ")),
  );
  for (const estatico of [
    "/comparativa/:slug /comparativas/:slug",
    "/blog /comparativas",
    "/sponsor /anuncios",
    "/add-your-tool /colabora",
  ]) {
    if (!rutasRedirect.has(estatico)) {
      fail(`_redirects no tiene la redirección ${estatico.split(" ")[0]}.`);
    }
  }
}

/* ---- resultado ---------------------------------------------------------- */
if (errors.length) {
  console.error(`La puerta ha fallado (${errors.length}):`);
  for (const error of errors) console.error(`  x  ${error}`);
  process.exit(1);
}

console.log("Puerta correcta.");
console.log(`  Páginas comprobadas: ${rutas.size}`);
console.log(`  Páginas con script de AdSense: ${conScript}`);
console.log(`  Páginas con unidad de anuncio: ${conUnidad}`);
console.log(`  ads.txt: ${existsSync(adsTxtPath) ? "correcto" : "FALTA"}`);

/*
 * Aviso, no error: los datos registrales del titular son opcionales y el
 * aviso legal se publica sin ellos. El aviso sale por consola, no en la
 * pagina: una politica de privacidad que anuncia su propia carencia es peor
 * que una politica que identifica al responsable como el titular del dominio
 * con su correo de contacto, que es lo que se publica mientras falten.
 */
const variablesTitular = [
  "NEXT_PUBLIC_TITULAR_NOMBRE",
  "NEXT_PUBLIC_TITULAR_DOMICILIO",
  "NEXT_PUBLIC_TITULAR_NIF",
  "NEXT_PUBLIC_TITULAR_EMAIL",
];
const faltanTitular = variablesTitular.filter(
  (variable) => !(process.env[variable] ?? "").trim(),
);
if (faltanTitular.length) {
  console.log(
    `\nAviso: faltan ${faltanTitular.length} dato(s) del titular (${faltanTitular.join(", ")}).`,
  );
  console.log(
    "  El aviso legal se publica con el titular del dominio y el correo de contacto.",
  );
  console.log(
    "  Para poner los datos exactos, define esas variables en el entorno de Cloudflare Pages.",
  );
}
