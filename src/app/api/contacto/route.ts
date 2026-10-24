import { NextResponse } from "next/server";
import { site } from "@/lib/site";

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const etiquetasTipo: Record<string, string> = {
  correccion: "Corrección de datos",
  propuesta: "Propuesta de herramienta",
  patrocinio: "Patrocinio",
  otro: "Otra cosa",
};

function escaparHtml(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface BindingEmail {
  send(mensaje: {
    to: string;
    from: string;
    replyTo?: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<unknown>;
}

/**
 * Devuelve el binding de Email Routing, o null si no estamos en Cloudflare
 * (por ejemplo con `pnpm dev` o `pnpm start`).
 */
async function bindingEmail(): Promise<BindingEmail | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    return (env as { EMAIL?: BindingEmail }).EMAIL ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let cuerpo: {
    email?: string;
    nombre?: string;
    mensaje?: string;
    tipo?: string;
    empresa?: string;
  };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  // Campo trampa: solo los bots lo rellenan. Respondemos ok para no darles pistas.
  if ((cuerpo.empresa ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = (cuerpo.email ?? "").trim();
  const nombre = (cuerpo.nombre ?? "").trim();
  const mensaje = (cuerpo.mensaje ?? "").trim();
  const tipo = cuerpo.tipo ?? "otro";
  const asunto = etiquetasTipo[tipo] ?? "Otra cosa";
  const fecha = new Date().toISOString();

  if (!emailValido.test(email)) {
    return NextResponse.json(
      { error: "Introduce un email válido" },
      { status: 400 },
    );
  }
  if (mensaje.length < 10) {
    return NextResponse.json(
      { error: "Cuéntanos un poco más (mínimo 10 caracteres)" },
      { status: 400 },
    );
  }

  const datos = { tipo, email, nombre, mensaje, fecha };

  // 1. Webhook externo, si está configurado (Discord, Formspree, Zapier…).
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "No se pudo enviar. Inténtalo de nuevo." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  // 2. Email Routing. El mensaje se envía al buzón verificado de Email
  //    Routing, así que no hace falta ningún servicio externo.
  const binding = await bindingEmail();
  const destino = process.env.CONTACT_EMAIL_TO;
  if (binding && destino) {
    const texto = [
      `Asunto: ${asunto}`,
      `Nombre: ${nombre || "(sin nombre)"}`,
      `Email: ${email}`,
      `Fecha: ${fecha}`,
      "",
      mensaje,
    ].join("\n");

    const html = `<h2 style="margin:0 0 16px;font-size:18px">${escaparHtml(asunto)}</h2>
<p style="margin:0 0 8px"><strong>Nombre:</strong> ${escaparHtml(nombre || "(sin nombre)")}</p>
<p style="margin:0 0 8px"><strong>Email:</strong> ${escaparHtml(email)}</p>
<p style="margin:0 0 16px"><strong>Fecha:</strong> ${escaparHtml(fecha)}</p>
<hr style="border:none;border-top:1px solid #e4e7ec;margin:16px 0">
<p style="white-space:pre-wrap;line-height:1.6">${escaparHtml(mensaje)}</p>`;

    try {
      await binding.send({
        to: destino,
        from: `web@${new URL(site.url).hostname}`,
        replyTo: email,
        subject: `[Web] ${asunto} — ${nombre || email}`,
        text: texto,
        html,
      });
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("contacto: fallo al enviar por Email Routing", error);
      return NextResponse.json(
        { error: "No se pudo enviar. Inténtalo de nuevo." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json(
    {
      error:
        "El formulario no está configurado todavía. Escríbenos directamente y te respondemos.",
    },
    { status: 503 },
  );
}
