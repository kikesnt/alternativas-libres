import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Byline } from "@/components/byline";
import { Faq } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { getAlternative, getGuide, getGuides, getProduct } from "@/lib/queries";
import { recortar } from "@/lib/seo";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return {
    title: guide.titulo,
    description: recortar(guide.descripcion),
    alternates: { canonical: `/comparativas/${guide.slug}` },
  };
}

function ancla(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ComparativaPage({ params }: Params) {
  return (
    <Suspense fallback={null}>
      <Contenido params={params} />
    </Suspense>
  );
}

async function Contenido({ params }: Params) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const product = getProduct(guide.producto);
  const alternativa = getAlternative(guide.alternativa);
  const otras = getGuides()
    .filter((g) => g.slug !== guide.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs
        items={[
          { name: "Comparativas", href: "/comparativas" },
          { name: guide.titulo, href: `/comparativas/${guide.slug}` },
        ]}
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
        <article className="min-w-0">
          <header>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {guide.titulo}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {guide.descripcion}
            </p>
            <div className="mt-5">
              <Byline fecha={guide.fecha} />
            </div>
            {product && alternativa ? (
              <p className="mt-4 text-sm">
                <Link
                  href={`/alternativas/${product.slug}`}
                  className="text-accent hover:underline"
                >
                  {product.nombre}
                </Link>{" "}
                frente a{" "}
                <Link
                  href={`/alternativas/${product.slug}/${alternativa.slug}`}
                  className="text-accent hover:underline"
                >
                  {alternativa.nombre}
                </Link>
              </p>
            ) : null}
          </header>

          <AdSlot
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICULO ?? ""}
            className="mt-8"
            minHeight={100}
          />

          <div className="prose-guia mt-8">
            {guide.secciones.map((seccion, i) => (
              <section key={seccion.h2}>
                <h2 id={ancla(seccion.h2)} className="mt-10 text-2xl font-semibold scroll-mt-20">
                  {seccion.h2}
                </h2>
                {seccion.parrafos.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
                {seccion.lista ? (
                  <ul>
                    {seccion.lista.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {i === 1 ? (
                  <AdSlot
                    slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICULO ?? ""}
                    className="my-8"
                    minHeight={100}
                  />
                ) : null}
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-lg border border-accent/40 bg-accent-soft/30 p-6">
            <h2 id="el-veredicto" className="text-xl font-semibold scroll-mt-20">El veredicto</h2>
            <p className="mt-3 leading-relaxed">{guide.veredicto}</p>
          </section>

          <Faq items={guide.faq} />

          {otras.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">Otras comparativas</h2>
              <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
                {otras.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/comparativas/${g.slug}`}
                      className="block p-4 text-sm hover:bg-panel"
                    >
                      {g.titulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <aside className="mt-12 lg:mt-0">
          <div className="lg:sticky lg:top-20">
            <p className="text-sm font-semibold">En esta comparativa</p>
            <nav aria-label="Índice de la comparativa" className="mt-3">
              <ol className="space-y-2 border-l border-border text-sm">
                {guide.secciones.map((s) => (
                  <li key={s.h2}>
                    <a
                      href={`#${ancla(s.h2)}`}
                      className="block border-l-2 border-transparent pl-3 text-muted hover:border-accent hover:text-fg"
                    >
                      {s.h2}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#el-veredicto"
                    className="block border-l-2 border-transparent pl-3 text-muted hover:border-accent hover:text-fg"
                  >
                    El veredicto
                  </a>
                </li>
              </ol>
            </nav>

            <AdSlot
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTADO ?? ""}
              className="mt-6"
              minHeight={250}
              format="rectangle"
            />

            <div className="mt-6 rounded-lg border border-border bg-panel p-4 text-sm">
              <p className="font-medium">¿Falta una alternativa?</p>
              <p className="mt-1 text-muted">
                Si conoces una opción autoalojada que no aparece aquí,{" "}
                <Link href="/colabora" className="text-accent hover:underline">
                  dínoslo
                </Link>
                .
              </p>
            </div>
          </div>
        </aside>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.titulo,
          description: guide.descripcion,
          image: `${site.url}/opengraph-image`,
          datePublished: guide.fecha,
          dateModified: guide.fecha,
          inLanguage: "es",
          author: {
            "@type": "Person",
            name: site.autor,
          },
          publisher: {
            "@type": "Organization",
            name: site.nombre,
          },
          mainEntityOfPage: `${site.url}/comparativas/${guide.slug}`,
        }}
      />
    </div>
  );
}
