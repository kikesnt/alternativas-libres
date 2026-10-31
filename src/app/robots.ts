import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Se genera en la build y se sirve como archivo estático.
 *
 * Con `output: "export"` las rutas de metadatos tienen que declararse
 * estáticas: sin esto, Next.js no sabe cómo generarlas y la build falla.
 */
export const dynamic = "force-static";

/** Rutas que nunca se deben rastrear. */
const PRIVATE = ["/go/", "/buscar", "/api/"];

/**
 * Robots de IA, separados por purpose (RFC 9309).
 *
 * Un crawler obedece solo el grupo más específico que lo nombra: en cuanto
 * existe un grupo con su nombre, el grupo `*` deja de aplicársele. Por eso
 * los bots de búsqueda y los de entrenamiento van en grupos propios.
 *
 *   - los de búsqueda y cita (ChatGPT search, Claude search, Perplexity) sí
 *     entran: son los que traen visitas;
 *   - los de entrenamiento no: aquí hay fichas que se pagan y el contenido
 *     es trabajo editorial.
 *
 * `Content-Signal` no se puede emitir desde este tipo de metadatos de
 * Next.js (solo admite userAgent, allow, disallow y crawlDelay), así que
 * aquí queda solo la regla de acceso.
 */
const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];

const AI_TRAINING_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Applebot-Extended",
  "meta-externalagent",
  "AI2Bot",
  "YouBot",
  "Diffbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE,
      },
      {
        userAgent: AI_SEARCH_BOTS,
        allow: "/",
        disallow: PRIVATE,
      },
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
