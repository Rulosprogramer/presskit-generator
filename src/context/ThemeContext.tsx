import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'presskit_ui_theme';

export interface Theme {
  bgColor: string;
  cardBg: string;
  titleColor: string;
  subtitleColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  overlayColor: string;
}

const DEFAULTS: Theme = {
  bgColor: '#0D0D0D',
  cardBg: '#161616',
  titleColor: '#FFFFFF',
  subtitleColor: '#AAAAAA',
  textColor: '#FFFFFF',
  accentColor: '#FF6B6B',
  borderColor: 'rgba(255,255,255,0.08)',
  overlayColor: 'rgba(0,0,0,0.3)',
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

interface ThemeContextValue {
  theme: Theme;
  setThemeValue: (key: keyof Theme, value: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(loadTheme);

  const setThemeValue = useCallback((key: keyof Theme, value: string) => {
    setThemeState((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setThemeValue }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
