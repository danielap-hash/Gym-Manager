import React, { useState } from 'react';
import { Client, Gym } from '../../types';
import { X, Printer, FileText, Building2, Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ImprimirEstadoCuentaModalProps {
  isOpen: boolean;
  onClose: () => void;
  gym: Gym;
  clients: Client[];
}

export const ImprimirEstadoCuentaModal: React.FC<ImprimirEstadoCuentaModalProps> = ({
  isOpen,
  onClose,
  gym,
  clients,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('all');

  if (!isOpen) return null;

  const displayClients =
    selectedClientId === 'all'
      ? clients
      : clients.filter((c) => c.id === selectedClientId);

  const totalMonthlyIncome = clients.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
  const totalPendingDebt = clients.reduce((sum, c) => sum + (c.pendingDebt || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 leading-tight">Estado de Cuenta e Informes</h2>
              <p className="text-xs text-slate-500">Vista de impresión y reporte oficial de cartera</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-2 shadow-xs shadow-blue-200"
            >
              <Printer className="w-4 h-4" />
              Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Print Hidden) */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Filtrar por Socio:</span>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">Todos los clientes ({clients.length})</option>
              {clients.map((cli) => (
                <option key={cli.id} value={cli.id}>
                  {cli.fullName} - ${cli.monthlyPrice.toLocaleString('es-CO')}
                </option>
              ))}
            </select>
          </div>
          <span className="text-slate-400 text-[11px]">
            {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Printable Statement Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-slate-900 space-y-6 print:p-0 print:overflow-visible font-sans">
          {/* Gym Header Branding */}
          <div className="flex items-start justify-between border-b pb-4 border-slate-200">
            <div className="flex items-center gap-3">
              {gym.logoUrl ? (
                <img src={gym.logoUrl} alt={gym.brandName || gym.name} className="w-14 h-14 object-contain" />
              ) : (
                <div
                  className="w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-sm"
                  style={{ backgroundColor: gym.primaryColor || '#2563eb' }}
                >
                  <Building2 className="w-6 h-6" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {gym.brandName || gym.name || 'TEMPLARIOS GYM'}
                </h1>
                <p className="text-xs text-slate-500">
                  Contacto: {gym.phone || 'S/D'} | {gym.email || 'S/D'}
                </p>
                <p className="text-xs text-slate-500">Admin: {gym.ownerName || 'Administrador'}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-[10px] uppercase font-bold tracking-wider">
                Estado de Cuenta
              </span>
              <p className="text-xs font-medium text-slate-500">
                Fecha: {new Date().toLocaleDateString('es-CO')}
              </p>
            </div>
          </div>

          {/* Summary Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Total Registros
              </span>
              <span className="text-base font-bold text-slate-900 block mt-0.5">
                {displayClients.length}
              </span>
            </div>
            <div className="p-3.5 bg-green-50/60 rounded-xl border border-green-200/70 text-center">
              <span className="text-[10px] uppercase tracking-wider text-green-700 font-bold block">
                Total Recaudado
              </span>
              <span className="text-base font-bold text-green-800 block mt-0.5">
                ${totalMonthlyIncome.toLocaleString('es-CO')}
              </span>
            </div>
            <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-200/70 text-center">
              <span className="text-[10px] uppercase tracking-wider text-red-700 font-bold block">
                Saldo Pendiente Total
              </span>
              <span className="text-base font-bold text-red-800 block mt-0.5">
                ${totalPendingDebt.toLocaleString('es-CO')}
              </span>
            </div>
          </div>

          {/* Client Statement Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Socio / Cliente</th>
                  <th className="py-2.5 px-3">Plan / Cat.</th>
                  <th className="py-2.5 px-3">Ingreso / Vencimiento</th>
                  <th className="py-2.5 px-3 text-right">Tarifa</th>
                  <th className="py-2.5 px-3 text-right">Abonado</th>
                  <th className="py-2.5 px-3 text-right">Deuda</th>
                  <th className="py-2.5 px-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-800">
                {displayClients.map((cli) => (
                  <tr key={cli.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{cli.fullName}</div>
                      <div className="text-[10px] text-slate-400">{cli.phone}</div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-600">{cli.category}</td>
                    <td className="py-2.5 px-3">
                      <div className="text-slate-700">{cli.joinDate}</div>
                      <div className="text-[10px] text-amber-700 font-semibold">Vence: {cli.dueDate}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold">
                      ${cli.monthlyPrice.toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-green-700">
                      ${cli.paidAmount.toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-red-700">
                      ${cli.pendingDebt.toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cli.status === 'al_dia'
                            ? 'bg-green-100 text-green-800'
                            : cli.status === 'atrasado'
                            ? 'bg-red-100 text-red-800'
                            : cli.status === 'parcial'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {cli.status === 'al_dia'
                          ? 'Al día'
                          : cli.status === 'atrasado'
                          ? 'Atrasado'
                          : cli.status === 'parcial'
                          ? 'Parcial'
                          : 'Próx. Vencer'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Report Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <p>Generado por Sistema de Gestión de Gimnasios - {gym.brandName || gym.name}</p>
            <p>Firma / Sello del Administrador: ______________________</p>
          </div>
        </div>
      </div>
    </div>
  );
};
