import { getAlternatives, getGuides, getProducts } from "@/lib/queries";
import { site } from "@/lib/site";

function escapar(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const productos = getProducts();
  const guias = getGuides();
  const herramientas = getAlternatives(
    productos.flatMap((p) => p.alternativas),
  );

  const items = [
    ...guias.map((g) => ({
      titulo: g.titulo,
      descripcion: g.descripcion,
      link: `/comparativas/${g.slug}`,
      fecha: g.fecha,
      categoria: "Comparativa",
    })),
    ...herramientas.map((a) => {
      const producto = productos.find((p) => p.alternativas.includes(a.slug));
      return {
        titulo: `${a.nombre}: alternativa a ${producto?.nombre ?? "SaaS"}`,
        descripcion: a.tagline,
        link: `/alternativas/${a.sustituye[0]}/${a.slug}`,
        fecha: a.verificadoEn,
        categoria: "Ficha",
      };
    }),
  ].sort((a, b) => b.fecha.localeCompare(a.fecha));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapar(site.nombre)}</title>
    <link>${site.url}</link>
    <description>${escapar(site.descripcion)}</description>
    <language>es</language>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (i) => `    <item>
      <title>${escapar(i.titulo)}</title>
      <link>${site.url}${i.link}</link>
      <guid isPermaLink="true">${site.url}${i.link}</guid>
      <description>${escapar(i.descripcion)}</description>
      <category>${escapar(i.categoria)}</category>
      <pubDate>${new Date(`${i.fecha}T09:00:00Z`).toUTCString()}</pubDate>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
