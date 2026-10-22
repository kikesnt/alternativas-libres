import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const raiz = path.resolve(import.meta.dirname, "..");
const dirDatos = path.join(raiz, "src/lib/data/alternatives");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function leerFichas() {
  return readdir(dirDatos).then(async (archivos) => {
    const salida = [];
    for (const archivo of archivos.filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
      const texto = await readFile(path.join(dirDatos, archivo), "utf8");
      let archivoActual = archivo;
      for (const bloque of texto.split(/\n  \{\n/).slice(1)) {
        const slug = bloque.match(/slug:\s*"([^"]+)"/)?.[1];
        const url = bloque.match(/\n\s+url:\s*"([^"]+)"/)?.[1];
        const repo = bloque.match(/repo:\s*"([^"]+)"/)?.[1];
        const licencia = bloque.match(/licencia:\s*"([^"]+)"/)?.[1];
        const licenciaTipo = bloque.match(/licenciaTipo:\s*"([^"]+)"/)?.[1];
        const docker = bloque.match(/dockerOficial:\s*(\w+)/)?.[1];
        const revision = bloque.match(/revisionPendiente:\s*(\w+)/)?.[1];
        if (slug) {
          salida.push({
            slug,
            url,
            repo,
            licencia,
            licenciaTipo,
            docker,
            revision,
            archivo: archivoActual,
          });
        }
      }
    }
    return salida;
  });
}

function detectarLicencia(texto) {
  const t = texto.toLowerCase();
  if (t.includes("business source license")) return "BSL-1.1";
  if (t.includes("sustainable use license")) return "Sustainable Use License";
  if (t.includes("fair-code") || t.includes("fair code")) return "Fair-code";
  if (t.includes("busl") || t.includes("business use source license"))
    return "BUSL-1.1";
  if (t.includes("any source available license")) return "Any Source Available";
  if (t.includes("elastic license")) return "Elastic License";
  if (t.includes("gnu affero general public license"))
    return t.includes("version 3") ? "AGPL-3.0" : "AGPL-2.0";
  if (t.includes("gnu lesser general public license"))
    return t.includes("version 3") ? "LGPL-3.0" : "LGPL-2.1";
  if (t.includes("gnu general public license"))
    return t.includes("version 3") ? "GPL-3.0" : "GPL-2.0";
  if (t.includes("mozilla public license"))
    return t.includes("2.0") ? "MPL-2.0" : "MPL-1.1";
  if (t.includes("apache license")) return "Apache-2.0";
  if (t.includes("mit license") || t.includes("permission is hereby granted, free of charge"))
    return "MIT";
  if (t.includes("isc license")) return "ISC";
  if (t.includes("zlib")) return "zlib";
  return "DESCONOCIDA";
}

async function licenciaReal(repo) {
  if (!repo?.includes("github.com/")) return null;
  const ruta = repo.replace("https://github.com/", "https://raw.githubusercontent.com/");
  for (const archivo of [
    "LICENSE",
    "LICENSE.md",
    "LICENSE.txt",
    "LICENSE-AGPL",
    "LICENCE",
    "COPYING",
    "LICENSE.APACHE2",
  ]) {
    try {
      const res = await fetch(`${ruta}/HEAD/${archivo}`, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const texto = await res.text();
      if (texto.length < 50) continue;
      return { detectada: detectarLicencia(texto), archivo, extracto: texto.slice(0, 90) };
    } catch {
      return null;
    }
  }
  return null;
}

const NAMESPACES_DOCKER = {
  mattermost: ["mattermost"],
  rocketchat: ["rocketchat"],
  zulip: ["zulip"],
  "nextcloud-talk": ["nextcloud"],
  jitsi: ["jitsi"],
  bigbluebutton: ["bigbluebutton"],
  peertube: ["chocobozzz"],
  listmonk: ["listmonk"],
  mautic: ["mautic"],
  n8n: ["n8nio"],
  windmill: ["ghcr.io/windmill-labs", "windmill"],
  activepieces: ["activepieces"],
  huginn: ["activepieces"],
  twenty: ["twentycrm"],
  suitecrm: ["suitecrm"],
  espocrm: ["espocrm"],
  odoo: ["odoo"],
  erpnext: ["frappe"],
  gitea: ["gitea"],
  gitlab: ["gitlab"],
  umami: ["umami"],
  matomo: ["matomo"],
  posthog: ["posthog"],
  penpot: ["penpot"],
  excalidraw: ["excalidraw"],
  appflowy: ["toeverything"],
  affine: ["toeverything"],
  teable: ["teable"],
  nocodb: ["nocodb"],
  baserow: ["baserow"],
  grist: ["gristlabs"],
  directus: ["directus"],
  strapi: ["strapi"],
  taiga: ["taiga"],
  openproject: ["openproject"],
  plane: ["makeplane"],
  forgejo: ["forgejo"],
  nextcloud: ["nextcloud"],
  seafile: ["haiwen"],
  syncthing: ["syncthing"],
  owncloud: ["owncloud"],
  keila: ["pentacent"],
  sftpgo: ["drakkan"],
  filegator: ["filegator"],
  ditto: ["dittofeed"],
  automatisch: ["automatisch"],
  logseq: ["logseq"],
  anytype: ["anyproto"],
  outline: ["outline"],
  redmine: ["redmine"],
  windmill2: [],
};

async function imagenDocker(slug) {
  const namespaces = NAMESPACES_DOCKER[slug];
  if (!namespaces) return null;
  for (const ns of namespaces) {
    if (ns.startsWith("ghcr.io")) return { oficial: true, nota: "imagen en GitHub Packages" };
    try {
      const res = await fetch(
        `https://hub.docker.com/v2/repositories/${ns}/?page_size=100`,
        { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) },
      );
      if (!res.ok) continue;
      const datos = await res.json();
      const nombres = (datos.results ?? []).map((r) => r.name);
      if (nombres.length > 0) {
        return { oficial: true, namespace: ns, imagenes: nombres.slice(0, 6) };
      }
    } catch {
      continue;
    }
  }
  return { oficial: false, namespace: namespaces[0] };
}

async function urlViva(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": UA, Range: "bytes=0-1024" },
      signal: AbortSignal.timeout(20000),
    });
    return res.status >= 200 && res.status < 400;
  } catch {
    return null;
  }
}

const fichas = await leerFichas();
const pendientes = fichas.filter((f) => f.revision === "true");
console.log(`Revisando ${pendientes.length} fichas pendientes...\n`);

const informe = [];
let i = 0;
async function worker() {
  while (i < pendientes.length) {
    const f = pendientes[i++];
    const lic = await licenciaReal(f.repo);
    const dock = await imagenDocker(f.slug);
    const viva = await urlViva(f.url);
    informe.push({ ...f, lic, dock, viva });
    await sleep(120);
  }
}
await Promise.all(Array.from({ length: 5 }, worker));

informe.sort((a, b) => a.slug.localeCompare(b.slug));

const problemas = [];
for (const r of informe) {
  const declarada = r.licencia ?? "";
  const detectada = r.lic?.detectada ?? "SIN REPO";
  const normalizar = (x) => x.toUpperCase().replace(/[^A-Z0-9.]/g, "");
  const coincide =
    detectada === "DESCONOCIDA" ||
    detectada === "SIN REPO" ||
    normalizar(declarada).includes(normalizar(detectada.split("-")[0]));
  const marcaLic = coincide ? "ok  " : "DIF ";
  const marcaUrl = r.viva === true ? "ok  " : r.viva === false ? "MUERTA" : "n/d ";
  const marcaDoc = r.dock === null ? "n/d " : r.dock.oficial ? "ok  " : "REVISAR";
  console.log(
    `${marcaLic} ${marcaUrl} ${marcaDoc} ${r.slug.padEnd(20)} ${declarada.padEnd(42)} ${detectada}`,
  );
  if (!coincide) problemas.push(`LICENCIA ${r.slug}: dice "${r.licencia}" y la fuente dice ${detectada}`);
  if (r.viva === false) problemas.push(`URL MUERTA ${r.slug}: ${r.url}`);
  if (r.dock && !r.dock.oficial) problemas.push(`DOCKER ${r.slug}: no se confirma imagen oficial`);
}

console.log(`\n\nResumen de avisos (${problemas.length}):`);
for (const p of problemas) console.log(`  - ${p}`);

await writeFile(
  path.join(raiz, "docs/revision-fichas.json"),
  JSON.stringify(
    informe.map((r) => ({
      slug: r.slug,
      licenciaDeclarada: r.licencia,
      licenciaDetectada: r.lic?.detectada ?? null,
      licenciaArchivo: r.lic?.archivo ?? null,
      docker: r.dock,
      urlViva: r.viva,
    })),
    null,
    2,
  ),
);
console.log("\nInforme guardado en docs/revision-fichas.json");
