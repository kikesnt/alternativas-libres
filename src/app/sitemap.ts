import type { MetadataRoute } from "next";
import {
  getAlternatives,
  getCategories,
  getGuides,
  getProducts,
  getVerticals,
} from "@/lib/queries";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const productos = getProducts();
  const guias = getGuides();
  const herramientas = getAlternatives(
    productos.flatMap((p) => p.alternativas),
  );

  const ahora = new Date();

  const fijas: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: "daily", priority: 1, lastModified: ahora },
    {
      url: `${site.url}/alternativas`,
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: ahora,
    },
    {
      url: `${site.url}/categorias`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: ahora,
    },
    {
      url: `${site.url}/verticales`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: ahora,
    },
    {
      url: `${site.url}/comparativas`,
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: ahora,
    },
    {
      url: `${site.url}/herramientas`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: ahora,
    },
    {
      url: `${site.url}/novedades`,
      changeFrequency: "daily",
      priority: 0.7,
      lastModified: ahora,
    },
    {
      url: `${site.url}/metodologia`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: ahora,
    },
    {
      url: `${site.url}/boletin`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: ahora,
    },
    {
      url: `${site.url}/colabora`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: ahora,
    },
    {
      url: `${site.url}/acerca-de`,
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: ahora,
    },
    {
      url: `${site.url}/anuncios`,
      changeFrequency: "monthly",
      priority: 0.4,
      lastModified: ahora,
    },
    {
      url: `${site.url}/contacto`,
      changeFrequency: "yearly",
      priority: 0.4,
      lastModified: ahora,
    },
    {
      url: `${site.url}/privacidad`,
      changeFrequency: "yearly",
      priority: 0.2,
      lastModified: ahora,
    },
    {
      url: `${site.url}/cookies`,
      changeFrequency: "yearly",
      priority: 0.2,
      lastModified: ahora,
    },
    {
      url: `${site.url}/terminos`,
      changeFrequency: "yearly",
      priority: 0.2,
      lastModified: ahora,
    },
  ];

  const porProducto: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${site.url}/alternativas/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
    lastModified: ahora,
  }));

  const porHerramienta: MetadataRoute.Sitemap = productos.flatMap((producto) =>
    producto.alternativas
      .map((slug) => herramientas.find((a) => a.slug === slug))
      .filter((a): a is (typeof herramientas)[number] => Boolean(a))
      .map((a) => ({
        url: `${site.url}/alternativas/${producto.slug}/${a.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        lastModified: new Date(`${a.verificadoEn}T00:00:00Z`),
      })),
  );

  const porCategoria: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: `${site.url}/categorias/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: ahora,
  }));

  const porVertical: MetadataRoute.Sitemap = getVerticals().map((v) => ({
    url: `${site.url}/verticales/${v.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: ahora,
  }));

  const porPaginaHerramienta: MetadataRoute.Sitemap = herramientas.map((a) => ({
    url: `${site.url}/herramientas/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: new Date(`${a.verificadoEn}T00:00:00Z`),
  }));

  const porGuia: MetadataRoute.Sitemap = guias.map((g) => ({
    url: `${site.url}/comparativas/${g.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: new Date(`${g.fecha}T00:00:00Z`),
  }));

  return [
    ...fijas,
    ...porProducto,
    ...porHerramienta,
    ...porCategoria,
    ...porVertical,
    ...porHerramienta,
    ...porPaginaHerramienta,
    ...porGuia,
  ];
}
