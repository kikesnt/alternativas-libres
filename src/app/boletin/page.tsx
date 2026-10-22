import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FormularioBoletin } from "@/components/formulario-boletin";
import { getGuides } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Boletín",
  description:
    "Un correo cada dos semanas con una migración real: qué herramienta autoalojada sustituye a cuál, cuánto cuesta y cuándo no compensa.",
  alternates: { canonical: "/boletin" },
};

const contenido = [
  {
    titulo: "Una migración real cada número",
    detalle:
      "No una lista de enlaces: una herramienta concreta, a qué SaaS sustituye, qué cuesta montarla y qué sale mal.",
  },
  {
    titulo: "Los números, no las opiniones",
    detalle:
      "Coste mensual real del servidor frente a la cuota del SaaS, con el cálculo a tres años cuando merece la pena.",
  },
  {
    titulo: "Avisos de abandono",
    detalle:
      "Cuando un proyecto se archiva o deja de recibir mantenimiento, te lo decimos por correo el día que lo detectamos.",
  },
  {
    titulo: "Acceso anticipado a las comparativas",
    detalle:
      "Las comparativas largas se publican en el directorio, pero el correo te avisa el mismo día.",
  },
];

export default function BoletinPage() {
  const guias = getGuides();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ name: "Boletín", href: "/boletin" }]} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        El boletín
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">
        Un correo cada dos semanas con una migración bien explicada. Es la
        forma de recibir el directorio sin depender de los algoritmos y sin
        que nadie tenga que pagar por los anuncios.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-panel p-6">
        <FormularioBoletin variante="bloque" />
      </div>

      <h2 className="mt-10 text-2xl font-semibold">Qué incluye</h2>
      <ul className="mt-4 space-y-4">
        {contenido.map((c) => (
          <li key={c.titulo}>
            <h3 className="font-semibold">{c.titulo}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {c.detalle}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">
        Los últimos números publicados
      </h2>
      <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
        {guias.slice(0, 5).map((g) => (
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

      <p className="mt-8 text-sm text-muted">
        También puedes seguir las novedades por{" "}
        <a href="/feed.xml" className="text-accent hover:underline">
          RSS
        </a>
        , sin darte de alta en nada.
      </p>
    </div>
  );
}
