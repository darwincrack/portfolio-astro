export const WHATSAPP_NUMBER = '584125447114';

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const WHATSAPP_URL = whatsappLink('Hola Darwin, vi tu web y quiero consultarte sobre un proyecto.');

export const GOOGLE_PROFILE_URL = 'https://maps.google.com/?cid=14957201848041375671';

export const WORKANA_URL = 'https://www.workana.com/freelancer/66f3b0e7a046d3bcffe78e3c49b6e8a6';

// Perfiles públicos: los usan el pie de página, los datos estructurados y el asistente
export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/darwincrack/', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/darwincrack/', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/darwinc.dev/', icon: 'instagram' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@darwin.dev', icon: 'tiktok' },
];
