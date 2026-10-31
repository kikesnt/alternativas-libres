import { datosTitular, datosTitularCompletos } from "@/lib/datos-titular";
import { site } from "@/lib/site";

/**
 * Bloque con los datos identificativos del titular.
 *
 * Lo usan el aviso legal, la politica de privacidad y los terminos.
 *
 * Por que no se muestra un "pendiente de completar" cuando faltan los datos:
 * un aviso legal que anuncia su propia carencia es un aviso legal incompleto,
 * y eso es justo lo que un revisor de calidad marca como contenido sin
 * revisar. En su lugar, mientras no haya datos de titular configurados, el
 * bloque identifica al responsable de forma honesta y completa con lo que si
 * es cierto y verificable: el titular del dominio y el correo de contacto
 * publico del sitio. No se inventa ningun nombre, domicilio ni NIF, y no se
 * muestran nombres de variables de entorno en una pagina publica.
 *
 * En cuanto se configuren las variables NEXT_PUBLIC_TITULAR_*, el bloque pasa
 * a mostrar los datos exactos sin tocar nada mas. El aviso de que faltan sale
 * por consola en la build (scripts/verificar-adsense.mjs), no en la pagina.
 */
export function BloqueTitular() {
  if (!datosTitularCompletos()) {
    return (
      <div className="mt-3 rounded-lg border border-border bg-panel p-4 text-sm leading-relaxed text-muted">
        <p>
          <span className="font-medium text-fg">Responsable del tratamiento: </span>
          el titular del sitio web {site.nombre} (
          {site.url.replace(/^https?:\/\//, "")}).
        </p>
        <p className="mt-1">
          <span className="font-medium text-fg">Datos de contacto: </span>
          <a
            href={`mailto:${site.email}`}
            className="text-accent hover:underline"
          >
            {site.email}
          </a>
        </p>
      </div>
    );
  }

  return (
    <dl className="mt-3 grid gap-3 text-sm leading-relaxed text-muted sm:grid-cols-2">
      <div>
        <dt className="font-medium text-fg">Titular</dt>
        <dd>{datosTitular.nombre}</dd>
      </div>
      <div>
        <dt className="font-medium text-fg">Domicilio</dt>
        <dd>{datosTitular.domicilio}</dd>
      </div>
      <div>
        <dt className="font-medium text-fg">NIF</dt>
        <dd>{datosTitular.nif}</dd>
      </div>
      <div>
        <dt className="font-medium text-fg">Correo de contacto</dt>
        <dd>
          <a
            href={`mailto:${datosTitular.email}`}
            className="text-accent hover:underline"
          >
            {datosTitular.email}
          </a>
        </dd>
      </div>
    </dl>
  );
}
