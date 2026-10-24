import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConsentProvider } from "@/components/consent-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Analytics } from "@/components/analytics";
import { adsenseClient } from "@/lib/ads";
import { site } from "@/lib/site";
import { recortar } from "@/lib/seo";
import { assertDataIntegrity } from "@/lib/data/integrity";

assertDataIntegrity();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const consentDefault = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  ad_user_choice:'denied',
  analytics_storage:'denied',
  functionality_storage:'denied',
  personalization_storage:'denied',
  security_storage:'denied'
});
`;

const themeInit = `
try {
  var t = localStorage.getItem('al_theme');
  if (t === 'light' || t === 'dark') {
    document.documentElement.setAttribute('data-theme', t);
  }
} catch (e) {}
`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nombre}: software autoalojado y open source`,
    template: `%s | ${site.nombre}`,
  },
  applicationName: site.nombre,
  description: recortar(
    "Directorio en español de alternativas self-hosted y de código abierto a las herramientas SaaS. Requisitos, licencia, coste y contras de cada opción.",
  ),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: site.nombre,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: { canonical: "/" },
  authors: [{ name: site.autor }],
  creator: site.autor,
  publisher: site.nombre,
  category: "technology",
  // Permite verificar la propiedad del sitio en AdSense por metaetiqueta, sin
  // depender de que el script ya esté cargando anuncios.
  ...(adsenseClient
    ? { other: { "google-adsense-account": adsenseClient } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e14" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: consentDefault }} />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${site.nombre}: novedades`}
          href="/feed.xml"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ConsentProvider>
          <a href="#contenido" className="skip-link">
            Saltar al contenido
          </a>
          <SiteHeader />
          <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
          <CookieBanner />
          <Analytics />
        </ConsentProvider>
      </body>
    </html>
  );
}
