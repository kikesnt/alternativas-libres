import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre el directorio",
  description:
    "Quiénes somos, cómo seleccionamos las herramientas, qué criterios seguimos y cómo financiamos el directorio con publicidad y afiliados.",
  alternates: { canonical: "/acerca-de" },
};

export default function AcercaDePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Sobre {site.nombre}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        {site.nombre} es un directorio en español de alternativas autoalojadas
        a herramientas SaaS. Existe porque la conversación sobre «vuelve a las
        herramientas open source» casi siempre está en inglés, y porque las
        respuestas útiles no son «usa X», sino «depende de tu equipo, tu
        presupuesto y si alguien va a mantener el servidor».
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Quiénes somos</h2>
      <p className="mt-3 leading-relaxed text-muted">
        {site.nombre} es un proyecto personal de {site.autor}. No hay
        inversores, no hay accionistas y no hay una empresa detrás: hay
        un directorio que se mantiene con publicidad y enlaces de afiliado, y
        unas fichas que se revisan contra el código fuente de cada proyecto.
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        El trabajo de campo es revisar repositorios, leer licencias, comprobar
        qué proyectos se han archivado y escribir comparativas con números
        de coste reales. Cuando una herramienta deja de mantenerse, se retira
        o se marca. Eso es lo que diferencia este directorio de una lista
        generada automáticamente.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Qué incluye cada ficha</h2>
      <ul className="mt-3 space-y-2 leading-relaxed text-muted">
        <li>
          <strong className="text-fg">Requisitos reales de servidor.</strong>{" "}
          vCPU, RAM y si existe imagen de Docker oficial.
        </li>
        <li>
          <strong className="text-fg">Licencia exacta.</strong>{" "}
          Diferenciamos entre open source OSI (AGPL, MIT, Apache) y{" "}
          <em>fuente disponible</em> (BSL, fair-code, Sustainable Use License),
          porque las condiciones cambian según el tamaño del negocio.
        </li>
        <li>
          <strong className="text-fg">Coste.</strong> Del precio de licencia al
          precio del servidor, incluyendo lo que no se factura pero cuesta
          horas.
        </li>
        <li>
          <strong className="text-fg">Contras.</strong> Lo que no funciona bien,
          escrito sin edulcores.
        </li>
        <li>
          <strong className="text-fg">Cuándo no migrar.</strong> La sección más
          útil del directorio y la que menos se escribe.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold">Cómo seleccionamos</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Una herramienta entra en el directorio si se cumple al menos una de
        estas condiciones: tiene una imagen de Docker oficial mantenida, su
        proyecto está activo en los últimos seis meses, o resuelve un caso que
        las alternativas de pago no cubren bien. Descartamos los proyectos
        abandonados y los que solo funcionan en un framework concreto sin
        alternativa.
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        Revisamos cada entrada contra su repositorio oficial. La fecha de
        revisión aparece en cada ficha, y las entradas pendientes de revisión
        se marcan con una nota para que sepas qué confianza darle a cada dato.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">
        Cómo se financia el directorio
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        Con publicidad (Google AdSense) y enlaces de afiliado. Ninguna de las
        dos cosas compra una posición en el ranking, ni puede cambiar la
        valoración de una herramienta. Las fichas contratadas de pago se
        identifican como «Patrocinado» y no se mezclan con las orgánicas.
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        Los detalles están en{" "}
        <Link href="/anuncios" className="text-accent hover:underline">
          publicidad y afiliados
        </Link>
        .
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Lo que este directorio no es</h2>
      <p className="mt-3 leading-relaxed text-muted">
        No somos una consultora, no vendemos implantaciones y no gestionamos
        servidores por ti. Tampoco damos soporte a los proyectos listados:
        para eso está su comunidad y su repositorio.
      </p>

      <AdSlot
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTADO ?? ""}
        className="mt-12"
        minHeight={100}
      />

      <h2 className="mt-10 text-2xl font-semibold">Contacto</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Correcciones, propuestas de herramientas o dudas de licencia:{" "}
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>
        . Si tienes un proyecto open source y te falta visibilidad,{" "}
        <Link href="/contacto" className="text-accent hover:underline">
          cuéntanoslo
        </Link>
        .
      </p>
    </div>
  );
}
