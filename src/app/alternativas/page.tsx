import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { FilterableAlternatives } from "@/components/filterable-alternatives";
import { getAlternatives, getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Directorio de alternativas autoalojadas",
  description:
    "Todas las alternativas autoalojadas del directorio, open source o de fuente disponible, con filtros por licencia, dificultad, coste y Docker.",
  alternates: { canonical: "/alternativas" },
};

export default function AlternativasPage() {
  const products = getProducts();
  const alternativas = getAlternatives(
    products.flatMap((p) => p.alternativas),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Directorio completo
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted">
        {alternativas.length} herramientas autoalojadas para {products.length}{" "}
        productos SaaS. Filtra por licencia, dificultad, coste o disponibilidad
        de imagen de Docker.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        Todas las herramientas
      </h2>
      <div className="mt-4">
        <FilterableAlternatives alternatives={alternativas} />
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Herramientas por producto</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/alternativas/${p.slug}`}
              className="rounded-lg border border-border bg-panel p-4 text-sm hover:border-accent"
            >
              <span className="font-medium">{p.nombre}</span>
              <span className="mt-1 block text-xs text-muted">
                {p.alternativas.length} alternativas
              </span>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTADO ?? ""}
        className="mt-14"
        minHeight={100}
      />
    </div>
  );
}
