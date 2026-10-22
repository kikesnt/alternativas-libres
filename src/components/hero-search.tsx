"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSearch() {
  const router = useRouter();
  const [consulta, setConsulta] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = consulta.trim();
        router.push(q ? `/buscar?q=${encodeURIComponent(q)}` : "/buscar");
      }}
      className="mt-8 flex max-w-xl gap-2"
    >
      <label htmlFor="hero-buscar" className="sr-only">
        Buscar herramientas autoalojadas
      </label>
      <input
        id="hero-buscar"
        type="search"
        value={consulta}
        onChange={(e) => setConsulta(e.target.value)}
        placeholder="notion, slack, analítica, CRM..."
        className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm text-fg placeholder:text-muted"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg hover:opacity-90"
      >
        Buscar
      </button>
    </form>
  );
}
