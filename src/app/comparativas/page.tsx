import type { Metadata } from "next";
import Link from "next/link";
import { getGuides } from "@/lib/queries";
import { formatearFecha } from "@/lib/fechas";

export const metadata: Metadata = {
  title: "Comparativas",
  description:
    "Comparativas en profundidad entre alternativas autoalojadas: costes reales, requisitos, límites y cuándo la migración no compensa.",
  alternates: { canonical: "/comparativas" },
};

export default function ComparativasPage() {
  const guias = getGuides();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Comparativas
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted">
        Análisis largos entre dos alternativas autoalojadas, con los números de
        coste, los requisitos de servidor y los casos en los que migrar sale
        más caro de lo que parece.
      </p>

      <div className="mt-8 divide-y divide-border rounded-lg border border-border">
        {guias.map((g) => (
          <Link
            key={g.slug}
            href={`/comparativas/${g.slug}`}
            className="block p-6 hover:bg-panel"
          >
            <h2 className="text-lg font-semibold">{g.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {g.descripcion}
            </p>
            <p className="mt-3 text-xs text-muted">
              {g.lecturaMin} min de lectura · Actualizado el {formatearFecha(g.fecha)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
