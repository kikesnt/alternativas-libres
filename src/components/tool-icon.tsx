import { logos } from "@/lib/data/logos";

function hash(texto: string) {
  let h = 0;
  for (let i = 0; i < texto.length; i++) {
    h = (h * 31 + texto.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function ToolIcon({
  slug,
  nombre,
  size = 40,
  className = "",
}: {
  slug: string;
  nombre: string;
  size?: number;
  className?: string;
}) {
  const logo = logos[slug];

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

  const hue = hash(slug) % 360;
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-lg border border-border font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        background: `hsl(${hue} 60% 94%)`,
        color: `hsl(${hue} 55% 32%)`,
        fontSize: size * 0.42,
      }}
    >
      {inicial}
    </span>
  );
}
