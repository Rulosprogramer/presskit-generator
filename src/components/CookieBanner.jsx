import { useState } from 'react';
import { getConsent, setConsent, loadGA } from '../lib/analytics';

function CookieBanner() {
  const [visible, setVisible] = useState(() => getConsent() === null);

  if (!visible) return null;

  const accept = () => {
    setConsent('accepted');
    loadGA();
    setVisible(false);
  };

  const decline = () => {
    setConsent('declined');
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-zinc-900/95 shadow-2xl backdrop-blur-xl">
        {/* Franja de color superior */}
        <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-fuchsia-500" />

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
          {/* Icono + texto */}
          <div className="flex items-start gap-3 sm:flex-1">
            <div className="mt-0.5 shrink-0 rounded-xl border border-fuchsia-300/30 bg-fuchsia-300/10 p-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-fuchsia-300">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Usamos cookies de analítica</p>
              <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
                Usamos Google Analytics para entender cómo los artistas usan la plataforma y mejorarla. No vendemos tus datos ni usamos cookies de publicidad.{' '}
                <a href="/privacidad" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">
                  Política de privacidad
                </a>
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex shrink-0 gap-2 sm:flex-col">
            <button
              type="button"
              onClick={accept}
              className="flex-1 rounded-xl bg-fuchsia-400 px-5 py-2 text-sm font-bold text-zinc-950 transition hover:bg-fuchsia-300 active:scale-95 sm:flex-none"
            >
              Aceptar
            </button>
            <button
              type="button"
              onClick={decline}
              className="flex-1 rounded-xl border border-white/15 px-5 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/8 hover:text-white active:scale-95 sm:flex-none"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
