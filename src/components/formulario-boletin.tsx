"use client";

import { useState } from "react";

type Estado = "idle" | "enviando" | "ok" | "error";

export function FormularioBoletin({
  variante = "compacto",
}: {
  variante?: "compacto" | "bloque";
}) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEstado("enviando");
    setMensaje("");

    try {
      const res = await fetch("/api/suscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const datos = await res.json();

      if (res.ok) {
        setEstado("ok");
        setMensaje(datos.mensaje ?? "Listo. Revisa tu correo para confirmar.");
        setEmail("");
      } else {
        setEstado("error");
        setMensaje(datos.error ?? "No se pudo completar el alta.");
      }
    } catch {
      setEstado("error");
      setMensaje("No se pudo completar el alta.");
    }
  }

  if (estado === "ok") {
    return (
      <p className="rounded-lg border border-accent/40 bg-accent-soft/40 p-4 text-sm">
        {mensaje}
      </p>
    );
  }

  return (
    <form onSubmit={enviar} className={variante === "bloque" ? "max-w-md" : ""}>
      <div className="flex gap-2">
        <label htmlFor="email-boletin" className="sr-only">
          Tu email
        </label>
        <input
          id="email-boletin"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.es"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90 disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando…" : "Apuntarme"}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">
        Un correo cada dos semanas. Sin spam y puedes darte de baja con un
        clic.
      </p>
      {estado === "error" ? (
        <p className="mt-2 text-xs text-amber-600">{mensaje}</p>
      ) : null}
    </form>
  );
}
