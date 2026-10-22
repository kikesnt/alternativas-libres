import type { Product } from "@/lib/types";

export const products: Product[] = [
  {
    slug: "notion",
    nombre: "Notion",
    vendedor: "Notion Labs",
    url: "https://www.notion.so",
    categoria: "productividad",
    precio: "Gratis con límites; Plus 10 USD/mes por usuario; Business 20 USD/mes",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Un espacio de trabajo que mezcla wiki, base de datos, documentos y tableros en un solo editor de bloques.",
    porqueSustituir: [
      "Todo tu conocimiento vive fuera de tu control: no hay exportación limpia ni copia a tu infraestructura.",
      "El precio crece con el equipo, pero el plan gratuito deja de ser usable justo cuando la documentación se vuelve crítica.",
      "En un sector regulado, tener el wiki de la empresa en el servidor de un tercero puede complicar las auditorías.",
    ],
    cuandoNoMigrar: [
      "Si tu equipo no tiene a nadie que sepa ejecutar un servidor.",
      "Si necesitas apps de terceros ya instaladas y el móvil es tu herramienta principal.",
      "Si el wiki es de lectura ocasional y nadie va a buscar información de verdad.",
    ],
    alternativas: ["appflowy", "outline", "affine", "logseq", "anytype", "teable"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "slack",
    nombre: "Slack",
    vendedor: "Salesforce",
    url: "https://slack.com",
    categoria: "comunicacion",
    precio: "Gratis con 90 días de histórico; Pro 7,25 USD/usuario/mes",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Mensajería de equipo con canales, hilos, integraciones y un ecosistema enorme de apps.",
    porqueSustituir: [
      "Los mensajes de tu empresa están en los servidores de otro, con un plan de continuidad que no controlas.",
      "Los canales públicos y las integraciones filtran datos que no querías compartir.",
      "En cuanto tienes más de 30 personas, el coste por usuario se dispara.",
    ],
    cuandoNoMigrar: [
      "Si tu equipo vive en Slack y ya tiene thousands of mensajes históricos que nadie va a migrar.",
      "Si no hay nadie que se encargue de operar el servidor y de las actualizaciones de seguridad.",
      "Si dependes de integraciones proprietary de Slack que no tienen equivalente.",
    ],
    alternativas: ["mattermost", "rocketchat", "zulip", "element-matrix", "nextcloud-talk", "nextcloud"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "jira",
    nombre: "Jira",
    vendedor: "Atlassian",
    url: "https://www.atlassian.com/software/jira",
    categoria: "proyectos",
    precio: "Standard 8,50 USD/usuario/mes; Premium 17 USD",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Tracker de tickets con campos personalizados, workflows y un panel de agile para equipos de desarrollo.",
    porqueSustituir: [
      "El histórico de tickets es el activo de un equipo de desarrollo y en la nube se paga cada mes por tenerlo.",
      "Los plugins de pago se multiplican: un Jira bien configurado para 20 personas puede superar los 300 USD/mes.",
      "Licencia por usuario castiga justo a los equipos pequeños y a los consultores que rotan.",
    ],
    cuandoNoMigrar: [
      "Si tu equipo vive dentro del ecosistema Atlassian y ya tiene Confluence y Loom Contracts.",
      "Si necesitas integraciones de Jira con Salesforce o ServiceNow que no vas a replicar.",
      "Si el volumen de tickets es bajo y la herramienta no es el cuello de botella.",
    ],
    alternativas: ["redmine", "taiga", "openproject", "plane", "forgejo"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "airtable",
    nombre: "Airtable",
    vendedor: "Airtable",
    url: "https://www.airtable.com",
    categoria: "datos",
    precio: "Gratis con 1.000 registros; Team 20 USD/usuario/mes; Business 45 USD",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Hojas de cálculo con relaciones, campos de todo tipo y vistas para colaborar sin saber SQL.",
    porqueSustituir: [
      "Cada registro es una fila facturable a partir del plan gratuito: una base de clientes deja de ser gratis muy pronto.",
      "Las automatizaciones y las integraciones de Airtable son de pago y las funciones avanzadas ya no están en los planes pequeños.",
      "Tener el inventario, el CRM o el catálogo de productos en el SaaS ajeno ata tu negocio a su modelo de precios.",
    ],
    cuandoNoMigrar: [
      "Si la base es pequeña y la visibilidad compartida con clientes es el valor principal.",
      "Si el equipo ya vive en el ecosistema de Atlassian o Salesforce.",
      "Si no hay tiempo para modelar bien las relaciones entre tablas.",
    ],
    alternativas: ["nocodb", "baserow", "grist", "directus", "strapi", "teable", "appflowy", "affine"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "mailchimp",
    nombre: "Mailchimp",
    vendedor: "Intuit / Mailchimp",
    url: "https://mailchimp.com",
    categoria: "marketing",
    precio: "Gratis hasta 500 contactos; Standard 20 USD/mes; Premium 60 USD/mes",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Email marketing con plantillas, Landing pages, automatizaciones y segmentación sin conocer de email.",
    porqueSustituir: [
      "El precio se dispara justo cuando la lista crece, y los contactos más valiosos son los que ya tienes.",
      "Necesitas un doble opt-in y una base de datos de consentimiento que además de exportarse sea de tu propiedad.",
      "Las plantillas y la lógica de automatización son ataduras: salir significa reconstruir las campañas.",
    ],
    cuandoNoMigrar: [
      "Si envías pocas campañas al mes y necesitas entregabilidad gestionada sin tocar un servidor.",
      "Si no tienes tiempo para ocuparte del bounce management, SPF, DKIM y listas de bloqueo.",
    ],
    alternativas: ["listmonk", "keila", "mautic", "sendy", "ditto"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "dropbox",
    nombre: "Dropbox",
    vendedor: "Dropbox",
    url: "https://www.dropbox.com",
    categoria: "almacenamiento",
    precio: "Personal 2 TB: 11,99 USD/mes; Standard 2 TB/usuario/mes: 20 USD",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Sincronización de archivos entre dispositivos con versiones, equilibrio de equipo y sharing por enlace.",
    porqueSustituir: [
      "Los archivos compartidos con clientes tienen fecha de caducidad implícita: si el cliente deja de pagar, se bloquea el acceso.",
      "La sincronización selectiva y el versionado son siempre de pago.",
      "En un despacho o una clínica, el histórico de documentos en una nube ajena es un problema de cumplimiento, no de gusto.",
    ],
    cuandoNoMigrar: [
      "Si la mayor parte de tu equipo ya usa OneDrive o Google Drive por contrato con Microsoft.",
      "Si necesitas sharing con personas fuera de tu organización sin crearles cuentas.",
    ],
    alternativas: ["nextcloud", "seafile", "syncthing", "sftpgo", "filegator", "owncloud"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "zoom",
    nombre: "Zoom",
    vendedor: "Zoom Video Communications",
    url: "https://zoom.us",
    categoria: "comunicacion",
    precio: "Básico gratis con 40 minutos; Pro 15,99 USD/mes",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Videollamadas, webinars, Rooms y gravação en la nube con un cliente que funciona en cualquier sitio.",
    porqueSustituir: [
      "La versión gratuita corta las reuniones a 40 minutos, justo cuando tienes una sesión con clientes.",
      "Las grabaciones se quedan en una nube ajena, con la configuración de retención que marca el contrato.",
      "Cada participante cuenta como licencia en los planes de empresa: crecer de golpe duele.",
    ],
    cuandoNoMigrar: [
      "Si tus clientes entran desde dispositivos sin posibilidad de instalar nada.",
      "Si necesitas grabación, transcripción y webinars gestionados sin operar infraestructura.",
    ],
    alternativas: ["jitsi", "bigbluebutton", "nextcloud-talk", "peertube", "nextcloud"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "google-analytics",
    nombre: "Google Analytics",
    vendedor: "Google",
    url: "https://marketingplatform.google.com/about/analytics/",
    categoria: "datos",
    precio: "Gratis con límites generosos de volumen",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Analítica web gratuita con informes, embudos y audiencia, a cambio de los datos de tus visitantes.",
    porqueSustituir: [
      "Cada visita de un usuario europeo a tu web acaba en una cuenta de Google, y eso tiene implicaciones de consentimiento.",
      "Las métricas de producto (no de web) no están en el plan gratuito y en el de pago cuestan mucho.",
      "El modelo de datos no es tuyo: no puedes consultar la información con SQL ni exportarla limpia.",
    ],
    cuandoNoMigrar: [
      "Si solo necesitas saber cuántas visitas tienes y no te importa el modelo de datos.",
      "Si no vas a mirar los datos con la frecuencia suficiente como para aprender a usarlos.",
    ],
    alternativas: ["plausible", "umami", "matomo", "posthog", "goaccess"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "zapier",
    nombre: "Zapier",
    vendedor: "Zapier",
    url: "https://zapier.com",
    categoria: "marketing",
    precio: "Professional 19,99 USD/mes por tarea; Free 100 tareas/mes",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Conectores entre aplicaciones con reglas if-this-then-that, tareas programadas y webhooks.",
    porqueSustituir: [
      "Cada tarea ejecutada se factura. Un flujo que parece barato en el diagrama puede costar cientos al mes.",
      "Los datos de tu negocio (facturas, leads, tickets) pasan por el intermediario de un tercero y en el plan de pago se puede auditar.",
      "Los conectores de terceros son el punto de fallo: cuando uno cambia, tu flujo se rompe sin aviso.",
    ],
    cuandoNoMigrar: [
      "Si el número de tareas es bajo y no quieres mantener un servidor.",
      "Si dependes de conectores que no existen en la alternativa que elijas.",
    ],
    alternativas: ["n8n", "windmill", "activepieces", "huginn", "automatisch", "mautic"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "hubspot",
    nombre: "HubSpot",
    vendedor: "HubSpot",
    url: "https://www.hubspot.com",
    categoria: "crm",
    precio: "Free limitado; Starter 20 USD/mes; Pro 150 USD/mes por asiento",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "CRM con marketing, ventas, servicio al cliente y automatización en una sola plataforma.",
    porqueSustituir: [
      "El plan gratuito se queda corto en cuanto la base de clientes pasa de 1.000 contactos.",
      "El coste por asiento y por contacto crece en escalones, y el pipeline comercial se queda sin datos útiles.",
      "Los datos de tus clientes son los más sensibles que manejas y están en un CRM propietario en la nube.",
    ],
    cuandoNoMigrar: [
      "Si el CRM es un hueco para organizar y no quieres invertir en configurarlo bien.",
      "Si el equipo comercial ya usa el CRM del fabricante de los productos que vendes.",
    ],
    alternativas: ["twenty", "suitecrm", "espocrm", "odoo", "erpnext"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "github",
    nombre: "GitHub",
    vendedor: "Microsoft",
    url: "https://github.com",
    categoria: "codigo",
    precio: "Free con repositorios públicos ilimitados; Team 4 USD/usuario/mes",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Alojamiento de repositorios Git, issues, pull requests, Actions y paquetes.",
    porqueSustituir: [
      "Las Actions de GitHub consumen minutos de tu facturación y, en repositorios con mucho tráfico, se disparan.",
      "Las funcionalidades clave de CI/CD y el registro de paquetes están atados al plan de pago.",
      "Autoalojar el repositorio da control sobre las reglas de contribución, la temperatura del código y la disponibilidad.",
    ],
    cuandoNoMigrar: [
      "Si tu proyecto necesita la red social de GitHub para atraer colaboradores.",
      "Si el equipo no tiene interés en mantener un servidor, aunque sea uno pequeño.",
    ],
    alternativas: ["forgejo", "gitea", "gitlab", "woodpecker"],
    verificadoEn: "2026-10-22",
  },
  {
    slug: "canva",
    nombre: "Canva",
    vendedor: "Canva",
    url: "https://www.canva.com",
    categoria: "diseno",
    precio: "Gratis con límites; Pro 13 USD/mes; Business 30 USD/usuario/mes",
    licencia: "Propietario (SaaS en la nube)",
    resumen:
      "Editor gráfico en el navegador con plantillas, marca aplicada y colaboración en tiempo real.",
    porqueSustituir: [
      "Las plantillas y el catálogo de recursos son el producto: no puedes migrarlos, solo volver a hacerlos.",
      "El material de marca de tu empresa vive en su plataforma, y el plan de empresa es caro por usuario.",
      "Para piezas simples o exports en lote, una suite local es más rápida y no te pide una cuenta.",
    ],
    cuandoNoMigrar: [
      "Si el diseño es tu core y necesitas la biblioteca de plantillas y la IA de Canva.",
      "Si trabajas con perfiles no técnicos que no van a instalar nada.",
    ],
    alternativas: ["penpot", "excalidraw", "inkscape", "gimp", "krita"],
    verificadoEn: "2026-10-22",
  },
];

export const productBySlug = new Map(products.map((p) => [p.slug, p]));
