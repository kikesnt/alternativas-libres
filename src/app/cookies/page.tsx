import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Qué cookies y tecnologías similares usa Alternativas Libres, para qué sirven y cómo gestionarlas.",
  alternates: { canonical: "/cookies" },
};

const tablas = [
  {
    nombre: "TUS",
    tipo: "Cookie",
    duracion: "Sesión",
    finalidad:
      "Gestiona el estado de tu elección sobre consentimiento. Es estrictamente necesaria.",
  },
  {
    nombre: "OptanonConsent",
    tipo: "Cookie",
    duracion: "1 año",
    finalidad:
      "Registra tu decisión sobre el uso de cookies de publicidad, si utilizas el consentimiento gestionado por Google.",
  },
  {
    nombre: "test_cookie",
    tipo: "Cookie",
    duracion: "15 minutos",
    finalidad:
      "Cookie técnica de Google que comprueba si tu navegador admite cookies. No se usa para identificarte.",
  },
  {
    nombre: "IDE / DSID / _gcl_au",
    tipo: "Cookie",
    duracion: "Entre 1 y 24 meses",
    finalidad:
      "Google AdSense las utiliza para mostrar publicidad, medir las impresiones y evitar anuncios duplicados. Solo se instalan si aceptas publicidad.",
  },
  {
    nombre: "_ga / _ga_*",
    tipo: "Cookie",
    duracion: "14 meses",
    finalidad:
      "Analítica propia agregada para saber qué páginas se leen. No se activa con la analítica de Google.",
  },
];

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Política de cookies
      </h1>
      <p className="mt-2 text-sm text-muted">
        Última actualización: 22 de octubre de 2026
      </p>

      <p className="mt-6 leading-relaxed text-muted">
        Esta web utiliza cookies y tecnologías similares propias y de terceros.
        Te lo explicamos sin letra pequeña: qué se guarda, quién lo guarda,
        cuánto tiempo y qué puedes hacer al respecto.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Cookies propias</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Guardamos en el almacenamiento local de tu navegador dos preferencias:
        tu elección sobre el consentimiento de cookies y el tema claro u oscuro.
        No son cookies en sentido estricto, no se envían a ningún servidor y
        puedes borrarlas desde las herramientas de tu navegador.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Cookies de terceros</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-3 font-semibold">Nombre</th>
              <th className="p-3 font-semibold">Tipo</th>
              <th className="p-3 font-semibold">Duración</th>
              <th className="p-3 font-semibold">Finalidad</th>
            </tr>
          </thead>
          <tbody>
            {tablas.map((t) => (
              <tr key={t.nombre} className="border-b border-border align-top">
                <td className="p-3 font-mono text-xs">{t.nombre}</td>
                <td className="p-3 text-muted">{t.tipo}</td>
                <td className="p-3 text-muted">{t.duracion}</td>
                <td className="p-3 text-muted">{t.finalidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-2xl font-semibold">Cómo gestionar tu elección</h2>
      <p className="mt-3 leading-relaxed text-muted">
        Puedes cambiar tu decisión en cualquier momento borrando el
        almacenamiento local del sitio y recargando la página, o desde el
        panel de configuración de tu navegador. Si borras las cookies
        publicitarias de Google desde la configuración de tu cuenta, el
        comportamiento de la publicidad cambiará en todo tu navegador.
      </p>
      <p className="mt-3 leading-relaxed text-muted">
        Puedes consultar el detalle técnico en{" "}
        <a
          href="https://policies.google.com/technologies/cookies"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          policies.google.com/technologies/cookies
        </a>
        .
      </p>

      <h2 className="mt-8 text-2xl font-semibold">
        Consentimiento gestionado por Google
      </h2>
      <p className="mt-3 leading-relaxed text-muted">
        Publicamos con Google AdSense, que incluye su propia plataforma de
        consentimiento (Funding Choices). Cuando está activa, es la que muestra
        el aviso de cookies y la que decide qué señales de consentimiento se
        envían. Puedes revisar la información identificativa que Google trata
        en{" "}
        <a
          href="https://myadcenter.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          My Ad Center
        </a>
        .
      </p>

      <p className="mt-8 text-sm text-muted">
        Véase también la{" "}
        <Link href="/privacidad" className="text-accent hover:underline">
          política de privacidad
        </Link>
        . Para cualquier duda, escribe a{" "}
        <a href={`mailto:${site.email}`} className="text-accent hover:underline">
          {site.email}
        </a>
        .
      </p>
    </div>
  );
}
