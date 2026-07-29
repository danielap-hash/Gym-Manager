import React, { useState, useEffect } from 'react';
import { Gym, ActiveUser } from '../../types';
import { getSuperAdminProfile } from '../../utils/storage';
import { Shield, Dumbbell, X, Lock, CheckCircle, ArrowRight, KeyRound, Eye, EyeOff, LogOut } from 'lucide-react';

interface ProfileSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  gyms: Gym[];
  activeUser: ActiveUser;
  onSelectUser: (user: ActiveUser) => void;
  onLogout?: () => void;
}

export const ProfileSwitchModal: React.FC<ProfileSwitchModalProps> = ({
  isOpen,
  onClose,
  gyms,
  activeUser,
  onSelectUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'login'>('login');
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (activeUser.role === 'superadmin') {
        setActiveTab('quick');
      } else {
        setActiveTab('login');
      }
      setLoginError('');
      setInputUsername('');
      setInputPassword('');
      setShowPassword(false);
    }
  }, [isOpen, activeUser.role]);

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const saProfile = getSuperAdminProfile();
    const isSuperAdminUser = inputUsername.trim().toLowerCase() === saProfile.username.toLowerCase();
    const isSuperAdminPass = inputPassword === (saProfile.password || 'super123');

    // Fallback default check if not changed
    const isDefaultSuperAdmin = inputUsername.trim() === 'superadmin' && inputPassword === 'super123';

    // Check superadmin
    if ((isSuperAdminUser && isSuperAdminPass) || isDefaultSuperAdmin) {
      onSelectUser({
        role: 'superadmin',
        username: saProfile.username,
        name: saProfile.name,
        email: saProfile.email,
        phone: saProfile.phone,
        avatarUrl: saProfile.avatarUrl,
        password: saProfile.password,
        gymName: 'Súper Administración',
      });
      onClose();
      return;
    }

    // Check gym admins
    const matchedGym = gyms.find(
      (g) => g.username === inputUsername && g.password === inputPassword
    );

    if (matchedGym) {
      if (matchedGym.status === 'suspended') {
        setLoginError('Este gimnasio se encuentra suspendido. Contacte al Súper Administrador.');
        return;
      }
      onSelectUser({
        role: 'gym_admin',
        gymId: matchedGym.id,
        username: matchedGym.username,
        gymName: matchedGym.name,
      });
      onClose();
      return;
    }

    setLoginError('Usuario o contraseña incorrectos.');
  };

  const isSuperAdmin = activeUser.role === 'superadmin';

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full overflow-hidden shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-white p-5 border-b border-slate-200 text-slate-900 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg leading-tight">
              {isSuperAdmin ? 'Perfil y Roles' : 'Iniciar Sesión'}
            </h2>
            <p className="text-xs text-slate-500">
              {isSuperAdmin ? 'Gestión de accesos de sede' : 'Ingrese sus datos para acceder al sistema'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation ONLY visible inside Super Administrator */}
        {isSuperAdmin && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                activeTab === 'quick'
                  ? 'border-blue-600 text-blue-700 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Acceso Rápido Demo
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                activeTab === 'login'
                  ? 'border-blue-600 text-blue-700 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Ingreso con Clave
            </button>
          </div>
        )}

        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          {isSuperAdmin && activeTab === 'quick' ? (
            <>
              {/* Super Admin option */}
              <div
                onClick={() => {
                  onSelectUser({
                    role: 'superadmin',
                    username: 'superadmin',
                    gymName: 'Súper Administración',
                  });
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  activeUser.role === 'superadmin'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Súper Administrador
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">Control de Todos los Gyms</p>
                    <p className="text-xs text-amber-800 font-mono font-medium">Credenciales: superadmin / super123</p>
                  </div>
                </div>
                {activeUser.role === 'superadmin' ? (
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 font-medium">Gimnasios Registrados</span>
                </div>
              </div>

              {/* Gym Admins */}
              <div className="space-y-2.5">
                {gyms.map((gym) => {
                  const isSelected =
                    activeUser.role === 'gym_admin' && activeUser.gymId === gym.id;

                  return (
                    <div
                      key={gym.id}
                      onClick={() => {
                        onSelectUser({
                          role: 'gym_admin',
                          gymId: gym.id,
                          username: gym.username,
                          gymName: gym.name,
                        });
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900">{gym.name}</p>
                            {gym.status === 'suspended' && (
                              <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                                Suspendido
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            Usuario: <span className="font-mono text-slate-700">{gym.username}</span> | Clave: <span className="font-mono text-slate-700">{gym.password}</span>
                          </p>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-4 py-2">
              <div className="text-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">Inicia Sesión con tus Datos</p>
                <p className="text-xs text-slate-500">Ingresa tu usuario y contraseña asignada</p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Usuario</label>
                <input
                  type="text"
                  required
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="ej: TEMPLARIOS"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 flex items-center justify-center"
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-xs shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Ingresar
              </button>
            </form>
          )}

          {/* Active Session Logout Option */}
          {activeUser.username && onLogout && (
            <div className="pt-3 border-t border-slate-200 mt-2 flex items-center justify-between bg-slate-50 p-3 rounded-xl">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sesión Activa</span>
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {isSuperAdmin ? 'Súper Administrador' : (activeUser.gymName || activeUser.username)}
                </span>
              </div>
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
