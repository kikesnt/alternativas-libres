import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Añade tu proyecto al directorio",
  description:
    "Cómo incluir tu herramienta autoalojada en el directorio, los criterios de inclusión y las condiciones de patrocinio.",
  alternates: { canonical: "/colabora" },
};

const criterios = [
  {
    titulo: "Se puede autoalojar en un servidor propio",
    detalle:
      "Necesitamos Docker, un paquete del sistema o un binario que se ejecute sin un servicio de terceros. Un SaaS con plan autoalojado que solo se vende en la nube no entra.",
  },
  {
    titulo: "Licencia clara y compatible con uso comercial",
    detalle:
      "Aceptamos open source OSI (MIT, Apache, GPL, AGPL, MPL, LGPL) y las licencias de fuente disponible con condiciones conocidas, siempre que se expliquen en la ficha.",
  },
  {
    titulo: "Proyecto con actividad reciente",
    detalle:
      "Commits, versiones o incidencias respondidas en los últimos seis meses. Si el repositorio está archivado, lo indicamos o lo retiramos.",
  },
  {
    titulo: "Casos de uso distintos a los ya cubiertos",
    detalle:
      "Buscamos alternativas que resuelvan un problema de otra forma, no clones de lo que ya está en el directorio.",
  },
];

export default function ColaboraPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ name: "Colabora", href: "/colabora" }]} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Añade tu proyecto al directorio
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Si mantienes una herramienta que se puede autoalojar, tu proyecto
        encaja aquí. Lo escribimos nosotros, con datos verificados contra tu
        repositorio, y te enlazamos desde la ficha y desde la categoría
        correspondiente. Es una de las pocas formas legítimas de conseguir
        enlaces desde un directorio sin pagar por ellos.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Criterios de inclusión</h2>
      <ul className="mt-4 space-y-4">
        {criterios.map((c) => (
          <li
            key={c.titulo}
            className="rounded-lg border border-border bg-panel p-5"
          >
            <h3 className="font-semibold">{c.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {c.detalle}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Cómo enviar tu proyecto</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Escríbenos a{" "}
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>{" "}
        con la URL del repositorio, la del sitio oficial y una frase sobre para
        quién es la herramienta. No hace falta que escribas la ficha: la
        escribimos nosotros y te la enviamos antes de publicarla para que
        corrijas los datos técnicos.
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        Si lo que te interesa es que te veamos desde la ficha de un producto
        concreto, indícalo: por ejemplo, «sustituye a Notion para equipos de
        cinco personas sin DevOps».
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Patrocinio</h2>
      <p className="mt-3 leading-relaxed text-muted">
        El patrocinio da visibilidad a un proyecto ya listado y una mención en
        el boletín. No compra una valoración positiva ni la eliminación de las
        contras de la ficha. Si te interesa, cuéntanos qué quieres promover y
        te pasamos las condiciones.
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        Los detalles completos están en{" "}
        <Link href="/anuncios" className="text-accent hover:underline">
          publicidad y afiliados
        </Link>
        .
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Correcciones</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Si una ficha de tu proyecto está desactualizada, dínoslo con el enlace a
        la fuente oficial. Las correcciones verificadas se aplican en la
        siguiente revisión y quedan registradas en{" "}
        <Link href="/novedades" className="text-accent hover:underline">
          novedades
        </Link>
        . Las fichas indican la fecha exacta de su última revisión.
      </p>
    </div>
  );
}
