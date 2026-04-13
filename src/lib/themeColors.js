// Theme color configurations
export const themeColors = {
  neon: {
    id: 'neon',
    name: 'Neon',
    label: 'Neon',
    primary: '#ec4899',      // fuchsia-500
    secondary: '#06b6d4',    // cyan-500
    primaryText: '#f472b6',  // fuchsia-300
    secondaryText: '#06b6d4', // cyan-400
    accentBg: 'rgba(244, 114, 182, 0.1)', // fuchsia-300/10
    accent: 'from-fuchsia-400 to-cyan-300',
    bg: 'bg-zinc-950',
    bgHex: '#09090b',
    border: 'border-fuchsia-500/30',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-300',
    textBg: '#ffffff',
    textBgSecondary: '#d4d4d8',
    rgb: {
      primary: '236, 72, 153',
      secondary: '6, 182, 212',
      primaryText: '244, 114, 182',
      secondaryText: '34, 211, 238',
    }
  },
  neutral: {
    id: 'neutral',
    name: 'Neutral',
    label: 'Neutral',
    primary: '#ffffff',      // white
    secondary: '#a1a1a1',    // zinc-400
    primaryText: '#ffffff',
    secondaryText: '#d4d4d8', // zinc-300
    accentBg: 'rgba(0, 0, 0, 0.05)',
    accent: 'from-white to-zinc-400',
    bg: 'bg-white',
    bgHex: '#ffffff',
    border: 'border-white/20',
    textPrimary: 'text-zinc-950',
    textSecondary: 'text-zinc-700',
    textBg: '#f4f4f5',
    textBgSecondary: '#71717a',
    rgb: {
      primary: '255, 255, 255',
      secondary: '161, 161, 161',
      primaryText: '255, 255, 255',
      secondaryText: '212, 212, 212',
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    label: 'Dark',
    primary: '#3f3f46',      // zinc-800
    secondary: '#52525b',    // zinc-600
    primaryText: '#a1a1a1',  // zinc-400
    secondaryText: '#71717a', // zinc-500
    accentBg: 'rgba(63, 63, 70, 0.1)',
    accent: 'from-zinc-800 to-zinc-600',
    bg: 'bg-black',
    bgHex: '#000000',
    border: 'border-zinc-700/50',
    textPrimary: 'text-zinc-300',
    textSecondary: 'text-zinc-500',
    textBg: '#18181b',
    textBgSecondary: '#71717a',
    rgb: {
      primary: '63, 63, 70',
      secondary: '82, 82, 91',
      primaryText: '161, 161, 161',
      secondaryText: '113, 113, 122',
    }
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    label: 'Minimal',
    primary: '#10b981',      // emerald-500
    secondary: '#06b6d4',    // cyan-500
    primaryText: '#6ee7b7',  // emerald-300
    secondaryText: '#22d3ee', // cyan-400
    accentBg: 'rgba(16, 185, 129, 0.1)',
    accent: 'from-emerald-300 to-cyan-300',
    bg: 'bg-white',
    bgHex: '#ffffff',
    border: 'border-emerald-500/30',
    textPrimary: 'text-emerald-700',
    textSecondary: 'text-emerald-600',
    textBg: '#ecfdf5',
    textBgSecondary: '#6b7280',
    rgb: {
      primary: '16, 185, 129',
      secondary: '6, 182, 212',
      primaryText: '110, 231, 183',
      secondaryText: '34, 211, 238',
    }
  },
};

// Get theme by ID
export function getTheme(themeId = 'neon') {
  return themeColors[themeId] || themeColors.neon;
}

// Get tailwind color classes for theme
export function getThemeClasses(themeId = 'neon') {
  const theme = getTheme(themeId);
  return {
    primaryText: themeId === 'neutral' ? 'text-zinc-900' : themeId === 'dark' ? 'text-zinc-400' : themeId === 'minimal' ? 'text-emerald-300' : 'text-fuchsia-300',
    secondaryText: themeId === 'neutral' ? 'text-zinc-600' : themeId === 'dark' ? 'text-zinc-500' : themeId === 'minimal' ? 'text-cyan-400' : 'text-cyan-300',
    accentBg: themeId === 'neutral' ? 'bg-zinc-100' : themeId === 'dark' ? 'bg-zinc-900' : themeId === 'minimal' ? 'bg-emerald-300/10' : 'bg-fuchsia-300/10',
    borderColor: themeId === 'neutral' ? 'border-zinc-200' : themeId === 'dark' ? 'border-zinc-700' : themeId === 'minimal' ? 'border-emerald-500/30' : 'border-cyan-300/40',
    bgGradient: theme.accent,
  };
}

// Get color for a specific role based on theme
export function getThemeColor(role, themeId = 'neon') {
  const theme = getTheme(themeId);
  const colorMap = {
    primary: theme.primary,
    secondary: theme.secondary,
    primaryText: theme.primaryText,
    secondaryText: theme.secondaryText,
  };
  return colorMap[role] || theme.primary;
}
