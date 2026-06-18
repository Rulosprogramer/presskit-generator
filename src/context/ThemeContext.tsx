import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { genreIdentities } from '../data/genreIdentities.js';

const STORAGE_KEY    = 'presskit_ui_theme';
const TYPOGRAPHY_KEY = 'presskit_ui_typography';
const GENRE_KEY      = 'presskit_active_genre';

export interface Theme {
  bgColor: string;
  cardBg: string;
  titleColor: string;
  subtitleColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  overlayColor: string;
  textEffect: string;
  subtitleEffect: string;
  textEffectPdf: string;
  subtitleEffectPdf: string;
}

export interface Typography {
  titleFont: string;
  subtitleFont: string;
  bodyFont: string;
  labelFont: string;
  weight: string;
  tracking: string;
  transform: string;
}

const DEFAULTS: Theme = {
  bgColor: '#0D0D0D',
  cardBg: '#161616',
  titleColor: '#FFFFFF',
  subtitleColor: '#AAAAAA',
  textColor: '#FFFFFF',
  accentColor: '#FF6B6B',
  borderColor: 'rgba(255,255,255,0.08)',
  overlayColor: 'rgba(0,0,0,0.36)',
  textEffect: 'none',
  subtitleEffect: 'none',
  textEffectPdf: 'none',
  subtitleEffectPdf: 'none',
};

const DEFAULT_TYPOGRAPHY: Typography = {
  titleFont: '',
  subtitleFont: '',
  bodyFont: '',
  labelFont: '',
  weight: '700',
  tracking: 'normal',
  transform: 'none',
};

function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Theme>) };
  } catch {
    return DEFAULTS;
  }
}

function loadTypography(): Typography {
  try {
    const raw = localStorage.getItem(TYPOGRAPHY_KEY);
    if (!raw) return DEFAULT_TYPOGRAPHY;
    return { ...DEFAULT_TYPOGRAPHY, ...(JSON.parse(raw) as Partial<Typography>) };
  } catch {
    return DEFAULT_TYPOGRAPHY;
  }
}

function loadGenre(): string | null {
  try {
    return localStorage.getItem(GENRE_KEY);
  } catch {
    return null;
  }
}

function injectGoogleFonts(families: string[]) {
  const unique = [...new Set(families.filter(Boolean))];
  if (!unique.length) return;
  let el = document.getElementById('presskit-gfonts') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.id = 'presskit-gfonts';
    el.rel = 'stylesheet';
    document.head.appendChild(el);
  }
  el.href = `https://fonts.googleapis.com/css2?family=${unique.join('&family=')}&display=swap`;
}

interface ThemeContextValue {
  theme: Theme;
  setThemeValue: (key: keyof Theme, value: string) => void;
  typography: Typography;
  setTypographyValue: (key: keyof Typography, value: string) => void;
  activeGenre: string | null;
  applyGenreIdentity: (genreId: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState]           = useState<Theme>(loadTheme);
  const [typography, setTypographyState] = useState<Typography>(loadTypography);
  const [activeGenre, setActiveGenre]    = useState<string | null>(loadGenre);

  // Re-inject saved Google Fonts on mount
  useEffect(() => {
    const saved = loadTypography();
    const fontKeys = ['titleFont', 'subtitleFont', 'bodyFont', 'labelFont'] as const;
    const families = fontKeys
      .map(k => saved[k])
      .filter(Boolean)
      .map(name => name.replace(/ /g, '+'));
    if (families.length) injectGoogleFonts(families);

    const genreId = loadGenre();
    if (!genreId) return;
    const found = genreIdentities.find(g => g.id === genreId);
    if (found) injectGoogleFonts(found.googleFonts);
  }, []);

  // Sync theme/typography across tabs (e.g. editor → preview tab) when localStorage changes
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setThemeState(loadTheme());
      else if (event.key === TYPOGRAPHY_KEY) setTypographyState(loadTypography());
      else if (event.key === GENRE_KEY) setActiveGenre(loadGenre());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setThemeValue = useCallback((key: keyof Theme, value: string) => {
    setThemeState((prev) => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const setTypographyValue = useCallback((key: keyof Typography, value: string) => {
    setTypographyState((prev) => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(TYPOGRAPHY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    if ((key === 'titleFont' || key === 'subtitleFont' || key === 'bodyFont' || key === 'labelFont') && value) {
      injectGoogleFonts([value.replace(/ /g, '+')]);
    }
  }, []);

  const applyGenreIdentity = useCallback((genreId: string) => {
    const found = genreIdentities.find(g => g.id === genreId);
    if (!found) return;

    const newTypography: Typography = {
      titleFont:    found.fonts.title       || '',
      subtitleFont: found.fonts.subtitleFont || found.fonts.body || '',
      bodyFont:     found.fonts.body         || '',
      labelFont:    found.fonts.labelFont    || found.fonts.body || '',
      weight:       found.fonts.weight       || '700',
      tracking:     found.fonts.tracking     || 'normal',
      transform:    found.fonts.transform    || 'none',
    };

    setTypographyState(newTypography);
    try { localStorage.setItem(TYPOGRAPHY_KEY, JSON.stringify(newTypography)); } catch {}

    setActiveGenre(genreId);
    try { localStorage.setItem(GENRE_KEY, genreId); } catch {}

    injectGoogleFonts(found.googleFonts);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setThemeValue, typography, setTypographyValue, activeGenre, applyGenreIdentity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
