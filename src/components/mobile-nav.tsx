"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

export function MobileNav() {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        className="rounded-md border border-border px-2.5 py-1.5 text-sm text-muted hover:text-fg"
      >
        <span aria-hidden="true">{abierto ? "✕" : "☰"}</span>
      </button>

      {abierto ? (
        <div
          id="menu-movil"
          className="fixed inset-x-0 top-[57px] z-40 border-b border-border bg-surface px-4 py-4 shadow-lg"
        >
          <nav aria-label="Menú principal">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setAbierto(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-fg hover:bg-panel"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/alternativas"
                  onClick={() => setAbierto(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-fg hover:bg-panel"
                >
                  Todas las herramientas
                </Link>
              </li>
              <li>
                <Link
                  href="/colabora"
                  onClick={() => setAbierto(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-fg hover:bg-panel"
                >
                  Añade tu proyecto
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
