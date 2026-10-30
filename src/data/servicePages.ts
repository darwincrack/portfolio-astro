export type ServicePage = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  headline: string;
  lead: string;
  problem: string;
  work: string[];
  note: string;
  caseSlugs: string[];
  also: { href: string; label: string };
  // Mensaje de WhatsApp propio del servicio (si no, el genérico)
  whatsappMessage?: string;
  // Muestra un botón que abre el asistente de la web
  tryAssistant?: boolean;
};

export const servicePages: ServicePage[] = [
  {
    slug: "webs-y-sistemas",
    title: "Webs y sistemas a medida",
    seoTitle: "Webs y sistemas a medida | Darwin Cedeño",
    description: "Webs y sistemas a medida para negocios en Venezuela, Latinoamérica y España. Sitios, aplicaciones web y la lógica que una plantilla no cubre.",
    headline: "Hago webs y sistemas a medida.",
    lead: "Para negocios en Venezuela, Latinoamérica y España.",
    problem: "A veces hace falta un sitio que se entienda y cargue. Otras, un sistema con usuarios, datos y conexiones que una plantilla no trae. Las dos cosas las hago a medida.",
    work: [
      "Sitios y aplicaciones web usables en el celular y en el escritorio.",
      "Sistemas y APIs: la lógica del negocio, bases de datos, permisos e integraciones.",
      "Rendimiento y mantenimiento cuando la web ya existe y dejó de responder."
    ],
    note: "Si el encargo encaja mejor en WordPress, una tienda o un módulo concreto, también lo hago. No es por donde empiezo.",
    caseSlugs: ["poligono-club", "misca-studio", "pago-movil-woocommerce", "meridiano-net"],
    also: {
      href: "/servicios/aplicaciones-moviles",
      label: "También hago aplicaciones móviles"
    }
  },
  {
    slug: "aplicaciones-moviles",
    title: "Aplicaciones móviles",
    seoTitle: "Aplicaciones móviles a medida | Darwin Cedeño",
    description: "Aplicaciones móviles a medida para iOS y Android. Apps nuevas y actualización de las que se quedaron atrás, para negocios en Venezuela, Latinoamérica y España.",
    headline: "Hago aplicaciones móviles a medida.",
    lead: "iOS y Android, para negocios en Venezuela, Latinoamérica y España.",
    problem: "Hay apps que hay que crear desde cero, y otras que se quedaron atrás y hay que poner al día para que sigan publicándose.",
    work: [
      "Apps con React Native para iOS y Android.",
      "Actualización de aplicaciones ya publicadas.",
      "Conexión de la app con la web y los sistemas del negocio."
    ],
    note: "El mismo negocio puede necesitar la app y el sistema que hay detrás. Las dos partes las puedo hacer.",
    caseSlugs: ["croplife"],
    also: {
      href: "/servicios/webs-y-sistemas",
      label: "También hago webs y sistemas"
    }
  },
  {
    slug: "asistentes-ia",
    title: "Asistentes con IA para negocios",
    seoTitle: "Asistentes con IA para negocios | Darwin Cedeño",
    description: "Asistentes con IA para la web o el WhatsApp de tu negocio: responden con tu información, hacen las preguntas de un primer contacto y te pasan el cliente. Venezuela, Latinoamérica y España.",
    headline: "Hago asistentes con IA para negocios.",
    lead: "Responden con la información de tu negocio y te pasan los clientes listos para atender.",
    problem: "Las mismas preguntas llegan una y otra vez: qué ofreces, cómo se paga, si haces envíos, cuál es el horario. Muchas consultas llegan fuera de hora o sin decir qué necesitan, y la primera conversación se alarga.",
    work: [
      "Asistentes para tu web o tu WhatsApp que responden con la información de tu negocio, no con respuestas genéricas.",
      "Que hagan las preguntas de un primer contacto y te pasen el cliente con un resumen de lo que necesita.",
      "Conexión con tus datos (catálogo, inventario, reservas o un sistema como Profit) para responder con información al día.",
      "Reglas claras: qué puede decir y qué no, como precios o fechas, y aviso de que es una IA."
    ],
    note: "El asistente de esta web lo hice yo: pruébalo con el botón de abajo. Antes de construir uno, vemos si de verdad te conviene o si basta con una buena sección de preguntas frecuentes.",
    caseSlugs: ["asistente-ia-darwincd", "poligono-club"],
    also: {
      href: "/servicios/webs-y-sistemas",
      label: "También hago webs y sistemas"
    },
    whatsappMessage: "Hola Darwin, me interesa un asistente con IA para mi negocio.",
    tryAssistant: true
  }
];
