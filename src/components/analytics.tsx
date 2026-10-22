import Script from "next/script";

export function Analytics() {
  const url = process.env.NEXT_PUBLIC_ANALYTICS_URL;
  const dominio = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;

  if (!url) return null;

  return (
    <Script
      src={url}
      strategy="afterInteractive"
      data-domain={dominio}
      defer
    />
  );
}
