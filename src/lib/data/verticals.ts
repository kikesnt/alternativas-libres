import type { Vertical } from "@/lib/types";

export const verticals: Vertical[] = [
  {
    slug: "equipos-pequenos",
    nombre: "Equipos de 2 a 10 personas",
    descripcion:
      "Pocas personas, mucho volumen de documentación y ningún presupuesto de infraestructura.",
    ejemplos: ["Agencias de 3 personas", "Consultores independientes", "Equipos de producto"],
  },
  {
    slug: "agencias",
    nombre: "Agencias y consultoras",
    descripcion:
      "Muchos clientes, datos de clientes y necesidad de auditar dónde acaban los datos.",
    ejemplos: ["Agencias de marketing", "Consultoras IT", "Agencias de diseño"],
  },
  {
    slug: "desarrolladores",
    nombre: "Equipos de desarrollo",
    descripcion:
      "Ciclos de despliegue, self-hosting cómodo y cero fricción con la terminal.",
    ejemplos: ["Startups técnicas", "Freelancers", "Equipos DevOps"],
  },
  {
    slug: "educacion",
    nombre: "Educación y formación",
    descripcion:
      "Aulas virtuales, gestión de alumnos y costes de licencia por puesto.",
    ejemplos: ["Academias", "Centros de FP", "Universidades"],
  },
  {
    slug: "freelancers",
    nombre: "Autónomos y freelancers",
    descripcion:
      "Una sola persona haciendo de department: también necesita CRM, ficheros y facturación.",
    ejemplos: ["Diseñadores", "Programadores", "Asesores"],
  },
  {
    slug: "privacidad",
    nombre: "Privacidad y datos sensibles",
    descripcion:
      "Datos que no pueden salir del servidor: salud, legal, industrial o clientes con NDA.",
    ejemplos: ["Clínicas", "Despachos", "Iniciativas con datos de menores"],
  },
  {
    slug: "ecommerce",
    nombre: "Tiendas online",
    descripcion:
      "Catálogo, stock, email transaccional y métricas de venta autoalojadas.",
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
