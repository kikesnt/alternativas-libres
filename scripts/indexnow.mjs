#!/usr/bin/env node
// Aviso a Bing (y a los buscadores que consumen IndexNow) de que las URLs
// del sitio han cambiado.
//
// IndexNow es el protocolo de Microsoft: se manda un POST a
// api.indexnow.org con la clave del sitio y la lista de URLs. Bing lo consume
// de forma nativa, asi que avisar aqui es lo que hace que una pagina nueva
// aparezca en Bing en minutos en lugar de dias.
//
// Tres reglas de diseño:
//
//   1. La clave NO es un secreto. Por diseño se publica en la raiz del sitio,
//      en el fichero <clave>.txt. Si el buscador no puede leer ese fichero,
//      el aviso se rechaza con un 422. Por eso la clave se busca por su
//      nombre: el mismo fichero que se publica es la fuente de la clave.
//
//   2. El fichero de la clave tiene que estar en linea ANTES de avisar.
//      IndexNow valida la clave en segundo plano y, si no la encuentra en ese
//      momento, marca el par clave+dominio como no autorizado y ya no vuelve
//      a aceptarlo (403). Por eso el script espera a que la clave responda
//      antes de mandar nada.
//
//   3. Este script nunca tumba la construcción. Si IndexNow esta caido, si la
//      red falla o si la clave no llega, avisa por pantalla y termina con
//      codigo 0. Notificar a un buscador es un extra, no un requisito.
//
// Uso: node scripts/indexnow.mjs [ruta-relativa-del-sitemap]

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENDPOINT = "https://api.indexnow.org/indexnow";
const TIMEOUT_MS = 20000;
const ESPERA_CLAVE_MS = 30000;
const INTENTOS_CLAVE = 4;

// La clave se busca por nombre de fichero: 32 hex, como las que genera
// IndexNow. Es el mismo fichero que se publica en la raiz del sitio.
const leerClave = () => {
  const publica = join(ROOT, "public");
  if (!existsSync(publica)) return null;
  const nombres = readdirSync(publica).filter((f) => /^[0-9a-f]{32}\.txt$/.test(f));
  return nombres.length ? nombres[0].slice(0, -4) : null;
};

// Sitemaps posibles, en orden de preferencia.
const RUTAS_SITEMAP = [
  join(ROOT, "dist", "sitemap.xml"),
  join(ROOT, "dist", "sitemap-0.xml"),
  join(ROOT, "out", "sitemap.xml"),
];

const extraerUrls = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);

// Solo se avisa de URLs que ya responden. Una URL que todavia no esta en
// linea se descarta: el buscador la rechazaria y podria tirar el aviso
// entero, que es justo lo contrario de lo que se quiere.
const responde = async (url) => {
  try {
    const r = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return r.status < 400;
  } catch {
    return false;
  }
};

// Espera a que el fichero de la clave se sirra desde la raiz del sitio.
// El despliegue y el aviso salen en paralelo (Pages construye por su cuenta
// y el aviso va en un workflow aparte), asi que hay que darle margen.
const claveEnLinea = async (host, key) => {
  const url = `https://${host}/${key}.txt`;
  for (let intento = 1; intento <= INTENTOS_CLAVE; intento++) {
    try {
      const r = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (r.status < 400) return true;
    } catch {
      // Todavia no esta: se vuelve a probar.
    }
    if (intento < INTENTOS_CLAVE) {
      await new Promise((r) => setTimeout(r, ESPERA_CLAVE_MS));
    }
  }
  return false;
};

const avisar = async (host, key, urls) => {
  const cuerpo = {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  };
  const r = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(cuerpo),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const texto = (await r.text()).slice(0, 300).trim();
  // 200 = validado y procesado. 202 = en cola a la espera de validar la clave.
  // 400 = peticion mal formada. 403 = el par clave+dominio no esta autorizado.
  // 422 = no encuentra el fichero de la clave. 429 = demasiadas peticiones.
  console.log(`IndexNow: HTTP ${r.status} ${texto} | ${urls.length} URLs de ${host}`);
  return r.status;
};

const main = async () => {
  const key = leerClave();
  if (!key) {
    console.log("IndexNow: no hay clave en public/<clave>.txt. No se avisa a nadie.");
    return;
  }

  const sitemap = process.argv[2]
    ? join(ROOT, process.argv[2])
    : RUTAS_SITEMAP.find((ruta) => existsSync(ruta));
  if (!sitemap) {
    console.log("IndexNow: no hay sitemap construido. No se avisa a nadie.");
    return;
  }

  let candidatas;
  try {
    candidatas = [...new Set(extraerUrls(readFileSync(sitemap, "utf8")))];
  } catch (e) {
    console.log(`IndexNow: no se pudo leer el sitemap (${e.message}).`);
    return;
  }
  if (!candidatas.length) {
    console.log("IndexNow: el sitemap no tiene URLs.");
    return;
  }

  const host = new URL(candidatas[0]).host;
  const delHost = candidatas.filter((u) => {
    try {
      return new URL(u).host === host;
    } catch {
      return false;
    }
  });

  // Sin la clave en linea no se avisa: IndexNow rechazaria el aviso y
  // marcaria el par clave+dominio como no autorizado para siempre.
  if (!(await claveEnLinea(host, key))) {
    console.log(`IndexNow: la clave aun no esta en linea en ${host}. No se avisa a nadie.`);
    return;
  }

  // De ocho en ocho: son peticiones de red y no hace falta mas.
  const vivas = [];
  for (let i = 0; i < delHost.length; i += 8) {
    const trozo = delHost.slice(i, i + 8);
    const resultados = await Promise.all(trozo.map(async (u) => ((await responde(u)) ? u : null)));
    vivas.push(...resultados.filter(Boolean));
  }
  if (!vivas.length) {
    console.log(`IndexNow: ninguna de las ${delHost.length} URLs responde todavia. No se avisa a nadie.`);
    return;
  }

  try {
    await avisar(host, key, vivas);
  } catch (e) {
    console.log(`IndexNow: no se pudo avisar (${e.message}).`);
  }
};

await main();
