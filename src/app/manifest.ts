import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Se genera en la build y se sirve como archivo estático.
 *
 * Con `output: "export"` las rutas de metadatos tienen que declararse
 * estáticas: sin esto, Next.js no sabe cómo generarlas y la build falla.
 */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nombre,
    short_name: "Alternativas",
    description: site.descripcion,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0e14",
    theme_color: "#0f766e",
    lang: "es",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
