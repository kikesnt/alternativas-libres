"use client";

import { useMemo, useState } from "react";
import { AlternativeCard } from "@/components/alternative-card";
import { costLabels, difficultyLabels, licenseLabels } from "@/lib/queries";
import type { Alternative } from "@/lib/types";

type Filters = {
  licencia: string;
  dificultad: string;
  coste: string;
  docker: string;
  texto: string;
};

const inicial: Filters = {
  licencia: "todas",
  dificultad: "todas",
  coste: "todos",
  docker: "todos",
  texto: "",
};

const selectClass =
  "rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-fg";

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function FilterableAlternatives({
  alternatives,
  productSlug,
  productName,
}: {
  alternatives: Alternative[];
  productSlug?: string;
  productName?: string;
}) {
  const [filters, setFilters] = useState<Filters>(inicial);

  const resultado = useMemo(() => {
    const texto = normalizar(filters.texto.trim());
    return alternatives.filter((a) => {
      if (filters.licencia !== "todas" && a.licenciaTipo !== filters.licencia) {
        return false;
      }
      if (
        filters.dificultad !== "todas" &&
        String(a.dificultad) !== filters.dificultad
      ) {
        return false;
      }
      if (filters.coste !== "todos" && a.coste !== filters.coste) {
        return false;
      }
      if (filters.docker === "si" && !a.dockerOficial) return false;
      if (filters.docker === "no" && a.dockerOficial) return false;
      if (texto) {
        const textoBuscable = normalizar(
          [a.nombre, a.tagline, a.stack.join(" "), a.highlights.join(" ")].join(
            " ",
          ),
        );
        if (!textoBuscable.includes(texto)) return false;
      }
      return true;
    });
  }, [alternatives, filters]);

  const hayFiltros =
    filters.licencia !== "todas" ||
    filters.dificultad !== "todas" ||
    filters.coste !== "todos" ||
    filters.docker !== "todos" ||
    filters.texto.trim() !== "";

  const licencias = Array.from(new Set(alternatives.map((a) => a.licenciaTipo)));
  const costes = Array.from(new Set(alternatives.map((a) => a.coste)));

  return (
    <div>
      <div className="grid gap-3 rounded-lg border border-border bg-panel p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Buscar
          <input
            type="search"
            value={filters.texto}
            onChange={(e) =>
              setFilters((f) => ({ ...f, texto: e.target.value }))
            }
            placeholder="Nombre o tecnología"
            className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-fg"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Licencia
          <select
            value={filters.licencia}
            onChange={(e) =>
              setFilters((f) => ({ ...f, licencia: e.target.value }))
            }
            className={selectClass}
          >
            <option value="todas">Todas</option>
            {licencias.map((l) => (
              <option key={l} value={l}>
                {licenseLabels[l]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Dificultad
          <select
            value={filters.dificultad}
            onChange={(e) =>
              setFilters((f) => ({ ...f, dificultad: e.target.value }))
            }
            className={selectClass}
          >
            <option value="todas">Todas</option>
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={String(d)}>
                {difficultyLabels[d]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Coste
          <select
            value={filters.coste}
            onChange={(e) =>
              setFilters((f) => ({ ...f, coste: e.target.value }))
            }
            className={selectClass}
          >
            <option value="todos">Todos</option>
            {costes.map((c) => (
              <option key={c} value={c}>
                {costLabels[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Docker oficial
          <select
            value={filters.docker}
            onChange={(e) =>
              setFilters((f) => ({ ...f, docker: e.target.value }))
            }
            className={selectClass}
          >
            <option value="todos">Todos</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          {resultado.length} de {alternatives.length}{" "}
          {alternatives.length === 1 ? "herramienta" : "herramientas"}
        </p>
        {hayFiltros ? (
          <button
            type="button"
            onClick={() => setFilters(inicial)}
            className="text-sm font-medium text-accent hover:underline"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {resultado.map((alt) => (
          <AlternativeCard
            key={alt.slug}
            alternative={alt}
            productSlug={productSlug}
            productName={productName}
          />
        ))}
      </div>

      {resultado.length === 0 ? (
        <p className="mt-8 rounded-lg border border-border bg-panel p-6 text-sm text-muted">
          Ninguna alternativa coincide con los filtros. Prueba a relajar alguno.
        </p>
      ) : null}
    </div>
  );
}
