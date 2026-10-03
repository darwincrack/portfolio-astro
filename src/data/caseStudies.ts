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
};

export const caseStudies: CaseStudy[] = [
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
    github: ""
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
    github: ""
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
    github: ""
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
    github: "https://github.com/darwincrack/wp-payment-pago-movil"
  }
];

export const caseStudyByTitle = new Map(caseStudies.map((item) => [item.title, item]));
