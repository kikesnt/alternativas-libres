import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { JsonLd } from "@/components/json-ld";
import { AlternativeCard } from "@/components/alternative-card";
import { HeroSearch } from "@/components/hero-search";
import { ProductIcon } from "@/components/product-icon";
import { Byline } from "@/components/byline";
import {
  getAlternatives,
  getGuides,
  getProducts,
  getVerticals,
} from "@/lib/queries";
import { site } from "@/lib/site";

export default function HomePage() {
  const productos = getProducts();
  const verticales = getVerticals();
  const destacados = Array.from(
    new Map(
      getAlternatives(productos.flatMap((p) => p.alternativas)).map((a) => [
        a.slug,
        a,
      ]),
    ).values(),
  ).filter((a) => a.destacado);
  const guias = getGuides().slice(0, 3);
  const alternativasTotales = new Set(
    productos.flatMap((p) => p.alternativas),
  ).size;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Alternativas autoalojadas a las herramientas SaaS de tu día a día
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Un directorio en español con {productos.length} productos y{" "}
          {alternativasTotales} herramientas open source y de código
          disponible. Para cada una: requisitos reales de servidor, licencia,
          coste, contras y cuándo no conviene migrar.
        </p>
        <HeroSearch />

        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div>
            <dt className="text-muted">Herramientas</dt>
            <dd className="text-lg font-semibold">{alternativasTotales}</dd>
          </div>
          <div>
            <dt className="text-muted">Productos a sustituir</dt>
            <dd className="text-lg font-semibold">12</dd>
          </div>
          <div>
            <dt className="text-muted">Comparativas</dt>
            <dd className="text-lg font-semibold">10</dd>
          </div>
          <div>
            <dt className="text-muted">Datos revisados</dt>
            <dd className="text-lg font-semibold">22 oct 2026</dd>
          </div>
        </dl>

        <div className="mt-7">
          <Byline fecha="22 de octubre de 2026" etiqueta="Revisado" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/alternativas"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
          >
            Ver el directorio completo
          </Link>
          <Link
            href="/comparativas"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-fg hover:bg-panel"
          >
            Comparativas en detalle
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Herramientas por producto</h2>
        <p className="mt-2 text-sm text-muted">
          Empieza por la herramienta que quieres sustituir.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((product) => (
            <Link
              key={product.slug}
              href={`/alternativas/${product.slug}`}
              className="card-hover rounded-lg border border-border bg-panel p-5"
            >
              <div className="flex items-start gap-3">
                <ProductIcon
                  slug={product.slug}
                  nombre={product.nombre}
                  size={40}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-semibold">{product.nombre}</h3>
                    <span className="shrink-0 text-xs text-muted">
                      {product.alternativas.length} alternativas
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {product.resumen}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTADO ?? ""}
        className="mt-14"
        minHeight={100}
      />

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Recomendadas ahora mismo</h2>
        <p className="mt-2 text-sm text-muted">
          Las que más recomendamos por equilibrio entre facilidad de
          instalación, licencia y comunidad.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {destacados.slice(0, 6).map((alt) => (
            <AlternativeCard key={alt.slug} alternative={alt} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Por tipo de equipo</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {verticales.map((v) => (
            <Link
              key={v.slug}
              href={`/verticales/${v.slug}`}
              className="card-hover rounded-lg border border-border bg-panel p-5"
            >
              <h3 className="font-semibold">{v.nombre}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {v.descripcion}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Comparativas</h2>
        <p className="mt-2 text-sm text-muted">
          Análisis largos con los números de coste y los casos donde migrar
          sale más caro de lo que parece.
        </p>
        <div className="mt-6 divide-y divide-border rounded-lg border border-border">
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
              <p className="mt-3 text-xs text-muted">
                {g.lecturaMin} min de lectura
              </p>
            </Link>
          ))}
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.nombre,
          url: site.url,
          logo: `${site.url}/icon.svg`,
          founder: { "@type": "Person", name: site.autor },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.nombre,
          url: site.url,
          inLanguage: "es",
          potentialAction: {
            "@type": "SearchAction",
            target: `${site.url}/buscar?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
    </div>
  );
}
