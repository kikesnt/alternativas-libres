/**
 * Configuración de AdSense, centralizada para que el banner, el provider de
 * consentimiento y los bloques lean lo mismo.
 */

/** ID de editor: `ca-pub-…`. Vacío = sin anuncios y sin banner. */
export const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/**
 * Google exige un CMP certificado para el tráfico del Espacio Económico
 * Europeo. Cuando activamos el suyo (Funding Choices) es él quien muestra el
 * aviso y quien decide qué consentimiento se envía, así que retiramos el
 * banner propio y dejamos de bloquear los anuncios nosotros.
 */
export const usaCmpGoogle = process.env.NEXT_PUBLIC_ADSENSE_CMP === "google";
