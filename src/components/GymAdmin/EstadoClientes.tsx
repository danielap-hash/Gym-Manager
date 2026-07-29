import React, { useState } from 'react';
import { Client } from '../../types';
import { 
  ArrowLeft, Search, CheckCircle2, AlertCircle, 
  CreditCard, MessageCircle, DollarSign, User 
} from 'lucide-react';

interface EstadoClientesProps {
  clients: Client[];
  onNavigateTo: (screen: 'principal' | 'panel' | 'estado' | 'registrar' | 'balance' | 'ajustes') => void;
  onUpdateClients: (clients: Client[]) => void;
}

export const EstadoClientes: React.FC<EstadoClientesProps> = ({
  clients,
  onNavigateTo,
  onUpdateClients,
}) => {
  const [activeTab, setActiveTab] = useState<'al_dia' | 'atrasados'>('al_dia');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const term = searchTerm.toLowerCase().trim();

  const alDiaClients = clients.filter(
    (c) =>
      c.status === 'al_dia' &&
      (!term ||
        c.fullName.toLowerCase().includes(term) ||
        (c.dni && c.dni.toLowerCase().includes(term)) ||
        c.phone.includes(term))
  );

  const atrasadosClients = clients.filter(
    (c) =>
      (c.status === 'atrasado' || c.status === 'parcial') &&
      (!term ||
        c.fullName.toLowerCase().includes(term) ||
        (c.dni && c.dni.toLowerCase().includes(term)) ||
        c.phone.includes(term))
  );

  const currentList = activeTab === 'al_dia' ? alDiaClients : atrasadosClients;
  const totalPages = Math.ceil(currentList.length / pageSize) || 1;
  const paginatedList = currentList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalAlDiaCount = clients.filter((c) => c.status === 'al_dia').length;
  const totalAtrasadosCount = clients.filter(
    (c) => c.status === 'atrasado' || c.status === 'parcial'
  ).length;

  const conDeudaTotalCount = clients.filter((c) => c.status === 'atrasado').length;
  const parcialesCount = clients.filter((c) => c.status === 'parcial').length;

  const totalDebtSum = clients.reduce((sum, c) => sum + (c.pendingDebt || 0), 0);
  const totalAlDiaIncome = clients
    .filter((c) => c.status === 'al_dia')
    .reduce((sum, c) => sum + (c.monthlyPrice || 0), 0);

  return (
    <div className="pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateTo('principal')}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Estado de Clientes</h1>
        <div className="w-10"></div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-bold text-slate-700 border border-slate-200/60">
        <button
          onClick={() => setActiveTab('al_dia')}
          className={`flex-1 py-2 rounded-lg transition text-center ${
            activeTab === 'al_dia'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Al día ({totalAlDiaCount})
        </button>
        <button
          onClick={() => setActiveTab('atrasados')}
          className={`flex-1 py-2 rounded-lg transition text-center ${
            activeTab === 'atrasados'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Atrasados ({totalAtrasadosCount})
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar por Nombre o DNI..."
          className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 shadow-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
      </div>

      {/* Secondary Indicator Pills */}
      {activeTab === 'al_dia' ? (
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 text-emerald-900">
            <span className="text-[10px] text-emerald-600 block font-semibold">Clientes al día</span>
            <span className="text-sm">{totalAlDiaCount} Clientes</span>
          </div>
          <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 text-emerald-900">
            <span className="text-[10px] text-emerald-600 block font-semibold">Ingresos Estimados</span>
            <span className="text-sm">${totalAlDiaIncome.toLocaleString('es-CO')} Ingresos</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-xs font-bold">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-rose-50/80 p-2.5 rounded-2xl border border-rose-100 text-rose-900">
              <span className="text-[10px] text-rose-500 block font-semibold">Con Deuda</span>
              <span className="text-sm">{conDeudaTotalCount} Clientes</span>
            </div>
            <div className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-100 text-amber-900">
              <span className="text-[10px] text-amber-600 block font-semibold">Parciales</span>
              <span className="text-sm">{parcialesCount} Clientes</span>
            </div>
          </div>
          <div className="bg-rose-100/60 p-3 rounded-2xl border border-rose-200 text-rose-950 flex items-center justify-between">
            <span className="text-xs font-bold">Total Deuda Acumulada</span>
            <span className="text-base font-black">${totalDebtSum.toLocaleString('es-CO')}</span>
          </div>
        </div>
      )}

      {/* Content Section */}
      {activeTab === 'al_dia' ? (
        alDiaClients.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3 my-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">No hay clientes al día</h3>
            <p className="text-xs text-slate-500">
              Los clientes con pagos al corriente aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {paginatedList.map((client) => (
              <div
                key={client.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">
                    {client.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{client.fullName}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-800 font-bold">
                        DNI: {client.dni || 'Sin DNI'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Vence: {client.dueDate}</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full shrink-0">
                  Al día
                </span>
              </div>
            ))}
          </div>
        )
      ) : atrasadosClients.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3 my-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">¡Excelente!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No hay clientes con deuda pendiente
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {paginatedList.map((client) => (
            <div
              key={client.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-rose-200 dark:border-rose-900/50 bg-rose-50/10 shadow-xs space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{client.fullName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">
                      DNI: {client.dni || 'Sin DNI'}
                    </span>
                    <span>Tel: {client.phone}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    client.status === 'parcial'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {client.status === 'parcial' ? 'Pago Parcial' : 'Con Deuda'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl">
                <span className="text-slate-500">Monto Pendiente:</span>
                <span className="font-black text-rose-600 text-sm">
                  ${client.pendingDebt.toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {currentList.length > pageSize && (
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 text-xs font-bold mt-3 shadow-xs">
          <span className="text-slate-500 text-[11px]">
            Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, currentList.length)} de {currentList.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700"
            >
              Anterior
            </button>
            <span className="px-1.5 text-slate-700 text-xs font-mono">
              {currentPage}/{totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
