// Webhook (IPN/Webhooks) de Mercado Pago. Consulta el recurso notificado y,
// si el pago/suscripción está aprobado, actualiza los flags premium del
// presskit en Firestore vía Admin SDK (que ignora las reglas).
//  - Pago único aprobado   -> downloadUnlocked + paymentStatus='paid' + publicLinkExpiresAt (+20 días)
//  - Suscripción autorizada -> subscriptionActive=true (sin caducidad del enlace)
//  - Suscripción cancelada  -> subscriptionActive=false
import { MercadoPagoConfig, Payment, PreApproval } from 'mercadopago';
import { db, admin } from './_firebaseAdmin.js';

const TWENTY_DAYS_MS = 20 * 24 * 60 * 60 * 1000;

async function unlockPresskit(uid, fields) {
  if (!uid) return;
  await db.collection('presskits').doc(uid).set(
    { ...fields, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true },
  );
}

function readNotification(req) {
  const q = req.query || {};
  const body = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});
  const type = q.type || q.topic || body.type || body.topic || '';
  const id = q['data.id'] || q.id || body?.data?.id || body?.id || '';
  return { type: String(type), id: String(id) };
}

function safeJson(s) {
  try { return JSON.parse(s || '{}'); } catch { return {}; }
}

export default async function handler(req, res) {
  // Mercado Pago espera un 200 rápido; si no, reintenta.
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'POST, GET');
    return res.status(405).end('Method not allowed');
  }
  if (!process.env.MP_ACCESS_TOKEN) {
    return res.status(500).send('Falta MP_ACCESS_TOKEN.');
  }

  const { type, id } = readNotification(req);
  if (!id) return res.status(200).json({ ignored: true });

  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

  try {
    if (type.includes('payment')) {
      const payment = await new Payment(client).get({ id });
      const uid = payment.external_reference || payment.metadata?.uid;
      if (payment.status === 'approved' && uid) {
        await unlockPresskit(uid, {
          paymentStatus: 'paid',
          downloadUnlocked: true,
          publicLinkExpiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + TWENTY_DAYS_MS),
        });
      }
    } else if (type.includes('preapproval') || type.includes('subscription')) {
      const sub = await new PreApproval(client).get({ id });
      const uid = sub.external_reference;
      if (uid) {
        const active = sub.status === 'authorized';
        await unlockPresskit(uid, {
          subscriptionActive: active,
          ...(active ? { paymentStatus: 'paid', downloadUnlocked: true } : {}),
        });
      }
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error procesando webhook de Mercado Pago', err?.message);
    // 200 igualmente para que MP no reintente en bucle ante errores no recuperables;
    // los reintentos válidos llegarán por nuevas notificaciones.
    return res.status(200).json({ received: true, error: true });
  }
}
