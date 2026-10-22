const base = process.argv[2] ?? "http://localhost:3000";

const esHtml = (ruta) => !/\.(css|js|mjs|json|ico|svg|png|jpg|jpeg|webp|xml|txt|webmanifest)$/i.test(ruta);

const vistos = new Set();
const cola = ["/"];
const rotas = [];
const sinCanonical = [];
const sinTitle = [];
const externas = new Set();

function normalizar(href) {
  const url = new URL(href, base);
  return url.pathname;
}

async function comprobar(ruta) {
  const res = await fetch(new URL(ruta, base), {
    redirect: "manual",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkChecker/1.0)" },
  });
  if (res.status >= 400) {
    rotas.push({ ruta, estado: res.status });
    return null;
  }
  const html = await res.text();
  if (esHtml(ruta) && !/<link[^>]+rel=["']canonical["']/i.test(html)) {
    sinCanonical.push(ruta);
  }
  if (esHtml(ruta) && !/<title>[^<]{10,}<\/title>/i.test(html)) {
    sinTitle.push(ruta);
  }
  return html;
}

while (cola.length > 0) {
  const ruta = cola.shift();
  if (vistos.has(ruta)) continue;
  vistos.add(ruta);

  let html;
  try {
    html = await comprobar(ruta);
  } catch {
    rotas.push({ ruta, estado: "ERROR" });
    continue;
  }
  if (!html) continue;

  for (const m of html.matchAll(/href=["']([^"']+)["']/g)) {
    const href = m[1];
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      continue;
    }
    if (/^https?:\/\//i.test(href)) {
      if (href.startsWith(base)) {
        const p = normalizar(href);
        if (!vistos.has(p)) cola.push(p);
      } else {
        externas.add(href);
      }
      continue;
    }
    const p = normalizar(href);
    if (!vistos.has(p)) cola.push(p);
  }
}

const sitemap = await fetch(new URL("/sitemap.xml", base)).then((r) => r.text());
const urlsSitemap = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapRotas = [];

for (const u of urlsSitemap) {
  const local = u.startsWith("http") ? u.replace(/^https?:\/\/[^/]+/, base) : u;
  const res = await fetch(local, { redirect: "manual" });
  if (res.status >= 400) sitemapRotas.push({ url: u, estado: res.status });
}

console.log(`\nPáginas rastreadas: ${vistos.size}`);
console.log(`URLs en el sitemap: ${urlsSitemap.length}`);
console.log(`Enlaces externos únicos: ${externas.size}`);
console.log(`\nEnlaces internos rotos: ${rotas.length}`);
for (const r of rotas) console.log(`  ${r.estado}  ${r.ruta}`);
console.log(`\nURLs del sitemap que fallan: ${sitemapRotas.length}`);
for (const r of sitemapRotas) console.log(`  ${r.estado}  ${r.url}`);
console.log(`\nPáginas sin canonical: ${sinCanonical.length}`);
for (const p of sinCanonical) console.log(`  ${p}`);
console.log(`\nPáginas sin title válido: ${sinTitle.length}`);
for (const p of sinTitle) console.log(`  ${p}`);

if (rotas.length || sitemapRotas.length || sinCanonical.length) {
  process.exitCode = 1;
}
