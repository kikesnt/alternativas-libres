import { NextResponse } from "next/server";

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let cuerpo: {
    email?: string;
    nombre?: string;
    mensaje?: string;
    tipo?: string;
  };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  const email = (cuerpo.email ?? "").trim();
  const mensaje = (cuerpo.mensaje ?? "").trim();

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

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      {
        error:
          "El formulario no está configurado todavía. Escríbenos directamente y te respondemos.",
      },
      { status: 503 },
    );
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo: cuerpo.tipo ?? "contacto",
      email,
      nombre: cuerpo.nombre ?? "",
      mensaje,
      fecha: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "No se pudo enviar. Inténtalo de nuevo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
