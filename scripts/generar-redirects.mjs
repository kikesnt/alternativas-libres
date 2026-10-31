// Genera las redirecciones de /go/<slug> al final de la build.
//
// Antes esto era una route handler (/go/[slug]) que redirigía a la web de la
// alternativa con los parámetros UTM. Con `output: "export"` Next.js solo
// puede generar archivos, no redirecciones, así que las redirecciones se
// escriben en out/_redirects y las lee Cloudflare Pages.
//
// Los UTM son los mismos que usaba la route handler:
//   utm_source=alternativas_libres  utm_medium=afiliado  utm_campaign=<slug>
//
// El fichero se genera desde los datos, no a mano: así no puede quedarse
// desactualizado cuando se añade o se cambia una alternativa.
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");

if (!existsSync(OUT)) {
  console.error("generar-redirects: no existe out/. Se ejecuta después de next build.");
  process.exit(1);
}

/*
 * Los datos se importan de los ficheros sueltos, no del índice: el índice
 * usa importaciones sin extensión, que Node no resuelve. Los ficheros de
 * datos solo importan tipos, que desaparecen al compilar, así que no hace
 * falta resolver ningún alias.
 */
const { productividad } = await import(
  join(ROOT, "src/lib/data/alternatives/productividad.ts")
);
const { comunicacion } = await import(
  join(ROOT, "src/lib/data/alternatives/comunicacion.ts")
);
const { infraestructura } = await import(
  join(ROOT, "src/lib/data/alternatives/infraestructura.ts")
);

const alternativas = [...productividad, ...comunicacion, ...infraestructura];

const destino = join(OUT, "_redirects");
const yaGeneradas = existsSync(destino) ? readFileSync(destino, "utf8") : "";

const lineas = [];
for (const alternativa of alternativas) {
  const url = alternativa.afiliado?.url ?? alternativa.url;
  if (!url || !alternativa.slug) continue;
  const destinoUrl = new URL(url);
  destinoUrl.searchParams.set("utm_source", "alternativas_libres");
  destinoUrl.searchParams.set("utm_medium", "afiliado");
  destinoUrl.searchParams.set("utm_campaign", alternativa.slug);
  lineas.push(`/go/${alternativa.slug}  ${destinoUrl.toString()}  302`);
}

// Las redirecciones de /go/ se regeneran en cada build: se quitan las
// anteriores antes de escribir las nuevas, para que ninguna se duplique.
const sinGo = yaGeneradas
  .split("\n")
  .filter((linea) => !linea.trim().startsWith("/go/"))
  .join("\n")
  .trimEnd();

const contenido = [sinGo, "", "# Enlaces salientes con UTM (generado por scripts/generar-redirects.mjs)", ...lineas, ""]
  .filter((linea) => linea !== "")
  .join("\n");

appendFileSync(destino, "\n" + contenido.replace(/^\n+/, ""));
console.log(`generar-redirects: ${lineas.length} redirecciones /go/ escritas en out/_redirects`);
