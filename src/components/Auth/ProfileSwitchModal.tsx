import React, { useState, useEffect } from 'react';
import { Gym, ActiveUser } from '../../types';
import { getSuperAdminProfile } from '../../utils/storage';
import { 
  Dumbbell, X, Lock, KeyRound, Eye, EyeOff, LogOut, 
  BookOpen, Users, CreditCard, MessageSquare, BarChart3, 
  Printer, ShieldCheck, ChevronRight, Sparkles, Database, PhoneCall
} from 'lucide-react';

interface ProfileSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  gyms: Gym[];
  activeUser: ActiveUser;
  onSelectUser: (user: ActiveUser) => void;
  onLogout?: () => void;
  isFullScreen?: boolean;
}

export const ProfileSwitchModal: React.FC<ProfileSwitchModalProps> = ({
  isOpen,
  onClose,
  gyms,
  activeUser,
  onSelectUser,
  onLogout,
  isFullScreen = false,
}) => {
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoginError('');
      setInputUsername('');
      setInputPassword('');
      setShowPassword(false);
      setShowGuide(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const saProfile = getSuperAdminProfile();
    const cleanUsername = inputUsername.trim().toLowerCase();
    const isSuperAdminUser = cleanUsername === saProfile.username.toLowerCase();
    const isSuperAdminPass = inputPassword === (saProfile.password || 'super123');

    // Fallback default check if not changed
    const isDefaultSuperAdmin = cleanUsername === 'superadmin' && inputPassword === 'super123';

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
      (g) => g.username.toLowerCase() === cleanUsername && g.password === inputPassword
    );

    if (matchedGym) {
      if (matchedGym.status === 'suspended') {
        setLoginError('Este gimnasio se encuentra suspendido. Contacte al Administrador.');
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

  const isLoggedIn = Boolean(activeUser.username);

  const cardContent = (
    <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 relative">
      <div className="bg-white p-5 border-b border-slate-200 text-slate-900 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg leading-tight text-slate-900">
            {isLoggedIn ? 'Perfil y Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="text-xs text-slate-500">
            {isLoggedIn ? 'Sesión iniciada' : 'Ingrese sus datos para acceder al sistema'}
          </p>
        </div>
        {isLoggedIn && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
        {/* Guia de Uso Quick Banner Link */}
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          className="w-full p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/80 rounded-xl transition flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-900 block group-hover:text-blue-700">
                Guía de Uso para Gimnasios
              </span>
              <span className="text-[11px] text-blue-600/80 block">
                Conoce todas las funciones del sistema
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {!isLoggedIn && (
          <form onSubmit={handleCustomLogin} className="space-y-4 py-1">
            <div className="text-center mb-1">
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center mb-2">
                <KeyRound className="w-5 h-5 text-slate-700" />
              </div>
              <p className="text-sm font-bold text-slate-800">Acceso al Sistema</p>
              <p className="text-xs text-slate-500">Ingresa tu usuario y contraseña asignada</p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium leading-relaxed">
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
                placeholder="ej: admin_fit"
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
        {isLoggedIn && onLogout && (
          <div className="pt-3 border-t border-slate-200 mt-2 flex items-center justify-between bg-slate-50 p-3 rounded-xl">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sesión Activa</span>
              <span className="text-xs font-bold text-slate-800 truncate block">
                {activeUser.gymName || activeUser.username}
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

      {/* Modal Guia de Uso */}
      {showGuide && (
        <div className="absolute inset-0 bg-white z-20 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight text-white">Guía de Uso del Sistema</h3>
                <p className="text-[10px] text-slate-300">Manual de funcionalidades para Gimnasios</p>
              </div>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed flex-1">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
              <p className="font-bold text-blue-900 text-xs mb-1">🏋️ Bienvenido a GymOS</p>
              <p className="text-blue-800 text-[11px]">
                Plataforma integral para administrar socios, modalidades de pago, llamadas de emergencia SOS, asistencias, finanzas y asistencia con Inteligencia Artificial.
              </p>
            </div>

            {/* Feature 1 */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Users className="w-4 h-4 text-blue-600" />
                <span>1. Registro y Control de Socios</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                <li><strong>Ficha Completa:</strong> Nombre, DNI, teléfono, foto, alertas médicas y contacto de emergencia.</li>
                <li><strong>Llamada de Emergencia SOS:</strong> Botón de llamada directa (<PhoneCall className="w-3 h-3 inline text-rose-600" />) para comunicarse al instante con el contacto del alumno ante cualquier eventualidad.</li>
                <li><strong>Control por Semáforo:</strong> Indicador visual inmediato de estado: <span className="text-emerald-700 font-bold">Al Día</span>, <span className="text-amber-700 font-bold">Próximo a Vencer</span> (5 días) y <span className="text-rose-700 font-bold">Atrasado/Vencido</span>.</li>
                <li><strong>Asistencias Diarias:</strong> Registro rápido de ingreso del socio con un solo toque.</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>2. Modalidades de Pago y Cobro</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                <li><strong>Frecuencias de Cobro:</strong> Opciones flexibles de membresía: <strong>Semanal</strong>, <strong>Quincenal</strong>, <strong>Mensual</strong> y <strong>Anual</strong>.</li>
                <li><strong>Renovación Express:</strong> Registra cobros al instante seleccionando efectivo, transferencia o tarjeta.</li>
                <li><strong>Comprobantes e Impresión:</strong> Emisión de recibos de pago y tickets optimizados para impresora térmica o descarga en PDF.</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>3. Asistente de Inteligencia Artificial (GymOS AI)</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                <li><strong>Diseño de Rutinas:</strong> Generación automática de planes de entrenamiento por días u objetivos (hipertrofia, pérdida de grasa, fuerza).</li>
                <li><strong>Asesoría Técnica y Nutrición:</strong> Consultas sobre musculación, suplementación y biomecánica deportiva.</li>
                <li><strong>Generador de Textos:</strong> Redacción de mensajes de cobro amigables y campañas promocionales para redes sociales.</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span>4. Notificaciones por WhatsApp</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                <li><strong>Envío con 1 Clic:</strong> Notifica cuotas vencidas o cobros pendientes directamente a WhatsApp.</li>
                <li><strong>Plantillas Editables:</strong> Personaliza los textos automáticos con etiquetas de nombre, monto y vencimiento.</li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span>5. Balance Financiero y Gastos</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                <li><strong>Control de Salidas:</strong> Registra egresos operativos (compras de insumos, servicios, mantenimiento).</li>
                <li><strong>Balance Neto:</strong> Visualización gráfica en tiempo real de ingresos acumulados vs. gastos totales.</li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>6. Respaldos y Configuración de Sede</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                <li><strong>Copias de Seguridad:</strong> Exporta e importa la información en formato JSON para resguardo total.</li>
                <li><strong>Personalización de Marca:</strong> Modifica el logo, nombre comercial y colores representativos de tu gimnasio.</li>
              </ul>
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
            >
              Entendido, volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isFullScreen) {
    return cardContent;
  }

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      {cardContent}
    </div>
  );
};
