import {
  getAlternatives,
  getCategories,
  getGuides,
  getProducts,
  getVerticals,
  difficultyLabels,
  licenseLabels,
} from "@/lib/queries";
import { site } from "@/lib/site";

/**
 * `llms.txt`: índice del sitio en texto plano, para modelos de lenguaje y
 * rastreadores.
 *
 * Es opcional y no cuesta nada. Se genera desde los mismos datos que las
 * páginas, así que no se queda viejo cuando se añade una alternativa nueva.
 * Lo que un modelo necesita aquí no es el texto de cada ficha, sino el mapa:
 * qué alternativas hay para cada producto, con su licencia y su dificultad.
 */
export const dynamic = "force-static";

export function GET() {
  const url = (path: string) => `${site.url}${path}`;
  const categories = getCategories();
  const verticals = getVerticals();
  const products = getProducts();
  const guides = getGuides();

  const lines: string[] = [
    `# ${site.nombre}`,
    "",
    `> ${site.descripcion}`,
    "",
    "Directorio en español de alternativas autoalojadas y de código abierto a las",
    "herramientas SaaS de cada día. Cada ficha trae requisitos de servidor, coste",
    "real, licencia y cuándo NO conviene migrar.",
    "",
    "## Categorías",
    "",
    ...categories.map(
      (c) => `- [${c.nombre}](${url(`/categorias/${c.slug}`)}): ${c.descripcion}`,
    ),
    "",
    "## Verticales",
    "",
    ...verticals.map(
      (v) => `- [${v.nombre}](${url(`/verticales/${v.slug}`)}): ${v.descripcion}`,
    ),
    "",
    "## Productos y sus alternativas",
    "",
  ];

  for (const p of products) {
    const alternativas = getAlternatives(p.alternativas);
    lines.push(`- [${p.nombre}](${url(`/alternativas/${p.slug}`)}): ${p.resumen}`);
    for (const a of alternativas) {
      lines.push(
        `  - [${a.nombre}](${url(`/alternativas/${p.slug}/${a.slug}`)}): ${a.tagline} ` +
          `(${licenseLabels[a.licenciaTipo]}, instalación ${difficultyLabels[a.dificultad].toLowerCase()})`,
      );
    }
  }

  lines.push(
    "",
    "## Comparativas",
    "",
    ...guides.map(
      (g) => `- [${g.titulo}](${url(`/comparativas/${g.slug}`)}): ${g.descripcion}`,
    ),
    "",
    "## Páginas",
    "",
    `- [Todas las herramientas](${url("/alternativas")}): el listado completo`,
    `- [Metodología](${url("/metodologia")}): cómo se verifica cada ficha`,
    `- [Sobre nosotros](${url("/acerca-de")}): quién mantiene el directorio`,
    `- [Contacto](${url("/contacto")}): ${site.email}`,
    `- [Novedades](${url("/novedades")}): qué se ha añadido y cuándo`,
    "",
    "## Legal",
    "",
    `- [Privacidad](${url("/privacidad")}): qué datos se tratan`,
    `- [Términos](${url("/terminos")}): condiciones de uso`,
    `- [Cookies](${url("/cookies")}): qué guarda el navegador`,
    "",
    "## Opcional",
    "",
    `- [Sitemap](${url("/sitemap.xml")}): la lista completa de páginas`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
