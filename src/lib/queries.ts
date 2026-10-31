import { categories, categoryBySlug } from "@/lib/data/categories";
import { products, productBySlug } from "@/lib/data/products";
import { alternatives, alternativeBySlug } from "@/lib/data/alternatives";
import { verticals, verticalBySlug } from "@/lib/data/verticals";
import { guides, guideBySlug } from "@/lib/data/guias";
import type { Alternative, Product, Vertical } from "@/lib/types";

export function getProducts(): Product[] {
  return [...products].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function getProduct(slug: string): Product | undefined {
  return productBySlug.get(slug);
}

export function getAlternative(slug: string): Alternative | undefined {
  return alternativeBySlug.get(slug);
}

/**
 * Producto principal de una alternativa: el primero de su lista `sustituye`
 * que tenga pagina de producto. Es la ficha que merece ser la canonica de
 * /herramientas/{slug}.
 *
 * 51 de las 58 herramientas tienen una sola ficha, asi que la eleccion es
 * obvia. Las otras 7 (affine, appflowy, forgejo, mautic, nextcloud,
 * nextcloud-talk y teable) aparecen en dos o tres productos: se elige el
 * primero que lista la propia herramienta, que es el orden que usa el dato.
 */
export function getProductoPrincipalDeAlternativa(
  slug: string,
): string | undefined {
  const alt = getAlternative(slug);
  if (!alt) return undefined;
  const productos = getProducts();
  for (const producto of alt.sustituye) {
    const p = productos.find((x) => x.slug === producto);
    if (p && p.alternativas.includes(slug)) return p.slug;
  }
  return productos.find((p) => p.alternativas.includes(slug))?.slug;
}

export function getAlternatives(slugs: string[]): Alternative[] {
  const unicos = new Map<string, Alternative>();
  for (const slug of slugs) {
    const alt = alternativeBySlug.get(slug);
    if (alt && !unicos.has(slug)) unicos.set(slug, alt);
  }
  return [...unicos.values()];
}

export function getAlternativesByProduct(product: Product): Alternative[] {
  return getAlternatives(product.alternativas);
}

export function getAlternativesByCategory(slug: string): Alternative[] {
  const cat = categoryBySlug.get(slug);
  if (!cat) return [];
  const productSlugs = products
    .filter((p) => p.categoria === slug)
    .map((p) => p.slug);
  return alternatives.filter((a) =>
    a.sustituye.some((s) => productSlugs.includes(s)),
  );
}

export function getAlternativesByVertical(slug: string): Alternative[] {
  return alternatives.filter((a) => a.mejorPara.includes(slug));
}

export function getProductsByCategory(slug: string): Product[] {
  return getProducts().filter((p) => p.categoria === slug);
}

export function getProductsByVertical(slug: string): Product[] {
  const altSlugs = getAlternativesByVertical(slug).map((a) => a.slug);
  return getProducts().filter((p) =>
    p.alternativas.some((a) => altSlugs.includes(a)),
  );
}

export function getCategories() {
  return categories;
}

export function getCategory(slug: string) {
  return categoryBySlug.get(slug);
}

export function getVerticals(): Vertical[] {
  return verticals;
}

export function getVertical(slug: string) {
  return verticalBySlug.get(slug);
}

export function getGuides() {
  return [...guides].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function getGuide(slug: string) {
  return guideBySlug.get(slug);
}

export function getGuidesForProduct(slug: string) {
  return guides.filter((g) => g.producto === slug);
}

export function getResumenDirectorio() {
  const productos = getProducts();
  const alternativas = getAlternatives(
    productos.flatMap((p) => p.alternativas),
  );
  const guias = getGuides();

  const ultimaRevision =
    [
      ...productos.map((p) => p.verificadoEn),
      ...alternativas.map((a) => a.verificadoEn),
      ...guias.map((g) => g.fecha),
    ]
      .filter(Boolean)
      .sort()
      .at(-1) ?? "";

  return {
    productos,
    alternativas,
    guias,
    totalAlternativas: alternativas.length,
    totalGuias: guias.length,
    ultimaRevision,
  };
}

export const licenseLabels: Record<
  Alternative["licenciaTipo"],
  string
> = {
  "open-source": "Código abierto",
  "source-available": "Fuente disponible",
  freeware: "Gratuito",
  propietario: "Propietario",
};

export const difficultyLabels: Record<number, string> = {
  1: "Trivial",
  2: "Sencillo",
  3: "Intermedio",
  4: "Avanzado",
  5: "Experto",
};

export const costLabels: Record<Alternative["coste"], string> = {
  gratis: "Gratis",
  freemium: "Freemium",
  "pago-unico": "Pago único",
  suscripcion: "Suscripción",
  "modelo-propio": "Modelo propio",
};
