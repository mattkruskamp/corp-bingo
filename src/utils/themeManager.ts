// ThemeManager: handles theme switching, persistence, and CSS custom properties
import { Theme, ThemePreferences, ColorScheme } from '../types/theme';

const THEME_STORAGE_KEY = 'bingo-theme-preferences';

const lightScheme: ColorScheme = {
  bgPrimary: '#f8fafc',
  bgSecondary: '#e2e8f0',
  bgSurface: '#fff',
  textPrimary: '#222',
  textSecondary: '#555',
  textMuted: '#888',
  accentPrimary: '#2563eb',
  accentSuccess: '#22c55e',
  accentWarning: '#facc15',
  accentError: '#ef4444',
  borderColor: '#cbd5e1',
  shadowColor: 'rgba(0,0,0,0.08)',
};

const darkScheme: ColorScheme = {
  bgPrimary: '#18181b',
  bgSecondary: '#27272a',
  bgSurface: '#23232b',
  textPrimary: '#fafafa',
  textSecondary: '#e5e7eb',
  textMuted: '#a1a1aa',
  accentPrimary: '#60a5fa',
  accentSuccess: '#4ade80',
  accentWarning: '#fde047',
  accentError: '#f87171',
  borderColor: '#3f3f46',
  shadowColor: 'rgba(0,0,0,0.32)',
};

export class ThemeManager {
  private preferences: ThemePreferences;
  private listeners: Array<(theme: Theme) => void> = [];
  private mediaQueryList: MediaQueryList | null = null;
  private systemListener: ((e: MediaQueryListEvent) => void) | null = null;

  constructor() {
    this.preferences = this.loadPreferences();
    this.applyTheme(this.preferences.selectedTheme);
    this.listenToSystemTheme();
  }

  private loadPreferences(): ThemePreferences {
    try {
      const prefs = localStorage.getItem(THEME_STORAGE_KEY);
      if (prefs) {
        return JSON.parse(prefs);
      }
    } catch {}
    return { selectedTheme: Theme.SYSTEM };
  }

  private savePreferences() {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(this.preferences));
  }

  getCurrentTheme(): Theme {
    return this.preferences.selectedTheme;
  }

  applyTheme(theme: Theme) {
    this.preferences.selectedTheme = theme;
    this.savePreferences();
    // Comment 3: Respect system preference
    const isDark =
      theme === Theme.DARK ||
      (theme === Theme.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const themeUsed = isDark ? Theme.DARK : Theme.LIGHT;
    const scheme = themeUsed === Theme.DARK ? darkScheme : lightScheme;
    // Unified variable names
    const varMap = {
      bgPrimary: '--bg-primary',
      bgSecondary: '--bg-secondary',
      bgSurface: '--bg-surface',
      textPrimary: '--text-primary',
      textSecondary: '--text-secondary',
      textMuted: '--text-muted',
      accentPrimary: '--accent-primary',
      accentSuccess: '--accent-success',
      accentWarning: '--accent-warning',
      accentError: '--accent-error',
      borderColor: '--border-color',
      shadowColor: '--shadow-color',
    };
    for (const [key, value] of Object.entries(scheme)) {
      const cssVar =
        varMap[key as keyof typeof varMap] || `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      document.documentElement.style.setProperty(cssVar, value);
    }
    document.documentElement.setAttribute('data-theme', themeUsed);
    document.documentElement.classList.toggle('dark', themeUsed === Theme.DARK);
    this.listeners.forEach((cb) => cb(themeUsed));
  }

  toggleTheme() {
    const next = this.preferences.selectedTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    this.applyTheme(next);
  }

  listenToSystemTheme() {
    if (window.matchMedia) {
      this.mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemListener = (e: MediaQueryListEvent) => {
        if (this.preferences.selectedTheme === Theme.SYSTEM) {
          this.applyTheme(e.matches ? Theme.DARK : Theme.LIGHT);
        }
      };
      this.mediaQueryList.addEventListener('change', this.systemListener);
    }
  }

  dispose() {
    if (this.mediaQueryList && this.systemListener) {
      this.mediaQueryList.removeEventListener('change', this.systemListener);
      this.mediaQueryList = null;
      this.systemListener = null;
    }
    this.listeners = [];
  }

  offThemeChange(cb: (theme: Theme) => void) {
    this.listeners = this.listeners.filter((fn) => fn !== cb);
  }

  onThemeChange(cb: (theme: Theme) => void) {
    this.listeners.push(cb);
  }
}

export function getSystemTheme(): Theme {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.DARK;
  }
  return Theme.LIGHT;
}

export function loadThemePreferences(): Theme {
  try {
    const prefs = localStorage.getItem(THEME_STORAGE_KEY);
    if (prefs) {
      const parsed = JSON.parse(prefs);
      return parsed.selectedTheme || Theme.SYSTEM;
    }
  } catch {}
  return Theme.SYSTEM;
}
