import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { JsonLd } from "@/components/json-ld";
import { AlternativeCard } from "@/components/alternative-card";
import { Byline } from "@/components/byline";
import { HeroSearch } from "@/components/hero-search";
import { ProductIcon } from "@/components/product-icon";
import { getCategories, getResumenDirectorio, getVerticals } from "@/lib/queries";
import { formatearFechaMedia } from "@/lib/fechas";
import { site } from "@/lib/site";

function EncabezadoSeccion({
  titulo,
  descripcion,
  href,
  enlace = "Ver todas",
}: {
  titulo: string;
  descripcion?: string;
  href?: string;
  enlace?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{titulo}</h2>
        {descripcion ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {descripcion}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="text-sm font-medium text-accent hover:underline"
        >
          {enlace} →
        </Link>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  const {
    productos,
    alternativas,
    guias,
    totalAlternativas,
    totalGuias,
    ultimaRevision,
  } = getResumenDirectorio();
  const verticales = getVerticals();
  const categorias = getCategories();
  const destacados = alternativas.filter((a) => a.destacado).slice(0, 6);
  const guiasDestacadas = guias.slice(0, 3);
  const fechaRevision = formatearFechaMedia(ultimaRevision);

  const estadisticas: { label: string; value: string }[] = [
    { label: "Herramientas", value: String(totalAlternativas) },
    { label: "Productos a sustituir", value: String(productos.length) },
    { label: "Comparativas", value: String(totalGuias) },
    { label: "Categorías", value: String(categorias.length) },
  ];

  return (
    <div>
      <section className="hero-glow border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:pt-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/50 px-3 py-1 text-xs font-medium text-accent">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-accent"
            />
            Directorio independiente · actualizado el {fechaRevision}
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Alternativas autoalojadas a las{" "}
            <span className="text-accent">herramientas SaaS</span> que usas cada
            día
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {totalAlternativas} herramientas open source y de fuente disponible
            para sustituir {productos.length} servicios de tu día a día. Para
            cada una: requisitos reales de servidor, licencia, coste, contras y
            cuándo no conviene migrar.
          </p>

          <HeroSearch />

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Explora por categoría:</span>
            {categorias.slice(0, 5).map((categoria) => (
              <Link
                key={categoria.slug}
                href={`/categorias/${categoria.slug}`}
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                {categoria.nombre}
              </Link>
            ))}
            <Link
              href="/categorias"
              className="text-xs font-medium text-accent hover:underline"
            >
              Todas →
            </Link>
          </div>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {estadisticas.map((dato) => (
              <div
                key={dato.label}
                className="rounded-lg border border-border bg-surface/70 p-3 backdrop-blur"
              >
                <dt className="text-xs text-muted">{dato.label}</dt>
                <dd className="mt-1 text-xl font-semibold tracking-tight text-fg">
                  {dato.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <Byline fecha={ultimaRevision} etiqueta="Revisado" />
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
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-fg hover:bg-panel"
            >
              Comparativas en detalle
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14">
        <section>
          <EncabezadoSeccion
            titulo="Elige qué quieres sustituir"
            descripcion="Empieza por la herramienta que ya usas y mira qué puedes montar en tu propio servidor."
            href="/alternativas"
            enlace="Ver el directorio"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((product) => (
              <Link
                key={product.slug}
                href={`/alternativas/${product.slug}`}
                className="card-hover group flex flex-col rounded-lg border border-border bg-panel p-5"
              >
                <div className="flex items-start gap-3">
                  <ProductIcon
                    slug={product.slug}
                    nombre={product.nombre}
                    size={40}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                      <h3 className="text-lg font-semibold">{product.nombre}</h3>
                      <span className="shrink-0 rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-muted">
                        {product.alternativas.length}{" "}
                        {product.alternativas.length === 1
                          ? "alternativa"
                          : "alternativas"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {product.resumen}
                    </p>
                  </div>
                </div>
                <span className="mt-4 text-xs font-medium text-muted transition-colors group-hover:text-accent">
                  Ver alternativas →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTADO ?? ""}
          className="mt-16"
          minHeight={100}
        />

        <section className="mt-16">
          <EncabezadoSeccion
            titulo="Recomendadas ahora mismo"
            descripcion="Las que mejor equilibran facilidad de instalación, licencia y comunidad."
            href="/herramientas"
            enlace="Ver todas las fichas"
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {destacados.map((alt) => (
              <AlternativeCard key={alt.slug} alternative={alt} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <EncabezadoSeccion
            titulo="Por tipo de equipo"
            descripcion="Selecciones pensadas para perfiles concretos, no para todo el mundo."
            href="/verticales"
            enlace="Ver todas"
          />
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

        <section className="mt-16">
          <EncabezadoSeccion
            titulo="Comparativas"
            descripcion="Análisis largos con los números de coste y los casos donde migrar sale más caro de lo que parece."
            href="/comparativas"
            enlace="Todas las comparativas"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {guiasDestacadas.map((guia) => (
              <Link
                key={guia.slug}
                href={`/comparativas/${guia.slug}`}
                className="card-hover flex flex-col rounded-lg border border-border bg-panel p-5"
              >
                <p className="text-xs text-muted">
                  {formatearFechaMedia(guia.fecha)} · {guia.lecturaMin} min de
                  lectura
                </p>
                <h3 className="mt-2 font-semibold leading-snug">
                  {guia.titulo}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                  {guia.descripcion}
                </p>
                <span className="mt-auto pt-4 text-sm font-medium text-accent">
                  Leer comparativa →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-xl border border-accent/30 bg-accent-soft/30 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h2 className="text-xl font-semibold">¿Falta una alternativa?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Si conoces una herramienta autoalojada que debería estar aquí, o
              ves un dato desactualizado, dínoslo. Revisamos cada propuesta
              antes de publicarla.
            </p>
          </div>
          <Link
            href="/colabora"
            className="mt-4 inline-block shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90 sm:mt-0"
          >
            Proponer una herramienta
          </Link>
        </section>

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.nombre,
            url: site.url,
            logo: `${site.url}/icon.svg`,
            image: `${site.url}/icon.svg`,
            description: site.descripcion,
            inLanguage: "es",
            founder: {
              "@type": "Person",
              name: site.autor,
              url: `${site.url}/acerca-de`,
            },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: site.email,
              availableLanguage: ["es"],
            },
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
    </div>
  );
}
