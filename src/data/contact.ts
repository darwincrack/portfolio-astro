export const WHATSAPP_NUMBER = '584125447114';

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const WHATSAPP_URL = whatsappLink('Hola Darwin, vi tu web y quiero consultarte sobre un proyecto.');

export const GOOGLE_PROFILE_URL = 'https://maps.google.com/?cid=14957201848041375671';
