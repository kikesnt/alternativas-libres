import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ComparisonTable } from "@/components/comparison-table";
import { Faq } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { ToolIcon } from "@/components/tool-icon";
import { getAlternatives, getAlternative, getProducts } from "@/lib/queries";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const productos = getProducts();
  return getAlternatives(productos.flatMap((p) => p.alternativas)).map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const alt = getAlternative(slug);
  if (!alt) return {};

  const titulo = `Alternativas a ${alt.nombre}: ${alt.licencia}`;
  const descripcion = `Alternativas open source a ${alt.nombre}. Requisitos, licencia, coste y contras de cada opción, con la ficha completa de ${alt.nombre}.`;

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: `/herramientas/${alt.slug}` },
    openGraph: { title: titulo, description: descripcion, type: "website" },
  };
}

export default async function HerramientaPage({ params }: Params) {
  const { slug } = await params;
  const alt = getAlternative(slug);
  if (!alt) notFound();

  const productos = getProducts();
  const hubs = productos.filter((p) => p.alternativas.includes(alt.slug));
  const hermanos = getAlternatives(
    [...new Set(hubs.flatMap((p) => p.alternativas))],
  ).filter((a) => a.slug !== alt.slug);

  const hrefPorSlug: Record<string, string> = {};
  for (const a of hermanos) {
    const hub = hubs.find((p) => p.alternativas.includes(a.slug));
    if (hub) hrefPorSlug[a.slug] = `/alternativas/${hub.slug}/${a.slug}`;
  }

  const gratuitas = hermanos.filter((a) => a.coste === "gratis");
  const libres = hermanos.filter(
    (a) => a.licenciaTipo === "open-source" || a.licenciaTipo === "source-available",
  );

  const faq = [
    {
      q: `¿Cuál es la mejor alternativa a ${alt.nombre}?`,
      a: `Depende del caso. Para la instalación más sencilla, ${hermanos[0]?.nombre ?? "consulta la tabla"}. Para el mínimo consumo de recursos, busca las marcadas como "Trivial" en el filtro. ${alt.nombre} sigue siendo la opción más completa si necesitas un solo sistema que cubra ficheros, calendario y contactos.`,
    },
    {
      q: `¿Hay una alternativa gratuita a ${alt.nombre}?`,
      a: gratuitas.length
        ? `Sí: ${gratuitas.map((a) => a.nombre).join(", ")}. Todas se pueden autoalojar sin pagar licencia, solo con el coste del servidor.`
        : `Las alternativas que aparecen aquí son todas de código abierto, pero ninguna es totalmente gratuita de montar: siempre hay un servidor que pagar.`,
    },
    {
      q: `¿Se puede migrar de ${alt.nombre} a alguna de estas alternativas?`,
      a: `Depende de los datos que tengas. Lo habitual es que la migración consista en exportar y reimportar, no en una conversión directa, así que conviene probar con un subconjunto antes de tocar el original. La ficha de ${alt.nombre} tiene el detalle de sus requisitos.`,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs
        items={[
          { name: "Herramientas", href: "/alternativas" },
          { name: `Alternativas a ${alt.nombre}`, href: `/herramientas/${alt.slug}` },
        ]}
      />

      <div className="flex items-start gap-4">
        <ToolIcon slug={alt.slug} nombre={alt.nombre} size={48} />
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Alternativas a {alt.nombre}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            {hermanos.length} herramientas que puedes montar en tu propio
            servidor en lugar de usar {alt.nombre}, con licencia, requisitos y
            contras de cada una.
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted">
        {alt.nombre} es {alt.tagline.toLowerCase()} Si buscas lo contrario,
        esta es{" "}
        <Link
          href={`/alternativas/${hubs[0]?.slug ?? "notion"}/${alt.slug}`}
          className="text-accent hover:underline"
        >
          su ficha completa
        </Link>
        , con los requisitos de servidor y cuándo no conviene usarla.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Alternativas open source a {alt.nombre}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Las {libres.length} opciones con licencia libre o fuente disponible.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {libres.map((a) => (
            <Link
              key={a.slug}
              href={`/alternativas/${a.sustituye[0]}/${a.slug}`}
              className="card-hover flex gap-3 rounded-lg border border-border bg-panel p-5"
            >
              <ToolIcon slug={a.slug} nombre={a.nombre} size={36} />
              <div className="min-w-0">
                <h3 className="font-semibold">{a.nombre}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {a.tagline}
                </p>
                <p className="mt-2 text-xs text-muted">{a.licencia}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {hermanos.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">
            Todas las alternativas a {alt.nombre} en una tabla
          </h2>
          <div className="mt-4">
            <ComparisonTable
              alternatives={hermanos}
              productSlug={hubs[0]?.slug ?? "notion"}
              hrefPorSlug={hrefPorSlug}
            />
          </div>
        </section>
      ) : null}

      <section className="mt-12 rounded-lg border border-border bg-panel p-6">
        <h2 className="text-xl font-semibold">
          {alt.nombre}: la alternativa que sustituye a{" "}
          {hubs.map((h) => h.nombre).join(" y ")}
        </h2>
        <p className="mt-3 leading-relaxed text-muted">
          {alt.tagline} Funciona{" "}
          {alt.requiereDevops
            ? "sobre tu propio servidor, y necesita que alguien se encargue de las actualizaciones."
            : "sin depender de un perfil de sistemas."}{" "}
          Recursos: {alt.recursosMinimos}. Licencia: {alt.licencia}.
        </p>
        <Link
          href={`/alternativas/${hubs[0]?.slug ?? "notion"}/${alt.slug}`}
          className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
        >
          Ver la ficha completa de {alt.nombre}
        </Link>
      </section>

      <Faq items={faq} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Alternativas a ${alt.nombre}`,
          numberOfItems: hermanos.length,
          itemListElement: hermanos.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "SoftwareApplication",
              name: a.nombre,
              url: a.url,
              description: a.tagline,
              license: a.licencia,
              applicationCategory: hubs[0]?.categoria,
              operatingSystem: "Linux",
            },
          })),
          url: `${site.url}/herramientas/${alt.slug}`,
        }}
      />
    </div>
  );
}
