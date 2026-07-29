import React from 'react';
import { ActiveUser } from '../types';
import { BarChart3, Home, Settings, Shield } from 'lucide-react';

interface BottomNavProps {
  activeScreen: 'principal' | 'panel' | 'estado' | 'registrar' | 'balance' | 'ajustes' | 'superadmin';
  activeUser: ActiveUser;
  onNavigateTo: (screen: 'principal' | 'panel' | 'estado' | 'registrar' | 'balance' | 'ajustes' | 'superadmin') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  activeUser,
  onNavigateTo,
}) => {
  const isSuper = activeUser.role === 'superadmin';

  if (isSuper && activeScreen === 'superadmin') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 py-2.5 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-around md:justify-center md:gap-12">
          <button
            onClick={() => onNavigateTo('superadmin')}
            className="flex flex-col items-center gap-1 text-blue-600 dark:text-amber-400 font-bold text-[11px]"
          >
            <Shield className="w-5 h-5" />
            <span>Gestión Gyms</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 py-2.5 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-around md:justify-center md:gap-16">
        {/* Balance */}
        <button
          onClick={() => onNavigateTo('balance')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
            activeScreen === 'balance'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Balance</span>
        </button>

        {/* Inicio */}
        <button
          onClick={() => onNavigateTo('principal')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
            activeScreen === 'principal' || activeScreen === 'panel' || activeScreen === 'estado' || activeScreen === 'registrar'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Inicio</span>
        </button>

        {/* Ajustes */}
        <button
          onClick={() => onNavigateTo('ajustes')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
            activeScreen === 'ajustes'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Ajustes</span>
        </button>

        {/* SuperAdmin Switcher badge if superadmin is logged in but auditing a gym */}
        {isSuper && (
          <button
            onClick={() => onNavigateTo('superadmin')}
            className="flex flex-col items-center gap-1 text-amber-700 dark:text-amber-300 font-bold text-[10px] bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
          >
            <Shield className="w-4 h-4" />
            <span>Volver a Super</span>
          </button>
        )}
      </div>
    </nav>
  );
};

