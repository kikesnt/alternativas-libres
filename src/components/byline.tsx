import Link from "next/link";
import { site } from "@/lib/site";
import { formatearFecha } from "@/lib/fechas";

export function Byline({
  fecha,
  etiqueta = "Actualizado",
}: {
  fecha: string;
  etiqueta?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-fg"
        >
          EM
        </span>
        <span>
          Por{" "}
          <Link
            href="/acerca-de"
            className="font-medium text-fg hover:text-accent hover:underline"
          >
            {site.autor}
          </Link>
        </span>
      </span>
      <span aria-hidden="true">·</span>
      <span>
        {etiqueta} el {formatearFecha(fecha)}
      </span>
      <span aria-hidden="true">·</span>
      <Link href="/metodologia" className="text-accent hover:underline">
        Cómo verificamos los datos
      </Link>
    </div>
  );
}
