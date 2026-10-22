"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/components/consent-provider";

declare global {
  interface Window {
    adsbygoogle: unknown[];
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type AdSlotProps = {
  slot: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  label?: string;
  className?: string;
  minHeight?: number;
};

export function AdSlot({
  slot,
  format = "auto",
  label = "Publicidad",
  className = "",
  minHeight = 90,
}: AdSlotProps) {
  const { adsAllowed } = useConsent();
  const pushed = useRef(false);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!adsAllowed || !client || pushed.current) return;
    pushed.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      pushed.current = false;
    }
  }, [adsAllowed, client]);

  if (!client) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 rounded border border-dashed border-border text-xs text-muted ${className}`}
        style={{ minHeight }}
        data-ad-slot={slot}
      >
        <span className="uppercase tracking-wider">Publicidad</span>
        {slot ? (
          <span className="font-mono text-[10px] opacity-70">{slot}</span>
        ) : null}
      </div>
    );
  }

  if (!adsAllowed) {
    return <div style={{ minHeight: 0 }} aria-hidden="true" />;
  }

  return (
    <aside className={className} aria-label={label}>
      <p className="mb-1 text-center text-[11px] uppercase tracking-wider text-muted">
        {label}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
