import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { getAlternatives, getGuides, getProducts } from "@/lib/queries";

const svgMarca = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="15" fill="#0f766e"/>
  <path d="M20.5 48.5 L31 16 L41.5 48.5" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M26 39.5 L37.5 39.5" stroke="#5eead4" stroke-width="7" stroke-linecap="round" fill="none"/>
</svg>`;

const uriMarca = `data:image/svg+xml;base64,${Buffer.from(svgMarca).toString("base64")}`;

/**
 * La imagen se genera en la build y se sirve como archivo.
 *
 * Con `output: "export"` las rutas de metadatos tienen que declararse
 * estáticas: sin esto, Next.js no sabe cómo generarlas y la build falla.
 */
export const dynamic = "force-static";

export const alt = "Alternativas Libres: alternativas autoalojadas a herramientas SaaS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const productos = getProducts();
  const total = getAlternatives(productos.flatMap((p) => p.alternativas)).length;
  const guias = getGuides().length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0e14",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src={uriMarca}
            alt="Alternativas Libres"
            width={72}
            height={72}
            style={{ borderRadius: 18 }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#e6edf3",
              letterSpacing: -0.5,
            }}
          >
            {site.nombre}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 62,
              lineHeight: 1.1,
              fontWeight: 700,
              color: "#ffffff",
              maxWidth: 960,
            }}
          >
            Alternativas autoalojadas a las herramientas SaaS de tu día a día
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 27,
              color: "#9198a1",
              maxWidth: 900,
            }}
          >
            Requisitos reales, licencias verificadas, coste y cuándo no
            conviene migrar
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {[`${productos.length} productos`, `${total} herramientas`, `${guias} comparativas`].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                border: "1px solid #2dd4bf",
                color: "#2dd4bf",
                borderRadius: 999,
                padding: "10px 22px",
                fontSize: 22,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
