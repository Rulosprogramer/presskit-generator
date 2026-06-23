function PlanPurchaseModal({ isOpen, actionLabel, onClose, onSelectOnce, onSelectAnnual }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/15 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Acceso requerido</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Elige tu plan para {actionLabel}</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Elige el plan que mejor se adapte a tus necesidades. Ambos desbloquean la descarga limpia del PDF y el enlace público.
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
          <article className="rounded-2xl border border-cyan-300/40 bg-cyan-300/10 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">Descarga única</p>
            <h3 className="mt-2 text-xl font-bold text-white">$4.99 USD</h3>
            <p className="mt-1 text-sm text-zinc-400">Pago único</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-200">
              <li>✓ Descarga PDF profesional sin marca de agua</li>
              <li>✓ Enlace web público por 20 días</li>
              <li>✓ Válido para una actualización</li>
            </ul>
            <button
              type="button"
              onClick={onSelectOnce}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-cyan-200"
            >
              Comprar descarga única — $4.99
            </button>
          </article>

          <article className="rounded-2xl border-2 border-fuchsia-400/60 bg-fuchsia-400/10 p-5 shadow-[0_0_40px_rgba(217,70,239,0.12)]">
            <div className="inline-flex rounded-full bg-fuchsia-400 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-950">
              Recomendado
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">$14.99 USD</h3>
            <p className="mt-1 text-sm text-zinc-400">Plan anual</p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-200">
              <li>✓ Descargas de PDF ilimitadas</li>
              <li>✓ Enlace del EPK online mientras esté activo</li>
              <li>✓ Galería de prensa en alta resolución</li>
              <li>✓ Actualiza cuando quieras, sin costo adicional</li>
            </ul>
            <button
              type="button"
              onClick={onSelectAnnual}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-fuchsia-400 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-fuchsia-300"
            >
              Suscribirme anual — $14.99
            </button>
          </article>
        </div>
      </div>
    </div>
  );
}

export default PlanPurchaseModal;
