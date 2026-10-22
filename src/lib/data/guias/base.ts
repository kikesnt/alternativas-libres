import type { Guide } from "@/lib/types";

export const base: Guide[] = [
  {
    slug: "nextcloud-vs-google-drive",
    titulo: "Nextcloud vs Google Drive: qué ganas y qué pierdes",
    descripcion:
      "Comparamos Nextcloud y Google Drive punto por punto: ficheros, colaboración, costes, riesgos de dependencia y qué conviene para un equipo de menos de diez personas.",
    producto: "dropbox",
    alternativa: "nextcloud",
    fecha: "2026-10-12",
    lecturaMin: 9,
    secciones: [
      {
        h2: "Resumen rápido",
        parrafos: [
          "Google Drive gana en la primera curva: cero instalación, sharing por enlace inmediato y un buscador que entiende el contenido de un PDF. Nextcloud gana en todo lo que viene después: tus datos, tus reglas y tu precio.",
          "La decisión real no es técnica. Es si aceptas que el archivo que compartes con un cliente desaparece si el cliente deja de pagar, y si a tu empresa le vale eso para poder competir en un mercado de licensing.",
        ],
        lista: [
          "Si buscas operativa en 5 minutos: quédate con Google Drive.",
          "Si el contenido es sensible o el coste por usuario te duele: Nextcloud.",
          "Si tienes un solo ordenador: no migres, autoaloja un Syncthing y ahorra el problema.",
        ],
      },
      {
        h2: "Modelo de datos y ficheros",
        parrafos: [
          "Drive es un servicio de almacenamiento con permisos. Nextcloud es un sistema de ficheros con una interfaz de escritorio encima. Esa diferencia de fondo se nota en el uso diario.",
          "En Drive, el buscador indexa el contenido de los archivos. En Nextcloud tienes que instalar el indexador de texto completo, y el soporte de formatos es desigual: los PDF se indexan bien, los documentos de Office requieren el componente de Office Online Server o una conversión previa.",
          "En el lado del versionado, Drive guarda 100 versiones en planes de empresa y 30 en los personales. Nextcloud guardas tantas como el disco permita, y el plugin de versionado de Nextcloud está disponible en el cliente de escritorio.",
        ],
      },
      {
        h2: "Colaboración y sincronización",
        parrafos: [
          "El cliente de escritorio de Nextcloud sincroniza por bloques, lo que significa que si cambias un archivo en el portátil y en el NAS a la vez, se detectan los conflictos. El comportamiento por defecto es crear un archivo con el conflicto y avisar, no fusionar.",
          "Es un detalle menor hasta que ocurre en un cliente. Si tu equipo trabaja con la misma carpeta en varios sitios, conviene configurar el cliente para sincronizar con bloqueo de archivos o aceptar el modelo de conflictos.",
        ],
      },
      {
        h2: "Coste real a tres años",
        parrafos: [
          "Hagamos la cuenta para un equipo de 8 personas con 2 TB por persona. En Google Workspace Business, la cifra ronda los 22 USD por usuario al mes. Son unos 6.300 USD al año, unos 19.000 en tres años.",
          "Nextcloud en una VPS de 4 vCPU y 8 GB de RAM cuesta entre 8 y 20 USD al mes si lo alojamos bien, más el coste del almacenamiento, que es el que se dispara con las copias de seguridad. Con 16 TB de datos y snapshots, la factura realista está entre 60 y 120 USD al mes en el primer año, y baja de forma notable en los siguientes porque el almacenamiento de objetos es mucho más barato que el de los planes SaaS.",
          "El resultado: entre el 60 y el 80 por ciento menos en coste, a cambio de tu tiempo de administración. Ese intercambio solo sale bien si alguien del equipo se ocupa de las actualizaciones y de los backups.",
        ],
      },
      {
        h2: "Dependencia y salida",
        parrafos: [
          "Este es el argumento que más se repite y el que menos se documenta. Con Google Drive, la exportación se hace desde la administración de Workspace, en bloques, y lleva horas. Con Nextcloud, tus archivos están en el disco, en el formato en el que los creaste, y un `rsync` los mueve a donde quieras.",
          "Ojo con un matiz: eso no significa que los datos de Nextcloud estén a salvo por definición. Si borras un archivo por error y no tienes snapshots, lo has perdido igual. La diferencia es que el mecanismo de backup está en tus manos y no en un panel de autoservicio.",
        ],
      },
      {
        h2: "El punto dulce para equipos pequeños",
        parrafos: [
          "Para un equipo de dos a diez personas sin departamento de sistemas, la recomendación honesta es empezar con una máquina razonable y el cliente oficial, en lugar de saltar a la instalación completa de Nextcloud con Mail, Talk, Office y todas las apps de la tienda.",
          "Nextcloud funciona mejor cuando lo.limitas a su núcleo: archivos, calendario, contactos y el editor de texto. Intentar replicar Google Workspace entero en un servidor de 4 GB acaba en un sistema lento que el equipo abandona en seis semanas.",
        ],
      },
    ],
    veredicto:
      "Nextcloud es la opción correcta cuando el coste por usuario pesa, cuando hay datos que no deberían salir de tu organización, o cuando la idea de no depender de una nube ya te resulta una Mirror. No compensa si tu equipo no tiene a nadie que actualice y supervise el servidor: en ese caso, la diferencia entre Drive y una instalación mal cuidada de Nextcloud es el tiempo que pasas arreglando el servidor.",
    faq: [
      {
        q: "¿Es difícil migrar de Google Drive a Nextcloud?",
        a: "La migración de los archivos en sí es sencilla, porque Nextcloud monta el espacio como una unidad de red y puedes copiarla con rsync. Lo costoso es reasignar los permisos compartidos: las URLs de Drive dejan de funcionar y hay que comunicar los enlaces nuevos a cada persona que los tenía.",
      },
      {
        q: "¿Nextcloud sustituye a Google Workspace completo?",
        a: "Sustituye a Drive, Calendar, Contacts, Meet y Docs. No a Gmail como servidor de correo: autoalojar correo es otro proyecto, con SPF, DKIM, bloqueo de puertos 25 y reputación de IP, y no lo recomendamos como primer paso.",
      },
      {
        q: "¿Cuánta RAM necesita Nextcloud para un equipo de 10 personas?",
        a: "Con 4 GB vas sobrado para archivos y uso general. Con 8 GB vas bien si además usas Talk, el indexador de texto completo y alguna app de la tienda. A partir de ahí conviene separar la base de datos en su propio servidor.",
      },
    ],
  },
  {
    slug: "plausible-vs-umami",
    titulo: "Plausible vs Umami: analítica sin cookies",
    descripcion:
      "Plausible y Umami resuelven el mismo problema con filosofías distintas: uno prioriza la simplicidad y el otro los eventos personalizados. Comparamos instalación, recursos, datos y coste.",
    producto: "google-analytics",
    alternativa: "plausible",
    fecha: "2026-10-05",
    lecturaMin: 7,
    secciones: [
      {
        h2: "Qué miden y qué no",
        parrafos: [
          "Plausible parte de una idea: una persona visita una página, y eso es todo. Su dashboard cabe en una pantalla y responde a cinco preguntas. Umami arranca con el mismo modelo pero añade un sistema de eventos con propiedades personalizadas, goals y funnels.",
          "Si tu web es un blog, una tienda sencilla o una landing, Plausible te da todo lo que necesitas en el primer minuto. Si necesitas saber en qué paso de un registro abandonan los usuarios, necesitas Umami o cualquier otra cosa.",
        ],
      },
      {
        h2: "Instalación y recursos",
        parrafos: [
          "Ambos se despliegan con un docker-compose, pero Umami tiene una opción sin ClickHouse que arranca en un contenedor Postgres y queda limitada en retención. Esa es la vía rápida y la que recomendamos para empezar.",
          "PlausibleCommunity incluye ClickHouse en su compose. Con 2 vCPU y 4 GB de RAM funciona bien hasta volúmenes de varios millones de eventos al mes. Por debajo de eso, ambas opciones van sobradas.",
        ],
      },
      {
        h2: "Privacidad y consentimiento",
        parrafos: [
          "Ninguno de los dos pone cookies. Plausible no tiene identificadores persistentes en ningún caso, y Umami puedecookear las IP en el servidor. Esa diferencia importa: si en tu web no hay banner de cookies, es porque el script no necesita consentimiento, y eso simplifica el trabajo legal.",
          "Ten en cuenta que el hecho de que el propio script sea sin cookies no exime de declarar las Transfers de datos a tus proveedores, en concreto al servidor que hospeda la analítica y a los proveedores de infraestructura.",
        ],
      },
      {
        h2: "Modelo de licencia y coste a largo plazo",
        parrafos: [
          "Plausible Community es AGPL-3.0. Umami es MIT. Si tu objetivo es autoalojar y no vas a convertirlo en un servicio para terceros, la diferencia práctica es pequeña. Si montas una agencia y vendes la instalación a clientes, la licencia de Umami te da bastante más margen.",
          "En la nube, Plausible cuesta 9 USD al mes para 10.000 eventos mensuales, y Umami 20 USD con un panel más completar. Autoalojados, ambos cuestan lo que cuesta tu servidor, y ambos necesitan una hora al mes de mantenimiento.",
        ],
      },
      {
        h2: "Nuestro veredicto",
        parrafos: [
          "Empieza por Umami si vas a medir el comportamiento de un producto. Empieza por Plausible si lo que quieres es saber de dónde viene el tráfico de una web de contenidos, sin más.",
          "La trampa habitual es instalar analytics y no mirar nunca los datos. Con cualquiera de los dos, define antes de instalar qué tres preguntas vas a responder cada mes. Si no puedes escribir esas tres preguntas, la analítica no te va a aportar nada.",
        ],
      },
    ],
    veredicto:
      "Umami ofrece el mejor equilibrio entre potencia y licencia MIT para quien va a medir un producto. Plausible es más sencillo de explicar y de mantener, y su dashboard es el que menos tiempo de tu equipo va a consumir. Los dos cumplen con el RGPD por diseño y ninguno te obliga a mostrar un banner de cookies.",
    faq: [
      {
        q: "¿Necesito banner de cookies con Plausible o Umami?",
        a: "Para el script de analítica en sí, no: ninguno de los dos usa cookies ni identificadores persistentes. Puede que sigas necesitando banner por otras herramientas del sitio, como el chat o el seguimiento de campañas, pero la analítica no lo obliga.",
      },
      {
        q: "¿Cuál admite mejor el modo sin ClickHouse?",
        a: "Umami tiene un modo oficial sobre Postgres que cubre la mayoría de los casos. Plausible Community está construido sobre ClickHouse y la comunidad ha probado toda la stack completa.",
      },
      {
        q: "¿Puedo migrar de Google Analytics a Umami?",
        a: "Sí, con una salvedad: no se importan los datos históricos de Google Analytics de forma directa. Lo que sí se puede es importar las dimensiones de las propiedades de Google Analytics 4 para tener contexto de la medición antigua, y a partir de ahí empezar a medir con el modelo de Umami.",
      },
    ],
  },
  {
    slug: "n8n-vs-zapier",
    titulo: "n8n vs Zapier: cuánto cuesta automatizar",
    descripcion:
      "Comparamos n8n y Zapier en precio por tarea, licencia, capacidad de código y operación. Con un ejemplo real de coste anual para una PYME de servicios.",
    producto: "zapier",
    alternativa: "n8n",
    fecha: "2026-09-28",
    lecturaMin: 8,
    secciones: [
      {
        h2: "El modelo de precios es la diferencia de fondo",
        parrafos: [
          "Zapier cobra por tarea ejecutada, no por flujo. Un flujo que se ejecuta 2.000 veces al mes son 2.000 tareas. En los planes Professional, a partir de 20.000 tareas al mes el coste se dispara hasta los cientos de dólares.",
          "n8n self-hosted no cobra por tarea. Pagas el servidor una vez, que con una VPS de 4 GB cuesta entre 5 y 10 USD al mes, y ejecutas lo que necesites. Un flujo que mueve 2.000 contactos al mes cuesta lo mismo que uno que mueve veinte.",
        ],
        lista: [
          "Zapier: 19,99 USD al mes en Professional, con una cuota de tareas y coste creciente.",
          "n8n: 5 a 10 USD al mes de servidor, sin límite de ejecuciones.",
        ],
      },
      {
        h2: "El límite técnico: la caja negra",
        parrafos: [
          "En Zapier, cada paso es un conector cerrado. Si el conector no soporta el formato que necesitas, el flujo se rompe. En n8n, cualquier paso puede ser un nodo de código: JavaScript o Python, una llamada HTTP, una consulta SQL.",
          "Esto cambia el techo de lo que puedes automatizar. En un ejemplo real, un flujo que descarga el CSV de un ERP, lo limpia con una expresión regular, compara con una base de datos y carga el resultado en el CRM es en Zapier una combinación de seis tareas por fila, y en n8n es un solo nodo de código que se ejecuta en milésimas de segundo.",
          "Hay una contrapartida: en n8n, las tareas que Zapier resuelve con un clic las escribes tú. Si no sabes programar, esa barrera es real y no conviene minimizarla.",
        ],
      },
      {
        h2: "Licencia y qué implica",
        parrafos: [
          "Zapier es propietario y su contrato de servicio cambia sin previo aviso. n8n usa una Sustainable Use License, que es source available pero no OSI: puedes autoalojarlo y usarlo comercialmente, y hay condiciones si lo conviertes en un servicio de automatización multi-cliente para vender.",
          "Para una empresa que usa n8n internamente, ninguna de las dos condiciones te afecta. Para una agencia que monta flujos para clientes, conviene leer la licencia o mirar alternativas con AGPL o MIT, como Activepieces o Automatisch.",
        ],
      },
      {
        h2: "Operación y mantenimiento",
        parrafos: [
          "n8n necesita un contenedor, una base de datos y un par de actualizaciones al mes. Si ya gestionas un servidor web, es un trámite. Si no, es la primera razón por la que mucha gente acaba volviendo a Zapier.",
          "Los dos productos tienen una curva de errores: en el autoalojado veras logs; en el SaaS, si un conector falla, lo miras desde el panel. En n8n el flujo se queda en estado de error y no se reintenta solo, salvo que lo configures.",
        ],
      },
      {
        h2: "Alternativas intermedias",
        parrafos: [
          "Si quieres el precio de n8n con la facilidad de uso de Zapier, mira Activepieces (MIT, más sencillo de instalar) o Windmill (AGPL, cada paso es código y se versiona en Git). Si lo que quieres es vigilar información y recibir avisos, Huginn es más adecuado que cualquiera de los tres.",
        ],
      },
    ],
    veredicto:
      "n8n es la opción correcta cuando el volumen de tareas es alto, cuando necesitas lógica que los conectores no cubren, o cuando no quieres que el coste escale con cada cliente nuevo. Zapier sigue ganando cuando nadie del equipo quiere administrar un servidor y las automatizaciones son pocas y simples. La decisión no es técnica: es quién va a mantenerlo.",
    faq: [
      {
        q: "¿Se pueden migrar los flujos de Zapier a n8n?",
        a: "No hay migración automática. Hay que reconstruir cada flujo, pero n8n permite exportar y importar flujos en JSON, así que la migración se puede hacer de uno en uno. Lo que no se conserva son el historial de ejecuciones ni los conectores propietarios.",
      },
      {
        q: "¿Qué necesito para autoalojar n8n?",
        a: "Un servidor con Docker, 1 vCPU y 1 GB de RAM para empezar. Con 2 GB vas bien. Necesitarás un dominio y un certificado TLS, porque n8n expone las credenciales de las API en el navegador y no debe ir por HTTP plano.",
      },
      {
        q: "¿Puedo usar n8n comercialmente?",
        a: "Sí, puedes usarlo internamente en una empresa sin restricciones. La Sustainable Use License impone condiciones cuando el servicio se ofrece a terceros como una alternativa a Zapier en un modelo multi-cliente. Lee los términos vigentes antes de montarlo así.",
      },
    ],
  },
  {
    slug: "mattermost-vs-rocketchat",
    titulo: "Mattermost vs Rocket.Chat: cuál conviene",
    descripcion:
      "Comparamos las dos alternativas self-hosted más conocidas a Slack: licencia, requisitos, rendimiento, funciones de empresa y cuál escolher para un equipo de 5 a 50 personas.",
    producto: "slack",
    alternativa: "mattermost",
    fecha: "2026-09-20",
    lecturaMin: 8,
    secciones: [
      {
        h2: "Licencia: la diferencia que decide la mitad de los casos",
        parrafos: [
          "Rocket.Chat usa MIT. Eso significa que puedes autoalojarlo, modificarlo, venderlo integrado en un producto y no tienes que worry de ninguna condición comercial. Para una consultancy o una empresa que quiere construit su propia versión, es una diferencia decisiva.",
          "Mattermost licencia el servidor bajo MIT, pero las funciones de empresa (auditoría avanzada, SSO, DLP,Enforcement de retention) están en un producto de pago aparte. El software base es libre; la empresa que necesita auditoría, en un sector regulado, acaba pagando.",
        ],
      },
      {
        h2: "Requisitos de servidor",
        parrafos: [
          "Rocket.Chat se apoya en Meteor, MongoDB y RabbitMQ. Es un stack con bastante superficie de ataque y las actualizacionesMajor son delicadas: hay que leer las notas de versión porque algunas releases cambian el motor de base de datos.",
          "Mattermost usa Go, React, PostgreSQL y Elasticsearch. Es másadrado, y Elasticsearch pesa, pero su historia de actualizaciones es más estable y su documentación de operación es mucho más clara.",
          "En la práctica, 4 vCPU y 8 GB de RAM son un suelo razonable para las dos con unos pocos cientos de usuarios activos. Por debajo de eso, Mattermost aguanta mejor.",
        ],
      },
      {
        h2: "Funciones de empresa",
        parrafos: [
          "Mattermost tieneIntegraciones más Maduras: plugins, llamadas de voz con WebRTC embebido, compliance exports, SSO con SAML y SCIM, y un registro de auditoría detallado.",
          "Rocket.Chat tiene OmniBridge, que traduce en directo entre más de veinte idiomas, una función que ninguna otra alternativa open source ofrece. Para equipos con personas de habla hispana y portuguesa, es un argumento más serio de lo que parece.",
        ],
      },
      {
        h2: "Coste real",
        parrafos: [
          "Ambas se autoalojan gratis en su forma básica. La diferencia aparece en los extras: en Mattermost, el plan Enterprise cuesta por usuario al mes y hay que sumar los plugins que necesitas. En Rocket.Chat, la versión cloud de pago añade gestión, pero el self-hosting cubre mucho.",
          "Suma a eso el coste del servidor, que es el mismo en los dos casos, y el coste de las horas de alguien que se encargo de las actualizaciones. Ese último es el que de verdad decide.",
        ],
      },
      {
        h2: "Veredicto por tamaño de equipo",
        parrafos: [
          "Para un equipo de menos de diez personas, no mires ninguna de las dos: Monta Nextcloud Talk o Zulip y te ahorras el problema. Para equipos de diez a cincuenta con requisitos de auditoría, Mattermost. Para una agencia que quiere licencia limpia o un equipo multilingüe, Rocket.Chat.",
        ],
      },
    ],
    veredicto:
      "Mattermost es la opción más sólida para empresas con requisitos de cumplimiento y un equipo de sistemas que pueda operarla. Rocket.Chat gana por licencia MIT real y por OmniBridge, y es la opción más cómoda para una agencia o un equipo multilingüe. En ambos casos, la decisión se reduce a una pregunta: ¿quién hace las actualizaciones?",
    faq: [
      {
        q: "¿Cuál tiene más usuarios en producción?",
        a: "Las dos admiten cientos de usuarios concurrentes con un servidor de 8 GB de RAM. Por encima del millar de usuarios activos, hay que ir a clúster, Elasticsearch dedicado y balanceo, y ahí el coste deja de ser marginal.",
      },
      {
        q: "¿Se puede migrar el histórico de Slack?",
        a: "Las dos admiten importación del histórico, pero el resultado es un archivo plano: no conserva reacciones, hilos ni los metadatos de formato. Para un equipo pequeño suele bastar con exportar lo importante a un canal de archivo y empezar de cero.",
      },
      {
        q: "¿Rocket.Chat funciona bien en un servidor pequeño?",
        a: "Funciona, pero Meteor, MongoDB y RabbitMQ piden al menos 2 vCPU y 4 GB de RAM. Con un Raspberry Pi o una VPS de 2 GB se arrastra. Mattermost es más eficiente en recursos.",
      },
    ],
  },
];