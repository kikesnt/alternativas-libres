import type { Vertical } from "@/lib/types";

export const verticals: Vertical[] = [
  {
    slug: "equipos-pequenos",
    nombre: "Equipos pequeños",
    descripcion:
      "Pocas personas, mucho volumen de documentación y ningún presupuesto de infraestructura. Alternativas que se pagan por servidor, no por usuario.",
    ejemplos: ["Agencias de 3 personas", "Consultores independientes", "Equipos de producto"],
  },
  {
    slug: "agencias",
    nombre: "Agencias",
    descripcion:
      "Muchos clientes, datos de clientes y necesidad de auditar dónde acaban los datos. Alternativas con licencias que permiten uso comercial.",
    ejemplos: ["Agencias de marketing", "Consultoras IT", "Agencias de diseño"],
  },
  {
    slug: "desarrolladores",
    nombre: "Desarrolladores",
    descripcion:
      "Ciclos de despliegue, autoalojamiento cómodo y cero fricción con la terminal, con requisitos de servidor y requisitos de sistema concretos.",
    ejemplos: ["Startups técnicas", "Freelancers", "Equipos DevOps"],
  },
  {
    slug: "educacion",
    nombre: "Educación",
    descripcion:
      "Aulas virtuales, gestión de alumnos y costes de licencia por puesto. Alternativas que funcionan en un servidor propio de una institución.",
    ejemplos: ["Academias", "Centros de FP", "Universidades"],
  },
  {
    slug: "freelancers",
    nombre: "Autónomos",
    descripcion:
      "Una sola persona haciendo las veces de todo un departamento: también necesita CRM, ficheros y facturación, todo en la misma VPS y sin cuotas por usuario.",
    ejemplos: ["Diseñadores", "Programadores", "Asesores"],
  },
  {
    slug: "privacidad",
    nombre: "Privacidad y datos",
    descripcion:
      "Datos que no pueden salir del servidor: salud, legal, industrial o clientes con NDA. Alternativas para instalar en tu infraestructura y decidir quién accede.",
    ejemplos: ["Clínicas", "Despachos", "Iniciativas con datos de menores"],
  },
  {
    slug: "ecommerce",
    nombre: "Tiendas online",
    descripcion:
      "Catálogo, stock, correo transaccional y métricas de venta autoalojadas, para tiendas que no quieren depender de una plataforma de pago.",
    ejemplos: ["Tiendas Shopify", "Marketplaces", "Dropshippers"],
  },
  {
    slug: "diseno",
    nombre: "Equipos de diseño",
    descripcion:
      "Herramientas de diseño, prototipado y pizarras con licencia compatible con uso comercial.",
    ejemplos: ["Studios", "Departamentos de marketing", "Agencias"],
  },
];

export const verticalBySlug = new Map(verticals.map((v) => [v.slug, v]));
