"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent-provider";

export function Analytics() {
  const url = process.env.NEXT_PUBLIC_ANALYTICS_URL;
  const dominio = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const { analyticsAllowed } = useConsent();

  // La analítica es Cookies de Google: no se descarga hasta que hay
  // consentimiento. Antes se cargaba siempre, sin preguntar.
  if (!url || !analyticsAllowed) return null;

  return (
    <Script
      src={url}
      strategy="afterInteractive"
      data-domain={dominio}
      defer
    />
  );
}
