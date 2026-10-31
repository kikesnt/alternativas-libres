#!/usr/bin/env node
/**
 * Migracion del dominio de un Worker a un proyecto de Cloudflare Pages.
 *
 * Por que hace falta: alternativas-libres.com esta en un Worker de OpenNext
 * que devuelve error 1102 (limite de CPU) en 94 de sus 179 URL. El sitio esta
 * caido. La solucion es publicarlo como Pages estatico y moverle el dominio.
 *
 * Que hace, en este orden:
 *
 *  1. Comprueba que el token sirve y que existe el proyecto de Pages. Si no
 *     existe, lo crea.
 *  2. Mira si el dominio sigue apuntado a un Worker. Si es asi, lo suelta
 *     (no se puede tener el mismo dominio en un Worker y en Pages a la vez).
 *  3. Anade el dominio al proyecto de Pages.
 *  4. Muestra los registros DNS de la zona, por si hay que corregir el CNAME
 *     a mano.
 *  5. Comprueba que el sitio responde.
 *
 * Por defecto SOLO INFORMA: no cambia nada. Para aplicar los cambios:
 *
 *   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... \
 *     node scripts/migrar-a-pages.mjs --aplicar
 *
 * El token necesita (Account -> Cloudflare Pages -> Edit), (Account ->
 * Settings -> Read) y (Zone -> DNS -> Edit) para poder corregir el CNAME.
 */

const API = "https://api.cloudflare.com/client/v4";

const TOKEN = process.env.CLOUDFLARE_API_TOKEN ?? "";
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ?? "";
const DOMINIO = process.env.DOMINIO ?? "alternativas-libres.com";
const PROYECTO = process.env.CLOUDFLARE_PROJECT_NAME ?? "alternativas-libres";
const APLICAR = process.argv.includes("--aplicar");

if (!TOKEN) {
  console.error(
    "Falta CLOUDFLARE_API_TOKEN. Sin el no se puede ni leer el estado.",
  );
  process.exit(2);
}
if (!ACCOUNT_ID) {
  console.error("Falta CLOUDFLARE_ACCOUNT_ID.");
  process.exit(2);
}

let cambios = 0;

/** Llamada a la API de Cloudflare. Lanza con el mensaje del servidor. */
async function api(ruta, opciones = {}) {
  const respuesta = await fetch(`${API}${ruta}`, {
    ...opciones,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(opciones.headers ?? {}),
    },
  });
  const texto = await respuesta.text();
  let cuerpo = {};
  try {
    cuerpo = texto ? JSON.parse(texto) : {};
  } catch {
    cuerpo = { errors: [{ message: texto.slice(0, 400) }] };
  }
  if (!respuesta.ok) {
    const detalle = (cuerpo.errors ?? [])
      .map((e) => `${e.code ?? ""} ${e.message ?? ""}`.trim())
      .join("; ");
    throw new Error(
      `${opciones.method ?? "GET"} ${ruta} -> HTTP ${respuesta.status}. ${detalle}`,
    );
  }
  return cuerpo.result;
}

function paso(titulo) {
  console.log(`\n== ${titulo}`);
}

function accion(texto) {
  cambios += 1;
  console.log(`   ${APLICAR ? "APLICADO" : "PENDIENTE"}: ${texto}`);
}

async function main() {
  console.log(
    `Migracion ${APLICAR ? "CON cambios" : "SOLO LECTURA (--aplicar para cambiar nada)"}`,
  );
  console.log(`Cuenta: ${ACCOUNT_ID}`);
  console.log(`Dominio: ${DOMINIO}   Proyecto: ${PROYECTO}`);

  paso("1. El token sirve");
  const verificado = await api(`/accounts/${ACCOUNT_ID}/tokens/verify`);
  console.log(`   Token valido: ${verificado.status ?? "ok"}`);

  paso("2. Proyecto de Pages");
  const proyectos = await api(`/accounts/${ACCOUNT_ID}/pages/projects`);
  const lista = Array.isArray(proyectos) ? proyectos : [];
  const existe = lista.find((p) => p.name === PROYECTO);
  if (existe) {
    console.log(`   Ya existe: ${PROYECTO} (${existe.subdomain ?? ""})`);
  } else {
    console.log(`   No existe. Proyectos en la cuenta: ${lista.length}`);
    if (APLICAR) {
      const creado = await api(`/accounts/${ACCOUNT_ID}/pages/projects`, {
        method: "POST",
        body: JSON.stringify({
          name: PROYECTO,
          production_branch: "main",
        }),
      });
      console.log(`   Creado: ${creado.name} (${creado.subdomain ?? ""})`);
      cambios += 1;
    } else {
      accion(`crear el proyecto de Pages "${PROYECTO}"`);
    }
  }

  paso("3. Dominio en un Worker");
  const dominiosWorker = await api(`/accounts/${ACCOUNT_ID}/workers/domains`);
  const listaWorker = Array.isArray(dominiosWorker) ? dominiosWorker : [];
  const enWorker = listaWorker.find((d) => d.hostname === DOMINIO);
  if (enWorker) {
    console.log(
      `   Apunta a un Worker: ${enWorker.service ?? "?"} (${enWorker.environment ?? "production"})`,
    );
    if (APLICAR) {
      await api(`/accounts/${ACCOUNT_ID}/workers/domains/${DOMINIO}`, {
        method: "DELETE",
      });
      console.log("   Soltado del Worker.");
      cambios += 1;
    } else {
      accion(`soltar el dominio del Worker ${enWorker.service ?? ""}`);
    }
  } else {
    console.log("   No apunta a ningun Worker (o no hay dominios de Worker).");
  }

  paso("4. Dominio en el proyecto de Pages");
  const dominiosPages = await api(
    `/accounts/${ACCOUNT_ID}/pages/projects/${PROYECTO}/domains`,
  );
  const listaPages = Array.isArray(dominiosPages) ? dominiosPages : [];
  const enPages = listaPages.find((d) => d.name === DOMINIO);
  if (enPages) {
    console.log(`   Ya esta en Pages. Estado: ${enPages.status ?? "?"}`);
  } else {
    if (APLICAR) {
      const anadido = await api(
        `/accounts/${ACCOUNT_ID}/pages/projects/${PROYECTO}/domains`,
        { method: "POST", body: JSON.stringify({ name: DOMINIO }) },
      );
      console.log(`   Anadido. Estado: ${anadido.status ?? "?"}`);
      cambios += 1;
    } else {
      accion(`anadir ${DOMINIO} al proyecto de Pages`);
    }
  }

  paso("5. Registros DNS de la zona");
  const zonas = await api(
    `/zones?name=${encodeURIComponent(DOMINIO)}&account.id=${ACCOUNT_ID}`,
  );
  if (!zonas || zonas.length === 0) {
    console.log("   No se encuentra la zona.");
  } else {
    const zona = zonas[0];
    console.log(`   Zona: ${zona.name} (${zona.id})`);
    const registros = await api(
      `/zones/${zona.id}/dns_records?per_page=100&name=${encodeURIComponent(DOMINIO)}`,
    );
    for (const r of registros ?? []) {
      console.log(`   ${r.type} ${r.name} -> ${r.content} (proxied: ${r.proxied})`);
    }
    const cname = (registros ?? []).find(
      (r) => r.type === "CNAME" && r.name === DOMINIO,
    );
    if (cname && cname.content.includes("workers.dev")) {
      accion(
        `el CNAME sigue apuntando a ${cname.content}: hay que cambiarlo al dominio de Pages (<proyecto>.pages.dev)`,
      );
    }
  }

  paso("6. Estado del sitio");
  try {
    const respuesta = await fetch(`https://${DOMINIO}/`, {
      headers: { "User-Agent": "Mozilla/5.0 (verificacion)" },
    });
    const cuerpo = await respuesta.text();
    console.log(
      `   HTTP ${respuesta.status}, ${cuerpo.length} bytes${cuerpo.includes("1102") ? " (sigue el error 1102 del Worker)" : ""}`,
    );
  } catch (error) {
    console.log(`   No responde: ${error.message}`);
  }

  console.log(
    `\nResumen: ${APLICAR ? `${cambios} cambio(s) aplicado(s)` : `${cambios} pendiente(s). Usa --aplicar para aplicarlos`}`,
  );
}

main().catch((error) => {
  console.error(`\nERROR: ${error.message}`);
  process.exit(1);
});
