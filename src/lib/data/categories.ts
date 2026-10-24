import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "productividad",
    nombre: "Productividad",
    descripcion:
      "Wikis, bases de conocimiento y suites ofimáticas que puedes alojar en tu propio servidor, con licencia libre y requisitos reales de instalación.",
  },
  {
    slug: "comunicacion",
    nombre: "Comunicación",
    descripcion:
      "Mensajería interna, correo, reuniones y vídeo para equipos que no dependen de una nube ajena. Alternativas con licencia libre y datos en tu servidor.",
  },
  {
    slug: "proyectos",
    nombre: "Gestión de proyectos",
    descripcion:
      "Ticketing, wikis y tableros tipo Jira para equipos técnicos y de servicios, autoalojados y sin coste por usuario.",
  },
  {
    slug: "datos",
    nombre: "Datos y analítica",
    descripcion:
      "Bases estilo Airtable, APIs headless y métricas de producto sin enviar datos a terceros, con requisitos de servidor y contras de cada opción.",
  },
  {
    slug: "marketing",
    nombre: "Email y automatización",
    descripcion:
      "Campañas de correo, envío transaccional y flujos automáticos autoalojados, con la diferencia entre una plataforma de marketing y un simple newsletter.",
  },
  {
    slug: "almacenamiento",
    nombre: "Almacenamiento",
    descripcion:
      "Nubes personales, sincronización de archivos y copias de seguridad para no depender de Drive o Dropbox, con las licencias y los límites de cada opción.",
  },
  {
    slug: "crm",
    nombre: "CRM",
    descripcion:
      "Control de clientes, contactos y embudo comercial para consultoras y equipos comerciales, con el coste real frente a los CRM de pago.",
  },
  {
    slug: "codigo",
    nombre: "Código y CI/CD",
    descripcion:
      "Alternativas autoalojadas a GitHub, integraciones continuas y gestión de secretos, con la licencia y la actividad de cada proyecto.",
  },
  {
    slug: "diseno",
    nombre: "Diseño",
    descripcion:
      "Suites de diseño, pizarras y diagramas de flujo con licencia abierta real, para quien no puede pagar una cuota por usuario.",
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
