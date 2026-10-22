import type { Metadata } from "next";
import Link from "next/link";
import { getVerticals } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Por tipo de equipo",
  description:
    "Alternativas autoalojadas seleccionadas según el tipo de equipo:Consultorías, agencias, desarrolladores, educación, autónomos, privacidad y ecommerce.",
  alternates: { canonical: "/verticales" },
};

export default function VerticalesPage() {
  const verticales = getVerticals();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Por tipo de equipo
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted">
        La misma herramienta no es la mejor para todos. Aquí tienes la
        selección según el tamaño del equipo, el sector y el nivel técnico.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {verticales.map((v) => (
          <Link
            key={v.slug}
            href={`/verticales/${v.slug}`}
            className="card-hover rounded-lg border border-border bg-panel p-6"
          >
            <h2 className="text-lg font-semibold">{v.nombre}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {v.descripcion}
            </p>
            <p className="mt-3 text-xs text-muted">
              Ejemplos: {v.ejemplos.join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
