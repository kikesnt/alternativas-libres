"use client";

import { useState } from "react";

export function FormularioContacto() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">(
    "idle",
  );
  const [mensaje, setMensaje] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >;

    setEstado("enviando");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const salida = await res.json();
      if (res.ok) {
        setEstado("ok");
        setMensaje("Mensaje enviado. Respondemos en dos días laborables.");
        form.reset();
      } else {
        setEstado("error");
        setMensaje(salida.error ?? "No se pudo enviar.");
      }
    } catch {
      setEstado("error");
      setMensaje("No se pudo enviar.");
    }
  }

  if (estado === "ok") {
    return (
      <p className="rounded-lg border border-accent/40 bg-accent-soft/40 p-5 text-sm">
        {mensaje}
      </p>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Nombre</span>
          <input
            name="nombre"
            type="text"
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Asunto</span>
        <select
          name="tipo"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
        >
          <option value="correccion">Corrección de datos</option>
          <option value="propuesta">Proponer una herramienta</option>
          <option value="patrocinio">Patrocinio</option>
          <option value="otro">Otra cosa</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Mensaje</span>
        <textarea
          name="mensaje"
          required
          rows={5}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg"
        />
      </label>
      <button
        type="submit"
        disabled={estado === "enviando"}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90 disabled:opacity-60"
      >
        {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
      </button>
      {estado === "error" ? (
        <p className="text-sm text-warn-fg">{mensaje}</p>
      ) : null}
    </form>
  );
}
