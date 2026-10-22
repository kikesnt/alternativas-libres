import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "productividad",
    nombre: "Productividad y documentación",
    descripcion:
      "Wikis, bases de conocimiento y suites ofimáticas que puedes alojar en tu propio servidor.",
  },
  {
    slug: "comunicacion",
    nombre: "Comunicación y videollamadas",
    descripcion:
      "Mensajería interna, correo, reuniones y vídeo para equipos que no dependen de una nube ajena.",
  },
  {
    slug: "proyectos",
    nombre: "Gestión de proyectos",
    descripcion:
      "Ticketing, wikis y tableros tipo Jira para equipos técnicos y de servicios.",
  },
  {
    slug: "datos",
    nombre: "Bases de datos y analítica",
    descripcion:
      "Bases estilo Airtable, APIs headless y métricas de producto sin enviar datos a terceros.",
  },
  {
    slug: "marketing",
    nombre: "Email y automatización",
    descripcion:
      "Campañas de email, envío transaccional y flujos automáticos autoalojados.",
  },
  {
    slug: "almacenamiento",
    nombre: "Almacenamiento y ficheros",
    descripcion:
      "Nubes personales, sincronización de archivos y backup para no depender de Drive o Dropbox.",
  },
  {
    slug: "crm",
    nombre: "CRM y gestión comercial",
    descripcion:
      "Control de clientes, contactos y pipeline para consultoras y equipos comerciales.",
  },
  {
    slug: "codigo",
    nombre: "Código y CI/CD",
    descripcion:
      "Forks de GitHub autoalojados, integraciones continuas y gestión de secretos.",
  },
  {
    slug: "diseno",
    nombre: "Diseño y diagramas",
    descripcion:
      "Suites de diseño, pizarras y diagramas de flujo con licencia abierta real.",
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
