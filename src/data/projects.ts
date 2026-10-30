// Todos los proyectos del portafolio: los usa la página de Proyectos y el asistente del sitio.
import project1 from '../images/project1.avif';
import project2 from '../images/project2.avif';
import project3 from '../images/project3.avif';
import project4 from '../images/project4.avif';
import project5 from '../images/project5.avif';
import project6 from '../images/project6.avif';
import project7 from '../images/project7.avif';
import project8 from '../images/project8.avif';
import project9 from '../images/project9.avif';
import project10 from '../images/project10.avif';
import project11 from '../images/project11.avif';
import project12 from '../images/project12.avif';
import project13 from '../images/project13.avif';
import project13_1 from '../images/project13.1.avif';
import project13_2 from '../images/project13.2.avif';
import project14 from '../images/project14.avif';
import project15 from '../images/project15.avif';
import project16 from '../images/project16.avif';
import project16_1 from '../images/project16_1.avif';
import project16_2 from '../images/project16_2.avif';
import project17 from '../images/project17.avif';
import project17_1 from '../images/project17_1.avif';
import project17_2 from '../images/project17_2.avif';
import project18 from '../images/project18.avif';
import project19 from '../images/project19.avif';
import projectClarityJobs from '../images/project-clarityjobs.jpg';
import poligonoApp from '../images/poligono-app.jpg';
import poligonoReservas from '../images/poligono-reservas.jpg';
import poligonoBcv from '../images/poligono-bcv.jpg';
import asistenteIa from '../images/asistente-ia.jpg';
import asistenteIaPanel from '../images/asistente-ia-panel.jpg';
import projectsupport1 from '../images/projectsupport1.avif';

export const projects = [
  {
    title: "Asistente con IA de darwincd.com",
    description: "Responde con la información de la web, hace las preguntas de un primer contacto y pasa el cliente a WhatsApp con un resumen.",
    detailedDescription: "Asistente con IA integrado en esta web. Responde solo con la información del sitio (servicios, casos, preguntas frecuentes y blog), hace las preguntas de un primer contacto y, cuando entiende el proyecto, prepara un mensaje de WhatsApp con el resumen. Construido con Astro, un endpoint en Vercel y Gemini, con reglas para no dar precios ni fechas y protección contra abuso. Puedes probarlo con el botón de abajo a la derecha.",
    tags: ["IA", "Gemini", "Astro", "Vercel", "WhatsApp"],
    link: "",
    image: asistenteIa,
    additionalImages: [asistenteIa, asistenteIaPanel],
    priority: 0,
    github: "",
    type: "tools"
  },
  {
    title: "Polígono Valencia — App de socios conectada a Profit",
    description: "Socios que pagan con Pago Móvil, reservan y entran con un QR, con saldos sincronizados desde Profit.",
    detailedDescription: "Sistema a medida para el club social Polígono Valencia: app web para socios y vigilantes, y panel de administración. Los socios entran con su cédula, ven su saldo y solvencia, reportan pagos con Pago Móvil, reservan áreas deportivas y sociales, anotan invitados y entran con un código QR que el vigilante escanea en la puerta. Saldos y facturas se sincronizan cada 5 minutos con Profit (SQL Server, solo lectura) y los montos se convierten con la tasa BCV del día. La landing del club no es parte de este trabajo.",
    tags: ["WordPress", "PHP", "SQL Server", "Profit", "Pago Móvil"],
    link: "https://poligonovalencia.com/app",
    image: poligonoApp,
    additionalImages: [poligonoApp, poligonoReservas, poligonoBcv],
    priority: 0,
    github: "",
    type: "fullstack"
  },
  {
    title: "ClarityJobs",
    description: "Web para una consultora de empleabilidad y atracción de talento, con ofertas laborales y publicación de vacantes.",
    detailedDescription: "Landing institucional de ClarityJobs, consultora especializada en empleabilidad, desarrollo profesional y atracción de talento: presentación de servicios para postulantes y empresas, ofertas laborales, publicación de vacantes y formulario de contacto. Desarrollada en TypeScript y desplegada en servidor propio con Node.js y Nginx. Es la base del futuro portal de empleo.",
    tags: ["TypeScript", "Node.js", "Nginx"],
    link: "https://getclarityjobs.com/",
    image: projectClarityJobs,
    additionalImages: [projectClarityJobs],
    priority: 0,
    github: "",
    type: "fullstack"
  },
  {
    title: "Misca Studio — Optimización y conversión",
    description: "La portada pesaba demasiado y el contacto quedaba escondido.",
    detailedDescription: "Trabajo integral en miscastudio.com (estudio de interiorismo en Girona): nuevo hero en Elementor sin Revolution Slider, vídeo de fondo reducido de ~24 MB a ~3,6 MB e imagen estática en móvil; LiteSpeed Cache + QUIC.cloud (WebP, minificación, CDN); limpieza de código demo y plantillas; SEO técnico (lang es, datos estructurados, Polylang preparado para multidioma); CTAs flotantes (WhatsApp, email, llamada) y selector de idiomas; actualización de plugins, PHP 8.3 y eliminación de temas inactivos.",
    tags: ["WordPress", "Elementor", "LiteSpeed", "SEO", "UX"],
    link: "https://miscastudio.com/",
    image: project19,
    additionalImages: [project19],
    priority: 0,
    github: "",
    type: "support"
  },
  {
    title: "Cursos AB",
    description: "Plataforma e-learning para un curso interactivo de fundamentos de la notación musical, con venta y acceso en línea.",
    detailedDescription: "Sitio y plataforma para Cursos AB: landing optimizada, presentación multimedia del curso «Fundamentos de la Notación de la Música», cuadernos de práctica descargables, checkout con PayPal y tarjeta, y área de alumno con acceso indefinido tras el pago único.",
    tags: ["WordPress", "PHP", "E-learning", "PayPal"],
    link: "https://cursosab.com/",
    image: project18,
    additionalImages: [project18],
    priority: 1,
    github: "",
    type: "fullstack"
  },
  {
    title: "Pago Móvil para WooCommerce",
    description: "Cobrar con Pago Móvil en una tienda WooCommerce.",
    detailedDescription: "Desarrollo de un plugin personalizado para WordPress/WooCommerce que implementa el método de pago 'Pago Móvil' específico para Venezuela. El plugin permite a los comerciantes recibir pagos a través de transferencias bancarias móviles, integrando con los principales bancos venezolanos.",
    tags: ["WordPress", "Plugins", "WooCommerce"],
    link: "https://iqsalud.app/tienda/",
    image: project11,
    additionalImages: [project11],
    priority: 5,
    github: "https://github.com/darwincrack/wp-payment-pago-movil",
    type: "plugins"
  },

  {
    title: "Manual Order - Modulo para pedido simple en PrestaShop",
    description: "Módulo para PrestaShop 1.7 que sustituye el pago estándar por un flujo de captura de datos y pedido manual.",
    detailedDescription: "El cliente confirma el pedido desde el carrito, rellena un formulario de contacto (país, ciudad, nombre, email, teléfono) y el sistema crea el pedido para que el equipo de ventas cierre la compra de forma manual. Incluye reCAPTCHA opcional, validación de campos y notificaciones estándar de PrestaShop. Sin integración de pasarela de pago.",
    tags: ["PrestaShop", "PHP", "Smarty", "Módulos"],
    link: "https://www.julpin.com.co/inicio/",
    image: project17,
    additionalImages: [project17_1, project17_2],
    priority: 1,
    github: "https://github.com/darwincrack/prestashop-manual-order",
    type: "plugins"
  },

  {
    title: "CropLife — actualización de la app",
    description: "La app educativa estaba varias versiones atrás de React Native.",
    detailedDescription: "Se realizó una actualización integral de la aplicación móvil educativa CropLife, migrando el proyecto de React Native 0.67 a la versión 0.79.6. Este proceso implicó una refactorización completa del código fuente para garantizar la compatibilidad con la nueva versión del framework, así como con las últimas versiones de dependencias clave y librerías de terceros.",
    tags: ["React Native", "iOS", "Android"],
    link: "",
    image: project16_1,
    additionalImages: [project16, project16_1, project16_2],
    priority: 1,
    github: "",
    type: "mobile"
  },



  {
    title: "Plugin de WordPress para auto importar propiedades desde fuentes XML",
    description: "Importa automaticamente propiedades de diferentes fuentes XML, con un sistema de filtrado y búsqueda avanzada.",
    tags: ["WordPress", "Plugins"],
    link: "https://jonathansuarezr.com/categoria-propiedad/propiedades-en-reventa",
    image: project10,
    priority: 5,
    github: "https://github.com/darwincrack/real-estate-xml-importer",
     type: "plugins"
  },

  {
    title: "Plugin de WordPress/WooCommerce",
    description: "Sugiere la comida y cantidad adecuada para una mascota, basándose en un formulario, y genera un carrito de compra con estos productos.",
    tags: ["WordPress", "Plugins", "WooCommerce"],
    link: "https://www.bioalimento.com.mx/calculadora-de-alimentos/",
    image: project9,
    priority: 5,
    github: "https://github.com/darwincrack/wp-custom-pets-calculator",
     type: "plugins"
  },
 {
    title: "Me Link",
    description: "Gestor de enlaces con vista previa, etiquetas y búsqueda avanzada.",
    tags: ["React", "TypeScript", "Tailwind", "Supabase"],
    link: "https://melink-two.vercel.app/",
    image: project8,
    priority: 6,
    github: "https://github.com/darwincrack/melink",
     type: "fullstack"
  },
  {
    title: "Vipticket",
    description: "Sistema de gestión de eventos para venta de entradas con pasarela de pagos",
    tags: ["PHP", "MySQL", "JavaScript"],
    link: "",
    image: project1,
    priority: 1,
    github: "",
     type: "fullstack"
  },
  {
    title: "E-commerce Avisajes",
    description: "Tienda online completa con pasarela de pagos, gestión de inventario y sistema de envíos",
    tags: ["CodeIgniter", "PHP", "JavaScript", "API REST"],
    link: "https://avisajes.com",
    image: project2,
    priority: 2,
    github: "",
     type: "fullstack"
  },
  {
    title: "Ribera gestión",
    description: "Sistema de gestion inmobiliaria",
    tags: ["React", "Node", "API REST","MySQL"],
    link: "https://ribera-gestion-patrimonio.onrender.com/",
    image: project3,
    priority: 2,
    github: "",
    type: "fullstack"
  },
  {
    title: "Latampaper",
    description: "Web informativa y CMS actualizados de PHP 7.4 a PHP 8.3, sin rehacerlos.",
    tags: ["PHP", "JavaScript", "MySQL"],
    link: "https://latampaper.com",
    image: project4,
    priority: 3,
    github: "",
    type: "fullstack"
  },

  {
    title: "Focus Piedra",
    description: "Web de noticias sobre el sector de la piedra natural",
    tags: ["WordPress", "theme",'Newspaper'],
    image: project14,
    link: "https://focuspiedra.com",
    priority: 1,
    github: "",
    type: "fullstack"
  },

  {
    title: "meridiano.net",
    description: "Portal deportivo de alto tráfico, desarrollado y mantenido durante años.",
    detailedDescription: "Web de noticias deportivas. Desarrollo y mantenimiento durante varios años como parte de la dirección técnica de los medios de Bloque de Armas. El sitio ya fue actualizado por terceros.",
    tags: ["PHP", "JavaScript", "MySQL", "CMS"],
    link: "https://meridiano.net",
    image: project5,
    priority: 1,
    github: ""
  },
 {
    title: "Revista Ronda",
    description: "Web de noticias de farándula. Mantenimiento, desarrollo (backend) y administración general durante mucho tiempo. El sitio ya no está en línea.",
    tags: ["PHP", "WordPress", "MySQL", "CMS"],
    image: project6,
    priority: 1,
    github: "",
    type: "fullstack"
  },
  {
    title: "hotsswingers.com",
    description: "Red social y streaming de videos para adultos",
    tags: ["Node.js", "Laravel", "MySQL", "API REST"],
    image: project7,
    link: "https://hotsswingers.com",
    priority: 2,
    github: "",
    type: "fullstack"
  },
  {
    title: "Sistema de gestión de inventario",
    description: "Sistema de gestión de inventario",
    tags: ["PHP", "Laravel 12", "MySQL"],
    image: project12,
    link: "",
    priority: 2,
    github: "",
    type: "fullstack"
  },
  {
    title: "Implementación de reCAPTCHA Invisible",
    description: "Mitigación de spam en formulario de contacto",
    detailedDescription: "Implementación de reCAPTCHA invisible en el formulario de contacto de Máquinas de Café para prevenir el envío de spam y proteger el sistema de correo. La solución mantiene la experiencia de usuario intacta mientras proporciona una capa adicional de seguridad.",
    tags: ["Seguridad", "reCAPTCHA", "PHP", "JavaScript"],
    link: "https://maquinasdecafe.com.mx/html/forma.php",
    image: projectsupport1,
    priority: 10,
    type: "support"
  },
  {
    title: "Sistema de control de ingresos y egresos para desktop",
    description: "Sistema de control de ingresos y egresos para desktop",
    detailedDescription: "Aplicación de escritorio desarrollada con Electron para la gestión financiera empresarial. Ofrece un control completo de ingresos y egresos con una interfaz intuitiva y funcional. Diseñada para PyMEs que requieren una solución práctica y eficiente para el seguimiento de sus finanzas, sin la complejidad de sistemas más robustos.",
    tags: ["Electron", "JavaScript", "SQLite"],
    image: project13,
    additionalImages: [project13_1, project13_2,project13],
    link: "",
    priority: 1,
    github: "https://github.com/darwincrack/sistema-control-de-ingresos-y-egresos",
    type: "tools"
  },

  {
    title: "Convirtidor de imágenes en lote a webp",
    description: "Convierte .png, .jpg, .jpeg a .webp en lote",
    detailedDescription: "Herramienta en Python para convertir imágenes a formato WEBP de manera masiva, con soporte para subcarpetas, control de calidad, exclusión de archivos, logs y más. tambien se puedes decargar el .exe gratis y usarlo sin necesidad de instalar python.",
    tags: ["Python", "Webp",".exe"],
    image: project15,
    additionalImages: [project15],
    link: "",
    priority: 1,
    github: "https://github.com/darwincrack/convertir_webp",
    type: "tools"
  },

  
  
];
