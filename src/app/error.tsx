"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Algo ha fallado</h1>
      <p className="mt-4 text-lg text-muted">
        Ha ocurrido un error al cargar esta página. Puedes reintentarlo o
        volver al inicio.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-fg hover:bg-panel"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
