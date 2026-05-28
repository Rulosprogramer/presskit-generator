import { useMemo, useState } from 'react';
import { FaCreditCard, FaMoneyBillWave, FaPaypal } from 'react-icons/fa';

const planContent = {
  essential: {
    name: 'Plan Esencial',
    price: '$1',
    accent: 'text-cyan-300',
    border: 'border-cyan-300/40',
    bg: 'bg-cyan-300/10',
    features: [
      'Acceso al flujo de compra',
      'PDF esencial cuando se active la entrega',
      'Ideal para iniciar rápido',
    ],
  },
  professional: {
    name: 'Plan Profesional',
    price: '$5',
    accent: 'text-fuchsia-300',
    border: 'border-fuchsia-300/50',
    bg: 'bg-fuchsia-300/10',
    features: [
      'Acceso al flujo de compra',
      'PDF profesional cuando se active la entrega',
      'Compartir link y vista completa luego del pago',
    ],
  },
};

const paymentMethods = [
  {
    id: 'card',
    title: 'Tarjeta / checkout seguro',
    description: 'Ideal para conectar una pasarela como Stripe o Mercado Pago.',
    icon: FaCreditCard,
  },
  {
    id: 'transfer',
    title: 'Transferencia bancaria',
    description: 'Útil para pagos manuales y validación por tu equipo.',
    icon: FaMoneyBillWave,
  },
  {
    id: 'paypal',
    title: 'PayPal',
    description: 'Opción internacional para compradores fuera de LATAM.',
    icon: FaPaypal,
  },
];

const billingOptions = {
  annual: {
    title: 'Suscripción anual',
    description: 'Activa la descarga limpia con renovación cada 12 meses.',
    badge: 'Renovación anual',
    cta: 'Continuar con suscripción anual',
  },
  once: {
    title: 'Descarga de una sola vez',
    description: 'Haz un pago único y desbloquea este PDF sin marca de agua.',
    badge: 'Pago único',
    cta: 'Continuar con compra única',
  },
};

function Checkout({ user, onSignOut }) {
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const plan = searchParams.get('plan') === 'professional' ? 'professional' : 'essential';
  const initialBilling = searchParams.get('billing') === 'annual' ? 'annual' : 'once';
  const planInfo = planContent[plan];
  const [billing, setBilling] = useState(initialBilling);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const selectedMethodInfo = paymentMethods.find((method) => method.id === selectedMethod) || paymentMethods[0];
  const billingInfo = billingOptions[billing] || billingOptions.once;

  return (
    <main className="mx-auto min-h-screen w-full max-w-400 px-6 py-8 lg:px-12">
      <section className="overflow-hidden rounded-4xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_35%),linear-gradient(180deg,rgba(24,24,27,0.98),rgba(9,9,11,1))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Checkout</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Método de pago</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300">
              Selecciona cómo quieres cerrar la compra del {planInfo.name.toLowerCase()} antes de activar la entrega del producto.
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
          >
            Salir
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className={`rounded-3xl border ${planInfo.border} ${planInfo.bg} p-6`}>
            <p className={`text-xs uppercase tracking-[0.16em] ${planInfo.accent}`}>Plan seleccionado</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{planInfo.name}</h2>
                <p className="mt-1 text-sm text-zinc-300">{billingInfo.title}</p>
              </div>
              <p className={`text-5xl font-black ${planInfo.accent}`}>{planInfo.price}</p>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-zinc-200">
              {planInfo.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className={planInfo.accent}>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.16em] text-fuchsia-300">Métodos disponibles</p>
            <div className="mt-4 grid gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-fuchsia-300/50 bg-fuchsia-300/10 shadow-[0_0_30px_rgba(217,70,239,0.12)]'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span className={`mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl ${isSelected ? 'bg-fuchsia-400 text-zinc-950' : 'bg-white/10 text-white'}`}>
                      <Icon />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-white">{method.title}</span>
                      <span className="mt-1 block text-xs text-zinc-400">{method.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </article>
        </div>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Tipo de cobro</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Object.entries(billingOptions).map(([key, option]) => {
              const isSelected = billing === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBilling(key)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? 'border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,0.12)]'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-white">
                    {option.badge}
                  </span>
                  <span className="mt-3 block text-sm font-bold text-white">{option.title}</span>
                  <span className="mt-1 block text-xs text-zinc-400">{option.description}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Confirmación</p>
              <h2 className="mt-2 text-xl font-bold text-white">{selectedMethodInfo.title}</h2>
              <p className="mt-1 text-sm text-zinc-300">{selectedMethodInfo.description}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-zinc-500">
                {billingInfo.title} · {billingInfo.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.alert('Conecta aquí tu pasarela de pago para finalizar la compra.')}
              className="rounded-xl bg-fuchsia-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-fuchsia-300"
            >
              {billingInfo.cta}
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Checkout;
