import React, { useState } from 'react';
import { Gym, ActiveUser, SuperAdminProfile } from '../../types';
import { getSuperAdminProfile, saveSuperAdminProfile } from '../../utils/storage';
import { EditarPerfilSuperAdminModal } from './EditarPerfilSuperAdminModal';
import { 
  Building2, Plus, Search, Shield, DollarSign, CheckCircle2, 
  AlertTriangle, Key, Edit2, Eye, Calendar, UserPlus, Phone, 
  Mail, Lock, RefreshCw, X, CreditCard, ChevronRight, UserCog, LogOut
} from 'lucide-react';

interface SuperAdminViewProps {
  gyms: Gym[];
  onUpdateGyms: (gyms: Gym[]) => void;
  onSelectUser: (user: ActiveUser) => void;
  activeUser?: ActiveUser;
  onUpdateActiveUser?: (user: ActiveUser) => void;
  onLogout?: () => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  gyms,
  onUpdateGyms,
  onSelectUser,
  activeUser,
  onUpdateActiveUser,
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_payment' | 'suspended'>('all');
  
  // SuperAdmin Profile State
  const [saProfile, setSaProfile] = useState<SuperAdminProfile>(getSuperAdminProfile());
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGym, setEditingGym] = useState<Gym | null>(null);
  const [paymentGym, setPaymentGym] = useState<Gym | null>(null);

  // New Gym Form State
  const [newGymName, setNewGymName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFee, setNewFee] = useState('150000');
  const [newDueDate, setNewDueDate] = useState('2026-08-30');

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia');
  const [paymentNote, setPaymentNote] = useState('');

  // Stats
  const totalGyms = gyms.length;
  const activeGyms = gyms.filter((g) => g.status === 'active').length;
  const pendingGyms = gyms.filter((g) => g.status === 'pending_payment').length;
  const totalMonthlyIncome = gyms.reduce((sum, g) => sum + Number(g.subscriptionFee || 0), 0);

  // Filtered list
  const filteredGyms = gyms.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && g.status === statusFilter;
  });

  const handleCreateGym = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGymName || !newUsername || !newPassword) return;

    const createdGym: Gym = {
      id: `gym_${Date.now()}`,
      name: newGymName,
      ownerName: newOwnerName || 'Encargado',
      email: newEmail,
      phone: newPhone,
      username: newUsername,
      password: newPassword,
      subscriptionFee: Number(newFee) || 150000,
      nextDueDate: newDueDate || '2026-08-30',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      paymentHistory: [
        {
          id: `gp_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: Number(newFee) || 150000,
          method: 'Efectivo/Alta',
          note: 'Cuota de activación',
        },
      ],
    };

    onUpdateGyms([...gyms, createdGym]);
    setIsAddModalOpen(false);
    resetNewGymForm();
  };

  const resetNewGymForm = () => {
    setNewGymName('');
    setNewOwnerName('');
    setNewEmail('');
    setNewPhone('');
    setNewUsername('');
    setNewPassword('');
    setNewFee('150000');
    setNewDueDate('2026-08-30');
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGym) return;

    const updated = gyms.map((g) =>
      g.id === editingGym.id ? editingGym : g
    );
    onUpdateGyms(updated);
    setEditingGym(null);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentGym || !paymentAmount) return;

    const payAmount = Number(paymentAmount);
    // Add 1 month to due date
    const currentDue = new Date(paymentGym.nextDueDate);
    currentDue.setMonth(currentDue.getMonth() + 1);
    const newDueDateStr = currentDue.toISOString().split('T')[0];

    const updatedGyms = gyms.map((g) => {
      if (g.id === paymentGym.id) {
        return {
          ...g,
          status: 'active' as const,
          nextDueDate: newDueDateStr,
          paymentHistory: [
            {
              id: `gp_${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              amount: payAmount,
              method: paymentMethod,
              note: paymentNote || 'Pago mensualidad gimnasio',
            },
            ...g.paymentHistory,
          ],
        };
      }
      return g;
    });

    onUpdateGyms(updatedGyms);
    setPaymentGym(null);
    setPaymentAmount('');
    setPaymentNote('');
  };

  const toggleStatus = (gymId: string) => {
    const updated = gyms.map((g) => {
      if (g.id === gymId) {
        const nextStatus = g.status === 'suspended' ? 'active' : 'suspended';
        return { ...g, status: nextStatus as Gym['status'] };
      }
      return g;
    });
    onUpdateGyms(updated);
  };

  const handleSaveProfile = (updatedProfile: SuperAdminProfile) => {
    setSaProfile(updatedProfile);
    saveSuperAdminProfile(updatedProfile);

    if (activeUser && onUpdateActiveUser && activeUser.role === 'superadmin') {
      onUpdateActiveUser({
        ...activeUser,
        username: updatedProfile.username,
        name: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        avatarUrl: updatedProfile.avatarUrl,
        password: updatedProfile.password,
      });
    }
  };

  return (
    <div className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-5">
      {/* SuperAdmin Profile Header Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-md border border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            {saProfile.avatarUrl ? (
              <img
                src={saProfile.avatarUrl}
                alt={saProfile.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-inner ring-2 ring-amber-300">
                <Shield className="w-6 h-6 text-slate-950" />
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Sesión activa"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm leading-tight text-white truncate">{saProfile.name || 'Súper Administrador'}</h2>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                Súper Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono truncate">
              @{saProfile.username} {saProfile.email ? `• ${saProfile.email}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-amber-500/20 shrink-0"
          >
            <UserCog className="w-4 h-4" />
            <span className="hidden sm:inline">Editar Perfil</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-2 bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-700 shrink-0"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4 text-rose-400 group-hover:text-white" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 text-slate-900 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200/60">
              Superadmin Console
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-sm shadow-blue-200 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nuevo Gym
            </button>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Gestión de Gimnasios</h2>
          <p className="text-xs text-slate-500 mt-1">
            Asigna usuarios, contraseñas y gestiona licencias y pagos.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Gimnasios</span>
              <p className="text-xl font-bold text-slate-900">{totalGyms}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Al día</span>
              <p className="text-xl font-bold text-green-700">{activeGyms}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Pendientes</span>
              <p className="text-xl font-bold text-amber-700">{pendingGyms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por gimnasio, dueño o usuario..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 shadow-xs"
          />
        </div>

        <div className="flex gap-2 text-xs font-semibold overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Todos ({gyms.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              statusFilter === 'active'
                ? 'bg-green-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Al día ({activeGyms})
          </button>
          <button
            onClick={() => setStatusFilter('pending_payment')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
              statusFilter === 'pending_payment'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Pendientes ({pendingGyms})
          </button>
        </div>
      </div>

      {/* Gym List */}
      <div>
        {filteredGyms.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No se encontraron gimnasios</p>
            <p className="text-xs text-slate-400">Intenta cambiar los términos de búsqueda o registra uno nuevo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGyms.map((gym) => {
              const isSuspended = gym.status === 'suspended';
              const isPending = gym.status === 'pending_payment';

              return (
                <div
                  key={gym.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition shadow-xs space-y-3.5 flex flex-col justify-between ${
                    isSuspended
                      ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 opacity-80'
                      : isPending
                      ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">{gym.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">Dueño: {gym.ownerName}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      isSuspended
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : isPending
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}
                  >
                    {isSuspended ? 'Suspendido' : isPending ? 'Pago Pendiente' : 'Al día'}
                  </span>
                </div>

                {/* Credentials Box */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-blue-600" />
                      Credenciales de Ingreso:
                    </span>
                    <button
                      onClick={() => setEditingGym(gym)}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5 text-[11px]"
                    >
                      <Edit2 className="w-3 h-3" />
                      Editar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div className="bg-white p-2 rounded-md border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Usuario</span>
                      <span className="font-mono font-bold text-slate-900">{gym.username}</span>
                    </div>
                    <div className="bg-white p-2 rounded-md border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Contraseña</span>
                      <span className="font-mono font-bold text-slate-900">{gym.password || '••••••'}</span>
                    </div>
                  </div>
                </div>

                {/* Subscription Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Cuota Mensual</span>
                      <span className="font-bold text-slate-900">${gym.subscriptionFee.toLocaleString('es-CO')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Próximo Vencimiento</span>
                      <span className="font-bold text-slate-900">{gym.nextDueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setPaymentGym(gym);
                      setPaymentAmount(String(gym.subscriptionFee));
                    }}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Registrar Pago
                  </button>

                  <button
                    onClick={() =>
                      onSelectUser({
                        role: 'gym_admin',
                        gymId: gym.id,
                        username: gym.username,
                        gymName: gym.name,
                      })
                    }
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                    title="Simular vista de este gimnasio"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ver Gym
                  </button>

                  <button
                    onClick={() => toggleStatus(gym.id)}
                    className={`p-2 rounded-lg border text-xs transition ${
                      isSuspended
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    }`}
                    title={isSuspended ? 'Activar Gimnasio' : 'Suspender Gimnasio'}
                  >
                    {isSuspended ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>

      {/* Modal: New Gym Registration */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Registrar Nuevo Gimnasio</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGym} className="p-4 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre del Gimnasio *</label>
                <input
                  type="text"
                  required
                  value={newGymName}
                  onChange={(e) => setNewGymName(e.target.value)}
                  placeholder="ej: Olimpo Fitness Club"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre del Propietario / Encargado</label>
                <input
                  type="text"
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  placeholder="ej: Carlos Mendoza"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="contacto@gym.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+57300..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <span className="font-bold text-amber-800 block text-xs flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  Asignación de Credenciales de Acceso
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Usuario *</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="admin_olimpo"
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contraseña *</label>
                    <input
                      type="text"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="olimpo123"
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cuota Suscripción ($)</label>
                  <input
                    type="number"
                    value={newFee}
                    onChange={(e) => setNewFee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Próximo Vencimiento</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-md transition text-xs flex items-center justify-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4" />
                Crear Gimnasio y Dar Credenciales
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Credentials */}
      {editingGym && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Editar Credenciales</h3>
              <button onClick={() => setEditingGym(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Gimnasio: <strong className="text-slate-800">{editingGym.name}</strong>
            </p>

            <form onSubmit={handleSaveCredentials} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Usuario de Ingreso</label>
                <input
                  type="text"
                  required
                  value={editingGym.username}
                  onChange={(e) => setEditingGym({ ...editingGym, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contraseña</label>
                <input
                  type="text"
                  required
                  value={editingGym.password || ''}
                  onChange={(e) => setEditingGym({ ...editingGym, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cuota de Suscripción ($)</label>
                <input
                  type="number"
                  value={editingGym.subscriptionFee}
                  onChange={(e) => setEditingGym({ ...editingGym, subscriptionFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow transition mt-2"
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Gym Subscription Payment */}
      {paymentGym && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Registrar Pago de Membresía</h3>
              <button onClick={() => setPaymentGym(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-800">
              Registra el pago recibido de <strong>{paymentGym.name}</strong> para extender automáticamente su servicio por 1 mes.
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monto Recibido ($)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Método de Pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Transferencia">Transferencia Bancaria / Nequi / Daviplata</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nota o Comprobante (Opcional)</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="ej: Nro comprobante 84920"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar Pago y Extender Suscripción
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Editar Perfil SuperAdmin Modal */}
      <EditarPerfilSuperAdminModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={saProfile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
};
