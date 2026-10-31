/**
 * Datos identificativos del titular del sitio.
 *
 * Por qué van en variables de entorno y no en el código: el aviso legal, la
 * política de privacidad y los términos tienen que nombrar a una persona o
 * entidad real, con su domicilio y su NIF. Esos datos son los del titular y
 * no se inventan aquí: si faltan, las páginas avisan de que falta
 * configurarlos (ver `datosTitularCompletos`).
 */

/** Variables de entorno que rellenan los datos del titular. */
export const VARIABLES_TITULAR = [
  "NEXT_PUBLIC_TITULAR_NOMBRE",
  "NEXT_PUBLIC_TITULAR_DOMICILIO",
  "NEXT_PUBLIC_TITULAR_NIF",
  "NEXT_PUBLIC_TITULAR_EMAIL",
] as const;

/** Datos del titular leídos del entorno. Vacío = sin configurar. */
export const datosTitular = {
  nombre: process.env.NEXT_PUBLIC_TITULAR_NOMBRE ?? "",
  domicilio: process.env.NEXT_PUBLIC_TITULAR_DOMICILIO ?? "",
  nif: process.env.NEXT_PUBLIC_TITULAR_NIF ?? "",
  email: process.env.NEXT_PUBLIC_TITULAR_EMAIL ?? "",
} as const;

/** true si están los cuatro datos del titular */
export function datosTitularCompletos(): boolean {
  return Object.values(datosTitular).every((valor) => valor.trim() !== "");
}

/** Variables del titular que faltan, para poder avisar de cuál es. */
export function variablesTitularFaltantes(): string[] {
  return VARIABLES_TITULAR.filter(
    (variable) => (process.env[variable] ?? "").trim() === "",
  );
}
