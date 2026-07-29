import React, { useState } from 'react';
import { Client, Expense } from '../../types';
import { 
  Download, Plus, TrendingUp, TrendingDown, DollarSign, 
  Calendar, AlertCircle, Trash2, X, Check, FileText 
} from 'lucide-react';

interface BalanceGastosProps {
  gymId: string;
  clients: Client[];
  expenses: Expense[];
  onUpdateExpenses: (expenses: Expense[]) => void;
}

export const BalanceGastos: React.FC<BalanceGastosProps> = ({
  gymId,
  clients,
  expenses,
  onUpdateExpenses,
}) => {
  const [activeTab, setActiveTab] = useState<'todos' | 'riesgo' | 'gastos'>('todos');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState<string>('Todos');

  // New Expense Modal State
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState<Expense['category']>('Servicios');
  const [expIsRecurring, setExpIsRecurring] = useState(false);

  // Calculations
  const currentGymExpenses = expenses.filter((e) => e.gymId === gymId);
  const currentGymClients = clients.filter((c) => c.gymId === gymId);

  const totalIncome = currentGymClients.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
  const totalExpensesSum = currentGymExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netUtility = totalIncome - totalExpensesSum;

  // Abandonment Risk Calculation
  const today = new Date();
  const soon7Days = currentGymClients.filter((c) => {
    const dueTime = new Date(c.dueDate).getTime();
    const diffDays = Math.ceil((dueTime - today.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const overdue30Days = currentGymClients.filter((c) => {
    const dueTime = new Date(c.dueDate).getTime();
    const diffDays = Math.ceil((today.getTime() - dueTime) / (1000 * 3600 * 24));
    return diffDays > 30 || c.status === 'atrasado';
  });

  // Filtered expenses
  const filteredExpenses = currentGymExpenses.filter((e) => {
    if (expenseCategoryFilter === 'Todos') return true;
    return e.category === expenseCategoryFilter;
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription || !expAmount) return;

    const newExpenseObj: Expense = {
      id: `exp_${Date.now()}`,
      gymId,
      description: expDescription,
      amount: Number(expAmount) || 0,
      category: expCategory,
      isRecurring: expIsRecurring,
      date: new Date().toISOString().split('T')[0],
    };

    onUpdateExpenses([newExpenseObj, ...expenses]);
    setIsAddExpenseOpen(false);
    setExpDescription('');
    setExpAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    onUpdateExpenses(expenses.filter((e) => e.id !== id));
  };

  const exportCSV = () => {
    const headers = 'ID,Descripcion,Monto,Categoria,Recurrente,Fecha\n';
    const rows = currentGymExpenses
      .map(
        (e) =>
          `"${e.id}","${e.description}",${e.amount},"${e.category}",${e.isRecurring},"${e.date}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gastos_balance.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-5 animate-in fade-in duration-150">
      {/* Title & CSV Export Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Balance & Gastos</h1>
        <button
          onClick={exportCSV}
          className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
          title="Exportar Reporte CSV"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Top Segmented Tabs */}
      <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-bold text-slate-700 border border-slate-200/60">
        <button
          onClick={() => setActiveTab('todos')}
          className={`flex-1 py-2 rounded-lg transition text-center ${
            activeTab === 'todos'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveTab('riesgo')}
          className={`flex-1 py-2 rounded-lg transition text-center ${
            activeTab === 'riesgo'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Riesgo de Abandono
        </button>
        <button
          onClick={() => setActiveTab('gastos')}
          className={`flex-1 py-2 rounded-lg transition text-center ${
            activeTab === 'gastos'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Gastos
        </button>
      </div>

      {/* TAB 1: TODOS (Balance General) */}
      {activeTab === 'todos' && (
        <div className="space-y-4">
          {/* Month Selector Pill */}
          <div className="flex justify-start">
            <span className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Julio 2026
            </span>
          </div>

          {/* Utilidad Neta Banner */}
          <div className="bg-white rounded-xl p-5 text-slate-900 border border-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Utilidad Neta (Ingresos - Gastos)
            </span>
            <div className="text-3xl font-bold tracking-tight text-green-700">
              ${netUtility.toLocaleString('es-CO')}
            </div>
            <p className="text-[11px] text-slate-500">
              Calculado automáticamente según ingresos por clientes y gastos operativos registrados.
            </p>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-green-800 font-bold text-xs">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Ingresos Total</span>
              </div>
              <p className="text-xl font-bold text-slate-900">
                ${totalIncome.toLocaleString('es-CO')}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-red-800 font-bold text-xs">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Gastos Total</span>
              </div>
              <p className="text-xl font-bold text-slate-900">
                ${totalExpensesSum.toLocaleString('es-CO')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RIESGO DE ABANDONO */}
      {activeTab === 'riesgo' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>Análisis de Retención de Clientes</span>
            </div>
            <p className="text-xs text-amber-800">
              Identifica a los clientes próximos a vencer o en mora prolongada para enviar recordatorios antes de que abandonen el gimnasio.
            </p>
          </div>

          {/* Próximos 7 días */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Próximos a Vencer (7 días)</h3>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
                {soon7Days.length} Clientes
              </span>
            </div>

            {soon7Days.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center">
                Sin clientes próximos a vencer en los siguientes 7 días.
              </p>
            ) : (
              soon7Days.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                  <div>
                    <span className="font-bold text-slate-800 block">{c.fullName}</span>
                    <span className="text-slate-400 text-[10px]">Vence: {c.dueDate}</span>
                  </div>
                  <span className="font-mono text-slate-700 font-semibold">${c.monthlyPrice.toLocaleString('es-CO')}</span>
                </div>
              ))
            )}
          </div>

          {/* En mora (>30 días) */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">En Mora Prolonagda</h3>
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full">
                {overdue30Days.length} Clientes
              </span>
            </div>

            {overdue30Days.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center">
                ¡Excelente! Sin clientes con retrasos mayores a 30 días.
              </p>
            ) : (
              overdue30Days.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                  <div>
                    <span className="font-bold text-rose-900 block">{c.fullName}</span>
                    <span className="text-slate-400 text-[10px]">Venció: {c.dueDate}</span>
                  </div>
                  <span className="font-mono text-rose-600 font-bold">${c.pendingDebt.toLocaleString('es-CO')}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: GASTOS */}
      {activeTab === 'gastos' && (
        <div className="space-y-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            {['Todos', 'Servicios', 'Renta', 'Suministros', 'Nómina', 'Otros'].map((cat) => (
              <button
                key={cat}
                onClick={() => setExpenseCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
                  expenseCategoryFilter === cat
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Expense Items List */}
          {filteredExpenses.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-2 my-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No hay gastos registrados</p>
              <p className="text-xs text-slate-400">Presiona el botón + para añadir un nuevo gasto de tu gimnasio.</p>
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] bg-slate-100 font-bold text-slate-700 px-2 py-0.5 rounded-md mb-1 inline-block">
                    {exp.category} {exp.isRecurring ? '• Recurrente' : ''}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{exp.description}</h4>
                  <span className="text-[10px] text-slate-400">{exp.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-rose-600 text-sm">
                    -${exp.amount.toLocaleString('es-CO')}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Floating Red Action Button (+) */}
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="fixed bottom-20 right-4 w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-rose-600 active:scale-95 transition z-30"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Modal Sheet: Nuevo Gasto */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Registrar Nuevo Gasto</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción del Gasto *</label>
                <input
                  type="text"
                  required
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  placeholder="ej: Pago de luz / Mantenimiento pesas"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monto ($) *</label>
                <input
                  type="number"
                  required
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  placeholder="ej: 180.000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Servicios">Servicios (Luz, agua, internet)</option>
                  <option value="Renta">Renta del local</option>
                  <option value="Suministros">Suministros y limpieza</option>
                  <option value="Nómina">Nómina / Instructores</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700">¿Es un gasto recurrente mensual?</span>
                <input
                  type="checkbox"
                  checked={expIsRecurring}
                  onChange={(e) => setExpIsRecurring(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                <Check className="w-4 h-4" />
                Guardar Gasto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
