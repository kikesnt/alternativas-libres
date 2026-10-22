export function LogoMark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Alternativas Libres"
      className={className}
    >
      <rect width="64" height="64" rx="15" fill="var(--accent)" />
      <path
        d="M20.5 48.5 L31 16 L41.5 48.5"
        stroke="var(--accent-fg)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 39.5 L37.5 39.5"
        stroke="var(--logo-bridge, #5eead4)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  size = 28,
  className = "",
  texto = "Alternativas Libres",
}: {
  size?: number;
  className?: string;
  texto?: string;
}) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span className="font-semibold tracking-tight">{texto}</span>
    </span>
  );
}
