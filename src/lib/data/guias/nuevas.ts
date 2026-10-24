import type { Guide } from "@/lib/types";

export const nuevas: Guide[] = [
  {
    slug: "outline-vs-notion",
    titulo: "Outline vs Notion: cuándo merece la pena",
    descripcion:
      "Notion es un editor de bloques con base de datos; Outline, un editor de documentos para escribir y buscar. Comparamos datos, búsqueda, licencia y coste real.",
    producto: "notion",
    alternativa: "outline",
    fecha: "2026-10-18",
    lecturaMin: 8,
    secciones: [
      {
        h2: "El modelo de datos lo cambia todo",
        parrafos: [
          "Notion es una base de datos con editor de texto delante. Un bloque puede ser un párrafo, una tabla, una vista de calendario o una relación entre dos bases. Ese modelo es lo que lo hace potente: puedes montar un CRM, un gestor de tareas o un inventario dentro de un wiki.",
          "Outline es un editor de documentos con estructura de carpetas. No hay bases de datos ni relaciones, ni vistas calculadas, ni fórmulas. A cambio, escribir es más rápido, la navegación es predecible y la búsqueda responde mejor.",
          "La consecuencia práctica: si tu wiki es un conjunto de documentos con enlaces (guías de operación, incorporación, documentación de producto), Outline es mejor herramienta. Si tu wiki es en realidad una base de datos que además tiene documentación, Notion o un Airtable autoalojado te van a encajar mejor.",
        ],
      },
      {
        h2: "Búsqueda: la diferencia que más se nota",
        parrafos: [
          "El buscador es la función que más se usa en un wiki y la que más falla en las alternativas. Outline indexa el contenido completo de los documentos con PostgreSQL, con un resultado por documento y un fragmento con el texto coincidente.",
          "En Notion, el buscador también funciona bien, pero convive con el modelo de bases de datos: si el contenido está en tablas, la búsqueda devuelve bloques sueltos en lugar de documentos. Es el mismo resultado con una lectura menos intuitiva.",
        ],
      },
      {
        h2: "Licencia: la diferencia que puede impedirte usarlo",
        parrafos: [
          "Outline usa Business Source License 1.1. Puedes autoalojarlo y usarlo sin coste. El límite está en la cláusula de distribución: si generas ingresos por encima de un umbral concreto, la licencia cambia a una versión comercial con condiciones distintas.",
          "El número exacto importa: una empresa de 20 personas con un presupuesto de 5.000 euros al año puede quedar dentro o fuera del umbral según cómo se defina. Es un punto que hay que verificar en la versión vigente de la licencia antes de comprometer a una organización entera, y por eso la ficha marca la licencia como fuente disponible y no como open source OSI.",
        ],
      },
      {
        h2: "Instalación y operación",
        parrafos: [
          "Outline se despliega con Docker en un servicio Node y PostgreSQL. La documentación oficial cubre el caso básico y el docker-compose está listo. Un servidor de 2 vCPU y 4 GB de RAM es suficiente para un equipo de veinte personas.",
          "Comparado con Notion, que no requiere ningún servidor, la diferencia es que ahora hay que actualizar, hacer copias de seguridad y renovar certificados. Si nadie del equipo asume esa tarea, el wiki se queda sin actualizar en seis meses y la migración no compensa.",
        ],
      },
      {
        h2: "Alternativa intermedia: AFFiNE",
        parrafos: [
          "Si lo que te atrae de Notion es la mezcla de documento y pizarra con licencia más permisiva, AFFiNE es el término medio: núcleo MIT, autoalojamiento con Docker y edición colaborativa. Es más joven y menos pulido que Outline, pero la licencia es de las pocas que no dan problemas en una empresa.",
        ],
      },
    ],
    veredicto:
      "Outline es mejor que Notion para escribir y buscar documentación, y peor en todo lo demás. Sustituye a Notion con confianza cuando tu wiki es un conjunto de documentos vivos y tu equipo tiene a alguien que mantenga el servidor. Si tu wiki es en realidad una base de datos, no migres: autoaloja NocoDB o Teable y deja Notion para lo que sí es de bloques.",
    faq: [
      {
        q: "¿Se pueden migrar las bases de datos de Notion a Outline?",
        a: "No de forma automática. Las bases de datos de Notion no tienen equivalente en Outline porque son un modelo de datos, no un formato de documento. Lo que sí puedes exportar es el contenido en Markdown e importarlo como páginas, pero se pierde la estructura de relaciones.",
      },
      {
        q: "¿Qué licencia tiene Outline exactamente?",
        a: "Business Source License 1.1. Permite uso interno y autoalojado. La distribución comercial del producto o su uso como servicio a terceros cambia las condiciones, y hay un umbral de ingresos que dispara el cambio. Consulta la versión vigente de la licencia antes de decidir.",
      },
      {
        q: "¿Outline tiene aplicación móvil?",
        a: "Tiene cliente de escritorio y la web se puede instalar como PWA en el móvil. No existe app nativa en App Store ni Play Store, que es la diferencia práctica frente a Notion para quien trabaja desde el teléfono.",
      },
    ],
  },
  {
    slug: "twenty-vs-hubspot",
    titulo: "Twenty vs HubSpot: un CRM en tu servidor",
    descripcion:
      "Comparamos el CRM open source Twenty con HubSpot: modelo de datos, correos, coste por asiento y qué pasa con los datos de tus clientes al autoalojar.",
    producto: "hubspot",
    alternativa: "twenty",
    fecha: "2026-10-16",
    lecturaMin: 8,
    secciones: [
      {
        h2: "No son el mismo producto",
        parrafos: [
          "HubSpot es una plataforma comercial que va de CRM a marketing, ventas y servicio al cliente, con su propio ecosistema de plantillas, secuencias, flujos de trabajo y un mercado de integraciones. Twenty es un CRM con un núcleo mucho más pequeño: contactos, empresas, oportunidades, tareas, notas y correos.",
          "Compararlos como sustitutos equivalentes es un error. La pregunta correcta es qué parte de HubSpot usas realmente. Si es el CRM básico más algún correo, Twenty te cubre. Si el equipo depende de secuencias, de la atribución de marketing o de la mesa de ayuda integrada, la migración no tiene destino.",
        ],
      },
      {
        h2: "Modelo de datos y objetos personalizados",
        parrafos: [
          "Twenty organiza los datos en objetos con campos personalizados: contacto, empresa, oportunidad, tarea, nota, mensaje y objetos personalizados. Las relaciones entre ellos son de primer nivel y la API es abierta y documentada.",
          "HubSpot permite crear propiedades personalizadas, pero su precio sube según el número de propiedades y de hubs añadidos. En una PYME que ha crecido, el modelo de HubSpot empieza a fragmentar la información en objetos que nadie sabe qué son.",
        ],
      },
      {
        h2: "El coste, a tres años",
        parrafos: [
          "HubSpot Professional cuesta 150 USD por usuario y mes. Para un equipo comercial de 8 personas, son 1.200 USD al mes, casi 15.000 al año, y en un plan Enterprise por encima de cinco usuarios el número se dispara por contactos, no por usuarios.",
          "Twenty autoalojado cuesta el precio de un servidor: 10 USD al mes en una VPS decente para un equipo de diez. Sumando el tiempo de mantenimiento, que es de unas cuatro horas al mes, el ahorro es de más del 95 por ciento.",
          "El coste que no aparece en la factura es la migración: exportaciones, campos, historial y en el caso de HubSpot, los flujos de trabajo y correos que hay que reconstruir a mano.",
        ],
      },
      {
        h2: "Los datos de tus clientes",
        parrafos: [
          "Este es el argumento que más pesa en un sector regulado. En HubSpot, la base de clientes completa vive en un SaaS en Estados Unidos con la correspondiente transferencia internacional. Autoalojar no elimina la necesidad de un acuerdo de encargo de tratamiento, pero sí te da el control de dónde está el dato y de quién lo procesa.",
        ],
      },
      {
        h2: "El estado del proyecto",
        parrafos: [
          "Twenty es un proyecto joven y en desarrollo intenso. Eso significa que la interfaz es de las mejores que vas a ver en un CRM autoalojado, y también que el autoalojamiento va por detrás de la versión en la nube y que hay que acompañar las actualizaciones con atención.",
          "Para un equipo que crece rápido, eso puede ser una ventaja: la hoja de ruta la marca la comunidad. Para un equipo que necesita estabilidad a cinco años vista, conviene mirar alternativas más maduras como EspoCRM o SuiteCRM, con la contrapartida de una interfaz bastante menos cuidada.",
        ],
      },
    ],
    veredicto:
      "Twenty es la opción si tu CRM es un CRM de verdad, con contactos, empresas y embudo, y si el coste por usuario o el control sobre los datos de tus clientes es un problema. Si lo que necesitas es automatización de marketing, mesa de ayuda o secuencias, no busques un sustituto de HubSpot: busca una alternativa a cada pieza, que es un proyecto distinto.",
    faq: [
      {
        q: "¿Se puede migrar de HubSpot a Twenty?",
        a: "HubSpot permite exportar contactos, empresas y oportunidades en CSV, y Twenty tiene un importador para ese formato. Lo que no se migra automáticamente son los flujos de trabajo, las plantillas de correo, los permisos y el historial de actividad. La migración de un CRM con años de uso real es un proyecto de varias semanas.",
      },
      {
        q: "¿Twenty incluye envío de correos?",
        a: "Sí, tiene un objeto de correo con plantillas y envío, y se integra con proveedores de correo transaccional. No es un sustituto de una plataforma de automatización de marketing con segmentación y automatizaciones: para eso, Mautic.",
      },
      {
        q: "¿Cuántos usuarios aguanta en un servidor normal?",
        a: "Con 2 vCPU y 4 GB de RAM un equipo de entre 10 y 20 usuarios va sobrado, porque la carga real de un CRM autoalojado la genera el navegador, no el servidor. A partir de ahí, con una VPS de 8 GB de RAM vas bien sin problemas",
      },
    ],
  },
  {
    slug: "plane-vs-jira",
    titulo: "Plane vs Jira: tickets sin pagar por asiento",
    descripcion:
      "Jira cuesta desde 8,50 USD por usuario y mes; Plane se autoaloja por el precio de un servidor. Comparamos flujo, Scrum, plugins y coste real.",
    producto: "jira",
    alternativa: "plane",
    fecha: "2026-10-14",
    lecturaMin: 7,
    secciones: [
      {
        h2: "La diferencia de precio empieza en el umbral",
        parrafos: [
          "El plan Standard de Jira cuesta 8,50 USD por usuario y mes y el Premium 17. En un equipo de 15 personas, el Premium son 3.060 USD al año, y en una agencia con 30 usuarios se acerca a los 6.000.",
          "Plane en un servidor de 4 GB cuesta unos 8 USD al mes. La diferencia no es marginal: es la diferencia entre una herramienta que se justifica sola y una que hay que defender cada trimestre.",
        ],
      },
      {
        h2: "Flujo de trabajo y Scrum",
        parrafos: [
          "Jira es un sistema de tickets con un motor de flujos de trabajo muy potente, heredado de su historia como herramienta de desarrollo. Es flexible casi hasta lo absurdo, y esa flexibilidad es a la vez su mejor y su peor propiedad: montar un flujo de trabajo decente lleva días.",
          "Plane viene con una opinión ya resuelta: ciclos, módulos, estados estándar y una vista de lista, tablero y calendario que funcionan sin configuración. Es la experiencia que la mayoría de equipos quiere y no siempre tenía.",
        ],
      },
      {
        h2: "Lo que Plane no tiene",
        parrafos: [
          "No hay plugins de terceros en la misma medida, ni integraciones con Confluence, ni JQL, ni campos a nivel de base de datos, ni un historial de auditoría de empresa. Si tu operación depende de todo eso, no es el sustituto.",
          "Plane sí incluye un subconjunto interesante: páginas con editor, un Intake para que cualquiera de la empresa registre una petición, paneles e integraciones con GitHub, GitLab y Slack.",
        ],
      },
      {
        h2: "Riesgos del estado del proyecto",
        parrafos: [
          "Plane es AGPL-3.0 y de desarrollo muy intenso, con versiones frecuentes. Eso significa que vas a tener que actualizar a menudo y que la API puede cambiar entre versiones. Para un equipo técnico, leer el registro de cambios antes de actualizar es obligatorio.",
          "El autoalojamiento va por detrás de la nube. Es un patrón común en proyectos de este tamaño y conviene tenerlo presente: estás usando la versión que la comunidad puede tocar, no la que el equipo de la empresa prioriza.",
        ],
      },
      {
        h2: "Alternativas según el perfil",
        parrafos: [
          "Si tu equipo es técnico y quiere gestión de incidencias sin más, Forgejo o Gitea resuelven el 80 por ciento del caso por cero euros. Si necesitas wiki, horas y documentos junto a los tickets, OpenProject es el más completo aunque el más pesado. Si el flujo de trabajo heredado es complejo, Redmine sigue siendo sorprendentemente competente.",
        ],
      },
    ],
    veredicto:
      "Plane es la mejor relación entre coste y experiencia para un equipo que quiere un gestor de tickets moderno sin pagar por asiento. Paga el precio en flexibilidad de flujos de trabajo y en plugins: si tu proceso ya está automatizado con reglas complejas, la migración cuesta más de lo que ahorra.",
    faq: [
      {
        q: "¿Plane sustituye a Confluence?",
        a: "Parcialmente. Plane incluye páginas con editor colaborativo, que cubren documentación de producto y notas de versión. No tiene wikis con permisos heredados, macros ni historial de versiones por página como Confluence. Para documentación de producto, la diferencia suele ser aceptable.",
      },
      {
        q: "¿Puedo importar los tickets de Jira?",
        a: "Jira permite exportar a CSV y Plane tiene un importador de CSV, que se queda con los campos estándar: título, descripción, estado, tipo, asignado y etiquetas. Los campos personalizados, los comentarios y los adjuntos se pierden o hay que migrarlos con la API.",
      },
      {
        q: "¿Qué licencia tiene Plane y me deja usarlo en una empresa?",
        a: "AGPL-3.0. Usarlo internamente en tu empresa no tiene ninguna restricción. Si lo expones como servicio a terceros o lo modificas y lo sirves por red, las obligaciones de la AGPL aplican. No es un problema para un uso interno normal.",
      },
    ],
  },
  {
    slug: "listmonk-vs-mautic",
    titulo: "Listmonk vs Mautic: newsletter o plataforma",
    descripcion:
      "Mautic sustituye a Mailchimp con automatizaciones; Listmonk es un servidor de envío sencillo. Comparamos entregabilidad, recursos y coste.",
    producto: "mailchimp",
    alternativa: "listmonk",
    fecha: "2026-10-11",
    lecturaMin: 7,
    secciones: [
      {
        h2: "Son dos problemas distintos",
        parrafos: [
          "Mautic es una plataforma de automatización de marketing: campañas, formularios, páginas de aterrizaje, puntuación de contactos, seguimiento de visitantes y flujos que reaccionan al comportamiento. Sustituye a Mailchimp en su faceta más potente.",
          "Listmonk es un servidor de newsletters. Envía campañas con plantillas, segmentos, doble opt-in y estadísticas. No tiene automatizaciones, ni formularios conectados ni puntuación de contactos. Intenta hacer bien una cosa.",
          "Si tu necesidad es «publicar un newsletter cada dos semanas», Listmonk sobra. Si es «cuando un usuario abandona el carrito, dispararle una secuencia de tres correos», necesitas Mautic o una alternativa de pago.",
        ],
      },
      {
        h2: "Entregabilidad: donde se juega la partida",
        parrafos: [
          "Ninguno de los dos te salva de una mala reputación de IP. Lo que decide es que puedas gestionar SPF, DKIM y DMARC, y que el doble opt-in y la lista de bajas se gestionen sin un panel que te empuje a hacer clic en botones de «descartar todos».",
          "Listmonk pone eso en el camino corto: SMTP, doble opt-in y un importador de Mailchimp que se lleva la base y las etiquetas. Mautic añade la gestión de bounces y de supresión, que es lo que de verdad hay que vigilar a medio plazo.",
        ],
      },
      {
        h2: "Recursos y operación",
        parrafos: [
          "Listmonk es un binario Go y un PostgreSQL. Con 1 vCPU y 1 GB de RAM va sobrado para una lista de 100.000 suscriptores si el envío se delega a un proveedor externo como Amazon SES o Mailgun.",
          "Mautic es PHP, Symfony, MySQL, Redis y una cola de trabajos. Necesita 2 vCPU y 4 GB de RAM como mínimo, y sobre todo necesita un cron bien configurado para los envíos segmentados. No es un problema cuando lo montas bien, y un problema serio cuando lo montas en un hosting compartido.",
        ],
      },
      {
        h2: "Coste real a escala",
        parrafos: [
          "Mailchimp cobra por contactos, y el plan gratis tiene un tope de 500. A 5.000 contactos, el precio se dispara hasta un punto en el que ya no tiene sentido. En Listmonk el coste es tu servidor más el proveedor de correo, y el proveedor cobra por mensajes enviados, no por contactos: enviar a los mismos 5.000 contactos cada mes cuesta lo mismo en las dos plataformas.",
          "La diferencia real está en el coste de entrada: con Listmonk montas el sistema en una tarde. Con Mautic, la primera semana se va en entender la documentación y configurar las automatizaciones.",
        ],
      },
      {
        h2: "Una tercera vía: Ditto",
        parrafos: [
          "Si quieres algo todavía más sencillo que Listmonk, Ditto es un editor de newsletters con previsualización y métricas de apertura y clics, también autoalojable y con licencia MIT. El editor es más cuidado que el de Listmonk y el catálogo de funciones es más corto.",
        ],
      },
    ],
    veredicto:
      "Listmonk es la opción cuando el correo es un newsletter y no una máquina de automatización: monta en una tarde, cuesta un servidor y escala bien. Mautic tiene sentido cuando el correo es el motor de tu negocio, porque es donde sus automatizaciones pagan el coste de montarlo. Intentar usar Listmonk para automatizar es el error más común.",
    faq: [
      {
        q: "¿Puedo migrar mis contactos de Mailchimp?",
        a: "Sí. Listmonk tiene un importador específico de Mailchimp que se lleva contactos, etiquetas y el estado de suscripción. Después, configura el doble opt-in y valida las listas antes del primer envío: arrastrar una lista comprada es la forma más rápida de acabar en la carpeta de spam.",
      },
      {
        q: "¿Listmonk envía los correos o solo los prepara?",
        a: "Prepara y envía. Puede usar un SMTP externo (Amazon SES, Mailgun, Postmark) o su propio servidor SMTP. Lo recomendable es lo primero: las IP de envío de un VPS pequeño casi nunca construyen reputación con los proveedores de correo grandes.",
      },
      {
        q: "¿Mautic es más difícil de montar que Listmonk?",
        a: "Sí, y la diferencia principal no es el software sino los componentes: Mautic necesita MySQL, Redis, una cola y un cron para los envíos programados. Listmonk solo necesita PostgreSQL. Si tu hosting no permite cron, Mautic es un problema desde el primer día.",
      },
    ],
  },
  {
    slug: "gitea-vs-forgejo",
    titulo: "Gitea vs Forgejo: dos forks ya distintos",
    descripcion:
      "Gitea y Forgejo nacieron del mismo código. Comparamos gobernanza, licencias, comunidad, ritmo de versiones y cuál elegir para tus repositorios.",
    producto: "github",
    alternativa: "forgejo",
    fecha: "2026-10-08",
    lecturaMin: 6,
    secciones: [
      {
        h2: "El punto de partida",
        parrafos: [
          "Forgejo es un fork de Gitea creado en 2022 por la comunidad de Gitea cuando la empresa china detrás del proyecto cambió su rumbo. Los dos proyectos siguen siendo software libre y ambos están escritos en Go y son muy ligeros: 1 vCPU y 1 GB de RAM bastan para autoalojar cualquiera de los dos.",
          "Lo que cambió fue la gobernanza. Forgejo está gestionado por la Fundación Codeberg, una organización sin ánimo de lucro europea que también gestiona el propio Codeberg. Gitea está gobernado por la empresa Gitea Ltd, que lo desarrolla y ofrece una versión en la nube de pago.",
        ],
      },
      {
        h2: "Licencias",
        parrafos: [
          "Forgejo usa MIT. Gitea usa MIT en la versión normal y una licencia de la empresa para las ediciones Enterprise con funciones adicionales de administración. En el uso autoalojado habitual, la diferencia práctica es mínima: los dos se pueden autoalojar sin pagar nada.",
        ],
      },
      {
        h2: "Comunidad y ritmo de desarrollo",
        parrafos: [
          "Forgejo recibe más actividad de merge por mes y publica versiones con regularidad, incluyendo versiones de soporte largo. Gitea sigue con un desarrollo más tranquilo y con versiones menos frecuentes, y su empresa prioriza sobre todo su producto en la nube.",
          "Para un equipo que quiere contribuir al proyecto, las dos comunidades son receptivas. Para un equipo que quiere simplemente que su servidor de código funcione durante años, la diferencia la marca el soporte: quien paga la edición Enterprise de Gitea tiene acceso a soporte, y quien no, depende de la comunidad.",
        ],
      },
      {
        h2: "Qué pasa con tus repositorios",
        parrafos: [
          "Migrar de GitHub a cualquiera de los dos es fácil con git: cambias el remoto y empujas. Migrar de Gitea a Forgejo o al revés también es un push. Lo que no se migra con el push son las incidencias, los pull requests, los wikis y las versiones, para los que hay scripts de migración de la comunidad.",
          "Los repositorios no son el activo crítico. El activo crítico es el historial: si tus proyectos llevan años en un servidor. Asegúrate de que la copia de seguridad del repositorio git completo está verificada y probada, porque el historial no se regenera.",
        ],
      },
      {
        h2: "CI/CD incluido",
        parrafos: [
          "Ambos incluyen un runner de Actions integrado. Para pipelines sencillos, Woodpecker CI es una alternativa ligera y con licencia Apache-2.0, y funciona con los dos como fuente de repositorios.",
        ],
      },
    ],
    veredicto:
      "Forgejo es la opción más segura por defecto: licencia MIT limpia, gobernanza de una fundación sin ánimo de lucro y más actividad. Gitea tiene sentido si ya lo usas, si quieres la versión Enterprise de pago con soporte, o si tu equipo tiene lazos con su empresa. Para empezar de cero, Forgejo.",
    faq: [
      {
        q: "¿Cuál usa menos recursos?",
        a: "Prácticamente los mismos: los dos están escritos en Go, usan SQLite por defecto y funcionan con 1 vCPU y 1 GB de RAM. La diferencia de rendimiento real es marginal y no debería ser el criterio de decisión.",
      },
      {
        q: "¿Puedo migrar mis repositorios de GitHub a Forgejo?",
        a: "Sí, con la herramienta de línea de comandos de Forgejo, que copia repositorios, incidencias, versiones y wiki, y además marca los repositorios como espejo de GitHub para que se sincronicen. Los pull requests no se migran porque en GitHub son un objeto distinto al de las incidencias.",
      },
      {
        q: "¿Merece la pena autoalojar el código en lugar de usar GitHub?",
        a: "Para equipos pequeños, rara vez por motivos técnicos: GitHub es gratis, rápido y todo el mundo sabe usarlo. Autoalojar compensa si necesitas control sobre las reglas de contribución, si trabajas con datos que no pueden salir, o si el coste de las Actions y del registro de paquetes empieza a notarse en la factura.",
      },
    ],
  },
  {
    slug: "penpot-vs-canva",
    titulo: "Penpot vs Canva: interfaces o marketing",
    descripcion:
      "No son sustitutos directos. Comparamos Penpot y Canva por uso real, diseño de interfaces, formatos de archivo y coste por usuario.",
    producto: "canva",
    alternativa: "penpot",
    fecha: "2026-10-04",
    lecturaMin: 6,
    secciones: [
      {
        h2: "Son dos mercados distintos",
        parrafos: [
          "Canva es una herramienta de comunicación visual: plantillas, redes sociales, presentaciones, flyers y vídeos cortos. Su competidor es la suite ofimática de Microsoft y los bancos de imágenes, no un editor de interfaces.",
          "Penpot es un editor de interfaces: vectores, componentes, estilos, prototipos y entrega a desarrollo con especificación. Su competidor directo es Figma, y ahí la comparación sí tiene sentido.",
          "Por eso la pregunta útil no es «Penpot o Canva», sino «qué necesitas hacer y quién lo va a hacer». Si el equipo de marketing hace flyers y lo que quieres es quitarse la cuota por usuario, Canva se sustituye por Inkscape o GIMP. Si el equipo de producto hace interfaces, lo que necesitas es un sustituto de Figma.",
        ],
      },
      {
        h2: "Licencia y formato",
        parrafos: [
          "Penpot se publica bajo MPL-2.0 y usa SVG como formato nativo, lo que significa que el archivo que exportas no depende de una aplicación concreta. Canva no es open source: los diseños que haces están en su plataforma y el formato de exportación es PNG, JPG, PDF o MP4.",
          "Para un equipo de diseño que entrega a desarrollo, la diferencia de SVG es estructuralmente importante: los iconos y vectores se pueden versionar en el repositorio de código y revisar con un diff.",
        ],
      },
      {
        h2: "Recursos y despliegue",
        parrafos: [
          "Penpot se despliega con Docker y necesita PostgreSQL, Redis y Nginx. Con 2 vCPU y 4 GB de RAM va bien para un equipo de diseño de diez personas, pero es una instalación con más piezas de las que parece.",
          "Canva no necesita nada, y esa es su ventaja real. Todo el coste de Penpot es el tiempo de alguien que lo mantenga. Para un estudio de diseño con un cliente que exige autoalojo, ese coste se justifica; para una asesoría de dos personas, no.",
        ],
      },
      {
        h2: "Lo que Penpot no tiene",
        parrafos: [
          "No hay biblioteca de plantillas, ni stock de fotos, ni generación de imágenes con IA, ni editor de vídeo, ni las herramientas de texto inteligente de Canva. Tampoco hay una versión de escritorio: Penpot es web, y el diseño offline de Figma tampoco existe todavía.",
          "Para la entrega a desarrollo, Penpot aporta algo que Canva no: el handoff con inspección, medidas, variables y exportación de tokens. Es la diferencia entre una herramienta de comunicación visual y una herramienta de diseño de producto.",
        ],
      },
      {
        h2: "El plan de migración realista",
        parrafos: [
          "Si lo que haces son piezas de marketing, el salto a un editor de escritorio libre funciona: Inkscape para vector, GIMP para imagen, Excalidraw para diagramas. La curva de aprendizaje es de un fin de semana y el resultado no tiene plantillas.",
          "Si lo que haces son interfaces, el salto a Penpot es directo y el ahorro es inmediato: 0 frente a 15 USD por usuario y mes en el plan de negocio de Canva. Lo que cuesta es adaptar el flujo de trabajo a un editor sin plantillas.",
        ],
      },
    ],
    veredicto:
      "Penpot sustituye a Figma en diseño de interfaces y a nada en marketing. Si estás pagando Canva por siete personas que hacen flyers, la solución no es Penpot: es un editor de escritorio libre más una biblioteca de plantillas interna. Si estás pagando Canva por un equipo de producto, el problema real es que no estabas usando la herramienta correcta, y Penpot es la respuesta.",
    faq: [
      {
        q: "¿Se pueden abrir los diseños de Canva en Penpot?",
        a: "No directamente. Canva exporta en PNG, JPG, PDF o MP4, y Penpot abre SVG o formatos vectoriales. El flujo posible es exportar desde Canva a PDF o SVG y reconstruir a mano en Penpot, que para un sistema de diseño completo significa rehacer el trabajo, no migrarlo.",
      },
      {
        q: "¿Penpot tiene plantillas?",
        a: "No tiene biblioteca de plantillas, pero sí un sistema de componentes y estilos reutilizables, que es la solución real para quien diseña producto: en lugar de copiar una tarjeta de otro proyecto, creas un componente con sus variantes y lo reutilizas.",
      },
      {
        q: "¿Merece la pena el autoalojo para un estudio de diseño?",
        a: "Si tienes clientes con requisitos de confidencialidad, sí. Autoalojar garantiza que los diseños de un cliente no están en la plataforma de una empresa de terceros. Si no, la edición en la nube de Penpot te ahorra el mantenimiento y es una opción legítima.",
      },
    ],
  },
];
