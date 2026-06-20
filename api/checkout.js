// Crea un pago en Mercado Pago y devuelve la URL de redirección (init_point).
//  - billing 'once'   -> Checkout Pro (preferencia, pago único)
//  - billing 'annual' -> Suscripción (preapproval, cobro anual)
// Al completarse, el webhook (/api/mp-webhook) desbloquea el premium.
import { MercadoPagoConfig, Preference, PreApproval } from 'mercadopago';

const CURRENCY = process.env.MP_CURRENCY || 'USD';
const PRICE_ONCE = Number(process.env.MP_PRICE_ONCE || '4.99');
const PRICE_ANNUAL = Number(process.env.MP_PRICE_ANNUAL || '14.99');

function getBaseUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Mercado Pago no está configurado (falta MP_ACCESS_TOKEN).' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const billing = body.billing === 'annual' ? 'annual' : 'once';
    const uid = String(body.uid || '').trim();
    const email = String(body.email || '').trim();
    const presskitId = String(body.presskitId || uid).trim();

    if (!uid) {
      return res.status(400).json({ error: 'Falta el identificador de usuario (uid).' });
    }

    const baseUrl = getBaseUrl(req);
    const notificationUrl = `${baseUrl}/api/mp-webhook`;
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

    if (billing === 'annual') {
      // Suscripción anual (preapproval).
      const preapproval = new PreApproval(client);
      const result = await preapproval.create({
        body: {
          reason: 'Presskit Premium — Plan anual',
          external_reference: uid,
          payer_email: email || undefined,
          back_url: `${baseUrl}/presskitPDF?checkout=success`,
          auto_recurring: {
            frequency: 12,
            frequency_type: 'months',
            transaction_amount: PRICE_ANNUAL,
            currency_id: CURRENCY,
          },
          status: 'pending',
        },
      });
      const url = result.init_point || result.sandbox_init_point;
      if (!url) throw new Error('Mercado Pago no devolvió un init_point para la suscripción.');
      return res.status(200).json({ url });
    }

    // Pago único (Checkout Pro).
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'presskit-premium-once',
            title: 'Presskit Premium — Descarga única',
            description: 'Descarga PDF sin marca de agua + enlace web público por 20 días',
            quantity: 1,
            unit_price: PRICE_ONCE,
            currency_id: CURRENCY,
          },
        ],
        payer: email ? { email } : undefined,
        external_reference: uid,
        metadata: { uid, presskitId, billing: 'once' },
        notification_url: notificationUrl,
        auto_return: 'approved',
        back_urls: {
          success: `${baseUrl}/presskitPDF?checkout=success`,
          pending: `${baseUrl}/presskitPDF?checkout=pending`,
          failure: `${baseUrl}/checkout?billing=once&checkout=cancel`,
        },
      },
    });
    const url = result.init_point || result.sandbox_init_point;
    if (!url) throw new Error('Mercado Pago no devolvió un init_point.');
    return res.status(200).json({ url });
  } catch (err) {
    console.error('checkout (mercadopago) error', err);
    return res.status(500).json({ error: err?.message || 'No se pudo crear el pago.' });
  }
}
