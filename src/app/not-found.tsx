import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-lg text-muted">
        Esta página no existe o ha cambiado de sitio.
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
      </div>
    </div>
  );
}
