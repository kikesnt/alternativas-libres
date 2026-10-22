import Link from "next/link";
import { costLabels, difficultyLabels, licenseLabels } from "@/lib/queries";
import type { Alternative } from "@/lib/types";

export function ComparisonTable({
  alternatives,
  productSlug,
}: {
  alternatives: Alternative[];
  productSlug: string;
}) {
  if (alternatives.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <caption className="sr-only">
          Comparativa de alternativas autoalojadas con licencia, dificultad de
          instalación, coste y requisitos de servidor
        </caption>
        <thead>
          <tr className="border-b border-border bg-panel text-left">
            <th scope="col" className="p-3 font-semibold">
              Herramienta
            </th>
            <th scope="col" className="p-3 font-semibold">
              Licencia
            </th>
            <th scope="col" className="p-3 font-semibold">
              Instalación
            </th>
            <th scope="col" className="p-3 font-semibold">
              Coste
            </th>
            <th scope="col" className="p-3 font-semibold">
              Docker
            </th>
            <th scope="col" className="p-3 font-semibold">
              Recursos mínimos
            </th>
          </tr>
        </thead>
        <tbody>
          {alternatives.map((a) => (
            <tr key={a.slug} className="border-b border-border align-top">
              <th scope="row" className="p-3 text-left font-medium">
                <Link
                  href={`/alternativas/${productSlug}/${a.slug}`}
                  className="hover:text-accent"
                >
                  {a.nombre}
                </Link>
              </th>
              <td className="p-3 text-muted">
                {licenseLabels[a.licenciaTipo]}
                <span className="block text-xs">{a.licencia}</span>
              </td>
              <td className="p-3 text-muted">{difficultyLabels[a.dificultad]}</td>
              <td className="p-3 text-muted">{costLabels[a.coste]}</td>
              <td className="p-3 text-muted">
                {a.dockerOficial ? "Oficial" : "No oficial"}
              </td>
              <td className="p-3 text-muted">{a.recursosMinimos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
