// Punto de entrada del Worker. Reutiliza el handler que genera OpenNext y añade
// el cron del boletín, que en Vercel vivía en `vercel.json`.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: `.open-next/worker.js` se genera durante el build
import { default as handler } from "./.open-next/worker.js";

interface Entorno {
  CRON_SECRET?: string;
}

const DOMINIO = "alternativas-libres.com";

const worker = {
  fetch: handler.fetch,

  async scheduled(
    _evento: unknown,
    entorno: Entorno,
    ctx: { waitUntil(promesa: Promise<unknown>): void },
  ) {
    const secreto = entorno.CRON_SECRET;
    if (!secreto) return;

    ctx.waitUntil(
      fetch(`https://${DOMINIO}/api/boletin`, {
        method: "POST",
        headers: { authorization: `Bearer ${secreto}` },
      }),
    );
  },
};

export default worker;
