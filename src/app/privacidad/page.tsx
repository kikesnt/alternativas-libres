import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { BloqueTitular } from "@/components/bloque-titular";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de Alternativas Libres: qué datos tratamos, con qué base legal, con quién los compartimos y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Política de privacidad
      </h1>
      <p className="mt-2 text-sm text-muted">
        Última actualización: 22 de octubre de 2026
      </p>

      <h2 className="mt-8 text-2xl font-semibold">1. Responsable del tratamiento</h2>
      <BloqueTitular />

      <h2 className="mt-8 text-2xl font-semibold">2. Qué datos tratamos</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted">
        <li>
          <strong className="text-fg">Datos de navegación.</strong> Dirección
          IP, tipo de navegador, páginas visitadas, origen del tráfico y
          páginas de salida. Los obtiene el proveedor de publicidad y la
          herramienta de analítica propia.
        </li>
        <li>
          <strong className="text-fg">Preferencias.</strong> Tu elección sobre
          cookies y el tema claro u oscuro, guardadas en el almacenamiento
          local de tu navegador.
        </li>
        <li>
          <strong className="text-fg">Correo electrónico.</strong> Solo si nos
          escribes tú con el formulario de contacto.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">3. Base legal</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Para la publicidad y la analítica, la base legal es tu consentimiento,
        que puedes retirar en cualquier momento desde el aviso de cookies. Para
        el resto de tratamiento de datos de navegación, la base legal es el
        interés legítimo en medir y mejorar el servicio. Para las
        comunicaciones por correo, es tu consentimiento, que das al escribirnos.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">
        4. Con quién compartimos datos
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        Google Ireland Limited, como proveedor de la red publicitaria de Google
        AdSense y de la herramienta de analítica, actúa como independiente en
        los datos que trata y como responsable en los datos que trata por cuenta
        propia. Puedes consultar sus condiciones en{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          policies.google.com
        </a>
        . También comparten datos el proveedor de hosting y el proveedor de
        correo electrónico, que tratan los datos conforme a nuestras
        instrucciones.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">
        5. Transferencias internacionales
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        Algunos proveedores que tratamos pueden estar fuera del Espacio
        Económico Europeo. En esos casos se aplican las garantías adecuadas
        del artículo 46 del RGPD, principalmente cláusulas contractuales tipo de
        la Comisión Europea.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">6. Conservación</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Los datos de navegación agregados se conservan durante un máximo de 26
        meses. Los identificadores de los que no has aceptado publicidad se
        eliminan en el plazo máximo de 90 días.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">7. Tus derechos</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Puedes solicitar el acceso, la rectificación, la supresión, la
        limitación u la oposición al tratamiento de tus datos, así como retirar
        el consentimiento y solicitar la portabilidad, escribiendo a{" "}
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>
        . Responderemos en el plazo máximo de un mes. Si no quedas satisfecho,
        puedes reclamar ante la Agencia Española de Protección de Datos.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">
        8. Cambios en esta política
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        Cualquier modificación sustancial se publicará en esta página con la
        fecha de actualización correspondiente. Los cambios que afecten a la
        base legal del tratamiento publicitario requerirán un nuevo
        consentimiento, que te volveremos a solicitar.
      </p>

      <p className="mt-8 text-sm text-muted">
        Más información sobre cookies en{" "}
        <Link href="/cookies" className="text-accent hover:underline">
          la política de cookies
        </Link>
        .
      </p>
    </div>
  );
}
