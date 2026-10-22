import Link from "next/link";
import { nav, site } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-block h-6 w-6 rounded bg-accent" />
          <span>{site.nombre}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-fg">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/buscar"
            className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:text-fg"
          >
            <span className="hidden sm:inline">Buscar</span>
            <span className="sm:hidden" aria-hidden="true">
              ⌕
            </span>
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
