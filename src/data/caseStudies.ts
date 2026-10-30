export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  result: string;
  details: string;
  tags: string[];
  link: string;
  github: string;
  serviceHref: string;
  serviceLabel: string;
  // Muestra un botón que abre el asistente de la web
  tryAssistant?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "poligono-club",
    title: "Polígono Valencia — App de socios conectada a Profit",
    summary: "Socios que pagan con Pago Móvil, reservan y entran con un QR, con saldos sincronizados desde Profit.",
    problem: "El club social Polígono Valencia administra a sus socios en Profit y necesitaba que pudieran consultar su saldo, reportar pagos y reservar desde el celular, además de controlar quién entra al club, todo sin tocar su sistema administrativo.",
    solution: "Un sistema a medida sobre WordPress con una app web para socios y vigilantes. Los socios entran con su cédula, ven su saldo y su solvencia, reportan pagos con Pago Móvil, reservan áreas deportivas y sociales, anotan invitados y entran con un código QR. Los vigilantes escanean el QR en la puerta. El personal valida pagos y reservas desde un panel de administración.",
    result: "Saldos y facturas se sincronizan solos con Profit cada 5 minutos, sin modificar la contabilidad. La solvencia se muestra con un semáforo verde o rojo, los saldos se convierten con la tasa BCV del día y cada ingreso al club queda registrado.",
    details: "Integración de solo lectura con Profit (SQL Server) mediante un agente en la red del club, para no exponer la base de datos. Roles para titular, cónyuge, hijos, padres, transeúntes, vigilantes y administradores; núcleo familiar; reservas con calendario y validación de pagos; tasa BCV automática; reporte de accesos. La landing del club no es parte de este trabajo.",
    tags: ["WordPress", "PHP", "SQL Server", "Profit", "Pago Móvil", "QR"],
    link: "https://poligonovalencia.com/app",
    github: "",
    serviceHref: "/servicios/webs-y-sistemas",
    serviceLabel: "Ver webs y sistemas a medida"
  },
  {
    slug: "croplife",
    title: "CropLife — actualización de la app",
    summary: "La app educativa estaba varias versiones atrás de React Native.",
    problem: "La app educativa CropLife seguía en React Native 0.67, lejos de las versiones actuales del framework y de sus dependencias.",
    solution: "Migración a React Native 0.79.6, con refactor del código para que siguiera funcionando en iOS y Android.",
    result: "App actualizada y compatible con la versión vigente del framework y con sus librerías.",
    details: "Actualización integral de la aplicación móvil educativa CropLife, de React Native 0.67 a 0.79.6, con refactor del código y de las dependencias para iOS y Android.",
    tags: ["React Native", "iOS", "Android"],
    link: "",
    github: "",
    serviceHref: "/servicios/aplicaciones-moviles",
    serviceLabel: "Ver aplicaciones móviles"
  },
  {
    slug: "misca-studio",
    title: "Misca Studio — Optimización y conversión",
    summary: "La portada pesaba demasiado y el contacto quedaba escondido.",
    problem: "La portada dependía de Revolution Slider y un vídeo de fondo de unos 24 MB, pesado sobre todo en el móvil.",
    solution: "Hero nuevo en Elementor, vídeo reducido a unos 3,6 MB, imagen estática en móvil, LiteSpeed Cache, PHP 8.3, SEO técnico y botones de contacto.",
    result: "El vídeo de fondo pasó de unos 24 MB a unos 3,6 MB, con caché, CDN y la base técnica actualizada.",
    details: "Trabajo integral en miscastudio.com, estudio de interiorismo en Girona: nuevo hero en Elementor sin Revolution Slider, vídeo de fondo reducido de unos 24 MB a unos 3,6 MB e imagen estática en móvil; LiteSpeed Cache y QUIC.cloud (WebP, minificación, CDN); limpieza de código demo y plantillas; SEO técnico; botones de contacto (WhatsApp, email, llamada) y selector de idiomas; actualización de plugins, PHP 8.3 y eliminación de temas inactivos.",
    tags: ["WordPress", "Elementor", "LiteSpeed", "SEO", "UX"],
    link: "https://miscastudio.com/",
    github: "",
    serviceHref: "/servicios/webs-y-sistemas",
    serviceLabel: "Ver webs y sistemas a medida"
  },
  {
    slug: "pago-movil-woocommerce",
    title: "Pago Móvil para WooCommerce",
    summary: "Cobrar con Pago Móvil en una tienda WooCommerce.",
    problem: "Una tienda en Venezuela necesitaba cobrar con Pago Móvil, un método que WooCommerce no trae de serie.",
    solution: "Plugin a medida para WordPress/WooCommerce, integrado con los principales bancos venezolanos.",
    result: "El comercio puede recibir el pago por transferencia bancaria móvil desde la propia tienda.",
    details: "Plugin para WordPress/WooCommerce que implementa Pago Móvil en Venezuela. El comercio recibe el pago por transferencia bancaria móvil, integrado con los principales bancos del país.",
    tags: ["WordPress", "Plugins", "WooCommerce"],
    link: "https://iqsalud.app/tienda/",
    github: "https://github.com/darwincrack/wp-payment-pago-movil",
    serviceHref: "/servicios/webs-y-sistemas",
    serviceLabel: "Ver webs y sistemas a medida"
  },
  {
    slug: "meridiano-net",
    title: "meridiano.net",
    summary: "Portal deportivo de alto tráfico, desarrollado y mantenido durante años.",
    problem: "Los medios de Bloque de Armas necesitaban portales capaces de sostener mucho tráfico y crecer en búsqueda.",
    solution: "Dirección técnica y desarrollo de meridiano.net, el portal deportivo, junto con 2001online.com y Revista Ronda, durante varios años.",
    result: "Esas plataformas superaban el millón de visitas mensuales. El SEO y el rendimiento acompañaron un aumento del 200% en tráfico orgánico.",
    details: "Web de noticias deportivas. Desarrollo y mantenimiento durante varios años como parte de la dirección técnica de los medios de Bloque de Armas. El sitio ya fue actualizado por terceros.",
    tags: ["PHP", "JavaScript", "MySQL", "CMS"],
    link: "https://meridiano.net",
    github: "",
    serviceHref: "/servicios/webs-y-sistemas",
    serviceLabel: "Ver webs y sistemas a medida"
  },
  {
    slug: "asistente-ia-darwincd",
    title: "Asistente con IA de darwincd.com",
    summary: "Responde con la información de la web, hace las preguntas de un primer contacto y pasa el cliente a WhatsApp con un resumen.",
    problem: "Mucha gente llega con dudas antes de escribir y no siempre sabe explicar qué necesita. Quien escribe por WhatsApp sin contexto alarga la primera conversación.",
    solution: "Un asistente con IA en la propia web. Responde solo con la información del sitio (servicios, casos, preguntas frecuentes y blog), hace las preguntas que haría Darwin en un primer contacto y, cuando entiende el proyecto, prepara un mensaje de WhatsApp con el resumen para que el visitante lo envíe con un toque.",
    result: "Responde en uno o dos segundos, en español o en inglés, sin dar precios ni inventar datos. Los contactos que llegan desde el asistente se miden aparte en Analytics. Puedes probarlo en esta misma página.",
    details: "Endpoint en Vercel que consulta Gemini y devuelve la respuesta en streaming. Las instrucciones se arman con los mismos datos que muestra la web, así que el asistente se actualiza solo cuando cambia el contenido. Reglas para no dar precios ni fechas y para decir que es una IA. Protección contra abuso: solo acepta peticiones del propio dominio, límite de mensajes por visitante y por conversación. Eventos de Analytics para aperturas, mensajes y pasos a WhatsApp.",
    tags: ["IA", "Gemini", "Astro", "Vercel", "WhatsApp"],
    link: "",
    github: "",
    serviceHref: "/servicios/asistentes-ia",
    serviceLabel: "Ver asistentes con IA para negocios",
    tryAssistant: true
  }
];

export const caseStudyByTitle = new Map(caseStudies.map((item) => [item.title, item]));
