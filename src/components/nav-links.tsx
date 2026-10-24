"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

function estaActivo(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const estilos = {
  header:
    "rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-panel hover:text-fg",
  mobile:
    "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-panel",
} as const;

const estilosActivos = {
  header: "bg-accent-soft/60 font-medium text-accent",
  mobile: "bg-accent-soft/50 text-accent",
} as const;

export function NavLinks({
  variant = "header",
  onNavigate,
}: {
  variant?: keyof typeof estilos;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {nav.map((item) => {
        const activo = estaActivo(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={activo ? "page" : undefined}
            className={`${estilos[variant]} ${
              activo ? estilosActivos[variant] : ""
            }`}
          >
            {item.label}
            {variant === "mobile" ? (
              <span
                aria-hidden="true"
                className={`text-xs ${activo ? "opacity-100" : "opacity-0"}`}
              >
                →
              </span>
            ) : null}
          </Link>
        );
      })}
    </>
  );
}
