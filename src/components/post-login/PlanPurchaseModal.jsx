function PlanPurchaseModal({ isOpen, actionLabel, onClose, onSelectEssential, onSelectProfessional }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Compra requerida</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Elige tu plan para {actionLabel}</h2>
            <p className="mt-2 text-sm text-zinc-300">
              El plan esencial te lleva al checkout básico. El plan profesional te lleva al checkout completo con acceso a la experiencia premium.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">Plan esencial</p>
            <h3 className="mt-2 text-xl font-bold text-white">$1</h3>
            <p className="mt-1 text-sm text-zinc-400">Pago único</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-200">
              <li>Acceso al método de pago para el plan esencial</li>
              <li>Proceso simple para cerrar la compra</li>
              <li>Preparado para activar el producto luego del pago</li>
            </ul>
            <button
              type="button"
              onClick={onSelectEssential}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-cyan-200"
            >
              Ir al pago esencial
            </button>
          </article>

          <article className="rounded-2xl border-2 border-fuchsia-400/60 bg-fuchsia-400/10 p-5 shadow-[0_0_40px_rgba(217,70,239,0.12)]">
            <div className="inline-flex rounded-full bg-fuchsia-400 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-950">
              Recomendado
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">Plan profesional</h3>
            <p className="mt-1 text-sm text-zinc-400">$5 pago único</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-200">
              <li>Acceso al método de pago para el plan profesional</li>
              <li>Checkout completo con experiencia premium</li>
              <li>Preparado para activar el producto luego del pago</li>
            </ul>
            <button
              type="button"
              onClick={onSelectProfessional}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-fuchsia-400 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-fuchsia-300"
            >
              Ir al pago profesional
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}

export default PlanPurchaseModal;
