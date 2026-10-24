"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSearch() {
  const router = useRouter();
  const [consulta, setConsulta] = useState("");

  return (
    <form
      role="search"
      action="/buscar"
      method="get"
      aria-label="Buscar en el directorio"
      onSubmit={(e) => {
        e.preventDefault();
        const q = consulta.trim();
        router.push(q ? `/buscar?q=${encodeURIComponent(q)}` : "/buscar");
      }}
      className="mt-8 w-full max-w-2xl"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="hero-buscar" className="sr-only">
            Buscar herramientas autoalojadas
          </label>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          >
            <circle cx="9" cy="9" r="5.5" />
            <path d="m13.2 13.2 3.3 3.3" strokeLinecap="round" />
          </svg>
          <input
            id="hero-buscar"
            name="q"
            type="search"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Busca «notion», «slack», «CRM», «analítica»…"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full rounded-lg border border-border bg-surface pl-11 pr-4 text-base text-fg shadow-sm transition-colors placeholder:text-muted focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-fg transition hover:opacity-90"
        >
          Buscar
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </button>
      </div>
    </form>
  );
}
