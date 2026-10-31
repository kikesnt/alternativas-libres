export type LicenseType =
  | "open-source"
  | "source-available"
  | "freeware"
  | "propietario";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type CostModel =
  | "gratis"
  | "freemium"
  | "pago-unico"
  | "suscripcion"
  | "modelo-propio";

export interface Vertical {
  slug: string;
  nombre: string;
  descripcion: string;
  ejemplos: string[];
}

export interface Category {
  slug: string;
  nombre: string;
  descripcion: string;
}

export interface Product {
  slug: string;
  nombre: string;
  vendedor: string;
  url: string;
  categoria: string;
  precio: string;
  licencia: string;
  resumen: string;
  porqueSustituir: string[];
  cuandoNoMigrar: string[];
  alternativas: string[];
  verificadoEn: string;
}

export interface AffiliateOffer {
  etiqueta: string;
  url: string;
  comision: string;
}

export interface Alternative {
  slug: string;
  nombre: string;
  tagline: string;
  url: string;
  repo?: string;
  licenciaTipo: LicenseType;
  licencia: string;
  stack: string[];
  dificultad: Difficulty;
  dockerOficial: boolean;
  requiereDevops: boolean;
  recursosMinimos: string;
  coste: CostModel;
  costeNota: string;
  highlights: string[];
  contras: string[];
  mejorPara: string[];
  sustituye: string[];
  afiliado?: AffiliateOffer;
  destacado?: boolean;
  verificadoEn: string;
  revisionPendiente: boolean;
  notas?: string;
}

export type ConsentValue = "all" | "ads-only" | "none";

declare global {
  interface Window {
    adsbygoogle: unknown[];
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export interface GuideSection {
  h2: string;
  parrafos: string[];
  lista?: string[];
}

export interface Guide {
  slug: string;
  titulo: string;
  descripcion: string;
  producto: string;
  alternativa: string;
  fecha: string;
  lecturaMin: number;
  secciones: GuideSection[];
  veredicto: string;
  faq: { q: string; a: string }[];
}
