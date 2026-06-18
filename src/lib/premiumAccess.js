// Correos con acceso premium total: descarga limpia (sin marca de agua),
// sin vista protegida, publicar y compartir sin restricciones.
const PREMIUM_WHITELIST = [
  'bandasietesas@gmail.com',
];

export function isPremiumWhitelisted(email) {
  if (!email) return false;
  return PREMIUM_WHITELIST.includes(String(email).trim().toLowerCase());
}
