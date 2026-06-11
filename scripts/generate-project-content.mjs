import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../src/content/projects');

const projects = [
  {
    slug: 'misca-studio',
    title: 'Misca Studio — Optimización y conversión',
    description:
      'Plan integral de rendimiento, SEO técnico, UX y seguridad para miscastudio.com: hero ligero, caché LiteSpeed, PHP 8.3 y CTAs de contacto.',
    priority: 0,
    type: 'support',
    link: 'https://miscastudio.com/',
    github: '',
    tags: ['WordPress', 'Elementor', 'LiteSpeed', 'SEO', 'UX'],
    coverImage: 'project19',
    gallery: ['project19'],
    body: `Trabajo integral en [miscastudio.com](https://miscastudio.com/), estudio de interiorismo en Girona, para lograr una web más rápida, estable y orientada a la conversión en escritorio y móvil.

## Rendimiento y velocidad de carga

- Nuevo hero en Elementor sin Revolution Slider: título y lema sobre el vídeo, más rápido y estable.
- Vídeo optimizado en escritorio (~3,6 MB frente a ~24 MB). En móvil, imagen estática en lugar de vídeo.
- LiteSpeed Cache + QUIC.cloud: caché, minificación, imágenes WebP y fuentes optimizadas.
- Limpieza de bloques y estilos antiguos que ralentizaban la home.

## SEO técnico

- Limpieza de remanentes de plantilla y código oculto.
- Etiquetado de idioma correcto (\`lang="es"\`).
- Polylang preparado y configurado para URL multiidioma.
- Eliminación completa de contenido demo (thin content).
- Marcado de datos estructurados implementado.

## UX y conversión

- Botón flotante con WhatsApp, email y llamada.
- Selector de idiomas separado visualmente del menú principal.
- Hero reestructurado con CTA sólidos y llamativos.

## Seguridad y mantenimiento

- Plugins actualizados (mayo 2026).
- PHP actualizado a 8.3.
- Solo el tema activo; eliminación de temas inactivos.
- Caché de página y navegador con LiteSpeed, reforzada por CDN QUIC.cloud en Hostinger.

## Resultado

Menos tiempo de carga, portada ordenada desde el primer segundo, menor gasto de datos en móvil y acceso claro a servicios, proyectos, blog y contacto. Mejor experiencia para el usuario y señales positivas para SEO local en Girona y Costa Brava.`,
  },
  {
    slug: 'cursos-ab',
    title: 'Cursos AB',
    description:
      'Plataforma e-learning para un curso interactivo de fundamentos de la notación musical, con venta y acceso en línea.',
    priority: 1,
    type: 'fullstack',
    link: 'https://cursosab.com/',
    github: '',
    tags: ['WordPress', 'PHP', 'E-learning', 'PayPal'],
    coverImage: 'project18',
    gallery: ['project18'],
    body: `Sitio y plataforma para [Cursos AB](https://cursosab.com/): curso en línea «Fundamentos de la Notación de la Música».

## Qué incluye

- Landing optimizada con presentación multimedia del curso.
- Cuadernos de práctica descargables y materiales de estudio.
- Checkout con PayPal y tarjeta de crédito/débito.
- Área de alumno con acceso indefinido tras pago único.

## Enfoque del producto

Curso interactivo y práctico para aprender lectura y escritura musical desde cero, con contenido ilustrado, sonidos e imágenes, y progresión gradual paso a paso.`,
  },
  {
    slug: 'wp-payment-pago-movil',
    title: 'Plugins de WordPress/ Woocommerce',
    description: "Para crear un nuevo metodo de pago venezolano 'pago Movil'",
    priority: 5,
    type: 'plugins',
    link: 'https://iqsalud.app/tienda/',
    github: 'https://github.com/darwincrack/wp-payment-pago-movil',
    tags: ['WordPress', 'Plugins', 'WooCommerce'],
    coverImage: 'project11',
    gallery: ['project11'],
    body: 'Desarrollo de un plugin personalizado para WordPress/WooCommerce que implementa el método de pago Pago Móvil específico para Venezuela. El plugin permite a los comerciantes recibir pagos a través de transferencias bancarias móviles, integrando con los principales bancos venezolanos.',
  },
  {
    slug: 'prestashop-manual-order',
    title: 'Manual Order - Modulo para pedido simple en PrestaShop',
    description:
      'Módulo para PrestaShop 1.7 que sustituye el pago estándar por un flujo de captura de datos y pedido manual.',
    priority: 1,
    type: 'plugins',
    link: 'https://www.julpin.com.co/inicio/',
    github: 'https://github.com/darwincrack/prestashop-manual-order',
    tags: ['PrestaShop', 'PHP', 'Smarty', 'Módulos'],
    coverImage: 'project17',
    gallery: ['project17', 'project17_1', 'project17_2'],
    body: 'El cliente confirma el pedido desde el carrito, rellena un formulario de contacto (país, ciudad, nombre, email, teléfono) y el sistema crea el pedido para que el equipo de ventas cierre la compra de forma manual. Incluye reCAPTCHA opcional, validación de campos y notificaciones estándar de PrestaShop. Sin integración de pasarela de pago.',
  },
  {
    slug: 'croplife-react-native',
    title: 'Actualización de react native desde la version 0.67 a la 0.79.6',
    description: 'Mejora y actualización de la App Educativa CropLife',
    priority: 1,
    type: 'mobile',
    link: '',
    github: '',
    tags: ['React Native', 'iOS', 'Android'],
    coverImage: 'project16_1',
    gallery: ['project16', 'project16_1', 'project16_2'],
    body: 'Se realizó una actualización integral de la aplicación móvil educativa CropLife, migrando el proyecto de React Native 0.67 a la versión 0.79.6. Este proceso implicó una refactorización completa del código fuente para garantizar la compatibilidad con la nueva versión del framework, así como con las últimas versiones de dependencias clave y librerías de terceros.',
  },
  {
    slug: 'wp-xml-importer',
    title: 'Plugin de WordPress para auto importar propiedades desde fuentes XML',
    description:
      'Importa automaticamente propiedades de diferentes fuentes XML, con un sistema de filtrado y búsqueda avanzada.',
    priority: 5,
    type: 'plugins',
    link: 'https://jonathansuarezr.com/categoria-propiedad/propiedades-en-reventa',
    github: 'https://github.com/darwincrack/real-estate-xml-importer',
    tags: ['WordPress', 'Plugins'],
    coverImage: 'project10',
    gallery: ['project10'],
    body: 'Importa automáticamente propiedades de diferentes fuentes XML, con un sistema de filtrado y búsqueda avanzada.',
  },
  {
    slug: 'wp-pets-calculator',
    title: 'Plugin de WordPress/WooCommerce',
    description:
      'Sugiere la comida y cantidad adecuada para una mascota, basándose en un formulario, y genera un carrito de compra con estos productos.',
    priority: 5,
    type: 'plugins',
    link: 'https://www.bioalimento.com.mx/calculadora-de-alimentos/',
    github: 'https://github.com/darwincrack/wp-custom-pets-calculator',
    tags: ['WordPress', 'Plugins', 'WooCommerce'],
    coverImage: 'project9',
    gallery: ['project9'],
    body: 'Sugiere la comida y cantidad adecuada para una mascota, basándose en un formulario, y genera un carrito de compra con estos productos.',
  },
  {
    slug: 'me-link',
    title: 'Me Link',
    description: 'Gestor de enlaces con vista previa, etiquetas y búsqueda avanzada.',
    priority: 6,
    type: 'fullstack',
    link: 'https://melink-two.vercel.app/',
    github: 'https://github.com/darwincrack/melink',
    tags: ['React', 'TypeScript', 'Tailwind', 'Supabase'],
    coverImage: 'project8',
    gallery: ['project8'],
    body: 'Gestor de enlaces con vista previa, etiquetas y búsqueda avanzada.',
  },
  {
    slug: 'vipticket',
    title: 'Vipticket',
    description: 'Sistema de gestión de eventos para venta de entradas con pasarela de pagos',
    priority: 1,
    type: 'fullstack',
    link: 'https://vipticket.mx/',
    github: '',
    tags: ['PHP', 'MySQL', 'JavaScript'],
    coverImage: 'project1',
    gallery: ['project1'],
    body: 'Sistema de gestión de eventos para venta de entradas con pasarela de pagos.',
  },
  {
    slug: 'ecommerce-avisajes',
    title: 'E-commerce Avisajes',
    description:
      'Tienda online completa con pasarela de pagos, gestión de inventario y sistema de envíos',
    priority: 2,
    type: 'fullstack',
    link: 'https://avisajes.com',
    github: '',
    tags: ['CodeIgniter', 'PHP', 'JavaScript', 'API REST'],
    coverImage: 'project2',
    gallery: ['project2'],
    body: 'Tienda online completa con pasarela de pagos, gestión de inventario y sistema de envíos.',
  },
  {
    slug: 'ribera-gestion',
    title: 'Ribera gestión',
    description: 'Sistema de gestion inmobiliaria',
    priority: 2,
    type: 'fullstack',
    link: 'https://ribera-gestion-patrimonio.onrender.com/',
    github: '',
    tags: ['React', 'Node', 'API REST', 'MySQL'],
    coverImage: 'project3',
    gallery: ['project3'],
    body: 'Sistema de gestión inmobiliaria.',
  },
  {
    slug: 'latampaper',
    title: 'Latampaper',
    description: 'Web informativa y CMS',
    priority: 3,
    type: 'fullstack',
    link: 'https://latampaper.com',
    github: '',
    tags: ['PHP', 'JavaScript', 'MySQL'],
    coverImage: 'project4',
    gallery: ['project4'],
    body: 'Web informativa y CMS.',
  },
  {
    slug: 'focus-piedra',
    title: 'Focus Piedra',
    description: 'Web de noticias sobre el sector de la piedra natural',
    priority: 1,
    type: 'fullstack',
    link: 'https://focuspiedra.com',
    github: '',
    tags: ['WordPress', 'theme', 'Newspaper'],
    coverImage: 'project14',
    gallery: ['project14'],
    body: 'Web de noticias sobre el sector de la piedra natural.',
  },
  {
    slug: 'meridiano-net',
    title: 'meridiano.net',
    description:
      'Web de noticias deportivas. Desarrollo y mantenimiento durante varios años (proyecto ya actualizado por terceros).',
    priority: 1,
    type: 'fullstack',
    link: 'https://meridiano.net',
    github: '',
    tags: ['PHP', 'JavaScript', 'MySQL', 'CMS'],
    coverImage: 'project5',
    gallery: ['project5'],
    body: 'Web de noticias deportivas. Desarrollo y mantenimiento durante varios años (proyecto ya actualizado por terceros).',
  },
  {
    slug: 'revista-ronda',
    title: 'Revista Ronda',
    description:
      'Web de noticias de farándula. Mantenimiento, desarrollo (backend) y administración general durante mucho tiempo. El sitio ya no está en línea.',
    priority: 1,
    type: 'fullstack',
    link: '',
    github: '',
    tags: ['PHP', 'WordPress', 'MySQL', 'CMS'],
    coverImage: 'project6',
    gallery: ['project6'],
    body: 'Web de noticias de farándula. Mantenimiento, desarrollo (backend) y administración general durante mucho tiempo. El sitio ya no está en línea.',
  },
  {
    slug: 'hotsswingers',
    title: 'hotsswingers.com',
    description: 'Red social y streaming de videos para adultos',
    priority: 2,
    type: 'fullstack',
    link: 'https://hotsswingers.com',
    github: '',
    tags: ['Node.js', 'Laravel', 'MySQL', 'API REST'],
    coverImage: 'project7',
    gallery: ['project7'],
    body: 'Red social y streaming de videos para adultos.',
  },
  {
    slug: 'sistema-inventario',
    title: 'Sistema de gestión de inventario',
    description: 'Sistema de gestión de inventario',
    priority: 2,
    type: 'fullstack',
    link: '',
    github: '',
    tags: ['PHP', 'Laravel 12', 'MySQL'],
    coverImage: 'project12',
    gallery: ['project12'],
    body: 'Sistema de gestión de inventario.',
  },
  {
    slug: 'recaptcha-invisible',
    title: 'Implementación de reCAPTCHA Invisible',
    description: 'Mitigación de spam en formulario de contacto',
    priority: 10,
    type: 'support',
    link: 'https://maquinasdecafe.com.mx/html/forma.php',
    github: '',
    tags: ['Seguridad', 'reCAPTCHA', 'PHP', 'JavaScript'],
    coverImage: 'projectsupport1',
    gallery: ['projectsupport1'],
    body: 'Implementación de reCAPTCHA invisible en el formulario de contacto de Máquinas de Café para prevenir el envío de spam y proteger el sistema de correo. La solución mantiene la experiencia de usuario intacta mientras proporciona una capa adicional de seguridad.',
  },
  {
    slug: 'control-ingresos-egresos',
    title: 'Sistema de control de ingresos y egresos para desktop',
    description: 'Sistema de control de ingresos y egresos para desktop',
    priority: 1,
    type: 'tools',
    link: '',
    github: 'https://github.com/darwincrack/sistema-control-de-ingresos-y-egresos',
    tags: ['Electron', 'JavaScript', 'SQLite'],
    coverImage: 'project13',
    gallery: ['project13', 'project13.1', 'project13.2'],
    body: 'Aplicación de escritorio desarrollada con Electron para la gestión financiera empresarial. Ofrece un control completo de ingresos y egresos con una interfaz intuitiva y funcional. Diseñada para PyMEs que requieren una solución práctica y eficiente para el seguimiento de sus finanzas, sin la complejidad de sistemas más robustos.',
  },
  {
    slug: 'convertir-webp',
    title: 'Convirtidor de imágenes en lote a webp',
    description: 'Convierte .png, .jpg, .jpeg a .webp en lote',
    priority: 1,
    type: 'tools',
    link: '',
    github: 'https://github.com/darwincrack/convertir_webp',
    tags: ['Python', 'Webp', '.exe'],
    coverImage: 'project15',
    gallery: ['project15'],
    body: 'Herramienta en Python para convertir imágenes a formato WEBP de manera masiva, con soporte para subcarpetas, control de calidad, exclusión de archivos, logs y más. También se puede descargar el .exe gratis y usarlo sin necesidad de instalar Python.',
  },
];

function yamlString(value) {
  return JSON.stringify(value);
}

fs.mkdirSync(outDir, { recursive: true });

for (const project of projects) {
  const frontmatter = `---
title: ${JSON.stringify(project.title)}
description: ${JSON.stringify(project.description)}
priority: ${project.priority}
type: ${JSON.stringify(project.type)}
link: ${JSON.stringify(project.link)}
github: ${JSON.stringify(project.github)}
tags: ${yamlString(project.tags)}
coverImage: ${JSON.stringify(project.coverImage)}
gallery: ${yamlString(project.gallery)}
---

${project.body}
`;

  fs.writeFileSync(path.join(outDir, `${project.slug}.md`), frontmatter, 'utf8');
}

console.log(`Generados ${projects.length} archivos en src/content/projects/`);
