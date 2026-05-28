import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext.tsx';

// ── Color math ───────────────────────────────────────────────────────────────

function hsvToRgb(h, s, v) {
  s /= 100; v /= 100;
  const k = n => (n + h / 60) % 6;
  const f = n => v - v * s * Math.max(0, Math.min(1, Math.min(k(n), 4 - k(n))));
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
  }
  return [h, max === 0 ? 0 : Math.round((d / max) * 100), Math.round(max * 100)];
}

function parseColorStr(str) {
  if (!str) return { r: 255, g: 107, b: 107, a: 1 };
  const h6 = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str);
  if (h6) return { r: parseInt(h6[1], 16), g: parseInt(h6[2], 16), b: parseInt(h6[3], 16), a: 1 };
  const h3 = /^#([a-f\d])([a-f\d])([a-f\d])$/i.exec(str);
  if (h3) return { r: parseInt(h3[1]+h3[1], 16), g: parseInt(h3[2]+h3[2], 16), b: parseInt(h3[3]+h3[3], 16), a: 1 };
  const rgba = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i.exec(str);
  if (rgba) return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] !== undefined ? +rgba[4] : 1 };
  return { r: 255, g: 107, b: 107, a: 1 };
}

function toColorStr(r, g, b, a) {
  const hex = '#' + [r, g, b].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('');
  return a >= 1 ? hex : `rgba(${r},${g},${b},${+a.toFixed(2)})`;
}

function rgbToHexStr(r, g, b) {
  return [r, g, b].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('');
}

// ── localStorage ─────────────────────────────────────────────────────────────

const RECENT_KEY = 'presskit_recent_colors';
const SAVED_KEY  = 'presskit_saved_colors';
const getRecent  = () => { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; } };
const addRecent  = c  => { const n = [c, ...getRecent().filter(x => x !== c)].slice(0, 12); try { localStorage.setItem(RECENT_KEY, JSON.stringify(n)); } catch {} };
const getSaved   = () => { try { return JSON.parse(localStorage.getItem(SAVED_KEY)  || '[]'); } catch { return []; } };
const putSaved   = arr => { try { localStorage.setItem(SAVED_KEY, JSON.stringify(arr)); } catch {} };

// ── Data ─────────────────────────────────────────────────────────────────────

const ADV_PALETTES = [
  { label: 'Oscuros',  colors: ['#000000','#09090b','#0d0d0d','#111111','#18181b','#1c1c1c','#242424','#27272a'] },
  { label: 'Claros',   colors: ['#ffffff','#fafafa','#f5f5f5','#e5e5e5','#d4d4d4','#a1a1aa','#71717a','#52525b'] },
  { label: 'Neon',     colors: ['#f472b6','#ec4899','#06b6d4','#00d4ff','#39ff14','#00ff7f','#a78bfa','#f59e0b'] },
  { label: 'Pasteles', colors: ['#fecdd3','#fed7aa','#fef9c3','#d1fae5','#bfdbfe','#e9d5ff','#fce7f3','#f1f5f9'] },
  { label: 'Tierra',   colors: ['#78350f','#92400e','#b45309','#c4a882','#a0856c','#8b7355','#6b4f35','#2c1810'] },
  { label: 'Acento',   colors: ['#ff6b6b','#ff4757','#ff5722','#ffd700','#10b981','#3b82f6','#8b5cf6','#9333ea'] },
];

const THEME_OPTIONS = {
  bgColor:       ['#0D0D0D','#1A1A2E','#0F0F1A','#1C1C1C','#FFFFFF','#F5F0E8','#F0F4F8','#FAFAFA'],
  cardBg:        ['#161616','#1E1E2E','#12121F','#242424','#FFFFFF','#F8F8F8','#EEE8DC','#F2F6FA'],
  titleColor:    ['#FFFFFF','#F0F0F0','#1A1A1A','#333333','#FFD700','#E8C4A0','#A78BFA','#00D4FF'],
  subtitleColor: ['#AAAAAA','#888888','#CCCCCC','#666666','#B8860B','#8B7355','#7EB8D4','#FF8C94'],
  textColor:     ['#FFFFFF','#E0E0E0','#CCCCCC','#B0B0B0','#1A1A1A','#333333','#F0E6D3','#D0E8F0'],
  accentColor:   ['#FF6B6B','#FF4757','#00D4FF','#FFD700','#A78BFA','#39FF14','#10b981','#f472b6'],
  borderColor:   ['rgba(255,255,255,0.08)','rgba(255,255,255,0.15)','rgba(255,255,255,0.25)','rgba(0,0,0,0.08)','rgba(0,0,0,0.15)','rgba(255,215,0,0.4)','rgba(0,212,255,0.4)','rgba(167,139,250,0.4)'],
  overlayColor:  ['rgba(0,0,0,0.3)','rgba(0,0,0,0.5)','rgba(0,0,0,0.7)','rgba(10,10,42,0.6)','rgba(45,27,105,0.6)','rgba(44,24,16,0.6)','rgba(124,58,237,0.5)','rgba(255,107,107,0.4)'],
};

const THEME_VAR_LABELS = {
  bgColor: 'Fondo principal', cardBg: 'Fondo de tarjetas', titleColor: 'Títulos',
  subtitleColor: 'Subtítulos', textColor: 'Texto', accentColor: 'Acento',
  borderColor: 'Bordes', overlayColor: 'Overlay',
};

const THEME_NEUTRAL_BG = new Set(['borderColor', 'overlayColor']);

const THEME_PRESETS = [
  {
    id: 'neon', label: 'Neon', description: 'Eléctrico y vibrante',
    values: { bgColor:'#0d1117', cardBg:'#161b22', titleColor:'#f72585', subtitleColor:'#4cc9f0', textColor:'#c9d1d9', accentColor:'#7209b7', borderColor:'#3f153b', overlayColor:'rgba(247,37,133,0.15)' },
  },
  {
    id: 'neutral', label: 'Neutral', description: 'Limpio y profesional',
    values: { bgColor:'#f6f8fa', cardBg:'#ffffff', titleColor:'#24292f', subtitleColor:'#57606a', textColor:'#1f2328', accentColor:'#0969da', borderColor:'#d0d7de', overlayColor:'rgba(208,215,222,0.2)' },
  },
  {
    id: 'dark', label: 'Dark', description: 'Oscuro y sofisticado',
    values: { bgColor:'#1a1a1a', cardBg:'#262626', titleColor:'#f8f9fa', subtitleColor:'#a0a0a0', textColor:'#e0e0e0', accentColor:'#c5a059', borderColor:'#333333', overlayColor:'rgba(0,0,0,0.4)' },
  },
  {
    id: 'minimal', label: 'Minimal', description: 'Natural y orgánico',
    values: { bgColor:'#fdfaf5', cardBg:'#f2e9dc', titleColor:'#1a4332', subtitleColor:'#6a8c6a', textColor:'#4a3e36', accentColor:'#d87d4a', borderColor:'#e5dac1', overlayColor:'rgba(229,218,193,0.3)' },
  },
];

// ── Spectrum picker ───────────────────────────────────────────────────────────

function SpectrumPicker({ h, s, v, onChange }) {
  const ref = useRef(null);

  function pick(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const ns = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const nv = Math.max(0, Math.min(100, Math.round((1 - (e.clientY - rect.top) / rect.height) * 100)));
    onChange(ns, nv);
  }

  function handleMouseDown(e) {
    e.preventDefault();
    pick(e);
    const move = e => pick(e);
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  return (
    <div
      ref={ref}
      className="relative h-36 w-full cursor-crosshair select-none overflow-hidden"
      style={{ background: `hsl(${h}, 100%, 50%)` }}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #fff, transparent)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000, transparent)' }} />
      <div
        className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
        style={{ left: `${s}%`, top: `${100 - v}%`, boxShadow: '0 0 0 1px rgba(0,0,0,0.5)' }}
      />
    </div>
  );
}

// ── Slider track ─────────────────────────────────────────────────────────────

function SliderTrack({ value, onChange, gradient, thumbColor }) {
  const ref = useRef(null);

  function pick(e) {
    if (!ref.current) return;
    onChange(Math.max(0, Math.min(1, (e.clientX - ref.current.getBoundingClientRect().left) / ref.current.getBoundingClientRect().width)));
  }

  function handleMouseDown(e) {
    e.preventDefault();
    pick(e);
    const move = e => pick(e);
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  return (
    <div
      ref={ref}
      className="relative h-3 cursor-pointer select-none rounded-full"
      style={{ background: gradient }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{ left: `${value * 100}%`, backgroundColor: thumbColor }}
      />
    </div>
  );
}

// ── Advanced color picker ─────────────────────────────────────────────────────

function AdvancedColorPicker({ currentValue, onSelect, onClose, triggerRect }) {
  const parsed  = parseColorStr(currentValue);
  const initHsv = rgbToHsv(parsed.r, parsed.g, parsed.b);

  const [h, setH]           = useState(initHsv[0]);
  const [s, setS]           = useState(initHsv[1]);
  const [v, setV]           = useState(initHsv[2]);
  const [alpha, setAlpha]   = useState(Math.round(parsed.a * 100));
  const [hexInput, setHexI] = useState(() => rgbToHexStr(parsed.r, parsed.g, parsed.b));
  const [tab, setTab]       = useState('palettes');
  const [recent, setRecent] = useState(getRecent);
  const [saved, setSaved]   = useState(getSaved);

  const [r, g, b]  = hsvToRgb(h, s, v);
  const currentStr = toColorStr(r, g, b, alpha / 100);
  const opaqueHex  = `#${rgbToHexStr(r, g, b)}`;
  const lum        = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  function applyStr(colorStr) {
    const p = parseColorStr(colorStr);
    const [nh, ns, nv] = rgbToHsv(p.r, p.g, p.b);
    setH(nh); setS(ns); setV(nv);
    setAlpha(Math.round(p.a * 100));
    setHexI(rgbToHexStr(p.r, p.g, p.b));
    onSelect(colorStr);
  }

  function onSpecChange(ns, nv) {
    setS(ns); setV(nv);
    const [nr, ng, nb] = hsvToRgb(h, ns, nv);
    setHexI(rgbToHexStr(nr, ng, nb));
    onSelect(toColorStr(nr, ng, nb, alpha / 100));
  }

  function onHueChange(val) {
    const nh = Math.round(val * 360);
    setH(nh);
    const [nr, ng, nb] = hsvToRgb(nh, s, v);
    setHexI(rgbToHexStr(nr, ng, nb));
    onSelect(toColorStr(nr, ng, nb, alpha / 100));
  }

  function onAlphaChange(val) {
    const na = Math.round(val * 100);
    setAlpha(na);
    onSelect(toColorStr(r, g, b, na / 100));
  }

  function onHexChange(e) {
    const raw = e.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 6);
    setHexI(raw);
    if (raw.length === 6) {
      const nr = parseInt(raw.slice(0, 2), 16);
      const ng = parseInt(raw.slice(2, 4), 16);
      const nb = parseInt(raw.slice(4, 6), 16);
      const [nh, ns, nv] = rgbToHsv(nr, ng, nb);
      setH(nh); setS(ns); setV(nv);
      onSelect(toColorStr(nr, ng, nb, alpha / 100));
    }
  }

  function handleSave() {
    const next = [currentStr, ...saved.filter(c => c !== currentStr)].slice(0, 20);
    putSaved(next);
    setSaved(next);
  }

  function handleClose() {
    addRecent(currentStr);
    setRecent(getRecent());
    onClose();
  }

  // Smart positioning — prefer below trigger, right-aligned to button
  let pos = {};
  if (triggerRect) {
    const W = 272, H = 530, vw = window.innerWidth, vh = window.innerHeight;
    let top  = triggerRect.bottom + 8;
    let left = triggerRect.right - W;
    if (left < 16) left = 16;
    if (left + W > vw - 16) left = vw - W - 16;
    if (top + H > vh - 16) top = triggerRect.top - H - 8;
    if (top < 16) top = 16;
    pos = { top, left };
  } else {
    pos = { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
  }

  const hueGrad   = 'linear-gradient(to right,#f00,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00)';
  const alphaGrad = `linear-gradient(to right,rgba(${r},${g},${b},0),rgba(${r},${g},${b},1))`;
  const checker   = {
    backgroundImage: 'linear-gradient(45deg,#444 25%,transparent 25%),linear-gradient(-45deg,#444 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#444 75%),linear-gradient(-45deg,transparent 75%,#444 75%)',
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0,0 4px,4px -4px,-4px 0',
    backgroundColor: '#222',
  };

  const SWATCH = 'h-6 w-6 shrink-0 rounded-md border border-white/10 transition-transform hover:scale-110 cursor-pointer focus:outline-none';

  return createPortal(
    <>
      <div className="fixed inset-0 z-[200]" onClick={handleClose} />
      <div
        className="fixed z-[201] w-68 overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-2xl"
        style={pos}
        onClick={e => e.stopPropagation()}
      >
        <SpectrumPicker h={h} s={s} v={v} onChange={onSpecChange} />

        <div className="space-y-3 p-3">
          {/* Hue */}
          <SliderTrack
            value={h / 360}
            onChange={onHueChange}
            gradient={hueGrad}
            thumbColor={`hsl(${h},100%,50%)`}
          />

          {/* Opacity */}
          <div className="overflow-hidden rounded-full" style={checker}>
            <SliderTrack value={alpha / 100} onChange={onAlphaChange} gradient={alphaGrad} thumbColor={currentStr} />
          </div>

          {/* HEX input */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 shrink-0 rounded-lg border border-white/10" style={{ backgroundColor: currentStr }} />
            <div className="flex flex-1 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
              <span className="text-xs text-zinc-500">#</span>
              <input
                id="color-picker-hex"
                value={hexInput.toUpperCase()}
                onChange={onHexChange}
                onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                className="w-16 bg-transparent font-mono text-xs text-zinc-200 outline-none"
                maxLength={6}
                spellCheck={false}
              />
              <span className="ml-auto text-[10px] text-zinc-600">{alpha}%</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-white/5 p-0.5">
            {[['palettes','Paletas'],['recent','Recientes'],['saved','Guardados']].map(([key, lbl]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex-1 rounded-md py-1 text-[10px] transition-colors cursor-pointer ${tab === key ? 'bg-white/10 text-zinc-200' : 'text-zinc-500 hover:text-zinc-400'}`}
              >
                {lbl}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="max-h-36 overflow-y-auto pr-0.5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
            {tab === 'palettes' && (
              <div className="space-y-2.5">
                {ADV_PALETTES.map(({ label, colors }) => (
                  <div key={label}>
                    <p className="mb-1 text-[9px] uppercase tracking-widest text-zinc-600">{label}</p>
                    <div className="flex flex-wrap gap-1">
                      {colors.map(color => (
                        <button key={color} type="button" onClick={() => applyStr(color)} className={SWATCH}
                          style={{ backgroundColor: color, ...(currentStr === color ? { outline: '2px solid #fff', outlineOffset: '1px' } : {}) }} title={color} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'recent' && (
              recent.length === 0
                ? <p className="text-[10px] text-zinc-600">Aún no hay colores recientes.</p>
                : <div className="flex flex-wrap gap-1">
                    {recent.map(color => (
                      <button key={color} type="button" onClick={() => applyStr(color)} className={SWATCH}
                        style={{ backgroundColor: color, ...(currentStr === color ? { outline: '2px solid #fff', outlineOffset: '1px' } : {}) }} title={color} />
                    ))}
                  </div>
            )}

            {tab === 'saved' && (
              saved.length === 0
                ? <p className="text-[10px] text-zinc-600">No hay colores guardados aún.</p>
                : <div className="flex flex-wrap gap-1">
                    {saved.map(color => (
                      <button key={color} type="button" onClick={() => applyStr(color)} className={SWATCH}
                        style={{ backgroundColor: color, ...(currentStr === color ? { outline: '2px solid #fff', outlineOffset: '1px' } : {}) }} title={color} />
                    ))}
                  </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-white/5 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-lg border border-white/10 py-1.5 text-[11px] text-zinc-400 transition hover:bg-white/5 cursor-pointer"
            >
              + Guardar
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg py-1.5 text-[11px] font-medium transition cursor-pointer"
              style={{ backgroundColor: opaqueHex, color: lum > 0.5 ? '#000' : '#fff' }}
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

// ── Preset card ───────────────────────────────────────────────────────────────

function PresetCard({ preset, isActive, onClick }) {
  const { bgColor, cardBg, titleColor, subtitleColor, accentColor, borderColor } = preset.values;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl p-3 text-left transition-all duration-300 hover:-translate-y-0.5 cursor-pointer focus:outline-none"
      style={{
        backgroundColor: isActive ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isActive ? accentColor : 'rgba(255,255,255,0.08)'}`,
        boxShadow: isActive ? `0 0 28px ${accentColor}33, 0 0 0 1px ${accentColor}22` : 'none',
      }}
    >
      {isActive && (
        <div className="pointer-events-none absolute -right-3 -top-3 h-14 w-14 rounded-full blur-xl opacity-60" style={{ backgroundColor: accentColor }} />
      )}
      {isActive && (
        <div className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full" style={{ backgroundColor: accentColor }}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4l2 2 3-3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div className="relative mb-2.5 overflow-hidden rounded-lg p-2" style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}>
        <div className="mb-1.5 flex items-center gap-1 rounded px-1 py-0.5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
          <div className="h-1 w-8 rounded-full opacity-60" style={{ backgroundColor: accentColor }} />
          <div className="h-1 flex-1 rounded-full opacity-20" style={{ backgroundColor: titleColor }} />
        </div>
        <div className="rounded-lg p-1.5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
          <div className="mb-1 h-1.5 w-2/3 rounded-full" style={{ backgroundColor: titleColor }} />
          <div className="mb-1 h-1 w-1/2 rounded-full opacity-70" style={{ backgroundColor: subtitleColor }} />
          <div className="mt-1.5 h-3 w-8 rounded-full" style={{ backgroundColor: accentColor }} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-white">{preset.label}</p>
          <p className="text-[10px] text-zinc-500">{preset.description}</p>
        </div>
        <div className="flex gap-0.5">
          {[bgColor, accentColor, subtitleColor].map((c, i) => (
            <div key={i} className="h-2.5 w-2.5 rounded-full border border-white/10" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </button>
  );
}

// ── Color picker row (accordion) ──────────────────────────────────────────────

function ColorPickerRow({ varKey, label, options, currentValue, isNeutralBg, isOpen, onToggle, onSelect, onOpenAdvanced }) {
  const moreRef = useRef(null);

  return (
    <div className="overflow-hidden rounded-xl border border-white/6" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/3 focus:outline-none cursor-pointer"
      >
        <div className="relative h-6 w-6 shrink-0 rounded-md border border-white/10" style={THEME_NEUTRAL_BG.has(varKey) ? { backgroundColor: '#1a1a1a' } : {}}>
          {THEME_NEUTRAL_BG.has(varKey)
            ? <div className="absolute inset-1 rounded-sm" style={{ backgroundColor: currentValue }} />
            : <div className="absolute inset-0 rounded-md" style={{ backgroundColor: currentValue }} />
          }
        </div>
        <span className="flex-1 text-left text-xs text-zinc-300">{label}</span>
        <svg
          className="h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          viewBox="0 0 12 12" fill="none"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="transition-[grid-template-rows] duration-300" style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className="px-3 pb-3 pt-1" style={isNeutralBg ? { backgroundColor: 'rgba(26,26,26,0.6)' } : undefined}>
            <div className="flex flex-wrap items-center gap-1.5">
              {options.map(color => {
                const isActive = currentValue === color;
                return (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onClick={() => onSelect(color)}
                    className="h-7 w-7 shrink-0 rounded-full border border-white/10 transition-all duration-150 hover:scale-110 focus:outline-none cursor-pointer"
                    style={{ backgroundColor: color, ...(isActive ? { outline: '2px solid rgba(255,255,255,0.85)', outlineOffset: '2.5px' } : {}) }}
                  />
                );
              })}

              <button
                ref={moreRef}
                type="button"
                onClick={() => onOpenAdvanced(moreRef.current?.getBoundingClientRect())}
                className="flex h-7 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 text-[10px] text-zinc-400 transition hover:bg-white/10 hover:text-zinc-200 cursor-pointer"
              >
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6 3.5v5M3.5 6h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Más colores
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

function ThemePickerStep({ data, onFieldChange }) {
  const { theme: uiTheme, setThemeValue } = useTheme();
  const [openVarKey, setOpenVarKey]       = useState(null);
  const [advPicker, setAdvPicker]         = useState(null); // { key, triggerRect }

  function handleToggle(key) {
    setOpenVarKey(prev => prev === key ? null : key);
  }

  function handleSelectColor(key, color) {
    setThemeValue(key, color);
    setOpenVarKey(null);
  }

  function handleOpenAdvanced(key, triggerRect) {
    setAdvPicker({ key, triggerRect });
  }

  function handleAdvSelect(color) {
    if (advPicker) setThemeValue(advPicker.key, color);
  }

  function handleAdvClose() {
    setAdvPicker(null);
    setOpenVarKey(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-zinc-500">Estilos rápidos</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {THEME_PRESETS.map(preset => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isActive={data.theme === preset.id}
              onClick={() => {
                onFieldChange('theme', preset.id);
                Object.entries(preset.values).forEach(([key, val]) => setThemeValue(key, val));
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-zinc-500">Personalización</p>
        <div className="space-y-1.5">
          {Object.keys(THEME_OPTIONS).map(key => (
            <ColorPickerRow
              key={key}
              varKey={key}
              label={THEME_VAR_LABELS[key]}
              options={THEME_OPTIONS[key]}
              currentValue={uiTheme[key]}
              isNeutralBg={THEME_NEUTRAL_BG.has(key)}
              isOpen={openVarKey === key}
              onToggle={() => handleToggle(key)}
              onSelect={color => handleSelectColor(key, color)}
              onOpenAdvanced={rect => handleOpenAdvanced(key, rect)}
            />
          ))}
        </div>
      </div>

      {advPicker && (
        <AdvancedColorPicker
          currentValue={uiTheme[advPicker.key]}
          onSelect={handleAdvSelect}
          onClose={handleAdvClose}
          triggerRect={advPicker.triggerRect}
        />
      )}
    </div>
  );
}

export default ThemePickerStep;
