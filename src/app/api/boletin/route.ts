import { NextResponse } from "next/server";
import { getAlternatives, getGuides, getProducts } from "@/lib/queries";
import { site } from "@/lib/site";
import { formatearFecha } from "@/lib/fechas";

function escapar(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function htmlBoletin() {
  const productos = getProducts();
  const guias = getGuides();
  const herramientas = getAlternatives(
    productos.flatMap((p) => p.alternativas),
  );

  const nuevasGuias = guias.slice(0, 3);
  const nuevasHerramientas = herramientas
    .filter((h) => h.verificadoEn >= guias[0]?.fecha)
    .slice(0, 6);

  const bloqueGuias = nuevasGuias
    .map(
      (g) => `
      <tr><td style="padding:18px 0;border-bottom:1px solid #e4e7ec">
        <p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#0f766e">Comparativa</p>
        <p style="margin:0 0 6px;font-size:18px;font-weight:600;color:#0d1117">
          <a href="${site.url}/comparativas/${g.slug}" style="color:#0d1117;text-decoration:none">${escapar(g.titulo)}</a>
        </p>
        <p style="margin:0 0 8px;font-size:15px;line-height:1.55;color:#57606a">${escapar(g.descripcion)}</p>
        <p style="margin:0;font-size:13px;color:#9198a1">${g.lecturaMin} min de lectura · ${formatearFecha(g.fecha)}</p>
      </td></tr>`,
    )
    .join("");

  const bloqueHerramientas = nuevasHerramientas
    .map((h) => {
      const producto = productos.find((p) => p.alternativas.includes(h.slug));
      return `
      <tr><td style="padding:14px 0;border-bottom:1px solid #e4e7ec">
        <p style="margin:0 0 4px;font-size:16px;font-weight:600">
          <a href="${site.url}/alternativas/${h.sustituye[0]}/${h.slug}" style="color:#0d1117;text-decoration:none">${escapar(h.nombre)}</a>
        </p>
        <p style="margin:0 0 4px;font-size:14px;line-height:1.5;color:#57606a">${escapar(h.tagline)}</p>
        <p style="margin:0;font-size:12px;color:#9198a1">Licencia ${escapar(h.licencia)} · alternativa a ${escapar(producto?.nombre ?? "SaaS")}</p>
      </td></tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f7f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0d1117">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fa;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;padding:32px">
        <tr><td style="padding-bottom:24px;border-bottom:1px solid #e4e7ec">
          <p style="margin:0;font-size:20px;font-weight:700">${escapar(site.nombre)}</p>
          <p style="margin:4px 0 0;font-size:14px;color:#57606a">Alternativas autoalojadas a las herramientas SaaS de tu día a día</p>
        </td></tr>

        <tr><td style="padding:24px 0 8px">
          <h1 style="margin:0 0 8px;font-size:26px;line-height:1.25">Lo nuevo en el directorio</h1>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#57606a">Comparativas y fichas recién revisadas, con los datos verificados contra la fuente oficial de cada proyecto.</p>
        </td></tr>

        ${bloqueGuias}

        <tr><td style="padding:28px 0 8px">
          <h2 style="margin:0 0 4px;font-size:20px">Fichas revisadas</h2>
          <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#57606a">Herramientas con la fecha de revisión al día.</p>
        </td></tr>

        ${bloqueHerramientas}

        <tr><td style="padding:28px 0 0">
          <a href="${site.url}/alternativas" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:15px;font-weight:600">Ver el directorio completo</a>
          <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#9198a1">
            Recibes este correo porque te apuntaste al boletín en ${escapar(site.url)}.
            Puedes darte de baja desde el enlace al final de cada número.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("preview") !== "1") {
    return NextResponse.json(
      { error: "Usa POST para enviar, o ?preview=1 para ver el HTML" },
      { status: 405 },
    );
  }
  return new Response(htmlBoletin(), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  const secreto = process.env.CRON_SECRET;
  const cabecera = request.headers.get("authorization");

  if (secreto && cabecera !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const url = process.env.NEWSLETTER_API_URL;
  const token = process.env.NEWSLETTER_API_TOKEN;
  const listaId = process.env.NEWSLETTER_LIST_ID;
  const remitente = process.env.NEWSLETTER_FROM_EMAIL;

  if (!url || !token || !listaId || !remitente) {
    return NextResponse.json(
      {
        error:
          "Falta configurar NEWSLETTER_API_URL, NEWSLETTER_API_TOKEN, NEWSLETTER_LIST_ID o NEWSLETTER_FROM_EMAIL.",
      },
      { status: 503 },
    );
  }

  const base = url.replace(/\/$/, "");
  const cabeceras = {
    "Content-Type": "application/json",
    Authorization: `token ${token}`,
  };

  const fecha = new Date();
  const nombre = `Boletín ${formatearFecha(fecha.toISOString().slice(0, 10))}`;

  const creada = await fetch(`${base}/api/campaigns`, {
    method: "POST",
    headers: cabeceras,
    body: JSON.stringify({
      name: nombre,
      subject: nombre,
      from_name: site.nombre,
      from_email: remitente,
      reply_to: remitente,
      content_type: "html",
      body: htmlBoletin(),
      lists: [Number(listaId)],
    }),
  });

  if (!creada.ok) {
    const detalle = await creada.text();
    return NextResponse.json(
      { error: "No se pudo crear la campaña", detalle: detalle.slice(0, 400) },
      { status: 502 },
    );
  }

  const campana = await creada.json();
  const enviada = await fetch(
    `${base}/api/campaigns/${campana.id}/actions/send`,
    { method: "POST", headers: cabeceras },
  );

  if (!enviada.ok) {
    const detalle = await enviada.text();
    return NextResponse.json(
      {
        error: "Campaña creada pero no enviada",
        id: campana.id,
        detalle: detalle.slice(0, 400),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: campana.id, nombre });
}
