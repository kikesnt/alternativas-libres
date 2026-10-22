import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Faq } from "@/components/faq";
import { FilterableAlternatives } from "@/components/filterable-alternatives";
import { ComparisonTable } from "@/components/comparison-table";
import { Byline } from "@/components/byline";
import { ProductIcon } from "@/components/product-icon";
import { JsonLd } from "@/components/json-ld";
import { getAlternativesByProduct, getGuidesForProduct, getProduct, getProducts } from "@/lib/queries";
import { site } from "@/lib/site";

type Params = { params: Promise<{ producto: string }> };

export function generateStaticParams() {
  return getProducts().map((p) => ({ producto: p.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { producto } = await params;
  const product = getProduct(producto);
  if (!product) return {};

  const title = `Alternativas a ${product.nombre}: ${product.alternativas.length} opciones autoalojadas`;
  const description = `Alternativas open source y autoalojadas a ${product.nombre}. Requisitos, licencia, coste real, contras y cuándo no conviene migrar.`;

  return {
    title,
    description,
    alternates: { canonical: `/alternativas/${product.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default function ProductoPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-16 text-sm text-muted">Cargando…</div>}>
      <Contenido params={params} />
    </Suspense>
  );
}

async function Contenido({ params }: Params) {
  const { producto } = await params;
  const product = getProduct(producto);
  if (!product) notFound();

  const alternativas = getAlternativesByProduct(product);
  const guias = getGuidesForProduct(product.slug);

  const faq = [
    {
      q: `¿Cuál es la mejor alternativa a ${product.nombre}?`,
      a: `Depende de tu caso. Para la instalación más sencilla, ${alternativas[0]?.nombre ?? "ninguna"}. Para el mínimo consumo de recursos, busca las marcadas como "Trivial" en el filtro de instalación. La comparación completa está en la tabla de arriba.`,
    },
    {
      q: `¿Cuánto cuesta migrar de ${product.nombre} a una alternativa autoalojada?`,
      a: `El coste directo es el del servidor, entre 5 y 30 USD al mes según el número de usuarios. El coste real es el tiempo de quien se encargue de las actualizaciones. Antes de migrar, exporta tus datos y prueba la alternativa con un subconjunto de usuarios durante un mes.`,
    },
    {
      q: `¿Se pueden migrar los datos de ${product.nombre}?`,
      a: `En la mayoría de casos sí. Las herramientas de este directorio incluyen importadores o DyeTools de exportación. Comprueba en la ficha de cada alternativa si hay un importador específico antes de planificar la migración.`,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs
        items={[
          { name: "Alternativas", href: "/alternativas" },
          { name: product.nombre, href: `/alternativas/${product.slug}` },
        ]}
      />

      <div className="max-w-3xl">
        <div className="flex items-center gap-3">
          <ProductIcon slug={product.slug} nombre={product.nombre} size={44} />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Alternativas a {product.nombre}
          </h1>
        </div>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          {product.resumen}
        </p>
        <p className="mt-3 text-sm text-muted">
          Precio de {product.nombre}: {product.precio}. Licencia:{" "}
          {product.licencia}.
        </p>
        <Link
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-accent hover:underline"
        >
          Abrir el sitio de {product.nombre}
        </Link>
        <div className="mt-5">
          <Byline fecha={product.verificadoEn} />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Por qué considerar el cambio</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
          {product.porqueSustituir.map((motivo) => (
            <li key={motivo} className="flex gap-2">
              <span aria-hidden="true" className="text-accent">
                →
              </span>
              <span>{motivo}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          {alternativas.length} alternativas autoalojadas
        </h2>
        <p className="mt-2 text-sm text-muted">
          Filtra por licencia, dificultad de instalación, coste o disponibilidad
          de imagen de Docker.
        </p>
        <div className="mt-6">
          <FilterableAlternatives
            alternatives={alternativas}
            productSlug={product.slug}
            productName={product.nombre}
          />
        </div>
      </section>

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICULO ?? ""}
        className="mt-12"
        minHeight={100}
      />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Tabla comparativa</h2>
        <p className="mt-2 text-sm text-muted">
          Todos los datos de las alternativas a {product.nombre} de un vistazo,
          sin abrir las fichas una a una.
        </p>
        <div className="mt-4">
          <ComparisonTable
            alternatives={alternativas}
            productSlug={product.slug}
          />
        </div>
      </section>

      <section className="mt-12 rounded-lg border border-border bg-panel p-6">
        <h2 className="text-xl font-semibold">
          Cuándo no conviene migrar de {product.nombre}
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
          {product.cuandoNoMigrar.map((motivo) => (
            <li key={motivo} className="flex gap-2">
              <span aria-hidden="true" className="text-amber-500">
                !
              </span>
              <span>{motivo}</span>
            </li>
          ))}
        </ul>
      </section>

      {guias.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Comparativas en detalle</h2>
          <div className="mt-4 divide-y divide-border rounded-lg border border-border">
            {guias.map((g) => (
              <Link
                key={g.slug}
                href={`/comparativas/${g.slug}`}
                className="block p-5 hover:bg-panel"
              >
                <h3 className="font-semibold">{g.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {g.descripcion}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <Faq items={faq} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Alternativas a ${product.nombre}`,
          numberOfItems: alternativas.length,
          itemListElement: alternativas.map((alt, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "SoftwareApplication",
              name: alt.nombre,
              url: alt.url,
              applicationCategory: product.categoria,
              operatingSystem: "Linux, Docker",
              description: alt.tagline,
              license: alt.licencia,
              offers: {
                "@type": "Offer",
                price: alt.coste === "gratis" ? "0" : undefined,
                priceCurrency: "EUR",
              },
            },
          })),
          url: `${site.url}/alternativas/${product.slug}`,
        }}
      />
    </div>
  );
}
