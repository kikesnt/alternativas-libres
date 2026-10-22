import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FilterableAlternatives } from "@/components/filterable-alternatives";
import { recortar } from "@/lib/seo";
import {
  getAlternativesByCategory,
  getCategories,
  getCategory,
  getProductsByCategory,
} from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return {
    title: `Alternativas de ${category.nombre.toLowerCase()}`,
    description: recortar(category.descripcion),
    alternates: { canonical: `/categorias/${category.slug}` },
  };
}

export default function CategoriaPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-16 text-sm text-muted">Cargando…</div>}>
      <Contenido params={params} />
    </Suspense>
  );
}

async function Contenido({ params }: Params) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const productos = getProductsByCategory(slug);
  const alternativas = getAlternativesByCategory(slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs
        items={[
          { name: "Categorías", href: "/categorias" },
          { name: category.nombre, href: `/categorias/${category.slug}` },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {category.nombre}
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted">
        {category.descripcion}
      </p>

      <div className="mt-8">
        <FilterableAlternatives alternatives={alternativas} />
      </div>

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTADO ?? ""}
        className="mt-12"
        minHeight={100}
      />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">
          Productos de esta categoría
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {productos.map((p) => (
            <li key={p.slug}>
              <a
                href={`/alternativas/${p.slug}`}
                className="block rounded-lg border border-border bg-panel p-4 text-sm hover:border-accent"
              >
                <span className="font-medium">{p.nombre}</span>
                <span className="mt-1 block text-xs text-muted">
                  {p.resumen}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
