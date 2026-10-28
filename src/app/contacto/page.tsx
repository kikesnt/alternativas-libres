import type { Metadata } from "next";
import { site } from "@/lib/site";
import { FormularioContacto } from "@/components/formulario-contacto";
import { BloqueTitular } from "@/components/bloque-titular";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con Alternativas Libres para corregir datos, proponer herramientas o habilitar un patrocinio.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Contacto
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Escríbenos a{" "}
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>
        . Respondemos en un plazo de dos días laborables.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-panel p-6">
        <h2 className="text-lg font-semibold">Escríbenos</h2>
        <p className="mt-2 mb-5 text-sm leading-relaxed text-muted">
          Rellena el formulario y te respondemos en dos días laborables.
        </p>
        <FormularioContacto />
      </div>

      <div className="mt-8 space-y-6">
        <section className="rounded-lg border border-border bg-panel p-6">
          <h2 className="text-lg font-semibold">Correcciones de datos</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Si una licencia ha cambiado, un proyecto se ha abandonado o un
            requisito ya no es correcto, dínoslo con el enlace a la fuente
            oficial. Las correcciones verificadas se aplican en la siguiente
            revisión y se anotan en la ficha.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-panel p-6">
          <h2 className="text-lg font-semibold">Proponer una herramienta</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Cuéntanos qué herramienta autoalojada te falta, para qué caso la
            usarías y qué producto quieres sustituir. Buscamos proyectos con
            imagen de Docker oficial, licencia clara y actividad reciente.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-panel p-6">
          <h2 className="text-lg font-semibold">Patrocinio</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Si mantienes un proyecto open source y quieres que aparezca en el
            directorio, el patrocinio da visibilidad y un enlace desde una
            ficha con contenido editorial. No compran una valoración positiva
            ni la eliminación de las contras. Las condiciones completas están
            en la página de{" "}
            <a href="/anuncios" className="text-accent hover:underline">
              publicidad y afiliados
            </a>
            .
          </p>
        </section>

        <section className="rounded-lg border border-border bg-panel p-6">
          <h2 className="text-lg font-semibold">Aviso legal</h2>
          <BloqueTitular />
        </section>
      </div>
    </div>
  );
}
