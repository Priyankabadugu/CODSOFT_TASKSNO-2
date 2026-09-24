import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type AccentColor = 'violet' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan';

export interface AccentThemeConfig {
  id: AccentColor;
  name: string;
  dotColor: string;
  gradientText: string;
  gradientBg: string;
  badgeBg: string;
  badgeText: string;
  primaryBg: string;
  primaryHover: string;
  activeRing: string;
  glowColor: string;
  subtleBorder: string;
  checkboxBg: string;
}

export const ACCENT_THEMES: Record<AccentColor, AccentThemeConfig> = {
  violet: {
    id: 'violet',
    name: 'Electric Violet',
    dotColor: '#a855f7',
    gradientText: 'from-violet-500 via-purple-500 to-indigo-500',
    gradientBg: 'from-violet-600 to-indigo-600',
    badgeBg: 'bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60',
    badgeText: 'text-violet-600 dark:text-violet-400',
    primaryBg: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-violet-500/25',
    primaryHover: 'hover:from-violet-500 hover:to-purple-500',
    activeRing: 'ring-violet-500/30 border-violet-500 dark:border-violet-400',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    subtleBorder: 'border-violet-200 dark:border-violet-900/50',
    checkboxBg: 'bg-violet-600 border-violet-600 text-white',
  },
  indigo: {
    id: 'indigo',
    name: 'Cyber Indigo',
    dotColor: '#6366f1',
    gradientText: 'from-indigo-500 via-blue-500 to-cyan-500',
    gradientBg: 'from-indigo-600 to-blue-600',
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    primaryBg: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-indigo-500/25',
    primaryHover: 'hover:from-indigo-500 hover:to-blue-500',
    activeRing: 'ring-indigo-500/30 border-indigo-500 dark:border-indigo-400',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    subtleBorder: 'border-indigo-200 dark:border-indigo-900/50',
    checkboxBg: 'bg-indigo-600 border-indigo-600 text-white',
  },
  emerald: {
    id: 'emerald',
    name: 'Aurora Emerald',
    dotColor: '#10b981',
    gradientText: 'from-emerald-500 via-teal-500 to-cyan-500',
    gradientBg: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    primaryBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25',
    primaryHover: 'hover:from-emerald-500 hover:to-teal-500',
    activeRing: 'ring-emerald-500/30 border-emerald-500 dark:border-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    subtleBorder: 'border-emerald-200 dark:border-emerald-900/50',
    checkboxBg: 'bg-emerald-600 border-emerald-600 text-white',
  },
  rose: {
    id: 'rose',
    name: 'Sunset Rose',
    dotColor: '#f43f5e',
    gradientText: 'from-rose-500 via-pink-500 to-amber-500',
    gradientBg: 'from-rose-600 to-pink-600',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    badgeText: 'text-rose-600 dark:text-rose-400',
    primaryBg: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-500/25',
    primaryHover: 'hover:from-rose-500 hover:to-pink-500',
    activeRing: 'ring-rose-500/30 border-rose-500 dark:border-rose-400',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    subtleBorder: 'border-rose-200 dark:border-rose-900/50',
    checkboxBg: 'bg-rose-600 border-rose-600 text-white',
  },
  amber: {
    id: 'amber',
    name: 'Solar Amber',
    dotColor: '#f59e0b',
    gradientText: 'from-amber-500 via-orange-500 to-rose-500',
    gradientBg: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    badgeText: 'text-amber-600 dark:text-amber-400',
    primaryBg: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-500/25',
    primaryHover: 'hover:from-amber-500 hover:to-orange-500',
    activeRing: 'ring-amber-500/30 border-amber-500 dark:border-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    subtleBorder: 'border-amber-200 dark:border-amber-900/50',
    checkboxBg: 'bg-amber-600 border-amber-600 text-white',
  },
  cyan: {
    id: 'cyan',
    name: 'Ocean Cyan',
    dotColor: '#06b6d4',
    gradientText: 'from-cyan-500 via-sky-500 to-blue-500',
    gradientBg: 'from-cyan-600 to-sky-600',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    primaryBg: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-500/25',
    primaryHover: 'hover:from-cyan-500 hover:to-blue-500',
    activeRing: 'ring-cyan-500/30 border-cyan-500 dark:border-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    subtleBorder: 'border-cyan-200 dark:border-cyan-900/50',
    checkboxBg: 'bg-cyan-600 border-cyan-600 text-white',
  },
};

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  accentTheme: AccentThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'auratask-theme-preference';
const ACCENT_STORAGE_KEY = 'auratask-accent-preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'system';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
      if (saved && saved in ACCENT_THEMES) {
        return saved as AccentColor;
      }
    } catch {
      // fallback
    }
    return 'violet';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolved = () => {
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else {
        isDark = mediaQuery.matches;
      }

      setResolvedTheme(isDark ? 'dark' : 'light');
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateResolved();

    const listener = () => {
      if (theme === 'system') {
        updateResolved();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  // Sync accent to root dataset
  useEffect(() => {
    document.documentElement.dataset.accent = accent;
  }, [accent]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Failed to save theme in localStorage', e);
    }
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, newAccent);
    } catch (e) {
      console.warn('Failed to save accent in localStorage', e);
    }
  };

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const accentTheme = ACCENT_THEMES[accent] || ACCENT_THEMES.violet;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        accent,
        setAccent,
        accentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
