import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const raiz = path.resolve(import.meta.dirname, "..");
const dirDatos = path.join(raiz, "src/lib/data/alternatives");

const token = process.env.GITHUB_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function leerRepos() {
  const archivos = (await readdir(dirDatos)).filter((f) => f.endsWith(".ts"));
  const salida = [];
  for (const archivo of archivos) {
    const texto = await readFile(path.join(dirDatos, archivo), "utf8");
    for (const bloque of texto.split(/\n  \{\n/).slice(1)) {
      const slug = bloque.match(/slug:\s*"([^"]+)"/)?.[1];
      const repo = bloque.match(/repo:\s*"([^"]+)"/)?.[1];
      const licencia = bloque.match(/licencia:\s*"([^"]+)"/)?.[1];
      if (slug && repo) salida.push({ slug, repo, licencia });
    }
  }
  return salida;
}

const repos = await leerRepos();
console.log(`Comprobando ${repos.length} repositorios...\n`);

const problemas = [];
const cambios = [];
let problemsRateLimit = false;

for (const { slug, repo, licencia } of repos) {
  const url = repo.replace("https://github.com/", "https://api.github.com/repos/");
  if (!url.startsWith("https://api.github.com/repos/")) continue;

  let data;
  try {
    const res = await fetch(url, { headers });
    if (res.status === 404) {
      problemas.push(`${slug}: el repositorio ${repo} ya no existe (404)`);
      continue;
    }
    if (res.status === 403) {
      problemsRateLimit = true;
      continue;
    }
    data = await res.json();
  } catch {
    problemas.push(`${slug}: no se pudo consultar ${repo}`);
    continue;
  }

  const spdx = data.license?.spdx_id ?? "SIN-LICENCIA";
  const spdxLimpio = spdx === "NOASSERTION" ? "PERSONALIZADA" : spdx;

  if (data.archived) {
    problemas.push(
      `${slug}: repositorio ARCHIVADO (${repo}). Retirar del directorio o marcar como sin mantenimiento.`,
    );
  }

  const meses = (Date.now() - new Date(data.pushed_at).getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (meses > 12) {
    cambios.push(
      `${slug}: sin actividad desde hace ${Math.round(meses)} meses (${data.pushed_at.slice(0, 10)})`,
    );
  }

  const spdxEsperado = licencia?.includes(spdxLimpio) ?? false;
  if (!spdxEsperado && spdxLimpio !== "PERSONALIZADA") {
    console.log(
      `  ${slug}: la ficha dice "${licencia}" y GitHub reporta ${spdxLimpio}`,
    );
  }
}

if (problemsRateLimit) {
  console.log(
    "\nAviso: límite de peticiones de la API de GitHub alcanzado. Define GITHUB_TOKEN para comprobar más repositorios.",
  );
}

if (problemas.length) {
  console.log("\nPROBLEMAS:");
  for (const p of problemas) console.log(`  - ${p}`);
} else {
  console.log("\nSin repositorios archivados ni inexistentes.");
}

if (cambios.length) {
  console.log("\nSIN ACTIVIDAD RECIENTE:");
  for (const c of cambios) console.log(`  - ${c}`);
}
