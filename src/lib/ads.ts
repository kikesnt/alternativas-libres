/**
 * Configuración de AdSense, centralizada para que el banner, el provider de
 * consentimiento y los bloques lean lo mismo.
 */

/**
 * ID de EDITOR: `ca-pub-…`. Es el ID de este sitio dentro de la cuenta de
 * AdSense. Vacío = sin anuncios y sin banner.
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/**
 * ID de CUENTA (publisher) de AdSense: `pub-…`.
 *
 * Es el mismo para todos los sitios de la cuenta y NO es un secreto: aparece
 * en el HTML público de cada web, igual que el `ca-pub-`. Lo que va en
 * `ads.txt` es este, nunca el `ca-pub-` del editor: Google los confunde y
 * la línea se da por inválida.
 *
 * Se puede sobrescribir con `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`, pero el valor
 * por defecto es el de la cuenta.
 */
export const ADSENSE_PUBLISHER_ID =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "pub-7087940323534073";

/**
 * Línea de `ads.txt`. `f08c47fec0942fa0` es el ID de certificación de Google:
 * sin él, algunos validadores dan la línea por incompleta.
 */
export const ADSENSE_ADS_TXT_LINE = `google.com, ${ADSENSE_PUBLISHER_ID}, DIRECT, f08c47fec0942fa0`;

/** true si hay un ID de editor configurado */
export const adsEnabled = Boolean(ADSENSE_CLIENT);

/**
 * Google exige un CMP certificado para el tráfico del Espacio Económico
 * Europeo. Cuando activamos el suyo (Funding Choices) es él quien muestra el
 * aviso y quien decide qué consentimiento se envía, así que retiramos el
 * banner propio y dejamos de bloquear los anuncios nosotros.
 */
export const usaCmpGoogle = process.env.NEXT_PUBLIC_ADSENSE_CMP === "google";
