import { alternatives } from "@/lib/data/alternatives";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { verticals } from "@/lib/data/verticals";

export function assertDataIntegrity() {
  const altSlugs = new Set(alternatives.map((a) => a.slug));
  const prodSlugs = new Set(products.map((p) => p.slug));
  const catSlugs = new Set(categories.map((c) => c.slug));
  const vertSlugs = new Set(verticals.map((v) => v.slug));
  const errors: string[] = [];

  for (const alt of alternatives) {
    if (altSlugs.size !== alternatives.length) {
      errors.push(`slug duplicado en alternativas: ${alt.slug}`);
    }
    for (const target of alt.sustituye) {
      if (!prodSlugs.has(target)) {
        errors.push(`${alt.slug} sustituye a un producto inexistente: ${target}`);
      }
    }
    for (const v of alt.mejorPara) {
      if (!vertSlugs.has(v)) {
        errors.push(`${alt.slug} referencia una vertical inexistente: ${v}`);
      }
    }
  }

  for (const product of products) {
    if (product.alternativas.length === 0) {
      errors.push(`${product.slug} no tiene alternativas`);
    }
    for (const a of product.alternativas) {
      if (!altSlugs.has(a)) {
        errors.push(`${product.slug} referencia una alternativa inexistente: ${a}`);
      }
    }
    if (!catSlugs.has(product.categoria)) {
      errors.push(`${product.slug} usa una categoría inexistente: ${product.categoria}`);
    }
  }

  for (const alt of alternatives) {
    const listed = products.some((p) => p.alternativas.includes(alt.slug));
    if (!listed) {
      errors.push(`${alt.slug} no aparece en ningún producto`);
    }
    for (const target of alt.sustituye) {
      const product = products.find((p) => p.slug === target);
      if (product && !product.alternativas.includes(alt.slug)) {
        errors.push(
          `${alt.slug} declara sustituir a ${target} pero no está en su lista de alternativas`,
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Integridad de datos rota:\n${errors.map((e) => `- ${e}`).join("\n")}`,
    );
  }
}
