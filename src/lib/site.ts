export const site = {
  nombre: "Alternativas Libres",
  descripcion:
    "Directorio en español de alternativas self-hosted y de código abierto a las herramientas SaaS que usas cada día. Con requisitos, costes reales y cuándo NO conviene migrar.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://alternativas-libres.es",
  email: process.env.NEXT_PUBLIC_CONTACTO_EMAIL || "hola@alternativas-libres.es",
  locale: "es_ES",
  lang: "es",
  autor: "Enrique M.",
} as const;

export const nav = [
  { href: "/alternativas", label: "Herramientas" },
  { href: "/categorias", label: "Categorías" },
  { href: "/comparativas", label: "Comparativas" },
  { href: "/metodologia", label: "Metodología" },
  { href: "/acerca-de", label: "Sobre" },
] as const;
