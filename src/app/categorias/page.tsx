import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getProductsByCategory } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Categorías",
  description:
    "Alternativas autoalojadas agrupadas por categoría: productividad, comunicación, analítica, CRM, diseño y más.",
  alternates: { canonical: "/categorias" },
};

export default function CategoriasPage() {
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Categorías
      </h1>
      <p className="mt-3 text-lg text-muted">
        Cada categoría agrupa los productos que quieres sustituir y las
        herramientas autoalojadas que los reemplazan.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {categories.map((c) => {
          const productos = getProductsByCategory(c.slug);
          return (
            <div
              key={c.slug}
              className="rounded-lg border border-border bg-panel p-5"
            >
              <h2 className="text-lg font-semibold">{c.nombre}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {c.descripcion}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {productos.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/alternativas/${p.slug}`}
                    className="rounded-full border border-border px-3 py-1 text-xs text-fg hover:border-accent hover:text-accent"
                  >
                    {p.nombre}
                  </Link>
                ))}
              </div>
              <Link
                href={`/categorias/${c.slug}`}
                className="mt-4 inline-block text-sm text-accent hover:underline"
              >
                Ver la categoría
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
