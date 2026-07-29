import React, { useState } from 'react';
import { Client, WhatsAppConfig } from '../../types';
import { 
  ArrowLeft, Search, Filter, ArrowUpDown, User, UserPlus, 
  MessageCircle, CreditCard, ChevronRight, Download, X, 
  Check, Phone, AlertCircle, Edit3, Trash2, Calendar, DollarSign
} from 'lucide-react';

interface PanelControlClientesProps {
  clients: Client[];
  waConfig: WhatsAppConfig;
  onUpdateClients: (clients: Client[]) => void;
  onNavigateTo: (screen: 'principal' | 'panel' | 'estado' | 'registrar' | 'balance' | 'ajustes') => void;
  onEditClient: (client: Client) => void;
}

export type SortOption = 
  | 'name_asc' 
  | 'name_desc' 
  | 'due_closest' 
  | 'due_farthest' 
  | 'debt_lowest' 
  | 'debt_highest';

export const PanelControlClientes: React.FC<PanelControlClientesProps> = ({
  clients,
  waConfig,
  onUpdateClients,
  onNavigateTo,
  onEditClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'due_today' | 'due_soon'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name_asc');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Payment Modal
  const [paymentClient, setPaymentClient] = useState<Client | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payConcept, setPayConcept] = useState('Mensualidad');

  // Stats
  const totalCount = clients.length;
  const alDiaCount = clients.filter((c) => c.status === 'al_dia').length;
  const pendientesCount = clients.filter((c) => c.status !== 'al_dia').length;

  // Filter & Sort logic
  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      c.fullName.toLowerCase().includes(term) ||
      (c.dni && c.dni.toLowerCase().includes(term)) ||
      c.phone.includes(term) ||
      c.category.toLowerCase().includes(term);

    if (filterType === 'due_today') {
      const todayStr = new Date().toISOString().split('T')[0];
      return matchesSearch && c.dueDate === todayStr;
    }

    if (filterType === 'due_soon') {
      return matchesSearch && (c.status === 'proximo_vencer' || c.status === 'atrasado');
    }

    return matchesSearch;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortOption === 'name_asc') return a.fullName.localeCompare(b.fullName);
    if (sortOption === 'name_desc') return b.fullName.localeCompare(a.fullName);
    if (sortOption === 'due_closest') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (sortOption === 'due_farthest') return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    if (sortOption === 'debt_lowest') return a.pendingDebt - b.pendingDebt;
    if (sortOption === 'debt_highest') return b.pendingDebt - a.pendingDebt;
    return 0;
  });

  const totalPages = Math.ceil(sortedClients.length / pageSize) || 1;
  const paginatedClients = sortedClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentClient || !payAmount) return;

    const amountNum = Number(payAmount);
    const newDebt = Math.max(0, paymentClient.pendingDebt - amountNum);
    const newPaid = paymentClient.paidAmount + amountNum;

    // Extend due date by 1 month if fully paid
    let newDueDate = paymentClient.dueDate;
    if (newDebt === 0) {
      const currentDue = new Date(paymentClient.dueDate);
      currentDue.setMonth(currentDue.getMonth() + 1);
      newDueDate = currentDue.toISOString().split('T')[0];
    }

    const newStatus: Client['status'] = newDebt === 0 ? 'al_dia' : 'parcial';

    const updatedList = clients.map((c) => {
      if (c.id === paymentClient.id) {
        return {
          ...c,
          paidAmount: newPaid,
          pendingDebt: newDebt,
          dueDate: newDueDate,
          status: newStatus,
          paymentHistory: [
            {
              id: `cp_${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              amount: amountNum,
              concept: payConcept || 'Pago recibido',
            },
            ...c.paymentHistory,
          ],
        };
      }
      return c;
    });

    onUpdateClients(updatedList);
    setPaymentClient(null);
    setPayAmount('');
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      onUpdateClients(clients.filter((c) => c.id !== clientId));
    }
  };

  const handleSendWhatsApp = (client: Client) => {
    const rawTemplate = waConfig.templates.cobro || 'Hola {nombre}, tienes un saldo pendiente de ${deuda}. Fecha: {fecha}.';
    const message = rawTemplate
      .replace('{nombre}', client.fullName)
      .replace('{deuda}', client.pendingDebt.toLocaleString('es-CO'))
      .replace('{fecha}', client.dueDate);

    const cleanPhone = client.phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const exportCSV = () => {
    const headers = 'ID,Nombre,Telefono,MontoMensual,Abono,Deuda,FechaVencimiento,Estado,Categoria\n';
    const rows = clients
      .map(
        (c) =>
          `"${c.id}","${c.fullName}","${c.phone}",${c.monthlyPrice},${c.paidAmount},${c.pendingDebt},"${c.dueDate}","${c.status}","${c.category}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'clientes_gimnasio.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 space-y-4 animate-in fade-in duration-150">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateTo('principal')}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Panel de Control</h1>
        <div className="w-10"></div>
      </div>

      {/* Counter Pills */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl text-center border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Total</span>
          <span className="text-base font-black text-slate-900 dark:text-white block">{totalCount}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl text-center border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Al día</span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block">{alDiaCount}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl text-center border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">Pendientes</span>
          <span className="text-base font-black text-rose-600 dark:text-rose-400 block">{pendientesCount}</span>
        </div>
      </div>

      {/* Mis Clientes Header + Sort/CSV Actions */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-xl font-bold text-slate-900">Mis Clientes</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
            title="Exportar CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSortModalOpen(true)}
            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors flex items-center justify-center"
            title="Ordenar clientes"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
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
        {searchTerm ? (
          <button
            onClick={() => {
              setSearchTerm('');
              setCurrentPage(1);
            }}
            className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        )}
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
        <button
          onClick={() => {
            setFilterType('all');
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-lg transition-colors shrink-0 ${
            filterType === 'all'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todos ({totalCount})
        </button>
        <button
          onClick={() => {
            setFilterType('due_today');
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-lg transition-colors shrink-0 ${
            filterType === 'due_today'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Vence hoy
        </button>
        <button
          onClick={() => {
            setFilterType('due_soon');
            setCurrentPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-lg transition-colors shrink-0 ${
            filterType === 'due_soon'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Próximos a vencer
        </button>
      </div>

      {/* Clients List or Empty State */}
      <div>
        {sortedClients.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-4 my-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                No hay nada aquí todavía. ¡Es hora de añadir tu primer registro!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Presiona el botón + para agregar tu primer cliente
              </p>
            </div>
            <button
              onClick={() => onNavigateTo('registrar')}
              className="py-3 px-6 bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow hover:bg-emerald-600 transition inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Agregar Cliente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {paginatedClients.map((client) => {
              const isOverdue = client.status === 'atrasado';
              const isParcial = client.status === 'parcial';
              const isSoon = client.status === 'proximo_vencer';

              return (
                <div
                  key={client.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center shrink-0 text-base">
                        {client.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{client.fullName}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 px-2 py-0.5 rounded-md font-mono font-bold text-[10px]">
                            DNI: {client.dni || 'Sin DNI'}
                          </span>
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            {client.category}
                          </span>
                          <span className="text-[11px] font-medium">{client.phone}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                        isOverdue
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : isParcial
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : isSoon
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {isOverdue
                        ? 'Atrasado'
                        : isParcial
                        ? 'Pago Parcial'
                        : isSoon
                        ? 'Próximo a Vencer'
                        : 'Al día'}
                    </span>
                  </div>

                  {/* Details Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">Vencimiento</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{client.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">Deuda Pendiente</span>
                      <span className={`font-bold ${client.pendingDebt > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        ${client.pendingDebt.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>

                {/* Actions */}
                <div className="pt-1 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => handleSendWhatsApp(client)}
                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center gap-1 text-xs font-semibold"
                    title="Enviar WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      setPaymentClient(client);
                      setPayAmount(String(client.pendingDebt || client.monthlyPrice));
                    }}
                    className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1 text-xs font-bold"
                  >
                    <CreditCard className="w-4 h-4" />
                    Cobrar
                  </button>

                  <button
                    onClick={() => onEditClient(client)}
                    className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                    title="Ver/Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {sortedClients.length > pageSize && (
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 text-xs font-bold mt-3 shadow-xs">
          <span className="text-slate-500 text-[11px]">
            Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedClients.length)} de {sortedClients.length} socios
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition text-slate-700"
            >
              Anterior
            </button>
            <span className="px-2 text-slate-700 text-xs font-mono">
              {currentPage}/{totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition text-slate-700"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button (+) */}
      <button
        onClick={() => onNavigateTo('registrar')}
        className="fixed bottom-20 right-4 w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-600 active:scale-95 transition z-30"
      >
        <UserPlus className="w-6 h-6" />
      </button>

      {/* Sort Bottom Sheet Modal (Exact match for Screenshot 1) */}
      {isSortModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl max-w-md w-full p-6 space-y-5 animate-in slide-in-from-bottom duration-200 shadow-2xl">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto"></div>

            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Ordenar clientes</h3>
              <button
                onClick={() => setIsSortModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-1 text-sm font-semibold">
              {[
                { id: 'name_asc', label: 'Nombre (A-Z)', sub: 'Alphabetically ascending' },
                { id: 'name_desc', label: 'Nombre (Z-A)', sub: 'Alphabetically descending' },
                { id: 'due_closest', label: 'Próximo pago (cercano)', sub: 'Closest due dates first' },
                { id: 'due_farthest', label: 'Próximo pago (lejano)', sub: 'Farthest due dates first' },
                { id: 'debt_lowest', label: 'Menor deuda', sub: 'Clients with less pending debt' },
                { id: 'debt_highest', label: 'Mayor deuda', sub: 'Clients with more pending debt' },
              ].map((opt) => {
                const isSelected = sortOption === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => {
                      setSortOption(opt.id as SortOption);
                      setIsSortModalOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition ${
                      isSelected ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold block text-sm leading-tight text-slate-900">{opt.label}</span>
                      <span className="text-xs text-slate-400 font-normal">{opt.sub}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Payment Record Modal */}
      {paymentClient && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Registrar Pago</h3>
              <button onClick={() => setPaymentClient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Cliente: <strong className="text-slate-900">{paymentClient.fullName}</strong>
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monto de Pago ($)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Concepto</label>
                <input
                  type="text"
                  value={payConcept}
                  onChange={(e) => setPayConcept(e.target.value)}
                  placeholder="ej: Mensualidad Agosto"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                <Check className="w-4 h-4" />
                Confirmar Pago
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
