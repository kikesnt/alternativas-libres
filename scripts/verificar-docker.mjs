import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const raiz = path.resolve(import.meta.dirname, "..");
const dirDatos = path.join(raiz, "src/lib/data/alternatives");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fichas() {
  const salida = [];
  for (const archivo of (await readdir(dirDatos)).filter(
    (f) => f.endsWith(".ts") && f !== "index.ts",
  )) {
    const texto = await readFile(path.join(dirDatos, archivo), "utf8");
    for (const bloque of texto.split(/\n  \{\n/).slice(1)) {
      const slug = bloque.match(/slug:\s*"([^"]+)"/)?.[1];
      const repo = bloque.match(/repo:\s*"([^"]+)"/)?.[1];
      const docker = bloque.match(/dockerOficial:\s*(\w+)/)?.[1];
      const url = bloque.match(/\n\s+url:\s*"([^"]+)"/)?.[1];
      if (slug) salida.push({ slug, repo, docker, url });
    }
  }
  return salida;
}

async function buscarDocker(repo, url) {
  const rutas = repo?.includes("github.com/")
    ? [
        `${repo.replace("https://github.com/", "https://raw.githubusercontent.com/")}/HEAD/README.md`,
        `${repo.replace("https://github.com/", "https://raw.githubusercontent.com/")}/HEAD/README.rst`,
        `${repo.replace("https://github.com/", "https://raw.githubusercontent.com/")}/HEAD/docker-compose.yml`,
        `${repo.replace("https://github.com/", "https://raw.githubusercontent.com/")}/HEAD/compose.yml`,
        `${repo.replace("https://github.com/", "https://raw.githubusercontent.com/")}/HEAD/Dockerfile`,
        `${repo.replace("https://github.com/", "https://raw.githubusercontent.com/")}/HEAD/docs/Dockerfile`,
        `${repo.replace("https://github.com/", "https://raw.githubusercontent.com/")}/HEAD/docker/Dockerfile`,
      ]
    : [];

  let evidencia = null;
  for (const ruta of rutas) {
    try {
      const res = await fetch(ruta, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const texto = await res.text();
      if (/docker\s+(run|compose)|docker-compose\.yml|compose\.ya?ml|ghcr\.io|docker hub/i.test(texto)) {
        evidencia = ruta.split("/HEAD/")[1];
        break;
      }
    } catch {
      continue;
    }
  }

  if (!evidencia && url) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const html = await res.text();
        if (/docker/i.test(html)) evidencia = "sitio oficial (menciona docker)";
      }
    } catch {
      return { evidencia: null, dockerDetectado: "n/d" };
    }
  }

  return { evidencia, dockerDetectado: evidencia ? "SI" : "NO" };
}

const lista = await fichas();
console.log(`Verificando soporte Docker de ${lista.length} fichas...\n`);

const resultados = [];
let i = 0;
async function worker() {
  while (i < lista.length) {
    const f = lista[i++];
    const r = await buscarDocker(f.repo, f.url);
    resultados.push({ ...f, ...r });
    await sleep(80);
  }
}
await Promise.all(Array.from({ length: 5 }, worker));

const cambian = [];
for (const r of resultados.sort((a, b) => a.slug.localeCompare(b.slug))) {
  const declarado = r.docker === "true" ? "SI " : "NO ";
  const detectado =
    r.dockerDetectado === "SI" ? "SI " : r.dockerDetectado === "NO" ? "NO " : "n/d ";
  const marca = declarado === detectado ? "   " : "-> ";
  console.log(
    `${marca}${r.slug.padEnd(20)} declarado=${declarado} detectado=${detectado} ${r.evidencia ?? ""}`,
  );
  if (marca === "-> ") cambian.push(r);
}

console.log(`\n\nDiscrepancias (${cambian.length}):`);
for (const c of cambian) {
  console.log(
    `  ${c.slug}: declarado=${c.docker} detectado=${c.dockerDetectado} (${c.evidencia ?? "sin evidencia"})`,
  );
}
