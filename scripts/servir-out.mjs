// Servidor local que imita a Cloudflare Pages.
//
// Sirve out/ como lo haría Pages: URLs limpias (/alternativas sirve
// alternativas.html), los ficheros _redirects y las cabeceras de _headers.
// Sirve para mirar el sitio antes de publicarlo y para comprobar que las
// redirecciones que se han generado funcionan.
//
//   node scripts/servir-out.mjs [puerto]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(RAIZ, "out");
const PUERTO = Number(process.argv[2] ?? 8787);

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

/** Reglas de _redirects: "origen destino [codigo]". */
async function reglasRedirects() {
  try {
    const texto = await readFile(join(OUT, "_redirects"), "utf8");
    return texto
      .split("\n")
      .map((linea) => linea.trim())
      .filter((linea) => linea && !linea.startsWith("#"))
      .map((linea) => {
        const partes = linea.split(/\s+/);
        const codigo = partes.length > 2 ? Number(partes[2]) : 302;
        return { origen: partes[0], destino: partes[1], codigo };
      });
  } catch {
    return [];
  }
}

/** Cabeceras de _headers: bloques "/ruta" con sus cabeceras. */
async function reglasHeaders() {
  try {
    const texto = await readFile(join(OUT, "_headers"), "utf8");
    const bloques = [];
    let actual = null;
    for (const linea of texto.split("\n")) {
      if (!linea.trim() || linea.trim().startsWith("#")) continue;
      if (!/^\s/.test(linea)) {
        actual = { ruta: linea.trim(), cabeceras: {} };
        bloques.push(actual);
      } else if (actual) {
        const separador = linea.indexOf(":");
        if (separador > 0) {
          actual.cabeceras[linea.slice(0, separador).trim()] = linea
            .slice(separador + 1)
            .trim();
        }
      }
    }
    return bloques;
  } catch {
    return [];
  }
}

async function existe(ruta) {
  try {
    const info = await stat(ruta);
    // Un directorio no se puede servir: out/alternativas existe, pero lo que
    // se sirve es out/alternativas.html.
    return info.isFile();
  } catch {
    return false;
  }
}

/** Pages busca el fichero, luego el .html y luego el index.html. */
async function resolver(ruta) {
  const limpia = ruta.split("?")[0].split("#")[0];
  const base = limpia === "/" ? "/index" : limpia;
  const candidatos = [
    join(OUT, base),
    join(OUT, base + ".html"),
    join(OUT, base, "index.html"),
  ];
  for (const candidato of candidatos) {
    if (await existe(candidato)) return candidato;
  }
  return null;
}

const redirects = await reglasRedirects();
const headers = await reglasHeaders();

const servidor = createServer(async (req, res) => {
  const url = req.url ?? "/";
  const ruta = url.split("?")[0];

  // Redirecciones
  for (const regla of redirects) {
    const patron = new RegExp(
      "^" + regla.origen.replace(/:[^/]+/g, "([^/]+)").replace(/\*/g, ".*") + "$",
    );
    const coincidencia = patron.exec(ruta);
    if (!coincidencia) continue;
    let destino = regla.destino;
    let indice = 1;
    destino = destino.replace(/:[^/]+/g, () => coincidencia[indice++] ?? "");
    const separador = url.includes("?") ? "&" : "?";
    const consulta = url.includes("?") ? url.slice(url.indexOf("?")) : "";
    res.writeHead(regla.codigo, { Location: destino + (consulta ? separador + consulta.slice(1) : "") });
    res.end();
    return;
  }

  const fichero = await resolver(ruta);
  if (!fichero) {
    const error = await resolver("/404.html");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(error ? await readFile(error) : "404");
    return;
  }

  const tipo = TIPOS[extname(fichero)] ?? "application/octet-stream";
  const cabeceras = { "Content-Type": tipo };
  for (const bloque of headers) {
    if (ruta.startsWith(bloque.ruta.replace(/\*$/, ""))) {
      Object.assign(cabeceras, bloque.cabeceras);
    }
  }
  res.writeHead(200, cabeceras);
  res.end(await readFile(fichero));
});

servidor.listen(PUERTO, "127.0.0.1", () => {
  console.log(`Sirviendo out/ en http://127.0.0.1:${PUERTO}`);
  console.log(`  ${redirects.length} redirecciones, ${headers.length} bloques de cabeceras`);
});
