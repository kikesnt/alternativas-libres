import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Faq } from "@/components/faq";
import { AffiliateLink } from "@/components/affiliate-link";
import { JsonLd } from "@/components/json-ld";
import { LicenseBadge } from "@/components/alternative-card";
import { ToolIcon } from "@/components/tool-icon";
import { Byline } from "@/components/byline";
import { actividad } from "@/lib/data/actividad";
import {
  costLabels,
  difficultyLabels,
  getAlternative,
  getAlternatives,
  getGuidesForProduct,
  getProduct,
  getProducts,
  getVertical,
  licenseLabels,
} from "@/lib/queries";
import { site } from "@/lib/site";
import { recortar } from "@/lib/seo";
import { formatearFecha } from "@/lib/fechas";

type Params = { params: Promise<{ producto: string; alternativa: string }> };

export function generateStaticParams() {
  return getProducts().flatMap((product) =>
    product.alternativas.map((alt) => ({
      producto: product.slug,
      alternativa: alt,
    })),
  );
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { producto, alternativa } = await params;
  const product = getProduct(producto);
  const alt = getAlternative(alternativa);
  if (!product || !alt) return {};

  const title = `${alt.nombre}: alternativa a ${product.nombre}`;
  const description = recortar(
    `${alt.nombre} es una alternativa a ${product.nombre}. ${alt.tagline}`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/alternativas/${product.slug}/${alt.slug}` },
  };
}

// Sin la frontera de Suspense a proposito.
//
// En la exportacion estatica, una frontera de Suspense obliga a Next.js a
// emitir el fallback en el HTML y a mandar el contenido despues, en el payload
// de React. El resultado era que el elemento main contenia un "Cargando..."
// y el texto real de la ficha salia despues del cierre de footer: un rastreador
// leia un placeholder donde deberia estar el contenido principal.
//
// params es una Promise, pero se resuelve en la propia pagina: con
// generateStaticParams las rutas son conocidas en el build, asi que no hace
// falta ninguna frontera de streaming.
export default async function AlternativaPage({ params }: Params) {
  const { producto, alternativa } = await params;
  return <Contenido producto={producto} alternativa={alternativa} />;
}

async function Contenido({
  producto,
  alternativa,
}: {
  producto: string;
  alternativa: string;
}) {
  const product = getProduct(producto);
  const alt = getAlternative(alternativa);
  if (!product || !alt) notFound();

  const hermanas = getAlternatives(product.alternativas).filter(
    (a) => a.slug !== alt.slug,
  );
  const guias = getGuidesForProduct(product.slug);
  const verticales = alt.mejorPara
    .map((v) => getVertical(v))
    .filter((v) => v !== undefined);
  const otrosProductos = alt.sustituye
    .filter((s) => s !== product.slug)
    .map((s) => getProduct(s))
    .filter((p) => p !== undefined);

  const faq = [
    {
      q: `¿Cómo se instala ${alt.nombre}?`,
      a: alt.dockerOficial
        ? `Existe imagen oficial de Docker, así que el camino rápido es levantar el compose del proyecto y configurar las variables de entorno. En el caso de ${alt.nombre}, la referencia oficial de despliegue está en su repositorio.`
        : `No hay imagen de Docker oficial, así que la instalación pasa por el empaquetado nativo o por una imagen de la comunidad. Revisa las incidencias del repositorio antes de decidir: en ${alt.nombre} esto suele ser el punto de fricción.`,
    },
    {
      q: `¿Qué recursos necesita ${alt.nombre}?`,
      a: `La referencia es ${alt.recursosMinimos}. Con una VPS de 4 vCPU y 8 GB de RAM ($20 al mes en proveedores como Hetzner o DigitalOcean) vas sobrado para un equipo pequeño.`,
    },
    {
      q: `¿Puedo usar ${alt.nombre} en un servidor compartido?`,
      a: `Solo si el proyecto lo admite. Comprueba los requisitos de la ficha: las instalaciones con base de datos y procesos en segundo plano suelen necesitar un servidor con control total. Un alojamiento compartido con PHP puede bastar para casos concretos.`,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Breadcrumbs
        items={[
          { name: "Alternativas", href: "/alternativas" },
          {
            name: product.nombre,
            href: `/alternativas/${product.slug}`,
          },
          { name: alt.nombre, href: `/alternativas/${product.slug}/${alt.slug}` },
        ]}
      />

      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <ToolIcon slug={alt.slug} nombre={alt.nombre} size={52} />
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {alt.nombre}
          </h1>
          <LicenseBadge type={alt.licenciaTipo} name={alt.licencia} />
        </div>
        <p className="mt-3 text-lg leading-relaxed text-muted">{alt.tagline}</p>
        <p className="mt-2 text-sm text-muted">
          Alternativa autoalojada a{" "}
          <Link
            href={`/alternativas/${product.slug}`}
            className="text-accent hover:underline"
          >
            {product.nombre}
          </Link>
          .
        </p>
        <div className="mt-4">
          <Byline fecha={alt.verificadoEn} />
        </div>
        {otrosProductos.length > 0 ? (
          <p className="mt-3 text-sm text-muted">
            {alt.nombre} también sustituye a{" "}
            {otrosProductos.map((o, i) => (
              <span key={o.slug}>
                {i > 0 ? " y " : ""}
                <Link
                  href={`/alternativas/${o.slug}/${alt.slug}`}
                  className="text-accent hover:underline"
                >
                  {o.nombre}
                </Link>
              </span>
            ))}
            .
          </p>
        ) : null}
      </div>

      <dl className="mt-8 grid gap-4 rounded-lg border border-border bg-panel p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">
            Licencia
          </dt>
          <dd className="mt-1 font-medium">
            {licenseLabels[alt.licenciaTipo]} ({alt.licencia})
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">
            Instalación
          </dt>
          <dd className="mt-1 font-medium">
            {difficultyLabels[alt.dificultad]} ·{" "}
            {alt.dockerOficial ? "Docker oficial" : "Docker no oficial"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">
            Recursos mínimos
          </dt>
          <dd className="mt-1 font-medium">{alt.recursosMinimos}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">
            Actividad
          </dt>
          <dd className="mt-1 font-medium">
            {actividad[alt.slug] ? (
              <>
                Último commit el{" "}
                {formatearFecha(actividad[alt.slug])}
              </>
            ) : (
              <span className="text-muted">Sin repositorio público</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted">Coste</dt>
          <dd className="mt-1 font-medium">
            {costLabels[alt.coste]}
            <span className="block text-sm font-normal text-muted">
              {alt.costeNota}
            </span>
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/herramientas/${alt.slug}`}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-fg hover:bg-panel"
        >
          Alternativas a {alt.nombre}
        </Link>
        <AffiliateLink
          alternative={alt}
          label="Ir al sitio oficial"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
        />
        {alt.repo ? (
          <a
            href={alt.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-fg hover:bg-panel"
          >
            Código fuente
          </a>
        ) : null}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold">Puntos fuertes</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            {alt.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span aria-hidden="true" className="text-accent">
                  +
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Contras y riesgos</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            {alt.contras.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden="true" className="text-amber-500">
                  !
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Stack y despliegue</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {alt.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-muted"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {alt.requiereDevops
            ? "Necesita alguien que sepa de administración de servidores: actualizaciones, copias de seguridad, certificados y monitorización."
            : "Se puede instalar y mantener sin perfil de sistemas: la documentación oficial cubre el caso más común."}
        </p>
      </section>

      {verticales.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Recomendada para</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {verticales.map((v) => (
              <Link
                key={v.slug}
                href={`/verticales/${v.slug}`}
                className="rounded-full border border-accent/40 bg-accent-soft/40 px-3 py-1 text-xs text-accent hover:opacity-80"
              >
                {v.nombre}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {alt.notas ? (
        <p className="mt-8 rounded-lg border border-warn-border bg-warn-bg p-4 text-sm text-warn-fg">
          <strong>Nota de revisión:</strong> {alt.notas}
        </p>
      ) : null}

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICULO ?? ""}
        className="mt-12"
        minHeight={100}
      />

      {guias.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Comparativas relacionadas</h2>
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

      {hermanas.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">
            Otras alternativas a {product.nombre}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {hermanas.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/alternativas/${product.slug}/${a.slug}`}
                  className="block rounded-lg border border-border bg-panel p-4 text-sm hover:border-accent"
                >
                  <span className="font-medium">{a.nombre}</span>
                  <span className="mt-1 block text-xs text-muted">
                    {a.tagline}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Faq items={faq} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: alt.nombre,
          url: alt.url,
          applicationCategory: product.categoria,
          operatingSystem: "Linux",
          description: alt.tagline,
          license: alt.licencia,
          softwareVersion: alt.verificadoEn,
          offers: {
            "@type": "Offer",
            price: alt.coste === "gratis" ? "0" : undefined,
            priceCurrency: "EUR",
          },
          mainEntityOfPage: `${site.url}/alternativas/${product.slug}/${alt.slug}`,
        }}
      />
    </div>
  );
}
