import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ToolIcon } from "@/components/tool-icon";
import { getAlternatives, getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Alternativas a cada herramienta",
  description:
    "Para cada herramienta del directorio, las alternativas que puedes autoalojar en su lugar, con licencia, requisitos y contras.",
  alternates: { canonical: "/herramientas" },
};

export default function HerramientasPage() {
  const productos = getProducts();
  const herramientas = getAlternatives(
    productos.flatMap((p) => p.alternativas),
  ).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs items={[{ name: "Herramientas", href: "/herramientas" }]} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Alternativas a cada herramienta
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted">
        Si ya usas una de estas herramientas y quieres saber qué poner en su
        lugar, aquí tienes la lista de alternativas autoalojadas a cada una,
        con licencia, requisitos de servidor y contras.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {herramientas.map((alt) => (
          <Link
            key={alt.slug}
            href={`/herramientas/${alt.slug}`}
            className="card-hover flex items-center gap-3 rounded-lg border border-border bg-panel p-4"
          >
            <ToolIcon slug={alt.slug} nombre={alt.nombre} size={36} />
            <div className="min-w-0">
              <p className="truncate font-medium">Alternativas a {alt.nombre}</p>
              <p className="mt-0.5 truncate text-xs text-muted">
                {alt.licencia}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
