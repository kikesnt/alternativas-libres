"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Resultado = {
  tipo: "producto" | "alternativa";
  nombre: string;
  descripcion: string;
  href: string;
  etiquetas: string[];
};

export function Buscador({
  indice,
  consultaInicial = "",
}: {
  indice: Resultado[];
  consultaInicial?: string;
}) {
  const [consulta, setConsulta] = useState(consultaInicial);

  const resultados = useMemo(() => {
    const q = consulta.trim().toLowerCase();
    if (q.length < 2) return [];
    return indice
      .filter((r) =>
        [r.nombre, r.descripcion, r.etiquetas.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 40);
  }, [consulta, indice]);

  return (
    <div>
      <label className="block text-sm text-muted" htmlFor="busqueda">
        Busca una herramienta, un producto o una categoría
      </label>
      <input
        id="busqueda"
        type="search"
        value={consulta}
        onChange={(e) => setConsulta(e.target.value)}
        placeholder="notion, nextcloud, analítica, docker..."
        autoFocus
        className="mt-2 w-full rounded-md border border-border bg-surface px-4 py-3 text-base text-fg"
      />

      {consulta.trim().length < 2 ? (
        <p className="mt-6 text-sm text-muted">
          Escribe al menos dos letras. También puedes navegar por{" "}
          <Link href="/alternativas" className="text-accent hover:underline">
            el directorio completo
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6">
          <p className="text-sm text-muted">
            {resultados.length} resultados
          </p>
          <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
            {resultados.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="block p-4 hover:bg-panel">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-accent-soft/50 px-2 py-0.5 text-[11px] uppercase tracking-wide text-accent">
                      {r.tipo}
                    </span>
                    <span className="font-medium">{r.nombre}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{r.descripcion}</p>
                </Link>
              </li>
            ))}
          </ul>
          {resultados.length === 0 ? (
            <p className="mt-6 rounded-lg border border-border bg-panel p-6 text-sm text-muted">
              No hay resultados. Prueba con el nombre de la herramienta
              (Nextcloud, n8n, Plausible) o con el del producto que quieres
              sustituir.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
