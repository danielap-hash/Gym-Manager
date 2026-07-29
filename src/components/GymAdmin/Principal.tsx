import React from 'react';
import { Client } from '../../types';
import { Users, AlertCircle, UserPlus, ChevronRight, CheckCircle2 } from 'lucide-react';

interface PrincipalProps {
  clients: Client[];
  onNavigateTo: (screen: 'principal' | 'panel' | 'estado' | 'registrar' | 'balance' | 'ajustes') => void;
}

export const Principal: React.FC<PrincipalProps> = ({ clients, onNavigateTo }) => {
  const totalClients = clients.length;
  const overdueClients = clients.filter((c) => c.status === 'atrasado' || c.status === 'parcial').length;
  const dueTodayClients = clients.filter((c) => c.status === 'proximo_vencer').length;

  return (
    <div className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Principal</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Panel de acceso rápido y gestión de gimnasio</p>
      </div>

      {/* Main Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Clientes Card */}
        <button
          onClick={() => onNavigateTo('panel')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-base block">Clientes</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {totalClients === 0 ? 'Sin clientes registrados' : `${totalClients} clientes registrados`}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {/* Estado de Clientes Card */}
        <button
          onClick={() => onNavigateTo('estado')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
              overdueClients > 0
                ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white'
            }`}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-base block">Estado de Clientes</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {overdueClients > 0
                  ? `${overdueClients} en mora / parciales`
                  : 'Todos los pagos al día'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {overdueClients > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            )}
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Main Add Client Callout Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {totalClients === 0
                  ? 'Sin clientes registrados'
                  : '¿Deseas agregar un socio?'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registra nombre, DNI, cuota y vencimiento
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTo('registrar')}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <UserPlus className="w-4 h-4" />
            Agregar Cliente Nuevo
          </button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      {totalClients > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Resumen de Hoy</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
                !
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase tracking-wider block font-semibold">Próximos a Vencer</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">{dueTodayClients} clientes</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase tracking-wider block font-semibold">Pagos Al Día</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {clients.filter((c) => c.status === 'al_dia').length} clientes
                </span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3.5 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase tracking-wider block font-semibold">Total Socios</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {totalClients} socios activos
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

