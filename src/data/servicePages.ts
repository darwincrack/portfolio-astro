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
    caseSlugs: ["meridiano-net", "misca-studio"],
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
  }
];
