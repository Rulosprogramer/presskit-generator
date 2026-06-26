const GA_ID = 'G-QCVWPR2ZQC';
const CONSENT_KEY = 'cookie_consent';

export function getConsent() {
  return localStorage.getItem(CONSENT_KEY); // 'accepted' | 'declined' | null
}

export function setConsent(value) {
  localStorage.setItem(CONSENT_KEY, value);
}

export function loadGA() {
  if (document.getElementById('ga-script')) return;
  const s = document.createElement('script');
  s.id = 'ga-script';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
}
