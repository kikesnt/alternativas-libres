import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">
        Error 404
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">
        No encontramos esa página
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Puede que el enlace esté mal escrito o que la ficha haya cambiado de
        sitio. Desde el directorio puedes llegar a cualquier herramienta.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/alternativas"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
        >
          Ver el directorio
        </Link>
        <Link
          href="/buscar"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-fg hover:bg-panel"
        >
          Buscar
        </Link>
        <Link
          href="/categorias"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-fg hover:bg-panel"
        >
          Categorías
        </Link>
      </div>
    </div>
  );
}
