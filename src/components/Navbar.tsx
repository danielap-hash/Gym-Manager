import React from 'react';
import { ActiveUser, Gym } from '../types';
import { Shield, Dumbbell, UserCheck, RefreshCw, Sparkles, LogOut } from 'lucide-react';
import { ThemeSwitch } from './ThemeSwitch';

interface NavbarProps {
  activeUser: ActiveUser;
  activeGym?: Gym;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenProfileSwitch: () => void;
  onOpenAiAssistant?: () => void;
  onResetData?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeUser,
  activeGym,
  theme,
  onToggleTheme,
  onOpenProfileSwitch,
  onOpenAiAssistant,
  onResetData,
  onLogout,
}) => {
  const isSuper = activeUser.role === 'superadmin';
  const brandName = activeGym?.brandName || activeGym?.name || activeUser.gymName || 'GYM MANAGER';
  const logoUrl = activeGym?.logoUrl;
  const primaryColor = activeGym?.primaryColor || '#2563eb';

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {isSuper ? (
            activeUser.avatarUrl ? (
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-400 bg-slate-900 flex items-center justify-center shrink-0 shadow-xs">
                <img src={activeUser.avatarUrl} alt="SuperAdmin" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-amber-500 text-slate-950 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
            )
          ) : logoUrl ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center p-0.5 shrink-0">
              <img src={logoUrl} alt={brandName} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <Dumbbell className="w-4 h-4" />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none truncate">
              {isSuper ? 'GymNexus Console' : brandName}
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-widest font-semibold mt-0.5 truncate">
              {isSuper ? 'Superadmin' : `Admin: ${activeUser.username}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme Slider Toggle */}
          <ThemeSwitch theme={theme} onToggleTheme={onToggleTheme} />

          {onOpenAiAssistant && !isSuper && (
            <button
              onClick={onOpenAiAssistant}
              title="Asistente IA GymSaaS"
              className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-1 font-bold text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">IA</span>
            </button>
          )}

          <button
            onClick={onOpenProfileSwitch}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition border ${
              isSuper
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSuper ? 'Superadmin' : 'Perfil'}</span>
          </button>

          {activeUser.username && onLogout && (
            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Salir</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


