"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/components/consent-provider";
import { ADSENSE_CLIENT } from "@/lib/ads";

type AdSlotProps = {
  slot: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  label?: string;
  className?: string;
  minHeight?: number;
};

/** Escapa un valor para poder meterlo dentro de un atributo HTML. */
function escaparAtributo(valor: string): string {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function AdSlot({
  slot,
  format = "auto",
  label = "Publicidad",
  className = "",
  minHeight = 90,
}: AdSlotProps) {
  const { adsAllowed } = useConsent();
  const plantilla = useRef<HTMLTemplateElement>(null);
  const activado = useRef(false);

  useEffect(() => {
    if (!adsAllowed || activado.current) return;
    const tpl = plantilla.current;
    if (!tpl) return;
    activado.current = true;

    /* El <ins> va DENTRO de un <template> a propósito.
       Así sigue estando en el HTML (el rastreador de Google lo ve, que es lo
       que pide para aprobar el sitio), pero la librería de AdSense no lo
       encuentra: solo recorre el DOM, no el contenido de un <template>. Sin
       eso, el anuncio se pedía al cargar la página, sin consentimiento.
       Al aceptar, se saca el <ins> del template y se mete en la página, que
       es cuando se pide. */
    const contenido = tpl.content.cloneNode(true) as DocumentFragment;
    const contenedor = tpl.parentElement;
    const destino = contenedor?.querySelector("[data-ad-destino]");
    if (contenedor) {
      if (destino) destino.appendChild(contenido);
      else contenedor.appendChild(contenido);
    }

    /* Cada <ins class="adsbygoogle"> necesita un push para pedir el anuncio.
       De lo contrario se queda vacío y no pide nada a Google. */
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      activado.current = false;
    }
  }, [adsAllowed]);

  if (!ADSENSE_CLIENT) {
    if (process.env.NODE_ENV === "production") return null;

    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 rounded border border-dashed border-border text-xs text-muted ${className}`}
        style={{ minHeight }}
        data-ad-slot={slot}
      >
        <span className="uppercase tracking-wider">Publicidad</span>
        {slot ? (
          <span className="font-mono text-[10px] opacity-70">{slot}</span>
        ) : null}
      </div>
    );
  }

  // Sin ID de bloque (todavía no creado en AdSense) no se pinta nada: un
  // `<ins>` con `data-ad-slot` vacío solo llena la consola de errores y deja
  // un hueco en blanco.
  if (!slot) return null;

  const ins = `<ins class="adsbygoogle" style="display:block" data-ad-client="${escaparAtributo(ADSENSE_CLIENT)}" data-ad-slot="${escaparAtributo(slot)}" data-ad-format="${escaparAtributo(format)}" data-full-width-responsive="true"></ins>`;

  return (
    <aside className={className} aria-label={label}>
      <p className="mb-1 text-center text-[11px] uppercase tracking-wider text-muted">
        {label}
      </p>
      {/* El <ins> va dentro del <template>, no como hijo directo: si fuera un
          hijo directo, la librería de AdSense lo encontraría al cargar la
          página y pediría el anuncio sin consentimiento. */}
      <template
        ref={plantilla}
        data-ad-template=""
        dangerouslySetInnerHTML={{ __html: ins }}
      />
      <div data-ad-destino="" style={{ minHeight: adsAllowed ? minHeight : 0 }} />
    </aside>
  );
}
