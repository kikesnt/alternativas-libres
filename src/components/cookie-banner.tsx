"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useConsent } from "@/components/consent-provider";
import type { ConsentValue } from "@/lib/types";

const opciones: { valor: ConsentValue; texto: string; destacado?: boolean }[] = [
  { valor: "all", texto: "Aceptar todo", destacado: true },
  { valor: "ads-only", texto: "Solo anuncios" },
  { valor: "none", texto: "Rechazar" },
];

const subscribe = () => () => {};
const mounted = () => true;
const serverMounted = () => false;

export function CookieBanner() {
  const { consent, grant } = useConsent();
  const isMounted = useSyncExternalStore(subscribe, mounted, serverMounted);

  if (!isMounted || consent !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-panel p-4 shadow-lg">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted">
          Usamos cookies de Google AdSense para mostrar publicidad y medir el
          tráfico. Puedes consentir solo con la publicidad, rechazarla o
          consultar la{" "}
          <Link href="/cookies" className="underline hover:text-fg">
            política de cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          {opciones.map((o) => (
            <button
              key={o.valor}
              type="button"
              onClick={() => grant(o.valor)}
              className={
                o.destacado
                  ? "rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
                  : "rounded-md border border-border px-3 py-2 text-sm text-fg hover:bg-surface"
              }
            >
              {o.texto}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
