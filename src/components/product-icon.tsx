import { logosProducto } from "@/lib/data/logos";

export function ProductIcon({
  slug,
  nombre,
  size = 36,
  className = "",
}: {
  slug: string;
  nombre: string;
  size?: number;
  className?: string;
}) {
  const logo = logosProducto[slug];

  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={`shrink-0 rounded-lg border border-border bg-white object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-lg border border-border bg-panel text-xs font-semibold text-muted ${className}`}
      style={{ width: size, height: size }}
    >
      {nombre.slice(0, 2).toUpperCase()}
    </span>
  );
}
