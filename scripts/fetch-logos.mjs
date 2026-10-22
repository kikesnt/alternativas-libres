import { readFile, readdir, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const exec = promisify(execFile);

const raiz = path.resolve(import.meta.dirname, "..");
const dirDatos = path.join(raiz, "src/lib/data/alternatives");
const dirLogos = path.join(raiz, "public/logos");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

function sniff(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00)
    return "ico";
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  )
    return "webp";
  const head = buf.slice(0, 200).toString("utf8").trim().toLowerCase();
  if (head.startsWith("<svg") || head.includes("<svg")) return "svg";
  return null;
}

async function leerProductos() {
  const texto = await readFile(
    path.join(raiz, "src/lib/data/products.ts"),
    "utf8",
  );
  const salida = [];
  for (const bloque of texto.split(/\n  \{\n/).slice(1)) {
    const slug = bloque.match(/slug:\s*"([^"]+)"/)?.[1];
    const url = bloque.match(/\n\s+url:\s*"([^"]+)"/)?.[1];
    if (slug && url) salida.push({ slug, url });
  }
  return salida;
}

async function leerAlternativas() {
  const archivos = (await readdir(dirDatos)).filter((f) => f.endsWith(".ts"));
  const salida = [];
  for (const archivo of archivos) {
    const texto = await readFile(path.join(dirDatos, archivo), "utf8");
    const bloques = texto.split(/\n  \{\n/).slice(1);
    for (const bloque of bloques) {
      const slug = bloque.match(/slug:\s*"([^"]+)"/)?.[1];
      const url = bloque.match(/\n\s+url:\s*"([^"]+)"/)?.[1];
      if (slug && url) salida.push({ slug, url });
    }
  }
  return salida;
}

async function faviconDeSitio(url) {
  const control = new AbortController();
  const t = setTimeout(() => control.abort(), 12000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: control.signal,
      redirect: "follow",
    });
    const html = await res.text();
    const candidatos = [];
    const re = /<link[^>]+>/gi;
    for (const m of html.match(re) ?? []) {
      const rel = m.match(/rel=["']([^"']*)["']/i)?.[1]?.toLowerCase() ?? "";
      const href = m.match(/href=["']([^"']+)["']/i)?.[1];
      if (!href) continue;
      if (rel.includes("apple-touch-icon")) candidatos.push({ href, peso: 3 });
      else if (rel.includes("icon") && !rel.includes("mask"))
        candidatos.push({ href, peso: 2 });
      else if (rel.includes("mask-icon")) candidatos.push({ href, peso: 1 });
    }
    if (candidatos.length === 0) {
    try {
      const r = await fetch(new URL("/favicon.ico", url).toString(), {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(10000),
      });
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        const ext = sniff(buf);
        if (ext) return { buf, ext, origen: "favicon.ico directo" };
      }
    } catch {
      return null;
    }
    return null;
  }
    candidatos.sort((a, b) => b.peso - a.peso);
    for (const c of candidatos.slice(0, 3)) {
      const absoluta = new URL(c.href, url).toString();
      const r = await fetch(absoluta, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      const ext = sniff(buf);
      if (ext) return { buf, ext, origen: absoluta };
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function faviconDeGoogle(host) {
  try {
    const r = await fetch(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`,
      { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) },
    );
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    const ext = sniff(buf);
    return ext ? { buf, ext, origen: "google-favicon" } : null;
  } catch {
    return null;
  }
}

async function principal(items, limite) {
  const resultados = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const item = items[i++];
      resultados.push(await procesar(item));
    }
  }
  await Promise.all(
    Array.from({ length: limite }, () => worker()),
  );
  return resultados;
}

async function procesar({ slug, url }) {
  const destino = path.join(dirLogos, slug);
  const extensiones = [".png", ".svg", ".webp", ".jpg", ".ico"];
  const existente = extensiones.find((e) => existsSync(destino + e));
  if (existente) {
    return {
      slug,
      estado: "ok",
      archivo: `/logos/${slug}${existente}`,
      metodo: "cache",
      bytes: 0,
    };
  }
  let logo = await faviconDeSitio(url);
  let metodo = "sitio";
  if (!logo) {
    logo = await faviconDeGoogle(new URL(url).hostname);
    metodo = "google";
  }
  if (!logo) return { slug, estado: "sin-logo" };

  let buffer = logo.buf;
  let ext = logo.ext;

  if (ext === "ico") {
    const temporal = path.join(dirLogos, `${slug}.ico`);
    await writeFile(temporal, buffer);
    try {
      await exec("sips", ["-s", "format", "png", temporal, "--out", path.join(dirLogos, `${slug}.png`)]);
      await rm(temporal, { force: true });
      buffer = await readFile(path.join(dirLogos, `${slug}.png`));
      ext = "png";
    } catch {
      ext = "ico";
    }
  }

  const finalPath = path.join(dirLogos, `${slug}.${ext}`);
  await writeFile(finalPath, buffer);
  return {
    slug,
    estado: "ok",
    archivo: `/logos/${slug}.${ext}`,
    metodo,
    bytes: buffer.length,
  };
}

await mkdir(dirLogos, { recursive: true });

const items = await leerAlternativas();
const productos = await leerProductos();

console.log(`Procesando ${items.length} herramientas...`);
const resHerramientas = await principal(items, 6);
console.log(`Procesando ${productos.length} productos...`);
const resProductos = await principal(productos, 4);

const mapa = {};
const mapaProductos = {};
const fallidos = [];

for (const r of resHerramientas) {
  if (r.estado === "ok") mapa[r.slug] = r.archivo;
  else if (r.estado !== "ya-existe") fallidos.push(r.slug);
}
for (const r of resProductos) {
  if (r.estado === "ok") mapaProductos[r.slug] = r.archivo;
  else if (r.estado !== "ya-existe") fallidos.push(`producto:${r.slug}`);
}

await writeFile(
  path.join(raiz, "src/lib/data/logos.ts"),
  `export const logos: Record<string, string> = ${JSON.stringify(mapa, null, 2)};\n\nexport const logosProducto: Record<string, string> = ${JSON.stringify(mapaProductos, null, 2)};\n`,
);

console.log(`\nHerramientas con logo: ${Object.keys(mapa).length}`);
console.log(`Productos con logo: ${Object.keys(mapaProductos).length}`);
console.log(`Sin logo: ${fallidos.length} -> ${fallidos.join(", ")}`);
