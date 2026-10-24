import Link from "next/link";
import type { Alternative } from "@/lib/types";
import { costLabels, difficultyLabels, licenseLabels } from "@/lib/queries";
import { formatearFechaCorta } from "@/lib/fechas";
import { ToolIcon } from "@/components/tool-icon";
import { actividad } from "@/lib/data/actividad";

const licenseStyles: Record<Alternative["licenciaTipo"], string> = {
  "open-source": "border-accent/40 text-accent bg-accent-soft/40",
  "source-available": "border-amber-500/40 bg-amber-500/10 lic-source",
  freeware: "border-sky-500/40 bg-sky-500/10 lic-free",
  propietario: "border-rose-500/40 bg-rose-500/10 lic-prop",
};

export function LicenseBadge({
  type,
  name,
}: {
  type: Alternative["licenciaTipo"];
  name: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${licenseStyles[type]}`}
      title={licenseLabels[type]}
    >
      {name}
    </span>
  );
}

export function AlternativeCard({
  alternative,
  productSlug,
  productName,
}: {
  alternative: Alternative;
  productSlug?: string;
  productName?: string;
}) {
  const href = productSlug
    ? `/alternativas/${productSlug}/${alternative.slug}`
    : `/alternativas/${alternative.sustituye[0]}/${alternative.slug}`;

  const datos = [
    {
      label: "Instalación",
      value: difficultyLabels[alternative.dificultad],
    },
    { label: "Coste", value: costLabels[alternative.coste] },
    { label: "Licencia", value: licenseLabels[alternative.licenciaTipo] },
    {
      label: "Docker",
      value: alternative.dockerOficial ? "Oficial" : "No oficial",
    },
    {
      label: "Actividad",
      value: actividad[alternative.slug]
        ? formatearFechaCorta(actividad[alternative.slug])
        : "Sin repo",
    },
  ];

  return (
    <article className="card-hover flex h-full flex-col rounded-lg border border-border bg-panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <ToolIcon slug={alternative.slug} nombre={alternative.nombre} />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-snug">
              <Link href={href} className="hover:text-accent">
                {alternative.nombre}
              </Link>
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {alternative.tagline}
            </p>
          </div>
        </div>
        <LicenseBadge
          type={alternative.licenciaTipo}
          name={alternative.licencia}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 rounded-md border border-border/70 bg-surface/70 p-3 text-xs sm:grid-cols-3 xl:grid-cols-5">
        {datos.map((dato) => (
          <div key={dato.label}>
            <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">
              {dato.label}
            </dt>
            <dd className="mt-0.5 font-medium text-fg">{dato.value}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-4 space-y-1.5 text-sm text-muted">
        {alternative.highlights.slice(0, 3).map((h) => (
          <li key={h} className="flex gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-1 h-3.5 w-3.5 shrink-0 text-accent"
            >
              <path d="m4 10.5 3.5 3.5L16 5.5" />
            </svg>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-sm">
        <Link
          href={href}
          aria-label={`Ver ficha completa de ${alternative.nombre}`}
          className="font-medium text-accent hover:underline"
        >
          Ver ficha completa
        </Link>
        <a
          href={alternative.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Sitio oficial de ${alternative.nombre} (se abre en una pestaña nueva)`}
          className="inline-flex items-center gap-1 text-muted hover:text-fg"
        >
          Sitio oficial
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M8 4h8v8M16 4 7 13M4 8v8h8" />
          </svg>
        </a>
        {productName ? (
          <span className="text-xs text-muted">Sustituye a {productName}</span>
        ) : null}
      </div>
    </article>
  );
}
