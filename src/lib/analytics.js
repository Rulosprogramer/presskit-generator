const CONSENT_KEY = 'cookie_consent';

export function getConsent() {
  return localStorage.getItem(CONSENT_KEY); // 'accepted' | 'declined' | null
}

export function setConsent(value) {
  localStorage.setItem(CONSENT_KEY, value);
}

// Llama a esto al arrancar la app si el usuario ya había aceptado antes
export function applyStoredConsent() {
  const consent = getConsent();
  if (consent === 'accepted') grantConsent();
  // Si rechazó o es null, el default 'denied' del index.html ya aplica
}

export function grantConsent() {
  if (typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'denied',       // no hacemos publicidad
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

export function revokeConsent() {
  if (typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}
