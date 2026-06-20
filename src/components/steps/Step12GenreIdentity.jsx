import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext.tsx';
import { genreIdentities } from '../../data/genreIdentities.js';
import FontPicker from '../ui/FontPicker.jsx';

const FONT_ROLES = [
  { key: 'titleFont',    label: 'Títulos',    helperText: 'Elige la tipografía de títulos' },
  { key: 'subtitleFont', label: 'Subtítulos', helperText: 'Elige la tipografía de subtítulos' },
  { key: 'bodyFont',     label: 'Cuerpo',     helperText: 'Elige la tipografía de cuerpo de texto' },
  { key: 'labelFont',    label: 'Labels',     helperText: 'Elige la tipografía de etiquetas' },
];

function buildAllFontsUrl() {
  const allFamilies = [...new Set(
    genreIdentities.flatMap(g => g.googleFonts)
  )];
  return `https://fonts.googleapis.com/css2?family=${allFamilies.join('&family=')}&display=swap`;
}

const CUSTOM_FONT_ROLES = [
  { key: 'title',    label: 'Títulos' },
  { key: 'subtitle', label: 'Subtítulos' },
  { key: 'body',     label: 'Cuerpo de texto' },
];

export default function Step12GenreIdentity({ customFonts = {}, onCustomFontUpload, onRemoveCustomFont }) {
  const { typography, setTypographyValue, activeGenre, applyGenreIdentity } = useTheme();

  useEffect(() => {
    const id = 'presskit-gfonts-preview';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = buildAllFontsUrl();
    document.head.appendChild(link);
  }, []);

  const activeData = genreIdentities.find(g => g.id === activeGenre) ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-white">Elige tu identidad visual</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Escoge la tipografía con la que te identificas.
        </p>
      </div>

      {/* Custom font upload */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Tu tipografía propia (.ttf .otf .woff .woff2)</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CUSTOM_FONT_ROLES.map(({ key, label }) => {
            const current = customFonts?.[key];
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
                {current ? (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/8 px-3 py-2">
                    <span className="min-w-0 flex-1 truncate text-xs text-emerald-300">{current.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveCustomFont?.(key)}
                      className="shrink-0 text-[10px] text-zinc-500 transition hover:text-red-400"
                      title="Eliminar fuente"
                    >✕</button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/3 px-3 py-2.5 text-xs text-zinc-400 transition hover:border-white/30 hover:text-zinc-200">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 4l3-3 3 3M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span>Subir archivo</span>
                    <input
                      type="file"
                      accept=".ttf,.otf,.woff,.woff2"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onCustomFontUpload?.(key, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[10px] text-zinc-600">Las fuentes personalizadas se aplican en la web y el PDF. Tienen prioridad sobre las opciones de Google Fonts.</p>
      </div>

      {/* Manual font pickers — 2×2 grid */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Ajuste manual</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FONT_ROLES.map(({ key, label, helperText }) => (
            <FontPicker
              key={key}
              label={label}
              helperText={helperText}
              value={typography[key]}
              onChange={(family) => setTypographyValue(key, family)}
            />
          ))}
        </div>
      </div>

      {/* Genre grid */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Presets de género</p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {genreIdentities.map((genre) => {
            const isActive = activeGenre === genre.id;
            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => applyGenreIdentity(genre.id)}
                className="group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-0.5 focus:outline-none"
                style={{
                  backgroundColor: isActive
                    ? `${genre.colors.cardBg}`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? genre.colors.accentColor : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isActive
                    ? `0 0 24px ${genre.colors.accentColor}30, 0 0 0 1px ${genre.colors.accentColor}20`
                    : 'none',
                }}
              >
                {isActive && (
                  <div
                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: genre.colors.accentColor }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 3.5-4" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{genre.emoji}</span>
                  <span className="text-[11px] font-semibold leading-tight text-white">{genre.label}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {genre.mood.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                      style={{
                        backgroundColor: `${genre.colors.accentColor}18`,
                        color: genre.colors.accentColor,
                        border: `1px solid ${genre.colors.accentColor}28`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  className="overflow-hidden rounded-xl p-3"
                  style={{
                    backgroundColor: genre.colors.bgColor,
                    border: `1px solid ${genre.colors.borderColor}`,
                  }}
                >
                  <p
                    className="text-[11px] leading-tight"
                    style={{
                      fontFamily: `'${genre.fonts.title}', serif`,
                      fontWeight: genre.fonts.weight,
                      color: genre.colors.titleColor,
                    }}
                  >
                    {genre.fonts.title}
                  </p>
                  <p
                    className="mt-1 text-[11px] leading-tight"
                    style={{
                      fontFamily: `'${genre.fonts.body}', sans-serif`,
                      color: genre.colors.subtitleColor,
                    }}
                  >
                    {genre.fonts.body}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active genre banner */}
      {activeData && (
        <div
          className="flex items-center gap-4 rounded-2xl p-4"
          style={{
            backgroundColor: `${activeData.colors.accentColor}10`,
            border: `1px solid ${activeData.colors.accentColor}30`,
          }}
        >
          <span className="text-3xl">{activeData.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white">{activeData.label}</p>
            <p className="mt-0.5 text-xs text-zinc-400">
              Títulos: <span className="text-zinc-200" style={{ fontFamily: `'${typography.titleFont}', serif` }}>{typography.titleFont || activeData.fonts.title}</span>
              {' · '}
              Cuerpo: <span className="text-zinc-200" style={{ fontFamily: `'${typography.bodyFont}', sans-serif` }}>{typography.bodyFont || activeData.fonts.body}</span>
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {activeData.mood.map(tag => (
                <span
                  key={tag}
                  className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                  style={{ color: activeData.colors.accentColor, backgroundColor: `${activeData.colors.accentColor}14`, border: `1px solid ${activeData.colors.accentColor}22` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {}}
            className="shrink-0 cursor-pointer text-[10px] text-zinc-500 transition hover:text-zinc-300"
          >
            Activo ✓
          </button>
        </div>
      )}
    </div>
  );
}
