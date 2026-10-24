import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Publicidad y afiliados",
  description:
    "Cómo se financia Alternativas Libres: publicidad de Google AdSense, enlaces de afiliado y patrocinios, y qué garantías ofrece sobre la independencia editorial.",
  alternates: { canonical: "/anuncios" },
};

export default function AnunciosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Publicidad y afiliados
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Este directorio es gratuito y no tiene inversores. Se mantiene con
        publicidad y enlaces de afiliado. Te explicamos exactamente cómo
        funciona, porque un directorio que no dice de dónde sale el dinero
        no merece que le confíes una decisión de compra.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">1. Publicidad</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Publicamos anuncios servidos por Google AdSense. Google decide qué
        anuncios mostrar según el contenido de la página, tu ubicación y tu
        perfil de navegación. Nosotros no elegimos los anunciantes concretos y
        no interferimos en ese proceso.
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        Los bloques publicitarios están identificados como «Publicidad». No
        los colocamos dentro de los listados de herramientas ni entre tarjetas
        de resultados, sino en las páginas de contenido, que son las que
        tienen texto suficiente para ser relevantes.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">2. Enlaces de afiliado</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Algunos enlaces a sitios de terceros, sobre todo proveedores de hosting
        y servicios de correo electrónico, incluyen un código de afiliación.
        Si contratas a través de ese enlace podemos recibir una comisión. El
        precio que pagas es el mismo y no cambia el orden en el que aparecen
        las herramientas.
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        Todos los enlaces de afiliado se identifican con el atributo{" "}
        <code className="rounded bg-panel px-1.5 py-0.5 text-xs">
          rel=&quot;sponsored nofollow&quot;
        </code>{" "}
        y en algunas fichas se marca como «Patrocinado».
      </p>

      <h2 className="mt-8 text-2xl font-semibold">3. Patrocinios</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Podemos aceptar patrocinios de proyectos open source. Un patrocinio
        da visibilidad a un proyecto, pero no compra una valoración positiva:
        la ficha del patrocinado sigue incluyendo sus contras y la fecha de
        revisión. Si una ficha está patrocinada, se indica de forma visible.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">4. Independencia editorial</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted">
        <li>Ningún anunciante puede comprar una posición en el ranking.</li>
        <li>
          La valoración de una herramienta no depende de si paga o no paga
          nada.
        </li>
        <li>
          Las secciones «Contras» y «Cuándo no migrar» no se pueden eliminar por
          acuerdo comercial.
        </li>
        <li>
          Si una herramienta deja de mantenerse o cambia de licencia, la
          actualizamos o la marcamos como no recomendada.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">5. Cookies y consentimiento</h2>
      <p className="mt-3 leading-relaxed text-muted">
        La publicidad de Google utiliza cookies. Antes de servirlas te pedimos
        el consentimiento, y puedes retirarlo o cambiarlo cuando quieras desde
        el aviso de cookies. Si lo rechazas, el sitio sigue siendo plenamente
        utilizable. Los detalles están en{" "}
        <Link href="/cookies" className="text-accent hover:underline">
          la política de cookies
        </Link>
        .
      </p>

      <p className="mt-8 text-sm text-muted">
        Para consultas sobre publicidad o afiliación, escribe a{" "}
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>
        .
      </p>
    </div>
  );
}
