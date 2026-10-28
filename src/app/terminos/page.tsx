import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { BloqueTitular } from "@/components/bloque-titular";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Condiciones de uso del directorio Alternativas Libres: naturaleza de la información, propiedad intelectual, enlaces de afiliados y límites de responsabilidad.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Términos y condiciones
      </h1>
      <p className="mt-2 text-sm text-muted">
        Última actualización: 22 de octubre de 2026
      </p>

      <h2 className="mt-8 text-2xl font-semibold">1. Objeto</h2>
      <p className="mt-3 leading-relaxed text-muted">
        {site.nombre} ofrece información editorial sobre herramientas de
        software. El acceso al sitio implica la aceptación de estas
        condiciones.
      </p>
      <BloqueTitular />

      <h2 className="mt-8 text-2xl font-semibold">2. Naturaleza de la información</h2>
      <p className="mt-3 leading-relaxed text-muted">
        El contenido del directorio es informativo. No prestamos servicios de
        consultoría, no implementamos instalaciones y no damos soporte técnico
        sobre los proyectos descritos. Los datos de licencias, precios y
        requisitos se revisan periódicamente, pero pueden quedar desactualizados:
        verifica siempre en la fuente oficial de cada proyecto antes de tomar
        una decisión. El uso del software de terceros se rige por sus propias
        licencias, no por las presentes condiciones.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">
        3. Enlaces a terceros y afiliados
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        Este sitio contiene enlaces a sitios de terceros. No controlamos sus
        contenidos ni respondemos de ellos. Los enlaces marcados como
        patrocinados o de afiliado pueden generar una comisión para el
        directorio si se realiza una compra a través de ellos. Esa comisión no
        altera el precio que pagas y no condiciona el orden de las
        recomendaciones. Los detalles están en{" "}
        <Link href="/anuncios" className="text-accent hover:underline">
          publicidad y afiliados
        </Link>
        .
      </p>

      <h2 className="mt-8 text-2xl font-semibold">4. Publicidad</h2>
      <p className="mt-3 leading-relaxed text-muted">
        El sitio muestra publicidad servida por Google AdSense. No controlamos
        el contenido de los anuncios ni de las páginas de destino. Puedes
        bloquearlos con un extensão de navegador y consultar las herramientas
        de bloqueo en la{" "}
        <a
          href="https://adssettings.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          configuración de tu cuenta de Google
        </a>
        .
      </p>

      <h2 className="mt-8 text-2xl font-semibold">5. Propiedad intelectual</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Los textos originales, las comparativas y la estructura del directorio
        son propiedad de {site.nombre}. Puedes citarlos con un enlace y sin
        modificar el sentido del texto. No se reproduce el contenido completo
        con fines comerciales.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">6. Responsabilidad</h2>
      <p className="mt-3 leading-relaxed text-muted">
        {site.nombre} no responde por daños derivados del uso de las
        herramientas descritas, de la caída del servicio o de la pérdida de
        datos. Cualquier decisión que tomes tras leer este directorio es
        responsabilidad tuya.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">7. Legislación aplicable</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Estas condiciones se rigen por la legislación española. Los consumidores
        europeos disponen del acceso a la plataforma de resolución de
        litigios de la Comisión Europea.
      </p>

      <p className="mt-8 text-sm text-muted">
        Para cualquier duda, escribe a{" "}
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>
        .
      </p>
    </div>
  );
}
