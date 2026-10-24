"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NavLinks } from "@/components/nav-links";

const secundarios = [
  { href: "/novedades", label: "Novedades" },
  { href: "/boletin", label: "Boletín" },
  { href: "/colabora", label: "Añade tu proyecto" },
] as const;

export function MobileNav() {
  const [abierto, setAbierto] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;

    document.body.style.overflow = "hidden";

    const cerrar = () => setAbierto(false);
    const alPulsar = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const enfocables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!enfocables || enfocables.length === 0) return;

      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];

      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", alPulsar);
    window.addEventListener("popstate", cerrar);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", alPulsar);
      window.removeEventListener("popstate", cerrar);
    };
  }, [abierto]);

  return (
    <div className="lg:hidden">
      <button
        ref={botonRef}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-panel hover:text-fg"
      >
        {abierto ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <path d="M3 5.5h14M3 10h14M3 14.5h14" />
          </svg>
        )}
      </button>

      {abierto ? (
        <>
          <div
            aria-hidden="true"
            onClick={() => setAbierto(false)}
            className="fixed inset-0 top-14 z-30 bg-black/20 backdrop-blur-[1px]"
          />
          <div
            ref={panelRef}
            id="menu-movil"
            className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-border bg-surface px-4 py-4 shadow-xl"
          >
            <nav aria-label="Menú principal" className="flex flex-col gap-1">
              <NavLinks variant="mobile" onNavigate={() => setAbierto(false)} />
            </nav>

            <div className="mt-4 border-t border-border pt-4">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Más
              </p>
              <ul className="space-y-1">
                {secundarios.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setAbierto(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-panel"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
