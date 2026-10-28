"use client";

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
import { adsEnabled, usaCmpGoogle } from "@/lib/ads";
import type { ConsentValue } from "@/lib/types";

type ConsentContextValue = {
  consent: ConsentValue | null;
  adsAllowed: boolean;
  analyticsAllowed: boolean;
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
  analyticsAllowed: false,
  grant: () => {},
});

function applyConsent(value: ConsentValue) {
  // Con el CMP de Google (Funding Choices) activo manda Google: no enviamos
  // nuestros propios 'consent update', solo leemos los suyos.
  if (usaCmpGoogle) return;

  const ads = value !== "none";
  const personalized = value === "all";
  const settings = {
    ad_storage: ads ? "granted" : "denied",
    ad_user_data: personalized ? "granted" : "denied",
    ad_personalization: personalized ? "granted" : "denied",
    ad_user_choice: "granted",
    analytics_storage: personalized ? "granted" : "denied",
    ads_data_redaction: !ads,
    functionality_storage: "granted",
    personalization_storage: personalized ? "granted" : "denied",
    security_storage: "granted",
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

  // Los anuncios solo se piden si hay una decisión de consentimiento. Antes
  // bastaba con que la variable NEXT_PUBLIC_ADSENSE_CMP valiera "google"
  // para pedirlos sin que nadie hubiera aceptado nada: eso no es Consent Mode
  // v2. Con el CMP de Google, el "granted" llega desde Google (ver el efecto
  // de abajo), no desde una suposición nuestra.
  const adsAllowed =
    adsEnabled && (consent === "all" || consent === "ads-only");
  const analyticsAllowed = adsEnabled && consent === "all";

  useEffect(() => {
    if (consent) applyConsent(consent);
  }, [consent]);

  useEffect(() => {
    if (!usaCmpGoogle) return;

    // Funding Choices manda su decisión con un 'consent update' de gtag. Lo
    // escuchamos para no tener que suponer nada: si el CMP no está activo, no
    // llega ninguna actualización y los anuncios no se piden.
    const original = window.gtag;
    if (!original) return;

    const envuelto = (...args: unknown[]) => {
      if (args[0] === "consent" && args[1] === "update") {
        const ajustes = (args[2] ?? {}) as Record<string, string>;
        const siguiente: ConsentValue =
          ajustes.ad_storage === "granted" ? "ads-only" : "none";
        if (store.get() !== siguiente) store.set(siguiente);
      }
      original.apply(window, args);
    };

    window.gtag = envuelto;
    return () => {
      if (window.gtag === envuelto) window.gtag = original;
    };
    // `usaCmpGoogle` es una constante de módulo, no un valor reactivo: no
    // hace falta ponerla en las dependencias del efecto.
  }, []);

  const grant = useCallback((value: ConsentValue) => {
    applyConsent(value);
    store.set(value);
  }, []);

  const value = useMemo(
    () => ({ consent, adsAllowed, analyticsAllowed, grant }),
    [consent, adsAllowed, analyticsAllowed, grant],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}
