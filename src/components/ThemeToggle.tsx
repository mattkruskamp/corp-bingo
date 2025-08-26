import React from 'react';

import { Theme } from '../types/theme';

type ThemeToggleProps = {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center gap-1 ml-2" role="radiogroup" aria-label="Theme selection">
      <button
        type="button"
        role="radio"
        aria-checked={currentTheme === Theme.LIGHT}
        aria-label="Light theme"
        className={`px-2 py-1 rounded focus:outline-none focus:ring transition-colors ${currentTheme === Theme.LIGHT ? 'bg-yellow-100 text-yellow-800 font-bold' : 'bg-gray-100 text-gray-600'}`}
        onClick={() => onThemeChange(Theme.LIGHT)}
      >
        ☀️ Light
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={currentTheme === Theme.DARK}
        aria-label="Dark theme"
        className={`px-2 py-1 rounded focus:outline-none focus:ring transition-colors ${currentTheme === Theme.DARK ? 'bg-blue-900 text-white font-bold' : 'bg-gray-100 text-gray-600'}`}
        onClick={() => onThemeChange(Theme.DARK)}
      >
        🌙 Dark
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={currentTheme === Theme.SYSTEM}
        aria-label="System theme"
        className={`px-2 py-1 rounded focus:outline-none focus:ring transition-colors ${currentTheme === Theme.SYSTEM ? 'bg-green-200 text-green-900 font-bold' : 'bg-gray-100 text-gray-600'}`}
        onClick={() => onThemeChange(Theme.SYSTEM)}
      >
        🖥️ System
      </button>
    </div>
  );
};
