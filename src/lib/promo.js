// Promo de lanzamiento: 50% de descuento por 30 días en el pago único y el plan anual.
// Cuando la fecha límite pasa, todo vuelve al precio normal automáticamente.

export const PROMO_END = new Date('2026-07-23T23:59:59-05:00'); // 30 días desde el lanzamiento
export const PROMO_DISCOUNT = 0.5; // 50%

export function isPromoActive(now = new Date()) {
  return now < PROMO_END;
}

// Precio con descuento, truncado a 2 decimales (favorable al cliente): 4.99 -> 2.49.
export function promoPrice(base) {
  return Math.floor(base * (1 - PROMO_DISCOUNT) * 100) / 100;
}

export function promoDaysLeft(now = new Date()) {
  const ms = PROMO_END.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}
