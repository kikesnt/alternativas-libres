import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Byline } from "@/components/byline";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Metodología y política editorial",
  description:
    "Cómo verificamos licencias, requisitos y precios de cada herramienta del directorio, con qué fuentes y cada cuánto se revisa.",
  alternates: { canonical: "/metodologia" },
};

const pasos = [
  {
    titulo: "Localización del proyecto",
    detalle:
      "Cada entrada nace del repositorio oficial, no de una lista de terceros. Verificamos que el repositorio sigue existiendo, que no está archivado y que ha tenido actividad en los últimos seis meses.",
  },
  {
    titulo: "Lectura de la licencia",
    detalle:
      "Abrimos el fichero LICENSE del repositorio y comprobamos el identificador SPDX y el texto completo. Cuando la licencia no es un identificador estándar OSI, la marcamos como fuente disponible yFem必要 copiamos las condiciones relevantes en la ficha.",
  },
  {
    titulo: "Comprobación del despliegue",
    detalle:
      "Verificamos si existe imagen de Docker oficial, el sistema de build, la base de datos que necesita y el tamaño de la comunidad. El nivel de dificultad es una valoración nuestra a partir de esos datos, no un dato del proyecto.",
  },
  {
    titulo: "Revisión periódica",
    detalle:
      "Cada ficha muestra la fecha de su última revisión. Un proyecto que deja de recibir commits, que se archiva o que cambia de licencia se marca o se retira del directorio. Publicamos los cambios en la página de novedades.",
  },
];

export default function MetodologiaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ name: "Metodología", href: "/metodologia" }]} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Metodología y política editorial
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">
        Un directorio de alternativas solo es útil si la información es correcta.
        Esta página explica de dónde sale cada dato de cada ficha, cómo se
        verifica y con qué frecuencia se revisa.
      </p>

      <div className="mt-6">
        <Byline fecha="22 de octubre de 2026" etiqueta="Publicado" />
      </div>

      <h2 className="mt-10 text-2xl font-semibold">
        De dónde sale la información
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        La fuente primaria de cada entrada es el repositorio oficial del
        proyecto: su fichero de licencia, su documentación de instalación, su
        fichero de compose y su registro de actividad. Los datos de precio del
        producto que se sustituye proceden de su página de precios oficial.
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        Cuando las fuentes oficial y la práctica habitual discrepan, se indica
        la discrepancia en la ficha en lugar de elegir una de las dos. Por
        ejemplo, hay proyectos cuyo repositorio declara una licencia y cuyo
        sitio web comercial ofrece una edición con otras condiciones.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Proceso de revisión</h2>
      <ol className="mt-4 space-y-5">
        {pasos.map((p, i) => (
          <li key={p.titulo} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent-soft/40 text-xs font-semibold text-accent"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="font-semibold">{p.titulo}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {p.detalle}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 text-2xl font-semibold">Niveles de confianza</h2>
      <ul className="mt-3 space-y-2 leading-relaxed text-muted">
        <li>
          <strong className="text-fg">Fecha de revisión</strong> en cada
          ficha. Es la última vez que alguien contrastó los datos con la
          fuente oficial.
        </li>
        <li>
          <strong className="text-fg">Notas de revisión</strong> en las
          entradas donde hay algo pendiente de confirmar o una condición
          legal que conviene leer.
        </li>
        <li>
          <strong className="text-fg">Aviso de retirada</strong> cuando un
          proyecto se archiva. No se puede recomendar un software que no
          recibe parches de seguridad.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Independencia editorial</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Los anunciantes no compran fichas, posiciones ni valoraciones. El
        patrocinio da visibilidad a un proyecto ya listado y una mención en el
        boletín, y en ningún caso elimina las contras de la ficha. Detalles en{" "}
        <Link href="/anuncios" className="text-accent hover:underline">
          publicidad y afiliados
        </Link>
        .
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        Errores y correcciones
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        Si encuentras un dato incorrecto, escríbenos a{" "}
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>{" "}
        con el enlace a la fuente. Las correcciones verificables se aplican en
        la siguiente revisión del directorio y quedan registradas en{" "}
        <Link href="/novedades" className="text-accent hover:underline">
          novedades
        </Link>
        .
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        Qué no somos fuente de
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        No somos fuente de referencia del precio de un producto SaaS, que cambia
        con frecuencia, ni de la seguridad de un proyecto, que debe evaluarse
        en su propio repositorio. Las cifras de coste de las comparativas son
        estimaciones calculadas con precios públicos en la fecha de publicación.
      </p>
    </div>
  );
}
