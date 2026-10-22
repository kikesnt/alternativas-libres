import { NextResponse } from "next/server";

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let cuerpo: { email?: string; nombre?: string };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Petición inválida" },
      { status: 400 },
    );
  }

  const email = (cuerpo.email ?? "").trim().toLowerCase();
  if (!emailValido.test(email)) {
    return NextResponse.json(
      { error: "Introduce un email válido" },
      { status: 400 },
    );
  }

  const listmonkUrl = process.env.NEWSLETTER_API_URL;
  const listmonkToken = process.env.NEWSLETTER_API_TOKEN;
  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;

  if (listmonkUrl && listmonkToken) {
    const res = await fetch(`${listmonkUrl.replace(/\/$/, "")}/api/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${listmonkToken}`,
      },
      body: JSON.stringify({
        email,
        name: cuerpo.nombre ?? "",
        status: "enabled",
        attributes: { fuente: "sitio" },
      }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }
    if (res.status === 409) {
      return NextResponse.json({
        ok: true,
        mensaje: "Ya estás apuntado.",
      });
    }
    return NextResponse.json(
      { error: "No se pudo completar el alta" },
      { status: 502 },
    );
  }

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre: cuerpo.nombre ?? "" }),
    });
    if (res.ok) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: "No se pudo completar el alta" },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      error:
        "El boletín no está configurado todavía. Escríbenos y te apuntamos a mano.",
    },
    { status: 503 },
  );
}
