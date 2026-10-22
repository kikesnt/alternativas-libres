const meses = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function formatearFecha(fecha: string): string {
  const iso = fecha.length === 10 ? `${fecha}T00:00:00` : fecha;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return fecha;
  return `${d.getUTCDate()} de ${meses[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

export function formatearFechaCorta(fecha: string): string {
  const iso = fecha.length === 10 ? `${fecha}T00:00:00` : fecha;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return fecha;
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(
    d.getUTCMonth() + 1,
  ).padStart(2, "0")}/${d.getUTCFullYear()}`;
}
