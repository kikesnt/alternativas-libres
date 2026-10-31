import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  compress: true,

  /*
   * Exportación estática: el sitio son archivos, no un Worker.
   *
   * Antes era un Worker de OpenNext y eso es lo que lo tumbó: las páginas
   * que necesitan render de Next.js (por ejemplo las fichas de las
   * alternativas) pasaban por el Worker, que se pasó del límite de CPU de
   * Cloudflare y devolvía error 1102 en 94 de las 179 URL. Con
   * `output: "export"` las 185 páginas se generan en la build y se sirven
   * como archivos estáticos: no hay CPU que reventar y el sitio no se cae.
   *
   * Lo único que queda vivo es el formulario de contacto, que es una
   * Pages Function (functions/api/contacto.ts) y cuesta milisegundos.
   */
  output: "export",

  /*
   * Las cabeceras y las redirecciones ya no se declaran aquí: con
   * `output: "export"` Next.js no puede emitirlas, y Cloudflare Pages las
   * lee de los ficheros public/_headers y public/_redirects, que están en el
   * repositorio y se pueden revisar de un vistazo.
   */
};

export default nextConfig;
