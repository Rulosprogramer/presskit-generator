import { useState } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

const THEME_OPTIONS = {
  bgColor: ['#0D0D0D','#1A1A2E','#0F0F1A','#1C1C1C','#FFFFFF','#F5F0E8','#F0F4F8','#FAFAFA','#0A0A2A','#1A0A2E','#2C1810','#1A1209'],
  cardBg: ['#161616','#1E1E2E','#12121F','#242424','#FFFFFF','#F8F8F8','#EEE8DC','#F2F6FA','rgba(255,255,255,0.05)','rgba(255,255,255,0.1)','#2A1F15','#1F1A10'],
  titleColor: ['#FFFFFF','#F0F0F0','#1A1A1A','#333333','#FFD700','#E8C4A0','#C9A84C','#F5DEB3','#00D4FF','#FF6B6B','#A78BFA','#39FF14'],
  subtitleColor: ['#AAAAAA','#888888','#CCCCCC','#666666','#B8860B','#8B7355','#A0856C','#C4A882','#7EB8D4','#6B9FBA','#8FA8C8','#FF8C94'],
  textColor: ['#FFFFFF','#E0E0E0','#CCCCCC','#B0B0B0','#1A1A1A','#333333','#4A4A4A','#555555','#F0E6D3','#E8D5B7','#D4C4A0','#D0E8F0'],
  accentColor: ['#FF6B6B','#FF4757','#00D4FF','#00B4D8','#FFD700','#FFC300','#E8C84A','#A78BFA','#7C3AED','#9333EA','#39FF14','#00FF7F'],
  borderColor: ['rgba(255,255,255,0.08)','rgba(255,255,255,0.15)','rgba(255,255,255,0.25)','rgba(0,0,0,0.08)','rgba(0,0,0,0.15)','rgba(0,0,0,0.2)','rgba(255,215,0,0.4)','rgba(0,212,255,0.4)','rgba(167,139,250,0.4)','#333333','#E0E0E0','#FFD700'],
  overlayColor: ['rgba(0,0,0,0.3)','rgba(0,0,0,0.5)','rgba(0,0,0,0.7)','rgba(10,10,42,0.6)','rgba(45,27,105,0.6)','rgba(44,24,16,0.6)','rgba(180,80,0,0.4)','rgba(0,100,150,0.5)','rgba(0,50,100,0.6)','rgba(124,58,237,0.5)','rgba(255,107,107,0.4)','rgba(0,0,0,0.1)'],
};

const VARIABLE_LABELS = {
  bgColor: 'Fondo principal',
  cardBg: 'Fondo de tarjetas',
  titleColor: 'Títulos',
  subtitleColor: 'Subtítulos',
  textColor: 'Texto',
  accentColor: 'Acento',
  borderColor: 'Bordes',
  overlayColor: 'Overlay',
};

const NEUTRAL_BG_KEYS = new Set(['borderColor', 'overlayColor']);

function ThemePicker() {
  const { theme, setThemeValue } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          className="fixed bottom-20 right-4 z-50 w-80 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] p-4 shadow-2xl"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
        >
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Tema visual
          </p>
          <div className="space-y-4">
            {Object.keys(THEME_OPTIONS).map((key) => {
              const onNeutral = NEUTRAL_BG_KEYS.has(key);
              return (
                <div key={key}>
                  <p className="mb-1.5 text-[11px] text-zinc-400">{VARIABLE_LABELS[key]}</p>
                  <div
                    className="flex flex-wrap gap-1 rounded-lg p-1.5"
                    style={onNeutral ? { backgroundColor: '#1a1a1a' } : undefined}
                  >
                    {THEME_OPTIONS[key].map((color) => {
                      const isActive = theme[key] === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          title={color}
                          onClick={() => setThemeValue(key, color)}
                          className="h-4 w-4 shrink-0 rounded-full border border-white/10 transition-transform hover:scale-110 focus:outline-none"
                          style={{
                            backgroundColor: color,
                            ...(isActive
                              ? { outline: '2px solid #ffffff', outlineOffset: '2px' }
                              : {}),
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label={open ? 'Cerrar selector de tema' : 'Abrir selector de tema'}
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-zinc-800 text-xl shadow-lg transition hover:bg-zinc-700 active:scale-95"
      >
        🎨
      </button>
    </>
  );
}

export default ThemePicker;
