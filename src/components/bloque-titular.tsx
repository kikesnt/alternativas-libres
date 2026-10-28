import {
  datosTitular,
  datosTitularCompletos,
  variablesTitularFaltantes,
} from "@/lib/datos-titular";

/**
 * Bloque con los datos identificativos del titular.
 *
 * Lo usan el aviso legal, la política de privacidad y los términos. Si los
 * datos no están configurados en el entorno, el bloque lo dice de forma
 * explícita en lugar de mostrar un nombre inventado: es preferible que se
 * note el hueco a publicar datos de titular falsos.
 */
export function BloqueTitular() {
  if (!datosTitularCompletos()) {
    const faltan = variablesTitularFaltantes();

    return (
      <div className="mt-3 rounded-lg border border-border bg-panel p-4">
        <p className="text-sm font-semibold text-fg">
          Aviso: los datos del titular no están configurados
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Antes de publicar el sitio hay que definir{" "}
          <code className="font-mono text-xs">{faltan.join(", ")}</code> en las
          variables de entorno. Mientras falten, este apartado no puede
          identificar al responsable del tratamiento.
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
