// Inicializa Firebase Admin en las funciones serverless de Vercel.
// La service account se pasa como env var FIREBASE_SERVICE_ACCOUNT
// (JSON crudo o en base64). Admin SDK ignora las reglas de Firestore,
// por eso solo el webhook de pagos puede marcar los flags premium.
import admin from 'firebase-admin';

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error('Falta FIREBASE_SERVICE_ACCOUNT en las variables de entorno.');
  }
  const text = raw.trim().startsWith('{')
    ? raw
    : Buffer.from(raw, 'base64').toString('utf8');
  return JSON.parse(text);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(loadServiceAccount()),
  });
}

export const db = admin.firestore();
export { admin };
