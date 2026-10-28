import { ADSENSE_ADS_TXT_LINE } from "@/lib/ads";

/**
 * `ads.txt` es obligatorio para que AdSense autorice el sitio.
 *
 * Antes esta ruta construía la línea con `NEXT_PUBLIC_ADSENSE_CLIENT`, que es
 * el ID de EDITOR (`ca-pub-…`), y devolvía 404 cuando esa variable no estaba
 * — o sea, en producción no había `ads.txt`. Google espera el ID de CUENTA
 * (`pub-…`): con un `ca-pub-` la línea se da por inválida.
 *
 * Ahora la línea sale siempre del ID de cuenta y se sirve siempre con 200.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(`${ADSENSE_ADS_TXT_LINE}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
