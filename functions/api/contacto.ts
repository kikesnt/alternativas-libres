/**
 * Pages Function: formulario de contacto.
 *
 * Es lo único que queda vivo del backend. Con `output: "export"` el resto
 * del sitio son archivos estáticos, pero el formulario necesita recibir el
 * mensaje en algún sitio, y eso lo hace esta función.
 *
 * Por dónde sale el mensaje, en este orden:
 *
 *  1. `CONTACT_WEBHOOK_URL`: un webhook externo (Discord, Formspree,
 *     Zapier…). Es la vía recomendada y la única que no depende de nada de
 *     Cloudflare.
 *  2. El binding `EMAIL` de Email Routing, si el proyecto lo tiene. En
 *     Pages Functions el binding no siempre está disponible, así que se
 *     comprueba antes de usarlo.
 *  3. Si no hay ninguna de las dos, se responde con un aviso para que la
 *     persona escriba directamente por correo: es preferible a perder el
 *     mensaje sin avisar.
 *
 * El campo `empresa` es una trampa para bots: solo lo rellenan ellos, y se
 * responde con "ok" para no darles pistas.
 */

interface PagesFunctionContext {
  request: Request;
  env: Record<string, string | undefined>;
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

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const etiquetasTipo: Record<string, string> = {
  correccion: "Corrección de datos",
  propuesta: "Propuesta de herramienta",
  patrocinio: "Patrocinio",
  otro: "Otra cosa",
};

const emailDestino = "hola@alternativas-libres.com";

function escaparHtml(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json(datos: unknown, estado = 200) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const onRequestPost = async ({ request, env }: PagesFunctionContext) => {
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
    return json({ error: "Petición inválida" }, 400);
  }

  // Campo trampa: solo los bots lo rellenan.
  if ((cuerpo.empresa ?? "").trim() !== "") {
    return json({ ok: true });
  }

  const email = (cuerpo.email ?? "").trim();
  const nombre = (cuerpo.nombre ?? "").trim();
  const mensaje = (cuerpo.mensaje ?? "").trim();
  const tipo = cuerpo.tipo ?? "otro";
  const asunto = etiquetasTipo[tipo] ?? "Otra cosa";
  const fecha = new Date().toISOString();

  if (!emailValido.test(email)) {
    return json({ error: "Introduce un email válido" }, 400);
  }
  if (mensaje.length < 10) {
    return json({ error: "Cuéntanos un poco más (mínimo 10 caracteres)" }, 400);
  }

  const datos = { tipo, email, nombre, mensaje, fecha };

  // 1. Webhook externo.
  const webhook = env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    if (!res.ok) {
      return json({ error: "No se pudo enviar. Inténtalo de nuevo." }, 502);
    }
    return json({ ok: true });
  }

  // 2. Email Routing, si el binding está disponible.
  const binding = env.EMAIL as BindingEmail | undefined;
  const destino = env.CONTACT_EMAIL_TO;
  if (binding && typeof binding.send === "function" && destino) {
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
        from: `web@alternativas-libres.com`,
        replyTo: email,
        subject: `[Web] ${asunto} — ${nombre || email}`,
        text: texto,
        html,
      });
      return json({ ok: true });
    } catch (error) {
      console.error("contacto: fallo al enviar por Email Routing", error);
      return json({ error: "No se pudo enviar. Inténtalo de nuevo." }, 502);
    }
  }

  // 3. Sin webhook ni binding: se dice con claridad, y se da la dirección.
  return json(
    {
      error:
        "El formulario no está configurado todavía. Escríbenos directamente a " +
        emailDestino +
        " y te respondemos.",
    },
    503,
  );
};

/**
 * Cualquier otro método no hace nada: solo se acepta POST.
 *
 * En Pages Functions, el manejador del método específico tiene prioridad:
 * con POST se ejecuta `onRequestPost` y esta función solo atiende el resto.
 */
export const onRequest = () => {
  return json({ error: "Método no permitido" }, 405);
};
