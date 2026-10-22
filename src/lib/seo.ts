export function recortar(texto: string, max = 158): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= max) return limpio;
  const corte = limpio.slice(0, max);
  const ultimo = corte.lastIndexOf(" ");
  return `${corte.slice(0, ultimo > max * 0.6 ? ultimo : max).trim()}…`;
}
