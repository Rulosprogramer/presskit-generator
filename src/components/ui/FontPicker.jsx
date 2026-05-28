import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fontOptions } from '../../data/fontOptions.js';
import { useTheme } from '../../context/ThemeContext.tsx';

const loadedFonts = new Set();
let allFontOptionsLoaded = false;

function loadGoogleFont(family) {
  if (loadedFonts.has(family)) return;
  loadedFonts.add(family);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;700&display=swap`;
  document.head.appendChild(link);
}

function loadAllFontOptions() {
  if (allFontOptionsLoaded) return;
  allFontOptionsLoaded = true;
  const families = fontOptions.map(f => f.family.replace(/ /g, '+')).join('&family=');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  document.head.appendChild(link);
  fontOptions.forEach(f => loadedFonts.add(f.family));
}

function computePanelStyle(buttonEl) {
  const rect = buttonEl.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const panelHeight = 320;

  if (spaceBelow < panelHeight) {
    return {
      position: 'fixed',
      bottom: window.innerHeight - rect.top + 8,
      left: rect.left,
      width: Math.max(rect.width, 320),
      zIndex: 9999,
    };
  }
  return {
    position: 'fixed',
    top: rect.bottom + 8,
    left: rect.left,
    width: Math.max(rect.width, 320),
    zIndex: 9999,
  };
}

function FontOptionRow({ font, isActive, onSelect, accentColor }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(font.family)}
      className="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
      style={
        isActive
          ? { backgroundColor: `${accentColor}14`, borderLeft: `2px solid ${accentColor}` }
          : { borderLeft: '2px solid transparent' }
      }
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white" style={{ fontFamily: `'${font.family}', serif` }}>
          {font.family}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-zinc-400" style={{ fontFamily: `'${font.family}', serif` }}>
          {font.preview}
        </p>
      </div>
      <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-500 ring-1 ring-zinc-700">
        {font.category}
      </span>
      {isActive && (
        <span className="shrink-0 text-sm font-bold" style={{ color: accentColor }}>✓</span>
      )}
    </button>
  );
}

const CATEGORIES = ['Todas', 'Display', 'Serif', 'Sans', 'Expresiva'];

export default function FontPicker({ value, onChange, label, helperText }) {
  const [open, setOpen]           = useState(false);
  const [search, setSearch]       = useState('');
  const [activeCat, setActiveCat] = useState('Todas');
  const [panelStyle, setPanelStyle] = useState({});

  const containerRef = useRef(null);
  const buttonRef    = useRef(null);
  const panelRef     = useRef(null);
  const searchRef    = useRef(null);

  const { theme } = useTheme();
  const accentColor = theme.accentColor;

  // Load the active font so the trigger button renders in it
  useEffect(() => {
    if (value) loadGoogleFont(value);
  }, [value]);

  // Close when clicking outside both the container and the panel
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        !containerRef.current?.contains(e.target) &&
        !panelRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Recompute position on resize / scroll while open
  const recompute = useCallback(() => {
    if (buttonRef.current) setPanelStyle(computePanelStyle(buttonRef.current));
  }, []);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('resize', recompute);
    window.addEventListener('scroll', recompute, true);
    return () => {
      window.removeEventListener('resize', recompute);
      window.removeEventListener('scroll', recompute, true);
    };
  }, [open, recompute]);

  // Focus search input when panel opens
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => searchRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  const handleOpen = () => {
    if (!buttonRef.current) return;
    loadAllFontOptions();
    setPanelStyle(computePanelStyle(buttonRef.current));
    setOpen(true);
  };

  const filtered = fontOptions.filter(f => {
    const matchesSearch = !search || f.family.toLowerCase().includes(search.toLowerCase());
    const matchesCat    = activeCat === 'Todas' || f.category === activeCat;
    return matchesSearch && matchesCat;
  });

  const handleSelect = (family) => {
    onChange(family);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="w-full">
      {label && (
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </p>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? setOpen(false) : handleOpen())}
        className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-150"
        style={{
          backgroundColor: open ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${open ? accentColor + '66' : 'rgba(255,255,255,0.1)'}`,
          fontFamily: value ? `'${value}', serif` : undefined,
          color: value ? '#fff' : '#666',
        }}
      >
        <span className="truncate">{value || 'Elige una fuente'}</span>
        <svg
          width="13" height="13" viewBox="0 0 13 13" fill="none"
          className={`shrink-0 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4.5L6.5 9L11 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {helperText && (
        <p className="mt-1 text-[11px] text-zinc-500">{helperText}</p>
      )}

      {open && createPortal(
        <div
          ref={panelRef}
          className="flex flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{
            ...panelStyle,
            maxHeight: 320,
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Search */}
          <div className="shrink-0 px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <input
              ref={searchRef}
              id="font-picker-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar fuente..."
              className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
            />
          </div>

          {/* Category pills */}
          <div
            className="flex shrink-0 gap-1.5 overflow-x-auto px-3 py-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', scrollbarWidth: 'none' }}
          >
            {CATEGORIES.map(cat => {
              const isCatActive = activeCat === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  className="shrink-0 cursor-pointer rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-all"
                  style={{
                    backgroundColor: isCatActive ? `${accentColor}22` : 'rgba(255,255,255,0.05)',
                    border:          `1px solid ${isCatActive ? accentColor : 'rgba(255,255,255,0.1)'}`,
                    color:           isCatActive ? accentColor : 'rgb(130,130,130)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Font list */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-zinc-500">Sin resultados</p>
            ) : (
              filtered.map(font => (
                <FontOptionRow
                  key={font.family}
                  font={font}
                  isActive={value === font.family}
                  onSelect={handleSelect}
                  accentColor={accentColor}
                />
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
