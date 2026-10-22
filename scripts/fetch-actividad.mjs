import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const raiz = path.resolve(import.meta.dirname, "..");
const dirDatos = path.join(raiz, "src/lib/data/alternatives");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function leerRepos() {
  const archivos = (await readdir(dirDatos)).filter((f) => f.endsWith(".ts"));
  const salida = [];
  for (const archivo of archivos) {
    const texto = await readFile(path.join(dirDatos, archivo), "utf8");
    for (const bloque of texto.split(/\n  \{\n/).slice(1)) {
      const slug = bloque.match(/slug:\s*"([^"]+)"/)?.[1];
      const repo = bloque.match(/repo:\s*"([^"]+)"/)?.[1];
      if (slug && repo?.includes("github.com/")) salida.push({ slug, repo });
    }
  }
  return salida;
}

async function ultimoCommit(repo) {
  try {
    const res = await fetch(`${repo}/commits/HEAD.atom`, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    const xml = await res.text();
    const m = xml.match(/<updated>([^<]+)<\/updated>/);
    return m ? m[1].slice(0, 10) : null;
  } catch {
    return null;
  }
}

const repos = await leerRepos();
console.log(`Consultando actividad de ${repos.length} repositorios...\n`);

const actividad = {};
const inactivos = [];
let i = 0;

async function worker() {
  while (i < repos.length) {
    const { slug, repo } = repos[i++];
    const fecha = await ultimoCommit(repo);
    if (fecha) {
      actividad[slug] = fecha;
      const meses = (Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (meses > 12) inactivos.push(`${slug}: ${fecha} (${Math.round(meses)} meses)`);
    } else {
      inactivos.push(`${slug}: no se pudo consultar ${repo}`);
    }
    await sleep(150);
  }
}

await Promise.all(Array.from({ length: 4 }, worker));

await writeFile(
  path.join(raiz, "src/lib/data/actividad.ts"),
  `export const actividad: Record<string, string> = ${JSON.stringify(
    Object.fromEntries(Object.entries(actividad).sort(([a], [b]) => a.localeCompare(b))),
    null,
    2,
  )};\n`,
);

console.log(`Con actividad verificada: ${Object.keys(actividad).length}`);
console.log(`\nSin actividad reciente o sin respuesta (${inactivos.length}):`);
for (const x of inactivos) console.log(`  - ${x}`);
