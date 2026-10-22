import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const raiz = path.resolve(import.meta.dirname, "..");
const dirDatos = path.join(raiz, "src/lib/data/alternatives");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function leerUrls() {
  const archivos = (await readdir(dirDatos)).filter((f) => f.endsWith(".ts"));
  const productos = await readFile(
    path.join(raiz, "src/lib/data/products.ts"),
    "utf8",
  );
  const salidas = [];

  for (const bloque of productos.split(/\n  \{\n/).slice(1)) {
    const slug = bloque.match(/slug:\s*"([^"]+)"/)?.[1];
    const url = bloque.match(/\n\s+url:\s*"([^"]+)"/)?.[1];
    if (slug && url) salidas.push({ tipo: "producto", slug, url });
  }

  for (const archivo of archivos) {
    const texto = await readFile(path.join(dirDatos, archivo), "utf8");
    for (const bloque of texto.split(/\n  \{\n/).slice(1)) {
      const slug = bloque.match(/slug:\s*"([^"]+)"/)?.[1];
      const url = bloque.match(/\n\s+url:\s*"([^"]+)"/)?.[1];
      const repo = bloque.match(/repo:\s*"([^"]+)"/)?.[1];
      if (slug && url) salidas.push({ tipo: "alternativa", slug, url, repo });
    }
  }
  return salidas;
}

async function comprobar(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": UA, Range: "bytes=0-2048" },
      signal: AbortSignal.timeout(15000),
    });
    return res.status >= 200 && res.status < 400 ? "OK" : res.status;
  } catch {
    return "ERROR";
  }
}

const entradas = await leerUrls();
console.log(`Comprobando ${entradas.length} URLs externas...\n`);

const resultados = [];
let i = 0;
async function worker() {
  while (i < entradas.length) {
    const entrada = entradas[i++];
    resultados.push({ ...entrada, estado: await comprobar(entrada.url) });
    await sleep(120);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));

const rotas = resultados.filter((r) => r.estado !== "OK");

console.log(`Correctas: ${resultados.length - rotas.length}`);
console.log(`Con problema: ${rotas.length}\n`);
console.log(
  "Aviso: un 403 suele ser protección anti-bot (Canva, Codeberg) y un ERROR\n" +
    "puede ser un bloqueo de red. Comprueba a mano los que aparezcan.\n",
);
for (const r of rotas) {
  console.log(`  [${r.estado}] ${r.slug} -> ${r.url}`);
}

process.exitCode = rotas.length > 0 ? 1 : 0;
