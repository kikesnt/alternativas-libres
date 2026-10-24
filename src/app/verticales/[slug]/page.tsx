import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FilterableAlternatives } from "@/components/filterable-alternatives";
import { JsonLd } from "@/components/json-ld";
import { recortar } from "@/lib/seo";
import { site } from "@/lib/site";
import {
  getAlternativesByVertical,
  getProductsByVertical,
  getVertical,
  getVerticals,
} from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVerticals().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const vertical = getVertical(slug);
  if (!vertical) return {};

  return {
    title: `Alternativas para ${vertical.nombre.toLowerCase()}`,
    description: recortar(vertical.descripcion),
    alternates: { canonical: `/verticales/${vertical.slug}` },
  };
}

export default function VerticalPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-16 text-sm text-muted">Cargando…</div>}>
      <Contenido params={params} />
    </Suspense>
  );
}

async function Contenido({ params }: Params) {
  const { slug } = await params;
  const vertical = getVertical(slug);
  if (!vertical) notFound();

  const alternativas = getAlternativesByVertical(slug);
  const productos = getProductsByVertical(slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs
        items={[
          { name: "Por tipo de equipo", href: "/verticales" },
          { name: vertical.nombre, href: `/verticales/${vertical.slug}` },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Alternativas autoalojadas para {vertical.nombre.toLowerCase()}
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted">
        {vertical.descripcion}
      </p>
      <p className="mt-2 text-sm text-muted">
        Ejemplos: {vertical.ejemplos.join(", ")}
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        Herramientas para {vertical.nombre.toLowerCase()}
      </h2>
      <div className="mt-4">
        <FilterableAlternatives alternatives={alternativas} />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">
          Productos que estos equipos suelen sustituir
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {productos.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/alternativas/${p.slug}`}
                className="block rounded-lg border border-border bg-panel p-4 text-sm hover:border-accent"
              >
                <span className="font-medium">{p.nombre}</span>
                <span className="mt-1 block text-xs text-muted">
                  {p.resumen}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Alternativas autoalojadas para ${vertical.nombre.toLowerCase()}`,
          description: vertical.descripcion,
          url: `${site.url}/verticales/${vertical.slug}`,
          inLanguage: "es",
          isPartOf: { "@type": "WebSite", name: site.nombre, url: site.url },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: alternativas.length,
            itemListElement: alternativas.slice(0, 20).map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: a.nombre,
              url: `${site.url}/alternativas/${a.sustituye[0]}/${a.slug}`,
            })),
          },
        }}
      />
    </div>
  );
}
