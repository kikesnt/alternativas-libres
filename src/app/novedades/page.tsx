import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAlternatives, getGuides, getProducts } from "@/lib/queries";
import { site } from "@/lib/site";
import { formatearFecha } from "@/lib/fechas";

export const metadata: Metadata = {
  title: "Novedades del directorio",
  description:
    "Últimas fichas añadidas, comparativas publicadas y revisiones de datos del directorio de alternativas autoalojadas.",
  alternates: { canonical: "/novedades" },
};

export default function NovedadesPage() {
  const productos = getProducts();
  const guias = getGuides();
  const herramientas = getAlternatives(
    productos.flatMap((p) => p.alternativas),
  );

  const eventos = [
    ...guias.map((g) => ({
      tipo: "Comparativa",
      titulo: g.titulo,
      descripcion: g.descripcion,
      href: `/comparativas/${g.slug}`,
      fecha: g.fecha,
    })),
    ...herramientas.map((a) => {
      const producto = productos.find((p) => p.alternativas.includes(a.slug));
      return {
        tipo: "Ficha",
        titulo: `${a.nombre}, alternativa a ${producto?.nombre ?? "SaaS"}`,
        descripcion: a.tagline,
        href: `/alternativas/${a.sustituye[0]}/${a.slug}`,
        fecha: a.verificadoEn,
      };
    }),
  ].sort((a, b) => b.fecha.localeCompare(a.fecha));

  const porFecha = new Map<string, typeof eventos>();
  for (const e of eventos) {
    const lista = porFecha.get(e.fecha) ?? [];
    lista.push(e);
    porFecha.set(e.fecha, lista);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[{ name: "Novedades", href: "/novedades" }]}
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Novedades
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            Todo lo que se ha añadido o revisado en el directorio, con su
            fecha. Sirve para saber si los datos de una ficha están al día.
          </p>
        </div>
        <a
          href="/feed.xml"
          className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:text-fg"
        >
          Suscribirse por RSS
        </a>
      </div>

      <div className="mt-10 space-y-10">
        {[...porFecha.entries()].map(([fecha, lista]) => (
          <section key={fecha}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              {formatearFecha(fecha)}
            </h2>
            <ul className="mt-3 divide-y divide-border rounded-lg border border-border">
              {lista.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="block p-4 hover:bg-panel">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-accent-soft/50 px-2 py-0.5 text-[11px] uppercase tracking-wide text-accent">
                        {e.tipo}
                      </span>
                      <span className="font-medium">{e.titulo}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{e.descripcion}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted">
        Las revisiones de datos se pueden seguir en{" "}
        <Link href="/contacto" className="text-accent hover:underline">
          contacto
        </Link>
        . El autor del directorio es {site.autor}.
      </p>
    </div>
  );
}
