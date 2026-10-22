import Link from "next/link";
import type { Alternative } from "@/lib/types";
import { costLabels, difficultyLabels, licenseLabels } from "@/lib/queries";
import { ToolIcon } from "@/components/tool-icon";

const licenseStyles: Record<Alternative["licenciaTipo"], string> = {
  "open-source": "border-accent/40 text-accent bg-accent-soft/40",
  "source-available": "border-amber-500/40 text-amber-600 bg-amber-500/10",
  freeware: "border-sky-500/40 text-sky-600 bg-sky-500/10",
  propietario: "border-rose-500/40 text-rose-600 bg-rose-500/10",
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
  return (
    <article className="card-hover rounded-lg border border-border bg-panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <ToolIcon slug={alternative.slug} nombre={alternative.nombre} />
          <div className="min-w-0">
          <h3 className="text-lg font-semibold">
            {productSlug ? (
              <Link
                href={`/alternativas/${productSlug}/${alternative.slug}`}
                className="hover:text-accent"
              >
                {alternative.nombre}
              </Link>
            ) : (
              alternative.nombre
            )}
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

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-muted">Instalación</dt>
          <dd className="font-medium">
            {difficultyLabels[alternative.dificultad]}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Coste</dt>
          <dd className="font-medium">{costLabels[alternative.coste]}</dd>
        </div>
        <div>
          <dt className="text-muted">Licencia</dt>
          <dd className="font-medium">{licenseLabels[alternative.licenciaTipo]}</dd>
        </div>
        <div>
          <dt className="text-muted">Docker</dt>
          <dd className="font-medium">
            {alternative.dockerOficial ? "Oficial" : "No oficial"}
          </dd>
        </div>
      </dl>

      <ul className="mt-4 space-y-1.5 text-sm text-muted">
        {alternative.highlights.slice(0, 3).map((h) => (
          <li key={h} className="flex gap-2">
            <span aria-hidden="true" className="text-accent">
              +
            </span>
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {productSlug ? (
          <Link
            href={`/alternativas/${productSlug}/${alternative.slug}`}
            className="text-sm font-medium text-accent hover:underline"
          >
            Ver ficha completa
          </Link>
        ) : (
          <Link
            href={`/alternativas/${alternative.sustituye[0]}/${alternative.slug}`}
            className="text-sm font-medium text-accent hover:underline"
          >
            Ver ficha completa
          </Link>
        )}
        <a
          href={alternative.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted hover:text-fg"
        >
          Sitio oficial
        </a>
        {productName ? (
          <span className="text-xs text-muted">Sustituye a {productName}</span>
        ) : null}
      </div>
    </article>
  );
}
