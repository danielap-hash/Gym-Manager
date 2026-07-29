import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeSwitchProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  showLabels?: boolean;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  theme,
  onToggleTheme,
  showLabels = false,
}) => {
  const isDark = theme === 'dark';

  if (showLabels) {
    return (
      <div className="bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => isDark && onToggleTheme()}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
            !isDark
              ? 'bg-white text-amber-600 shadow-sm border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sun className={`w-4 h-4 ${!isDark ? 'text-amber-500 fill-amber-500/20' : ''}`} />
          <span>Tema Claro</span>
        </button>

        <button
          type="button"
          onClick={() => !isDark && onToggleTheme()}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
            isDark
              ? 'bg-slate-900 text-blue-400 shadow-sm border border-slate-700'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Moon className={`w-4 h-4 ${isDark ? 'text-blue-400 fill-blue-400/20' : ''}`} />
          <span>Tema Oscuro</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      title={isDark ? 'Cambiar a Tema Claro' : 'Cambiar a Tema Oscuro'}
      className="relative inline-flex items-center h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 p-0.5 shrink-0 cursor-pointer shadow-inner border border-slate-300 dark:border-slate-700"
    >
      <span className="sr-only">Cambiar Tema</span>

      {/* Internal Track Icons */}
      <span className="absolute left-2 text-amber-500 flex items-center justify-center pointer-events-none opacity-80">
        <Sun className="w-3.5 h-3.5" />
      </span>
      <span className="absolute right-2 text-blue-400 flex items-center justify-center pointer-events-none opacity-80">
        <Moon className="w-3.5 h-3.5" />
      </span>

      {/* Sliding Knob */}
      <span
        className={`${
          isDark
            ? 'translate-x-8 bg-slate-900 text-blue-400 border-slate-700'
            : 'translate-x-0 bg-white text-amber-500 border-slate-200'
        } inline-block w-7 h-7 rounded-full shadow-md transform transition-transform duration-250 ease-out flex items-center justify-center z-10 border`}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-blue-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
      </span>
    </button>
  );
};
