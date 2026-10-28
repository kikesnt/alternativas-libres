import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Se genera en la build y se sirve como archivo estático.
 *
 * Con `output: "export"` las rutas de metadatos tienen que declararse
 * estáticas: sin esto, Next.js no sabe cómo generarlas y la build falla.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/go/", "/buscar", "/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
