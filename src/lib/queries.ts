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
