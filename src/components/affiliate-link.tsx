import type { Alternative } from "@/lib/types";

type Props = {
  alternative: Alternative;
  label?: string;
  className?: string;
};

export function AffiliateLink({
  alternative,
  label = "Probar el servicio",
  className = "",
}: Props) {
  const offer = alternative.afiliado;

  if (!offer) {
    return (
      <a
        href={alternative.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <a
      href={`/go/${alternative.slug}`}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={className}
      title={offer.comision}
    >
      {label}
    </a>
  );
}
