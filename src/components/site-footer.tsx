import Link from "next/link";
import { site } from "@/lib/site";
import { getCategories } from "@/lib/queries";
import { Logo } from "@/components/logo";

const year = new Date().getFullYear();

export function SiteFooter() {
  const categories = getCategories().slice(0, 6);

  return (
    <footer className="mt-20 border-t border-border bg-panel">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo texto={site.nombre} size={26} />
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Directorio de alternativas autoalojadas a herramientas SaaS. Datos
            revisados, requisitos reales y cuándo no conviene migrar.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Categorías</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categorias/${c.slug}`} className="hover:text-fg">
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">El directorio</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/alternativas" className="hover:text-fg">
                Todas las herramientas
              </Link>
            </li>
            <li>
              <Link href="/verticales" className="hover:text-fg">
                Por tipo de equipo
              </Link>
            </li>
            <li>
              <Link href="/comparativas" className="hover:text-fg">
                Comparativas
              </Link>
            </li>
            <li>
              <Link href="/novedades" className="hover:text-fg">
                Novedades y revisiones
              </Link>
            </li>
            <li>
              <Link href="/colabora" className="hover:text-fg">
                Añade tu proyecto
              </Link>
            </li>
            <li>
              <Link href="/metodologia" className="hover:text-fg">
                Metodología de verificación
              </Link>
            </li>
            <li>
              <Link href="/acerca-de" className="hover:text-fg">
                Cómo seleccionamos
              </Link>
            </li>
            <li>
              <a href="/feed.xml" className="hover:text-fg">
                RSS
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href="/privacidad" className="hover:text-fg">
                Privacidad
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="hover:text-fg">
                Cookies
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="hover:text-fg">
                Términos
              </Link>
            </li>
            <li>
              <Link href="/anuncios" className="hover:text-fg">
                Publicidad y afiliados
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-fg">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-muted">
          <p>
            {year} {site.nombre}. La información de licencias, precios y
            requisitos se revisa de forma periódica, pero no garantizamos que
            esté actualizada en cada momento. Verifica siempre los datos en la
            fuente oficial de cada proyecto antes de tomar una decisión.
          </p>
          <p className="mt-2">
            Este sitio participa en el programa de afiliados de Google
            Advertising y puede mostrar publicidad. No afectamos a las
            decisiones de edición de las fichas.
          </p>
        </div>
      </div>
    </footer>
  );
}
