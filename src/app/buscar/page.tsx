import type { Metadata } from "next";
import { Suspense } from "react";
import { BuscadorCliente } from "@/components/buscador-cliente";
import { getAlternatives, getProducts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca entre las alternativas autoalojadas del directorio.",
  robots: { index: false, follow: true },
};

export default async function BuscarPage() {
  const products = getProducts();
  const alternativas = getAlternatives(
    products.flatMap((p) => p.alternativas),
  );

  const indice = [
    ...products.map((p) => ({
      tipo: "producto" as const,
      nombre: p.nombre,
      descripcion: p.resumen,
      href: `/alternativas/${p.slug}`,
      etiquetas: [p.categoria, p.vendedor],
    })),
    ...alternativas.map((a) => ({
      tipo: "alternativa" as const,
      nombre: a.nombre,
      descripcion: a.tagline,
      href: `/alternativas/${a.sustituye[0]}/${a.slug}`,
      etiquetas: [a.licencia, ...a.stack, ...a.mejorPara],
    })),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Buscar</h1>
      <div className="mt-6">
        <Suspense
          fallback={
            <p className="text-sm text-muted" role="status">
              Cargando el buscador…
            </p>
          }
        >
          <BuscadorCliente indice={indice} />
        </Suspense>
      </div>
    </div>
  );
}
