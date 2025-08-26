// Theme system types for Bingo Game

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface ColorScheme {
  bgPrimary: string;
  bgSecondary: string;
  bgSurface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentSuccess: string;
  accentWarning: string;
  accentError: string;
  borderColor: string;
  shadowColor: string;
}

export interface ThemeConfig {
  theme: Theme;
  colorScheme: ColorScheme;
  customProperties?: Record<string, string>;
}

export interface ThemePreferences {
  selectedTheme: Theme;
  customColors?: Partial<ColorScheme>;
  accessibility?: AccessibilitySettings;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontScale: number; // 1 = 100%, 1.5 = 150%, etc.
  focusIndicator: boolean;
}
