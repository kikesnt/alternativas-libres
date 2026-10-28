"use client";

import { useSearchParams } from "next/navigation";
import { Buscador, type Resultado } from "@/components/buscador";

/**
 * El buscador lee la consulta de la URL en el navegador.
 *
 * Con `output: "export"` la página no puede leer `searchParams` en el
 * servidor: eso la haría dinámica y no se podría exportar. La alternativa es
 * leerlos en el cliente, que además mejora la experiencia: al escribir en el
 * buscador, la URL se actualiza y se puede compartir o recargar.
 *
 * Por eso va dentro de un <Suspense>: `useSearchParams` en una página
 * estática necesita un límite de suspense alrededor.
 */
export function BuscadorCliente({ indice }: { indice: Resultado[] }) {
  const params = useSearchParams();
  const consulta = params.get("q") ?? "";
  return <Buscador indice={indice} consultaInicial={consulta} />;
}
