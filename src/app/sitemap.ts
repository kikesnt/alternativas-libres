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
  const alternativaPorSlug = new Map(herramientas.map((a) => [a.slug, a]));

  const fechas = [
    ...productos.map((p) => p.verificadoEn),
    ...herramientas.map((a) => a.verificadoEn),
    ...guias.map((g) => g.fecha),
  ]
    .filter(Boolean)
    .sort();

  const ultimaRevision = new Date(
    `${fechas.at(-1) ?? new Date().toISOString().slice(0, 10)}T00:00:00Z`,
  );

  const fechaDeProducto = (producto: (typeof productos)[number]) => {
    const fechasProducto = [
      producto.verificadoEn,
      ...producto.alternativas.map(
        (slug) => alternativaPorSlug.get(slug)?.verificadoEn,
      ),
    ]
      .filter((fecha): fecha is string => Boolean(fecha))
      .sort();

    return new Date(
      `${fechasProducto.at(-1) ?? producto.verificadoEn}T00:00:00Z`,
    );
  };

    const fijas: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: "daily", priority: 1, lastModified: ultimaRevision },
    {
      url: `${site.url}/alternativas`,
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/categorias`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/verticales`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/comparativas`,
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/herramientas`,
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/novedades`,
      changeFrequency: "daily",
      priority: 0.7,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/metodologia`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/boletin`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/colabora`,
      changeFrequency: "monthly",
      priority: 0.6,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/acerca-de`,
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/anuncios`,
      changeFrequency: "monthly",
      priority: 0.4,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/contacto`,
      changeFrequency: "yearly",
      priority: 0.4,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/privacidad`,
      changeFrequency: "yearly",
      priority: 0.2,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/cookies`,
      changeFrequency: "yearly",
      priority: 0.2,
      lastModified: ultimaRevision,
    },
    {
      url: `${site.url}/terminos`,
      changeFrequency: "yearly",
      priority: 0.2,
      lastModified: ultimaRevision,
    },
  ];

  const porProducto: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${site.url}/alternativas/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
    lastModified: fechaDeProducto(p),
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
    lastModified: ultimaRevision,
  }));

  const porVertical: MetadataRoute.Sitemap = getVerticals().map((v) => ({
    url: `${site.url}/verticales/${v.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: ultimaRevision,
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
    ...porPaginaHerramienta,
    ...porCategoria,
    ...porVertical,
    ...porGuia,
  ];
}
