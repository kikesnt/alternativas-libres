"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createLocalStorageStore } from "@/lib/stores";
import type { ConsentValue } from "@/lib/types";

type ConsentContextValue = {
  consent: ConsentValue | null;
  adsAllowed: boolean;
  grant: (value: ConsentValue) => void;
};

const store = createLocalStorageStore<ConsentValue>(
  "al_consent",
  "al-consent-change",
);

const serverSnapshot = () => null;

const ConsentContext = createContext<ConsentContextValue>({
  consent: null,
  adsAllowed: false,
  grant: () => {},
});

function applyConsent(value: ConsentValue) {
  const granted = value !== "none";
  const personalized = value === "all";
  const settings = {
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: personalized ? "granted" : "denied",
    ad_personalization: personalized ? "granted" : "denied",
    ad_user_choice: "granted",
    analytics_storage: "denied",
    functionality_storage: granted ? "granted" : "denied",
    personalization_storage: personalized ? "granted" : "denied",
    security_storage: granted ? "granted" : "denied",
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "consent_update", ...settings });
  window.gtag?.("consent", "update", settings);
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const consent = useSyncExternalStore(
    store.subscribe,
    store.get,
    serverSnapshot,
  );

  const adsAllowed = consent === "all" || consent === "ads-only";

  useEffect(() => {
    if (consent) applyConsent(consent);
  }, [consent]);

  const grant = useCallback((value: ConsentValue) => {
    applyConsent(value);
    store.set(value);
  }, []);

  const value = useMemo(
    () => ({ consent, adsAllowed, grant }),
    [consent, adsAllowed, grant],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {adsAllowed ? (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ""}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      ) : null}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}
